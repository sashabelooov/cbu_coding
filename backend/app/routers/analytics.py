from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsSummary, CategoryBreakdown, DailyTotal
from app.services import analytics_service

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
async def get_summary(
    period: str = Query("month", regex="^(week|month|year)$"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_summary(db, user.id, period)


@router.get("/by-category", response_model=list[CategoryBreakdown])
async def get_by_category(
    type: str = Query(..., regex="^(INCOME|EXPENSE)$"),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_by_category(db, user.id, type, date_from, date_to)


@router.get("/daily", response_model=list[DailyTotal])
async def get_daily_totals(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_daily_totals(db, user.id, month, year)
