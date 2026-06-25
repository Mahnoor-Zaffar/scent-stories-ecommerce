import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="font-serif text-2xl text-cream mb-4">
              Scent <span className="text-gold">&</span> Stories
            </p>
            <p className="text-cream/50 text-sm leading-relaxed">
              Luxury perfume house crafting olfactory narratives for the
              discerning collector.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">
              Explore
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/quiz" className="text-sm text-cream/60 hover:text-gold transition-colors">
                  Scent Discovery Quiz
                </Link>
              </li>
              <li>
                <Link href="/private-reserve" className="text-sm text-cream/60 hover:text-gold transition-colors">
                  Private Reserve
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-cream/60 hover:text-gold transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">
              Contact
            </p>
            <p className="text-sm text-cream/60">concierge@scentandstories.com</p>
            <p className="text-sm text-cream/60 mt-1">+1 (888) 726-8368</p>
          </div>
        </div>
        <p className="text-center text-xs text-cream/30 mt-12">
          &copy; {new Date().getFullYear()} Scent & Stories. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
