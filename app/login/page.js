"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: null });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": getCsrfToken() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/products");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />
        </label>
        {status.error && <p style={{ color: "#b00020", fontSize: 14 }}>{status.error}</p>}
        <button type="submit" disabled={status.loading} style={buttonStyle}>
          {status.loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p style={{ fontSize: 14, marginTop: 12 }}>
        No account? <Link href="/register">Register</Link>
      </p>
    </main>
  );
}

const inputStyle = { display: "block", width: "100%", padding: 8, marginTop: 4, boxSizing: "border-box" };
const buttonStyle = { padding: 10, background: "#111", color: "#fff", border: "none", borderRadius: 6 };
