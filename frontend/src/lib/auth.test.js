import assert from "node:assert/strict";
import test from "node:test";

import { normalizeLoginValues, validateLoginValues } from "./auth.js";

test("normalizes login email without altering the password", () => {
  assert.deepEqual(normalizeLoginValues({ email: "  CRISTIAN@PINKY.APP ", password: "  secret  " }), {
    email: "cristian@pinky.app",
    password: "  secret  ",
  });
});

test("validates required login fields and email format", () => {
  assert.deepEqual(Object.keys(validateLoginValues({}).errors).sort(), ["email", "password"]);
  assert.equal(validateLoginValues({ email: "not-an-email", password: "secret" }).errors.email, "Ingresa un correo electrónico válido.");
  assert.equal(validateLoginValues({ email: "reader@example.com", password: "secret" }).valid, true);
});
