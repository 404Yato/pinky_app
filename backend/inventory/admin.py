from django.contrib import admin
from .models import Item, ItemType, Book, Vinyl

admin.site.register(Item)
admin.site.register(ItemType)
admin.site.register(Book)
admin.site.register(Vinyl)