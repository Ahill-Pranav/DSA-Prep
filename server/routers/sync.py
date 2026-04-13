from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from dependencies import get_current_user
from models import User
from services.sync import SyncService

router = APIRouter(prefix="/sync", tags=["sync"])

@router.post("/all")
async def sync_all_platforms(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    stats = await SyncService.sync_all(current_user, session)
    return {"message": "Sync complete", "results": stats}
