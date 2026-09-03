# Pinky App — Frontend Implementation Plan

## Current Development Scope

The current development phase is **FRONTEND ONLY**.

Backend development and API integration are explicitly outside the scope of the current phase.

The agent must focus exclusively on building the visual, interactive, responsive and accessible frontend experience.

The frontend should be fully usable and demonstrable using **mock/local data**.

API integration will be implemented and tested separately by the project owner after the frontend is sufficiently complete.

### Backend protection

The `backend/` directory is read-only during this phase.

The agent MUST NOT:

* Modify backend files.
* Modify Django models.
* Modify serializers.
* Modify views.
* Modify URLs.
* Modify permissions.
* Modify authentication logic.
* Modify database models or migrations.
* Modify API endpoints.
* Modify backend configuration.
* Install backend dependencies.
* Change backend behavior to accommodate frontend requirements.

The agent may inspect the backend when necessary to understand existing data structures, but must not modify it.

---
# Canonical Data Model

The frontend must follow the existing backend domain model.

This section defines the canonical data structure that mock data, frontend services, hooks, forms and UI state should represent.

The frontend may adapt naming for presentation purposes, but it must not invent a conflicting domain model.

The backend remains the source of truth for persistent data structure.

---

## Entity Structure

Pinky uses a shared base entity called `Item`.

Type-specific entities such as `Book` extend an `Item` through a one-to-one relationship.

Conceptually:

```text
User
  |
  └── Item
       ├── ItemType
       ├── Book
       └── Vinyl
```

`Item` owns the fields shared by every collectible. `Book` and `Vinyl` contain only type-specific details and use a one-to-one relationship whose primary key references the owning `Item`.

The current Pinky frontend implements books only. Vinyl is documented here so the shared Item boundary does not prevent Vinyl support from being added cleanly in another application later. This phase must not add Vinyl UI to Pinky.

## Canonical Structures

### ItemType

| Field | Type | Nullable | Ownership and purpose |
| --- | --- | --- | --- |
| `id` | integer | No | ItemType identifier |
| `name` | string | No | Human-readable type name |
| `detail_type` | string | No | Discriminates the related detail entity, such as `BOOK` or `VINYL` |

### Item

| Field | Type | Nullable | Ownership and purpose |
| --- | --- | --- | --- |
| `id` | integer | No | Shared Item identifier |
| `user` | integer / foreign key | No | Owner of the Item |
| `item_type` | integer / foreign key | No | References `ItemType` |
| `name` | string | No | Shared display name; exposed as `title` by the book view model |
| `description` | string | No | Shared description; use an empty string when absent |
| `favorite` | boolean | No | Shared favorite state; never belongs to Book or Vinyl |
| `created_at` | ISO datetime string | No | Creation timestamp |
| `updated_at` | ISO datetime string | No | Last-update timestamp |
| `deleted_at` | ISO datetime string | Yes | Soft-deletion timestamp; `null` means active |

### Book

| Field | Type | Nullable | Ownership and purpose |
| --- | --- | --- | --- |
| `item` | integer / one-to-one key | No | References the owning `Item` and serves as the Book identifier |
| `isbn` | string | Yes | ISBN or equivalent book identifier |
| `author` | string | Yes | Book author |
| `publisher` | string | Yes | Book publisher |
| `pages` | positive integer | Yes | Page count; domain values must never be strings |
| `publication_year` | positive integer | Yes | Publication year; domain values must never be strings |
| `genre` | string | Yes | Book genre |
| `cover_url` | URL string | Yes | Cover image URL |
| `reading_status` | enum string | No | One of `PENDING`, `READING`, or `READ` |

### Vinyl

