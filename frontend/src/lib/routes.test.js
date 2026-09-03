import assert from "node:assert/strict";
import test from "node:test";

import { parseRoute, withReturnTo } from "./routes.js";

test("parses each focused collection route", () => {
  for (const collectionId of ["favorites", "read", "reading", "pending"]) {
    assert.deepEqual(parseRoute(`/${collectionId}`), { page: "collection", collectionId, bookId: null, success: null });
  }
});

test("parses the login route without treating it as application home", () => {
  assert.deepEqual(parseRoute("/login"), { page: "login", bookId: null, success: null });
});

test("preserves an allow-listed collection return route", () => {
  assert.equal(withReturnTo("/library/3", "/favorites"), "/library/3?from=%2Ffavorites");
  assert.deepEqual(parseRoute("/library/3?from=%2Ffavorites"), {
    page: "book-detail",
    bookId: 3,
    success: null,
    returnTo: "/favorites",
  });
  assert.equal(parseRoute("/library/3?from=https%3A%2F%2Fevil.example").returnTo, "/library");
});

test("keeps return context when a detail URL already has a query", () => {
  const path = withReturnTo("/library/2?success=updated", "/reading");
  assert.equal(path, "/library/2?success=updated&from=%2Freading");
  assert.equal(parseRoute(path).returnTo, "/reading");
});
