from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer

from user.models import User


class UserDetailSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = (
      'id','name','email','avatar_url','description',
      'business_name','vat_number','registration_number',
      'address','city','postal_code','country','phone'
    )


class CustomRegisterSerializer(RegisterSerializer):
    name = serializers.CharField(required=True, max_length=255)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['name'] = self.validated_data.get('name', '')
        return data

    def save(self, request):
        user = super().save(request)
        user.name = self.validated_data.get('name', '')
        user.save()
        return user


class CustomLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'})