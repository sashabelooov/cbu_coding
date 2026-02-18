from pydantic import BaseModel

from app.models.category import CategoryType


class CategoryCreate(BaseModel):
    name: str
    type: CategoryType
    icon: str | None = None
    color: str | None = None


class CategoryResponse(BaseModel):
    id: str
    name: str
    type: str
    icon: str | None
    color: str | None
    is_default: bool

    model_config = {"from_attributes": True}
