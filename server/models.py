from datetime import datetime, date
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None
    weekly_goal: int = Field(default=10)
    xp: int = Field(default=0)
    level: int = Field(default=1)
    leetcode_username: Optional[str] = None
    hackerrank_username: Optional[str] = None
    codechef_username: Optional[str] = None
    hackerearth_username: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    progress: List["UserProgress"] = Relationship(back_populates="user_rel")
    stats: List["DailyStats"] = Relationship(back_populates="user_rel")

class Problem(SQLModel, table=True):
    id: str = Field(primary_key=True) # e.g. "p1_1"
    title: str
    platform: str
    difficulty: str
    platform_url: Optional[str] = None
    phase_id: int
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    
    progress: List["UserProgress"] = Relationship(back_populates="problem_rel")

class UserProgress(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    problem_id: str = Field(foreign_key="problem.id", index=True)
    completed: bool = Field(default=False)
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    is_bookmarked: bool = Field(default=False)
    is_revision: bool = Field(default=False)
    
    user_rel: "User" = Relationship(back_populates="progress")
    problem_rel: "Problem" = Relationship(back_populates="progress")

class DailyStats(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    date_: date = Field(default_factory=date.today)
    count: int = Field(default=0)
    
    user_rel: "User" = Relationship(back_populates="stats")
