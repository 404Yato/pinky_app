# PinkyApp 📚🐱

PinkyApp is a personal digital library designed for readers who enjoy keeping their books organized, documented, and always within reach.

More than just a catalog, PinkyApp aims to provide a cozy and enjoyable space where every bookshelf tells a story. It brings together book organization, personal notes, and reading-related features in an environment designed around the experience of owning and enjoying books.

Every screen should feel less like a management application and more like a physical space dedicated to books and their readers.

<p align="center">
  <img width="300" alt="PinkyApp icon" src="https://github.com/user-attachments/assets/ff525916-3ef6-40db-a48b-7b4b175e23ad" />
</p>

---

# Live Demo

### Frontend Prototype

Explore the current visual prototype:

[https://pinkyapp.vercel.app/](https://pinkyapp.vercel.app/)

### Backend API

Explore the REST API and its interactive documentation:

[https://pinky-api.duckdns.org/api/docs/](https://pinky-api.duckdns.org/api/docs/)

---

# Vision

PinkyApp is being built around a simple idea:

**Creating the digital library we would love to use ourselves.**

Instead of trying to support every possible type of collection, PinkyApp focuses exclusively on books. This allows the interface, features, and overall experience to revolve around reading and personal libraries.

The goal is to create a calm, welcoming, and visually pleasing place where readers can organize, explore, document, and enjoy their collections.

Its visual identity draws inspiration from the warmth of a personal library: wooden bookshelves, coffee, and the feeling of having a space of your own.

---

# Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS |
| Backend | Python, Django 6, Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT (SimpleJWT) |
| API Documentation | OpenAPI, drf-spectacular, Swagger UI |
| Deployment | Docker, Gunicorn |

---

# Current Features

### Application

- Personal book collection management.
- Book information and metadata.
- Book details and reading-related information.
- Personal reviews and notes.
- Quote management, allowing users to save and organize memorable passages from their books.
- ISBN-based book lookup and metadata assistance.
- A reader-first interface with a warm, library-inspired visual identity.

### Backend

- JWT authentication and token management.
- User-owned collections and access control.
- REST API for book management.
- Book-related information and quote management.
- PostgreSQL integration.
- OpenAPI / Swagger documentation.
- Docker-based development and deployment configuration.

---

# Planned Features

- Customizable personal bookshelves.
- Favorites and ratings.
- More detailed bookshelf visualization.

---

# Project Structure

```text
pinkyapp/
│
├── backend/                 # Django REST API
│   ├── inventory/
│   ├── config/
│   └── README.md
│
├── frontend/                # React + Vite application
│
├── docker-compose.yml
├── docker-compose.prod.yml
│
├── .gitignore
└── README.md
```

---

# Frontend

The frontend is built with React and Vite, with a strong emphasis on visual identity and user experience.

Its design direction moves away from conventional administrative dashboards and focuses on a cozy, personal library atmosphere.

The interface is being developed around three principles:

- **Comfort:** A warm and welcoming visual environment.
- **Simplicity:** Clear interactions without unnecessary complexity.
- **Personality:** An interface that feels like a personal space rather than generic management software.

The frontend is currently under active development.

---

# Backend

The backend provides the REST API that powers PinkyApp.

It is built with Django REST Framework and PostgreSQL, following a service-oriented structure for business logic and using JWT authentication to protect user data.

For installation instructions, configuration details, API endpoints, and testing information, see:

```text
backend/README.md
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

For additional setup instructions, refer to the backend documentation.

---

# Project Status

<sub>🟡 Active Development</sub>

PinkyApp currently has a functional backend MVP, including authentication, book management, quote management, PostgreSQL integration, and API documentation.

The frontend is undergoing an ongoing redesign and implementation process, with the goal of turning the initial prototype into a complete, cohesive digital library experience.

---

# Author

Developed by **Cristian Tapia**.
