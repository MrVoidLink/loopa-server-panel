import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "../routing/routes";
import "../index.css";
import useTheme from "../app/layout/hooks/useTheme"; // 👈 مسیر دقیق به هوک تمت

function ThemeRoot() {
  // این باعث میشه data-theme روی <html> از لحظه اول ست بشه
  const { theme } = useTheme();
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeRoot />
  </React.StrictMode>
);
