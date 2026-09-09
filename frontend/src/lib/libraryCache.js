import { DEFAULT_BOOK_QUERY } from "../constants/books.js";
import { normalizeBookQuery } from "./bookQueries.js";

export function upsertBookInCollection(collection, book) {
  if (!book?.id) return collection;
  const exists = collection.some(({ id }) => id === book.id);
  return exists
    ? collection.map((current) => current.id === book.id ? book : current)
    : [...collection, book];
}

export function removeBookFromCollection(collection, bookId) {
  return collection.filter(({ id }) => id !== bookId);
}

export function createSharedRequest(load) {
  let pendingRequest = null;
  return () => {
    if (!pendingRequest) {
      pendingRequest = Promise.resolve().then(load).finally(() => {
        pendingRequest = null;
      });
    }
    return pendingRequest;
  };
}

export function updateCollectionQueryState(queries, collectionId, update) {
  const previous = queries[collectionId] ?? DEFAULT_BOOK_QUERY;
  const next = typeof update === "function" ? update(previous) : update;
  return { ...queries, [collectionId]: normalizeBookQuery(next) };
}
