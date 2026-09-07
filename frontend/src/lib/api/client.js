import { clearTokens, getTokens, setTokens } from "./tokens.js";

const configuredBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? "/api";
export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, code = "API_ERROR", details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let refreshPromise = null;

function errorCode(status) {
  if (status === 400) return "VALIDATION_ERROR";
  if (status === 401 || status === 403) return "UNAUTHORIZED";
  if (status === 404) return "NOT_FOUND";
  return "API_ERROR";
}

async function readResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function send(path, { method = "GET", body, accessToken } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError("No pudimos conectar con Pinky.", { code: "NETWORK_ERROR", details: error });
  }

  const data = await readResponse(response);
  return { response, data };
}

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const current = getTokens();
    if (!current?.refresh) {
      clearTokens();
      throw new ApiError("La sesión expiró.", { status: 401, code: "UNAUTHORIZED" });
    }

    const { response, data } = await send("/auth/refresh/", {
      method: "POST",
      body: { refresh: current.refresh },
    });
    if (!response.ok || !data?.access) {
      clearTokens();
      throw new ApiError("La sesión expiró.", { status: response.status, code: "UNAUTHORIZED", details: data });
    }

    const next = { access: data.access, refresh: data.refresh ?? current.refresh };
    setTokens(next);
    return next.access;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiRequest(path, { auth = true, retry = true, accessToken, ...options } = {}) {
  const tokens = getTokens();
  const { response, data } = await send(path, {
    ...options,
    accessToken: auth ? (accessToken ?? tokens?.access) : null,
  });

  if (response.status === 401 && auth && retry) {
    const accessToken = await refreshAccessToken();
    return apiRequest(path, { ...options, auth: true, retry: false, accessToken });
  }

  if (response.status === 401 && auth) clearTokens();

  if (!response.ok) {
    throw new ApiError(data?.detail ?? data?.error ?? "La solicitud no pudo completarse.", {
      status: response.status,
      code: errorCode(response.status),
      details: data,
    });
  }

  return data;
}
