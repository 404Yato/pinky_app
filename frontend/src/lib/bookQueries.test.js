import assert from "node:assert/strict";
import test from "node:test";

import { BOOK_SORT_FIELD, READING_STATUS, SORT_DIRECTION } from "../constants/books.js";
import { normalizeBookQuery, queryBookCollection } from "./bookQueries.js";

const books = [
  { id: 1, name: "Demián", favorite: true, created_at: "2026-01-01T00:00:00Z", details: { author: "Hermann Hesse", publisher: null, isbn: "9788499890913", genre: "Novela", publication_year: 1919, reading_status: READING_STATUS.READ } },
  { id: 2, name: "El extranjero", favorite: false, created_at: "2026-02-01T00:00:00Z", details: { author: null, publisher: "Alianza", isbn: null, genre: "Ficción", publication_year: 1942, reading_status: READING_STATUS.PENDING } },
  { id: 3, name: "Sin detalles", favorite: false, created_at: null, details: null },
];

test("uses the canonical default query when the query is absent", () => {
  assert.deepEqual(queryBookCollection([], undefined), []);
  assert.deepEqual(normalizeBookQuery(null), normalizeBookQuery(undefined));
  assert.deepEqual(queryBookCollection(books).map(({ id }) => id), [2, 1, 3]);
});

test("searches nested metadata accent-insensitively and null-safely", () => {
  assert.deepEqual(queryBookCollection(books, { search: " demian " }).map(({ id }) => id), [1]);
  assert.deepEqual(queryBookCollection(books, { search: "hermann" }).map(({ id }) => id), [1]);
  assert.deepEqual(queryBookCollection(books, { search: "9788499890913" }).map(({ id }) => id), [1]);
  assert.deepEqual(queryBookCollection(books, { search: "alianza" }).map(({ id }) => id), [2]);
  assert.deepEqual(queryBookCollection(books, { search: "ficcion" }).map(({ id }) => id), [2]);
});

test("filters nested reading status and root favorite", () => {
  assert.deepEqual(queryBookCollection(books, { favorite: true }).map(({ id }) => id), [1]);
  assert.deepEqual(queryBookCollection(books, { status: READING_STATUS.PENDING }).map(({ id }) => id), [2]);
});

test("sorts nested fields without crashing on null details", () => {
  assert.deepEqual(queryBookCollection(books, { sortBy: BOOK_SORT_FIELD.AUTHOR, sortDirection: SORT_DIRECTION.ASCENDING }).map(({ id }) => id), [1, 2, 3]);
  assert.deepEqual(queryBookCollection(books, { sortBy: BOOK_SORT_FIELD.PUBLICATION_YEAR, sortDirection: SORT_DIRECTION.DESCENDING }).map(({ id }) => id), [2, 1, 3]);
});

test("clearing search restores the original collection", () => {
  assert.equal(queryBookCollection(books, { search: "demian" }).length, 1);
  assert.equal(queryBookCollection(books, { search: "" }).length, books.length);
});
