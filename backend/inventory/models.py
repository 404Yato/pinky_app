from django.db import models

class ItemType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE
    )

    item_type = models.ForeignKey(
        ItemType,
        on_delete=models.RESTRICT
    )

    name = models.CharField(max_length=255)

    description = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    deleted_at = models.DateTimeField(auto_now=True)