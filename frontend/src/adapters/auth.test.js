import assert from "node:assert/strict";
import test from "node:test";

import { userResponseToViewModel } from "./auth.js";

test("maps whoami responses to the existing user view model", () => {
  assert.deepEqual(userResponseToViewModel({ id: 7, username: "ana_reader", email: "ana@example.com" }), {
    id: 7, name: "ana_reader", username: "ana_reader", email: "ana@example.com", initials: "A",
  });
});
