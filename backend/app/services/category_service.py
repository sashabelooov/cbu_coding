from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category, CategoryType
from app.schemas.category import CategoryCreate

DEFAULT_EXPENSE_CATEGORIES = [
    {"name": "Food", "icon": "restaurant", "color": "#FF6B6B"},
    {"name": "Transport", "icon": "directions-car", "color": "#4ECDC4"},
    {"name": "Shopping", "icon": "shopping-bag", "color": "#45B7D1"},
    {"name": "Bills", "icon": "receipt", "color": "#96CEB4"},
    {"name": "Health", "icon": "local-hospital", "color": "#FFEAA7"},
    {"name": "Entertainment", "icon": "movie", "color": "#DDA0DD"},
    {"name": "Education", "icon": "school", "color": "#98D8C8"},
    {"name": "Other", "icon": "more-horiz", "color": "#B0BEC5"},
]

DEFAULT_INCOME_CATEGORIES = [
    {"name": "Salary", "icon": "work", "color": "#2ECC71"},
    {"name": "Freelance", "icon": "laptop", "color": "#3498DB"},
    {"name": "Gift", "icon": "card-giftcard", "color": "#E74C3C"},
    {"name": "Investment", "icon": "trending-up", "color": "#9B59B6"},
    {"name": "Other", "icon": "more-horiz", "color": "#B0BEC5"},
]


async def seed_default_categories(db: AsyncSession, user_id: str) -> None:
    for cat in DEFAULT_EXPENSE_CATEGORIES:
        category = Category(
            user_id=user_id,
            name=cat["name"],
            type=CategoryType.EXPENSE,
            icon=cat["icon"],
            color=cat["color"],
            is_default=True,
        )
        db.add(category)

    for cat in DEFAULT_INCOME_CATEGORIES:
        category = Category(
            user_id=user_id,
            name=cat["name"],
            type=CategoryType.INCOME,
            icon=cat["icon"],
            color=cat["color"],
            is_default=True,
        )
        db.add(category)

    await db.flush()


async def get_categories(db: AsyncSession, user_id: str, cat_type: CategoryType | None = None) -> list[Category]:
    query = select(Category).where(Category.user_id == user_id)
    if cat_type is not None:
        query = query.where(Category.type == cat_type)
    query = query.order_by(Category.is_default.desc(), Category.name)
    result = await db.execute(query)
    return list(result.scalars().all())


async def create_category(db: AsyncSession, user_id: str, data: CategoryCreate) -> Category:
    category = Category(
        user_id=user_id,
        name=data.name,
        type=data.type,
        icon=data.icon,
        color=data.color,
        is_default=False,
    )
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return category
