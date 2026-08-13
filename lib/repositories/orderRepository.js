import { prisma } from "../patterns/db";

export const orderRepository = {
  create({ userId, items, totalCents }) {
    return prisma.order.create({
      data: {
        userId,
        totalCents,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPriceCents: i.unitPriceCents,
          })),
        },
      },
      include: { items: true },
    });
  },

  findByUser(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true },
    });
  },

  updateStatus(id, status) {
    return prisma.order.update({ where: { id }, data: { status } });
  },

  // Complex query: revenue per day for the last 30 days
  revenueByDay() {
    return prisma.$queryRaw`
      SELECT DATE("createdAt") AS day, SUM("totalCents") AS revenue_cents, COUNT(*) AS order_count
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days' AND status != 'CANCELLED'
      GROUP BY DATE("createdAt")
      ORDER BY day DESC;
    `;
  },
};
