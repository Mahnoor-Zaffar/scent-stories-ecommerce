import type { Metadata } from "next";
import PrivateReserveDashboard from "@/components/vip/PrivateReserveDashboard";

export const metadata: Metadata = {
  title: "Private Reserve",
  description:
    "VIP member portal featuring historical archives, batch traceability, and private fragrance consultations.",
  robots: { index: false, follow: false },
};

export default function PrivateReservePage() {
  return <PrivateReserveDashboard />;
}
