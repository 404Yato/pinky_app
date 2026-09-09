import assert from "node:assert/strict";
import test from "node:test";

import { bookCreateCommandToApiPayload, bookFormToCreateCommand, bookFormToUpdateCommand, bookItemToFormValues, bookMutationResponseToItem, normalizeBookItem } from "./books.js";

const apiItem = {
  id: 3, item_type: 1, name: "Piranesi", description: "", comments: "Lo leí en **invierno**.", favorite: true,
  possession_status: "LOANED", location: "Repisa 2", loaned_to: "Nicolás", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-02T00:00:00Z", deleted_at: null,
  details: { item: 3, author: "Susanna Clarke", isbn: null, publisher: null, pages: 272, publication_year: 2020, genre: null, cover_url: null, reading_status: "READ" },
};

test("normalizes an API book while preserving nested details", () => {
  const item = normalizeBookItem(apiItem);
  assert.equal(item.name, "Piranesi");
  assert.equal(item.details.pages, 272);
  assert.equal(item.details.reading_status, "READ");
  assert.equal(Object.hasOwn(item, "author"), false);
});

test("keeps missing details null", () => {
  assert.equal(normalizeBookItem({ id: 9, item_type: 1, name: "Sin ficha" }).details, null);
});

test("maps canonical nested items to UI-only form values", () => {
  const values = bookItemToFormValues(apiItem);
  assert.equal(values.title, "Piranesi");
  assert.equal(values.author, "Susanna Clarke");
  assert.equal(values.publicationYear, 2020);
  assert.equal(values.possessionStatus, "LOANED");
});

test("maps create commands to the generic item payload", () => {
  const payload = bookCreateCommandToApiPayload(bookFormToCreateCommand({ title: "Piranesi", comments: "Una nota con **Markdown**.", pages: "272", coverUrl: " https://example.com/piranesi ", readingStatus: "PENDING" }));
  assert.equal(payload.item_type, 1);
  assert.equal(payload.name, "Piranesi");
  assert.equal(payload.details.pages, 272);
  assert.equal(payload.details.reading_status, "PENDING");
  assert.equal(payload.details.cover_url, "https://example.com/piranesi");
  assert.equal(payload.comments, "Una nota con **Markdown**.");
});

test("maps replacing and removing a cover URL in update commands", () => {
  assert.equal(bookFormToUpdateCommand({ coverUrl: "https://example.com/new-cover" }).book.cover_url, "https://example.com/new-cover");
  assert.equal(bookFormToUpdateCommand({ coverUrl: "" }).book.cover_url, null);
});

test("keeps comments on Item and preserves Markdown during updates", () => {
  const command = bookFormToUpdateCommand({ comments: "## Recuerdo\n\nMe gustó *mucho*." });
  assert.equal(command.item.comments, "## Recuerdo\n\nMe gustó *mucho*.");
  assert.equal(Object.hasOwn(command.book, "comments"), false);
});

test("reconciles mutation responses without flattening or refetching details", () => {
  const command = { item: { name: "Nuevo", possession_status: "OWNED", loaned_to: null }, book: { pages: 320 } };
  const updated = bookMutationResponseToItem(apiItem, command, { data: { id: 3, name: "Nuevo", updated_at: "new" } });
  assert.equal(updated.name, "Nuevo");
  assert.equal(updated.updated_at, "new");
  assert.equal(updated.details.pages, 320);
  assert.equal(updated.details.author, "Susanna Clarke");
  assert.equal(updated.loaned_to, null);
  assert.equal(Object.hasOwn(updated, "pages"), false);
});
