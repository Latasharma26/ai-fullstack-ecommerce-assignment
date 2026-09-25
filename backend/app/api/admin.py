from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_admin
from app.models.user import User
from app.schemas.order import OrderResponse
from app.schemas.admin import AdminStatsResponse, UpdateOrderStatusRequest
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStatsResponse, status_code=status.HTTP_200_OK)
def get_admin_stats(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Retrieve store analytics, revenue, order counts, and inventory health.
    Requires ADMIN role.
    """
    return AdminService.get_stats(db=db)


@router.get("/orders", response_model=List[OrderResponse], status_code=status.HTTP_200_OK)
def get_all_orders(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    List all store orders across all users with line items and customer details.
    Requires ADMIN role.
    """
    return AdminService.get_all_orders(db=db)


@router.patch("/orders/{order_id}/status", response_model=OrderResponse, status_code=status.HTTP_200_OK)
def update_order_status(
    order_id: int,
    payload: UpdateOrderStatusRequest,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Update order fulfillment status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED).
    Requires ADMIN role.
    """
    return AdminService.update_order_status(
        db=db,
        order_id=order_id,
        new_status=payload.status,
    )
