from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework import status
from drf_spectacular.utils import (extend_schema, OpenApiResponse, OpenApiExample)
from .serializers import ItemSerializer, ItemCreateSerializer, ItemResponseSerializer, WhoAmIResponseSerializer, BookQuoteSerializer, ItemListSerializer
from .services import get_items, add_item, get_item, update_item, delete_item
from .models import Book, BookQuote

# ITEM_id_PARAMETER = OpenApiParameter(
#         name="id",
#         type=int,
#         location=OpenApiParameter.PATH,
#         description="Identificador del item."
#     )

class ItemListView(APIView):

    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        tags=["Items"],
        summary="Obtener todos los items",
        description="Devuelve todos los items registrados por el usuario autenticado. " \
                    "No devuelve elementos eliminados mediante soft delete.",
        responses={
            200: ItemListSerializer(many=True),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            }
    )
    def get(self, request):

        data = get_items(request.user)

        return Response(data)

    @extend_schema(
        tags=["Items"],
        summary="Crear un Item",
        description=(
            "Crea un nuevo item asociado al usuario autenticado.\n\n"
            "El campo 'details' contiene información específica del tipo de item. "
            "Su estructura depende del valor enviado en 'item_type'. "
            "Consulta los ejemplos disponibles para cada tipo."
            "\n\nTipos de Item: 1 = Libro, 2 = Vinilo"
        ),
        request=ItemCreateSerializer,
        responses={
            201: ItemSerializer,
            400: OpenApiResponse(
                description="Los datos enviados no son válidos."
            ),
            401: OpenApiResponse(
                description="Authentication credentials were not provided."
            ),
        },
        examples=[
            OpenApiExample(
                "Libro",
                request_only=True,
                value={
                    "item_type": 1,
                    "name": "Más allá del bien y del mal",
                    "description": 'Publicado en 1886 el libro se coloca más allá de las doctrinas dualistas, de ahí su título. De nuevo Nietzsche lanza una potente diatriba contra el mundo moderno y tras destruir sus doctrinas levanta su "ciencia de la moral" que tendrá su continuidad en la Genealogía de la moral, rechazando toda suerte de hipocresías que han esclavizado y esclavizan a la humanidad e impiden el advenimiento del superhombre.',
                    "favorite": True,
                    "comments": "Good Book.",
                    "possession_status": "OWNED",
                    "location": "Repisa 1 Habitación",
                    "loaned_to": "Rodrigo",
                    "details": {
                        "isbn": "9788410109254",
                        "author": "Friedrich Nietzsche",
                        "publisher": "Editorial Fontana",
                        "pages": 246,
                        "publication_year":"2023",
                        "genre": "mistery",
                        "cover_url": "www.google.com",
                        "reading_status": "PENDING"
                    },
                }
            ),
            OpenApiExample(
                "Vinilo",
                request_only=True,
                value={
                    "item_type": 1,
                    "name": "Más allá del bien y del mal",
                    "favorite": True,
                    "description": "Lado A\n\n1. Don't Panic (2:17)\n\n2. Shiver (5:00)\n\n3. Spies (5:18)\n\n4. Sparks (3:47)\n\n5. Yellow (4:29)\n\nLado B\n\n6. Trouble (4:30)\n\n7. Parachutes (0:46)\n\n8. High Speed (4:14)\n\n9. We Never Change (4:09)\n\n10. Everything's Not Lost (5:31)",
                    "details": {
                        "artist": "Coldplay",
                        "label": "Parlophone",
                        "release_year": "2000",
                        "barcode": 190295182502,
                        "discs":"1",
                        "rpm":33
                    },
                }
            ),
            OpenApiExample(
                "Respuesta",
                response_only=True,
                value={
                        "id": 12,
                        "name": "Space Invaders",
                        "description": "Libro del Fondo de Cultura. Descripción en construcción...",
                        "created_at": "2026-06-27T21:21:15.698491Z",
                        "updated_at": "2026-06-27T21:21:15.698504Z",
                        "deleted_at": None,
                        "user": 1,
                        "item_type": 1
                    }
            )
        ]
    )
    def post(self, request):
        
        try:
            item_data = add_item(request.data, request.user)
        
            return Response(
                item_data,
                status=status.HTTP_201_CREATED
            )
        
        except ValidationError as e:
            return Response(
                e.detail,
                status=status.HTTP_400_BAD_REQUEST
            )
        

