from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse
from app.services import account_service

router = APIRouter(prefix="/api/accounts", tags=["Accounts"])


@router.get("", response_model=list[AccountResponse])
async def list_accounts(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await account_service.get_accounts(db, user.id)


@router.post("", response_model=AccountResponse, status_code=201)
async def create_account(
    data: AccountCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await account_service.create_account(db, user.id, data)


@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await account_service.get_account(db, user.id, account_id)


@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(
    account_id: str,
    data: AccountUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await account_service.update_account(db, user.id, account_id, data)


@router.delete("/{account_id}", status_code=204)
async def delete_account(
    account_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await account_service.delete_account(db, user.id, account_id)
