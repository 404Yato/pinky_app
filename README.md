# Pinky App 😸

A personal inventory application designed to manage collections and keep track of meaningful items such as books, vinyl records, games, figures, and other personal belongings.

<img width="500" height="500" alt="pinkyapp-icon" src="https://github.com/user-attachments/assets/ff525916-3ef6-40db-a48b-7b4b175e23ad" />

---

## Live Demo

Backend API:
https://....

Frontend:
https://cmts-pinky-app.vercel.app/ (Mock-up)

## Architecture

Pinky App follows a separated frontend/backend architecture:

* **Backend:** Django + Django REST Framework
* **Frontend:** React + Vite
* **Database:** PostgreSQL
* **Authentication:** JWT
* **API Documentation:** OpenAPI + Swagger
* **Deployment:** Docker + Gunicorn

---

## Features

* User authentication with JWT
* User-based object management
* Personal inventory system
* Dynamic item types
* REST API architecture
* API documentation with Swagger UI
* PostgreSQL database integration
* Dockerized development and production environments

---

## Project Structure

```text
pinky/
│
├── backend/          # Django REST API
│
├── frontend/         # React application
│
├── docker-compose.yml
│
└── README.md
```

---

## Backend

The backend is a REST API built with Django REST Framework.

For detailed backend documentation, architecture decisions, API information, and setup instructions, check:

```text
backend/README.md
```

---

## Frontend

The frontend application is built with React and Vite.

Documentation will be available at:

```text
frontend/README.md
```

---

## Running the Project

### Using Docker

Build and start the development environment:

```bash
docker compose up --build
```

Production environment:

```bash
docker compose -f docker-compose.prod.yml up --build
```

---

## Project Status

Pinky App is currently under active development.

The backend has reached a functional MVP stage, including:

* Authentication system
* Inventory management
* API documentation
* Production-ready containerization

The next steps include frontend development, additional documentation, and deployment.

---

## Author

Developed by Cristian Tapia.



