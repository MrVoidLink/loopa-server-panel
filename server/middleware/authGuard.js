import { verifyAuthToken } from "../services/tokenService.js";

const unauthorized = (res) =>
  res.status(401).json({ ok: false, error: "Unauthorized" });

export const authGuard = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return unauthorized(res);
  }

  const token = header.slice(7).trim();
  if (!token) {
    return unauthorized(res);
  }

  try {
    const payload = verifyAuthToken(token);
    req.user = {
      username: payload?.sub,
      token: payload,
    };
  } catch {
    return unauthorized(res);
  }

  return next();
};
