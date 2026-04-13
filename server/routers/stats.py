from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from models import User, DailyStats, UserProgress, Problem
from database import get_session
from dependencies import get_current_user
from services.recommendations import get_recommendations
from datetime import datetime, timedelta
from typing import Dict, Any, List

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/dashboard")
def get_dashboard_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Basic Stats
    total_solved = session.exec(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == current_user.id,
            UserProgress.completed == True
        )
    ).one()
    
    # 2. Streak calculation (simplified)
    streak = 0
    today = datetime.utcnow().date()
    for i in range(100):
        d = today - timedelta(days=i)
        stat = session.exec(select(DailyStats).where(DailyStats.user_id == current_user.id, DailyStats.date == d)).first()
        if stat and stat.count > 0:
            streak += 1
        elif i > 0:
            break
            
    # 3. Heatmap (last 365 days)
    year_ago = today - timedelta(days=365)
    heatmap_data = session.exec(
        select(DailyStats).where(
            DailyStats.user_id == current_user.id,
            DailyStats.date >= year_ago
        )
    ).all()
    
    # 4. Difficulty Distribution
    # This requires a join
    diff_stats = session.exec(
        select(Problem.difficulty, func.count(UserProgress.id))
        .join(UserProgress)
        .where(UserProgress.user_id == current_user.id, UserProgress.completed == True)
        .group_by(Problem.difficulty)
    ).all()
    
    # 5. Weekly Progress
    start_of_week = today - timedelta(days=today.weekday())
    weekly_count = session.exec(
        select(func.sum(DailyStats.count)).where(
            DailyStats.user_id == current_user.id,
            DailyStats.date >= start_of_week
        )
    ).one() or 0
    
    # 6. Recommendations
    recs = get_recommendations(current_user, session)
    
    return {
        "total_solved": total_solved,
        "streak": streak,
        "weekly_progress": {
            "solved": weekly_count,
            "goal": current_user.weekly_goal,
            "remaining": max(0, current_user.weekly_goal - weekly_count),
            "daily_suggestion": round(max(0, current_user.weekly_goal - weekly_count) / (7 - today.weekday()), 1) if today.weekday() < 7 else 0
        },
        "xp": current_user.xp,
        "level": current_user.level,
        "heatmap": {str(s.date): s.count for s in heatmap_data},
        "difficulty_distribution": {d: c for d, c in diff_stats},
        "recommendations": recs
    }
