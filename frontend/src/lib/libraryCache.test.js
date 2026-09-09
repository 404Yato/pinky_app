import assert from "node:assert/strict";
import test from "node:test";

import { READING_STATUS } from "../constants/books.js";
import { queryBookCollection } from "./bookQueries.js";
import { createSharedRequest, removeBookFromCollection, updateCollectionQueryState, upsertBookInCollection } from "./libraryCache.js";

const firstBook = { id: 1, name: "Demián", favorite: false, details: { reading_status: READING_STATUS.PENDING }, created_at: "2026-01-01T00:00:00Z" };

test("shares one in-flight library load between consumers", async () => {
  let calls = 0;
  const load = createSharedRequest(async () => {
    calls += 1;
    return [firstBook];
  });

  const [library, favorites] = await Promise.all([load(), load()]);
  assert.equal(calls, 1);
  assert.deepEqual(library, favorites);
});

test("upserts successful mutations without changing the previous collection", () => {
  const original = [firstBook];
  const favorite = { ...firstBook, favorite: true };
  const updated = upsertBookInCollection(original, favorite);

  assert.equal(original[0].favorite, false);
  assert.equal(queryBookCollection(updated, { favorite: true })[0].id, firstBook.id);

  const reading = upsertBookInCollection(updated, { ...favorite, details: { ...favorite.details, reading_status: READING_STATUS.READING } });
  assert.equal(queryBookCollection(reading, { status: READING_STATUS.READING })[0].id, firstBook.id);
  assert.deepEqual(queryBookCollection(reading, { status: READING_STATUS.PENDING }), []);
});

test("adds created books and removes deleted books from every derived view", () => {
  const created = { id: 2, name: "Otro libro", favorite: true, details: { reading_status: READING_STATUS.READ }, created_at: "2026-02-01T00:00:00Z" };
  const withCreated = upsertBookInCollection([firstBook], created);
  const afterDelete = removeBookFromCollection(withCreated, created.id);

  assert.equal(withCreated.length, 2);
  assert.equal(queryBookCollection(withCreated, { favorite: true }).length, 1);
  assert.equal(afterDelete.length, 1);
  assert.deepEqual(queryBookCollection(afterDelete, { favorite: true }), []);
});

test("empty shared collections remain safe", () => {
  assert.deepEqual(upsertBookInCollection([], null), []);
  assert.deepEqual(removeBookFromCollection([], 1), []);
  assert.deepEqual(queryBookCollection([], undefined), []);
});

test("keeps each collection search value as its single persistent source of truth", () => {
  const initial = { library: { search: "" }, favorites: { search: "" } };
  const searched = updateCollectionQueryState(initial, "library", (query) => ({ ...query, search: "demian" }));
  const visitedFavorites = updateCollectionQueryState(searched, "favorites", (query) => ({ ...query, favorite: true }));

  assert.equal(visitedFavorites.library.search, "demian");
  assert.equal(visitedFavorites.favorites.search, "");

  const cleared = updateCollectionQueryState(visitedFavorites, "library", { search: "" });
  assert.equal(cleared.library.search, "");
});
