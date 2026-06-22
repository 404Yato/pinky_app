from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegisterSerializer


@api_view(['POST'])
def register(request):

    serializer = RegisterSerializer( data=request.data )

    serializer.is_valid( raise_exception=True )

    serializer.save()

    return Response(
        {
            'message' : 'User created'
        },
        status=201
    )

@api_view(['GET'])
def login(request):
    return None    