from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.models.account import AccountType


class AccountCreate(BaseModel):
    name: str
    type: AccountType
    currency: str = "UZS"
    balance: Decimal = Decimal("0.00")
    color: str | None = None
    icon: str | None = None


class AccountUpdate(BaseModel):
    name: str | None = None
    type: AccountType | None = None
    currency: str | None = None
    color: str | None = None
    icon: str | None = None


class AccountResponse(BaseModel):
    id: str
    name: str
    type: str
    currency: str
    balance: Decimal
    color: str | None
    icon: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
