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
    
def create_item_details(item, details_data):
    detail_type = item.item_type.detail_type

    if detail_type not in DETAIL_SERIALIZER:
        return
    
    model, serializer_class = DETAIL_SERIALIZER[detail_type]

    serializer = serializer_class(
        data=details_data
    )

    serializer.is_valid(
        raise_exception=True
    )

    serializer.save(
        item=item
    )

def update_item_details(item, details_data):
    detail_type = item.item_type.detail_type

    if detail_type not in DETAIL_SERIALIZER:
        return
    
    model, serializer_class = DETAIL_SERIALIZER[detail_type]

    details = model.objects.get(item=item)

    serializer = serializer_class(
        details,
        data=details_data,
        partial=True
    )

    serializer.is_valid(
        raise_exception=True
    )

    serializer.save()

def get_active_item(pk):

    try:
        return models.Item.objects.select_related(
            'item_type'
        ).get(
            pk=pk,
            deleted_at__isnull=True
        )

    except models.Item.DoesNotExist:
        return None