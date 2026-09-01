# Pinky Agent Rules

## 1. Purpose

This document defines the mandatory rules and working methodology for AI agents working on Pinky.

Pinky is a personal library management application.

The current development phase is **FRONTEND ONLY**.

The agent's primary responsibility is to build a polished, functional, responsive, accessible, and visually coherent frontend using mock/local data.

The agent must treat the project documentation as follows:

| Document                 | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `AGENTS.md`              | Mandatory agent rules and workflow            |
| `docs/DESIGN.md`         | Visual identity and UX design authority       |
| `docs/IMPLEMENTATION.md` | Implementation roadmap and feature priorities |

---

# 2. Documentation Rules

Do not unnecessarily load or reproduce entire documentation files.

Before starting a task:

1. Read this `AGENTS.md`.
2. Identify which part of the task is relevant.
3. Read only the relevant sections of `docs/DESIGN.md`.
4. Read only the relevant sections of `docs/IMPLEMENTATION.md`.
5. Inspect the existing frontend code related to the task.

### Document responsibilities

`AGENTS.md` answers:

> How should the agent behave?

`DESIGN.md` answers:

> How should Pinky look and feel?

`IMPLEMENTATION.md` answers:

> What should be built and in what order?

Do not duplicate detailed visual specifications from `DESIGN.md` here.

Do not duplicate the implementation roadmap from `IMPLEMENTATION.md` here.

---

## Planning Mode

For implementation requests involving multiple files or architectural changes:

1. Inspect the existing project.
2. Produce an implementation plan.
3. Wait for user approval.
4. Only then begin modifying files.

Do not start implementing until the plan has been approved unless the user explicitly asks for immediate implementation.

# 3. Current Scope: Frontend Only

The current task is strictly limited to the frontend.

The backend is **READ-ONLY**.

The agent MUST NOT modify anything inside:

```text
backend/
```

This includes, but is not limited to:

* Django models
* Migrations
* Serializers
* Views
* URLs
* Permissions
* Middleware
* Settings
* Database configuration
* Authentication logic
* Business logic
* Backend dependencies
* API contracts
* Database schemas

The agent must not create, delete, rename, or modify backend files.

The agent must not run commands intended to modify the backend.

---

# 4. Backend Inspection Is Allowed

The agent MAY inspect the backend when necessary to understand the frontend requirements.

Inspection may include:

* Models
* Serializers
* API routes
* Response structures
* Authentication contracts
* Relationships
* Available fields

This information is for reference only.

**Inspection never authorizes modification.**

If the frontend appears to require a backend change:

1. Do not modify the backend.
2. Determine whether mock data can represent the required behavior.
3. Implement the frontend using the mock layer.
4. Document the future backend requirement if necessary.

---

# 5. Real API Integration Is Currently Disabled

Real API integration is intentionally postponed.

The project owner will implement and test API integration separately.

The agent MUST NOT introduce real requests to the Pinky backend.

Do not add:

```text
fetch()
axios()
XMLHttpRequest
```

or other network requests targeting the Pinky backend.

Do not create production API services during this phase.

The frontend must use mock/local data.

---

# 6. Mock Data Architecture

Mock data should be separated from UI components.

Avoid placing large datasets directly inside React components.

Prefer a structure similar to:

```text
src/
├── data/
│   └── mockBooks.js
│
├── services/
│   └── mock/
│       └── books.js
│
├── hooks/
│
├── components/
└── pages/
```

The exact structure may evolve according to the existing project.

Mock services should expose interfaces that resemble future API operations.

For example:

```text
getBooks()
getBook(id)
createBook(data)
updateBook(id, data)
deleteBook(id)
toggleFavorite(id)
updateReadingStatus(id, status)
```

These functions must remain local during the current development phase.

---

# 7. Future API Compatibility

Although real API integration is postponed, the UI should not become tightly coupled to the mock implementation.

Prefer:

```text
Page
 ↓
Hook / State
 ↓
Service
 ↓
Mock Data
```

rather than:

```text
BookCard
 ↓
directly imports mockBooks
```

Components should primarily receive data through props or appropriate state/hook abstractions.

The future API layer should be replaceable without requiring a major UI rewrite.

---

# 8. Primary Objective

Build a frontend that feels like a finished product rather than a technical prototype.

Prioritize:

1. User experience
2. Visual quality
3. Functionality
4. Component architecture
5. Responsive behavior
6. Accessibility
7. Interaction states
8. Maintainability
9. Performance

Do not sacrifice usability for visual decoration.

Do not sacrifice visual identity for convenience.

---

# 9. Design Authority

`docs/DESIGN.md` is the authority for Pinky's visual identity.

Before implementing visual changes, consult only the relevant sections of `DESIGN.md`.

Do not invent a competing visual language.

Pinky should feel:

* Warm
* Literary
* Personal
* Calm
* Editorial
* Welcoming

The visual atmosphere should evoke:

* Books
* Paper
* Wood
* Coffee
* A personal library
* A quiet bookstore

Avoid generic interfaces that feel:

* Cold
* Sterile
* Corporate
* Generic SaaS
* Excessively futuristic
* Visually noisy

