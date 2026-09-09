import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { createBookQuote, deleteBookQuote, getBookQuotes, updateBookQuote } from "./bookQuotes.js";
import { clearTokens, setTokens } from "../../lib/api/tokens.js";

const values = new Map();
const apiQuote = { id: 2, text: "Una frase", page: 42, created_at: "created", updated_at: "updated" };

beforeEach(() => {
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  values.clear();
  setTokens({ access: "access", refresh: "refresh" });
});

afterEach(() => {
  clearTokens();
  delete globalThis.fetch;
  delete globalThis.sessionStorage;
});

test("lists and maps quotes for the URL-owned book", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify([apiQuote, { ...apiQuote, id: 3, page: null }]), { status: 200 });
  const quotes = await getBookQuotes(4);
  assert.equal(quotes[0].createdAt, "created");
  assert.equal(quotes[1].page, null);
});

test("creates quotes without sending the book or read-only fields", async () => {
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify(apiQuote), { status: 201 });
  };
  await createBookQuote(4, { text: "Una frase", page: "42", book: 9, createdAt: "ignored" });
  assert.ok(request.url.endsWith("/inventory/books/4/quotes/"));
  assert.deepEqual(JSON.parse(request.options.body), { text: "Una frase", page: 42 });
});

test("edits with PATCH and accepts a successful empty delete", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (options.method === "DELETE") return new Response(null, { status: 204 });
    return new Response(JSON.stringify({ ...apiQuote, text: "Actualizada", page: null }), { status: 200 });
  };
  const updated = await updateBookQuote(4, 2, { text: "Actualizada", page: "" });
  await deleteBookQuote(4, 2);
  assert.equal(updated.page, null);
  assert.equal(requests[0].options.method, "PATCH");
  assert.ok(requests[0].url.endsWith("/inventory/books/4/quotes/2/"));
  assert.equal(requests[1].options.method, "DELETE");
});

test("preserves quote validation failures", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ text: ["This field may not be blank."] }), { status: 400 });
  await assert.rejects(() => createBookQuote(4, { text: "", page: null }), { code: "VALIDATION_ERROR", status: 400 });
});
