import { isValidIsbn, normalizeIsbn } from "../lib/isbn.js";

const OPEN_LIBRARY_URL = "https://openlibrary.org";
const OPEN_LIBRARY_COVERS_URL = "https://covers.openlibrary.org";

export class BookMetadataError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "BookMetadataError";
    this.code = code;
  }
}

const textValue = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized || null;
};

const firstText = (values) => Array.isArray(values) ? textValue(values.find(textValue)) : null;

async function getAuthorName(author) {
  if (!author?.key) return null;
  try {
    const response = await fetch(`${OPEN_LIBRARY_URL}${author.key}.json`, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    return textValue((await response.json()).name);
  } catch {
    return null;
  }
}

function getPublicationYear(publishDate) {
  const match = String(publishDate ?? "").match(/\b[12]\d{3}\b/);
  return match ? Number(match[0]) : null;
}

function getDescription(description) {
  return textValue(typeof description === "object" ? description?.value : description);
}

export async function getBookMetadataByISBN(value) {
  const isbn = normalizeIsbn(value);
  if (!isValidIsbn(isbn)) {
    throw new BookMetadataError("Ingresa un ISBN-10 o ISBN-13 válido.", "INVALID_ISBN");
  }

  let response;
  try {
    response = await fetch(`${OPEN_LIBRARY_URL}/isbn/${encodeURIComponent(isbn)}.json`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new BookMetadataError("No pudimos consultar la información del libro.", "SERVICE_UNAVAILABLE");
  }

  if (response.status === 404) {
    throw new BookMetadataError("No encontramos información para este ISBN.", "NOT_FOUND");
  }
  if (!response.ok) {
    throw new BookMetadataError("No pudimos consultar la información del libro.", "SERVICE_UNAVAILABLE");
  }

  let edition;
  try {
    edition = await response.json();
  } catch {
    throw new BookMetadataError("No pudimos consultar la información del libro.", "SERVICE_UNAVAILABLE");
  }

  const authorNames = (await Promise.all((edition.authors ?? []).map(getAuthorName))).filter(Boolean);
  const coverId = Array.isArray(edition.covers) ? edition.covers.find((id) => Number.isInteger(id) && id > 0) : null;
  const pageCount = Number.isInteger(edition.number_of_pages) && edition.number_of_pages > 0
    ? edition.number_of_pages
    : null;

  return {
    isbn,
    title: textValue(edition.title),
    author: authorNames.length > 0 ? authorNames.join(", ") : null,
    description: getDescription(edition.description),
    publisher: firstText(edition.publishers),
    publicationYear: getPublicationYear(edition.publish_date),
    pages: pageCount,
    coverUrl: coverId ? `${OPEN_LIBRARY_COVERS_URL}/b/id/${coverId}-L.jpg?default=false` : null,
  };
}
