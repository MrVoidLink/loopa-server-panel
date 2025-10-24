import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

function ChangePasswordModal({ open, onClose, onSuccess }) {
  const { user, changePassword } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!open) return null;

  useEffect(() => {
    if (!open) return;
    setUsername(user?.username ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccessMessage(null);
  }, [open, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password confirmation does not match.");
      return;
    }

    try {
      setLoading(true);
      await changePassword({ currentPassword, newPassword, username });
      setSuccessMessage("Password updated successfully.");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Unable to change password.");
    } finally {
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="relative w-full max-w-lg mx-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-8 shadow-[0_24px_65px_rgba(15,23,42,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
        >
          Close
        </button>

        <header className="mb-6 space-y-1 text-left">
          <h2 className="text-2xl font-semibold text-[var(--text-main)]">
            Change password
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Update your login credentials. You will need to sign in again afterwards.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
              {successMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
