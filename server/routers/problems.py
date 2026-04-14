from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from models import Problem, UserProgress, User, DailyStats
from database import get_session
from dependencies import get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("/")
def get_problems(phase_id: Optional[int] = None, session: Session = Depends(get_session)):
    query = select(Problem)
    if phase_id is not None:
        query = query.where(Problem.phase_id == phase_id)
    return session.exec(query).all()

@router.post("/toggle/{problem_id}")
def toggle_problem(
    problem_id: str, 
    session: Session = Depends(get_session), 
    current_user: User = Depends(get_current_user)
):
    # Check if problem exists
    prob = session.exec(select(Problem).where(Problem.id == problem_id)).first()
    if not prob:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Check current progress
    progress = session.exec(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.problem_id == problem_id
        )
    ).first()
    
    today = datetime.utcnow().date()
    
    if progress:
        was_completed = progress.completed
        progress.completed = not progress.completed
        progress.completed_at = datetime.utcnow() if progress.completed else None
        session.add(progress)
    else:
        was_completed = False
        progress = UserProgress(
            user_id=current_user.id,
            problem_id=problem_id,
            completed=True,
            completed_at=datetime.utcnow()
        )
        session.add(progress)
    
    # Update Daily Stats & User XP
    stats = session.exec(
        select(DailyStats).where(
            DailyStats.user_id == current_user.id,
            DailyStats.date_ == today
        )
    ).first()
    
    if not stats:
        stats = DailyStats(user_id=current_user.id, date_=today, count=0)
        session.add(stats)
    
    xp_map = {"easy": 10, "medium": 20, "hard": 40}
    xp_gain = xp_map.get(prob.difficulty.lower(), 10)
    
    if progress.completed: # Just marked as done
        stats.count += 1
        current_user.xp += xp_gain
    elif was_completed: # Unmarked
        stats.count = max(0, stats.count - 1)
        current_user.xp = max(0, current_user.xp - xp_gain)
    
    # Simple Level Up Logic
    current_user.level = (current_user.xp // 100) + 1
    
    session.add(stats)
    session.add(current_user)
    session.commit()
    return {"completed": progress.completed, "xp": current_user.xp, "level": current_user.level}

@router.get("/user-progress")
def get_user_progress(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return session.exec(select(UserProgress).where(UserProgress.user_id == current_user.id)).all()
