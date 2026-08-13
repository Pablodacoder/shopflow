import { NextResponse } from "next/server";
import { orderService } from "../../../lib/services/orderService";
import { orderCreateSchema } from "../../../lib/utils/validation";
import { verifyToken } from "../../../lib/utils/auth";
import { logger } from "../../../lib/utils/logger";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await orderService.getUserOrders(user.id);
  return NextResponse.json(orders);
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const order = await orderService.placeOrder(user.id, parsed.data.items);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    logger.error({ err }, "order placement failed");
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