When a visual decision is already defined in `DESIGN.md`, follow it instead of inventing an alternative.

---

# 10. Design System

The frontend uses:

* React
* Vite
* Tailwind CSS
* shadcn/ui
* Base UI
* Lucide-style icons where appropriate

Use these technologies as the foundation of the interface.

Do not allow library defaults to define Pinky's visual identity.

Customize components according to `DESIGN.md`.

Do not introduce another complete UI framework.

Do not introduce:

* Bootstrap
* Material UI
* Ant Design
* Other competing component systems

unless explicitly authorized.

---

# 11. Component Reuse

Prefer reusable components.

Use shadcn/ui primitives when appropriate.

Create Pinky-specific components when application-specific behavior or presentation requires them.

Examples:

```text
BookCard
BookGrid
BookCover
BookStatus
BookForm
BookFilters
LibraryStats
RecentBooks
Sidebar
AppHeader
EmptyLibrary
LoadingBookCard
```

Avoid duplicate implementations of the same UI.

If several screens display books, prefer shared book components with variants where appropriate.

Do not create abstractions without a real reuse requirement.

---

# 12. Inspect Before Modifying

Before implementing a feature:

1. Inspect the relevant existing code.
2. Check existing components.
3. Check existing routes.
4. Check existing styles.
5. Check existing state management.
6. Check existing utilities.
7. Check existing mock data.
8. Determine whether the functionality already exists.

Prefer extending existing code over replacing it unnecessarily.

Do not rewrite working code simply because another implementation is preferred.

---

# 13. Keep Components Focused

Components should have clear responsibilities.

Prefer:

```text
BookCard
 ↓
Display book information
```

over components that simultaneously:

* Fetch data
* Manage authentication
* Modify unrelated global state
* Handle backend communication
* Contain unrelated business logic

Keep presentation, state, and data access reasonably separated.

Avoid giant components.

Avoid premature abstraction.

---

# 14. State Management

Use the smallest appropriate state scope.

Prefer:

* Local state for isolated UI interactions.
* Shared state only when genuinely necessary.
* Existing project state management when already present.

Do not introduce a state-management library without a clear need.

Do not put simple UI state into global state unnecessarily.

Examples of state that normally should remain local:

* Dialog visibility
* Input values
* Temporary selections
* Hover state
* Local interaction state

---

# 15. UX Requirements

Pinky should feel pleasant to use.

Prioritize:

* Clear hierarchy
* Predictable navigation
* Obvious actions
* Consistent interactions
* Helpful feedback
* Comfortable spacing
* Readable typography
* Low cognitive load

The interface should feel like managing a personal collection, not administering a database.

---

# 16. UI States

Interactive and data-driven interfaces should account for:

```text
Loading
Success
Empty
Error
```

Do not leave users with blank screens.

Use appropriate:

* Skeletons
* Loading indicators
* Disabled states
* Empty states
* Error messages
* Retry actions

Mock services may simulate loading or error states when useful for developing and testing the UI.

Do not introduce excessive artificial delays.

---

# 17. Empty States

Collection-based interfaces should have intentional empty states.

Empty states should:

* Explain the situation.
* Suggest the next action.
* Maintain Pinky's tone.
* Avoid blaming the user.

Example:

```text
Tu biblioteca está esperando su primera historia.

Agrega un libro para comenzar.
```

---

# 18. Error Handling

User-facing errors should be understandable.

Prefer:

```text
No pudimos cargar tu biblioteca.

Intenta nuevamente.
```

over exposing technical errors such as:

```text
TypeError
500 Internal Server Error
AxiosError
```

Technical errors may be logged for debugging.

---

# 19. Forms

Forms should feel approachable rather than administrative.

Prioritize:

* Clear labels
* Logical grouping
* Useful validation
* Helpful error messages
* Clear primary actions
* Clear cancellation
* Submit/loading states
* Success feedback

Avoid unnecessary fields and unnecessary complexity.

Reuse forms where appropriate, particularly for create/edit flows.

---

# 20. Responsive Design

Responsive behavior is mandatory.

Consider:

* Mobile
* Tablet
* Laptop
* Desktop
* Large desktop

Check:

* Navigation
* Sidebar
* Book grids
* Cards
* Forms
* Dialogs
* Header
* Typography
* Spacing
* Touch targets

Avoid horizontal overflow.

Do not treat mobile as an afterthought.

---

# 21. Accessibility

Accessibility is part of implementation.

Ensure:

* Semantic HTML
* Proper heading hierarchy
* Accessible labels
* Keyboard navigation
* Visible focus states
* Accessible dialogs
* Accessible forms
* Meaningful button names
* Appropriate image alt text
* Sufficient color contrast

Do not rely exclusively on color to communicate information.

---

# 22. Typography and Color

Follow the typography and color specifications in `DESIGN.md`.

Do not introduce arbitrary colors throughout components.

Prefer semantic design tokens.

For example:

```text
background
foreground
primary
secondary
muted
accent
border
destructive
```

Do not invent random colors or typography styles when the design system already defines them.

---

# 23. Images and Book Covers

Book covers are important visual elements.

Maintain:

