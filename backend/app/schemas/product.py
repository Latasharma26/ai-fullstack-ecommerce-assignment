from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Product title")
    description: str = Field(..., min_length=1, description="Detailed product description")
    price: float = Field(..., gt=0, description="Product price (greater than zero)")
    image_url: str = Field(..., description="High-resolution image URL")
    stock: int = Field(default=0, ge=0, description="Available stock units")
    is_active: bool = Field(default=True, description="Whether the product is published for customers")


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, min_length=1)
    price: Optional[float] = Field(default=None, gt=0)
    image_url: Optional[str] = None
    stock: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
