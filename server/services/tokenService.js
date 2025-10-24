import jwt from "jsonwebtoken";

const secret = process.env.AUTH_SECRET || "loopa-dev-secret";
const tokenTtl = process.env.AUTH_TOKEN_TTL || "12h";

if (!process.env.AUTH_SECRET) {
  console.warn(
    "[auth] AUTH_SECRET is not set. Using fallback value for development."
  );
}

export const issueAuthToken = (payload, options = {}) =>
  jwt.sign(payload, secret, { expiresIn: tokenTtl, ...options });

export const verifyAuthToken = (token) => jwt.verify(token, secret);
