import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { createBook, deleteBook, getBook, getBooks, toggleFavorite, updateBook, updateReadingStatus } from "./books.js";
import { normalizeBookItem } from "../../adapters/books.js";
import { clearTokens, setTokens } from "../../lib/api/tokens.js";

const values = new Map();
const detail = {
  id: 4, user: 1, item_type: 1, name: "Piranesi", description: "", comments: "Mi nota", favorite: false, possession_status: "OWNED", location: null, loaned_to: null,
  created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null,
  details: { item: 4, isbn: null, author: "Susanna Clarke", publisher: null, pages: 272, publication_year: 2020, genre: "Fantasía", cover_url: null, reading_status: "PENDING" },
};
const currentBook = normalizeBookItem(detail);

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

test("loads nested collection details with one request and keeps filtering local", async () => {
  const requests = [];
  const { comments: _comments, deleted_at: _deletedAt, user: _user, ...collectionItem } = detail;
  globalThis.fetch = async (url) => {
    requests.push(url);
    return new Response(JSON.stringify([
      collectionItem,
      { ...collectionItem, id: 5, name: "Jonathan Strange", details: { ...collectionItem.details, item: 5, author: "Susanna Clarke" } },
      { id: 8, item_type: 2, name: "Vinilo", details: { artist: "Björk" } },
    ]), { status: 200 });
  };

  const books = await getBooks({ search: "susanna" });
  assert.equal(books.length, 2);
  assert.ok(books.every((book) => book.details.author === "Susanna Clarke"));
  assert.equal(books[0].comments, "");
  assert.equal(requests.length, 1);
  assert.match(requests[0], /\/inventory\/items\/$/);
});

test("keeps one explicit nested request for a selected book detail", async () => {
  const requests = [];
  globalThis.fetch = async (url) => {
    requests.push(url);
    return new Response(JSON.stringify(detail), { status: 200 });
  };

  const book = await getBook(4);
  assert.equal(book.details.author, "Susanna Clarke");
  assert.equal(book.comments, "Mi nota");
  assert.equal(requests.length, 1);
  assert.match(requests[0], /\/inventory\/items\/4\/$/);
});

test("creates the complete Item and Book with one POST request", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    const { details: _details, ...createdItem } = detail;
    return new Response(JSON.stringify({ ...createdItem, comments: "Un **recuerdo**", favorite: true, possession_status: "LOANED", location: "Repisa", loaned_to: "Nicolás" }), { status: 201 });
  };

  const book = await createBook({ title: "Piranesi", comments: "Un **recuerdo**", favorite: true, possessionStatus: "LOANED", location: "Repisa", loanedTo: "Nicolás", coverUrl: "https://example.com/cover", readingStatus: "PENDING" });
  assert.equal(book.favorite, true);
  assert.equal(book.possession_status, "LOANED");
  assert.equal(book.loaned_to, "Nicolás");
  assert.equal(book.details.cover_url, "https://example.com/cover");
  assert.equal(book.comments, "Un **recuerdo**");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].options.method, "POST");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    item_type: 1,
    name: "Piranesi",
    description: "",
    comments: "Un **recuerdo**",
    favorite: true,
    possession_status: "LOANED",
    location: "Repisa",
    loaned_to: "Nicolás",
    details: { isbn: null, author: null, publisher: null, pages: null, publication_year: null, genre: null, cover_url: "https://example.com/cover", reading_status: "PENDING" },
  });
});

test("resolves a successful update immediately without a post-save refetch", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify({ message: "updated", data: { ...detail, name: "Piranesi revisado", comments: "Nueva *nota*", details: undefined } }), { status: 200 });
  };

  const updated = await updateBook(4, { title: "Piranesi revisado", comments: "Nueva *nota*", pages: "300", coverUrl: "https://example.com/new-cover" }, currentBook);
  assert.equal(requests.length, 1);
  assert.equal(updated.name, "Piranesi revisado");
  assert.equal(updated.details.pages, 300);
  assert.equal(updated.details.cover_url, "https://example.com/new-cover");
  assert.equal(updated.comments, "Nueva *nota*");
  assert.equal(JSON.parse(requests[0].options.body).details.cover_url, "https://example.com/new-cover");
  assert.equal(JSON.parse(requests[0].options.body).comments, "Nueva *nota*");
});

test("accepts an empty successful update response and applies submitted values", async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });
  const updated = await updateBook(4, { title: "Nuevo título", author: "Nueva autora" }, currentBook);
  assert.equal(updated.name, "Nuevo título");
  assert.equal(updated.details.author, "Nueva autora");
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
  assert.equal(reading.details.reading_status, "READ");
});

test("treats empty delete responses as success after the server accepts deletion", async () => {
  let requestCount = 0;
  globalThis.fetch = async () => { requestCount += 1; return new Response(null, { status: 204 }); };
  const deleted = await deleteBook(4, currentBook);
  assert.equal(requestCount, 1);
  assert.ok(deleted.deleted_at);
});
