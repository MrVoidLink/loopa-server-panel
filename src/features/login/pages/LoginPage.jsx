import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../../../app/auth/AuthContext";

function LoginPage() {
  const { login, isAuthenticated, initialising } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialising) return;
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [initialising, isAuthenticated, navigate, location]);

  const handleSubmit = async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden
                    bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      {/* dY"1 U_O3�?OO�U.UOU+U� U.O�O-O�Uc */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-cyan-400/10 blur-3xl animate-pulse" />

      {/* dY"1 UcOO�O� U,OU_UOU+ */}
      <div className="relative z-10 bg-[var(--bg-card)]/80 backdrop-blur-lg border border-[var(--border-color)] 
                      rounded-3xl shadow-2xl p-10 w-[90%] max-w-md text-center transition-all duration-500">
        <h1 className="text-4xl font-extrabold text-[var(--accent)] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2">
          Loopa Admin
        </h1>
        <p className="text-[var(--text-muted)] mb-6 tracking-wide">
          Manage your private servers securely dY"?
        </p>

        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />

        <p className="text-[var(--text-muted)] text-sm mt-6">
          Don�?Tt have an account?{" "}
          <a
            href="#"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition"
          >
            Contact Admin
          </a>
        </p>
      </div>

      {/* dY"1 OU?UcO� U+U^O� U_OUOUOU+ O�U?O-U� */}
      <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-[var(--accent)]/10 to-transparent" />
    </div>
  );
}

export default LoginPage;
