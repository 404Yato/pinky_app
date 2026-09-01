import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";

import {
  bookFormToCreateCommand,
  bookFormToUpdateCommand,
  bookRecordToViewModel,
} from "../../adapters/books.js";
import { BOOK_SORT_FIELD, READING_STATUS, SORT_DIRECTION } from "../../constants/books.js";
import { ITEM_TYPE_ID } from "../../constants/items.js";
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
    assert.notEqual(mockBooks[0].item.name, "Título alterado");
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

describe("canonical book adapters", () => {
  test("uses exact uppercase reading-status values", () => {
    assert.deepEqual(READING_STATUS, {
      PENDING: "PENDING",
      READING: "READING",
      READ: "READ",
    });
  });

  test("keeps shared fields on Item and details on Book", () => {
    const record = mockBooks[0];

    assert.equal(record.item.name, "Cien años de soledad");
    assert.equal(record.item.favorite, true);
    assert.equal(record.item.item_type, ITEM_TYPE_ID.BOOK);
    assert.equal(record.item.deleted_at, null);
    assert.equal(record.book.item, record.item.id);
    assert.equal(record.book.author, "Gabriel García Márquez");
    assert.equal(Object.hasOwn(record.book, "favorite"), false);
    assert.equal(Object.hasOwn(record.book, "name"), false);
  });

  test("maps canonical records to the stable BookViewModel", () => {
    const viewModel = bookRecordToViewModel(mockBooks[0]);

    assert.equal(viewModel.title, mockBooks[0].item.name);
    assert.equal(viewModel.favorite, mockBooks[0].item.favorite);
    assert.equal(viewModel.description, mockBooks[0].item.description);
    assert.equal(viewModel.createdAt, mockBooks[0].item.created_at);
    assert.equal(viewModel.publicationYear, mockBooks[0].book.publication_year);
    assert.equal(viewModel.readingStatus, "READ");
  });

  test("maps form values into separate Item and Book create data", () => {
    const command = bookFormToCreateCommand({
      title: "  Nuevo libro  ",
      description: "",
      favorite: "false",
      pages: "240",
      publicationYear: "2024",
      author: "  Autora  ",
      readingStatus: READING_STATUS.READING,
    });

    assert.deepEqual(command.item, {
      name: "Nuevo libro",
      description: "",
      favorite: false,
    });
    assert.equal(command.book.author, "Autora");
    assert.equal(command.book.pages, 240);
    assert.equal(command.book.publication_year, 2024);
    assert.equal(command.book.isbn, null);
    assert.equal(command.book.reading_status, "READING");
  });

  test("maps only supplied fields for update commands", () => {
    assert.deepEqual(bookFormToUpdateCommand({ title: "Otro título", pages: "" }), {
      item: { name: "Otro título" },
      book: { pages: null },
    });
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
    assert.equal(created.description, "");
    assert.equal(created.deletedAt, null);
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

  test("soft deletes and excludes the selected record from active operations", async () => {
    const deleted = await deleteBook(4);

    assert.equal(deleted.id, 4);
    assert.ok(deleted.deletedAt);
    assert.equal(deleted.deletedAt, deleted.updatedAt);
    await assert.rejects(() => getBook(4), { code: "BOOK_NOT_FOUND" });
    assert.equal((await getBooks()).length, 19);
    assert.equal((await searchBooks("Pedro Páramo")).length, 0);
    assert.equal((await filterBooks({ favorite: true })).some(({ id }) => id === 4), false);
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
    assert.equal((await getBook(1)).title, mockBooks[0].item.name);
  });

  test("preserves soft-deleted records when generating new IDs", async () => {
    await deleteBook(20);
    const created = await createBook({ title: "Después del borrado" });

    assert.equal(created.id, 21);
  });
});
