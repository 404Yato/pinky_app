export const READING_STATUS = Object.freeze({
  PENDING: "PENDING",
  READING: "READING",
  READ: "READ",
});

export const READING_STATUSES = Object.freeze(Object.values(READING_STATUS));

export const BOOK_SORT_FIELD = Object.freeze({
  TITLE: "title",
  AUTHOR: "author",
  PUBLICATION_YEAR: "publicationYear",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
});

export const BOOK_SORT_FIELDS = Object.freeze(Object.values(BOOK_SORT_FIELD));

export const SORT_DIRECTION = Object.freeze({
  ASCENDING: "asc",
  DESCENDING: "desc",
});

export const SORT_DIRECTIONS = Object.freeze(Object.values(SORT_DIRECTION));

export const DEFAULT_BOOK_QUERY = Object.freeze({
  search: "",
  status: null,
  favorite: null,
  genre: null,
  sortBy: BOOK_SORT_FIELD.CREATED_AT,
  sortDirection: SORT_DIRECTION.DESCENDING,
});
