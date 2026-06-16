from . import models, serializers

DETAIL_SERIALIZER = {
    'BOOK' : (
        models.Book,
        serializers.BookSerializer,
    ),
    'VINYL' : (
        models.Vinyl,
        serializers.VinylSerializer,
    )

}


def get_item_details(item):
    
    item_type = item.item_type.detail_type
    
    if item_type not in DETAIL_SERIALIZER:
        return None
    
    model, serializer = DETAIL_SERIALIZER[item_type]

    try:
        details = model.objects.get(item=item)

        return serializer(details).data
    
    except model.DoesNotExist:
        return None