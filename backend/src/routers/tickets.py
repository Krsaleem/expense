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
# Get My Tickets
# -----------------------------
@router.get("/me", response_model=list[schemas.TicketOut])
async def get_my_tickets(
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    result = await db.execute(
        select(models.Ticket).where(models.Ticket.user_id == current_user.id)
    )
    return result.scalars().all()


# -----------------------------
# List tickets (all tickets for employers, own tickets for employees)
# -----------------------------
@router.get("/", response_model=list[schemas.TicketOut])
async def list_tickets(
    current_user: models.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db)
):
    result = await db.execute(
        select(models.Ticket).options(selectinload(models.Ticket.owner))
    )
    tickets = result.scalars().all()

    # Remove tickets of suspended users
    tickets = [t for t in tickets if not t.owner.suspended]

    if current_user.role == "E":
        return [t for t in tickets if t.user_id == current_user.id]

    return tickets  # employer can see all


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


# -----------------------------
# List tickets of all employees of logged-in employer
# -----------------------------
@router.get("/my-employees", response_model=list[schemas.TicketOut])
async def tickets_of_employees(
    current_user: models.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if current_user.role != "R":
        raise HTTPException(status_code=403, detail="Only employers can view employees' tickets")

    result = await db.execute(
        select(models.Ticket)
        .options(selectinload(models.Ticket.owner))
        .join(models.User, models.Ticket.user_id == models.User.id)
        .where(models.User.employer_id == current_user.id)
    )
    return result.scalars().all()
