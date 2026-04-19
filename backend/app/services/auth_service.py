from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password
from app.utils.tokens import generate_password_reset_token
from app.services.user_service import (
    get_user_by_email,
    get_user_by_password_reset_token,
)

def create_password_reset_for_user(db: Session, user: User):
    token, expires = generate_password_reset_token()

    user.password_reset_token = token
    user.password_reset_token_expires = expires
    db.commit()
    db.refresh(user)

    return token

# reset-password
def reset_user_password(db: Session, token: str, new_password: str):
    user = get_user_by_password_reset_token(db, token)

    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    if (
        not user.password_reset_token_expires
        or user.password_reset_token_expires < datetime.now(timezone.utc)
    ):
        raise HTTPException(status_code=400, detail="Reset token expired")

    user.password_hash = hash_password(new_password)
    user.password_reset_token = None
    user.password_reset_token_expires = None

    db.commit()
    db.refresh(user)

    return user


# forgot-password
def request_password_reset(db: Session, email: str):
    user = get_user_by_email(db, email)

    if not user:
        return None

    token = create_password_reset_for_user(db, user)
    return user, token