export function readRoute() {
  const path = window.location.hash.replace(/^#/, "") || "/";
  const [pathname, queryString = ""] = path.split("?");
  const query = new URLSearchParams(queryString);
  const editMatch = pathname.match(/^\/library\/(\d+)\/edit$/);
  const detailMatch = pathname.match(/^\/library\/(\d+)$/);

  if (pathname === "/library/new") return { page: "book-create", bookId: null, success: null };
  if (editMatch) return { page: "book-edit", bookId: Number(editMatch[1]), success: null };
  if (detailMatch) return { page: "book-detail", bookId: Number(detailMatch[1]), success: query.get("success") };
  if (pathname === "/library") return { page: "library", bookId: null, success: null };
  return { page: "home", bookId: null, success: null };
}

export function navigateTo(path) {
  const nextHash = `#${path}`;
  if (window.location.hash === nextHash) return;
  window.location.hash = nextHash;
}
