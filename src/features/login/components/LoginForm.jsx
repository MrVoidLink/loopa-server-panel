import React, { useState } from "react";

function LoginForm({ onSubmit, loading = false, error = null }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading || !onSubmit) return;
    onSubmit({ username, password });
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-sm mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Username"
        className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg 
                   text-[var(--text-main)] placeholder-[var(--text-muted)]
                   focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent 
                   outline-none transition-all duration-200"
      />
      <input
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg 
                   text-[var(--text-main)] placeholder-[var(--text-muted)]
                   focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent 
                   outline-none transition-all duration-200"
      />

      {error && (
        <p className="text-sm text-red-400 text-left px-1">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 
                   bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white
                   shadow-[0_0_15px_var(--accent)]/30 hover:shadow-[0_0_20px_var(--accent-hover)]/40
                   disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default LoginForm;
