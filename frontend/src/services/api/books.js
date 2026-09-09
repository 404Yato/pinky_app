import {
  bookApiResponseToViewModel,
  bookCreateCommandToApiPayload,
  bookFormToCreateCommand,
  bookFormToUpdateCommand,
  bookMutationResponseToViewModel,
  bookUpdateCommandToApiPayload,
} from "../../adapters/books.js";
import { DEFAULT_BOOK_QUERY } from "../../constants/books.js";
import { ITEM_TYPE_ID } from "../../constants/items.js";
import { apiRequest, ApiError } from "../../lib/api/client.js";
import { filterBookCollection, queryBookCollection, searchBookCollection, sortBookCollection } from "../../lib/bookQueries.js";

function normalizeBookError(error) {
  if (error instanceof ApiError && error.status === 404) error.code = "BOOK_NOT_FOUND";
  return error;
}

export async function getBook(id) {
  try {
    const response = await apiRequest(`/inventory/items/${Number(id)}/`);
    if (response.item_type !== ITEM_TYPE_ID.BOOK || !response.details) {
      throw new ApiError("No encontramos el libro solicitado.", { status: 404, code: "BOOK_NOT_FOUND" });
    }
    return bookApiResponseToViewModel(response);
  } catch (error) {
    throw normalizeBookError(error);
  }
}

async function getAllBooks() {
  const items = await apiRequest("/inventory/items/");
  const bookItems = items.filter((item) => item.item_type === ITEM_TYPE_ID.BOOK);
  return Promise.all(bookItems.map((item) => getBook(item.id)));
}

export async function getBooks(options = {}) {
  const query = { ...DEFAULT_BOOK_QUERY, ...options };
  return queryBookCollection(await getAllBooks(), query);
}

export async function searchBooks(query) {
  return searchBookCollection(await getAllBooks(), query);
}

export async function filterBooks(filters = {}) {
  return filterBookCollection(await getAllBooks(), filters);
}

export async function sortBooks(options = {}) {
  return sortBookCollection(await getAllBooks(), options);
}

export async function createBook(input) {
  const command = bookFormToCreateCommand(input);
  const created = await apiRequest("/inventory/items/", {
    method: "POST",
    body: bookCreateCommandToApiPayload(command),
  });
  return bookMutationResponseToViewModel(null, command, created);
}

export async function updateBook(id, input, currentBook = null) {
  const current = currentBook ?? await getBook(id);
  const command = bookFormToUpdateCommand(input);
  const response = await apiRequest(`/inventory/items/${Number(id)}/`, {
    method: "PUT",
    body: bookUpdateCommandToApiPayload(command),
  });
  return bookMutationResponseToViewModel(current, command, response);
}

export async function deleteBook(id, currentBook = null) {
  const book = currentBook ?? await getBook(id);
  const response = await apiRequest(`/inventory/items/${Number(id)}/`, { method: "DELETE" });
  return {
    ...book,
    updatedAt: response?.data?.updated_at ?? book.updatedAt,
    deletedAt: response?.data?.deleted_at ?? new Date().toISOString(),
  };
}

export async function toggleFavorite(id, currentBook = null) {
  const book = currentBook ?? await getBook(id);
  return updateBook(id, { favorite: !book.favorite }, book);
}

export async function updateReadingStatus(id, readingStatus, currentBook = null) {
  return updateBook(id, { readingStatus }, currentBook);
}
