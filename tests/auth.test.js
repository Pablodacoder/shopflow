import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../lib/utils/auth";
import { registerSchema, loginSchema } from "../lib/utils/validation";

describe("password hashing", () => {
  it("hashes and verifies a correct password", async () => {
    const hash = await hashPassword("Password123!");
    expect(await verifyPassword("Password123!", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Password123!");
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });
});

describe("JWT tokens", () => {
  it("signs and verifies a token round-trip", async () => {
    const token = await signToken({ id: "user-1", email: "a@b.com", role: "CUSTOMER" });
    const decoded = await verifyToken(token);
    expect(decoded.id).toBe("user-1");
    expect(decoded.role).toBe("CUSTOMER");
  });

  it("returns null for a garbage token", async () => {
    const decoded = await verifyToken("not-a-real-token");
    expect(decoded).toBeNull();
  });
});

describe("validation schemas", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "short",
      name: "Test User",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email on login", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
  });
});
