from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.enums import UserRole


def get_current_user(
    authorization: Optional[str] = Header(None, description="Bearer JWT token"),
    db: Session = Depends(get_db),
) -> User:
    """
    Primary authentication dependency.
    Validates standard 'Authorization: Bearer <jwt>' header.
    Rejects missing, malformed, expired, or invalid tokens with 401 Unauthorized.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided. Expected 'Authorization: Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split("Bearer ", 1)[1].strip()
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token: subject claim missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    RBAC dependency ensuring the authenticated user has ADMIN role.
    Rejects non-admin users with 403 Forbidden.
    """
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required. Current user lacks sufficient permissions.",
        )
    return current_user


# Aliases for readability
require_admin = get_current_admin
require_customer = get_current_user
