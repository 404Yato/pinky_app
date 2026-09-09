const FORMATTING_CHARACTERS = /[\s-]/g;

export function normalizeIsbn(value) {
  return String(value ?? "").replace(FORMATTING_CHARACTERS, "").toUpperCase();
}

function isValidIsbn10(isbn) {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  const checksum = [...isbn].reduce((total, character, index) => {
    const digit = character === "X" ? 10 : Number(character);
    return total + digit * (10 - index);
  }, 0);
  return checksum % 11 === 0;
}

function isValidIsbn13(isbn) {
  if (!/^\d{13}$/.test(isbn)) return false;
  const checksum = [...isbn].reduce(
    (total, character, index) => total + Number(character) * (index % 2 === 0 ? 1 : 3),
    0,
  );
  return checksum % 10 === 0;
}

export function isValidIsbn(value) {
  const isbn = normalizeIsbn(value);
  return isbn.length === 10 ? isValidIsbn10(isbn) : isValidIsbn13(isbn);
}

const AUTOFILL_FIELDS = ["title", "author", "description", "publisher", "publicationYear", "pages", "coverUrl"];

const isEmpty = (value) => value === null || value === undefined || String(value).trim() === "";

export function fillEmptyBookFields(values, metadata) {
  const nextValues = { ...values, isbn: metadata.isbn };

  for (const field of AUTOFILL_FIELDS) {
    if (isEmpty(values[field]) && !isEmpty(metadata[field])) {
      nextValues[field] = ["publicationYear", "pages"].includes(field)
        ? String(metadata[field])
        : metadata[field];
    }
  }

  return nextValues;
}
