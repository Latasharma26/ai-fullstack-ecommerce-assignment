from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import check_db_connection
from app.api.api_router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for ShopAI - Mini AI E-Commerce Application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
cors_origins = list(settings.CORS_ORIGINS) if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in cors_origins:
    cors_origins.append(settings.FRONTEND_URL)
if "https://ai-fullstack-ecommerce-assignment.vercel.app" not in cors_origins:
    cors_origins.append("https://ai-fullstack-ecommerce-assignment.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def init_db_on_startup():
    """
    Ensures Alembic migrations are executed on application boot and
    populates seed catalog if the database is fresh.
    """
    import logging
    logger = logging.getLogger("app.startup")
    try:
        from alembic.config import Config
        from alembic import command
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
        logger.info("Production Alembic migration applied successfully.")
    except Exception as exc:
        logger.warning("Alembic upgrade notice: %s", exc)
        # Fallback to direct DDL if alembic.ini is not in working dir
        try:
            from app.core.database import engine, Base
            import app.models  # noqa: F401
            Base.metadata.create_all(bind=engine)
            logger.info("Direct SQLAlchemy metadata tables verified.")
        except Exception as e2:
            logger.error("Database schema creation failed: %s", e2)

    # Seed initial products and demo accounts if catalog is empty
    try:
        from app.core.database import SessionLocal
        from app.models.product import Product
        db = SessionLocal()
        try:
            if db.query(Product).count() == 0:
                logger.info("Empty database detected. Running initial seed...")
                from seed import seed_database
                seed_database()
                logger.info("Initial seed completed.")
        finally:
            db.close()
    except Exception as exc:
        logger.warning("Database seeding check notice: %s", exc)


@app.get("/", tags=["General"])
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint returning system status and PostgreSQL connectivity.
    """
    db_health = check_db_connection()
    return {
        "status": "healthy" if db_health["status"] == "connected" else "degraded",
        "api": "online",
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_health,
    }


# Include versioned API routers
app.include_router(api_router, prefix=settings.API_V1_STR)
