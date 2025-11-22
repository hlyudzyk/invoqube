from rest_framework import serializers

from user.models import User


class UserDetailSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = (
      'id','name','avatar_url','description'
    )