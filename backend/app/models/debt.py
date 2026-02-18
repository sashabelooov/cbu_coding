import enum
import uuid
from datetime import datetime, date
from decimal import Decimal

from sqlalchemy import String, DateTime, Date, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DebtType(str, enum.Enum):
    DEBT = "DEBT"
    RECEIVABLE = "RECEIVABLE"


class DebtStatus(str, enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"


class Debt(Base):
    __tablename__ = "debts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    person_name: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="UZS")
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="OPEN")
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="debts")
