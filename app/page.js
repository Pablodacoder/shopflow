import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "15px" }}>
          Welcome to ShopFlow
        </h1>

        <p
          style={{
            fontSize: "20px",
            maxWidth: "600px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >
          Discover products, manage your cart, and enjoy a simple online
          shopping experience.
        </p>

        <Link
          href="/products"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "14px 28px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          Shop Now
        </Link>
      </section>

      <section
        style={{
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "32px", marginBottom: "30px" }}>
          Why Shop With Us?
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "250px" }}>
            <h3>Easy Shopping</h3>
            <p>Browse products and add your favorites to your cart.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>Simple Checkout</h3>
            <p>Complete your order with a quick and easy checkout process.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>Order Tracking</h3>
            <p>View your previous orders from your account.</p>
          </div>
        </div>
      </section>
    </main>
  );
}