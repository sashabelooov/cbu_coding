from datetime import date
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.account import Account
from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransferCreate


async def _update_balance(db: AsyncSession, account_id: str, amount: Decimal, txn_type: TransactionType) -> None:
    result = await db.execute(select(Account).where(Account.id == account_id))
    account = result.scalar_one_or_none()
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    if txn_type == TransactionType.INCOME:
        account.balance += amount
    elif txn_type == TransactionType.EXPENSE:
        account.balance -= amount
    await db.flush()


async def _reverse_balance(db: AsyncSession, account_id: str, amount: Decimal, txn_type: TransactionType) -> None:
    result = await db.execute(select(Account).where(Account.id == account_id))
    account = result.scalar_one_or_none()
    if account is None:
        return

    if txn_type == TransactionType.INCOME:
        account.balance -= amount
    elif txn_type == TransactionType.EXPENSE:
        account.balance += amount
    await db.flush()


async def create_transaction(db: AsyncSession, user_id: str, data: TransactionCreate) -> Transaction:
    transaction = Transaction(
        user_id=user_id,
        account_id=data.account_id,
        category_id=data.category_id,
        type=data.type,
        amount=data.amount,
        description=data.description,
        date=data.date,
    )
    db.add(transaction)
    await _update_balance(db, data.account_id, data.amount, data.type)
    await db.flush()

    # Re-fetch with eager loading for serialization
    result = await db.execute(
        select(Transaction)
        .where(Transaction.id == transaction.id)
        .options(selectinload(Transaction.category), selectinload(Transaction.account))
    )
    return result.scalar_one()


async def get_transactions(
    db: AsyncSession,
    user_id: str,
    date_from: date | None = None,
    date_to: date | None = None,
    category_id: str | None = None,
    txn_type: TransactionType | None = None,
    account_id: str | None = None,
    page: int = 1,
    size: int = 20,
) -> tuple[list[Transaction], int]:
    query = (
        select(Transaction)
        .where(Transaction.user_id == user_id)
        .options(selectinload(Transaction.category), selectinload(Transaction.account))
    )
    count_query = select(func.count()).select_from(Transaction).where(Transaction.user_id == user_id)

    if date_from:
        query = query.where(Transaction.date >= date_from)
        count_query = count_query.where(Transaction.date >= date_from)
    if date_to:
        query = query.where(Transaction.date <= date_to)
        count_query = count_query.where(Transaction.date <= date_to)
    if category_id:
        query = query.where(Transaction.category_id == category_id)
        count_query = count_query.where(Transaction.category_id == category_id)
    if txn_type:
        query = query.where(Transaction.type == txn_type)
        count_query = count_query.where(Transaction.type == txn_type)
    if account_id:
        query = query.where(Transaction.account_id == account_id)
        count_query = count_query.where(Transaction.account_id == account_id)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    query = query.order_by(Transaction.date.desc(), Transaction.created_at.desc())
    query = query.offset((page - 1) * size).limit(size)

    result = await db.execute(query)
    return list(result.scalars().all()), total


async def get_transaction(db: AsyncSession, user_id: str, transaction_id: str) -> Transaction:
    result = await db.execute(
        select(Transaction)
        .where(Transaction.id == transaction_id, Transaction.user_id == user_id)
        .options(selectinload(Transaction.category), selectinload(Transaction.account))
    )
    transaction = result.scalar_one_or_none()
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction


async def update_transaction(
    db: AsyncSession, user_id: str, transaction_id: str, data: TransactionUpdate
) -> Transaction:
    transaction = await get_transaction(db, user_id, transaction_id)

    # Reverse old balance effect
    await _reverse_balance(db, transaction.account_id, transaction.amount, transaction.type)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(transaction, field, value)

    # Apply new balance effect
    await _update_balance(db, transaction.account_id, transaction.amount, transaction.type)

    await db.flush()

    # Re-fetch with eager loading for serialization
    result = await db.execute(
        select(Transaction)
        .where(Transaction.id == transaction.id)
        .options(selectinload(Transaction.category), selectinload(Transaction.account))
    )
    return result.scalar_one()


async def delete_transaction(db: AsyncSession, user_id: str, transaction_id: str) -> None:
    transaction = await get_transaction(db, user_id, transaction_id)
    await _reverse_balance(db, transaction.account_id, transaction.amount, transaction.type)
    await db.delete(transaction)
    await db.flush()


async def create_transfer(db: AsyncSession, user_id: str, data: TransferCreate) -> tuple[Transaction, Transaction]:
    if data.from_account_id == data.to_account_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot transfer to the same account")

    # Outgoing transaction
    outgoing = Transaction(
        user_id=user_id,
        account_id=data.from_account_id,
        type=TransactionType.TRANSFER,
        amount=data.amount,
        description=data.description or "Transfer out",
        date=data.date,
    )
    db.add(outgoing)
    await db.flush()

    # Incoming transaction
    incoming = Transaction(
        user_id=user_id,
        account_id=data.to_account_id,
        type=TransactionType.TRANSFER,
        amount=data.amount,
        description=data.description or "Transfer in",
        date=data.date,
        related_transaction_id=outgoing.id,
    )
    db.add(incoming)
    await db.flush()

    # Link them
    outgoing.related_transaction_id = incoming.id

    # Update balances
    from_result = await db.execute(select(Account).where(Account.id == data.from_account_id))
    from_account = from_result.scalar_one_or_none()
    if from_account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source account not found")

    to_result = await db.execute(select(Account).where(Account.id == data.to_account_id))
    to_account = to_result.scalar_one_or_none()
    if to_account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination account not found")

    from_account.balance -= data.amount
    to_account.balance += data.amount

    await db.flush()

    # Re-fetch with eager loading for serialization
    out_result = await db.execute(
        select(Transaction).where(Transaction.id == outgoing.id)
        .options(selectinload(Transaction.category), selectinload(Transaction.account))
    )
    in_result = await db.execute(
        select(Transaction).where(Transaction.id == incoming.id)
        .options(selectinload(Transaction.category), selectinload(Transaction.account))
    )
    return out_result.scalar_one(), in_result.scalar_one()