| Field | Type | Nullable | Ownership and purpose |
| --- | --- | --- | --- |
| `item` | integer / one-to-one key | No | References the owning `Item` and serves as the Vinyl identifier |
| `artist` | string | No | Recording artist |
| `label` | string | Yes | Record label |
| `release_year` | integer | Yes | Release year; domain values must never be strings |
| `barcode` | string | Yes | Barcode or catalog identifier |
| `discs` | integer | Yes | Disc count; domain values must never be strings |
| `rpm` | integer | Yes | Playback speed; domain values must never be strings |

## Reading Status

Book reading status is a canonical domain enum. The only valid stored values are:

```text
PENDING
READING
READ
```

Friendly and translated labels may be used in the UI, but mock records, services, commands, and future API payloads must retain the uppercase canonical values.

## Frontend Mapping Policy

Canonical records use backend-compatible snake_case. React-facing view models may use camelCase and book-specific presentation names, but every conversion must be centralized in an adapter.

Required Item mappings:

```text
BookViewModel.id          ← Item.id
BookViewModel.title       ← Item.name
BookViewModel.description ← Item.description
BookViewModel.favorite    ← Item.favorite
BookViewModel.createdAt   ← Item.created_at
BookViewModel.updatedAt   ← Item.updated_at
BookViewModel.deletedAt   ← Item.deleted_at
```

Required Book mappings:

```text
BookViewModel.author          ← Book.author
BookViewModel.isbn            ← Book.isbn
BookViewModel.publisher       ← Book.publisher
BookViewModel.pages           ← Book.pages
BookViewModel.publicationYear ← Book.publication_year
BookViewModel.genre           ← Book.genre
BookViewModel.coverUrl        ← Book.cover_url
BookViewModel.readingStatus   ← Book.reading_status
```

The reverse mapping for create and update commands must explicitly send `title` to `Item.name`, `favorite` to `Item.favorite`, shared fields to Item data, and type-specific fields to Book detail data.

Form controls may temporarily hold numeric input as strings. Command adapters must convert those values to numbers or `null` before domain storage. Nullable Book and Vinyl fields use `null`; absent `Item.description` uses an empty string.

## Soft Deletion

Items are deleted by setting `Item.deleted_at` to an ISO datetime and updating `Item.updated_at`. The underlying Item and detail record remain stored.

Normal list, search, filter, sort, and detail operations must exclude records whose `Item.deleted_at` is not `null`. Soft-deleted Items must not appear as active collection entries.

---

# 1. Project Goal

Build a polished, responsive personal library management application.

Pinky allows users to:

* Browse their personal book collection.
* View book information.
* Search for books.
* Filter and sort their collection.
* Track reading status.
* Mark books as favorites.
* Add books.
* Edit books.
* Delete books.
* Navigate between different library views.

The frontend should feel like a finished product rather than a technical demonstration.

The application must provide a complete user experience even while using mock data.

The implementation must prioritize:

1. Functionality
2. User experience
3. Visual consistency
4. Maintainability
5. Responsive behavior
6. Accessibility

---

# 2. Current Technology Stack

## Frontend

* React 19
* Vite 7
* JavaScript
* Tailwind CSS 4
* shadcn/ui
* Base UI
* Lucide-style icons where appropriate

## Backend

* Django
* Django REST Framework
* PostgreSQL

The backend is **not part of the current implementation scope**.

It will be integrated later by the project owner.

---

# 3. Mock Data Strategy

The frontend must use mock/local data during the current implementation phase.

Mock data should be structured to resemble the expected real application data as closely as reasonably possible.

For example:

```js
const books = [
  {
    id: 1,
    title: "Dune",
    author: "Frank Herbert",
    cover: "/assets/books/dune.jpg",
    readingStatus: "READ",
    favorite: true,
    description: "..."
  }
]
```

The exact fields should be based on the existing project structure where possible.

## Important

Mock data should be isolated from UI components.

Do not hard-code large datasets directly inside components.

Prefer a structure such as:

```text
src/
├── data/
│   └── mockBooks.js
│
├── services/
│   └── mock/
│       └── books.js
│
└── components/
```

