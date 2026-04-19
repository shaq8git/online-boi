from sqlalchemy.orm import Session
from app.models.user import User

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_verification_token(db: Session, token: str):
    return db.query(User).filter(User.verification_token == token).first()

def get_user_by_password_reset_token(db: Session, token: str):
    return db.query(User).filter(User.password_reset_token == token).first()