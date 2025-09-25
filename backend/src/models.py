from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(1), nullable=False, default='E')  # 'R' = employer, 'E' = employee
    suspended = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    tickets = relationship("Ticket", back_populates="owner")
    employees = relationship("User", back_populates="employer")   # One-to-many
    employer = relationship("User", back_populates="employees", remote_side=[id])  # Many-to-one



class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved = Column(Boolean, nullable=True)  # None = pending
    user_id = Column(Integer, ForeignKey("users.id"))
    link = Column(String, nullable=True)  

    # Relationships
    owner = relationship("User", back_populates="tickets")
