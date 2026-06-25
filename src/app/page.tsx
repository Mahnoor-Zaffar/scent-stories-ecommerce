import Link from "next/link";
import Image from "next/image";
import { catalog } from "@/data/catalog";
import ProductCard from "@/components/ui/ProductCard";

export default function HomePage() {
  const heroProduct = catalog[0].product;

  return (
    <>
      <section className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden">
        <Image
          src={heroProduct.image_url}
          alt="Scent and Stories hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 px-6 text-center">
          <p className="text-gold text-xs uppercase tracking-[0.4em] mb-4">
            Luxury Perfume House
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-cream text-balance max-w-3xl">
            Every Scent Tells a Story
          </h1>
          <p className="text-cream/70 mt-6 max-w-lg text-lg leading-relaxed">
            Handcrafted compositions that bridge memory, emotion, and the art
            of perfumery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/products/obsidian-orchid"
              className="px-10 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
            >
              Explore Collection
            </Link>
            <Link
              href="/quiz"
              className="px-10 py-4 border border-cream/30 text-cream text-sm uppercase tracking-[0.2em] hover:border-cream/60 transition-colors"
            >
              Find Your Scent
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="text-center mb-16">
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
            Signature Collection
          </p>
          <h2 className="font-serif text-4xl text-cream">
            Curated Compositions
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {catalog.map((item) => (
            <ProductCard key={item.product.id} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-obsidian-50 border-y border-cream/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
              Guided Discovery
            </p>
            <h2 className="font-serif text-4xl text-cream mb-6">
              Not Sure Where to Begin?
            </h2>
            <p className="text-cream/70 leading-relaxed mb-8">
              Our interactive scent quiz analyzes your mood, setting, and
              ingredient preferences to recommend your perfect signature
              fragrance.
            </p>
            <Link
              href="/quiz"
              className="inline-block px-10 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
            >
              Take the Quiz
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={catalog[1].product.image_url}
              alt="Discovery quiz"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