The exact structure may evolve according to the existing project.

The purpose is to make future API integration straightforward.

Conceptually:

```text
CURRENT

Component
    ↓
Mock service
    ↓
Mock data


FUTURE

Component
    ↓
API service
    ↓
Django REST API
    ↓
PostgreSQL
```

The UI should not need to be rewritten when mock services are eventually replaced by real API services.

---

# 4. Implementation Principles

## 4.1 Inspect Before Implementing

Before modifying or creating functionality, inspect the existing frontend code.

Do not assume that a feature does not already exist.

Check:

* Existing components
* Existing pages
* Existing routes
* Existing state management
* Existing styles
* Existing assets
* Existing utilities
* Existing mock data
* Existing frontend services

The backend may be inspected for reference, but must remain untouched.

Prefer extending existing functionality over duplicating it.

---

## 4.2 Preserve Existing Functionality

Do not unnecessarily rewrite working frontend code.

When introducing the new visual system:

* Preserve existing frontend functionality.
* Preserve existing routes where appropriate.
* Preserve existing data structures when practical.
* Preserve useful existing components.
* Preserve working configuration.

Do not modify backend functionality.

---

## 4.3 Component Reuse

Prefer reusable components.

Use shadcn/ui components for common interface primitives.

Examples:

* Button
* Card
* Input
* Dialog
* Select
* Dropdown
* Badge
* Table
* Tabs
* Sheet
* Tooltip

Create Pinky-specific components when the functionality or presentation belongs specifically to the application.

Examples:

* BookCard
* BookGrid
* BookForm
* BookFilters
* BookStatus
* BookCover
* LibraryStats
* RecentBooks
* Sidebar
* AppHeader

Do not create a custom component when an existing component already solves the problem adequately.

---

# 5. Architecture

Use a clear separation between:

```text
Pages
  ↓
Feature Components
  ↓
UI Components
  ↓
Hooks / State
  ↓
Mock Services
  ↓
Mock Data
```

A conceptual structure:

```text
src/
├── components/
│   ├── ui/
│   ├── books/
│   ├── dashboard/
│   └── layout/
│
├── pages/
│
├── services/
│   └── mock/
│
├── data/
│   └── mockBooks.js
│
├── hooks/
│
├── lib/
│
├── assets/
│
├── App.jsx
└── main.jsx
```

The exact structure may evolve as the application grows.

Do not create folders purely for the sake of architecture.

---

# 6. Development Phases

Implementation should proceed incrementally.

Do not attempt to implement the entire application in one operation.

Complete one phase at a time.

---

# Phase 0 — Foundation

## Objective

Establish the frontend foundation and visual system.

## Tasks

* [ ] Verify React + Vite setup
* [ ] Verify Tailwind CSS 4
* [ ] Verify shadcn/ui
* [ ] Verify Base UI
* [ ] Verify import alias
* [ ] Configure Pinky theme
* [ ] Configure global typography
* [ ] Configure semantic colors
* [ ] Configure global background
* [ ] Configure borders and shadows
* [ ] Verify responsive foundations

## Acceptance criteria

* Application starts without errors.
* Production build succeeds.
* Tailwind classes work.
* shadcn components work.
* `@/` imports work.
* Pinky visual tokens are available globally.
* No unnecessary duplicate styling systems exist.

---

# Phase 1 — Application Shell

## Objective

Create the main structure shared by the application.

## Components

* [x] Sidebar
* [x] Header
* [x] Main content container
* [x] Navigation
* [x] Mobile navigation
* [x] User/profile area if appropriate

## Navigation

Initial navigation should support:

* [x] Inicio
* [x] Biblioteca
* [x] Favoritos
* [x] Leídos
* [x] Pendientes
* [x] Configuración

Only create routes that have a clear purpose in the current frontend.

Navigation items that do not yet have implemented functionality may be visually present but should not pretend to perform functionality that does not exist.

