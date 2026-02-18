from decimal import Decimal

from pydantic import BaseModel

from app.models.category import CategoryType
from app.schemas.category import CategoryResponse


class BudgetCreate(BaseModel):
    category_id: str | None = None
    type: CategoryType
    month: int
    year: int
    planned_amount: Decimal


class BudgetUpdate(BaseModel):
    planned_amount: Decimal | None = None


class BudgetResponse(BaseModel):
    id: str
    category_id: str | None
    type: str
    month: int
    year: int
    planned_amount: Decimal
    category: CategoryResponse | None = None

    model_config = {"from_attributes": True}


class BudgetComparison(BaseModel):
    category_name: str
    planned: Decimal
    actual: Decimal
    percentage: float
