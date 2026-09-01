# Pinky App — Design System & Visual Identity

## 1. Design Philosophy

Pinky is a personal library management application.

Its visual identity should evoke the feeling of entering a small, warm, quiet bookstore or personal library: wooden shelves, old books, cream-colored paper, coffee, soft afternoon light, leather bindings, and a calm place to sit and read.

The interface should feel **warm, intimate, editorial, human and cozy**, while remaining modern, clean and highly usable.

### Desired emotional response

When someone opens Pinky, the visual impression should be:

> "This feels like a place where I would like to sit down with a book and a coffee."

The interface should subtly evoke:

* Coffee
* Wood
* Books
* Cream paper
* Aged paper
* Leather
* Warm natural light
* Small independent bookstores
* Personal libraries
* Reading
* Calmness
* Nostalgia
* Craftsmanship

The design should **suggest these sensations rather than represent them literally**.

Pinky should not look like a themed website or a vintage decoration project. It should look like a **modern application inspired by the atmosphere of a beautiful bookstore**.

---

# 2. Core Visual Principles

## Warm, not dark

Pinky should use warm colors without becoming visually heavy.

The main interface should remain light and comfortable to read.

Prefer:

* Cream backgrounds
* Warm whites
* Soft beige
* Muted browns
* Terracotta accents
* Warm shadows

Avoid:

* Pure white as the dominant background
* Large areas of dark brown
* Black backgrounds
* Excessive contrast
* Saturated orange

---

## Editorial, not corporate

Pinky should feel closer to an editorial product or a beautifully designed reading application than a generic SaaS dashboard.

Use:

* Serif typography for important headings
* Sans-serif typography for interface elements
* Generous whitespace
* Clear hierarchy
* Subtle borders
* Carefully controlled spacing

Avoid:

* Generic corporate dashboard aesthetics
* Excessive cards
* Excessive rounded corners
* Dense interfaces
* Excessive visual decoration

---

## Cozy, not rustic

The design can be inspired by wood and old books, but it should not look like a rustic restaurant website.

Avoid:

* Literal wood textures everywhere
* Fake paper backgrounds
* Heavy vintage filters
* Excessive ornaments
* Overly decorative typography
* Parchment effects
* "Old-timey" UI

The inspiration should be felt through **color, typography, spacing, contrast and subtle details**.

---

# 3. Color System

The primary palette is inspired by:

* Cream paper
* Aged paper
* Coffee
* Wood
* Leather
* Terracotta
* Caramel

## Primary palette

| Token        | Hex       | Purpose                                   |
| ------------ | --------- | ----------------------------------------- |
| `paper`      | `#F5EFE4` | Main application background               |
| `paper-dark` | `#EDE3D2` | Secondary backgrounds and subtle sections |
| `surface`    | `#FBF7EF` | Cards, panels and elevated surfaces       |
| `ink`        | `#3B2A20` | Primary text                              |
| `brown`      | `#735B48` | Secondary text                            |
| `wood`       | `#8B5E3C` | Primary brand color                       |
| `wood-dark`  | `#68432B` | Hover states and emphasis                 |
| `terracotta` | `#C9824B` | Accent color                              |
| `caramel`    | `#DFA574` | Soft accent and secondary highlights      |
| `parchment`  | `#D8C7B2` | Borders, dividers and subtle UI elements  |

### Color hierarchy

The general visual hierarchy should be:

```text
Paper
  ↓
Surface
  ↓
Ink
  ↓
Brown
  ↓
Wood
  ↓
Terracotta
```

The warm accent colors should be used deliberately.

Do not use terracotta or orange as the dominant color of large surfaces.

---

# 4. Semantic Color Usage

Colors should have semantic roles rather than being applied randomly.

### Background

Primary page background:

`#F5EFE4`

This should resemble warm cream paper.

Avoid pure white (`#FFFFFF`) as the main page background.

---

### Surface

Cards and elevated containers:

`#FBF7EF`

Surfaces should be slightly lighter than the page background.

This creates hierarchy without requiring heavy shadows.

---

### Primary text

`#3B2A20`

Primary text should feel like dark brown ink rather than pure black.

Avoid using `#000000` for normal UI text.

---

### Secondary text

`#735B48`

Use for:

* Metadata
* Descriptions
* Secondary labels
* Supporting information

---

### Primary action

`#8B5E3C`

Use for:

* Primary buttons
* Important interactive elements
* Selected navigation states
* Brand elements

Hover/active emphasis:

`#68432B`

---

### Accent

`#C9824B`

