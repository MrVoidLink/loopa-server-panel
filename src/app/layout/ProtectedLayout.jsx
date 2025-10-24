import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "./AppLayout";

function ProtectedLayout() {
  const { isAuthenticated, initialising } = useAuth();
  const location = useLocation();

  if (initialising) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)]">
        <span className="text-sm tracking-wide">Loading session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AppLayout />;
}

export default ProtectedLayout;
