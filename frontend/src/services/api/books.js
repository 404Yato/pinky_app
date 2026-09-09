import {
  normalizeBookItem,
  bookCreateCommandToApiPayload,
  bookFormToCreateCommand,
  bookFormToUpdateCommand,
  bookMutationResponseToItem,
  bookUpdateCommandToApiPayload,
} from "../../adapters/books.js";
import { DEFAULT_BOOK_QUERY } from "../../constants/books.js";
import { ITEM_TYPE_ID } from "../../constants/items.js";
import { apiRequest, ApiError } from "../../lib/api/client.js";
import { queryBookCollection } from "../../lib/bookQueries.js";

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
    return normalizeBookItem(response);
  } catch (error) {
    throw normalizeBookError(error);
  }
}

async function getBookCollection() {
  const items = await apiRequest("/inventory/items/");
  return items
    .filter((item) => item.item_type === ITEM_TYPE_ID.BOOK)
    .map(normalizeBookItem);
}

export async function getBooks(options = {}) {
  const query = { ...DEFAULT_BOOK_QUERY, ...options };
  return queryBookCollection(await getBookCollection(), query);
}

export async function createBook(input) {
  const command = bookFormToCreateCommand(input);
  const created = await apiRequest("/inventory/items/", {
    method: "POST",
    body: bookCreateCommandToApiPayload(command),
  });
  return bookMutationResponseToItem(null, command, created);
}

export async function updateBook(id, input, currentBook = null) {
  const current = currentBook ?? await getBook(id);
  const command = bookFormToUpdateCommand(input);
  const response = await apiRequest(`/inventory/items/${Number(id)}/`, {
    method: "PUT",
    body: bookUpdateCommandToApiPayload(command),
  });
  return bookMutationResponseToItem(current, command, response);
}

export async function deleteBook(id, currentBook = null) {
  const book = currentBook ?? await getBook(id);
  const response = await apiRequest(`/inventory/items/${Number(id)}/`, { method: "DELETE" });
  return {
    ...book,
    updated_at: response?.data?.updated_at ?? book.updated_at,
    deleted_at: response?.data?.deleted_at ?? new Date().toISOString(),
  };
}

export async function toggleFavorite(id, currentBook = null) {
  const book = currentBook ?? await getBook(id);
  return updateBook(id, { favorite: !book.favorite }, book);
}

export async function updateReadingStatus(id, readingStatus, currentBook = null) {
  return updateBook(id, { readingStatus }, currentBook);
}
