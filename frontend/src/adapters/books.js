import { READING_STATUS } from "../constants/books.js";
import { ITEM_TYPE_ID, POSSESSION_STATUS } from "../constants/items.js";

const nullableString = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized || null;
};

const requiredString = (value) => String(value ?? "").trim();

const markdownString = (value) => {
  const normalized = String(value ?? "");
  return normalized.trim() ? normalized : "";
};

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
      comments: markdownString(values?.comments),
      favorite: booleanValue(values?.favorite),
      possession_status: values?.possessionStatus ?? POSSESSION_STATUS.OWNED,
      location: nullableString(values?.location),
      loaned_to: values?.possessionStatus === POSSESSION_STATUS.LOANED
        ? nullableString(values?.loanedTo)
        : null,
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
    comments: record.item.comments ?? "",
    favorite: record.item.favorite,
    createdAt: record.item.created_at,
    updatedAt: record.item.updated_at,
    deletedAt: record.item.deleted_at,
    possessionStatus: record.item.possession_status,
    location: record.item.location,
    loanedTo: record.item.loaned_to,
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
  const itemFields = {
    title: "name",
    description: "description",
    comments: "comments",
    favorite: "favorite",
    possessionStatus: "possession_status",
    location: "location",
    loanedTo: "loaned_to",
  };
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

export function bookApiResponseToRecord(response) {
  const { details = {}, ...item } = response ?? {};
  return {
    item: {
      ...item,
      description: item.description ?? "",
      comments: item.comments ?? "",
      favorite: Boolean(item.favorite),
      possession_status: item.possession_status ?? POSSESSION_STATUS.OWNED,
      location: item.location ?? null,
      loaned_to: item.loaned_to ?? null,
      deleted_at: item.deleted_at ?? null,
    },
    book: {
      item: details.item ?? item.id,
      isbn: details.isbn ?? null,
      author: details.author ?? null,
      publisher: details.publisher ?? null,
      pages: details.pages ?? null,
      publication_year: details.publication_year ?? null,
      genre: details.genre ?? null,
      cover_url: details.cover_url ?? null,
      reading_status: details.reading_status ?? READING_STATUS.PENDING,
    },
  };
}

export function bookApiResponseToViewModel(response) {
  return bookRecordToViewModel(bookApiResponseToRecord(response));
}

export function bookCreateCommandToApiPayload(command) {
  return {
    item_type: ITEM_TYPE_ID.BOOK,
    ...command.item,
    details: command.book,
  };
}

export function bookUpdateCommandToApiPayload(command) {
  return { ...command.item, details: command.book };
}

const commandValue = (values, field, fallback) => Object.hasOwn(values, field) ? values[field] : fallback;

export function bookMutationResponseToViewModel(currentBook, command, response) {
  const item = response?.data ?? response ?? {};
  const current = currentBook ?? {};
  return {
    id: item.id ?? current.id,
    title: item.name ?? commandValue(command.item, "name", current.title),
    description: item.description ?? commandValue(command.item, "description", current.description ?? ""),
    comments: item.comments ?? commandValue(command.item, "comments", current.comments ?? ""),
    favorite: item.favorite ?? commandValue(command.item, "favorite", current.favorite ?? false),
    createdAt: item.created_at ?? current.createdAt ?? null,
    updatedAt: item.updated_at ?? current.updatedAt ?? null,
    deletedAt: item.deleted_at ?? current.deletedAt ?? null,
    possessionStatus: item.possession_status ?? commandValue(command.item, "possession_status", current.possessionStatus ?? POSSESSION_STATUS.OWNED),
    location: item.location ?? commandValue(command.item, "location", current.location ?? null),
    loanedTo: item.loaned_to ?? commandValue(command.item, "loaned_to", current.loanedTo ?? null),
    author: commandValue(command.book, "author", current.author ?? null),
    isbn: commandValue(command.book, "isbn", current.isbn ?? null),
    publisher: commandValue(command.book, "publisher", current.publisher ?? null),
    pages: commandValue(command.book, "pages", current.pages ?? null),
    publicationYear: commandValue(command.book, "publication_year", current.publicationYear ?? null),
    genre: commandValue(command.book, "genre", current.genre ?? null),
    coverUrl: commandValue(command.book, "cover_url", current.coverUrl ?? null),
    readingStatus: commandValue(command.book, "reading_status", current.readingStatus ?? READING_STATUS.PENDING),
  };
}
