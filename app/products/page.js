"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../lib/context/CartContext";

export default function ProductsPage() {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  const filteredItems = state.items.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <main style={{ padding: 24 }}>
      <h1>Products</h1>
      <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: 10,
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {filteredItems.map((p) => (
          <div key={p.id} style={{ border: "1px solid #e2e2e2", borderRadius: 8, overflow: "hidden" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{
                  display: p.imageUrl ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  color: "#bbb",
                  fontSize: 13,
                }}
              >
                No image
              </div>
            </div>
            <div style={{ padding: 16 }}>
            <h3 style={{ margin: "0 0 8px" }}>{p.name}</h3>
            <p style={{ color: "#666", fontSize: 14 }}>{p.category?.name}</p>
            <p style={{ fontWeight: 600 }}>${(p.priceCents / 100).toFixed(2)}</p>
            <p
              style={{
                fontSize: 12,
                color: p.stock === 0 ? "#b00020" : p.stock <= 5 ? "#d97706" : "#2a7a2a",
              }}
            >
              {p.stock === 0
                ? "Out of stock"
                : p.stock <= 5
                ? `Low stock: Only ${p.stock} left`
                : `${p.stock} in stock`}
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
          </div>
        ))}
      </div>
    </main>
  );
}
