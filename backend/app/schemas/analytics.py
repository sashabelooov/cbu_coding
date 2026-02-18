from decimal import Decimal

from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    balance: Decimal


class CategoryBreakdown(BaseModel):
    category_name: str
    category_color: str | None
    amount: Decimal
    percentage: float


class DailyTotal(BaseModel):
    date: str
    income: Decimal
    expense: Decimal
