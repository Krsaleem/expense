from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import Depends

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/expense_db"

# Async engine
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Async session factory
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Base class for models
Base = declarative_base()


# Dependency for FastAPI routes
async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
