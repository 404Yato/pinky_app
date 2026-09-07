import assert from "node:assert/strict";
import test from "node:test";

import { normalizeLoginValues, validateLoginValues } from "./auth.js";

test("normalizes login username without altering the password", () => {
  assert.deepEqual(normalizeLoginValues({ username: "  reader_01 ", password: "  secret  " }), {
    username: "reader_01",
    password: "  secret  ",
  });
});

test("validates required login fields", () => {
  assert.deepEqual(Object.keys(validateLoginValues({}).errors).sort(), ["password", "username"]);
  assert.equal(validateLoginValues({ username: "reader", password: "secret" }).valid, true);
});
