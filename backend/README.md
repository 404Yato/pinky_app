# Pinky App Backend 😸

REST API backend for **Pinky App**, a personal collection management application built with Django and Django REST Framework.

The backend provides authentication, user-based data isolation, and inventory management for books and vinyl records. It also supports book quotes, collection organization, and item-specific metadata.

---

## Tech Stack

- Python 3.14.2
- Django 6
- Django REST Framework
- PostgreSQL
- JWT Authentication (SimpleJWT)
- Gunicorn
- Docker
- OpenAPI / Swagger (drf-spectacular)

---

## Project Structure

```text
backend/
│
├── authentication/       # User authentication module
│
├── inventory/            # Collection and inventory management
│
├── config/               # Django configuration
│
├── manage.py
├── requirements.txt
├── Dockerfile
└── entrypoint.sh
```

---

## Features

### Authentication

- User registration
- JWT authentication
- Access and refresh tokens
- Refresh token rotation
- Token blacklisting on logout
- Authenticated API endpoints

### Inventory Management

- Create, retrieve, update, and soft-delete collection items
- User-based data isolation
- Support for multiple item types
- Dynamic item details based on item type
- Favorites management
- Collection and loan status tracking
- Item location management

### Books

- Book metadata management:
  - ISBN
  - Author
  - Publisher
  - Page count
  - Publication year
  - Genre
  - Cover URL
- Reading status tracking:
  - Pending
  - Reading
  - Read
- Personal quotes associated with books
- Quote creation, retrieval, updating, and deletion

### Vinyl Records

- Vinyl metadata management:
  - Artist
  - Record label
  - Release year
  - Barcode
  - Number of discs
  - RPM

### Data Management

- Soft deletion to preserve item records
- Ownership validation across inventory operations
- Dedicated service layer for business logic
- Database transactions for item and detail creation and updates

---

## API Endpoints

All API endpoints are available under the `/api/` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Obtain JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| POST | `/api/auth/logout/` | Log out and blacklist refresh token |

### Inventory

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory/items/` | List authenticated user's items |
| POST | `/api/inventory/items/` | Create an item |
| GET | `/api/inventory/items/{id}/` | Retrieve an item |
| PUT | `/api/inventory/items/{id}/` | Update an item |
| DELETE | `/api/inventory/items/{id}/` | Soft-delete an item |
| GET | `/api/inventory/whoami/` | Retrieve authenticated user information |

### Book Quotes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory/books/{book_id}/quotes/` | List book quotes |
| POST | `/api/inventory/books/{book_id}/quotes/` | Create a quote |
| GET | `/api/inventory/books/{book_id}/quotes/{quote_id}/` | Retrieve a quote |
| PUT | `/api/inventory/books/{book_id}/quotes/{quote_id}/` | Update a quote |
| PATCH | `/api/inventory/books/{book_id}/quotes/{quote_id}/` | Partially update a quote |
| DELETE | `/api/inventory/books/{book_id}/quotes/{quote_id}/` | Delete a quote |

### Health Check

```text
GET /api/health/
```

Returns the API service status.

---

## API Documentation

API documentation is generated using OpenAPI and Swagger through drf-spectacular.

Swagger UI:

```text
/api/docs/
```

OpenAPI schema:

```text
/api/schema/
```

Swagger UI allows developers to:

- Explore available endpoints
- Test API requests
- Inspect request and response schemas
- Authenticate using JWT tokens

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
DB_NAME=pinky_db
DB_USER=postgres
DB_PASSWORD=
DB_HOST=
DB_PORT=5432

SECRET_KEY=
DEBUG=False

ALLOWED_HOSTS=
```

Configure the database connection and Django settings according to your environment.

Do not commit the `.env` file or expose production credentials.

---

## Local Development

### 1. Create a virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Apply database migrations

```bash
python manage.py migrate
```

### 4. Run the development server

```bash
python manage.py runserver
```

The API will be available at:

```text
http://localhost:8000/
```

---

## Testing

The backend uses Django's testing framework and Django REST Framework's `APITestCase` to validate API behavior.

The test suite covers:

- Authentication requirements
- User-based data isolation
- Inventory ownership validation
- Book and vinyl creation
- Item detail preservation during partial updates
- Soft deletion and deleted item protection
- Book quote ownership and access

### Run tests

From the backend directory:

```bash
python manage.py test inventory
```

For detailed test output:

```bash
python manage.py test inventory --verbosity 2
```

The current test suite contains **13 automated tests**, all successfully executed.

---

## Docker

### Development

Build and run:

```bash
docker compose up --build
```

### Production

Run using the production Compose configuration:

```bash
docker compose -f docker-compose.prod.yml up --build
```

The production configuration uses:

- Gunicorn as the WSGI application server
- PostgreSQL as the database
- Environment-based configuration
- Automated database migrations

---

## Architecture Decisions

### Service Layer

Business logic is separated from API views through a dedicated service layer.

This approach helps keep:

- Views focused on HTTP request and response handling
- Business logic reusable and easier to maintain
- Database operations organized
- Future changes easier to implement

### User-Based Data Isolation

Inventory records are associated with their owners.

API operations validate ownership to prevent users from accessing or modifying other users' data.

### Dynamic Item Details

Different item types require different metadata.

Pinky uses dedicated models and serializers for books and vinyl records, while maintaining a shared inventory structure.

### Soft Deletion

Items are not permanently removed when deleted through the inventory API.

Instead, a deletion timestamp is stored, allowing deleted records to be excluded from normal queries while preserving their database history.

### API Documentation

OpenAPI documentation is integrated into the backend to make the API easier to understand, test, and consume from the frontend.

---

## Current Status

The backend has reached a functional MVP stage.

**Implemented:**

- User authentication and JWT management
- Inventory CRUD operations
- Book and vinyl management
- Book quotes management
- Favorites and reading status
- Collection and loan status tracking
- User-based data isolation
- Soft deletion
- Service layer architecture
- OpenAPI / Swagger documentation
- Docker production configuration
- Frontend integration
- Automated backend tests

**Potential future improvements:**

- Advanced search and filtering
- API pagination
- Additional item types
- Expanded automated test coverage

---

## Author

Developed by **Cristian Tapia**.