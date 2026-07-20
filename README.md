# PinkyApp 📚🐱

PinkyApp is a personal digital library designed for readers who enjoy keeping their books organized, documented, and always within reach.

Rather than being just a catalog, PinkyApp aims to provide a cozy and enjoyable space where every bookshelf tells a story, making it easy to manage your personal library, track your reading journey, and rediscover your favorite books.

<img width="500" height="500" alt="pinkyapp-icon" src="https://github.com/user-attachments/assets/ff525916-3ef6-40db-a48b-7b4b175e23ad" />

---

# Live Demo

### Backend API

https://pinky-api.up.railway.app/api/docs

### Frontend (Prototype)

https://cmts-pinky-app.vercel.app/

---

# Tech Stack

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite
- **Database:** PostgreSQL
- **Authentication:** JWT
- **API Documentation:** OpenAPI + Swagger
- **Deployment:** Docker + Gunicorn

---

# Vision

PinkyApp is being built around a single idea:

> **Creating the digital library we would love to use ourselves.**

Instead of trying to support every possible collectible, PinkyApp focuses exclusively on books, allowing the experience, interface, and features to revolve entirely around reading and personal libraries.

The goal is to create a calm, welcoming, and visually pleasing place where readers can organize, explore, and enjoy their collections.

---

# Current Features

- JWT authentication
- Personal book library
- User-owned collections
- REST API
- PostgreSQL integration
- OpenAPI / Swagger documentation
- Docker development environment
- Production-ready deployment

---

# Planned Features

- Personal bookshelves
- Reading status tracking
- Reading progress
- Favorites
- Ratings and reviews
- Reading statistics
- Beautiful bookshelf visualization
- Responsive interface

---

# Project Structure

```text
pinkyapp/
│
├── backend/                 # Django REST API
├── frontend/                # React + Vite application
│
├── docker-compose.yml
├── docker-compose.prod.yml
│
├── .gitignore
└── README.md
```

---

# Backend

The backend exposes a REST API developed with Django REST Framework.

Additional documentation is available at:

```text
backend/README.md
```

---

# Frontend

The frontend is currently being rebuilt using React and Vite with a reader-first experience.

Future documentation will be available at:

```text
frontend/README.md
```

---

# Running the Project

### Development

```bash
docker compose up --build
```

### Production

```bash
docker compose -f docker-compose.prod.yml up --build
```

---

# Project Status

🟡 Active Development

The backend has reached a functional MVP, including:

- Authentication
- Book management API
- Swagger documentation
- PostgreSQL integration
- Dockerized deployment

The current focus is the complete redesign and implementation of the frontend to deliver a reader-centered experience.

---

# Author

Developed by **Cristian Tapia**.
