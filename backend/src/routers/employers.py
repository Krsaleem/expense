from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, deps

router = APIRouter(prefix="/employers", tags=["employers"])

# List all employees (original)
@router.get("/employees")
async def list_employees(current_user: models.User = Depends(deps.get_current_user),
                         db: AsyncSession = Depends(deps.get_db)):
    if current_user.role != "R":
        raise HTTPException(status_code=403, detail="Only employers can view employees")
    result = await db.execute(select(models.User))
    return result.scalars().all()

# List only employees of the logged-in employer
@router.get("/my-employees")
async def list_my_employees(current_user: models.User = Depends(deps.get_current_user),
                            db: AsyncSession = Depends(deps.get_db)):
    if current_user.role != "R":
        raise HTTPException(status_code=403, detail="Only employers can view employees")
    
    result = await db.execute(
        select(models.User).where(models.User.employer_id == current_user.id)
    )
    employees = result.scalars().all()
    return employees

# Suspend/reactivate employee
@router.patch("/{user_id}/suspend")
async def suspend_employee(user_id: int, suspend: bool, current_user: models.User = Depends(deps.get_current_user),
                           db: AsyncSession = Depends(deps.get_db)):
    if current_user.role != "R":
        raise HTTPException(status_code=403, detail="Only employers can suspend/reactivate")
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.suspended = suspend
    db.add(user)
    await db.commit()
    return {"message": f"User {'suspended' if suspend else 'reactivated'}"}
