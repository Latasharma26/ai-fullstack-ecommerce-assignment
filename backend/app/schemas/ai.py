from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    response: str
    tools_used: List[str] = []
    metadata: Dict[str, Any] = {}
