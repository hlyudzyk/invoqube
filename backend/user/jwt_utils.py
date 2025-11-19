# app/jwt_utils.py
import jwt
import uuid
from datetime import datetime, timedelta, timezone
from django.conf import settings
from user.models import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

def _utc_now():
    return datetime.now(timezone.utc)

def create_access_token(user: User):
    now = _utc_now()
    exp = now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    jti = str(uuid.uuid4())
    payload = {
        "user_id": str(user.pk),
        "type": "access",
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, payload

def create_refresh_token(user: User):
    now = _utc_now()
    exp = now + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    jti = uuid.uuid4()
    payload = {
        "user_id": str(user.pk),
        "type": "refresh",
        "jti": str(jti),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    # persist refresh token record
    RefreshToken.objects.create(
        jti=jti,
        user=user,
        expires_at=exp,
    )
    return token, payload

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise
    except jwt.InvalidTokenError:
        raise

def revoke_refresh_token(jti: str):
    try:
        rt = RefreshToken.objects.get(jti=jti)
        rt.revoked = True
        rt.save(update_fields=["revoked"])
    except RefreshToken.DoesNotExist:
        pass

def is_refresh_token_valid(jti: str, user):
    try:
        rt = RefreshToken.objects.get(jti=jti, user=user)
        if rt.revoked:
            return False
        if rt.is_expired():
            return False
        return True
    except RefreshToken.DoesNotExist:
        return False

def create_email_token(user, purpose: str, expire_minutes: int = 60):
    now = _utc_now()
    exp = now + timedelta(minutes=expire_minutes)
    payload = {
        "user_id": str(user.pk),
        "type": purpose,  # "email_verify" or "password_reset"
        "jti": str(uuid.uuid4()),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token
