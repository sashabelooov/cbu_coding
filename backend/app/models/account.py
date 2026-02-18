import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AccountType(str, enum.Enum):
    CARD = "CARD"
    BANK = "BANK"
    CASH = "CASH"
    E_WALLET = "E_WALLET"


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="UZS")
    balance: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    color: Mapped[str | None] = mapped_column(String(7), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")
