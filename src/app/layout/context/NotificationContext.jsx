import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const NotificationContext = createContext(null);
const STORAGE_KEY = "loopa.notifications";

const readStoredNotifications = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 10);
  } catch {
    return [];
  }
};

const generateId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(readStoredNotifications);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications.slice(0, 10))
      );
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [notifications]);

  const addNotification = useCallback(({ message, type = "info" }) => {
    if (!message) return;
    const entry = {
      id: generateId(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [entry, ...prev].slice(0, 10));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
    }),
    [notifications, addNotification, removeNotification, clearNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
