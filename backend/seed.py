import os
import sys

# Ensure UTF-8 stdout on Windows
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.models.enums import UserRole

SEED_PRODUCTS = [
    {
        "name": "Sony WH-1000XM5 Wireless Headphones",
        "description": "Industry-leading noise cancelling with Auto NC Optimizer, 30-hour battery life, and crystal-clear hands-free calling with 4 beamforming microphones.",
        "price": 29999.0,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "stock": 15,
        "is_active": True,
    },
    {
        "name": "Apple Watch Series 9 GPS 45mm",
        "description": "Advanced health sensors, S9 SiP chip, bright Always-On Retina display, crash detection, and intuitive Double Tap gesture control.",
        "price": 41900.0,
        "image_url": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
        "stock": 10,
        "is_active": True,
    },
    {
        "name": "Logitech MX Master 3S Mouse",
        "description": "Ergonomic wireless performance mouse with 8,000 DPI track-on-glass sensor, quiet clicks, and ultra-fast MagSpeed electromagnetic scrolling.",
        "price": 8995.0,
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
        "stock": 25,
        "is_active": True,
    },
    {
        "name": "Keychron K2 Pro Mechanical Keyboard",
        "description": "Wireless custom mechanical keyboard with QMK/VIA programmability, hot-swappable Keychron K Pro switches, and south-facing RGB backlighting.",
        "price": 9499.0,
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        "stock": 18,
        "is_active": True,
    },
    {
        "name": "Samsung 32\" 4K Curved Gaming Monitor",
        "description": "Immersive 1000R curved gaming display with Ultra HD 4K resolution, 144Hz refresh rate, 1ms response time, and AMD FreeSync Premium Pro.",
        "price": 34999.0,
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
        "stock": 8,
        "is_active": True,
    },
    {
        "name": "Oura Ring Gen 3 Smart Ring",
        "description": "Precision titanium smart ring tracking sleep stages, body temperature variations, daily activity, and cardiovascular readiness scores.",
        "price": 29900.0,
        "image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
        "stock": 12,
        "is_active": True,
    },
    {
        "name": "Anker 737 Power Bank (PowerCore 24K)",
        "description": "24,000mAh portable ultra-fast battery charger with 140W two-way USB-C Power Delivery and an informative smart digital status screen.",
        "price": 11999.0,
        "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80",
        "stock": 20,
        "is_active": True,
    },
    {
        "name": "Bose SoundLink Revolve+ II Speaker",
        "description": "360-degree portable wireless Bluetooth speaker providing astonishingly loud, immersive sound with IP55 water resistance and 17h battery.",
        "price": 24500.0,
        "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
        "stock": 14,
        "is_active": True,
    },
    {
        "name": "Garmin Forerunner 265 Running Watch",
        "description": "High-performance running watch featuring a brilliant 1.3\" AMOLED touchscreen, advanced training readiness metrics, and multi-band GNSS.",
        "price": 46990.0,
        "image_url": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
        "stock": 6,
        "is_active": True,
    },
]

SEED_USERS = [
    {
        "name": "Admin User",
        "email": "admin@shopai.com",
        "role": UserRole.ADMIN.value,
    },
    {
        "name": "John Customer",
        "email": "customer@shopai.com",
        "role": UserRole.CUSTOMER.value,
    },
]


def seed_database():
    db = SessionLocal()
    try:
        print("[*] Seeding database...")

        # 1. Seed Users
        for user_data in SEED_USERS:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                user = User(
                    name=user_data["name"],
                    email=user_data["email"],
                    role=user_data["role"],
                )
                db.add(user)
                print(f"  + Added user: {user_data['email']} ({user_data['role']})")
            else:
                print(f"  = User already exists: {user_data['email']}")

        # 2. Seed Products
        products_added = 0
        for prod_data in SEED_PRODUCTS:
            existing_prod = db.query(Product).filter(Product.name == prod_data["name"]).first()
            if not existing_prod:
                product = Product(
                    name=prod_data["name"],
                    description=prod_data["description"],
                    price=prod_data["price"],
                    image_url=prod_data["image_url"],
                    stock=prod_data["stock"],
                    is_active=prod_data["is_active"],
                )
                db.add(product)
                products_added += 1
                print(f"  + Added product: {prod_data['name']} (INR {prod_data['price']})")
            else:
                existing_prod.stock = prod_data["stock"]
                existing_prod.price = prod_data["price"]
                existing_prod.is_active = prod_data["is_active"]
                print(f"  = Refreshed stock: {prod_data['name']} (Stock: {prod_data['stock']})")

        db.commit()
        print(f"\n[OK] Seed completed successfully! ({products_added} new products added)")
    except Exception as exc:
        db.rollback()
        print(f"\n[ERROR] Error seeding database: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
