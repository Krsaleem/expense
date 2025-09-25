from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from db import Base, engine  # if needed
import models
import schemas
import auth
import deps

router = APIRouter(prefix="/users", tags=["users"])



@router.post("/register", response_model=schemas.UserOut)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(deps.get_db)):
    result = await db.execute(select(models.User).where(models.User.email == user.email))
    if result.scalar():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=auth.hash_password(user.password),
        role=user.role
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


class LoginRequest(schemas.BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest, db: AsyncSession = Depends(deps.get_db)):
    result = await db.execute(select(models.User).where(models.User.email == request.email))
    user = result.scalar()
    if not user or not auth.verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.suspended:
        raise HTTPException(status_code=403, detail="Account suspended")
    token = auth.create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}
