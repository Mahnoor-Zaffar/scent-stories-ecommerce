"use client";

import { useState } from "react";
import Image from "next/image";
import type { CatalogItem } from "@/types/catalog";
import { useCart, useLocalizedPrice } from "@/context/CartContext";
import FragranceLifecycle from "./FragranceLifecycle";
import ScentDNAVisualizer from "./ScentDNAVisualizer";

interface ProductDetailProps {
  catalogItem: CatalogItem;
}

export default function ProductDetail({ catalogItem }: ProductDetailProps) {
  const { product, variants } = catalogItem;
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const { addItem } = useCart();
  const formattedPrice = useLocalizedPrice(selectedVariant.price);
  const formattedComparePrice = useLocalizedPrice(
    selectedVariant.compare_at_price ?? 0
  );

  const handleAddToCart = () => {
    addItem(product, selectedVariant);
  };

  return (
    <article>
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {product.hero_video_url ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={product.image_url}
          >
            <source src={product.hero_video_url} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
            {product.concentration}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-cream">
            {product.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 py-16 border-b border-cream/10">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image
              src={product.image_url}
              alt={`${product.title} bottle`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-6">
              {product.olfactory_family.map((family) => (
                <span
                  key={family}
                  className="px-3 py-1 text-xs uppercase tracking-widest border border-gold/30 text-gold/90"
                >
                  {family}
                </span>
              ))}
            </div>

            <p className="text-cream/80 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-cream/50 mb-3">
                Select Size
              </p>
              <div className="flex gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-3 text-sm border transition-colors ${
                      selectedVariant.id === variant.id
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-cream/20 text-cream/70 hover:border-cream/40"
                    }`}
                  >
                    {variant.size_ml}ml
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <span className="font-serif text-3xl text-cream">
                {formattedPrice}
              </span>
              {selectedVariant.compare_at_price && (
                <span className="text-cream/40 line-through text-lg">
                  {formattedComparePrice}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full md:w-auto px-12 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors"
            >
              Add to Collection
            </button>
          </div>
        </div>

        <FragranceLifecycle
          topNotes={product.top_notes}
          heartNotes={product.heart_notes}
          baseNotes={product.base_notes}
        />

        <ScentDNAVisualizer dna={product.scent_dna} />
      </div>
    </article>
  );
}

