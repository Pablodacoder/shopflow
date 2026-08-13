"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../lib/context/CartContext";

export default function ProductsPage() {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  function handleAdd(product) {
    addItem(product, 1);
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1200);
  }

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
        Couldn&apos;t load products: {state.error}. <button onClick={() => location.reload()}>Retry</button>
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
            <p style={{ fontSize: 12, color: p.stock > 0 ? "#2a7a2a" : "#b00020" }}>
              {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
            </p>
            <button
              onClick={() => handleAdd(p)}
              disabled={p.stock === 0}
              style={{
                width: "100%",
                padding: "8px 0",
                marginTop: 8,
                background: justAdded === p.id ? "#2a7a2a" : "#111",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: p.stock === 0 ? "not-allowed" : "pointer",
                opacity: p.stock === 0 ? 0.5 : 1,
              }}
            >
              {justAdded === p.id ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
