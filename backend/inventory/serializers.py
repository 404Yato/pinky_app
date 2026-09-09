from rest_framework import serializers
from .models import Item, ItemType, Book, Vinyl, BookQuote

class ItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Item
        fields = '__all__'

class ItemListSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            "id",
            "item_type",
            "name",
            "description",
            "favorite",
            "possession_status",
            "location",
            "loaned_to",
            "created_at",
            "updated_at",
            "details",
        ]

    def get_details(self, obj):
        if hasattr(obj, "book_details"):
            return BookSerializer(obj.book_details).data

        if hasattr(obj, "vinyl_details"):
            return VinylSerializer(obj.vinyl_details).data

        return None

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
    favorite = serializers.BooleanField()
    comments = serializers.CharField(
        required=False,
        allow_blank=True
    )
    possession_status = serializers.CharField(
        required=False,
        allow_blank=True
    )
    location = serializers.CharField(
        required=False,
        allow_blank=True
    )
    loaned_to = serializers.CharField(
        required=False,
        allow_blank=True
    )
    details = serializers.JSONField(
        required=False,
        help_text=(
        "Objeto JSON cuyos campos dependen del tipo de item."
    )
    )

class ItemResponseSerializer(serializers.Serializer):

    message = serializers.CharField()

    data = ItemSerializer()

class WhoAmIResponseSerializer(serializers.Serializer):

    id = serializers.IntegerField(
        help_text="Identificador único del usuario."
    )
    username = serializers.CharField(
        max_length=150,
        help_text="Nombre de usuario."
    )
    email = serializers.EmailField(
        help_text="Correo electrónico del usuario."
    )

class BookQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookQuote
        fields = [
            "id",
            "text",
            "page",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]