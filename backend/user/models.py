from django.db import models

from django.db import models
from django.conf import settings
import uuid
from django.utils import timezone

User = settings.AUTH_USER_MODEL  # string like "auth.User" or custom

class RefreshToken(models.Model):
    """
    Stores issued refresh tokens (one row per issued refresh token).
    We store jti (token unique id) and link to user; this allows revocation and rotation.
    """
    jti = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="refresh_tokens")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    revoked = models.BooleanField(default=False)
    replaced_by = models.UUIDField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["revoked"]),
        ]

    def is_expired(self):
        return timezone.now() >= self.expires_at
