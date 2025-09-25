from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

import models, schemas, deps

router = APIRouter(prefix="/tickets", tags=["tickets"])

# -----------------------------
# Create ticket (employees only)
# -----------------------------
@router.post("/", response_model=schemas.TicketOut)
async def create_ticket(
    ticket: schemas.TicketCreate,
    current_user: models.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if current_user.role != "E":  # "E" = employee
        raise HTTPException(status_code=403, detail="Only employees can create tickets")

    db_ticket = models.Ticket(
        description=ticket.description,
        amount=ticket.amount,
        user_id=current_user.id,   
        link=ticket.link,
    )
    db.add(db_ticket)
    await db.commit()
    await db.refresh(db_ticket)
    return db_ticket

# -----------------------------
# Get My Tickets (logged-in employee only)
# -----------------------------
@router.get("/me", response_model=list[schemas.TicketOut])
async def get_my_tickets(
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
 

    result = await db.execute(
        select(models.Ticket)
        .options(selectinload(models.Ticket.owner))
        .where(models.Ticket.user_id == current_user.id)
    )
    return result.scalars().all()

# -----------------------------
# Get all tickets of employees of logged-in employer
# -----------------------------
@router.get("/", response_model=list[schemas.TicketOut])
async def get_employees_tickets(
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    if current_user.role != "R":
        raise HTTPException(status_code=403, detail="Only employers can view their employees' tickets")

    # Select tickets where ticket.owner.employer_id == current_user.id
    result = await db.execute(
        select(models.Ticket)
        .options(selectinload(models.Ticket.owner))
        .join(models.User, models.Ticket.user_id == models.User.id)
        .where(models.User.employer_id == current_user.id)
    )
    tickets = result.scalars().all()
    return tickets


# -----------------------------
# Approve or deny ticket (employers only)
# -----------------------------
@router.patch("/{ticket_id}/approve")
async def approve_ticket(
    ticket_id: int,
    request: schemas.ApproveTicketRequest,
    current_user: models.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if current_user.role != "R":
        raise HTTPException(status_code=403, detail="Only employers can approve/deny")

    result = await db.execute(
        select(models.Ticket).where(models.Ticket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.approved = request.approve
    db.add(ticket)
    await db.commit()
    return {"message": "Ticket updated"}


 