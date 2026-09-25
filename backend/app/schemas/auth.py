from typing import Optional
from pydantic import BaseModel


class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token (JWT from Google One Tap / Sign-In)


class DemoLoginRequest(BaseModel):
    email: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    google_id: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
