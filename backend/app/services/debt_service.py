from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.debt import Debt, DebtType, DebtStatus
from app.schemas.debt import DebtCreate, DebtUpdate


async def create_debt(db: AsyncSession, user_id: str, data: DebtCreate) -> Debt:
    debt = Debt(
        user_id=user_id,
        type=data.type,
        person_name=data.person_name,
        amount=data.amount,
        currency=data.currency,
        description=data.description,
        due_date=data.due_date,
    )
    db.add(debt)
    await db.flush()
    await db.refresh(debt)
    return debt


async def get_debts(
    db: AsyncSession,
    user_id: str,
    debt_type: DebtType | None = None,
    debt_status: DebtStatus | None = None,
) -> list[Debt]:
    query = select(Debt).where(Debt.user_id == user_id)
    if debt_type:
        query = query.where(Debt.type == debt_type)
    if debt_status:
        query = query.where(Debt.status == debt_status)
    query = query.order_by(Debt.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_debt(db: AsyncSession, user_id: str, debt_id: str) -> Debt:
    result = await db.execute(
        select(Debt).where(Debt.id == debt_id, Debt.user_id == user_id)
    )
    debt = result.scalar_one_or_none()
    if debt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Debt not found")
    return debt


async def update_debt(db: AsyncSession, user_id: str, debt_id: str, data: DebtUpdate) -> Debt:
    debt = await get_debt(db, user_id, debt_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(debt, field, value)
    await db.flush()
    await db.refresh(debt)
    return debt


async def close_debt(db: AsyncSession, user_id: str, debt_id: str) -> Debt:
    debt = await get_debt(db, user_id, debt_id)
    if debt.status == DebtStatus.CLOSED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Debt is already closed")
    debt.status = DebtStatus.CLOSED
    await db.flush()
    await db.refresh(debt)
    return debt
