from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.category import CategoryType
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services import category_service

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    type: CategoryType | None = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await category_service.get_categories(db, user.id, type)


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(
    data: CategoryCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await category_service.create_category(db, user.id, data)
