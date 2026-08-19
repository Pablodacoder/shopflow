"use client";

import { useEffect, useState } from "react";

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ sku: "", name: "", description: "", priceCents: "", stock: "", categoryId: "", imageUrl: "" });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    fetch("/api/metrics").then((r) => r.json()).then(setMetrics).catch(() => {});
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": getCsrfToken() },
        body: JSON.stringify({
          ...form,
          priceCents: Number(form.priceCents),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(res.status === 403 ? "Admin access required." : data.error || "Failed to create product");
      }
      setStatus({ loading: false, error: null, success: `Created "${data.name}"` });
      setForm({ sku: "", name: "", description: "", priceCents: "", stock: "", categoryId: "", imageUrl: "" });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 600 }}>
      <h1>Admin</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16 }}>Live metrics</h2>
        {metrics ? (
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 6, fontSize: 13 }}>
            {JSON.stringify(metrics, null, 2)}
          </pre>
        ) : (
          <p>Loading…</p>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 16 }}>Add product</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input placeholder="SKU" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} style={inputStyle} />
          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
          <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} style={inputStyle} />
          <input placeholder="Price (cents)" type="number" required value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: e.target.value })} style={inputStyle} />
          <input placeholder="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle} />
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
            <option value="">Select category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {status.error && <p style={{ color: "#b00020", fontSize: 14 }}>{status.error}</p>}
          {status.success && <p style={{ color: "#2a7a2a", fontSize: 14 }}>{status.success}</p>}
          <button type="submit" disabled={status.loading} style={buttonStyle}>
            {status.loading ? "Saving…" : "Create product"}
          </button>
        </form>
      </section>
    </main>
  );
}

const inputStyle = { display: "block", width: "100%", padding: 8, boxSizing: "border-box" };
const buttonStyle = { padding: 10, background: "#111", color: "#fff", border: "none", borderRadius: 6 };