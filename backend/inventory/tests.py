
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from inventory.models import (
    Item,
    ItemType,
    Book,
    Vinyl,
    BookQuote,
)

User = get_user_model()


class ItemAPITests(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="user_a",
            password="TestPassword123!"
        )
        self.user_b = User.objects.create_user(
            username="user_b",
            password="TestPassword123!"
        )

        self.book_type = ItemType.objects.create(
            name="Book",
            detail_type="BOOK"
        )
        self.vinyl_type = ItemType.objects.create(
            name="Vinyl",
            detail_type="VINYL"
        )

        self.item = Item.objects.create(
            user=self.user_a,
            item_type=self.book_type,
            name="Test book"
        )

        self.book = Book.objects.create(
            item=self.item,
            author="Test author",
            reading_status="PENDING"
        )

        self.item_url = f"/api/inventory/items/{self.item.id}/"
        self.items_url = "/api/inventory/items/"

    def authenticate_as(self, user):
        self.client.force_authenticate(user=user)

    def test_unauthenticated_user_cannot_list_items(self):
        response = self.client.get(self.items_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_owner_can_access_own_item(self):
        self.authenticate_as(self.user_a)

        response = self.client.get(self.item_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_user_cannot_access_another_users_item(self):
        self.authenticate_as(self.user_b)

        response = self.client.get(self.item_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_user_cannot_update_another_users_item(self):
        self.authenticate_as(self.user_b)

        response = self.client.put(
            self.item_url,
            {"name": "Modified by another user"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.item.refresh_from_db()
        self.assertEqual(self.item.name, "Test book")

    def test_user_cannot_delete_another_users_item(self):
        self.authenticate_as(self.user_b)

        response = self.client.delete(self.item_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.item.refresh_from_db()
        self.assertIsNone(self.item.deleted_at)

    def test_user_only_sees_own_items(self):
        Item.objects.create(
            user=self.user_b,
            item_type=self.book_type,
            name="User B book"
        )

        self.authenticate_as(self.user_a)

        response = self.client.get(self.items_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        returned_ids = [item["id"] for item in response.data]

        self.assertIn(self.item.id, returned_ids)
        self.assertEqual(len(returned_ids), 1)

    def test_update_item_without_details_preserves_book_details(self):
        self.authenticate_as(self.user_a)

        response = self.client.put(
            self.item_url,
            {"name": "Updated book name"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.item.refresh_from_db()
        self.book.refresh_from_db()

        self.assertEqual(self.item.name, "Updated book name")
        self.assertEqual(self.book.author, "Test author")

    def test_create_book_with_details(self):
        self.authenticate_as(self.user_a)

        payload = {
            "item_type": self.book_type.id,
            "name": "New test book",
            "favorite": False,
            "details": {
                "author": "New author",
                "reading_status": "PENDING"
            }
        }

        response = self.client.post(
            self.items_url,
            payload,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        created_item = Item.objects.get(
            user=self.user_a,
            name="New test book"
        )

        self.assertTrue(
            Book.objects.filter(item=created_item).exists()
        )

    def test_create_vinyl_with_details(self):
        self.authenticate_as(self.user_a)

        payload = {
            "item_type": self.vinyl_type.id,
            "name": "Test vinyl",
            "favorite": False,
            "details": {
                "artist": "Test artist",
                "label": "Test label",
                "release_year": 2020
            }
        }

        response = self.client.post(
            self.items_url,
            payload,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        created_item = Item.objects.get(
            user=self.user_a,
            name="Test vinyl"
        )

        self.assertTrue(
            Vinyl.objects.filter(item=created_item).exists()
        )

    def test_soft_deleted_item_is_not_accessible(self):
        self.authenticate_as(self.user_a)

        response = self.client.delete(self.item_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.item.refresh_from_db()
        self.assertIsNotNone(self.item.deleted_at)

        response = self.client.get(self.item_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_soft_deleted_item_cannot_be_updated(self):
        self.authenticate_as(self.user_a)

        self.item.deleted_at = timezone.now()
        self.item.save(update_fields=["deleted_at"])

        response = self.client.put(
            self.item_url,
            {"name": "Should not be updated"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_user_cannot_access_another_users_book_quotes(self):
        quote = BookQuote.objects.create(
            book=self.book,
            text="A test quote",
            page=10
        )

        self.authenticate_as(self.user_b)

        response = self.client.get(
            f"/api/inventory/books/{self.item.id}/quotes/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_owner_can_create_and_list_book_quotes(self):
        self.authenticate_as(self.user_a)

        quotes_url = (
            f"/api/inventory/books/{self.item.id}/quotes/"
        )

        create_response = self.client.post(
            quotes_url,
            {
                "text": "A quote from my book",
                "page": 25
            },
            format="json"
        )

        self.assertEqual(
            create_response.status_code,
            status.HTTP_201_CREATED
        )

        list_response = self.client.get(quotes_url)

        self.assertEqual(
            list_response.status_code,
            status.HTTP_200_OK
        )
        self.assertEqual(len(list_response.data), 1)
