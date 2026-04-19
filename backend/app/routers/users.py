from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db

from app.schemas.user import UserCreate, UserOut
from app.schemas.auth import ForgotPasswordRequest

from app.crud import user as crud_user

from app.services.auth_service import request_password_reset
from app.services.user_service import get_user_by_email

from app.utils.email import send_verification_email, send_password_reset_email

router = APIRouter(tags=["users"])

@router.post("/", response_model=UserOut, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    created_user = crud_user.create_user(db, user)

    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={created_user.verification_token}"

    print("VERIFY URL:", verify_url)

    send_verification_email(created_user.email, verify_url)

    return created_user



  


""" @router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):

    result = request_password_reset(db, payload.email)

    if result:
        user, token = result

        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

        send_password_reset_email(user.email, reset_link)

    return {
        "message": "If an account with that email exists, a password reset link has been sent."
    } """

@router.get("/", response_model=list[UserOut])
def read_users(db: Session = Depends(get_db)):
    return crud_user.get_users(db)




""" router = APIRouter()

@router.post("/", response_model=UserOut, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = crud_user.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    created_user = crud_user.create_user(db, user)

    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={created_user.verification_token}"
    print("VERIFY URL:", verify_url)
    send_verification_email(created_user.email, verify_url)

    
    return created_user


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_verification_token(db, token)

    if not user:
        return {"message": "This verification link is invalid or has already been used."}

    expires = user.verification_token_expires
    if expires:
        expires = expires.replace(tzinfo=timezone.utc)

    if expires and expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Verification token expired")

    if user.is_verified:
        return {"message": "Email already verified"}

    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None

    db.commit()
    db.refresh(user)

    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user:
        token, expires = generate_password_reset_token()
        user.password_reset_token = token
        user.password_reset_token_expires = expires
        db.commit()

        reset_link = f"http://localhost:5173/reset-password?token={token}"

        send_password_reset_email(user.email, user.name, reset_link)

    return {
        "message": "If an account with that email exists, a password reset link has been sent."
    }

@router.get("/", response_model=list[UserOut])
def read_users(db: Session = Depends(get_db)):
    return crud_user.get_users(db) """