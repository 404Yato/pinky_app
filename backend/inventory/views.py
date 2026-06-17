from django.shortcuts import render
from django.db import transaction
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Item
from .serializers import ItemSerializer, ItemCreateSerializer
from .services import get_item_details, create_item_details, update_item_details, get_active_item

@api_view(['GET'])
def get_items(request):

    items = Item.objects.filter(
        deleted_at__isnull=True
    )

    serializer = ItemSerializer(items, many = True)

    return Response(serializer.data)

@api_view(['GET'])
def get_item(request, pk):

    item = get_active_item(pk)

    if not item:
        return Response(
            {'error': 'Item not found'},
            status=404
        )

    data = ItemSerializer(item).data

    data['details'] = get_item_details(item)

    return Response(data)

@api_view(['POST'])
def add_item(request):
    serializer = ItemCreateSerializer(
        data = request.data
    )
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
    )

    data = serializer.validated_data
    
    with transaction.atomic():
        item = Item.objects.create(
            user_id=data['user'],
            item_type_id=data['item_type'],
            name=data['name'],
            description=data.get(
                'description',
                ''
            )
        )

        create_item_details(
            item,
            data.get('details')
        )

    return Response(
        ItemSerializer(item).data,
        status=201
    )

@api_view(['PUT'])
def update_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response(
            {"error":"Item Not Found"},
            status=404
        )
    
    data = request.data.copy()

    details_data = data.pop(
        'details',
        None
    )

    serializer = ItemSerializer(
        item,
        data=data,
        partial=True
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
        )

    with transaction.atomic():
        
        serializer.save()

        update_item_details(
            item,
            details_data
        )


    return Response(
        {"message" : f"Item {pk} updated successfully."},
        status=200
    )

@api_view(['DELETE'])
def delete_item(request, pk):
    
    item = get_active_item(pk)

    if not item:

        return Response(
            {'error': 'Item not found'},
            status=404
        )

    item.deleted_at = timezone.now()

    item.save()

    return Response(
        {"message" : f"Item {pk} deleted successfully."},
        status=204
        )
    