class ItemDetailView(APIView):

    
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Items"],
        summary="Obtener un item",
        description=(
            "Obtiene un item específico perteneciente al usuario autenticado. "
            "No es posible acceder a items de otros usuarios ni a items eliminados mediante soft delete."
        ),

        responses={
            200: ItemSerializer,
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description="El item no existe o no pertenece al usuario."
            ),
        },
    )
    def get(self, request, id):
        
        item_data = get_item(id, request.user)

        return Response(
            item_data,
            status=status.HTTP_200_OK
        )
    
    @extend_schema(
        tags=["Items"],
        summary="Actualizar un item",
        description=(
            "Actualiza un item existente perteneciente al usuario autenticado."
        ),
        request=ItemCreateSerializer,
        responses={
            200: ItemResponseSerializer,
            400: OpenApiResponse(
                description="Los datos enviados no son válidos."
            ),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description="El item no existe."
            ),
        },
    )
    def put(self, request, id):

        item = update_item(id, request.user, request.data)

        response_data = {
                "message" : f"Item {id} updated successfully.",
                "data" : item
            }
        
        response = ItemResponseSerializer(response_data)

        return Response(
            response.data,
            status=status.HTTP_200_OK
        )
    
    @extend_schema(
        tags=["Items"],
        summary="Eliminar un item",
        description=(
            "Realiza un soft delete del item indicado. "
            "El registro permanece almacenado en la base de datos, "
            "pero deja de estar disponible para el usuario."
        ),
        responses={
            200: ItemResponseSerializer,
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description="El item no existe."
            ),
        },
    )
    def delete(self, request, id):

        item = delete_item(id, request.user)

        response_data = {
                "message" : f"Item {id} soft deleted successfully",
                "data" : item
            }
        
        response = ItemResponseSerializer(response_data)
        return Response(
            response.data,
            status=status.HTTP_200_OK
        )

class WhoAmIView(APIView):

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Authentication"],
        summary="Obtener información del usuario autenticado",
        description=(
            "Devuelve la información básica del usuario autenticado "
            "a partir del Access Token enviado en la solicitud."
        ),
        responses={
            200: WhoAmIResponseSerializer,
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
        },
        examples=[
            OpenApiExample(
                "Respuesta",
                response_only=True,
                value={
                    "id": 1,
                    "username": "usuario123",
                    "email": "usuario123@gmail.com"
                }
            )
        ]
    )
    def get(self, request):

        response = WhoAmIResponseSerializer(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        )

        return Response(
            response.data,
            status=status.HTTP_200_OK,
        )
    
class Health(APIView):

    def get(self, request):
        response = {
            "status" : "ok"
        }

        return Response(response)

class BookQuoteListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Book Quotes"],
        summary="Obtener citas de un libro",
        description=(
            "Obtiene todas las citas guardadas para un libro perteneciente "
            "al usuario autenticado. No es posible consultar citas de libros "
            "pertenecientes a otros usuarios."
        ),
        responses={
            200: BookQuoteSerializer(many=True),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description="El libro no existe o no pertenece al usuario."
            ),
        },
    )
    def get(self, request, book_id):

        book = get_object_or_404(
            Book,
            item__id=book_id,
            item__user=request.user,
            item__deleted_at__isnull=True,
        )

        quotes = BookQuote.objects.filter(
            book=book
        ).order_by("created_at")

        serializer = BookQuoteSerializer(
            quotes,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        tags=["Book Quotes"],
        summary="Crear una cita",
        description=(
            "Crea una nueva cita asociada a un libro perteneciente al usuario "
            "autenticado. La página es opcional si el serializer/modelo lo permite."
        ),
        request=BookQuoteSerializer,
        responses={
            201: BookQuoteSerializer,
            400: OpenApiResponse(
                description="Los datos enviados no son válidos."
            ),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description="El libro no existe o no pertenece al usuario."
            ),
        },
    )
    def post(self, request, book_id):

        book = get_object_or_404(
            Book,
            item__id=book_id,
            item__user=request.user,
            item__deleted_at__isnull=True,
        )

        serializer = BookQuoteSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        quote = serializer.save(
            book=book
        )

        response = BookQuoteSerializer(
            quote
        )

        return Response(
            response.data,
            status=status.HTTP_201_CREATED
        )

class BookQuoteDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_quote(self, quote_id, book_id, user):

        return get_object_or_404(
            BookQuote,
            id=quote_id,
            book__item__id=book_id,
            book__item__user=user,
            book__item__deleted_at__isnull=True,
        )

    @extend_schema(
        tags=["Book Quotes"],
        summary="Obtener una cita",
        description=(
            "Obtiene una cita específica perteneciente a un libro del usuario "
            "autenticado."
        ),
        responses={
            200: BookQuoteSerializer,
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description=(
                    "La cita no existe, el libro no existe o no pertenecen "
                    "al usuario autenticado."
                )
            ),
        },
    )
    def get(self, request, book_id, quote_id):

        quote = self.get_quote(
            quote_id,
            book_id,
            request.user
        )

        serializer = BookQuoteSerializer(
            quote
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        tags=["Book Quotes"],
        summary="Actualizar una cita",
        description=(
            "Actualiza una cita existente perteneciente a un libro del usuario "
            "autenticado."
        ),
        request=BookQuoteSerializer,
        responses={
            200: BookQuoteSerializer,
            400: OpenApiResponse(
                description="Los datos enviados no son válidos."
            ),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description=(
                    "La cita no existe, el libro no existe o no pertenecen "
                    "al usuario autenticado."
                )
            ),
        },
    )
    def put(self, request, book_id, quote_id):

        quote = self.get_quote(
            quote_id,
            book_id,
            request.user
        )

        serializer = BookQuoteSerializer(
            quote,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        quote = serializer.save()

        response = BookQuoteSerializer(
            quote
        )

        return Response(
            response.data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        tags=["Book Quotes"],
        summary="Actualizar parcialmente una cita",
        description=(
            "Actualiza parcialmente una cita perteneciente a un libro del usuario "
            "autenticado. Permite modificar únicamente los campos enviados."
        ),
        request=BookQuoteSerializer,
        responses={
            200: BookQuoteSerializer,
            400: OpenApiResponse(
                description="Los datos enviados no son válidos."
            ),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description=(
                    "La cita no existe, el libro no existe o no pertenecen "
                    "al usuario autenticado."
                )
            ),
        },
    )
    def patch(self, request, book_id, quote_id):

        quote = self.get_quote(
            quote_id,
            book_id,
            request.user
        )

        serializer = BookQuoteSerializer(
            quote,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        quote = serializer.save()

        response = BookQuoteSerializer(
            quote
        )

        return Response(
            response.data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        tags=["Book Quotes"],
        summary="Eliminar una cita",
        description=(
            "Elimina permanentemente una cita perteneciente a un libro "
            "del usuario autenticado."
        ),
        responses={
            204: OpenApiResponse(
                description="La cita fue eliminada correctamente."
            ),
            401: OpenApiResponse(
                description="El usuario no está autenticado."
            ),
            404: OpenApiResponse(
                description=(
                    "La cita no existe, el libro no existe o no pertenecen "
                    "al usuario autenticado."
                )
            ),
        },
    )
    def delete(self, request, book_id, quote_id):

        quote = self.get_quote(
            quote_id,
            book_id,
            request.user
        )

        quote.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )