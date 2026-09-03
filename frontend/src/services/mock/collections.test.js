import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { focusedCollections } from "../../config/collections.js";
import { READING_STATUS } from "../../constants/books.js";
import { getBooks, resetMockBooks, toggleFavorite, updateReadingStatus } from "./books.js";

beforeEach(() => resetMockBooks());

test("focused collection queries return only matching local books", async () => {
  const favorites = await getBooks(focusedCollections.favorites.query);
  const read = await getBooks(focusedCollections.read.query);
  const reading = await getBooks(focusedCollections.reading.query);
  const pending = await getBooks(focusedCollections.pending.query);

  assert.ok(favorites.length > 0 && favorites.every((book) => book.favorite));
  assert.ok(read.length > 0 && read.every((book) => book.readingStatus === READING_STATUS.READ));
  assert.ok(reading.length > 0 && reading.every((book) => book.readingStatus === READING_STATUS.READING));
  assert.ok(pending.length > 0 && pending.every((book) => book.readingStatus === READING_STATUS.PENDING));
});

test("favorite and reading-state changes are reflected by focused queries", async () => {
  const bookId = 2;
  const originallyFavorite = (await getBooks(focusedCollections.favorites.query)).some(({ id }) => id === bookId);
  await toggleFavorite(bookId);
  assert.equal((await getBooks(focusedCollections.favorites.query)).some(({ id }) => id === bookId), !originallyFavorite);

  await updateReadingStatus(bookId, READING_STATUS.READING);
  assert.equal((await getBooks(focusedCollections.reading.query)).some(({ id }) => id === bookId), true);
  assert.equal((await getBooks(focusedCollections.read.query)).some(({ id }) => id === bookId), false);
});
