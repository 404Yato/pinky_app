import { getFocusedCollectionByPath } from "../config/collections.js";

const SAFE_RETURN_PATHS = new Set(["/library", "/favorites", "/read", "/reading", "/pending"]);
const SUCCESS_VALUES = new Set(["created", "updated", "deleted"]);

function getSuccess(query) {
  const success = query.get("success");
  return SUCCESS_VALUES.has(success) ? success : null;
}

function getReturnTo(query) {
  const returnTo = query.get("from");
  return SAFE_RETURN_PATHS.has(returnTo) ? returnTo : "/library";
}

export function parseRoute(path = "/") {
  const [pathname, queryString = ""] = path.split("?");
  const query = new URLSearchParams(queryString);
  const editMatch = pathname.match(/^\/library\/(\d+)\/edit$/);
  const detailMatch = pathname.match(/^\/library\/(\d+)$/);
  const collection = getFocusedCollectionByPath(pathname);

  if (pathname === "/login") return { page: "login", bookId: null, success: null };
  if (pathname === "/library/new") return { page: "book-create", bookId: null, success: null };
  if (editMatch) return { page: "book-edit", bookId: Number(editMatch[1]), success: null, returnTo: getReturnTo(query) };
  if (detailMatch) return { page: "book-detail", bookId: Number(detailMatch[1]), success: getSuccess(query), returnTo: getReturnTo(query) };
  if (pathname === "/library") return { page: "library", bookId: null, success: getSuccess(query) };
  if (collection) return { page: "collection", collectionId: collection.id, bookId: null, success: getSuccess(query) };
  return { page: "home", bookId: null, success: null };
}

export function readRoute() {
  return parseRoute(window.location.hash.replace(/^#/, "") || "/");
}

export function withReturnTo(path, returnTo) {
  if (!SAFE_RETURN_PATHS.has(returnTo) || returnTo === "/library") return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}from=${encodeURIComponent(returnTo)}`;
}

export function withSuccess(path, success) {
  if (!SUCCESS_VALUES.has(success)) return path;
  const [pathname, queryString = ""] = path.split("?");
  const query = new URLSearchParams(queryString);
  query.set("success", success);
  return `${pathname}?${query.toString()}`;
}

export function navigateTo(path) {
  const nextHash = `#${path}`;
  if (window.location.hash === nextHash) return;
  window.location.hash = nextHash;
}
