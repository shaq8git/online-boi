from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.utils.tokens import generate_verification_token

def create_user(db: Session, user: UserCreate):
    token, expires = generate_verification_token()

    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        is_verified=False,
        verification_token=token,
        verification_token_expires=expires,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_verification_token(db: Session, token: str):
    return db.query(User).filter(User.verification_token == token).first()

