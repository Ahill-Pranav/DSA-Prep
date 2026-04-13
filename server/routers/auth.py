from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from models import User
from security import get_password_hash, verify_password, create_access_token
from database import get_session
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(email: str, full_name: str, password: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(
        email=email,
        full_name=full_name,
        hashed_password=get_password_hash(password)
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return {"message": "User created successfully"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
