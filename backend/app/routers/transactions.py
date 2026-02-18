from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.transaction import TransactionType
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from app.services import transaction_service

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.get("")
async def list_transactions(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    category_id: str | None = Query(None),
    type: TransactionType | None = Query(None),
    account_id: str | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    transactions, total = await transaction_service.get_transactions(
        db, user.id, date_from, date_to, category_id, type, account_id, page, size
    )
    return {
        "items": [TransactionResponse.model_validate(t) for t in transactions],
        "total": total,
        "page": page,
        "size": size,
    }


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    data: TransactionCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await transaction_service.create_transaction(db, user.id, data)


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await transaction_service.get_transaction(db, user.id, transaction_id)


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    data: TransactionUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await transaction_service.update_transaction(db, user.id, transaction_id, data)


@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(
    transaction_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await transaction_service.delete_transaction(db, user.id, transaction_id)
