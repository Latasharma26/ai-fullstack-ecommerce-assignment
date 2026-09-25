from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.payment import (
    CreateCheckoutSessionRequest,
    CheckoutSessionResponse,
    PaymentStatusResponse,
)
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-checkout-session", response_model=CheckoutSessionResponse, status_code=status.HTTP_200_OK)
def create_checkout_session(
    payload: CreateCheckoutSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Creates a Stripe Checkout Session for an order.
    Returns checkout URL for payment redirection.
    """
    return PaymentService.create_checkout_session(
        db=db,
        user=current_user,
        order_id=payload.order_id,
    )


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db),
):
    """
    Stripe Webhook listener that securely verifies events and marks orders as PAID.
    """
    payload = await request.body()
    return PaymentService.handle_webhook(
        db=db,
        payload=payload,
        sig_header=stripe_signature,
    )


@router.post("/simulate/{order_id}", response_model=PaymentStatusResponse, status_code=status.HTTP_200_OK)
def simulate_payment(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Demo payment simulation endpoint for test evaluations without requiring live Stripe webhooks.
    Marks the order as PAID and CONFIRMED.
    """
    return PaymentService.simulate_payment(
        db=db,
        user=current_user,
        order_id=order_id,
    )
