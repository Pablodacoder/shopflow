// BUSINESS LOGIC LAYER
// Owns rules (pagination limits, cache keys, cache invalidation on writes).
// API routes call this, never the repository directly.

import { productRepository } from "../repositories/productRepository";
import { cache } from "../patterns/cache";
import { logger } from "../utils/logger";

const MAX_PAGE_SIZE = 50;

export const productService = {
  async list({ categorySlug, search, page = 1, pageSize = 20 }) {
    const take = Math.min(pageSize, MAX_PAGE_SIZE);
    const skip = (page - 1) * take;
    const cacheKey = `products:${categorySlug || "all"}:${search || ""}:${page}:${take}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info({ cacheKey }, "cache hit");
      return cached;
    }

    const [items, total] = await Promise.all([
      productRepository.findMany({ categorySlug, search, skip, take }),
      productRepository.count({ categorySlug, search }),
    ]);

    const result = { items, total, page, pageSize: take };
    cache.set(cacheKey, result, 60); // 60s TTL — catalog data is read-heavy, write-light
    return result;
  },

  async getById(id) {
    return productRepository.findById(id);
  },

  async create(data) {
    const product = await productRepository.create(data);
    cache.invalidatePrefix("products:");
    return product;
  },

  async updateStock(id, quantity) {
    const product = await productRepository.decrementStock(id, quantity);
    cache.invalidatePrefix("products:");

    if (product.stock < 5) {
      const { NotificationFactory } = await import("../patterns/notificationFactory");
      NotificationFactory.create("low_stock").send({ productId: id, stock: product.stock });
    }
    return product;
  },

  topSelling() {
    return productRepository.topSellingByCategory();
  },
};
