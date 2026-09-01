from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ItemType(models.Model):
    detail_type = models.CharField(
        max_length=50,
        default='OTHERS'
    )
    name = models.CharField(
        max_length=50, 
        unique=True, 
        default='Others'
    )

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

    name = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    favorite = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name
    
class Book(models.Model):
    item = models.OneToOneField(
        Item,
        on_delete=models.CASCADE,
        primary_key=True
    )

    isbn = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    author = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    publisher = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    pages = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    publication_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    genre = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    cover_url = models.URLField(
        null=True,
        blank=True
    )

    reading_status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("READING", "Reading"),
            ("READ", "Read"),
        ],
        default="PENDING"
    )

class Vinyl(models.Model):

    item = models.OneToOneField(
        Item,
        on_delete=models.CASCADE,
        primary_key=True
    )

    artist = models.CharField(
        max_length=255
    )

    label = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    release_year = models.IntegerField(
        null=True,
        blank=True
    )

    barcode = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    discs = models.IntegerField(
        null=True,
        blank=True
    )

    rpm = models.IntegerField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.item.name