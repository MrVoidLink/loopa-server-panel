import bcrypt from "bcryptjs";
import crypto from "crypto";

const DEFAULT_SALT_ROUNDS = 10;

const saltRounds = Number.parseInt(
  process.env.BCRYPT_SALT_ROUNDS || "",
  10
);

const resolvedSaltRounds = Number.isNaN(saltRounds)
  ? DEFAULT_SALT_ROUNDS
  : Math.max(4, Math.min(saltRounds, 15));

export function generateSecurePassword(length = 16) {
  const bytes = Math.ceil((length * 3) / 4);
  return crypto.randomBytes(bytes).toString("base64url").slice(0, length);
}

export function hashPassword(value) {
  return bcrypt.hash(value, resolvedSaltRounds);
}

export function verifyPassword(value, hash) {
  if (!hash) {
    return false;
  }
  return bcrypt.compare(value, hash);
}
