"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [state, setState] = useState({ items: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data = await res.json();
        if (!cancelled) setState({ items: data.items, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState({ items: [], loading: false, error: err.message });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) return <p style={{ padding: 24 }}>Loading products…</p>;
  if (state.error)
    return (
      <div style={{ padding: 24, color: "#b00020" }}>
        Couldn't load products: {state.error}. <button onClick={() => location.reload()}>Retry</button>
      </div>
    );
  if (state.items.length === 0) return <p style={{ padding: 24 }}>No products found.</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Products</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {state.items.map((p) => (
          <div key={p.id} style={{ border: "1px solid #e2e2e2", borderRadius: 8, padding: 16 }}>
            <h3 style={{ margin: "0 0 8px" }}>{p.name}</h3>
            <p style={{ color: "#666", fontSize: 14 }}>{p.category?.name}</p>
            <p style={{ fontWeight: 600 }}>${(p.priceCents / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
