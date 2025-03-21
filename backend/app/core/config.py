import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "AI Agents Beast Mode Ultimate API")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # Celery settings
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

    # Database settings
    DB_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/ai_agents")

    # Rate limit (requests per day per account)
    RATE_LIMIT: int = int(os.getenv("RATE_LIMIT", "100"))

    # Redis URL for rate limiting (if different from CELERY)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")


settings = Settings()
