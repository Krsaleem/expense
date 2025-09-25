import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db import SessionLocal, engine, Base
import models
from auth import hash_password

async def seed():
    async with engine.begin() as conn:
        # Drop & recreate tables (truncate)
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        # --------------------------
        # Employers
        # --------------------------
        boss = models.User(
            email="boss@gmail.com",
            username="Boss",
            hashed_password=hash_password("123456"),
            role='R',  # 'R' = employer
        )

        ceo = models.User(
            email="ceo@gmail.com",
            username="CEO",
            hashed_password=hash_password("123456"),
            role='R',
        )

        session.add_all([boss, ceo])
        await session.commit()
        await session.refresh(boss)
        await session.refresh(ceo)

        # --------------------------
        # Employees linked to employers
        # --------------------------
        ali = models.User(
            email="ali@gmail.com",
            username="Ali",
            hashed_password=hash_password("123456"),
            role='E',
            employer_id=boss.id
        )

        sara = models.User(
            email="sara@gmail.com",
            username="Sara",
            hashed_password=hash_password("123456"),
            role='E',
            employer_id=boss.id
        )

        john = models.User(
            email="john@gmail.com",
            username="John",
            hashed_password=hash_password("123456"),
            role='E',
            employer_id=ceo.id
        )

        lisa = models.User(
            email="lisa@gmail.com",
            username="Lisa",
            hashed_password=hash_password("123456"),
            role='E',
            employer_id=ceo.id,
            suspended=True  # suspended example
        )

        session.add_all([ali, sara, john, lisa])
        await session.commit()
        for user in [ali, sara, john, lisa]:
            await session.refresh(user)

        # --------------------------
        # Tickets
        # --------------------------
        tickets = [
            models.Ticket(description="Dell Laptop", amount=1200, user_id=ali.id, approved=True),
            models.Ticket(description="Office Chair", amount=300, user_id=ali.id, approved=False),
            models.Ticket(description="Flight to NYC", amount=500, user_id=sara.id, approved=None),
            models.Ticket(description="Hotel Booking", amount=800, user_id=sara.id, approved=True),
            models.Ticket(description="Conference Fee", amount=350, user_id=john.id, approved=False),
            models.Ticket(description="Monitor Stand", amount=75, user_id=john.id, approved=True),
            models.Ticket(description="Keyboard", amount=120, user_id=lisa.id, approved=None),
            models.Ticket(description="Mouse", amount=60, user_id=lisa.id, approved=False),
        ]

        session.add_all(tickets)
        await session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
