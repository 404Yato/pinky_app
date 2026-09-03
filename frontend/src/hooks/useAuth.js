import { useCallback, useState } from "react";

import { login as mockLogin } from "@/services/mock/auth";

const SESSION_KEY = "pinky.mock-session";

function readSession() {
  try {
    const value = window.sessionStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(readSession);

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await mockLogin(credentials);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, authenticated: Boolean(user), login, logout };
}
