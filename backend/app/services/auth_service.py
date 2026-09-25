import logging
from typing import Optional, Dict, Any, Set
import httpx
import jwt
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.auth import TokenResponse, UserResponse

logger = logging.getLogger(__name__)

# Pre-approved administrator emails (can be extended via environment)
ADMIN_EMAILS: Set[str] = {
    "admin@shopai.com",
}


class AuthService:
    @staticmethod
    async def verify_google_credential(credential: str) -> Dict[str, Any]:
        """
        Verifies Google ID token using Google's tokeninfo API.
        Falls back to decoding unverified payload ONLY in development/testing mode.
        In production, unverified tokens are strictly rejected.
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(
                    "https://oauth2.googleapis.com/tokeninfo",
                    params={"id_token": credential},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    # Verify aud if client id is configured
                    if settings.GOOGLE_CLIENT_ID and data.get("aud") != settings.GOOGLE_CLIENT_ID:
                        logger.warning("Google token aud mismatch: %s vs %s", data.get("aud"), settings.GOOGLE_CLIENT_ID)
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Google token client ID mismatch",
                        )
                    return data
        except HTTPException:
            raise
        except Exception as exc:
            logger.warning("Direct Google tokeninfo verification failed: %s", exc)

        # Fallback ONLY in non-production environments for local mock evaluation
        if settings.ENVIRONMENT != "production":
            try:
                unverified = jwt.decode(credential, options={"verify_signature": False})
                if "email" in unverified:
                    logger.info("Using development unverified token fallback for: %s", unverified.get("email"))
                    return unverified
            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google authentication credential",
        )

    @staticmethod
    def get_or_create_user(
        db: Session,
        email: str,
        name: Optional[str] = None,
        google_id: Optional[str] = None,
    ) -> User:
        """
        Retrieves user by email or creates a new user in PostgreSQL.
        Enforces secure RBAC: Only explicitly designated ADMIN_EMAILS receive the ADMIN role.
        All other users are provisioned with CUSTOMER role.
        """
        email = email.strip().lower()
        user = db.query(User).filter(User.email == email).first()

        if not user:
            role = UserRole.ADMIN.value if email in ADMIN_EMAILS else UserRole.CUSTOMER.value
            display_name = name or email.split("@")[0].capitalize()
            user = User(
                email=email,
                name=display_name,
                google_id=google_id,
                role=role,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("Created new user: %s (role: %s)", email, role)
        else:
            updated = False
            if google_id and not user.google_id:
                user.google_id = google_id
                updated = True
            if name and (not user.name or user.name == user.email.split("@")[0].capitalize()):
                user.name = name
                updated = True
            # Reconcile role for pre-approved admin accounts
            if email in ADMIN_EMAILS and user.role != UserRole.ADMIN.value:
                user.role = UserRole.ADMIN.value
                updated = True
            if updated:
                db.commit()
                db.refresh(user)

        return user

    @classmethod
    def create_user_token(cls, user: User) -> TokenResponse:
        """
        Generates JWT token and formats TokenResponse.
        Subject claim ('sub') contains verified user email, matching token identity to DB record.
        """
        payload = {
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
        }
        token = create_access_token(data=payload)
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
