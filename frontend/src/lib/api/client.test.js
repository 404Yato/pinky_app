import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { apiRequest } from "./client.js";
import { clearTokens, getTokens, setTokens } from "./tokens.js";

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

test("refreshes an expired access token once and stores the rotated token", async () => {
  setTokens({ access: "expired", refresh: "refresh-old" });
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (requests.length === 1) return new Response(JSON.stringify({ detail: "expired" }), { status: 401 });
    if (requests.length === 2) return new Response(JSON.stringify({ access: "access-new", refresh: "refresh-new" }), { status: 200 });
    return new Response(JSON.stringify({ id: 1 }), { status: 200 });
  };

  assert.deepEqual(await apiRequest("/inventory/whoami/"), { id: 1 });
  assert.deepEqual(getTokens(), { access: "access-new", refresh: "refresh-new" });
  assert.equal(requests[2].options.headers.Authorization, "Bearer access-new");
});

test("normalizes transport failures", async () => {
  globalThis.fetch = async () => { throw new TypeError("offline"); };
  await assert.rejects(() => apiRequest("/health/", { auth: false }), { code: "NETWORK_ERROR" });
});

test("treats an empty 204 response as a successful null result", async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });
  assert.equal(await apiRequest("/inventory/items/4/", { method: "DELETE", auth: false }), null);
});

test("keeps authenticated bodyless requests free of unnecessary content headers", async () => {
  setTokens({ access: "access-token", refresh: "refresh-token" });
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify([]), { status: 200 });
  };

  await apiRequest("/inventory/items/");

  assert.equal(request.options.method, "GET");
  assert.equal(request.options.headers.Accept, "application/json");
  assert.equal(request.options.headers.Authorization, "Bearer access-token");
  assert.equal(request.options.headers["Content-Type"], undefined);
  assert.equal(request.options.body, undefined);
});

test("adds the JSON content type only when a request has a body", async () => {
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ username: "reader" }), { status: 201 });
  };

  await apiRequest("/auth/register/", {
    method: "POST",
    auth: false,
    body: { username: "reader" },
  });

  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.equal(request.options.headers.Authorization, undefined);
  assert.equal(request.options.body, JSON.stringify({ username: "reader" }));
});
