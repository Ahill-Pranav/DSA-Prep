from fastapi import APIRouter, Depends, BackgroundTasks
from sqlmodel import Session, select, func
from database import get_session
from models import User, DailyStats, UserProgress
from services.email import send_reminder_email
from datetime import datetime, timedelta

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/send-reminders")
async def process_reminders(background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    # 1. Get all users
    users = session.exec(select(User)).all()
    today = datetime.utcnow().date()
    start_of_week = today - timedelta(days=today.weekday())
    
    sent_count = 0
    for user in users:
        # 2. Check weekly progress
        weekly_count = session.exec(
            select(func.sum(DailyStats.count)).where(
                DailyStats.user_id == user.id,
                DailyStats.date >= start_of_week
            )
        ).one() or 0
        
        remaining = max(0, user.weekly_goal - weekly_count)
        
        # 3. Only send if user is behind
        if remaining > 0:
            target = round(remaining / max(1, (7 - today.weekday())), 1)
            background_tasks.add_task(send_reminder_email, user, remaining, target)
            sent_count += 1
            
    return {"message": f"Queued {sent_count} reminders"}
