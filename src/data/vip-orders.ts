import type { OrderRecord } from "@/types/catalog";

export const vipOrderHistory: OrderRecord[] = [
  {
    id: "ord-001",
    order_number: "SS-2026-004821",
    batch_number: "Batch No. 0420-26",
    product_title: "Obsidian Orchid",
    variant_sku: "SS-ORC-100",
    size_ml: 100,
    price: 295,
    currency: "USD",
    ordered_at: "2026-02-14T16:22:00Z",
    ingredient_sourcing: [
      {
        note: "Black Orchid",
        origin: "Papua New Guinea Highlands",
        harvest_season: "Late Monsoon",
        supplier: "Maison Terre Verte",
      },
      {
        note: "Oud",
        origin: "Assam, India",
        harvest_season: "Winter Distillation",
        supplier: "Atelier Oud Royal",
      },
      {
        note: "Turkish Rose",
        origin: "Isparta, Turkey",
        harvest_season: "May Harvest",
        supplier: "Rose Valley Collective",
      },
    ],
  },
  {
    id: "ord-002",
    order_number: "SS-2025-003156",
    batch_number: "Batch No. 0918-25",
    product_title: "Cedar & Silk",
    variant_sku: "SS-CED-50",
    size_ml: 50,
    price: 145,
    currency: "USD",
    ordered_at: "2025-11-03T11:05:00Z",
    ingredient_sourcing: [
      {
        note: "Virginia Cedar",
        origin: "Blue Ridge Mountains, USA",
        harvest_season: "Autumn Extraction",
        supplier: "Appalachian Aromatics",
      },
      {
        note: "Iris Butter",
        origin: "Tuscany, Italy",
        harvest_season: "Three Year Cure",
        supplier: "Orris Atelier Firenze",
      },
    ],
  },
  {
    id: "ord-003",
    order_number: "SS-2025-002890",
    batch_number: "Batch No. 0612-25",
    product_title: "Amber Meridian",
    variant_sku: "SS-AMB-100",
    size_ml: 100,
    price: 275,
    currency: "USD",
    ordered_at: "2025-08-20T09:45:00Z",
    ingredient_sourcing: [
      {
        note: "Indonesian Patchouli",
        origin: "Sulawesi, Indonesia",
        harvest_season: "Dry Season",
        supplier: "Island Spice Guild",
      },
      {
        note: "Labdanum",
        origin: "Crete, Greece",
        harvest_season: "Summer Collection",
        supplier: "Mediterranean Resin Co.",
      },
    ],
  },
];
