from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.get_items, name='get_items'),
    path('items/<int:pk>/', views.get_item, name='get_item'),
]