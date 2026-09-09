import {
  BOOK_SORT_FIELD,
  BOOK_SORT_FIELDS,
  DEFAULT_BOOK_QUERY,
  READING_STATUSES,
  SORT_DIRECTION,
  SORT_DIRECTIONS,
} from "../constants/books.js";

const clone = (value) => structuredClone(value);
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

export function normalizeBookQuery(query) {
  return { ...DEFAULT_BOOK_QUERY, ...(query ?? {}) };
}

export function searchBookCollection(collection, query) {
  const normalizedQuery = normalize(query).trim();
  if (!normalizedQuery) return clone(collection);
  return clone(collection.filter((item) => [
    item?.name,
    item?.details?.author,
    item?.details?.genre,
    item?.details?.publisher,
    item?.details?.isbn,
  ].some((value) => normalize(value).includes(normalizedQuery))));
}

export function filterBookCollection(collection, { status = null, favorite = null, genre = null } = {}) {
  if (status !== null && !READING_STATUSES.includes(status)) throw new Error("INVALID_READING_STATUS");
  const normalizedGenre = normalize(genre).trim();
  return clone(collection.filter((item) => {
    if (status !== null && item?.details?.reading_status !== status) return false;
    if (favorite !== null && item?.favorite !== favorite) return false;
    if (normalizedGenre && normalize(item?.details?.genre) !== normalizedGenre) return false;
    return true;
  }));
}

export function sortBookCollection(collection, { sortBy = BOOK_SORT_FIELD.CREATED_AT, sortDirection = SORT_DIRECTION.DESCENDING } = {}) {
  if (!BOOK_SORT_FIELDS.includes(sortBy)) throw new Error("INVALID_SORT_FIELD");
  if (!SORT_DIRECTIONS.includes(sortDirection)) throw new Error("INVALID_SORT_DIRECTION");
  const direction = sortDirection === SORT_DIRECTION.ASCENDING ? 1 : -1;
  const valueFor = (item) => {
    if (sortBy === BOOK_SORT_FIELD.TITLE) return item?.name;
    if (sortBy === BOOK_SORT_FIELD.AUTHOR) return item?.details?.author;
    if (sortBy === BOOK_SORT_FIELD.PUBLICATION_YEAR) return item?.details?.publication_year;
    if (sortBy === BOOK_SORT_FIELD.CREATED_AT) return item?.created_at;
    if (sortBy === BOOK_SORT_FIELD.UPDATED_AT) return item?.updated_at;
    return null;
  };
  return clone(collection).sort((first, second) => {
    const firstValue = valueFor(first);
    const secondValue = valueFor(second);
    if (firstValue === secondValue) return first.id - second.id;
    if (firstValue === null || firstValue === undefined) return 1;
    if (secondValue === null || secondValue === undefined) return -1;
    if (typeof firstValue === "string" && ![BOOK_SORT_FIELD.CREATED_AT, BOOK_SORT_FIELD.UPDATED_AT].includes(sortBy)) return firstValue.localeCompare(secondValue, "es", { sensitivity: "base" }) * direction;
    return (firstValue < secondValue ? -1 : 1) * direction;
  });
}

export function queryBookCollection(collection, query) {
  const normalizedQuery = normalizeBookQuery(query);
  return sortBookCollection(
    filterBookCollection(searchBookCollection(collection, normalizedQuery.search), normalizedQuery),
    normalizedQuery,
  );
}
