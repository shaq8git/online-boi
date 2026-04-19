import secrets
from datetime import datetime, timedelta, timezone

def generate_verification_token():
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=24)
    return token, expires


def generate_password_reset_token():
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    return token, expires