"use client";
// App-level error boundary — comprehensive error handling requirement.
// Catches render errors anywhere in the tree below and shows a recoverable UI
// instead of a blank white screen.

export default function GlobalError({ error, reset }) {
  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Something went wrong</h2>
      <p style={{ color: "#666" }}>{error?.message || "An unexpected error occurred."}</p>
      <button onClick={() => reset()} style={{ padding: "8px 16px", marginTop: 12 }}>
        Try again
      </button>
    </div>
  );
}
