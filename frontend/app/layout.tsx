import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: { default: "JAHM Studio — Just A Handmade Magic", template: "%s | JAHM Studio" },
  description:
    "Hand-painted art decks, lanterns, trays and planters, made by hand in Pakistan. One-of-a-kind décor and gifts, delivered nationwide with cash on delivery.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
