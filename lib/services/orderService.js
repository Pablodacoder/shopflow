import { prisma } from "../patterns/db";
import { orderRepository } from "../repositories/orderRepository";
import { productRepository } from "../repositories/productRepository";
import { orderEvents } from "../patterns/orderEvents";
import { logger } from "../utils/logger";

export const orderService = {
  // Wrapped in a DB transaction: stock checks + decrements + order creation
  // either all succeed or all roll back. Prevents overselling under concurrency.
  async placeOrder(userId, items) {
    return prisma.$transaction(async (tx) => {
      let totalCents = 0;
      const lineItems = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
        if (product.stock < item.quantity) {
          throw Object.assign(new Error(`Insufficient stock for ${product.name}`), { status: 409 });
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        totalCents += product.priceCents * item.quantity;
        lineItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPriceCents: product.priceCents,
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalCents,
          items: { create: lineItems },
        },
        include: { items: true },
      });

      logger.info({ orderId: order.id, userId, totalCents }, "order placed");
      return order;
    });
  },

  getUserOrders(userId) {
    return orderRepository.findByUser(userId);
  },

  async updateStatus(orderId, status, userId) {
    const order = await orderRepository.updateStatus(orderId, status);
    // OBSERVER PATTERN: emit event, subscribers (notification, audit, cache) react independently
    orderEvents.emit("statusChanged", { orderId, status, userId });
    return order;
  },
};
