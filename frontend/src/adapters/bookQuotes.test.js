import assert from "node:assert/strict";
import test from "node:test";

import { bookQuoteApiToViewModel, bookQuoteFormToCommand } from "./bookQuotes.js";

test("maps quote timestamps to the frontend view model", () => {
  assert.deepEqual(bookQuoteApiToViewModel({ id: 7, text: "Un fragmento", page: null, created_at: "created", updated_at: "updated" }), {
    id: 7, text: "Un fragmento", page: null, createdAt: "created", updatedAt: "updated",
  });
});

test("normalizes optional quote pages without sending ownership fields", () => {
  assert.deepEqual(bookQuoteFormToCommand({ text: "  Un fragmento  ", page: "42", bookId: 99, id: 3 }), { text: "Un fragmento", page: 42 });
  assert.deepEqual(bookQuoteFormToCommand({ text: "Sin página", page: "" }), { text: "Sin página", page: null });
});
