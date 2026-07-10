# Pinky App Backend 😸

REST API backend for Pinky App, a personal inventory application built with Django and Django REST Framework.

This API provides authentication, user-based inventory management, and the required services to support the Pinky App frontend.

---

# Tech Stack

* Python 3.14
* Django 6
* Django REST Framework
* PostgreSQL
* JWT Authentication
* Gunicorn
* Docker
* OpenAPI / Swagger

---

# Project Structure

```text
backend/
│
├── authentication/     # User authentication module
│
├── inventory/          # Inventory management module
│
├── config/             # Django configuration
│
├── manage.py
│
├── requirements.txt
│
├── Dockerfile
│
└── entrypoint.sh
```

---

# Features

## Authentication

* User registration
* JWT authentication
* Access and refresh tokens
* Refresh token rotation
* Token blacklist after logout

---

## Inventory Management

* Create, update, retrieve, and delete items
* User-based data isolation
* Dynamic item details
* Service layer architecture for business logic separation

---

# API Documentation

The API documentation is generated using OpenAPI and Swagger.

Available endpoints:

```text
/api/docs/
```

Swagger UI allows developers to:

* Explore available endpoints
* Test API requests
* View request and response schemas
* Authenticate using JWT tokens

---

# Environment Variables

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

---

# Local Development

## Create virtual environment

```bash
python -m venv venv
```

Activate it:

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

---

## Install dependencies

```bash
pip install -r requirements.txt
```

---

## Database migrations

```bash
python manage.py migrate
```

---

## Run development server

```bash
python manage.py runserver
```

The API will be available at:

```text
http://localhost:8000
```

---

# Docker

## Development

Build and run:

```bash
docker compose up --build
```

---

## Production

Run using the production compose file:

```bash
docker compose -f docker-compose.prod.yml up --build
```

The production container uses:

* Gunicorn as WSGI server
* PostgreSQL container
* Environment-based configuration
* Automated migrations

---

# Architecture Decisions

## Service Layer

Business logic is separated from views using a service layer.

This helps keep:

* Views simpler
* Logic reusable
* Future changes easier to maintain

---

## API Documentation

OpenAPI documentation was implemented from the beginning to keep the API easier to understand and consume.

---

# Current Status

The backend has reached a functional MVP stage.

Completed:

* Authentication system
* JWT security
* Inventory CRUD operations
* Service layer architecture
* API documentation
* Docker production setup

Future improvements:

* Advanced search
* Pagination
* Image management
* Additional item types
* Frontend integration

---

## Author

Developed by Cristian Tapia.
