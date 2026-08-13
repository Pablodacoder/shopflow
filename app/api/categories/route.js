import { NextResponse } from "next/server";
import { prisma } from "../../../lib/patterns/db";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}
