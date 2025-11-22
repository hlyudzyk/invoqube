from django.urls import path
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView,LogoutView

from user.api import user_detail

urlpatterns = [
  path('register/',RegisterView.as_view(),name='rest_register'),
  path('login/',LoginView.as_view(),name='rest_login'),
  path('logout/',LogoutView.as_view(),name='rest_logout'),
  # path('edit/',edit_account,name='edit_account'),
  path('<uuid:pk>/',user_detail,name='host_detail'),
  path('token/refresh/', get_refresh_view().as_view(), name='token_refresh'),
]

