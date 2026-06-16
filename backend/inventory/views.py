from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Item
from .serializers import ItemSerializer
from .services import get_item_details

@api_view(['GET'])
def get_items(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many = True)

    return Response(serializer.data)

@api_view(['GET'])
def get_item(request, pk):
    item = Item.objects.select_related('item_type').get(pk=pk)

    data = ItemSerializer(item).data

    data['details'] = get_item_details(item)

    return Response(data)