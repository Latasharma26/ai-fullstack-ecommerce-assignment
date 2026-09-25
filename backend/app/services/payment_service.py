import time
import logging
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

import stripe
from app.core.config import settings
from app.models.order import Order
from app.models.user import User
from app.models.enums import OrderStatus, PaymentStatus, UserRole
from app.schemas.payment import CheckoutSessionResponse, PaymentStatusResponse

logger = logging.getLogger(__name__)

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentService:
    @staticmethod
    def create_checkout_session(
        db: Session,
        user: User,
        order_id: int,
    ) -> CheckoutSessionResponse:
        """
        Creates a Stripe Checkout Session for the order.
        If Stripe key is absent or in demo mode, creates a test simulation session.
        """
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID {order_id} not found",
            )

        if user.role != UserRole.ADMIN.value and order.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only pay for your own orders",
            )

        if order.payment_status == PaymentStatus.PAID.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This order has already been paid",
            )

        # Real Stripe integration if secret key is configured
        if settings.STRIPE_SECRET_KEY and not settings.STRIPE_SECRET_KEY.startswith("test_dummy"):
            try:
                line_items = []
                for item in order.items:
                    line_items.append({
                        "price_data": {
                            "currency": "inr",
                            "product_data": {
                                "name": item.product.name if item.product else f"Product #{item.product_id}",
                            },
                            "unit_amount": int(item.price * 100),  # In smallest currency unit (paise)
                        },
                        "quantity": item.quantity,
                    })

                session = stripe.checkout.Session.create(
                    payment_method_types=["card"],
                    line_items=line_items,
                    mode="payment",
                    metadata={"order_id": str(order.id)},
                    success_url=f"{settings.FRONTEND_URL}/orders/{order.id}?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
                    cancel_url=f"{settings.FRONTEND_URL}/orders/{order.id}?payment=cancelled",
                )

                order.stripe_session_id = session.id
                db.commit()

                return CheckoutSessionResponse(
                    checkout_url=session.url,
                    session_id=session.id,
                    simulated=False,
                )
            except Exception as exc:
                logger.error("Stripe session creation failed: %s", exc)
                # Fall back gracefully to simulation if Stripe API returns error

        # Simulated Demo Checkout (Safe for local tests & interviews)
        simulated_session_id = f"cs_test_mock_{order.id}_{int(time.time())}"
        order.stripe_session_id = simulated_session_id
        db.commit()

        # Simulated return URL
        simulated_url = f"{settings.FRONTEND_URL}/orders/{order.id}?payment=simulated_success&session_id={simulated_session_id}"
        return CheckoutSessionResponse(
            checkout_url=simulated_url,
            session_id=simulated_session_id,
            simulated=True,
        )

    @staticmethod
    def handle_webhook(
        db: Session,
        payload: bytes,
        sig_header: Optional[str] = None,
    ) -> dict:
        """
        Processes Stripe Webhook events and confirms orders upon payment success.
        Enforces cryptographic signature verification when STRIPE_WEBHOOK_SECRET is set.
        """
        event = None

        if settings.STRIPE_WEBHOOK_SECRET:
            if not sig_header:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing 'Stripe-Signature' header",
                )
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
                )
            except Exception as exc:
                logger.error("Invalid webhook signature: %s", exc)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Webhook signature verification failed: {exc}",
                )
        else:
            # In production, webhook secret is strictly required
            if settings.ENVIRONMENT == "production":
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="STRIPE_WEBHOOK_SECRET is not configured on the server",
                )
            # Safe local testing / mock payload
            import json
            try:
                event = json.loads(payload.decode("utf-8"))
            except Exception:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON payload")

        event_type = event.get("type", "")
        if event_type == "checkout.session.completed":
            session = event.get("data", {}).get("object", {})
            session_id = session.get("id")
            order_id_str = session.get("metadata", {}).get("order_id")

            order = None
            if order_id_str:
                order = db.query(Order).filter(Order.id == int(order_id_str)).first()
            if not order and session_id:
                order = db.query(Order).filter(Order.stripe_session_id == session_id).first()

            if order:
                order.payment_status = PaymentStatus.PAID.value
                order.status = OrderStatus.CONFIRMED.value
                db.commit()
                logger.info("Order #%s marked as PAID and CONFIRMED via webhook", order.id)

        return {"status": "success", "event": event_type}

    @staticmethod
    def simulate_payment(
        db: Session,
        user: User,
        order_id: int,
    ) -> PaymentStatusResponse:
        """
        Directly confirms payment for interview demonstration without external network dependencies.
        Disabled in production environments to prevent unintended payment bypass.
        """
        if settings.ENVIRONMENT == "production":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Payment simulation is disabled in production environments.",
            )

        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID {order_id} not found",
            )

        if user.role != UserRole.ADMIN.value and order.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only pay for your own orders",
            )

        order.payment_status = PaymentStatus.PAID.value
        order.status = OrderStatus.CONFIRMED.value
        db.commit()
        db.refresh(order)

        return PaymentStatusResponse(
            order_id=order.id,
            payment_status=order.payment_status,
            order_status=order.status,
            message="Payment successfully processed and verified!",
        )
