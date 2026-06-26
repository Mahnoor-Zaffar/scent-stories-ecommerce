import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegionSync from "@/components/layout/RegionSync";
import { generateOrganizationJsonLd } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Scent & Stories | Luxury Perfume House",
    template: "%s | Scent & Stories",
  },
  description:
    "Discover luxury fragrances crafted with precision and narrative depth. Explore signature compositions, take our scent discovery quiz, and join the Private Reserve.",
  keywords: [
    "luxury perfume",
    "niche fragrance",
    "Scent and Stories",
    "extrait de parfum",
    "olfactory",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Scent & Stories",
    title: "Scent & Stories | Luxury Perfume House",
    description:
      "Luxury perfume house crafting olfactory narratives for the discerning collector.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <CartProvider>
          <Suspense fallback={null}>
            <RegionSync />
          </Suspense>
          <Header />
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
