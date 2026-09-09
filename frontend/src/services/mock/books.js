import {
  bookFormToCreateCommand,
  bookFormToUpdateCommand,
  normalizeBookItem,
} from "../../adapters/books.js";
import {
  DEFAULT_BOOK_QUERY,
  READING_STATUSES,
} from "../../constants/books.js";
import { ITEM_TYPE_ID, MOCK_USER_ID } from "../../constants/items.js";
import { mockBooks } from "../../data/mockBooks.js";
import { filterBookCollection, queryBookCollection, searchBookCollection, sortBookCollection } from "../../lib/bookQueries.js";

export class MockBookServiceError extends Error {
  constructor(message, code = "MOCK_BOOK_ERROR") {
    super(message);
    this.name = "MockBookServiceError";
    this.code = code;
  }
}

const clone = (value) => structuredClone(value);
let records = clone(mockBooks);

function findRecordIndex(id, { includeDeleted = false } = {}) {
  const normalizedId = Number(id);
  const index = records.findIndex(
    (record) => record.item.id === normalizedId && (includeDeleted || record.item.deleted_at === null),
  );

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

function validateRecord(record) {
  if (!record.item.name) {
    throw new MockBookServiceError("El título del libro es obligatorio.", "TITLE_REQUIRED");
  }
  if (record.book.pages !== null && (!Number.isInteger(record.book.pages) || record.book.pages <= 0)) {
    throw new MockBookServiceError("La cantidad de páginas debe ser un número entero positivo.", "INVALID_PAGES");
  }
  if (
    record.book.publication_year !== null &&
    (!Number.isInteger(record.book.publication_year) || record.book.publication_year < 1)
  ) {
    throw new MockBookServiceError("El año de publicación no es válido.", "INVALID_PUBLICATION_YEAR");
  }
  validateStatus(record.book.reading_status);
}

function recordToItem(record) {
  return normalizeBookItem({ ...record.item, details: record.book });
}

function activeItems() {
  return records
    .filter((record) => record.item.deleted_at === null)
    .map(recordToItem);
}

export async function getBooks(options = {}) {
  const query = { ...DEFAULT_BOOK_QUERY, ...options };
  return queryBookCollection(activeItems(), query);
}

export async function searchBooks(query) {
  return searchBookCollection(activeItems(), query);
}

export async function filterBooks(filters = {}) {
  return filterBookCollection(activeItems(), filters);
}

export async function sortBooks(options = {}) {
  return sortBookCollection(activeItems(), options);
}

export async function getBook(id) {
  return clone(recordToItem(records[findRecordIndex(id)]));
}

export async function createBook(input) {
  const command = bookFormToCreateCommand(input);
  const now = new Date().toISOString();
  const nextId = records.reduce((highestId, record) => Math.max(highestId, record.item.id), 0) + 1;
  const record = {
    item: {
      id: nextId,
      user: MOCK_USER_ID,
      item_type: ITEM_TYPE_ID.BOOK,
      ...command.item,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    },
    book: {
      item: nextId,
      ...command.book,
    },
  };

  validateRecord(record);
  records = [...records, record];
  return clone(recordToItem(record));
}

export async function updateBook(id, input) {
  const index = findRecordIndex(id);
  const currentRecord = records[index];
  const command = bookFormToUpdateCommand(input);
  const updatedRecord = {
    item: {
      ...currentRecord.item,
      ...command.item,
      id: currentRecord.item.id,
      user: currentRecord.item.user,
      item_type: currentRecord.item.item_type,
      created_at: currentRecord.item.created_at,
      updated_at: new Date().toISOString(),
      deleted_at: currentRecord.item.deleted_at,
    },
    book: {
      ...currentRecord.book,
      ...command.book,
      item: currentRecord.book.item,
    },
  };

  validateRecord(updatedRecord);
  records = records.map((record, recordIndex) => (recordIndex === index ? updatedRecord : record));
  return clone(recordToItem(updatedRecord));
}

export async function deleteBook(id) {
  const index = findRecordIndex(id);
  const now = new Date().toISOString();
  const deletedRecord = {
    ...records[index],
    item: {
      ...records[index].item,
      updated_at: now,
      deleted_at: now,
    },
  };

  records = records.map((record, recordIndex) => (recordIndex === index ? deletedRecord : record));
  return clone(recordToItem(deletedRecord));
}

export async function toggleFavorite(id) {
  const index = findRecordIndex(id);
  const updatedRecord = {
    ...records[index],
    item: {
      ...records[index].item,
      favorite: !records[index].item.favorite,
      updated_at: new Date().toISOString(),
    },
  };
  records = records.map((record, recordIndex) => (recordIndex === index ? updatedRecord : record));
  return clone(recordToItem(updatedRecord));
}

export async function updateReadingStatus(id, status) {
  validateStatus(status);
  return updateBook(id, { readingStatus: status });
}

export function resetMockBooks() {
  records = clone(mockBooks);
}
