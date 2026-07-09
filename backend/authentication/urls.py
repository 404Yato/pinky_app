from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [

    path('register/', views.register, name='register'),

    path('login/', views.LoginView.as_view(), name='login'),

    path('refresh/', views.RefreshView.as_view(), name='refresh'),

    path('logout/', views.logout, name='logout'),
]