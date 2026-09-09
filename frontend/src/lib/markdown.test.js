import assert from "node:assert/strict";
import test from "node:test";

import { applyMarkdownFormat } from "./markdown.js";

test("wraps selected text with inline Markdown", () => {
  assert.equal(applyMarkdownFormat("Me gustó mucho", 3, 8, "bold").value, "Me **gustó** mucho");
  assert.equal(applyMarkdownFormat("Un recuerdo", 3, 11, "italic").value, "Un *recuerdo*");
});

test("inserts approachable placeholders when there is no selection", () => {
  const result = applyMarkdownFormat("Nota: ", 6, 6, "link");
  assert.equal(result.value, "Nota: [texto del enlace](https://)");
  assert.equal(result.value.slice(result.selectionStart, result.selectionEnd), "texto del enlace");
});

test("formats multiline lists and blockquotes", () => {
  assert.equal(applyMarkdownFormat("Uno\nDos", 0, 7, "unordered-list").value, "- Uno\n- Dos");
  assert.equal(applyMarkdownFormat("Uno\nDos", 0, 7, "ordered-list").value, "1. Uno\n2. Dos");
  assert.equal(applyMarkdownFormat("Recuerdo", 0, 8, "blockquote").value, "> Recuerdo");
});
