from pydantic import BaseModel
from typing import List
from app.schemas.order import OrderResponse


class UpdateOrderStatusRequest(BaseModel):
    status: str  # PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED


class AdminStatsResponse(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    pending_orders: int
    paid_orders: int
