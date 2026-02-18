import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from app.models.transaction import TransactionType
from app.schemas.account import AccountResponse
from app.schemas.category import CategoryResponse


class TransactionCreate(BaseModel):
    account_id: str
    category_id: Optional[str] = None
    type: TransactionType
    amount: Decimal
    description: Optional[str] = None
    date: datetime.date


class TransactionUpdate(BaseModel):
    account_id: Optional[str] = None
    category_id: Optional[str] = None
    type: Optional[TransactionType] = None
    amount: Optional[Decimal] = None
    description: Optional[str] = None
    date: Optional[datetime.date] = None


class TransactionResponse(BaseModel):
    id: str
    account_id: str
    category_id: Optional[str]
    type: str
    amount: Decimal
    description: Optional[str]
    date: datetime.date
    related_transaction_id: Optional[str]
    category: Optional[CategoryResponse] = None
    account: Optional[AccountResponse] = None

    model_config = {"from_attributes": True}


class TransferCreate(BaseModel):
    from_account_id: str
    to_account_id: str
    amount: Decimal
    description: Optional[str] = None
    date: datetime.date