## Acceptance criteria

* Navigation works.
* Active route is visually clear.
* Desktop layout works.
* Mobile layout works.
* Sidebar does not dominate the content.
* Pinky visual identity is immediately recognizable.

---

# Phase 2 — Mock Data Foundation

## Objective

Create a realistic local data layer that allows the entire frontend to function without an API.

## Tasks

* [x] Create realistic mock books.
* [x] Include different reading statuses.
* [x] Include favorite and non-favorite books.
* [x] Include books with and without descriptions.
* [x] Include books with different metadata.
* [x] Include enough books to demonstrate grids and scrolling.
* [x] Create mock service functions.
* [x] Keep mock data isolated from UI components.

## Mock operations

Where appropriate, support frontend-only versions of:

* [x] List books
* [x] Get book
* [x] Search books
* [x] Filter books
* [x] Sort books
* [x] Create book
* [x] Edit book
* [x] Delete book
* [x] Toggle favorite
* [x] Change reading status

These operations should modify local application state only.

They must not make network requests.

## Acceptance criteria

* The application can operate without the backend running.
* Book data is realistic enough to demonstrate the UI.
* Components do not contain large hard-coded datasets.
* Mock operations behave consistently.
* The mock layer can later be replaced by real API services.

---

# Phase 3 — Library

## Objective

Create the main book browsing experience.

## Features

* [x] Book grid
* [x] Book cards
* [x] Search
* [x] Filtering
* [x] Sorting
* [x] Responsive layout
* [x] Empty state
* [x] Loading state where appropriate
* [ ] Local error simulation if useful

## Book Card

Prioritize:

1. Cover
2. Title
3. Author
4. Reading status
5. Relevant metadata

Do not overcrowd cards.

## Acceptance criteria

* Books display correctly from mock data.
* Search works locally.
* Filters work locally.
* Sorting works locally.
* Cards are responsive.
* Book covers have appropriate aspect ratios.
* Empty collections have a useful empty state.
* The library feels visually polished.

---

# Phase 4 — Book Details

## Objective

Create a detailed view for an individual book.

## Content

Potential information:

* [x] Cover
* [x] Title
* [x] Author
* [x] Description
* [x] ISBN
* [x] Publication information
* [x] Reading status
* [x] Favorite state
* [ ] User notes if appropriate
* [x] Actions

Only display information represented by the mock data model.

## Actions

Implement local frontend behavior for:

* [x] Edit
* [x] Delete
* [x] Change reading status
* [x] Toggle favorite

These actions must modify local application state only.

They must not call the backend.

## Acceptance criteria

* Detail route works.
* Data loads from mock data.
* Actions update local state.
* Loading state exists where appropriate.
* Empty/missing information is handled gracefully.

---

# Phase 5 — Book Creation and Editing

## Objective

Provide a clear and pleasant way to manage books.

## Components

* [x] BookForm
* [x] Form fields
* [x] Validation
* [x] Submit state
* [x] Error messages
* [x] Success feedback

## UX principles

Forms should not feel like administrative paperwork.

Group related information logically.

Avoid presenting unnecessary fields.

## Behavior

Create and edit operations should modify local mock state.

No API requests should be introduced.

## Acceptance criteria

* Create works locally.
* Edit works locally.
* Validation works.
* Submit buttons prevent accidental duplicate submissions.
* Loading states exist where appropriate.
* Success/error feedback is clear.

---

# Phase 6 — Dashboard

## Objective

Create a welcoming overview of the user's library.

The dashboard should feel like entering a personal library rather than viewing business analytics.

## Sections

Potential sections:

* [x] Welcome/header section
* [x] Library statistics
* [x] Recently added books
* [x] Currently reading
* [x] Favorites
* [x] Reading progress

Statistics should be calculated from mock data.

Do not hard-code statistics independently from the underlying dataset.

For example:

```text
Total books
Read
Reading
Pending
Favorites
```