Use for:

* Highlights
* Favorite indicators
* Important secondary actions
* Small visual accents
* Status indicators where appropriate

Accent colors should remain restrained.

---

### Borders

`#D8C7B2`

Borders should be subtle and warm.

Avoid cold gray borders such as:

`#E5E7EB`

unless there is a specific accessibility or technical reason.

---

# 5. Typography

Typography is an important part of Pinky's identity.

The application should combine:

### Editorial serif

Use a serif typeface for:

* Page titles
* Major headings
* Book titles where appropriate
* Important editorial content

Potential font families include:

* Lora
* Libre Baskerville
* Cormorant Garamond
* Source Serif
* Georgia as a fallback

The serif typeface should feel literary and elegant without becoming ornamental.

---

### Modern sans-serif

Use a clean sans-serif for:

* Navigation
* Buttons
* Inputs
* Filters
* Metadata
* Tables
* Form labels
* System messages

Potential choices include:

* Inter
* Geist
* DM Sans
* system-ui

The sans-serif should provide clarity and usability.

---

## Typography rule

The combination should communicate:

```text
Headings → books / editorial / literature

Interface → modern / functional / clear
```

Do not use serif typography for every element.

Do not use decorative fonts.

---

# 6. Layout

Pinky should use generous whitespace.

The interface should feel calm rather than dense.

Prefer:

* Comfortable padding
* Clear section separation
* Moderate content widths
* Consistent spacing
* Strong visual hierarchy

Avoid:

* Filling every available pixel
* Extremely dense dashboards
* Excessive separators
* Too many simultaneous visual elements

The user should feel that there is room to breathe.

---

# 7. Application Shell

The application shell should establish the bookstore/library atmosphere.

A desktop layout can use:

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│  SIDEBAR          MAIN CONTENT                      │
│                                                     │
│  Pinky            Page title                        │
│                                                     │
│  Inicio           Supporting text                   │
│  Biblioteca                                         │
│  Favoritos        ┌─────────────────────────────┐   │
│  Leídos           │                             │   │
│  Pendientes       │       Content               │   │
│                   │                             │   │
│                   └─────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

The sidebar may use a deeper warm brown.

Recommended sidebar background:

`#3B2A20`

Recommended sidebar foreground:

`#F5EFE4`

However, the sidebar should not visually overpower the content.

---

# 8. Navigation

Navigation should feel simple and familiar.

Potential sections:

* Inicio
* Biblioteca
* Favoritos
* Leídos
* Pendientes
* Configuración

Use simple, recognizable icons.

Icons should support the interface rather than become decorative elements.

Avoid excessive icon usage.

---

# 9. Cards

Cards should feel like lightweight pieces of paper or library catalog entries.

Recommended characteristics:

* Warm surface color
* Subtle warm border
* Very soft shadow
* Moderate corner radius
* Generous internal spacing

Cards should not look like floating glass panels.

Avoid:

* Strong shadows
* Glassmorphism
* Excessive gradients
* Excessive border radius
* Neon effects

---

# 10. Book Cards

Books are the central content of Pinky and should receive special attention.

A book card should prioritize:

1. Cover
2. Title
3. Author
4. Reading status
5. Optional metadata

Example conceptual structure:

```text
┌──────────────────────┐
│                      │
│      BOOK COVER      │
│                      │
│                      │
├──────────────────────┤
│ Dune                 │
│ Frank Herbert        │
│                      │
│ ● Leído              │
└──────────────────────┘
```

The book cover should be visually dominant.

Do not overcrowd book cards with metadata.

---

# 11. Dashboard

The dashboard should feel like opening a personal library rather than opening a business analytics dashboard.

Potential information:

* Total books
* Books read
* Books currently reading
* Books pending
* Favorites
* Recently added books
* Recently read books

Statistics should remain visually calm.

Avoid turning the dashboard into a collection of generic metric cards.

---

# 12. Forms

Forms should prioritize clarity.

Use:

* Clear labels
* Comfortable input sizes
* Strong focus states
* Helpful validation
* Simple grouping

Inputs should use the warm color system.

Focus states should use the Pinky primary/accent palette rather than default browser blue.

---

# 13. Buttons

Buttons should feel tactile and warm without looking decorative.

Primary button:

* Wood brown background
* Cream/light text
* Subtle hover transition

Secondary button:

* Cream/light background
* Brown text
* Warm border

Destructive button:

* Use a muted red appropriate to the warm palette
* Do not use extremely saturated red unless necessary for clarity

Avoid excessive use of primary-colored buttons.

