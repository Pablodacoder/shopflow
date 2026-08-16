import { describe, it, expect } from "vitest";
import { cache } from "../lib/patterns/cache";
import { NotificationFactory } from "../lib/patterns/notificationFactory";

describe("CacheService (Singleton)", () => {
  it("returns the same instance on repeated import", async () => {
    const { cache: cache2 } = await import("../lib/patterns/cache");
    expect(cache).toBe(cache2);
  });

  it("stores and retrieves a value", () => {
    cache.set("test:key", { hello: "world" });
    expect(cache.get("test:key")).toEqual({ hello: "world" });
  });

  it("invalidates keys by prefix", () => {
    cache.set("products:1", "a");
    cache.set("products:2", "b");
    cache.set("orders:1", "c");
    cache.invalidatePrefix("products:");
    expect(cache.get("products:1")).toBeUndefined();
    expect(cache.get("orders:1")).toBe("c");
  });
});

describe("NotificationFactory (Factory)", () => {
  it("creates distinct notification types", () => {
    const email = NotificationFactory.create("email");
    const orderStatus = NotificationFactory.create("order_status");
    expect(email.constructor.name).not.toBe(orderStatus.constructor.name);
  });

  it("throws on an unknown notification type", () => {
    expect(() => NotificationFactory.create("carrier_pigeon")).toThrow();
  });
});
