import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { hashPassword, generateSecurePassword } from "../services/passwordService.js";

const DEFAULT_DATA_DIR =
  process.env.LOOPA_DATA_DIR ||
  (process.platform === "win32"
    ? path.join(process.cwd(), ".loopa")
    : "/usr/local/etc/loopa-panel");

const AUTH_FILE_PATH = path.join(DEFAULT_DATA_DIR, "auth.json");

let initialized = false;
let credentialCache = null;

const parseAuthFile = async () => {
  try {
    const raw = await fs.readFile(AUTH_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.passwordHash) {
      throw new Error("Missing username or password hash in auth file.");
    }
    return parsed;
  } catch (error) {
    throw new Error(`Unable to read auth store: ${error.message}`);
  }
};

const writeAuthFile = async (record) => {
  const payload = JSON.stringify(record, null, 2);
  await fs.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
  await fs.writeFile(AUTH_FILE_PATH, payload, { mode: 0o600 });
  credentialCache = record;
};

export const ensureAuthStore = async () => {
  if (initialized && credentialCache) {
    return credentialCache;
  }

  await fs.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });

  if (!fsSync.existsSync(AUTH_FILE_PATH)) {
    const username = process.env.ADMIN_USER?.trim() || "admin";
    const suppliedPassword = process.env.ADMIN_PASS?.trim();
    const password = suppliedPassword || generateSecurePassword(18);
    const passwordHash = await hashPassword(password);
    const record = {
      username,
      passwordHash,
      updatedAt: new Date().toISOString(),
    };
    await writeAuthFile(record);

    if (!suppliedPassword) {
      console.warn(
        `\n[auth] ADMIN_PASS not provided. Generated temporary password for user '${username}':\n[auth] ${password}\n[auth] Please change it immediately after login.\n`
      );
    } else {
      console.info(`[auth] Credential store initialised for user '${username}'.`);
    }
    initialized = true;
    return record;
  }

  const parsed = await parseAuthFile();
  credentialCache = parsed;
  initialized = true;
  return parsed;
};

export const getAuthConfig = async () => {
  const config = await ensureAuthStore();
  return { ...config };
};

export const setAuthConfig = async (config) => {
  const base = await getAuthConfig();
  const next = {
    ...base,
    ...config,
    updatedAt: new Date().toISOString(),
  };
  await writeAuthFile(next);
  return { ...next };
};

export const setPlainCredentials = async (username, password) => {
  const passwordHash = await hashPassword(password);
  return setAuthConfig({ username, passwordHash });
};

export const AUTH_DATA_PATH = AUTH_FILE_PATH;
