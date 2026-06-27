from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import (extend_schema, OpenApiResponse, OpenApiExample)

from .serializers import RegisterSerializer, RegisterResponseSerializer

@extend_schema(
    tags=["Authentication"],
    summary="Registrar un nuevo usuario",
    description=(
        "Crea una nueva cuenta de usuario. "
        "Si los datos son válidos, el usuario será almacenado en la base de datos."
    ),
    request=RegisterSerializer,
    responses={
        201: RegisterResponseSerializer,
        400: OpenApiResponse(
            description="Los datos enviados no son válidos."
        ),
    },
    examples=[
        OpenApiExample(
            'Registro de Usuario',
            request_only=True,
            value={
                "username":"usuario_nuevo123",
                "email" : "usuario_nuevo_123@gmail.com",
                "password" : "usuarionuevo123"
            }
        ),
        OpenApiExample(
            'Respuesta',
            response_only=True,
            value={
                "email" : "usuario_nuevo_123@gmail.com",
                "username":"usuario_nuevo123"
            }
        )
    ]
)
@api_view(['POST'])
def register(request):

    serializer = RegisterSerializer( data=request.data )

    serializer.is_valid( raise_exception=True )

    user = serializer.save()

    response = RegisterResponseSerializer(
        {
            "email": user.email,
            "username": user.username,
        }
    )

    return Response(response.data, status=status.HTTP_201_CREATED)

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