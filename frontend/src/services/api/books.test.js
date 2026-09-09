import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { createBook, deleteBook, getBooks, toggleFavorite, updateBook, updateReadingStatus } from "./books.js";
import { bookApiResponseToViewModel } from "../../adapters/books.js";
import { clearTokens, setTokens } from "../../lib/api/tokens.js";

const values = new Map();
const detail = {
  id: 4, user: 1, item_type: 1, name: "Piranesi", description: "", favorite: false, possession_status: "OWNED", location: null, loaned_to: null,
  created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null,
  details: { item: 4, isbn: null, author: "Susanna Clarke", publisher: null, pages: 272, publication_year: 2020, genre: "Fantasía", cover_url: null, reading_status: "PENDING" },
};
const currentBook = bookApiResponseToViewModel(detail);

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

test("hydrates base item listings and keeps filtering local", async () => {
  globalThis.fetch = async (url) => url.endsWith("/inventory/items/")
    ? new Response(JSON.stringify([{ id: 4, item_type: 1 }, { id: 8, item_type: 2 }]), { status: 200 })
    : new Response(JSON.stringify(detail), { status: 200 });

  const books = await getBooks({ search: "susanna" });
  assert.equal(books.length, 1);
  assert.equal(books[0].title, "Piranesi");
});

test("creates the complete Item and Book with one POST request", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify({ ...detail, favorite: true, possession_status: "LOANED", location: "Repisa", loaned_to: "Nicolás" }), { status: 201 });
  };

  const book = await createBook({ title: "Piranesi", favorite: true, possessionStatus: "LOANED", location: "Repisa", loanedTo: "Nicolás", readingStatus: "PENDING" });
  assert.equal(book.favorite, true);
  assert.equal(book.possessionStatus, "LOANED");
  assert.equal(book.loanedTo, "Nicolás");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].options.method, "POST");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    item_type: 1,
    name: "Piranesi",
    description: "",
    favorite: true,
    possession_status: "LOANED",
    location: "Repisa",
    loaned_to: "Nicolás",
    details: { isbn: null, author: null, publisher: null, pages: null, publication_year: null, genre: null, cover_url: null, reading_status: "PENDING" },
  });
});

test("resolves a successful update immediately without a post-save refetch", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify({ message: "updated", data: { ...detail, name: "Piranesi revisado", details: undefined } }), { status: 200 });
  };

  const updated = await updateBook(4, { title: "Piranesi revisado", pages: "300" }, currentBook);
  assert.equal(requests.length, 1);
  assert.equal(updated.title, "Piranesi revisado");
  assert.equal(updated.pages, 300);
});

test("accepts an empty successful update response and applies submitted values", async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });
  const updated = await updateBook(4, { title: "Nuevo título", author: "Nueva autora" }, currentBook);
  assert.equal(updated.title, "Nuevo título");
  assert.equal(updated.author, "Nueva autora");
});

test("rejects a failed update so the form can display an error", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ pages: ["Ensure this value is greater than or equal to 0."] }), { status: 400 });
  await assert.rejects(() => updateBook(4, { pages: "-1" }, currentBook), { code: "VALIDATION_ERROR", status: 400 });
});

test("returns immediately synchronized favorite and reading-status mutations", async () => {
  const favoriteRequests = [];
  globalThis.fetch = async (url, options) => {
    favoriteRequests.push({ url, options });
    return new Response(JSON.stringify({ message: "updated", data: { ...detail, favorite: true, details: undefined } }), { status: 200 });
  };
  const favorite = await toggleFavorite(4, currentBook);
  assert.equal(favorite.favorite, true);
  assert.equal(favoriteRequests.length, 1);

  globalThis.fetch = async () => new Response(null, { status: 204 });
  const reading = await updateReadingStatus(4, "READ", currentBook);
  assert.equal(reading.readingStatus, "READ");
});

test("treats empty delete responses as success after the server accepts deletion", async () => {
  let requestCount = 0;
  globalThis.fetch = async () => { requestCount += 1; return new Response(null, { status: 204 }); };
  const deleted = await deleteBook(4, currentBook);
  assert.equal(requestCount, 1);
  assert.ok(deleted.deletedAt);
});
