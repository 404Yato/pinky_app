import assert from "node:assert/strict";
import test from "node:test";

import { normalizeRegistrationValues, registrationErrorsFromApi, validateRegistrationValues } from "./registration.js";

test("requires every registration field", () => {
  assert.deepEqual(Object.keys(validateRegistrationValues({}).errors).sort(), ["confirmPassword", "email", "password", "username"]);
});

test("rejects invalid email and mismatched password confirmation", () => {
  const result = validateRegistrationValues({ username: "reader", email: "invalid", password: "secret", confirmPassword: "different" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.email);
  assert.ok(result.errors.confirmPassword);
});

test("normalizes public fields while preserving exact passwords", () => {
  assert.deepEqual(normalizeRegistrationValues({ username: " reader ", email: " READER@EXAMPLE.COM ", password: " secret ", confirmPassword: " secret " }), {
    username: "reader", email: "reader@example.com", password: " secret ", confirmPassword: " secret ",
  });
});

test("maps DRF uniqueness errors to their fields", () => {
  assert.deepEqual(registrationErrorsFromApi({ details: { username: ["A user with this username already exists."] } }).fieldErrors, { username: "Ese nombre de usuario ya está en uso." });
  assert.deepEqual(registrationErrorsFromApi({ details: { email: ["A user with this email already exists."] } }).fieldErrors, { email: "Ese correo electrónico ya está registrado." });
});
