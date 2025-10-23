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
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: item.id || Math.random().toString(36).slice(2),
        message: item.message,
        type: item.type || "info",
        timestamp: item.timestamp || new Date().toISOString(),
        read: Boolean(item.read),
      }))
      .slice(0, 10);
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
      read: false,
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

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      let changed = false;
      const next = prev.map((item) => {
        if (item.read) return item;
        changed = true;
        return { ...item, read: true };
      });
      return changed ? next : prev;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      markAllRead,
      markAsRead,
      unreadCount,
    }),
    [
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      markAllRead,
      markAsRead,
      unreadCount,
    ]
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
