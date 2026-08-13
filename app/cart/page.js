"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../lib/context/CartContext";

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents, clearCart } = useCart();
  const [status, setStatus] = useState({ loading: false, error: null });
  const router = useRouter();

  async function handleCheckout() {
    setStatus({ loading: true, error: null });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": getCsrfToken() },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clearCart();
      router.push("/orders");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
      return;
    }
    setStatus({ loading: false, error: null });
  }

  if (items.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1>Cart</h1>
      {items.map((item) => (
        <div
          key={item.productId}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ color: "#666", fontSize: 14 }}>${(item.priceCents / 100).toFixed(2)} each</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              style={{ width: 56, padding: 4 }}
              aria-label={`Quantity for ${item.name}`}
            />
            <button onClick={() => removeItem(item.productId)} style={{ color: "#b00020", background: "none", border: "none", cursor: "pointer" }}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontWeight: 700 }}>
        <span>Total</span>
        <span>${(totalCents / 100).toFixed(2)}</span>
      </div>

      {status.error && <p style={{ color: "#b00020" }}>{status.error}</p>}

      <button
        onClick={handleCheckout}
        disabled={status.loading}
        style={{ width: "100%", padding: 12, background: "#111", color: "#fff", border: "none", borderRadius: 6 }}
      >
        {status.loading ? "Placing order…" : "Checkout"}
      </button>
    </main>
  );
}