* Correct aspect ratio
* Appropriate cropping
* Consistent sizing
* Intentional fallback states
* Appropriate spacing

Never distort book covers.

Broken or missing covers should have a designed fallback.

---

# 24. Interaction and Animation

Provide appropriate:

* Hover states
* Focus states
* Active states
* Disabled states
* Loading states
* Success states
* Error states

Animations should be subtle and purposeful.

Avoid excessive motion or decorative animation that does not improve usability.

---

# 25. Dependencies

Before installing a dependency, determine:

1. Whether the functionality already exists.
2. Whether the current stack can solve the problem.
3. Whether the dependency is genuinely necessary.
4. Whether it introduces unnecessary complexity.
5. Whether it creates another competing system.

Prefer the existing stack.

Do not install dependencies simply for convenience.

---

# 26. File Organization

Keep frontend code organized by responsibility.

A possible structure is:

```text
src/
├── components/
│   ├── ui/
│   ├── books/
│   ├── dashboard/
│   └── layout/
│
├── pages/
├── services/
│   └── mock/
├── data/
├── hooks/
├── lib/
├── assets/
├── App.jsx
└── main.jsx
```

This is guidance, not a rigid requirement.

Adapt the structure to the existing project when appropriate.

Do not create folders solely for theoretical architecture.

---

# 27. Incremental Implementation

Implement features incrementally.

Prefer small, coherent changes.

A typical progression is:

```text
Foundation
 ↓
Application Shell
 ↓
Library
 ↓
Book Details
 ↓
Create/Edit
 ↓
Dashboard
 ↓
Reading/Favorites
 ↓
Responsive refinement
 ↓
Accessibility
 ↓
Visual polish
```

Refer to `IMPLEMENTATION.md` for the authoritative implementation roadmap.

Do not attempt to implement unrelated features together.

---

# 28. Validation

Before considering a feature complete:

* Verify the application runs.
* Verify the feature works.
* Verify the primary interaction path.
* Check browser console errors.
* Check responsive behavior.
* Check loading state when relevant.
* Check empty state when relevant.
* Check error state when relevant.
* Check keyboard interaction.
* Check consistency with `DESIGN.md`.
* Run the production build when appropriate.

Use:

```text
npm run build
```

when a production-build check is appropriate.

Never modify the backend to fix a frontend problem.

---

# 29. Git and Change Discipline

Keep changes focused.

Good examples:

```text
feat: add application shell
feat: add mock book data
feat: add library book grid
feat: add book details
feat: add book form
fix: handle empty library state
style: refine Pinky visual theme
```

Avoid unrelated refactors inside feature work.

Do not make large architectural changes without necessity.

---

# 30. Ambiguous Requirements

When a requirement is ambiguous, use this decision order:

1. Existing project conventions
2. `AGENTS.md`
3. Relevant section of `DESIGN.md`
4. Relevant section of `IMPLEMENTATION.md`
5. Existing frontend architecture
6. Simplest maintainable solution

Do not make major architectural decisions based on assumptions.

If an ambiguity could materially affect the architecture, explain the issue before proceeding.

---

# 31. Backend Limitation Protocol

If a feature cannot be fully implemented without backend functionality:

Do NOT modify the backend.

Instead:

```text
1. Implement the frontend representation.
2. Use mock data.
3. Simulate the required interaction when appropriate.
4. Keep the UI/API boundary clean.
5. Document what will require future API integration.
```

Example:

```text
Frontend:
Reading-status interaction implemented using mock state.

Future:
Persist reading status through the real API.
```

---

# 32. Agent Workflow

For every meaningful task, follow this workflow:

```text
1. Read AGENTS.md
        ↓
2. Identify relevant DESIGN.md sections
        ↓
3. Identify relevant IMPLEMENTATION.md sections
        ↓
4. Inspect existing frontend code
        ↓
5. Identify the smallest coherent change
        ↓
6. Implement using mock/local data
        ↓
7. Validate functionality
        ↓
8. Check responsive behavior
        ↓
9. Check accessibility
        ↓
10. Check visual consistency
        ↓
11. Build/test when appropriate
        ↓
12. Update implementation progress if necessary
```

Do not read entire documentation files unless the task genuinely requires it.

---

# 33. Priority Rules

When priorities conflict, use this order:

1. Do not break existing functionality.
2. Never modify the backend.
3. Follow the current frontend scope.
4. Follow `DESIGN.md` for visual decisions.
5. Follow `IMPLEMENTATION.md` for implementation priorities.
6. Use mock data instead of real API integration.
7. Prefer reusable components.
8. Keep the implementation simple.
9. Ensure responsive behavior.
10. Ensure accessibility.
11. Polish the visual experience.

---

# 34. Product North Star

Pinky should feel like:

> A modern personal library application with the warmth and intimacy of a real bookstore.

The technology should disappear behind the experience.

The user experience should communicate:

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

Pinky should make managing books feel pleasant rather than administrative.

When choosing between two technically valid solutions, prefer the one that makes Pinky:

```text
Simple
+
Warm
+
Useful
+
Accessible
+
Responsive
+
Reusable
+
Maintainable
```

The frontend experience comes first.

The real API comes later.
