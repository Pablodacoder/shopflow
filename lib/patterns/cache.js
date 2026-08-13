// SINGLETON PATTERN
// One shared cache instance for the whole process. Interface is intentionally
// minimal (get/set/del) so the in-memory NodeCache implementation can be swapped
// for a Redis client later without touching any calling code.

import NodeCache from "node-cache";

class CacheService {
  static #instance;

  constructor() {
    if (CacheService.#instance) {
      return CacheService.#instance;
    }
    // stdTTL: default 60s expiry, checkperiod: cleanup sweep interval
    this.store = new NodeCache({ stdTTL: 60, checkperiod: 90 });
    CacheService.#instance = this;
  }

  get(key) {
    return this.store.get(key);
  }

  set(key, value, ttlSeconds) {
    return this.store.set(key, value, ttlSeconds ?? 60);
  }

  del(key) {
    return this.store.del(key);
  }

  // Invalidate all keys matching a prefix (e.g. "products:" after a write)
  invalidatePrefix(prefix) {
    const keys = this.store.keys().filter((k) => k.startsWith(prefix));
    this.store.del(keys);
  }
}

export const cache = new CacheService();
