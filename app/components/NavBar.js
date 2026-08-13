"use client";

import Link from "next/link";
import { useCart } from "../../lib/context/CartContext";

export default function NavBar() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #e5e5e5",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <Link href="/products" style={{ fontWeight: 700, fontSize: 18, textDecoration: "none", color: "#111" }}>
        ShopFlow
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/products" style={navLink}>Products</Link>
        <Link href="/orders" style={navLink}>My Orders</Link>
        <Link href="/cart" style={navLink}>Cart{count > 0 ? ` (${count})` : ""}</Link>
        <Link href="/admin" style={navLink}>Admin</Link>
        <Link href="/login" style={navLink}>Login</Link>
      </div>
    </nav>
  );
}

const navLink = { textDecoration: "none", color: "#333", fontSize: 14 };

