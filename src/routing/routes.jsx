import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../app/layout/AppLayout";

// صفحات
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/login/pages/LoginPage";
import CreatePage from "../features/create/CreatePage"; // ✅ اضافه شد

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/create", element: <CreatePage /> }, // ✅ مسیر جدید ساخت
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
