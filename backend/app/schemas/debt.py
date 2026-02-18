import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from app.models.debt import DebtType, DebtStatus


class DebtCreate(BaseModel):
    type: DebtType
    person_name: str
    amount: Decimal
    currency: str = "UZS"
    description: Optional[str] = None
    due_date: Optional[datetime.date] = None


class DebtUpdate(BaseModel):
    person_name: Optional[str] = None
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime.date] = None


class DebtResponse(BaseModel):
    id: str
    type: str
    person_name: str
    amount: Decimal
    currency: str
    description: Optional[str]
    status: str
    due_date: Optional[datetime.date]
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
