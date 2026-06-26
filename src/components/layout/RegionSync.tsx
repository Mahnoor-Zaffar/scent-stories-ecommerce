"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { REGIONS } from "@/lib/geo-ip";
import { parseRegionCode } from "@/lib/cart-storage";

export default function RegionSync() {
  const searchParams = useSearchParams();
  const { setRegion } = useCart();

  useEffect(() => {
    const regionCode = parseRegionCode(searchParams.get("region"));
    if (regionCode) {
      setRegion(REGIONS[regionCode]);
    }
  }, [searchParams, setRegion]);

  return null;
}
