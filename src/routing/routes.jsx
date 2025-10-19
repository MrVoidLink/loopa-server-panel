import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../app/layout/AppLayout";

// صفحات
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/login/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // 👈 Layout جدید
    children: [
      { path: "/", element: <DashboardPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
