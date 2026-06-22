from django.urls import path
from . import views

urlpatterns = [
    path('inventory/items/', views.get_items, name='get_items'),
    path('inventory/items/<int:pk>/', views.get_item, name='get_item'),
    path('inventory/items/add/', views.add_item, name='add_item'),
    path('inventory/items/update/<int:pk>/', views.update_item, name='update_item'),
    path('inventory/items/delete/<int:pk>/', views.delete_item, name='delete_item'),
    path('inventory/items/whoami/', views.whoami, name='whoami')
]