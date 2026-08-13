import { NextResponse } from "next/server";
import { authService } from "../../../../lib/services/authService";
import { loginSchema } from "../../../../lib/utils/validation";
import { logger } from "../../../../lib/utils/logger";

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { token, user } = await authService.login(parsed.data);
    const res = NextResponse.json({ user });
    res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7200 });
    return res;
  } catch (err) {
    logger.warn({ err: err.message }, "login failed");
    return NextResponse.json({ error: "Invalid credentials" }, { status: err.status || 500 });
  }
}
