import React from "react";

function LoginForm() {
  return (
    <form className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg 
                   text-[var(--text-main)] placeholder-[var(--text-muted)]
                   focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent 
                   outline-none transition-all duration-200"
      />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg 
                   text-[var(--text-main)] placeholder-[var(--text-muted)]
                   focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent 
                   outline-none transition-all duration-200"
      />
      <button
        type="submit"
        className="mt-2 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 
                   bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white
                   shadow-[0_0_15px_var(--accent)]/30 hover:shadow-[0_0_20px_var(--accent-hover)]/40"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
