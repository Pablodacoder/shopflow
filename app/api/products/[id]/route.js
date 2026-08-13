import { NextResponse } from "next/server";
import { productService } from "../../../../lib/services/productService";

export async function GET(_req, { params }) {
  const product = await productService.getById(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}
