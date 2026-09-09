const nullablePage = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const page = Number(value);
  return Number.isInteger(page) && page >= 0 ? page : value;
};

export function bookQuoteApiToViewModel(response) {
  return {
    id: response.id,
    text: response.text,
    page: response.page ?? null,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export function bookQuoteFormToCommand(values = {}) {
  return {
    text: String(values.text ?? "").trim(),
    page: nullablePage(values.page),
  };
}
