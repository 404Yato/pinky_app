import assert from "node:assert/strict";
import test from "node:test";

import { bookApiResponseToViewModel, bookCreateCommandToApiPayload, bookFormToCreateCommand, bookMutationResponseToViewModel } from "./books.js";

test("maps an API item with details to BookViewModel", () => {
  const book = bookApiResponseToViewModel({
    id: 3, user: 2, item_type: 1, name: "Piranesi", description: "", favorite: true, possession_status: "LOANED", location: "Repisa 2", loaned_to: "Nicolás",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-02T00:00:00Z", deleted_at: null,
    details: { item: 3, author: "Susanna Clarke", isbn: null, publisher: null, pages: 272, publication_year: 2020, genre: null, cover_url: null, reading_status: "READ" },
  });
  assert.equal(book.title, "Piranesi");
  assert.equal(book.favorite, true);
  assert.equal(book.pages, 272);
  assert.equal(book.readingStatus, "READ");
  assert.equal(book.possessionStatus, "LOANED");
  assert.equal(book.location, "Repisa 2");
  assert.equal(book.loanedTo, "Nicolás");
});

test("maps create commands to the generic item payload", () => {
  const payload = bookCreateCommandToApiPayload(bookFormToCreateCommand({ title: "Piranesi", pages: "272", readingStatus: "PENDING" }));
  assert.equal(payload.item_type, 1);
  assert.equal(payload.name, "Piranesi");
  assert.equal(payload.details.pages, 272);
  assert.equal(payload.details.reading_status, "PENDING");
  assert.equal(payload.favorite, false);
  assert.equal(payload.possession_status, "OWNED");
  assert.equal(payload.location, null);
  assert.equal(payload.loaned_to, null);
});

test("maps update envelopes and empty success responses without losing existing fields", () => {
  const current = { id: 3, title: "Old", description: "", favorite: false, createdAt: "created", updatedAt: "old", deletedAt: null, possessionStatus: "LOANED", location: "Repisa", loanedTo: "Ana", author: "Author", isbn: null, publisher: null, pages: 100, publicationYear: 2020, genre: null, coverUrl: "cover", readingStatus: "PENDING" };
  const command = { item: { name: "New", possession_status: "OWNED", loaned_to: null }, book: { pages: 120 } };
  const fromEnvelope = bookMutationResponseToViewModel(current, command, { data: { id: 3, name: "New", updated_at: "new" } });
  const fromEmpty = bookMutationResponseToViewModel(current, command, null);
  assert.equal(fromEnvelope.title, "New");
  assert.equal(fromEnvelope.updatedAt, "new");
  assert.equal(fromEmpty.title, "New");
  assert.equal(fromEmpty.pages, 120);
  assert.equal(fromEmpty.coverUrl, "cover");
  assert.equal(fromEmpty.possessionStatus, "OWNED");
  assert.equal(fromEmpty.loanedTo, null);
});
