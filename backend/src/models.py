from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    hashed_password = Column(String)
    role = Column(String(1), nullable=False, default='E') # Role: 'R' = employer/manager, 'E' = employee
    suspended = Column(Boolean, default=False)

    tickets = relationship("Ticket", back_populates="owner")
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    employees = relationship("User", backref="employer", remote_side=[id])


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved = Column(Boolean, nullable=True)  # None=pending
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tickets")
