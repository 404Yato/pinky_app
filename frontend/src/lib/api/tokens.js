const TOKEN_STORAGE_KEY = "pinky.api-tokens";
const AUTH_CHANGE_EVENT = "pinky:auth-change";

function storage() {
  return globalThis.sessionStorage;
}

export function getTokens() {
  try {
    const value = storage()?.getItem(TOKEN_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function announceAuthChange() {
  if (typeof globalThis.dispatchEvent === "function" && typeof globalThis.Event === "function") {
    globalThis.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function setTokens(tokens) {
  storage()?.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  announceAuthChange();
}

export function clearTokens() {
  storage()?.removeItem(TOKEN_STORAGE_KEY);
  announceAuthChange();
}

export function subscribeToAuthChanges(listener) {
  if (typeof globalThis.addEventListener !== "function") return () => {};
  globalThis.addEventListener(AUTH_CHANGE_EVENT, listener);
  return () => globalThis.removeEventListener(AUTH_CHANGE_EVENT, listener);
}
