from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    role: str

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    role: str
    suspended: bool
    class Config: orm_mode = True

class TicketCreate(BaseModel):
    description: str
    amount: float

class TicketOut(BaseModel):
    id: int
    description: str
    amount: float
    created_at: datetime
    approved: Optional[bool]
    owner: UserOut
    class Config: orm_mode = True
