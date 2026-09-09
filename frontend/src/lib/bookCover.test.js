import assert from "node:assert/strict";
import test from "node:test";

import { isValidCoverUrl } from "./bookCover.js";

test("accepts empty and complete HTTP cover URLs", () => {
  assert.equal(isValidCoverUrl(""), true);
  assert.equal(isValidCoverUrl("https://example.com/covers/book?id=42"), true);
  assert.equal(isValidCoverUrl("http://images.example.com/book.webp"), true);
});

test("rejects incomplete or unsafe cover URLs", () => {
  assert.equal(isValidCoverUrl("example.com/cover.jpg"), false);
  assert.equal(isValidCoverUrl("not a url"), false);
  assert.equal(isValidCoverUrl("javascript:alert(1)"), false);
});
