"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/products/obsidian-orchid", label: "Collection" },
  { href: "/quiz", label: "Discovery" },
  { href: "/private-reserve", label: "Private Reserve" },
  { href: "/checkout", label: "Checkout" },
];

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-cream/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="font-serif text-xl md:text-2xl text-cream tracking-wide">
          Scent <span className="text-gold">&</span> Stories
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-cream/70 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/checkout"
          className="relative text-xs uppercase tracking-[0.2em] text-cream/70 hover:text-gold transition-colors"
        >
          Bag
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-4 w-5 h-5 bg-gold text-obsidian text-[10px] rounded-full flex items-center justify-center font-medium">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