should derive from the current local book state.

## Acceptance criteria

* Dashboard uses mock data.
* Statistics are dynamically calculated.
* Loading/empty states exist where appropriate.
* Dashboard remains visually calm.
* No unnecessary dashboard-card overload.

---

# Phase 7 — Favorites and Reading States

## Objective

Provide focused views of the user's collection.

## Features

* [x] Favorites
* [x] Read
* [x] Reading
* [x] Pending / unread

Reuse the same book components whenever possible.

Do not create separate visual implementations of BookCard for every section unless necessary.

## Acceptance criteria

* Filters reflect current local state.
* Empty states are useful.
* Navigation works.
* Book interactions remain consistent.
* Changes made elsewhere are reflected throughout the application.

---

# Phase 8 — Authentication UI

## Objective

Create the authentication experience visually without implementing backend authentication.

## Features

* [x] Login page
* [x] Login form
* [x] Password field
* [x] Validation
* [x] Loading state
* [x] Error state
* [x] Authentication-related visual states

Authentication may use a temporary mock state if necessary to demonstrate navigation.

Do not implement real authentication.

Do not create or modify backend authentication.

## Acceptance criteria

* Login UI is polished.
* Validation works locally.
* Loading/error states are represented.
* Protected-page behavior can be demonstrated locally if useful.
* No real API authentication is implemented.

---

# Phase 9 — Responsive Design

The application must work across:

* Desktop
* Laptop
* Tablet
* Mobile

## Desktop

Prioritize:

* Sidebar
* Large book grids
* Comfortable content width
* Clear navigation

## Tablet

Adapt:

* Sidebar
* Grid columns
* Spacing
* Header controls

## Mobile

Prioritize:

* Touch-friendly controls
* Collapsed navigation
* Single/two-column book layout where appropriate
* Comfortable typography
* No horizontal overflow

## Acceptance criteria

Test every major screen at:

* Small mobile width
* Large mobile width
* Tablet
* Desktop
* Large desktop

No major component should overflow horizontally.

---

# Phase 10 — UX States

Every interactive/asynchronous-looking feature should consider:

```text
Loading
Success
Empty
Error
```

Even when using mock data, these states should be represented where they would exist in the real application.

Examples:

## Library

```text
Loading → books loading

Success → books displayed

Empty → "Tu biblioteca está vacía"

Error → "No pudimos cargar tu biblioteca."
```

## Book details

```text
Loading → skeleton/loading state

Success → book details

Not found → book unavailable

Error → retry/message
```

Do not leave users with blank screens.

## Completion status

* [x] Library loading, success, empty, and error states
* [x] Book detail loading, success, not-found, and error states
* [x] Create/edit validation, loading, error, and success feedback
* [x] Favorite, reading-status, and deletion mutation feedback
* [x] Authentication validation, loading, error, and authenticated states

---

# Phase 11 — Accessibility

Accessibility is part of implementation, not a final optional step.

Ensure:

* [x] Semantic HTML
* [x] Keyboard navigation
* [x] Visible focus states
* [x] Accessible labels
* [x] Appropriate button names
* [x] Form labels
* [x] Dialog accessibility
* [x] Sufficient color contrast
* [x] Images have appropriate alt text
* [x] Interactive elements are usable without a mouse

Warm colors must never compromise readability.

---

# Phase 12 — Visual Polish

Once the main functionality is stable, perform a dedicated visual refinement pass.

Check:

## Typography

* [ ] Heading hierarchy
* [ ] Serif/sans-serif relationship
* [ ] Font sizes
* [ ] Line heights
* [ ] Readability

## Color

* [ ] Background
* [ ] Surface
* [ ] Primary
* [ ] Accent
* [ ] Borders
* [ ] Status colors

## Spacing

* [ ] Page padding
* [ ] Section spacing
* [ ] Card padding
* [ ] Grid gaps
* [ ] Form spacing

