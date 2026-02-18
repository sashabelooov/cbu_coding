from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.debt import DebtType, DebtStatus
from app.models.user import User
from app.schemas.debt import DebtCreate, DebtUpdate, DebtResponse
from app.services import debt_service

router = APIRouter(prefix="/api/debts", tags=["Debts"])


@router.get("", response_model=list[DebtResponse])
async def list_debts(
    type: DebtType | None = Query(None),
    status: DebtStatus | None = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await debt_service.get_debts(db, user.id, type, status)


@router.post("", response_model=DebtResponse, status_code=201)
async def create_debt(
    data: DebtCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await debt_service.create_debt(db, user.id, data)


@router.get("/{debt_id}", response_model=DebtResponse)
async def get_debt(
    debt_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await debt_service.get_debt(db, user.id, debt_id)


@router.put("/{debt_id}", response_model=DebtResponse)
async def update_debt(
    debt_id: str,
    data: DebtUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await debt_service.update_debt(db, user.id, debt_id, data)


@router.patch("/{debt_id}/close", response_model=DebtResponse)
async def close_debt(
    debt_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await debt_service.close_debt(db, user.id, debt_id)
