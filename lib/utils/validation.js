// Input validation & sanitization (Security requirement).
// Zod enforces shape/type/length server-side; DOMPurify strips any HTML from
// free-text fields to mitigate stored XSS before it ever reaches the DB.

import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(100),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(72),
});

export const productSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  priceCents: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().uuid(),
  imageUrl: z.string().url().max(2048).optional().or(z.literal("")),
});

export const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(999),
      })
    )
    .min(1),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});

export function sanitize(text) {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}
