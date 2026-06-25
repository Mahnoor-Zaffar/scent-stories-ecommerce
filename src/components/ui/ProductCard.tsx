import Link from "next/link";
import Image from "next/image";
import type { CatalogItem } from "@/types/catalog";

interface ProductCardProps {
  item: CatalogItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const { product, variants } = item;
  const lowestPrice = Math.min(...variants.map((v) => v.price));

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-4">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-obsidian/0 transition-colors duration-500" />
      </div>
      <p className="text-xs uppercase tracking-widest text-gold/80 mb-1">
        {product.concentration}
      </p>
      <h3 className="font-serif text-xl text-cream group-hover:text-gold transition-colors">
        {product.title}
      </h3>
      <p className="text-sm text-cream/50 mt-1">
        From ${lowestPrice}
      </p>
    </Link>
  );
}
