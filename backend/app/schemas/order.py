from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.product import ProductResponse


class OrderItemCreate(BaseModel):
    product_id: int = Field(..., description="ID of the product to purchase")
    quantity: int = Field(..., gt=0, description="Quantity must be greater than zero")


class OrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(
        ..., min_length=1, description="Order must contain at least one item"
    )


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductResponse] = None

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    payment_status: str
    stripe_session_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
