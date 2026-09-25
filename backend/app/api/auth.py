from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    GoogleAuthRequest,
    DemoLoginRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/google", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def google_auth(
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticate via Google OAuth ID token (Google One Tap / Identity Services).
    Verifies the token, fetches or creates the user in PostgreSQL, and returns a signed JWT.
    """
    google_data = await AuthService.verify_google_credential(payload.credential)
    email = google_data.get("email")
    name = google_data.get("name")
    google_id = google_data.get("sub")

    user = AuthService.get_or_create_user(
        db=db,
        email=email,
        name=name,
        google_id=google_id,
    )
    return AuthService.create_user_token(user)


@router.post("/demo-login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def demo_login(
    payload: DemoLoginRequest,
    db: Session = Depends(get_db),
):
    """
    Quick one-click demo login for interview evaluations and local testing.
    Disabled in production environments for security.
    """
    from app.core.config import settings
    if settings.ENVIRONMENT == "production":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo login is disabled in production. Please sign in with Google OAuth.",
        )

    user = AuthService.get_or_create_user(
        db=db,
        email=str(payload.email),
        name=None,
    )
    return AuthService.create_user_token(user)


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve profile and role information of the currently authenticated user.
    """
    return UserResponse.model_validate(current_user)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    """
    Stateless JWT logout confirmation. Frontend cleans local storage token.
    """
    return {"message": "Logged out successfully"}
