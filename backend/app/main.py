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
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
