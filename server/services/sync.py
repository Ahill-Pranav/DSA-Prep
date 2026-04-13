import httpx
from typing import Dict, Any, List
from sqlmodel import Session, select
from models import User, UserProgress, Problem
from datetime import datetime

LEETCODE_GQL_URL = "https://leetcode.com/graphql"

async def fetch_leetcode_submissions(username: str) -> List[Dict[str, Any]]:
    query = """
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
    """
    variables = {"username": username, "limit": 20}
    async with httpx.AsyncClient() as client:
        response = await client.post(LEETCODE_GQL_URL, json={"query": query, "variables": variables})
        if response.status_code == 200:
            return response.json()["data"]["recentAcSubmissionList"]
        return []

class SyncService:
    @staticmethod
    async def sync_all(user: User, session: Session):
        results = {"leetcode": 0, "hackerrank": 0, "codechef": 0, "hackerearth": 0}
        
        # LeetCode Sync
        if user.leetcode_username:
            submissions = await fetch_leetcode_submissions(user.leetcode_username)
            for sub in submissions:
                # Try to find problem in our database by title slug or title
                # This depends on our Problem.id or title matching
                problem = session.exec(select(Problem).where(Problem.title == sub["title"])).first()
                if problem:
                    progress = session.exec(
                        select(UserProgress).where(
                            UserProgress.user_id == user.id,
                            UserProgress.problem_id == problem.id
                        )
                    ).first()
                    
                    if not progress or not progress.completed:
                        if not progress:
                            progress = UserProgress(user_id=user.id, problem_id=problem.id)
                        
                        progress.completed = True
                        progress.completed_at = datetime.fromtimestamp(int(sub["timestamp"]))
                        session.add(progress)
                        results["leetcode"] += 1
            
        session.commit()
        return results
