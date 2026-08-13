// Authentication: JWT-based, signed with HS256 via jose.
// Authorization: role claim embedded in the token, checked per-route.

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const ALG = "HS256";
const EXPIRY = "2h";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function signToken({ id, email, role }) {
  return new SignJWT({ email, role })
    .setProtectedHeader({ alg: ALG })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

// Authorization guard: throws if role isn't in the allowed list.
export function requireRole(user, allowedRoles) {
  if (!user || !allowedRoles.includes(user.role)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}
