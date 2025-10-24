import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "loopa.auth.token";

const resolveApiBase = () => {
  if (typeof window === "undefined") {
    return "http://localhost:4000";
  }
  const host = window.location.hostname || "localhost";
  return `http://${host}:4000`;
};

const normaliseHeaders = (headers) => {
  if (!headers) return new Headers();
  if (headers instanceof Headers) return new Headers(headers);
  return new Headers(Object.entries(headers));
};

export function AuthProvider({ children }) {
  const apiBase = useMemo(resolveApiBase, []);
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  });
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const authFetch = useCallback(
    async (input, init = {}) => {
      const url =
        typeof input === "string" && !/^https?:/i.test(input)
          ? `${apiBase}${input.startsWith("/") ? input : `/${input}`}`
          : input;

      const options = { ...init };
      const headers = normaliseHeaders(init.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      options.headers = headers;

      const response = await fetch(url, options);
      if (response.status === 401) {
        clearSession();
      }
      return response;
    },
    [apiBase, token, clearSession]
  );

  const login = useCallback(
    async ({ username, password }) => {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok || !payload?.ok || !payload?.token) {
        const error = payload?.error || "Login failed.";
        throw new Error(error);
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
      }

      setToken(payload.token);
      setUser(payload.user ?? { username });
      return payload.user ?? { username };
    },
    [apiBase]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const changePassword = useCallback(
    async ({ currentPassword, newPassword, username }) => {
      const response = await authFetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, username }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok || !payload?.ok) {
        const error = payload?.error || "Unable to change password.";
        throw new Error(error);
      }

      setUser(payload.user);
      return payload.user;
    },
    [authFetch]
  );

  useEffect(() => {
    if (!token) {
      setInitialising(false);
      return;
    }

    const controller = new AbortController();

    const validateToken = async () => {
      try {
        const response = await fetch(`${apiBase}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Session invalid");
        }

        const payload = await response.json();
        if (payload?.user) {
          setUser(payload.user);
        } else {
          clearSession();
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          clearSession();
        }
      } finally {
        setInitialising(false);
      }
    };

    validateToken();

    return () => controller.abort();
  }, [apiBase, token, clearSession]);

  const value = useMemo(
    () => ({
      apiBase,
      token,
      user,
      isAuthenticated: Boolean(token && user),
      initialising,
      login,
      logout,
      authFetch,
      changePassword,
    }),
    [apiBase, token, user, initialising, login, logout, authFetch, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
