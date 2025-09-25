from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db import Base, engine
import models
import auth
from routers import users, tickets, employers

# -----------------------------
# Lifespan for startup/shutdown
# -----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1️⃣ Create tables if not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2️⃣ Seed initial data safely
    async with AsyncSession(engine) as session:
        # Check if users already exist
        result = await session.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        if count == 0:
            # Truncate tables first (fresh start)
            await session.execute(text("TRUNCATE TABLE tickets RESTART IDENTITY CASCADE"))
            await session.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
            await session.commit()

            # -----------------------------
            # Create employers
            # -----------------------------
            boss1 = models.User(
                email="boss1@gmail.com",
                username="boss1",
                hashed_password=auth.hash_password("123456"),
                role="R",  # R = employer
                suspended=False
            )
            boss2 = models.User(
                email="boss2@gmail.com",
                username="boss2",
                hashed_password=auth.hash_password("123456"),
                role="R",
                suspended=False
            )

            session.add_all([boss1, boss2])
            await session.commit()
            await session.refresh(boss1)
            await session.refresh(boss2)

            # -----------------------------
            # Create employees under each employer
            # -----------------------------
            employees = [
                models.User(email="ali@gmail.com", username="ali", hashed_password=auth.hash_password("123456"),
                            role="E", suspended=False, employer_id=boss1.id),
                models.User(email="sara@gmail.com", username="sara", hashed_password=auth.hash_password("123456"),
                            role="E", suspended=False, employer_id=boss1.id),
                models.User(email="john@gmail.com", username="john", hashed_password=auth.hash_password("123456"),
                            role="E", suspended=False, employer_id=boss2.id),
                models.User(email="emma@gmail.com", username="emma", hashed_password=auth.hash_password("123456"),
                            role="E", suspended=False, employer_id=boss2.id),
            ]

            session.add_all(employees)
            await session.commit()

            # Refresh employees to get IDs
            for emp in employees:
                await session.refresh(emp)

            # -----------------------------
            # Create tickets for each employee
            # -----------------------------
            tickets_list = [
                # Tickets for ali
                models.Ticket(description="Dell XPS 13 Laptop", amount=1200, user_id=employees[0].id, approved=None),
                models.Ticket(description="Office Chair", amount=200, user_id=employees[0].id, approved=True),
                models.Ticket(description="Team Lunch", amount=150, user_id=employees[0].id, approved=False),

                # Tickets for sara
                models.Ticket(description="Flight to Client Meeting", amount=500, user_id=employees[1].id, approved=True),
                models.Ticket(description="Software License", amount=300, user_id=employees[1].id, approved=None),

                # Tickets for john
                models.Ticket(description="Monitor", amount=250, user_id=employees[2].id, approved=True),
                models.Ticket(description="Keyboard", amount=100, user_id=employees[2].id, approved=False),

                # Tickets for emma
                models.Ticket(description="Conference Ticket", amount=400, user_id=employees[3].id, approved=None),
                models.Ticket(description="Business Books", amount=120, user_id=employees[3].id, approved=True),
            ]

            session.add_all(tickets_list)
            await session.commit()

    yield
    # Optional cleanup on shutdown


# -----------------------------
# FastAPI app setup
# -----------------------------
app = FastAPI(title="Expense Tracker API", lifespan=lifespan)

# CORS settings
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Routers
app.include_router(users.router)
app.include_router(tickets.router)
app.include_router(employers.router)


# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
async def root():
    return {"message": "Expense Tracker API is running"}


# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
