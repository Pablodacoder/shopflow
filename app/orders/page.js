"use client";

import { useEffect, useState } from "react";

const STATUS_COLORS = {
  PENDING: "#a67c00",
  PAID: "#1a6bb5",
  SHIPPED: "#6a3fb5",
  DELIVERED: "#2a7a2a",
  CANCELLED: "#b00020",
};

export default function OrdersPage() {
  const [state, setState] = useState({ orders: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.status === 401) {
          if (!cancelled) setState({ orders: [], loading: false, error: "unauthenticated" });
          return;
        }
        if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
        const data = await res.json();
        if (!cancelled) setState({ orders: data, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState({ orders: [], loading: false, error: err.message });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) return <p style={{ padding: 24 }}>Loading orders…</p>;

  if (state.error === "unauthenticated") {
    return (
      <main style={{ padding: 24 }}>
        <h1>My Orders</h1>
        <p>
          Please <a href="/login">log in</a> to see your orders.
        </p>
      </main>
    );
  }

  if (state.error) {
    return (
      <main style={{ padding: 24, color: "#b00020" }}>
        Couldn't load orders: {state.error}. <button onClick={() => location.reload()}>Retry</button>
      </main>
    );
  }

  if (state.orders.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h1>My Orders</h1>
      {state.orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Order {order.id.slice(0, 8)}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <span
              style={{
                color: STATUS_COLORS[order.status] || "#333",
                fontWeight: 600,
                fontSize: 13,
                alignSelf: "start",
              }}
            >
              {order.status}
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
                <span>${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right", fontWeight: 700, marginTop: 8 }}>
            ${(order.totalCents / 100).toFixed(2)}
          </div>
        </div>
      ))}
    </main>
  );
}
