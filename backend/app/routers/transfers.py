from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.transaction import TransferCreate, TransactionResponse
from app.services import transaction_service

router = APIRouter(prefix="/api/transfers", tags=["Transfers"])


@router.post("", status_code=201)
async def create_transfer(
    data: TransferCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    outgoing, incoming = await transaction_service.create_transfer(db, user.id, data)
    return {
        "outgoing": TransactionResponse.model_validate(outgoing),
        "incoming": TransactionResponse.model_validate(incoming),
    }
