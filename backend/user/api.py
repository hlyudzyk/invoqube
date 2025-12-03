from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from user.models import User
from user.serializers import UserDetailSerializer


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def user_detail(request, pk):
  user = User.objects.get(pk=pk)
  serializer = UserDetailSerializer(user,many=False)
  return JsonResponse(serializer.data,safe=False)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def edit_account(request):
  user = request.user
  
  # Update user fields
  user.name = request.data.get('name', user.name)
  user.description = request.data.get('description', user.description)
  user.business_name = request.data.get('business_name', user.business_name)
  user.vat_number = request.data.get('vat_number', user.vat_number)
  user.registration_number = request.data.get('registration_number', user.registration_number)
  user.address = request.data.get('address', user.address)
  user.city = request.data.get('city', user.city)
  user.postal_code = request.data.get('postal_code', user.postal_code)
  user.country = request.data.get('country', user.country)
  user.phone = request.data.get('phone', user.phone)
  
  # Handle avatar upload
  if 'avatar' in request.FILES:
    user.avatar = request.FILES['avatar']
  
  user.save()
  
  serializer = UserDetailSerializer(user, many=False)
  return JsonResponse(serializer.data, safe=False)