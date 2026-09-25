from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_admin
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def list_products(
    active_only: bool = Query(default=True, description="Filter for active products only"),
    skip: int = Query(default=0, ge=0, description="Pagination skip"),
    limit: int = Query(default=100, ge=1, le=100, description="Pagination limit"),
    db: Session = Depends(get_db),
):
    """
    Public catalog: List products from the database with pagination and optional active filter.
    """
    return ProductService.get_all(db=db, active_only=active_only, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Public catalog: Retrieve single product by ID or return 404 if not found.
    """
    product = ProductService.get_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Create a new product in the catalog.
    RBAC: Requires authenticated user with ADMIN role.
    """
    return ProductService.create(db=db, product_in=product_in)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Update an existing product by ID.
    RBAC: Requires authenticated user with ADMIN role.
    """
    product = ProductService.get_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return ProductService.update(db=db, product=product, product_in=product_in)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Delete a product by ID.
    RBAC: Requires authenticated user with ADMIN role.
    """
    product = ProductService.get_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    ProductService.delete(db=db, product=product)
    return None
