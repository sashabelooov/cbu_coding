from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.budget import Budget
from app.models.category import CategoryType
from app.models.transaction import Transaction, TransactionType
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetComparison


async def create_budget(db: AsyncSession, user_id: str, data: BudgetCreate) -> Budget:
    existing = await db.execute(
        select(Budget).where(
            Budget.user_id == user_id,
            Budget.category_id == data.category_id,
            Budget.type == data.type,
            Budget.month == data.month,
            Budget.year == data.year,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Budget for this category and period already exists")

    budget = Budget(
        user_id=user_id,
        category_id=data.category_id,
        type=data.type,
        month=data.month,
        year=data.year,
        planned_amount=data.planned_amount,
    )
    db.add(budget)
    await db.flush()

    # Re-fetch with eager loading for serialization
    result = await db.execute(
        select(Budget).where(Budget.id == budget.id).options(selectinload(Budget.category))
    )
    return result.scalar_one()


async def get_budgets(db: AsyncSession, user_id: str, month: int, year: int) -> list[Budget]:
    result = await db.execute(
        select(Budget)
        .where(Budget.user_id == user_id, Budget.month == month, Budget.year == year)
        .options(selectinload(Budget.category))
    )
    return list(result.scalars().all())


async def get_budget(db: AsyncSession, user_id: str, budget_id: str) -> Budget:
    result = await db.execute(
        select(Budget).where(Budget.id == budget_id, Budget.user_id == user_id)
    )
    budget = result.scalar_one_or_none()
    if budget is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return budget


async def update_budget(db: AsyncSession, user_id: str, budget_id: str, data: BudgetUpdate) -> Budget:
    budget = await get_budget(db, user_id, budget_id)
    if data.planned_amount is not None:
        budget.planned_amount = data.planned_amount
    await db.flush()

    # Re-fetch with eager loading for serialization
    result = await db.execute(
        select(Budget).where(Budget.id == budget.id).options(selectinload(Budget.category))
    )
    return result.scalar_one()


async def delete_budget(db: AsyncSession, user_id: str, budget_id: str) -> None:
    budget = await get_budget(db, user_id, budget_id)
    await db.delete(budget)
    await db.flush()


async def get_budget_comparison(db: AsyncSession, user_id: str, month: int, year: int) -> list[BudgetComparison]:
    budgets = await get_budgets(db, user_id, month, year)
    comparisons = []

    month_str = f"{month:02d}"
    year_str = str(year)

    for budget in budgets:
        txn_type = TransactionType.EXPENSE if budget.type == CategoryType.EXPENSE else TransactionType.INCOME
        query = select(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).where(
            Transaction.user_id == user_id,
            Transaction.type == txn_type,
            func.strftime("%m", Transaction.date) == month_str,
            func.strftime("%Y", Transaction.date) == year_str,
        )
        if budget.category_id:
            query = query.where(Transaction.category_id == budget.category_id)

        result = await db.execute(query)
        actual = result.scalar() or Decimal("0.00")

        percentage = float(actual / budget.planned_amount * 100) if budget.planned_amount > 0 else 0.0
        category_name = budget.category.name if budget.category else "Overall"

        comparisons.append(BudgetComparison(
            category_name=category_name,
            planned=budget.planned_amount,
            actual=actual,
            percentage=round(percentage, 1),
        ))

    return comparisons
