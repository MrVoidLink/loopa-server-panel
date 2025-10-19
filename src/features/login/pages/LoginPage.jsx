import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center relative overflow-hidden">
      {/* پس‌زمینه متحرک */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-400/10 blur-3xl animate-pulse"></div>

      {/* کارت لاگین */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10 w-[90%] max-w-md text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] mb-2">
          Loopa Admin
        </h1>
        <p className="text-gray-400 mb-6 tracking-wide">
          Manage your private servers securely 🔐
        </p>

        <LoginForm />

        <p className="text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="#"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            Contact Admin
          </a>
        </p>
      </div>

      {/* افکت نور پایین صفحه */}
      <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
    </div>
  );
}

export default LoginPage;
