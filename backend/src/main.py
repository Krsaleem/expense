from fastapi import FastAPI
# from contextlib import asynccontextmanager
from db import Base, engine
from routers import users, tickets, employers
from fastapi.middleware.cors import CORSMiddleware



# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup: create tables
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)
#     yield
#     # Shutdown: cleanup if needed

app = FastAPI(title="Expense Tracker API")

origins = [
    "http://localhost:5173",  # your React dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],     # allow all HTTP methods
    allow_headers=["*"],     # allow all headers
)

# Include routers AFTER app is created
app.include_router(users.router)
app.include_router(tickets.router)
app.include_router(employers.router)

@app.get("/")
async def root():
    return {"message": "Expense Tracker API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
