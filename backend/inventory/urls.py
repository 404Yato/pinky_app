from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.get_items, name='get_items'),
    path('items/<int:pk>/', views.get_item, name='get_item'),
    path('add_item/', views.add_item, name='add_item'),
    path('update_item/<int:pk>/', views.update_item, name='update_item'),
    path('delete_item/<int:pk>/', views.delete_item, name='delete_item')
]