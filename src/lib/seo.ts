import type { Product } from "@/types/catalog";

export function generateProductJsonLd(
  product: Product,
  price: number,
  currency = "USD"
): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.handle,
    brand: {
      "@type": "Brand",
      name: "Scent & Stories",
    },
    category: product.olfactory_family.join(", "),
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Scent & Stories",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Concentration",
        value: product.concentration,
      },
      {
        "@type": "PropertyValue",
        name: "Top Notes",
        value: product.top_notes.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Heart Notes",
        value: product.heart_notes.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Base Notes",
        value: product.base_notes.join(", "),
      },
    ],
  };
}

export function generateOrganizationJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Scent & Stories",
    url: "https://scentandstories.com",
    logo: "https://scentandstories.com/logo.png",
    description:
      "Luxury perfume house crafting olfactory narratives for the discerning collector.",
    sameAs: [
      "https://instagram.com/scentandstories",
      "https://pinterest.com/scentandstories",
    ],
  };
}
