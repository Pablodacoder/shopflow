// DATA LAYER — the only file that speaks Prisma for products.
// Services never import `prisma` directly; they call this repository.
// That boundary is what makes "separation of concerns" real rather than nominal.

import { prisma } from "../patterns/db";

export const productRepository = {
  findMany({ categorySlug, search, skip = 0, take = 20 }) {
    return prisma.product.findMany({
      where: {
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(search
          ? { name: { contains: search, mode: "insensitive" } }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  count({ categorySlug, search }) {
    return prisma.product.count({
      where: {
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(search
          ? { name: { contains: search, mode: "insensitive" } }
          : {}),
      },
    });
  },

  findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });
  },

  create(data) {
    return prisma.product.create({ data });
  },

  update(id, data) {
    return prisma.product.update({ where: { id }, data });
  },

  decrementStock(id, quantity) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  },

  // Complex query: category sales aggregation (demonstrates joins + grouping,
  // satisfies "complex query endpoints" requirement)
  async topSellingByCategory() {
    return prisma.$queryRaw`
      SELECT c.name AS category, p.name AS product,
             SUM(oi.quantity) AS units_sold,
             SUM(oi.quantity * oi."unitPriceCents") AS revenue_cents
      FROM "OrderItem" oi
      JOIN "Product" p ON p.id = oi."productId"
      JOIN "Category" c ON c.id = p."categoryId"
      GROUP BY c.name, p.name
      ORDER BY revenue_cents DESC
      LIMIT 10;
    `;
  },
};
