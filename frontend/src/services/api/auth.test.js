import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { login, logout, register } from "./auth.js";
import { clearTokens, getTokens, setTokens } from "../../lib/api/tokens.js";

const values = new Map();

beforeEach(() => {
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  values.clear();
});

afterEach(() => {
  clearTokens();
  delete globalThis.fetch;
  delete globalThis.sessionStorage;
});

test("logs in with Django username credentials and resolves whoami", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (requests.length === 1) return new Response(JSON.stringify({ access: "access", refresh: "refresh" }), { status: 200 });
    return new Response(JSON.stringify({ id: 2, username: "reader", email: "reader@example.com" }), { status: 200 });
  };

  const user = await login({ username: "reader", password: "secret" });
  assert.equal(user.name, "reader");
  assert.deepEqual(JSON.parse(requests[0].options.body), { username: "reader", password: "secret" });
  assert.equal(requests[1].options.headers.Authorization, "Bearer access");
});

test("blacklists the refresh token on logout and clears local tokens", async () => {
  setTokens({ access: "access", refresh: "refresh" });
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ message: "Logged out successfully." }), { status: 200 });
  };

  await logout();
  assert.deepEqual(JSON.parse(request.options.body), { refresh: "refresh" });
  assert.equal(request.options.headers.Authorization, undefined);
  assert.equal(getTokens(), null);
});

test("completes local logout when the remote request fails", async () => {
  setTokens({ access: "access", refresh: "refresh" });
  globalThis.fetch = async () => { throw new TypeError("offline"); };
  await logout();
  assert.equal(getTokens(), null);
});

test("registers publicly without sending confirmation or creating tokens", async () => {
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ username: "reader", email: "reader@example.com" }), { status: 201 });
  };
  const result = await register({ username: "reader", email: "reader@example.com", password: "secret", confirmPassword: "secret" });
  assert.deepEqual(result, { username: "reader", email: "reader@example.com" });
  assert.deepEqual(JSON.parse(request.options.body), { username: "reader", email: "reader@example.com", password: "secret" });
  assert.equal(request.options.headers.Authorization, undefined);
  assert.equal(getTokens(), null);
});

test("preserves DRF registration field errors for the form", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ username: ["A user with this username already exists."] }), { status: 400 });
  await assert.rejects(() => register({ username: "reader", email: "reader@example.com", password: "secret" }), (error) => {
    assert.equal(error.code, "VALIDATION_ERROR");
    assert.deepEqual(error.details, { username: ["A user with this username already exists."] });
    return true;
  });
});
