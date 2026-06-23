from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

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

@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.data["refresh"]

        token = RefreshToken( refresh_token )

        print(token)

        token.blacklist()

        return Response(
            {
                "message" : "Logged out successfully."
            },
            status=status.HTTP_200_OK
        )
    
    except Exception:
       return Response(
           {
               "error" : "Invalid Token"
           },
           status=status.HTTP_400_BAD_REQUEST
       )