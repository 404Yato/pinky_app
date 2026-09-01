import { READING_STATUS } from "../constants/books.js";

const nullableString = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized || null;
};

const requiredString = (value) => String(value ?? "").trim();

const nullablePositiveInteger = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized > 0 ? normalized : value;
};

const booleanValue = (value) => value === true || value === "true";

function bookFormToCommand(values) {
  return {
    item: {
      name: requiredString(values?.title),
      description: requiredString(values?.description),
      favorite: booleanValue(values?.favorite),
    },
    book: {
      isbn: nullableString(values?.isbn),
      author: nullableString(values?.author),
      publisher: nullableString(values?.publisher),
      pages: nullablePositiveInteger(values?.pages),
      publication_year: nullablePositiveInteger(values?.publicationYear),
      genre: nullableString(values?.genre),
      cover_url: nullableString(values?.coverUrl),
      reading_status: values?.readingStatus ?? READING_STATUS.PENDING,
    },
  };
}

export function bookRecordToViewModel(record) {
  return {
    id: record.item.id,
    title: record.item.name,
    description: record.item.description,
    favorite: record.item.favorite,
    createdAt: record.item.created_at,
    updatedAt: record.item.updated_at,
    deletedAt: record.item.deleted_at,
    author: record.book.author,
    isbn: record.book.isbn,
    publisher: record.book.publisher,
    pages: record.book.pages,
    publicationYear: record.book.publication_year,
    genre: record.book.genre,
    coverUrl: record.book.cover_url,
    readingStatus: record.book.reading_status,
  };
}

export function bookFormToCreateCommand(values) {
  return bookFormToCommand(values);
}

export function bookFormToUpdateCommand(values) {
  const fullCommand = bookFormToCommand(values);
  const item = {};
  const book = {};
  const itemFields = { title: "name", description: "description", favorite: "favorite" };
  const bookFields = {
    isbn: "isbn",
    author: "author",
    publisher: "publisher",
    pages: "pages",
    publicationYear: "publication_year",
    genre: "genre",
    coverUrl: "cover_url",
    readingStatus: "reading_status",
  };

  for (const [formField, domainField] of Object.entries(itemFields)) {
    if (Object.hasOwn(values, formField)) item[domainField] = fullCommand.item[domainField];
  }
  for (const [formField, domainField] of Object.entries(bookFields)) {
    if (Object.hasOwn(values, formField)) book[domainField] = fullCommand.book[domainField];
  }

  return { item, book };
}
