export type RegionCode = "US" | "GB" | "EU" | "JP" | "AE";

export interface GeoRegion {
  code: RegionCode;
  currency: string;
  currencySymbol: string;
  locale: string;
  dutyRate: number;
  shippingRate: number;
  shippingLabel: string;
}

const REGIONS: Record<RegionCode, GeoRegion> = {
  US: {
    code: "US",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    dutyRate: 0,
    shippingRate: 12,
    shippingLabel: "Express Domestic (2-3 days)",
  },
  GB: {
    code: "GB",
    currency: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    dutyRate: 0.2,
    shippingRate: 18,
    shippingLabel: "Royal Mail International Priority",
  },
  EU: {
    code: "EU",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    dutyRate: 0.19,
    shippingRate: 22,
    shippingLabel: "EU Tracked Delivery (4-6 days)",
  },
  JP: {
    code: "JP",
    currency: "JPY",
    currencySymbol: "¥",
    locale: "ja-JP",
    dutyRate: 0.1,
    shippingRate: 28,
    shippingLabel: "Japan Express Courier",
  },
  AE: {
    code: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    locale: "ar-AE",
    dutyRate: 0.05,
    shippingRate: 25,
    shippingLabel: "Gulf Premium Shipping",
  },
};

const EXCHANGE_RATES: Record<RegionCode, number> = {
  US: 1,
  GB: 0.79,
  EU: 0.92,
  JP: 149.5,
  AE: 3.67,
};

export function detectRegionFromHeaders(
  acceptLanguage?: string | null,
  mockRegion?: string | null
): GeoRegion {
  if (mockRegion && mockRegion in REGIONS) {
    return REGIONS[mockRegion as RegionCode];
  }

  if (acceptLanguage) {
    if (acceptLanguage.includes("ja")) return REGIONS.JP;
    if (acceptLanguage.includes("ar")) return REGIONS.AE;
    if (acceptLanguage.includes("de") || acceptLanguage.includes("fr"))
      return REGIONS.EU;
    if (acceptLanguage.includes("en-GB")) return REGIONS.GB;
  }

  return REGIONS.US;
}

export function convertPrice(usdAmount: number, region: GeoRegion): number {
  const rate = EXCHANGE_RATES[region.code];
  if (region.code === "JP") {
    return Math.round(usdAmount * rate);
  }
  return Math.round(usdAmount * rate * 100) / 100;
}

export function formatCurrency(amount: number, region: GeoRegion): string {
  return new Intl.NumberFormat(region.locale, {
    style: "currency",
    currency: region.currency,
    minimumFractionDigits: region.code === "JP" ? 0 : 2,
  }).format(amount);
}

export function calculateOrderTotals(
  subtotalUsd: number,
  region: GeoRegion
): {
  subtotal: number;
  duties: number;
  shipping: number;
  total: number;
} {
  const subtotal = convertPrice(subtotalUsd, region);
  const duties = Math.round(subtotal * region.dutyRate * 100) / 100;
  const shipping = convertPrice(region.shippingRate, region);
  const total = Math.round((subtotal + duties + shipping) * 100) / 100;
  return { subtotal, duties, shipping, total };
}

export { REGIONS };
