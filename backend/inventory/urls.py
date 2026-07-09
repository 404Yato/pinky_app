from django.urls import path
from . import views

urlpatterns = [
    path('inventory/items/', views.ItemListView.as_view(), name='Item'),
    path('inventory/items/<int:id>/', views.ItemDetailView.as_view(), name='Item Details'),
    path('inventory/whoami/', views.WhoAmIView.as_view(), name='Who Am I')
]