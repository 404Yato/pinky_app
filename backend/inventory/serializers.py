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

class VinylSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vinyl
        fields = '__all__'