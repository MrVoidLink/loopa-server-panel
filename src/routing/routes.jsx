import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../app/layout/AppLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/login/pages/LoginPage";
import CreatePage from "../features/create/pages/CreatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "create", element: <CreatePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
