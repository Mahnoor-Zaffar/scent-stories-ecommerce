import type { Metadata } from "next";
import CheckoutPipeline from "@/components/checkout/CheckoutPipeline";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Scent & Stories purchase with express payment options.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPipeline />;
}
