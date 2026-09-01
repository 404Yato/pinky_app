import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";

import { BOOK_SORT_FIELD, READING_STATUS, SORT_DIRECTION } from "../../constants/books.js";
import { mockBooks } from "../../data/mockBooks.js";
import {
  MockBookServiceError,
  createBook,
  deleteBook,
  filterBooks,
  getBook,
  getBooks,
  resetMockBooks,
  searchBooks,
  sortBooks,
  toggleFavorite,
  updateBook,
  updateReadingStatus,
} from "./books.js";

beforeEach(() => resetMockBooks());

describe("mock book queries", () => {
  test("lists realistic cloned seed data", async () => {
    const books = await getBooks();
    assert.equal(books.length, 20);

    books[0].title = "Título alterado";
    const freshBooks = await getBooks();
    assert.notEqual(freshBooks[0].title, "Título alterado");
    assert.notEqual(mockBooks[0].title, "Título alterado");
  });

  test("gets a single book and reports missing IDs consistently", async () => {
    assert.equal((await getBook(1)).title, "Cien años de soledad");

    await assert.rejects(() => getBook(999), (error) => {
      assert.ok(error instanceof MockBookServiceError);
      assert.equal(error.code, "BOOK_NOT_FOUND");
      return true;
    });
  });

  test("searches without case or accent sensitivity", async () => {
    const byTitle = await searchBooks("CIEN ANOS");
    const byAuthor = await searchBooks("garcia marquez");

    assert.deepEqual(byTitle.map(({ id }) => id), [1]);
    assert.deepEqual(byAuthor.map(({ id }) => id), [1]);
  });

  test("combines search, status, favorite, and genre filters", async () => {
    const books = await getBooks({
      search: "ficcion",
      status: READING_STATUS.PENDING,
      favorite: false,
      genre: "Ciencia ficción",
    });

    assert.deepEqual(books.map(({ id }) => id), [3]);
    assert.ok((await filterBooks({ favorite: true })).every((book) => book.favorite));
  });

  test("sorts predictably without changing repository order", async () => {
    const sorted = await sortBooks({
      sortBy: BOOK_SORT_FIELD.TITLE,
      sortDirection: SORT_DIRECTION.ASCENDING,
    });

    assert.equal(sorted[0].title, "Cien años de soledad");
    assert.equal((await getBooks())[0].id, 20);
  });
});

describe("mock book mutations", () => {
  test("creates normalized books with generated identity and timestamps", async () => {
    const created = await createBook({ title: "  Un libro nuevo  ", pages: "240" });

    assert.equal(created.id, 21);
    assert.equal(created.title, "Un libro nuevo");
    assert.equal(created.pages, 240);
    assert.equal(created.readingStatus, READING_STATUS.PENDING);
    assert.equal(created.favorite, false);
    assert.equal(created.createdAt, created.updatedAt);
    assert.equal((await getBooks()).length, 21);
  });

  test("updates editable fields while preserving identity and creation time", async () => {
    const original = await getBook(3);
    const updated = await updateBook(3, {
      id: 500,
      title: "Nuevo título",
      author: "  Nueva autora  ",
    });

    assert.equal(updated.id, 3);
    assert.equal(updated.createdAt, original.createdAt);
    assert.equal(updated.title, "Nuevo título");
    assert.equal(updated.author, "Nueva autora");
  });

  test("deletes only the selected in-memory record", async () => {
    const deleted = await deleteBook(4);

    assert.equal(deleted.id, 4);
    await assert.rejects(() => getBook(4), { code: "BOOK_NOT_FOUND" });
    assert.equal((await getBooks()).length, 19);
  });

  test("toggles favorite state and changes reading status", async () => {
    const original = await getBook(2);
    const toggled = await toggleFavorite(2);
    const changed = await updateReadingStatus(2, READING_STATUS.READ);

    assert.equal(toggled.favorite, !original.favorite);
    assert.equal(changed.readingStatus, READING_STATUS.READ);
  });

  test("rejects invalid writes with actionable error codes", async () => {
    await assert.rejects(() => createBook({ title: "  " }), { code: "TITLE_REQUIRED" });
    await assert.rejects(() => createBook({ title: "Libro", pages: -2 }), { code: "INVALID_PAGES" });
    await assert.rejects(() => updateReadingStatus(1, "abandoned"), { code: "INVALID_READING_STATUS" });
  });

  test("reset restores the immutable seed collection", async () => {
    await deleteBook(1);
    resetMockBooks();

    assert.equal((await getBooks()).length, mockBooks.length);
    assert.equal((await getBook(1)).title, mockBooks[0].title);
  });
});
