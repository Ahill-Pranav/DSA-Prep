from sqlmodel import Session, select
from models import Problem, UserProgress, User
from typing import List
import random

def get_recommendations(user: User, session: Session) -> List[Problem]:
    # 1. Get all completed problem IDs
    progress = session.exec(select(UserProgress).where(UserProgress.user_id == user.id, UserProgress.completed == True)).all()
    completed_ids = {p.problem_id for p in progress}
    
    # 2. Get all problems
    all_problems = session.exec(select(Problem)).all()
    
    # 3. Analyze weak topics (by phase_id for simplicity)
    phase_stats = {}
    for p in all_problems:
        if p.phase_id not in phase_stats:
            phase_stats[p.phase_id] = {"total": 0, "done": 0}
        phase_stats[p.phase_id]["total"] += 1
        if p.id in completed_ids:
            phase_stats[p.phase_id]["done"] += 1
            
    # Calculate mastery percentage
    mastery = []
    for pid, stats in phase_stats.items():
        mastery.append({
            "phase_id": pid,
            "pct": (stats["done"] / stats["total"]) if stats["total"] > 0 else 0
        })
        
    # Sort by lowest mastery
    mastery.sort(key=lambda x: x["pct"])
    
    # 4. Pick problems from the weakest phases
    recommendations = []
    for m in mastery:
        if len(recommendations) >= 5:
            break
            
        phase_problems = [p for p in all_problems if p.phase_id == m["phase_id"] and p.id not in completed_ids]
        random.shuffle(phase_problems)
        
        for p in phase_problems:
            if len(recommendations) < 5:
                recommendations.append(p)
            else:
                break
                
    return recommendations
