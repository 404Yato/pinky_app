from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import (extend_schema, OpenApiResponse, OpenApiExample)

from .serializers import RegisterSerializer, RegisterResponseSerializer, LoginSerializer, LoginResponseSerializer, ErrorResponseSerializer, LogoutResponseSerializer, LogoutSerializer, RefreshTokenSerializer, RefreshTokenResponseSerializer

@extend_schema(
    tags=["Authentication"],
    summary="Iniciar sesión",
    description=(
        "Autentica al usuario utilizando su nombre de usuario y contraseña. "
        "Si las credenciales son válidas, devuelve un Access Token y un Refresh Token JWT."
    ),
    request=LoginSerializer,
    responses={
        200: LoginResponseSerializer,
        401: OpenApiResponse(
            description="Credenciales inválidas."
        )
    },
    examples=[
        OpenApiExample(
            "Login",
            request_only=True,
            value={
                "username": "usuario123",
                "password": "MiPassword123"
            }
        ),
        OpenApiExample(
            "Respuesta",
            response_only=True,
            value={
                "refresh": "eyJhbGc...",
                "access": "eyJhbGc..."
            }
        )
    ]
)
class LoginView(TokenObtainPairView):
    pass

@extend_schema(
    tags=["Authentication"],
    summary="Renovar Access Token",
    description=(
        "Genera un nuevo Access Token utilizando un Refresh Token válido. "
        "El Refresh Token debe estar vigente y no encontrarse en la blacklist."
    ),
    request=RefreshTokenSerializer,
    responses={
        200: RefreshTokenResponseSerializer,
        401: OpenApiResponse(
            description="El Refresh Token es inválido o ha expirado."
        ),
    },
    examples=[
        OpenApiExample(
            "Renovar token",
            request_only=True,
            value={
                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        ),
        OpenApiExample(
            "Nuevo Access Token",
            response_only=True,
            value={
                "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        ),
    ]
)
class RefreshView(TokenRefreshView):
    pass

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
                "username":"usuario123",
                "email" : "usuario123@gmail.com",
                "password" : "MiPassword123"
            }
        ),
        OpenApiExample(
            "Respuesta",
            response_only=True,
            status_codes=["201"],
            value={
                "email": "usuario123@gmail.com",
                "username": "usuario123",
            },
        )
    ]
)
@api_view(['POST'])
def register(request):

    serializer = RegisterSerializer( data=request.data )

    serializer.is_valid( raise_exception=True )

    user = serializer.save()

    response = RegisterResponseSerializer( instance = user)

    return Response(response.data, status=status.HTTP_201_CREATED)

@extend_schema(
    tags=["Authentication"],
    summary="Cerrar sesión",
    description=(
        "Este endpoint invalida el Refresh Token enviado por el cliente agregándolo a la blacklist."
        " El Access Token seguirá siendo válido hasta su expiración natural."
    ),
    request=LogoutSerializer,
    responses={
        200: LogoutResponseSerializer,
        400: ErrorResponseSerializer,
        401: OpenApiResponse(
            description="El usuario no está autenticado."
        ),
    },
    examples=[
        OpenApiExample(
            "Cerrar sesión",
            request_only=True,
            value={
                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        ),
        OpenApiExample(
            "Logout exitoso",
            response_only=True,
            value={
                "message": "Logged out successfully."
            }
        ),
        OpenApiExample(
            "Token inválido",
            response_only=True,
            status_codes=["400"],
            value={
                "error": "Invalid Token"
            }
        ),
    ]
)
@api_view(['POST'])
def logout(request):
    try:
        serializer = LogoutSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        refresh_token = serializer.validated_data["refresh"]

        token = RefreshToken( refresh_token )

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