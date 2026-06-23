from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .services import get_items, add_item, get_item, update_item, delete_item

class ItemListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        data = get_items(request.user)

        return Response(data)

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

    def get(self, request, pk):
        
        item_data = get_item(pk, request.user)

        return Response(
            item_data,
            status=status.HTTP_200_OK
        )
    
    def put(self, request, pk):

        item_data = update_item(pk, request.user, request.data)

        return Response(
            {
                "message" : f"Item {pk} updated successfully.",
                "data" : item_data
            },
            status=status.HTTP_200_OK
        )
    
    def delete(self, request, pk):

        item_data = delete_item(pk, request.user)

        return Response(
            {
                "message" : f"Item {pk} soft deleted successfully",
                "data" : item_data
            },
            status=status.HTTP_200_OK
        )

class WhoAmIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                'id' : request.user.id,
                'username' : request.user.username,
                'email' : request.user.email
            }
        )