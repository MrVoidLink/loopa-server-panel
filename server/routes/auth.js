import express from "express";
import {
  ensureAuthStore,
  getAuthConfig,
  setAuthConfig,
} from "../config/authStore.js";
import {
  hashPassword,
  verifyPassword,
} from "../services/passwordService.js";
import { issueAuthToken } from "../services/tokenService.js";
import { authGuard } from "../middleware/authGuard.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ ok: false, error: "Username and password are required." });
  }

  await ensureAuthStore();
  const record = await getAuthConfig();

  if (username !== record.username) {
    return res
      .status(401)
      .json({ ok: false, error: "Invalid username or password." });
  }

  const valid = await verifyPassword(password, record.passwordHash);
  if (!valid) {
    return res
      .status(401)
      .json({ ok: false, error: "Invalid username or password." });
  }

  const token = issueAuthToken({ sub: record.username });

  return res.json({
    ok: true,
    token,
    user: {
      username: record.username,
    },
  });
});

router.get("/me", authGuard, async (req, res) => {
  const record = await getAuthConfig();
  return res.json({ ok: true, user: { username: record.username } });
});

router.post("/change-password", authGuard, async (req, res) => {
  const { currentPassword, newPassword, username } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      ok: false,
      error: "Current and new password are required.",
    });
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(400).json({
      ok: false,
      error: "New password must be at least 8 characters.",
    });
  }

  const record = await getAuthConfig();
  const valid = await verifyPassword(currentPassword, record.passwordHash);

  if (!valid) {
    return res
      .status(400)
      .json({ ok: false, error: "Current password is incorrect." });
  }

  const nextUsername = (username || record.username).trim();
  const passwordHash = await hashPassword(newPassword);

  await setAuthConfig({ username: nextUsername, passwordHash });

  return res.json({
    ok: true,
    user: { username: nextUsername },
  });
});

export default router;
