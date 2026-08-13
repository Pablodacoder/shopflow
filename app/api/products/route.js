import { NextResponse } from "next/server";
import { productService } from "../../../lib/services/productService";
import { productSchema } from "../../../lib/utils/validation";
import { verifyToken, requireRole } from "../../../lib/utils/auth";
import { logger } from "../../../lib/utils/logger";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await productService.list({
      categorySlug: searchParams.get("category") || undefined,
      search: searchParams.get("q") || undefined,
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 20,
    });
    return NextResponse.json(result);
  } catch (err) {
    logger.error({ err }, "product list failed");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const user = await verifyToken(token);
    requireRole(user, ["ADMIN"]); // authorization check: only admins can create products

    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await productService.create(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    logger.error({ err }, "product create failed");
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
