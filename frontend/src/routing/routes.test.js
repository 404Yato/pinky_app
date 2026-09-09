import assert from "node:assert/strict";
import test from "node:test";
import { matchRoutes } from "react-router-dom";

import { ROUTE_MANIFEST } from "./routeConfig.js";
import { getLoginDestination, getReturnTo, getSuccessMessage, parseBookId } from "./routeState.js";

function match(pathname) {
  return matchRoutes(ROUTE_MANIFEST, pathname)?.at(-1) ?? null;
}

test("matches every public route", () => {
  assert.equal(match("/")?.route.id, "landing");
  assert.equal(match("/login")?.route.id, "login");
  assert.equal(match("/register")?.route.id, "register");
  assert.equal(match("/login")?.route.access, "public");
});

test("marks application routes as protected", () => {
  for (const path of ["/app", "/library", "/library/new", "/favorites", "/read", "/reading", "/pending"]) {
    assert.equal(match(path)?.route.access, "protected", path);
  }
});

test("matches dynamic detail and edit routes with their IDs", () => {
  assert.equal(match("/library/25")?.route.id, "book-detail");
  assert.equal(match("/library/25")?.params.bookId, "25");
  assert.equal(match("/library/25/edit")?.route.id, "book-edit");
  assert.equal(match("/library/25/edit")?.params.bookId, "25");
});

test("validates book route parameters", () => {
  assert.equal(parseBookId("25"), 25);
  assert.equal(parseBookId("0"), null);
  assert.equal(parseBookId("book"), null);
});

test("keeps transient success feedback in navigation state", () => {
  assert.equal(getSuccessMessage({ success: "created" }), "El libro se agregó a tu biblioteca.");
  assert.equal(getSuccessMessage({ success: "updated" }), "Los cambios se guardaron correctamente.");
  assert.equal(getSuccessMessage({ success: "deleted" }), "El libro se eliminó de tu biblioteca.");
  assert.equal(getSuccessMessage({ success: "unknown" }), null);
});

test("keeps only safe collection return context", () => {
  assert.equal(getReturnTo({ returnTo: "/favorites" }), "/favorites");
  assert.equal(getReturnTo({ returnTo: "https://evil.example" }), "/library");
  assert.equal(getReturnTo(null), "/library");
});

test("returns to a protected destination after login", () => {
  assert.equal(getLoginDestination({ from: "/library/25" }), "/library/25");
  assert.equal(getLoginDestination({ from: "//evil.example" }), "/app");
  assert.equal(getLoginDestination({ from: "/login" }), "/app");
});

test("does not match unknown routes", () => {
  assert.equal(match("/settings"), null);
  assert.equal(match("/not-a-real-route"), null);
});
