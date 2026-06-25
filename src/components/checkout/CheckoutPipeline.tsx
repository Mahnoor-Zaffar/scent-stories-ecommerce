"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart, useLocalizedPrice } from "@/context/CartContext";
import { formatCurrency } from "@/lib/geo-ip";
import { processPostPurchasePipeline } from "@/lib/webhooks";
import type { WebhookResult } from "@/lib/webhooks";
import { REGIONS, type RegionCode } from "@/lib/geo-ip";

export default function CheckoutPipeline() {
  const {
    state,
    removeItem,
    updateQuantity,
    setRegion,
    setCheckoutStep,
    setCustomer,
    setOrderNumber,
    clearCart,
    itemCount,
    totals,
  } = useCart();

  const [email, setEmail] = useState(state.customerEmail);
  const [phone, setPhone] = useState(state.customerPhone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [webhookResults, setWebhookResults] = useState<WebhookResult[]>([]);

  const region = state.region;

  if (state.checkoutStep === "confirmation" && state.orderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">
          Order Confirmed
        </p>
        <h1 className="font-serif text-4xl text-cream mb-4">Thank You</h1>
        <p className="text-cream/70 mb-2">
          Order {state.orderNumber} has been placed successfully.
        </p>
        <p className="text-cream/50 text-sm mb-10">
          Fulfillment webhooks and SMS alerts have been dispatched.
        </p>

        {webhookResults.length > 0 && (
          <div className="text-left border border-cream/10 p-6 mb-10">
            <p className="text-xs uppercase tracking-widest text-cream/50 mb-4">
              Webhook Events
            </p>
            {webhookResults.map((result) => (
              <div
                key={result.webhookId}
                className="py-3 border-b border-cream/5 last:border-0"
              >
                <p className="text-sm text-cream">
                  {result.payload.event}{" "}
                  <span className="text-gold">{result.webhookId}</span>
                </p>
                <p className="text-xs text-cream/40 mt-1">
                  SMS: {result.smsSent ? "Sent" : "N/A"} · Email:{" "}
                  {result.emailTriggered ? "Triggered" : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            clearCart();
            setWebhookResults([]);
          }}
          className="px-10 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-cream mb-2">Checkout</h1>
      <p className="text-cream/50 mb-10">
        {itemCount} {itemCount === 1 ? "item" : "items"} in your collection
      </p>

      <div className="mb-10">
        <label htmlFor="region-select" className="text-xs uppercase tracking-widest text-cream/50 block mb-2">
          Shipping Region
        </label>
        <select
          id="region-select"
          value={region.code}
          onChange={(e) => setRegion(REGIONS[e.target.value as RegionCode])}
          className="bg-obsidian-50 border border-cream/20 text-cream px-4 py-2 text-sm"
        >
          {(Object.keys(REGIONS) as RegionCode[]).map((code) => (
            <option key={code} value={code}>
              {code} ({REGIONS[code].currency})
            </option>
          ))}
        </select>
        <p className="text-xs text-cream/40 mt-2">{region.shippingLabel}</p>
      </div>

      {state.items.length === 0 ? (
        <p className="text-cream/60 text-center py-20">
          Your collection is empty. Explore our fragrances to begin.
        </p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <CartLine
                key={item.variant.id}
                item={item}
                onRemove={() => removeItem(item.variant.id)}
                onUpdateQuantity={(qty) =>
                  updateQuantity(item.variant.id, qty)
                }
              />
            ))}

            {state.checkoutStep === "cart" && (
              <button
                type="button"
                onClick={() => setCheckoutStep("shipping")}
                className="w-full py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
              >
                Proceed to Shipping
              </button>
            )}

            {state.checkoutStep === "shipping" && (
              <div className="border border-cream/10 p-6 space-y-4">
                <h2 className="font-serif text-xl text-cream">
                  Contact Details
                </h2>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-50 border border-cream/20 px-4 py-3 text-cream text-sm placeholder:text-cream/30"
                />
                <input
                  type="tel"
                  placeholder="Phone number (for SMS updates)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-obsidian-50 border border-cream/20 px-4 py-3 text-cream text-sm placeholder:text-cream/30"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomer(email, phone);
                    setCheckoutStep("payment");
                  }}
                  disabled={!email}
                  className="w-full py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors disabled:opacity-40"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {state.checkoutStep === "payment" && (
              <div className="border border-cream/10 p-6 space-y-6">
                <h2 className="font-serif text-xl text-cream">Payment</h2>

                <div className="grid grid-cols-2 gap-4">
                  <ExpressPayButton label="Apple Pay" icon="apple" />
                  <ExpressPayButton label="Google Pay" icon="google" />
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cream/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-obsidian px-4 text-xs text-cream/40 uppercase tracking-widest">
                      or pay with card
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    const orderNumber = `SS-${Date.now().toString().slice(-8)}`;
                    const orderId = `ord-${Date.now()}`;

                    const results = await processPostPurchasePipeline({
                      orderId,
                      orderNumber,
                      customerEmail: email,
                      phoneNumber: phone,
                      total: totals.total,
                      currency: region.currency,
                      items: state.items.map((i) => ({
                        sku: i.variant.sku,
                        quantity: i.quantity,
                        title: i.product.title,
                      })),
                    });

                    setWebhookResults(results);
                    setOrderNumber(orderNumber);
                    setCheckoutStep("confirmation");
                    setIsProcessing(false);
                  }}
                  className="w-full py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors disabled:opacity-40"
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </button>
              </div>
            )}
          </div>

          <div className="border border-cream/10 p-6 h-fit">
            <h2 className="font-serif text-xl text-cream mb-6">Order Summary</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-cream/60">Subtotal</dt>
                <dd className="text-cream">
                  {formatCurrency(totals.subtotal, region)}
                </dd>
              </div>
              {totals.duties > 0 && (
                <div className="flex justify-between">
                  <dt className="text-cream/60">Import Duties</dt>
                  <dd className="text-cream">
                    {formatCurrency(totals.duties, region)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-cream/60">Shipping</dt>
                <dd className="text-cream">
                  {formatCurrency(totals.shipping, region)}
                </dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-cream/10">
                <dt className="text-cream font-serif text-lg">Total</dt>
                <dd className="text-cream font-serif text-lg">
                  {formatCurrency(totals.total, region)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function CartLine({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: {
    product: { title: string; image_url: string };
    variant: { size_ml: number; price: number };
    quantity: number;
  };
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  const linePrice = useLocalizedPrice(item.variant.price * item.quantity);

  return (
    <div className="flex gap-6 border border-cream/10 p-4">
      <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden">
        <Image
          src={item.product.image_url}
          alt={item.product.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-lg text-cream">{item.product.title}</h3>
        <p className="text-sm text-cream/50">{item.variant.size_ml}ml</p>
        <p className="text-gold mt-2">{linePrice}</p>
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-8 h-8 border border-cream/20 text-cream hover:border-cream/40"
          >
            -
          </button>
          <span className="text-cream text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-8 h-8 border border-cream/20 text-cream hover:border-cream/40"
          >
            +
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-cream/40 hover:text-cream ml-auto uppercase tracking-widest"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpressPayButton({
  label,
  icon,
}: {
  label: string;
  icon: "apple" | "google";
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-4 bg-cream text-obsidian text-sm font-medium hover:bg-cream-200 transition-colors rounded-sm"
    >
      {icon === "apple" ? (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.08-3.13-1.05.04-2.31.69-3.06 1.66-.68.86-1.28 2.01-1.12 3.16 1.19.09 2.41-.61 3.1-1.69z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.037 6.037 0 110-12.073 6.037 6.037 0 016.037 6.037zm0-4.771V.751h8.137A10.015 10.015 0 002.615 12.03 10.015 10.015 0 0012.545 22.5V13.5a5.729 5.729 0 01-5.729-5.729 5.729 5.729 0 015.729-5.303z" />
        </svg>
      )}
      {label}
    </button>
  );
}