## Components

* [ ] Buttons
* [ ] Inputs
* [ ] Cards
* [ ] Dialogs
* [ ] Badges
* [ ] Navigation
* [ ] Empty states

## Atmosphere

The final result should communicate:

* Warmth
* Books
* Paper
* Wood
* Coffee
* Calmness
* Editorial design

Do not add decorative elements merely because they are visually interesting.

---

# 13. API Integration — Future Phase

API integration is intentionally postponed.

The project owner will implement and test this separately.

The future architecture should conceptually become:

```text
UI
 ↓
Hooks / State
 ↓
API Services
 ↓
Django REST Framework
 ↓
PostgreSQL
```

The current mock layer should make this transition straightforward.

When API integration begins, the goal should be to replace:

```text
Mock service
```

with:

```text
API service
```

without requiring a major rewrite of the UI components.

The agent must NOT implement this phase during the current frontend-only development period.

---

# 14. Error Handling

Current frontend errors should be represented independently from backend errors.

Examples:

```text
No pudimos cargar tu biblioteca.
Intenta nuevamente.
```

```text
No encontramos ese libro.
```

```text
No pudimos guardar los cambios.
```

These messages can be simulated locally where necessary.

Do not expose fake backend errors that imply a real API request occurred.

---

# 15. Loading States

Use appropriate loading UI:

* Skeletons
* Spinners
* Disabled buttons
* Loading text where appropriate

Loading states should match Pinky's visual identity.

Mock operations may intentionally simulate short loading states when useful for demonstrating the final UX.

Do not introduce unnecessary artificial delays.

---

# 16. Empty States

Empty states should be useful and friendly.

Examples:

## Empty library

```text
Tu biblioteca está esperando su primera historia.

Agrega un libro para comenzar.
```

## No search results

```text
No encontramos libros con esa búsqueda.

Prueba con otro título o autor.
```

Empty states should not blame the user.

---

# 17. Dependencies

Avoid unnecessary dependencies.

Before installing a new package, ask:

1. Is the functionality already available?
2. Can an existing dependency solve it?
3. Is the dependency necessary?
4. Does it introduce significant complexity?
5. Does it conflict with the existing stack?

Prefer the existing stack.

Use shadcn/ui components before adding another UI library.

Do not introduce:

* Bootstrap
* Material UI
* Ant Design
* Another complete UI framework

Pinky should maintain one coherent visual system.

---

# 18. Code Quality

Prefer:

* Small components
* Clear naming
* Reusable logic
* Simple abstractions
* Consistent formatting
* Minimal duplication

Avoid:

* Giant components
* Premature abstractions
* Unnecessary global state
* Copy/paste implementations
* Dead code
* Unused dependencies

Do not over-engineer simple features.

---

# 19. Git and Incremental Work

Implementation should be incremental.

Each meaningful feature should ideally be independently reviewable.

Examples:

```text
feat: add application shell
feat: add mock book data
feat: add library book grid
feat: add book search
feat: add book details
feat: add book form
feat: add dashboard
fix: handle empty library state
style: refine Pinky visual theme
```

Avoid mixing unrelated changes into a single implementation.

---

# 20. Definition of Done

A frontend feature is considered complete only when:

* [ ] Functionality works with mock data.
* [ ] Loading state exists where necessary.
* [ ] Empty state exists where necessary.
* [ ] Error state exists where necessary.
* [ ] Responsive behavior works.
* [ ] Accessibility has been considered.
* [ ] Visual design follows `DESIGN.md`.
* [ ] No unnecessary dependencies were introduced.
* [ ] Existing frontend functionality was not broken.
* [ ] Backend files were not modified.
* [ ] No API calls were introduced unless explicitly authorized.
* [ ] Production build succeeds.

---

# 21. Current Progress

## Foundation

* [x] React + Vite
* [x] Tailwind CSS 4
* [ ] shadcn/ui initialization
* [ ] Base UI configuration
* [ ] Import alias
* [ ] Pinky theme
* [ ] Typography

