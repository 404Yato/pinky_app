from . import models, serializers
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError, NotFound

DETAIL_SERIALIZER = {
    # Maps each detail type to the model and serializer used by helper methods.
    'BOOK' : (
        models.Book,
        serializers.BookSerializer,
    ),
    'VINYL' : (
        models.Vinyl,
        serializers.VinylSerializer,
    )

}

def get_items(user):
    # Return only active items owned by the current user.
    items = models.Item.objects.filter(
        user=user,
        deleted_at__isnull=True
    )

    serializer = serializers.ItemSerializer(items, many = True)

    return serializer.data

def add_item(data, user):
    # Validate the request payload before creating the base item and its details.
    serializer = serializers.ItemCreateSerializer(
            data = data
        )
    if not serializer.is_valid():
        raise ValidationError(serializer.error)

    validated_data = serializer.validated_data
    
    with transaction.atomic():
        # Keep item and detail creation in the same database transaction.
        item = models.Item.objects.create(
            user=user,
            item_type_id=validated_data['item_type'],
            name=validated_data['name'],
            description=validated_data.get(
                'description',
                ''
            )
        )

        create_item_details(
            item,
            validated_data.get('details')
        )

        return serializers.ItemSerializer(item).data

def get_item(pk, user):

    # Reuse the active-item lookup so deleted items are hidden consistently.
    item = get_active_item(pk, user)

    if not item:
        raise NotFound("Item Not Found.")

    data = serializers.ItemSerializer(item).data

    data['details'] = get_item_details(item)

    return data

def update_item(pk, user, data):

    # Load the item owned by the user; updates can target base fields and details.
    try:
        item = models.Item.objects.get(pk=pk, user=user)
    except models.Item.DoesNotExist:
        raise NotFound("Item Not Found.")
    
    item_data = data.copy()

    # Details are handled separately because each item type has its own serializer.
    details_data = item_data.pop(
        'details',
        None
    )

    serializer = serializers.ItemSerializer(
        item,
        data=item_data,
        partial=True
    )

    if not serializer.is_valid():
        raise ValidationError(serializer.error)

    with transaction.atomic():
        # Save base item data and matching detail data as one atomic update.
        serializer.save()

        update_item_details(
            item,
            details_data
        )

    return serializers.ItemSerializer(item).data

def delete_item(pk, user):

    # Soft-delete the item so it can be excluded without removing database history.
    item = get_active_item(pk, user)

    if not item:
        raise NotFound("Item Not Found.")

    item.deleted_at = timezone.now()

    item.save(update_fields=["deleted_at"])

    return serializers.ItemSerializer(item).data

def get_item_details(item):
    # Resolve the item's detail record using the configured detail serializer map.
    
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
    # Create the typed details record only for item types that require one.
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
    # Update the existing typed details record with partial data.
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

def get_active_item(pk, user):

    # Centralized lookup for non-deleted items owned by a user.
    try:
        return models.Item.objects.select_related(
            'item_type'
        ).get(
            user=user,
            pk=pk,
            deleted_at__isnull=True
        )

    except models.Item.DoesNotExist:
        return None
