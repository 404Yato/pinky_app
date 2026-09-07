import { useCallback, useEffect, useState } from "react";

import { login as apiLogin, logout as apiLogout, register as apiRegister, restoreSession } from "@/services/api/auth";
import { getTokens, subscribeToAuthChanges } from "@/lib/api/tokens";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    restoreSession()
      .then((restoredUser) => {
        if (!active) return;
        setUser(restoredUser);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    const unsubscribe = subscribeToAuthChanges(() => {
      if (!getTokens()) setUser(null);
    });
    return () => { active = false; unsubscribe(); };
  }, [requestVersion]);

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await apiLogin(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  const register = useCallback((values) => apiRegister(values), []);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  return { user, authenticated: Boolean(user), status, login, logout, register, retry };
}
