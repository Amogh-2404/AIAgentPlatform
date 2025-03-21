from fastapi import HTTPException, status, Request
import redis
from app.core.config import settings

redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

def rate_limit(request: Request, username: str):
    from datetime import datetime
    today = datetime.utcnow().strftime("%Y%m%d")
    key = f"rate:{username}:{today}"
    current = redis_client.get(key)
    if current is None:
        redis_client.set(key, 1, ex=86400)
    else:
        count = int(current)
        if count >= settings.RATE_LIMIT:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                                detail="Rate limit exceeded")
        else:
            redis_client.incr(key)

def check_rate_limit(request: Request, current_user):
    rate_limit(request, current_user.username)
