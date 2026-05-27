from django.contrib import admin
from .models import Item, ItemType

admin.site.register(Item)
admin.site.register(ItemType)