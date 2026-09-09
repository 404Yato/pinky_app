export const ROUTES = Object.freeze({
  landing: "/",
  login: "/login",
  register: "/register",
  home: "/app",
  library: "/library",
  createBook: "/library/new",
  bookDetail: "/library/:bookId",
  editBook: "/library/:bookId/edit",
  favorites: "/favorites",
  read: "/read",
  reading: "/reading",
  pending: "/pending",
});

export const ROUTE_MANIFEST = [
  { path: ROUTES.landing, access: "public", id: "landing" },
  { path: ROUTES.login, access: "public", id: "login" },
  { path: ROUTES.register, access: "public", id: "register" },
  { path: ROUTES.home, access: "protected", id: "home" },
  { path: ROUTES.library, access: "protected", id: "library" },
  { path: ROUTES.createBook, access: "protected", id: "book-create" },
  { path: ROUTES.bookDetail, access: "protected", id: "book-detail" },
  { path: ROUTES.editBook, access: "protected", id: "book-edit" },
  { path: ROUTES.favorites, access: "protected", id: "favorites" },
  { path: ROUTES.read, access: "protected", id: "read" },
  { path: ROUTES.reading, access: "protected", id: "reading" },
  { path: ROUTES.pending, access: "protected", id: "pending" },
];
