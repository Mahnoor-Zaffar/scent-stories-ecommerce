import { catalog } from "@/data/catalog";
import type { CartLineItem } from "@/types/catalog";
import type { RegionCode } from "@/lib/geo-ip";
import { REGIONS } from "@/lib/geo-ip";

const STORAGE_KEY = "scent-stories-cart";

export interface PersistedCart {
  items: { variantId: string; quantity: number }[];
  regionCode: RegionCode;
  customerEmail: string;
  customerPhone: string;
}

export function loadPersistedCart(): PersistedCart | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedCart;
    if (!parsed.items || !Array.isArray(parsed.items)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedCart(data: PersistedCart): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable in private browsing
  }
}

export function clearPersistedCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function resolveCartLineItems(
  persistedItems: { variantId: string; quantity: number }[]
): CartLineItem[] {
  const lineItems: CartLineItem[] = [];

  for (const { variantId, quantity } of persistedItems) {
    if (quantity <= 0) continue;

    for (const entry of catalog) {
      const variant = entry.variants.find((v) => v.id === variantId);
      if (variant) {
        lineItems.push({
          product: entry.product,
          variant,
          quantity,
        });
        break;
      }
    }
  }

  return lineItems;
}

export function parseRegionCode(value: string | null): RegionCode | null {
  if (!value) return null;
  const upper = value.toUpperCase();
  if (upper in REGIONS) {
    return upper as RegionCode;
  }
  return null;
}
