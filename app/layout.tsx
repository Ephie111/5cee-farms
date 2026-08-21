import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import WhatsAppButton from "@/components/WhatsAppButton";

// Display face: Sora — sturdy, geometric, confident (used for headings only)
const displayFont = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

// Body face: Inter — clean, highly legible at small sizes
const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-sans",
});

export const metadata: Metadata = {
  title: "5CEE Farms Ltd | Chiso Foods — Fresh. Clean. Trusted.",
  description:
    "5CEE Farms Ltd, home of Chiso Foods: a family-owned agro-allied company in Ifite, Awka South LGA, Anambra State, producing clean, nutritious, responsibly raised poultry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}