import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "../app/layout/ProtectedLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/login/pages/LoginPage";
import CreatePage from "../features/create/pages/CreatePage";
import ConfigPage from "../features/config/pages/ConfigPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "create", element: <CreatePage /> },
      { path: "config", element: <ConfigPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
