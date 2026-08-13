// FACTORY PATTERN
// Centralizes creation of different notification types so calling code never
// branches on "if type === ...". New channels (SMS, push) plug in by adding
// one class + one case, with no changes needed at call sites.

import { logger } from "../utils/logger";

class EmailNotification {
  send(payload) {
    // Stub: swap for a real provider (SendGrid, SES) in production
    logger.info({ channel: "email", to: payload.to }, `Email queued: ${payload.subject}`);
  }
}

class OrderStatusNotification {
  send(payload) {
    logger.info(
      { channel: "order_status", orderId: payload.orderId, status: payload.status },
      `Order ${payload.orderId} status changed to ${payload.status}`
    );
  }
}

class LowStockNotification {
  send(payload) {
    logger.warn(
      { channel: "low_stock", productId: payload.productId, stock: payload.stock },
      `Low stock alert for product ${payload.productId}`
    );
  }
}

export class NotificationFactory {
  static create(type) {
    switch (type) {
      case "email":
        return new EmailNotification();
      case "order_status":
        return new OrderStatusNotification();
      case "low_stock":
        return new LowStockNotification();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}
