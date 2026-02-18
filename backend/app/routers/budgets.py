from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse, BudgetComparison
from app.services import budget_service

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])


@router.get("/comparison", response_model=list[BudgetComparison])
async def get_comparison(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await budget_service.get_budget_comparison(db, user.id, month, year)


@router.get("", response_model=list[BudgetResponse])
async def list_budgets(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await budget_service.get_budgets(db, user.id, month, year)


@router.post("", response_model=BudgetResponse, status_code=201)
async def create_budget(
    data: BudgetCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await budget_service.create_budget(db, user.id, data)


@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: str,
    data: BudgetUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await budget_service.update_budget(db, user.id, budget_id, data)


@router.delete("/{budget_id}", status_code=204)
async def delete_budget(
    budget_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await budget_service.delete_budget(db, user.id, budget_id)
