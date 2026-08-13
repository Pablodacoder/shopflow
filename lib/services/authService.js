import { userRepository } from "../repositories/userRepository";
import { hashPassword, verifyPassword, signToken } from "../utils/auth";
import { logger } from "../utils/logger";

export const authService = {
  async register({ email, password, name }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw Object.assign(new Error("Email already registered"), { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ email, passwordHash, name });
    const token = await signToken(user);
    logger.info({ userId: user.id }, "user registered");
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    // Same error for "no user" and "wrong password" — don't leak which one (avoids account enumeration)
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }
    const token = await signToken(user);
    logger.info({ userId: user.id }, "user logged in");
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
};
