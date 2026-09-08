from django.urls import path
from . import views

urlpatterns = [
    path('inventory/items/', views.ItemListView.as_view(), name='Item'),
    path('inventory/items/<int:id>/', views.ItemDetailView.as_view(), name='Item Details'),
    path('inventory/whoami/', views.WhoAmIView.as_view(), name='Who Am I'),
    path('inventory/books/<int:book_id>/quotes/', views.BookQuoteListCreateView.as_view(), name='Book Quotes'),
    path('inventory/books/<int:book_id>/quotes/<int:quote_id>/', views.BookQuoteDetailView.as_view(), name='Book Quote Details'),
    path('health/', views.Health.as_view(), name='Health Service'),
]