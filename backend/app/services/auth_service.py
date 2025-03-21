from app.db.base import SessionLocal
from app.db.models import UserDB
from app.core.token import create_access_token
from datetime import timedelta
from app.core.config import settings
from passlib.context import CryptContext
import pyotp

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def authenticate_user(username: str, password: str):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.username == username).first()
        if not user:
            return None
        if not pwd_context.verify(password, user.hashed_password):
            return None
        if not user.is_verified:
            return None
        return user
    finally:
        db.close()

def create_access_token_for_user(user, expires_delta=None):
    access_token_expires = expires_delta if expires_delta else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

def update_user_password(user, new_password: str):
    db = SessionLocal()
    try:
        user.hashed_password = pwd_context.hash(new_password)
        db.commit()
    finally:
        db.close()

def verify_two_factor_code(user, code: str):
    totp = pyotp.TOTP(user.two_factor_secret)
    return totp.verify(code)

def get_user_by_username(username: str):
    """Retrieve a user by username from the database."""
    db = SessionLocal()
    try:
        return db.query(UserDB).filter(UserDB.username == username).first()
    finally:
        db.close()