Not every action needs to look equally important.

---

# 14. Borders and Shadows

Borders should be subtle.

Preferred border:

`#D8C7B2`

Shadows should be soft and low contrast.

The visual hierarchy should primarily come from:

1. Background differences
2. Spacing
3. Typography
4. Borders
5. Shadows

Do not rely heavily on shadows to separate every component.

---

# 15. Border Radius

Use moderate rounding.

The application should feel modern but not overly playful.

Avoid:

* Extremely rounded cards
* Pill-shaped elements everywhere
* Excessive `rounded-full`

Use pill shapes only where semantically appropriate, such as:

* Tags
* Status badges
* Small filters

---

# 16. Motion and Interaction

Animations should be subtle.

Preferred:

* Small hover transitions
* Soft opacity changes
* Short transforms
* Gentle modal transitions
* Clear focus states

Avoid:

* Large entrance animations
* Excessive bouncing
* Parallax
* Constant motion
* Decorative animations that distract from reading

Pinky should feel calm.

---

# 17. Texture

Texture may be used very subtly.

A very light paper-like texture can be considered for large background surfaces if it improves the atmosphere.

However:

**Texture must never interfere with readability.**

Avoid obvious:

* Paper images
* Wood photographs
* Noise overlays
* Vintage filters
* Heavy grain

The goal is:

> "It feels like paper."

Not:

> "There is a paper texture behind everything."

---

# 18. Photography and Imagery

When imagery is used, prefer:

* Books
* Shelves
* Paper
* Wooden desks
* Coffee
* Warm natural light
* Reading spaces

Images should have warm, natural tones.

Avoid overly staged stock photography.

Book covers should remain visually accurate and recognizable.

---

# 19. Iconography

Icons should be simple and consistent.

Lucide-style icons are preferred when suitable.

Icons should generally be:

* Minimal
* Rounded
* Clear
* Functional

Do not mix several unrelated icon styles.

Icons should never overpower typography or book covers.

---

# 20. Responsive Design

Pinky must work comfortably on:

* Desktop
* Laptop
* Tablet
* Mobile

The visual identity must remain intact across breakpoints.

On mobile:

* Sidebar may collapse into navigation
* Book grid should adapt naturally
* Controls should remain touch-friendly
* Typography should scale appropriately
* Avoid horizontal overflow

Mobile should feel like the same product, not a separate design.

---

# 21. Accessibility

Warm colors must not compromise accessibility.

Always prioritize:

* Sufficient text contrast
* Visible focus states
* Keyboard navigation
* Semantic HTML
* Accessible labels
* Appropriate ARIA attributes when required
* Clear error states

If a warm color combination fails contrast requirements, adjust the color rather than sacrificing accessibility.

---

# 22. Component Library

Pinky uses **shadcn/ui** with **Base UI** primitives.

shadcn components should be treated as building blocks rather than the final visual identity.

Prefer existing components for common UI patterns:

* Button
* Card
* Dialog
* Input
* Select
* Dropdown
* Tabs
* Badge
* Table
* Tooltip
* Sheet
* Form controls

Components should be customized to follow Pinky's design system.

Do not allow the default shadcn appearance to override Pinky's visual identity.

---

# 23. Design System Rule

When deciding between two visually valid solutions, prefer the one that better communicates:

```text
Warm
Editorial
Calm
Human
Literary
Cozy
Modern
```

in that order.

The interface should feel like:

> **a modern digital library living inside a warm physical bookstore.**

---

# 24. Things to Avoid

Pinky should NOT look like:

* A generic SaaS dashboard
* A banking application
* A corporate admin panel
* A futuristic AI interface
* A cryptocurrency application
* A glassmorphism showcase
* A neon cyberpunk interface
* A monochromatic gray application
* A blue corporate product
* A generic Bootstrap template
* An overly rustic/vintage website

Avoid:

* Cold grays as the dominant palette
* Pure white backgrounds
* Excessive blue
* Excessive purple
* Neon colors
* Strong gradients
* Glassmorphism
* Excessive shadows
* Excessive rounded corners
* Excessive animations
* Decorative elements without purpose

---

# 25. Design North Star

Every visual decision should answer the following question:

> **Does this make Pinky feel more like a beautiful, warm personal library where someone would want to sit with a book and a coffee?**

If yes, it is probably aligned with the design direction.

If no, reconsider the choice.

The final goal is not to make Pinky look "vintage".

The goal is to make Pinky feel **warm, literary, tactile and inviting while remaining unmistakably modern software**.
