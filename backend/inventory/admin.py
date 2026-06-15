from django.contrib import admin
from .models import Item, ItemType, Book

admin.site.register(Item)
admin.site.register(ItemType)
admin.site.register(Book)