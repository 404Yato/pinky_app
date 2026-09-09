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

export function normalizeBookItem(response) {
  const item = response?.data ?? response ?? {};
  const details = item.details;
  return {
    ...item,
    description: item.description ?? "",
    comments: item.comments ?? "",
    favorite: Boolean(item.favorite),
    possession_status: item.possession_status ?? POSSESSION_STATUS.OWNED,
    location: item.location ?? null,
    loaned_to: item.loaned_to ?? null,
    deleted_at: item.deleted_at ?? null,
    details: details == null ? null : {
      ...details,
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

export function bookItemToFormValues(item) {
  const details = item?.details ?? {};
  return {
    title: item?.name ?? "",
    description: item?.description ?? "",
    comments: item?.comments ?? "",
    favorite: Boolean(item?.favorite),
    possessionStatus: item?.possession_status ?? POSSESSION_STATUS.OWNED,
    location: item?.location ?? "",
    loanedTo: item?.loaned_to ?? "",
    isbn: details.isbn ?? "",
    author: details.author ?? "",
    publisher: details.publisher ?? "",
    pages: details.pages ?? "",
    publicationYear: details.publication_year ?? "",
    genre: details.genre ?? "",
    coverUrl: details.cover_url ?? "",
    readingStatus: details.reading_status ?? READING_STATUS.PENDING,
  };
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

export function bookMutationResponseToItem(currentItem, command, response) {
  const serverItem = response?.data ?? response ?? {};
  const current = currentItem ?? {};
  const currentDetails = current.details ?? {};
  const serverDetails = serverItem.details ?? {};
  const id = serverItem.id ?? current.id;

  return normalizeBookItem({
    ...current,
    ...command.item,
    ...serverItem,
    id,
    item_type: serverItem.item_type ?? current.item_type ?? ITEM_TYPE_ID.BOOK,
    details: {
      ...currentDetails,
      ...command.book,
      ...serverDetails,
      item: serverDetails.item ?? currentDetails.item ?? id,
    },
  });
}
