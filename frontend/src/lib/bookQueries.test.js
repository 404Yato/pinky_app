import assert from "node:assert/strict";
import test from "node:test";

import { READING_STATUS } from "../constants/books.js";
import { normalizeBookQuery, queryBookCollection } from "./bookQueries.js";

const books = [
  {
    id: 1,
    title: "Demián",
    author: "Hermann Hesse",
    publisher: null,
    isbn: "9788499890913",
    genre: null,
    favorite: true,
    readingStatus: READING_STATUS.READ,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "El extranjero",
    author: null,
    publisher: "Alianza",
    isbn: null,
    genre: "Novela",
    favorite: false,
    readingStatus: READING_STATUS.PENDING,
    createdAt: "2026-02-01T00:00:00Z",
  },
];

test("uses the canonical default query when the query is absent", () => {
  assert.deepEqual(queryBookCollection([], undefined), []);
  assert.deepEqual(normalizeBookQuery(null), normalizeBookQuery(undefined));
  assert.deepEqual(queryBookCollection(books).map(({ id }) => id), [2, 1]);
});

test("searches normal text safely when optional book fields are null", () => {
  assert.deepEqual(queryBookCollection(books, { search: " demian " }).map(({ id }) => id), [1]);
  assert.deepEqual(queryBookCollection(books, { search: "alianza" }).map(({ id }) => id), [2]);
  assert.deepEqual(queryBookCollection(books, { search: "no existe" }), []);
});

test("an empty partial query restores the complete collection", () => {
  const searched = queryBookCollection(books, { search: "demian" });
  const cleared = queryBookCollection(books, { search: "" });

  assert.equal(searched.length, 1);
  assert.equal(cleared.length, books.length);
  assert.equal(books.length, 2);
});

test("accepts the partial queries used by focused collections", () => {
  assert.deepEqual(queryBookCollection(books, { favorite: true }).map(({ id }) => id), [1]);
  assert.deepEqual(queryBookCollection(books, { status: READING_STATUS.PENDING }).map(({ id }) => id), [2]);
});
