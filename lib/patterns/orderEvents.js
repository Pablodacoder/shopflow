// OBSERVER PATTERN
// OrderEventEmitter lets multiple independent subscribers (inventory update,
// customer notification, analytics) react to an order status change without
// the order service knowing anything about them. Decouples business logic
// from side effects.

import { EventEmitter } from "events";
import { NotificationFactory } from "./notificationFactory";
import { logger } from "../utils/logger";

class OrderEventEmitter extends EventEmitter {}

export const orderEvents = new OrderEventEmitter();

// Subscriber 1: notify the customer
orderEvents.on("statusChanged", ({ orderId, status }) => {
  const notifier = NotificationFactory.create("order_status");
  notifier.send({ orderId, status });
});

// Subscriber 2: analytics / audit trail
orderEvents.on("statusChanged", ({ orderId, status, userId }) => {
  logger.info({ event: "audit_log", orderId, status, userId }, "Order status audit entry");
});

// Subscriber 3: cache invalidation so stale order lists aren't served
orderEvents.on("statusChanged", async () => {
  const { cache } = await import("./cache");
  cache.invalidatePrefix("orders:");
});
