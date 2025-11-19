# app/dependencies.py
from ninja.security import HttpBearer
from typing import Optional
from ninja import Schema
from .jwt_utils import decode_token
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from jwt import ExpiredSignatureError, InvalidTokenError

User = get_user_model()

class JWTAuth(HttpBearer):
    def authenticate(self, request, token: str):
        # return user if ok, or None to indicate authentication failure
        try:
            payload = decode_token(token)
        except ExpiredSignatureError:
            return None
        except InvalidTokenError:
            return None

        if payload.get("type") != "access":
            return None

        user_id = payload.get("user_id")
        user = get_object_or_404(User, pk=user_id)
        if not user.is_active:
            return None
        return user  # ninja will set request.auth to this return value

# Usage in routes:
# from .dependencies import JWTAuth
# @router.get("/protected", auth=JWTAuth())
# def protected(request):
#     user = request.auth
#     ...
