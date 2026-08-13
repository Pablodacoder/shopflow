import { NextResponse } from "next/server";
import { authService } from "../../../../lib/services/authService";
import { registerSchema } from "../../../../lib/utils/validation";
import { logger } from "../../../../lib/utils/logger";

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { token, user } = await authService.register(parsed.data);
    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7200 });
    return res;
  } catch (err) {
    logger.error({ err }, "register failed");
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
