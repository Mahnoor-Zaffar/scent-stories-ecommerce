"use client";

import { useState } from "react";
import { vipOrderHistory } from "@/data/vip-orders";
import ConsultationCalendar from "./ConsultationCalendar";

export default function PrivateReserveDashboard() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-cream mb-4">
            Private Reserve
          </h1>
          <p className="text-cream/60 mb-8">
            This portal is reserved for VIP members. Please authenticate to
            continue.
          </p>
          <button
            type="button"
            className="px-10 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em]"
          >
            Member Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
          Welcome Back
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream">
          The Private Reserve
        </h1>
        <p className="text-cream/60 mt-4 max-w-xl">
          Your exclusive access to historical archives, batch traceability, and
          private fragrance consultations.
        </p>
      </div>

      <section className="mb-20" aria-labelledby="archives-heading">
        <h2
          id="archives-heading"
          className="font-serif text-2xl text-cream mb-8 border-b border-cream/10 pb-4"
        >
          Historical Archives
        </h2>

        <div className="space-y-4">
          {vipOrderHistory.map((order) => (
            <div
              key={order.id}
              className="border border-cream/10 hover:border-cream/20 transition-colors"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order.id ? null : order.id
                  )
                }
                className="w-full text-left p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest mb-1">
                    {order.batch_number}
                  </p>
                  <p className="font-serif text-xl text-cream">
                    {order.product_title}
                  </p>
                  <p className="text-sm text-cream/50 mt-1">
                    {order.variant_sku} · {order.size_ml}ml
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-cream font-serif">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency,
                    }).format(order.price)}
                  </p>
                  <p className="text-xs text-cream/40 mt-1">
                    {new Date(order.ordered_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="px-6 pb-6 border-t border-cream/10">
                  <p className="text-xs uppercase tracking-widest text-cream/50 mt-4 mb-4">
                    Ingredient Sourcing Breakdown
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {order.ingredient_sourcing.map((source) => (
                      <div
                        key={source.note}
                        className="p-4 bg-obsidian-50/50 border border-cream/5"
                      >
                        <p className="font-serif text-cream">{source.note}</p>
                        <dl className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-cream/40">Origin</dt>
                            <dd className="text-cream/70">{source.origin}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-cream/40">Harvest</dt>
                            <dd className="text-cream/70">
                              {source.harvest_season}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-cream/40">Supplier</dt>
                            <dd className="text-cream/70">{source.supplier}</dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="consultation-heading">
        <h2 id="consultation-heading" className="sr-only">
          Consultation Booking
        </h2>
        <ConsultationCalendar />
      </section>
    </div>
  );
}
