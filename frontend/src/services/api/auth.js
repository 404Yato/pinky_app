import { userResponseToViewModel } from "../../adapters/auth.js";
import { apiRequest, ApiError } from "../../lib/api/client.js";
import { clearTokens, getTokens, setTokens } from "../../lib/api/tokens.js";

export async function getCurrentUser() {
  return userResponseToViewModel(await apiRequest("/inventory/whoami/"));
}

export async function login(credentials) {
  let tokens;
  try {
    tokens = await apiRequest("/auth/login/", {
      method: "POST",
      auth: false,
      body: { username: credentials.username, password: credentials.password },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  setTokens(tokens);
  try {
    return await getCurrentUser();
  } catch (error) {
    clearTokens();
    throw error;
  }
}

export async function register(values) {
  const response = await apiRequest("/auth/register/", {
    method: "POST",
    auth: false,
    body: {
      username: values.username,
      email: values.email,
      password: values.password,
    },
  });
  if (!response?.username || !response?.email) {
    throw new ApiError("La respuesta de registro no es válida.", { code: "UNEXPECTED_RESPONSE", details: response });
  }
  return { username: response.username, email: response.email };
}

export async function restoreSession() {
  if (!getTokens()?.refresh) return null;
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error?.code === "UNAUTHORIZED") {
      clearTokens();
      return null;
    }
    throw error;
  }
}

export async function logout() {
  const refresh = getTokens()?.refresh;
  try {
    if (refresh) await apiRequest("/auth/logout/", { method: "POST", auth: false, body: { refresh } });
  } catch {
    // Local logout must complete even when an already-invalid token or the network prevents blacklisting.
  } finally {
    clearTokens();
  }
}
