from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import select, func, case, literal_column
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.transaction import Transaction, TransactionType
from app.schemas.analytics import AnalyticsSummary, CategoryBreakdown, DailyTotal


def _get_period_range(period: str) -> tuple[date, date]:
    today = date.today()
    if period == "week":
        start = today - timedelta(days=today.weekday())
        return start, today
    elif period == "year":
        return date(today.year, 1, 1), today
    else:  # month
        return date(today.year, today.month, 1), today


async def get_summary(db: AsyncSession, user_id: str, period: str = "month") -> AnalyticsSummary:
    date_from, date_to = _get_period_range(period)

    result = await db.execute(
        select(
            func.coalesce(
                func.sum(case((Transaction.type == TransactionType.INCOME, Transaction.amount), else_=Decimal("0.00"))),
                Decimal("0.00"),
            ).label("total_income"),
            func.coalesce(
                func.sum(case((Transaction.type == TransactionType.EXPENSE, Transaction.amount), else_=Decimal("0.00"))),
                Decimal("0.00"),
            ).label("total_expense"),
        ).where(
            Transaction.user_id == user_id,
            Transaction.date >= date_from,
            Transaction.date <= date_to,
            Transaction.type.in_([TransactionType.INCOME, TransactionType.EXPENSE]),
        )
    )
    row = result.one()
    total_income = row.total_income or Decimal("0.00")
    total_expense = row.total_expense or Decimal("0.00")

    return AnalyticsSummary(
        total_income=total_income,
        total_expense=total_expense,
        balance=total_income - total_expense,
    )


async def get_by_category(
    db: AsyncSession,
    user_id: str,
    txn_type: str,
    date_from: date | None = None,
    date_to: date | None = None,
) -> list[CategoryBreakdown]:
    query = (
        select(
            Category.name.label("category_name"),
            Category.color.label("category_color"),
            func.sum(Transaction.amount).label("amount"),
        )
        .join(Category, Transaction.category_id == Category.id)
        .where(
            Transaction.user_id == user_id,
            Transaction.type == txn_type,
        )
        .group_by(Category.name, Category.color)
        .order_by(func.sum(Transaction.amount).desc())
    )

    if date_from:
        query = query.where(Transaction.date >= date_from)
    if date_to:
        query = query.where(Transaction.date <= date_to)

    result = await db.execute(query)
    rows = result.all()

    total = sum(row.amount for row in rows) if rows else Decimal("0.00")

    return [
        CategoryBreakdown(
            category_name=row.category_name,
            category_color=row.category_color,
            amount=row.amount,
            percentage=round(float(row.amount / total * 100), 1) if total > 0 else 0.0,
        )
        for row in rows
    ]


async def get_daily_totals(db: AsyncSession, user_id: str, month: int, year: int) -> list[DailyTotal]:
    # Use strftime for SQLite compatibility instead of extract()
    month_str = f"{month:02d}"
    year_str = str(year)

    result = await db.execute(
        select(
            Transaction.date.label("day"),
            func.coalesce(
                func.sum(case((Transaction.type == TransactionType.INCOME, Transaction.amount), else_=Decimal("0.00"))),
                Decimal("0.00"),
            ).label("income"),
            func.coalesce(
                func.sum(case((Transaction.type == TransactionType.EXPENSE, Transaction.amount), else_=Decimal("0.00"))),
                Decimal("0.00"),
            ).label("expense"),
        )
        .where(
            Transaction.user_id == user_id,
            func.strftime("%m", Transaction.date) == month_str,
            func.strftime("%Y", Transaction.date) == year_str,
            Transaction.type.in_([TransactionType.INCOME, TransactionType.EXPENSE]),
        )
        .group_by(Transaction.date)
        .order_by(Transaction.date)
    )
    rows = result.all()

    return [
        DailyTotal(
            date=str(row.day),
            income=row.income or Decimal("0.00"),
            expense=row.expense or Decimal("0.00"),
        )
        for row in rows
    ]
