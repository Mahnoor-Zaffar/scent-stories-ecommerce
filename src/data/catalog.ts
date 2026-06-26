import type { CatalogItem } from "@/types/catalog";

export const catalog: CatalogItem[] = [
  {
    product: {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      title: "Obsidian Orchid",
      handle: "obsidian-orchid",
      description:
        "A nocturnal bloom captured in liquid form. Obsidian Orchid unfolds with the electric brightness of blackcurrant bud and saffron, descending into a heart of velvet orchid and Turkish rose absolute. The base lingers with oud, sandalwood, and a whisper of vanilla resin. Crafted for those who command silence and leave an unforgettable trace.",
      concentration: "Extrait de Parfum",
      olfactory_family: ["Oriental", "Floral", "Woody"],
      top_notes: ["Blackcurrant Bud", "Saffron", "Pink Pepper"],
      heart_notes: ["Black Orchid", "Turkish Rose", "Jasmine Sambac"],
      base_notes: ["Oud", "Sandalwood", "Vanilla Resin"],
      created_at: "2025-11-15T10:00:00Z",
      image_url: "/images/obsidian-orchid.jpg",
      hero_video_url:
        "https://assets.mixkit.co/videos/preview/mixkit-pouring-a-glass-of-red-wine-2356-large.mp4",
      scent_dna: {
        woody: 72,
        floral: 85,
        oriental: 90,
        citrus: 25,
        chypre: 40,
        fougere: 15,
        longevity: 92,
        sillage: 88,
      },
    },
    variants: [
      {
        id: "v1-obs-50",
        product_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        sku: "SS-ORC-50",
        price: 185,
        compare_at_price: null,
        inventory_quantity: 42,
        size_ml: 50,
        weight_g: 120,
      },
      {
        id: "v1-obs-100",
        product_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        sku: "SS-ORC-100",
        price: 295,
        compare_at_price: 320,
        inventory_quantity: 28,
        size_ml: 100,
        weight_g: 210,
      },
    ],
  },
  {
    product: {
      id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      title: "Cedar & Silk",
      handle: "cedar-and-silk",
      description:
        "An architectural fragrance built on contrast. Cedar & Silk opens with crisp bergamot and green fig leaf, settling into a heart of iris butter and white tea. Virginia cedar and white musk form a foundation that feels both tailored and intimate. Designed for the modern connoisseur who values precision over excess.",
      concentration: "Eau de Parfum",
      olfactory_family: ["Woody", "Citrus", "Fougère"],
      top_notes: ["Bergamot", "Green Fig Leaf", "Cardamom"],
      heart_notes: ["Iris Butter", "White Tea", "Lavender"],
      base_notes: ["Virginia Cedar", "White Musk", "Vetiver"],
      created_at: "2025-09-22T14:30:00Z",
      image_url: "/images/cedar-and-silk.jpg",
      scent_dna: {
        woody: 88,
        floral: 45,
        oriental: 30,
        citrus: 70,
        chypre: 55,
        fougere: 75,
        longevity: 78,
        sillage: 65,
      },
    },
    variants: [
      {
        id: "v2-ced-50",
        product_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        sku: "SS-CED-50",
        price: 145,
        compare_at_price: null,
        inventory_quantity: 67,
        size_ml: 50,
        weight_g: 115,
      },
      {
        id: "v2-ced-100",
        product_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        sku: "SS-CED-100",
        price: 225,
        compare_at_price: null,
        inventory_quantity: 35,
        size_ml: 100,
        weight_g: 205,
      },
    ],
  },
  {
    product: {
      id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
      title: "Amber Meridian",
      handle: "amber-meridian",
      description:
        "A journey along the spice routes rendered in golden light. Amber Meridian begins with sun-warmed mandarin and ginger root, revealing a heart of benzoin and labdanum wrapped in honeyed tobacco. The base anchors with ambergris accord and patchouli from Indonesia. A fragrance for evenings when time slows and stories deepen.",
      concentration: "Extrait de Parfum",
      olfactory_family: ["Oriental", "Woody", "Chypre"],
      top_notes: ["Mandarin", "Ginger Root", "Neroli"],
      heart_notes: ["Benzoin", "Labdanum", "Honeyed Tobacco"],
      base_notes: ["Ambergris Accord", "Indonesian Patchouli", "Tonka Bean"],
      created_at: "2026-01-08T09:00:00Z",
      image_url: "/images/amber-meridian.jpg",
      scent_dna: {
        woody: 68,
        floral: 35,
        oriental: 95,
        citrus: 55,
        chypre: 70,
        fougere: 20,
        longevity: 85,
        sillage: 80,
      },
    },
    variants: [
      {
        id: "v3-amb-50",
        product_id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
        sku: "SS-AMB-50",
        price: 175,
        compare_at_price: 195,
        inventory_quantity: 51,
        size_ml: 50,
        weight_g: 118,
      },
      {
        id: "v3-amb-100",
        product_id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
        sku: "SS-AMB-100",
        price: 275,
        compare_at_price: null,
        inventory_quantity: 19,
        size_ml: 100,
        weight_g: 208,
      },
    ],
  },
];

export function getProductByHandle(handle: string): CatalogItem | undefined {
  return catalog.find((item) => item.product.handle === handle);
}

export function getAllProductHandles(): string[] {
  return catalog.map((item) => item.product.handle);
}
