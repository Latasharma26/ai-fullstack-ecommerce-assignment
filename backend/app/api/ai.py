from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.ai import ChatMessageRequest, ChatMessageResponse
from app.services.ai_agent_service import AIAgentService

router = APIRouter(prefix="/ai", tags=["AI Support Agent"])


@router.post("/chat", response_model=ChatMessageResponse, status_code=status.HTTP_200_OK)
def chat_with_agent(
    payload: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    AI Support Agent endpoint.
    Processes user inquiries with real-time database tools:
    - Order status check
    - Product catalog and inventory search
    - Store policies lookup
    """
    return AIAgentService.process_message(
        db=db,
        user=current_user,
        message=payload.message,
    )
