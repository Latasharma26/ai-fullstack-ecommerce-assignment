from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new order for the authenticated customer.
    Validates inventory, deducts stock, and calculates total on the backend.
    """
    return OrderService.create_order(
        db=db, user_id=current_user.id, order_in=order_in
    )


@router.get("", response_model=List[OrderResponse])
def list_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all orders for the authenticated customer (customer isolation).
    """
    return OrderService.get_user_orders(db=db, user_id=current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve single order details with items and prices.
    Enforces customer isolation (returns 403 if attempting to access another user's order).
    """
    is_admin = current_user.role == UserRole.ADMIN.value
    return OrderService.get_order_by_id(
        db=db, order_id=order_id, user_id=current_user.id, is_admin=is_admin
    )
