from sqlalchemy.ext.asyncio import create_async_engine
engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/expense_db", echo=True)
import asyncio

async def test():
    async with engine.begin() as conn:
        result = await conn.execute("SELECT 1")
        print(result.all())

asyncio.run(test())
