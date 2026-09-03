import assert from "node:assert/strict";
import test from "node:test";

import { READING_STATUS } from "../../constants/books.js";
import { getDashboardSections, getLibraryStats, getReadingProgress } from "../../lib/dashboard.js";

const books = [
  { id: 1, createdAt: "2026-01-01T10:00:00.000Z", readingStatus: READING_STATUS.READ, favorite: true },
  { id: 2, createdAt: "2026-03-01T10:00:00.000Z", readingStatus: READING_STATUS.READING, favorite: false },
  { id: 3, createdAt: "2026-02-01T10:00:00.000Z", readingStatus: READING_STATUS.PENDING, favorite: true },
];

test("dashboard statistics derive from canonical uppercase reading statuses", () => {
  assert.deepEqual(getLibraryStats(books), { total: 3, read: 1, reading: 1, pending: 1, favorites: 2 });
});

test("dashboard sections order recent books and select reading and favorite books", () => {
  const sections = getDashboardSections(books, 2);
  assert.deepEqual(sections.recent.map(({ id }) => id), [2, 3]);
  assert.deepEqual(sections.reading.map(({ id }) => id), [2]);
  assert.deepEqual(sections.favorites.map(({ id }) => id), [3, 1]);
});

test("reading progress derives percentages and handles an empty library", () => {
  assert.deepEqual(getReadingProgress(books).map(({ percentage }) => percentage), [33, 33, 33]);
  assert.deepEqual(getLibraryStats([]), { total: 0, read: 0, reading: 0, pending: 0, favorites: 0 });
  assert.ok(getReadingProgress([]).every(({ count, percentage }) => count === 0 && percentage === 0));
});
