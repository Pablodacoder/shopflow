import { CartProvider } from "../lib/context/CartContext";
import NavBar from "./components/NavBar";
import CsrfBootstrap from "./components/CsrfBootstrap";
import Footer from "./components/Footer";

export const metadata = { title: "ShopFlow", description: "CISC 3140 e-commerce project" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0,
                     fontFamily: "system-ui, sans-serif",
                     color: "#1a1a1a",
                     minHeight: "100vh",
                     display: "flex",
                     flexDirection: "column",
                     }}>
        <CartProvider>
          <CsrfBootstrap />
          <NavBar />
          <main style={{ flex: 1 }}>    
          {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
