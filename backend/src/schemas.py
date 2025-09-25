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
    class Config:
        orm_mode = True

class TicketCreate(BaseModel):
    description: str
    amount: float
    link: Optional[str] = None   # <- need this field for frontend link

class TicketOut(BaseModel):
    id: int
    description: str
    amount: float
    created_at: datetime
    approved: Optional[bool]
    owner: UserOut  # owner info
    link: Optional[str] = None  # <- include link field
    class Config:
        orm_mode = True

class ApproveTicketRequest(BaseModel):
    approve: bool

class LoginRequest(BaseModel):
    email: str
    password: str
