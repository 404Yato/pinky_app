import assert from "node:assert/strict";
import test from "node:test";

import { fillEmptyBookFields, isValidIsbn, normalizeIsbn } from "./isbn.js";

test("normalizes formatted ISBN-10 and ISBN-13 values", () => {
  assert.equal(normalizeIsbn("978-84-376-0494-7"), "9788437604947");
  assert.equal(normalizeIsbn(" 0-8044-2957-x "), "080442957X");
});

test("validates ISBN checksums before lookup", () => {
  assert.equal(isValidIsbn("978-84-376-0494-7"), true);
  assert.equal(isValidIsbn("0-306-40615-2"), true);
  assert.equal(isValidIsbn("9788437604948"), false);
  assert.equal(isValidIsbn("not-an-isbn"), false);
});

test("fills only empty book fields and normalizes numeric controls to strings", () => {
  const result = fillEmptyBookFields(
    { isbn: "978-84", title: "Mi título", author: "", pages: "", publisher: "Editorial propia", coverUrl: "" },
    { isbn: "9788437604947", title: "Título externo", author: "Autora", pages: 493, publisher: "Cátedra", coverUrl: "https://covers.example/1.jpg" },
  );

  assert.equal(result.isbn, "9788437604947");
  assert.equal(result.title, "Mi título");
  assert.equal(result.author, "Autora");
  assert.equal(result.pages, "493");
  assert.equal(result.publisher, "Editorial propia");
  assert.equal(result.coverUrl, "https://covers.example/1.jpg");
});
