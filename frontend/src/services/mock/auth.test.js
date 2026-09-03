import assert from "node:assert/strict";
import test from "node:test";

import { DEMO_CREDENTIALS, MockAuthError, login } from "./auth.js";

test("mock login returns public user data for demo credentials", async () => {
  const user = await login({ email: ` ${DEMO_CREDENTIALS.email.toUpperCase()} `, password: DEMO_CREDENTIALS.password });
  assert.equal(user.email, DEMO_CREDENTIALS.email);
  assert.equal(Object.hasOwn(user, "password"), false);
});

test("mock login rejects invalid credentials with a stable code", async () => {
  await assert.rejects(() => login({ email: DEMO_CREDENTIALS.email, password: "incorrect" }), (error) => {
    assert.ok(error instanceof MockAuthError);
    assert.equal(error.code, "INVALID_CREDENTIALS");
    return true;
  });
});
