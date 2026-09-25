from pydantic import BaseModel


class CreateCheckoutSessionRequest(BaseModel):
    order_id: int


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str
    simulated: bool = False


class PaymentStatusResponse(BaseModel):
    order_id: int
    payment_status: str
    order_status: str
    message: str
