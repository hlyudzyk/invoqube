# app/api/auth.py
from ninja import Router
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from typing import Optional
from user.schemas import RegisterIn, LoginIn, TokenOut, UserOut
from user.jwt_utils import create_access_token, create_refresh_token, decode_token, is_refresh_token_valid, revoke_refresh_token
from user.models import RefreshToken

User = get_user_model()
auth_router = Router()

@auth_router.post("/register", response={201: UserOut, 400: dict})
def register(request, payload: RegisterIn):
    # basic checks
    if User.objects.filter(email__iexact=payload.email).exists():
        return 400, {"detail": "Email already used"}
    if User.objects.filter(username__iexact=payload.username).exists():
        return 400, {"detail": "Username already used"}

    user = User.objects.create(
        username=payload.username,
        email=payload.email,
        password=make_password(payload.password),
        is_active=True,  # set False if you want email verification before activation
    )
    return 201, UserOut(id=user.id, username=user.username, email=user.email)

@auth_router.post("/login", response={200: TokenOut, 401: dict})
def login(request, payload: LoginIn):
    # allow login by username or email
    credential = payload.username_or_email
    # try authenticate by username first
    user = None
    # Django's authenticate usually expects username, so try both
    if "@" in credential:
        try:
            u = User.objects.get(email__iexact=credential)
            user = authenticate(request, username=u.username, password=payload.password)
        except User.DoesNotExist:
            user = None
    else:
        user = authenticate(request, username=credential, password=payload.password)

    if not user:
        return 401, {"detail": "Invalid credentials"}

    access_token, _ = create_access_token(user)
    refresh_token, refresh_payload = create_refresh_token(user)
    return 200, {"access": access_token, "refresh": refresh_token}

@auth_router.post("/refresh", response={200: TokenOut, 401: dict})
def refresh(request, token: str):
    """
    Accepts refresh token string as JSON field { "token": "<refresh>" } OR as Authorization Bearer?
    For clarity this handler expects JSON body parameter 'token' (as query or body param via ninja).
    """
    try:
        payload = decode_token(token)
    except Exception as e:
        return 401, {"detail": "Invalid or expired token"}

    if payload.get("type") != "refresh":
        return 401, {"detail": "Not a refresh token"}

    user_id = payload.get("user_id")
    jti = payload.get("jti")
    user = get_object_or_404(User, pk=user_id)
    if not is_refresh_token_valid(jti, user):
        return 401, {"detail": "Refresh token revoked or expired"}

    # rotate: revoke old RT and issue new if desired
    if settings.JWT_ROTATE_REFRESH_TOKENS:
        revoke_refresh_token(jti)
        new_refresh_token, _ = create_refresh_token(user)
    else:
        new_refresh_token = token

    access_token, _ = create_access_token(user)
    return 200, {"access": access_token, "refresh": new_refresh_token}

@auth_router.post("/logout", response={204: None, 400: dict})
def logout(request, token: str):
    """
    Logout by revoking refresh token (client must send refresh token).
    """
    try:
        payload = decode_token(token)
    except Exception:
        return 400, {"detail": "Invalid token"}

    if payload.get("type") != "refresh":
        return 400, {"detail": "Must provide refresh token"}

    revoke_refresh_token(payload.get("jti"))
    return 204, None

# protected demo
from ninja.security import HttpBearer

@auth_router.get("/me", response=UserOut)
def me(request):
    # Will rely on middleware dependency (see dependencies.py) to set request.user
    user = request.user
    return UserOut(id=user.id, username=user.username, email=user.email)
