from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from db import SessionLocal
import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

async def get_db():
    async with SessionLocal() as session:
        yield session

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    from sqlalchemy.future import select
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = await db.execute(select(models.User).where(models.User.email == email))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.suspended:
        raise HTTPException(status_code=403, detail="User suspended")
    return user
