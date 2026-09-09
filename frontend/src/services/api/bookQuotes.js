import { bookQuoteApiToViewModel, bookQuoteFormToCommand } from "../../adapters/bookQuotes.js";
import { apiRequest } from "../../lib/api/client.js";

const collectionPath = (bookId) => `/inventory/books/${Number(bookId)}/quotes/`;
const detailPath = (bookId, quoteId) => `${collectionPath(bookId)}${Number(quoteId)}/`;

export async function getBookQuotes(bookId) {
  const response = await apiRequest(collectionPath(bookId));
  return response.map(bookQuoteApiToViewModel);
}

export async function createBookQuote(bookId, values) {
  const response = await apiRequest(collectionPath(bookId), {
    method: "POST",
    body: bookQuoteFormToCommand(values),
  });
  return bookQuoteApiToViewModel(response);
}

export async function updateBookQuote(bookId, quoteId, values) {
  const response = await apiRequest(detailPath(bookId, quoteId), {
    method: "PATCH",
    body: bookQuoteFormToCommand(values),
  });
  return bookQuoteApiToViewModel(response);
}

export async function deleteBookQuote(bookId, quoteId) {
  await apiRequest(detailPath(bookId, quoteId), { method: "DELETE" });
}
