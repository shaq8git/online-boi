from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.core.security import verify_password, create_access_token
from app.crud.user import get_user_by_email, get_user_by_verification_token
from app.database import get_db
from app.schemas.auth import Token
from app.schemas.user import UserOut
from app.core.dependencies import get_current_user

from app.schemas.auth import ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import request_password_reset, reset_user_password
from app.utils.email import send_password_reset_email



router = APIRouter(tags=["auth"])

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, form_data.username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in"
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = get_user_by_verification_token(db, token)

    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")

    if user.is_verified:
        return {"message": "Email already verified"}

    if not user.verification_token_expires or user.verification_token_expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Verification token expired")

    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None

    db.commit()

    return {"message": "Email verified successfully from backend"}

@router.get("/me", response_model=UserOut)
def read_me(current_user = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    result = request_password_reset(db, payload.email)

    if result:
        user, token = result
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        send_password_reset_email(user.email, reset_link)

    return {
        "message": "If an account with that email exists, a password reset link has been sent."
    }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_user_password(db, payload.token, payload.new_password)
    return {"message": "Password reset successful"}