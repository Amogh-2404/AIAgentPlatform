import uvicorn
from fastapi import FastAPI
from app.api import agents, auth, websocket
from app.core.config import settings
from app.core.logger import setup_logging
from app.db.base import init_db
from fastapi.middleware.cors import CORSMiddleware

# Setup logging and initialize the database
setup_logging()
init_db()

app = FastAPI(
    title=settings.APP_NAME,
    description="Beast Mode Ultimate AI Agents API with WebSockets, JWT, DB, Celery, rate limiting, email verification, password reset, 2FA and profile management. Visit /docs for API documentation.",
    version="5.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # add more if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])



@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
