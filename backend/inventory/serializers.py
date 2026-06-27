from rest_framework import serializers
from .models import Item, ItemType, Book, Vinyl

class ItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Item
        fields = '__all__'

class ItemTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemType
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ['item']

class VinylSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vinyl
        fields = '__all__'
        read_only_fields = ['item']

class ItemCreateSerializer(serializers.Serializer):
    item_type = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField(
        required=False,
        allow_blank=True
    )
    details = serializers.JSONField(
        required=False,
        help_text=(
        "Objeto JSON cuyos campos dependen del tipo de item."
    )
    )