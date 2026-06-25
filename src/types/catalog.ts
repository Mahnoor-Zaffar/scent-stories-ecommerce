export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  concentration:
    | "Extrait de Parfum"
    | "Eau de Parfum"
    | "Eau de Toilette"
    | "Cologne";
  olfactory_family: (
    | "Woody"
    | "Oriental"
    | "Floral"
    | "Citrus"
    | "Chypre"
    | "Fougère"
  )[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  created_at: string;
  image_url: string;
  hero_video_url?: string;
  scent_dna: ScentDNA;
}

export interface ScentDNA {
  woody: number;
  floral: number;
  oriental: number;
  citrus: number;
  chypre: number;
  fougere: number;
  longevity: number;
  sillage: number;
}

export interface Variant {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  size_ml: number;
  weight_g: number;
}

export interface CatalogItem {
  product: Product;
  variants: Variant[];
}

export interface CartLineItem {
  variant: Variant;
  product: Product;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  batch_number: string;
  product_title: string;
  variant_sku: string;
  size_ml: number;
  price: number;
  currency: string;
  ordered_at: string;
  ingredient_sourcing: IngredientSourcing[];
}

export interface IngredientSourcing {
  note: string;
  origin: string;
  harvest_season: string;
  supplier: string;
}

export interface ConsultationSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}
