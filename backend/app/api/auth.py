from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr
from app.db.base import SessionLocal
from app.db.models import UserDB
from app.services.auth_service import (
    create_access_token_for_user,
    authenticate_user,
    update_user_password,
    verify_two_factor_code
)
from app.core.token import create_access_token
from app.core.config import settings
from app.utils.email import send_email
from app.core.security import get_current_user
from passlib.context import CryptContext
import uuid
import pyotp

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    accept_terms: bool

@router.post("/signup")
def signup(signup_request: SignupRequest):
    if not signup_request.accept_terms:
        raise HTTPException(status_code=400, detail="Terms must be accepted")
    db = SessionLocal()
    try:
        existing_user = db.query(UserDB).filter(UserDB.username == signup_request.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        hashed_password = pwd_context.hash(signup_request.password)
        verification_token = str(uuid.uuid4())
        new_user = UserDB(
            username=signup_request.username,
            email=signup_request.email,
            hashed_password=hashed_password,
            is_verified=False,
            verification_token=verification_token
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        verification_link = f"http://localhost:8000/api/auth/verify-email?token={verification_token}"
        send_email(new_user.email, "Verify Your Email", f"Click here to verify your account: {verification_link}")
        return {"message": "User registered successfully. Check your email to verify your account."}
    finally:
        db.close()

@router.get("/verify-email")
def verify_email(token: str):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.verification_token == token).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid verification token")
        user.is_verified = True
        user.verification_token = None
        db.commit()
        return {"message": "Email verified successfully"}
    finally:
        db.close()

class PasswordResetRequest(BaseModel):
    email: EmailStr

@router.post("/request-password-reset")
def request_password_reset(request_data: PasswordResetRequest):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.email == request_data.email).first()
        if not user:
            raise HTTPException(status_code=400, detail="Email not found")
        reset_token = str(uuid.uuid4())
        user.reset_token = reset_token
        db.commit()
        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        send_email(user.email, "Password Reset Request", f"Click here to reset your password: {reset_link}")
        return {"message": "Password reset link has been sent to your email"}
    finally:
        db.close()

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password")
def reset_password(reset_request: ResetPasswordRequest):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.reset_token == reset_request.token).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid reset token")
        user.hashed_password = pwd_context.hash(reset_request.new_password)
        user.reset_token = None
        db.commit()
        return {"message": "Password has been reset successfully"}
    finally:
        db.close()

class LoginRequest(BaseModel):
    username: str
    password: str
    two_factor_code: str = None

@router.post("/login")
def login(login_request: LoginRequest):
    db = SessionLocal()
    try:
        user = authenticate_user(login_request.username, login_request.password)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        if user.two_factor_enabled:
            if not login_request.two_factor_code:
                raise HTTPException(status_code=400, detail="Two-factor authentication code required")
            if not verify_two_factor_code(user, login_request.two_factor_code):
                raise HTTPException(status_code=400, detail="Invalid two-factor authentication code")
        access_token = create_access_token_for_user(user)
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        db.close()

@router.get("/profile")
def get_profile(current_user = Depends(get_current_user)):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "username": user.username,
            "email": user.email,
            "is_verified": user.is_verified,
            "two_factor_enabled": user.two_factor_enabled,
            "profile_picture_url": user.profile_picture_url
        }
    finally:
        db.close()

class ProfileUpdateRequest(BaseModel):
    email: EmailStr = None
    profile_picture_url: str = None

@router.put("/profile")
def update_profile(update_request: ProfileUpdateRequest, current_user = Depends(get_current_user)):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if update_request.email:
            user.email = update_request.email
        if update_request.profile_picture_url:
            user.profile_picture_url = update_request.profile_picture_url
        db.commit()
        return {"message": "Profile updated successfully"}
    finally:
        db.close()

@router.post("/enable-2fa")
def enable_two_factor(current_user = Depends(get_current_user)):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.two_factor_enabled:
            return {"message": "Two-factor authentication already enabled"}
        secret = pyotp.random_base32()
        user.two_factor_secret = secret
        user.two_factor_enabled = True
        db.commit()
        totp = pyotp.TOTP(secret)
        qr_code_url = totp.provisioning_uri(name=user.email, issuer_name="AI Agents Beast Mode Ultimate")
        return {"message": "Two-factor authentication enabled", "qr_code_url": qr_code_url}
    finally:
        db.close()

@router.post("/disable-2fa")
def disable_two_factor(current_user = Depends(get_current_user)):
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.two_factor_enabled = False
        user.two_factor_secret = None
        db.commit()
        return {"message": "Two-factor authentication disabled"}
    finally:
        db.close()
