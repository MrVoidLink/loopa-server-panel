import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden
                    bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      {/* 🔹 پس‌زمینه متحرک */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-cyan-400/10 blur-3xl animate-pulse" />

      {/* 🔹 کارت لاگین */}
      <div className="relative z-10 bg-[var(--bg-card)]/80 backdrop-blur-lg border border-[var(--border-color)] 
                      rounded-3xl shadow-2xl p-10 w-[90%] max-w-md text-center transition-all duration-500">
        <h1 className="text-4xl font-extrabold text-[var(--accent)] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2">
          Loopa Admin
        </h1>
        <p className="text-[var(--text-muted)] mb-6 tracking-wide">
          Manage your private servers securely 🔐
        </p>

        <LoginForm />

        <p className="text-[var(--text-muted)] text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="#"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition"
          >
            Contact Admin
          </a>
        </p>
      </div>

      {/* 🔹 افکت نور پایین صفحه */}
      <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-[var(--accent)]/10 to-transparent" />
    </div>
  );
}

export default LoginPage;
