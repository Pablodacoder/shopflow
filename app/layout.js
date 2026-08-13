export const metadata = { title: "ShopFlow", description: "CISC 3140 e-commerce project" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
