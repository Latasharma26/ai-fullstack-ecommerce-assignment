from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    @staticmethod
    def get_all(
        db: Session, active_only: bool = True, skip: int = 0, limit: int = 100
    ) -> List[Product]:
        query = db.query(Product)
        if active_only:
            query = query.filter(Product.is_active == True)  # noqa: E712
        return query.order_by(Product.id.asc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def create(db: Session, product_in: ProductCreate) -> Product:
        product = Product(
            name=product_in.name,
            description=product_in.description,
            price=product_in.price,
            image_url=product_in.image_url,
            stock=product_in.stock,
            is_active=product_in.is_active,
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def update(db: Session, product: Product, product_in: ProductUpdate) -> Product:
        update_data = product_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def delete(db: Session, product: Product) -> None:
        db.delete(product)
        db.commit()
