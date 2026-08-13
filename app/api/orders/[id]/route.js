import { NextResponse } from "next/server";
import { orderService } from "../../../../lib/services/orderService";
import { verifyToken, requireRole } from "../../../../lib/utils/auth";

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    const user = await verifyToken(token);
    requireRole(user, ["ADMIN"]);

    const { status } = await req.json();
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await orderService.updateStatus(params.id, status, user.id);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