## Application Shell

* [x] Sidebar
* [x] Header
* [x] Navigation
* [x] Responsive shell

## Mock Data

* [x] Mock book dataset
* [x] Mock service layer
* [x] Local CRUD operations
* [x] Local search
* [x] Local filtering
* [x] Local sorting
* [x] Local favorite state
* [x] Local reading state

## Library

* [x] Book grid
* [x] Book card
* [x] Search
* [x] Filters
* [x] Sorting
* [x] Empty state
* [x] Loading state
* [x] Error state

## Book Management

* [x] Book details
* [x] Create book
* [x] Edit book
* [x] Delete book
* [x] Reading status
* [x] Favorites

## Dashboard

* [x] Dashboard page
* [x] Library statistics
* [x] Recent books
* [x] Reading overview

## Authentication UI

* [x] Login
* [x] Local/mock authentication state
* [x] Validation
* [x] Error state
* [x] Loading state

## Responsive

* [x] Desktop
* [x] Tablet
* [x] Mobile

## Final Polish

* [x] Accessibility pass
* [ ] Visual consistency pass
* [ ] UX pass
* [ ] Performance pass
* [ ] Production build
* [ ] Portfolio presentation

## Future — API Integration

* [ ] Replace mock book service
* [ ] Connect library endpoints
* [ ] Connect book details
* [ ] Connect create/edit/delete
* [ ] Connect favorites
* [ ] Connect reading status
* [ ] Connect authentication
* [ ] Test API error handling
* [ ] Remove mock services where appropriate

This section must NOT be implemented during the current frontend-only phase.

---

# 22. Current Implementation Priority

Implementation should proceed in this order:

```text
1. Foundation
       ↓
2. Application Shell
       ↓
3. Mock Data Layer
       ↓
4. Library
       ↓
5. Book Details
       ↓
6. Create/Edit Book
       ↓
7. Dashboard
       ↓
8. Favorites / Reading States
       ↓
9. Authentication UI
       ↓
10. Responsive refinement
       ↓
11. Accessibility
       ↓
12. Visual Polish
       ↓
13. Portfolio preparation
```

The primary user journey should be demonstrable entirely without the backend:

```text
Login
  ↓
Library
  ↓
Search / Filter
  ↓
View book
  ↓
Add / Edit book
  ↓
Change reading status
  ↓
Favorite book
  ↓
Return to library
```

All of these operations should work against local/mock state.

---

# 23. Agent Working Rule

When implementing a task:

1. Read `AGENTS.md`.
2. Read the relevant sections of `docs/DESIGN.md`.
3. Read the relevant sections of this file.
4. Inspect the existing frontend implementation.
5. Inspect the backend only when necessary to understand existing data structures.
6. Identify the smallest coherent frontend change.
7. Implement it using mock/local data.
8. Test the functionality.
9. Check responsive behavior.
10. Check visual consistency.
11. Ensure no backend files were modified.
12. Ensure no unauthorized API integration was introduced.
13. Update the progress checklist when appropriate.

Do not implement API integration during the current phase.

Do not modify the backend.

Do not modify backend contracts to make frontend development easier.

Do not sacrifice Pinky's visual identity merely because a component library provides a default appearance.

Do not sacrifice usability merely to make the interface look more decorative.

---

# 24. Product North Star

Pinky should ultimately feel like:

> A modern personal library application with the warmth and intimacy of a real bookstore.

The technology should remain invisible to the user.

The user should experience:

```text
Discover
    ↓
Browse
    ↓
Read
    ↓
Organize
    ↓
Return
```

The interface should make managing books feel pleasant rather than administrative.

The final product should demonstrate not only technical ability, but also attention to:

* Product thinking
* UX
* Visual design
* Frontend architecture
* Responsive development
* Accessibility
* Software quality
