import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "../routing/routes";
import "../index.css";
import useTheme from "../app/layout/hooks/useTheme"; // dY`^ U.O3UOO� O_U,UOU, O"U� U�U^Uc O�U.O�
import { AuthProvider } from "../app/auth/AuthContext";

function ThemeRoot() {
  // OUOU+ O"OO1O� U.UOO'U� data-theme O�U^UO <html> OO� U,O-O,U� OU^U, O3O� O"O'U�
  const { theme } = useTheme();
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeRoot />
  </React.StrictMode>
);
