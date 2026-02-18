import uuid
from decimal import Decimal

from sqlalchemy import String, Integer, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (
        UniqueConstraint("user_id", "category_id", "type", "month", "year", name="uq_budget_user_cat_type_period"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    category_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("categories.id"), nullable=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    planned_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)

    user = relationship("User", back_populates="budgets")
    category = relationship("Category")
