from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


async def create_account(db: AsyncSession, user_id: str, data: AccountCreate) -> Account:
    account = Account(
        user_id=user_id,
        name=data.name,
        type=data.type,
        currency=data.currency,
        balance=data.balance,
        color=data.color,
        icon=data.icon,
    )
    db.add(account)
    await db.flush()
    await db.refresh(account)
    return account


async def get_accounts(db: AsyncSession, user_id: str) -> list[Account]:
    result = await db.execute(
        select(Account).where(Account.user_id == user_id).order_by(Account.created_at.desc())
    )
    return list(result.scalars().all())


async def get_account(db: AsyncSession, user_id: str, account_id: str) -> Account:
    result = await db.execute(
        select(Account).where(Account.id == account_id, Account.user_id == user_id)
    )
    account = result.scalar_one_or_none()
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return account


async def update_account(db: AsyncSession, user_id: str, account_id: str, data: AccountUpdate) -> Account:
    account = await get_account(db, user_id, account_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(account, field, value)
    await db.flush()
    await db.refresh(account)
    return account


async def delete_account(db: AsyncSession, user_id: str, account_id: str) -> None:
    account = await get_account(db, user_id, account_id)
    await db.delete(account)
    await db.flush()
