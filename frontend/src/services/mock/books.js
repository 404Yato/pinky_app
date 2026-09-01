import {
  BOOK_SORT_FIELD,
  BOOK_SORT_FIELDS,
  DEFAULT_BOOK_QUERY,
  READING_STATUS,
  READING_STATUSES,
  SORT_DIRECTION,
  SORT_DIRECTIONS,
} from "../../constants/books.js";
import { mockBooks } from "../../data/mockBooks.js";

export class MockBookServiceError extends Error {
  constructor(message, code = "MOCK_BOOK_ERROR") {
    super(message);
    this.name = "MockBookServiceError";
    this.code = code;
  }
}

const clone = (value) => structuredClone(value);
const cleanOptionalString = (value) => {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned || null;
};
const normalizeForSearch = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");

let books = clone(mockBooks);

function findBookIndex(id) {
  const normalizedId = Number(id);
  const index = books.findIndex((book) => book.id === normalizedId);

  if (index === -1) {
    throw new MockBookServiceError("No encontramos el libro solicitado.", "BOOK_NOT_FOUND");
  }

  return index;
}

function validateStatus(status) {
  if (!READING_STATUSES.includes(status)) {
    throw new MockBookServiceError("El estado de lectura no es válido.", "INVALID_READING_STATUS");
  }
}

function normalizeBookInput(input, { partial = false } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new MockBookServiceError("Los datos del libro no son válidos.", "INVALID_BOOK_DATA");
  }

  const normalized = {};

  if (!partial || Object.hasOwn(input, "title")) {
    const title = cleanOptionalString(input.title);
    if (!title) {
      throw new MockBookServiceError("El título del libro es obligatorio.", "TITLE_REQUIRED");
    }
    normalized.title = title;
  }

  for (const field of ["author", "description", "isbn", "publisher", "genre", "coverUrl"]) {
    if (!partial || Object.hasOwn(input, field)) normalized[field] = cleanOptionalString(input[field]);
  }

  if (!partial || Object.hasOwn(input, "pages")) {
    if (input.pages === undefined || input.pages === null || input.pages === "") {
      normalized.pages = null;
    } else {
      const pages = Number(input.pages);
      if (!Number.isInteger(pages) || pages <= 0) {
        throw new MockBookServiceError("La cantidad de páginas debe ser un número entero positivo.", "INVALID_PAGES");
      }
      normalized.pages = pages;
    }
  }

  if (!partial || Object.hasOwn(input, "publicationYear")) {
    if (input.publicationYear === undefined || input.publicationYear === null || input.publicationYear === "") {
      normalized.publicationYear = null;
    } else {
      const publicationYear = Number(input.publicationYear);
      if (!Number.isInteger(publicationYear) || publicationYear < 1) {
        throw new MockBookServiceError("El año de publicación no es válido.", "INVALID_PUBLICATION_YEAR");
      }
      normalized.publicationYear = publicationYear;
    }
  }

  if (!partial || Object.hasOwn(input, "readingStatus")) {
    const readingStatus = input.readingStatus ?? READING_STATUS.PENDING;
    validateStatus(readingStatus);
    normalized.readingStatus = readingStatus;
  }

  if (!partial || Object.hasOwn(input, "favorite")) normalized.favorite = Boolean(input.favorite);

  return normalized;
}

function applySearch(collection, query) {
  const normalizedQuery = normalizeForSearch(query).trim();
  if (!normalizedQuery) return clone(collection);

  return clone(
    collection.filter((book) =>
      [book.title, book.author, book.genre, book.publisher, book.isbn].some((value) =>
        normalizeForSearch(value).includes(normalizedQuery),
      ),
    ),
  );
}

function applyFilters(collection, { status = null, favorite = null, genre = null } = {}) {
  if (status !== null) validateStatus(status);
  const normalizedGenre = normalizeForSearch(genre).trim();

  return clone(
    collection.filter((book) => {
      if (status !== null && book.readingStatus !== status) return false;
      if (favorite !== null && book.favorite !== Boolean(favorite)) return false;
      if (normalizedGenre && normalizeForSearch(book.genre) !== normalizedGenre) return false;
      return true;
    }),
  );
}

function applySort(
  collection,
  { sortBy = BOOK_SORT_FIELD.CREATED_AT, sortDirection = SORT_DIRECTION.DESCENDING } = {},
) {
  if (!BOOK_SORT_FIELDS.includes(sortBy)) {
    throw new MockBookServiceError("El criterio de orden no es válido.", "INVALID_SORT_FIELD");
  }
  if (!SORT_DIRECTIONS.includes(sortDirection)) {
    throw new MockBookServiceError("La dirección de orden no es válida.", "INVALID_SORT_DIRECTION");
  }

  const direction = sortDirection === SORT_DIRECTION.ASCENDING ? 1 : -1;
  const sorted = clone(collection);

  sorted.sort((first, second) => {
    const firstValue = first[sortBy];
    const secondValue = second[sortBy];
    if (firstValue === secondValue) return first.id - second.id;
    if (firstValue === null || firstValue === undefined) return 1;
    if (secondValue === null || secondValue === undefined) return -1;

    if (typeof firstValue === "string" && !sortBy.endsWith("At")) {
      return firstValue.localeCompare(secondValue, "es", { sensitivity: "base" }) * direction;
    }

    return (firstValue < secondValue ? -1 : 1) * direction;
  });

  return sorted;
}

export async function getBooks(options = {}) {
  const query = { ...DEFAULT_BOOK_QUERY, ...options };
  let result = applySearch(books, query.search);
  result = applyFilters(result, query);
  return applySort(result, query);
}

export async function searchBooks(query) {
  return applySearch(books, query);
}

export async function filterBooks(filters = {}) {
  return applyFilters(books, filters);
}

export async function sortBooks(options = {}) {
  return applySort(books, options);
}

export async function getBook(id) {
  return clone(books[findBookIndex(id)]);
}

export async function createBook(input) {
  const now = new Date().toISOString();
  const nextId = books.reduce((highestId, book) => Math.max(highestId, book.id), 0) + 1;
  const createdBook = {
    id: nextId,
    ...normalizeBookInput(input),
    createdAt: now,
    updatedAt: now,
  };

  books = [...books, createdBook];
  return clone(createdBook);
}

export async function updateBook(id, input) {
  const index = findBookIndex(id);
  const currentBook = books[index];
  const updatedBook = {
    ...currentBook,
    ...normalizeBookInput(input, { partial: true }),
    id: currentBook.id,
    createdAt: currentBook.createdAt,
    updatedAt: new Date().toISOString(),
  };

  books = books.map((book, bookIndex) => (bookIndex === index ? updatedBook : book));
  return clone(updatedBook);
}

export async function deleteBook(id) {
  const index = findBookIndex(id);
  const [deletedBook] = books.splice(index, 1);
  return clone(deletedBook);
}

export async function toggleFavorite(id) {
  const index = findBookIndex(id);
  const updatedBook = {
    ...books[index],
    favorite: !books[index].favorite,
    updatedAt: new Date().toISOString(),
  };
  books = books.map((book, bookIndex) => (bookIndex === index ? updatedBook : book));
  return clone(updatedBook);
}

export async function updateReadingStatus(id, status) {
  validateStatus(status);
  return updateBook(id, { readingStatus: status });
}

export function resetMockBooks() {
  books = clone(mockBooks);
}
