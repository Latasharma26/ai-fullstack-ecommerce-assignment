from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.enums import OrderStatus, PaymentStatus
from app.schemas.order import OrderCreate


class OrderService:
    @staticmethod
    def create_order(db: Session, user_id: int, order_in: OrderCreate) -> Order:
        """
        Creates an order with atomic transaction, strict stock validation,
        and backend-calculated pricing.
        """
        if not order_in.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order must contain at least one item",
            )

        # 1. Fetch and validate each product
        validated_items = []
        total_amount = 0.0

        for item_in in order_in.items:
            if item_in.quantity <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid quantity {item_in.quantity} for product ID {item_in.product_id}. Quantity must be >= 1.",
                )

            # Fetch product from DB
            product = db.query(Product).filter(Product.id == item_in.product_id).first()

            # Validate existence
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with ID {item_in.product_id} not found",
                )

            # Validate active status
            if not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product '{product.name}' (ID: {product.id}) is inactive and unavailable for purchase",
                )

            # Validate sufficient stock
            if product.stock < item_in.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.name}'. Requested: {item_in.quantity}, Available: {product.stock}",
                )

            # Calculate item total using backend product price
            item_total = product.price * item_in.quantity
            total_amount += item_total

            validated_items.append((product, item_in.quantity, product.price))

        # 2. Database transaction: create Order and OrderItems, update stock
        try:
            order = Order(
                user_id=user_id,
                total_amount=round(total_amount, 2),
                status=OrderStatus.PENDING.value,
                payment_status=PaymentStatus.PENDING.value,
            )
            db.add(order)
            db.flush()  # Flush to generate order.id

            for product, quantity, unit_price in validated_items:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=quantity,
                    price=unit_price,
                )
                db.add(order_item)

                # Deduct inventory stock
                product.stock -= quantity

            db.commit()
            db.refresh(order)

            # Reload with items and products eager loaded
            return (
                db.query(Order)
                .options(joinedload(Order.items).joinedload(OrderItem.product))
                .filter(Order.id == order.id)
                .first()
            )

        except Exception as exc:
            db.rollback()
            if isinstance(exc, HTTPException):
                raise exc
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to place order: {str(exc)}",
            )

    @staticmethod
    def get_user_orders(db: Session, user_id: int) -> List[Order]:
        """
        Retrieves all orders placed by the customer, ordered by newest first.
        """
        return (
            db.query(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .filter(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .all()
        )

    @staticmethod
    def get_order_by_id(
        db: Session, order_id: int, user_id: int, is_admin: bool = False
    ) -> Order:
        """
        Retrieves order details by ID, enforcing user isolation.
        Customers can only view their own orders.
        """
        order = (
            db.query(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .filter(Order.id == order_id)
            .first()
        )

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID {order_id} not found",
            )

        # Enforce RBAC: Non-admin users can ONLY view their own orders
        if not is_admin and order.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only access your own orders",
            )

        return order
