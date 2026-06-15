from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ItemType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    item_type = models.ForeignKey(
        ItemType,
        on_delete=models.RESTRICT
    )

    name = models.CharField(max_length=255)

    description = models.CharField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Book(models.Model):
    item = models.OneToOneField(
        Item,
        on_delete=models.CASCADE,
        primary_key=True
    )

    isbn = models.CharField(max_length=20, null=True, blank=True)

    author = models.CharField(null=True, blank=True)

    publisher = models.CharField(null=True, blank=True)

    pages = models.CharField(null=True, blank=True)

    def __str__(self):
        return self.name