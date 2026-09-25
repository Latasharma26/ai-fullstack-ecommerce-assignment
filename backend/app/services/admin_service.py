import logging
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.order import Order
from app.models.product import Product
from app.models.enums import OrderStatus, PaymentStatus
from app.schemas.admin import AdminStatsResponse

logger = logging.getLogger(__name__)


class AdminService:
    @staticmethod
    def get_stats(db: Session) -> AdminStatsResponse:
        """
        Calculates store KPIs and metrics for the admin overview dashboard.
        """
        # Total revenue from PAID orders
        revenue_query = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.payment_status == PaymentStatus.PAID.value
        )
        total_revenue = float(revenue_query.scalar() or 0.0)

        total_orders = db.query(Order).count()
        paid_orders = db.query(Order).filter(Order.payment_status == PaymentStatus.PAID.value).count()
        pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING.value).count()
        total_products = db.query(Product).count()

        return AdminStatsResponse(
            total_revenue=total_revenue,
            total_orders=total_orders,
            total_products=total_products,
            pending_orders=pending_orders,
            paid_orders=paid_orders,
        )

    @staticmethod
    def get_all_orders(db: Session) -> List[Order]:
        """
        Retrieves all orders in the system with customer and item details.
        """
        return db.query(Order).order_by(Order.id.desc()).all()

    @staticmethod
    def update_order_status(db: Session, order_id: int, new_status: str) -> Order:
        """
        Updates the fulfillment status of an order.
        """
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID {order_id} not found",
            )

        valid_statuses = [s.value for s in OrderStatus]
        normalized_status = new_status.upper().strip()
        if normalized_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid order status '{new_status}'. Allowed values: {valid_statuses}",
            )

        order.status = normalized_status
        db.commit()
        db.refresh(order)
        logger.info("Admin updated order #%s status to %s", order.id, normalized_status)
        return order
