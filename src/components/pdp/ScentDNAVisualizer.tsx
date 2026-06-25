"use client";

import { useEffect, useRef } from "react";
import type { ScentDNA } from "@/types/catalog";
import { animate, stagger } from "@/lib/anime";

interface ScentDNAVisualizerProps {
  dna: ScentDNA;
}

const PROFILE_AXES = [
  { key: "woody" as const, label: "Woody" },
  { key: "floral" as const, label: "Floral" },
  { key: "oriental" as const, label: "Oriental" },
  { key: "citrus" as const, label: "Citrus" },
  { key: "chypre" as const, label: "Chypre" },
  { key: "fougere" as const, label: "Fougere" },
];

const METRIC_AXES = [
  { key: "longevity" as const, label: "Longevity" },
  { key: "sillage" as const, label: "Sillage" },
];

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function buildRadarPath(
  cx: number,
  cy: number,
  maxRadius: number,
  values: number[],
  count: number
): string {
  const points = values.map((value, i) => {
    const angle = (360 / count) * i;
    const r = (value / 100) * maxRadius;
    return polarToCartesian(cx, cy, r, angle);
  });
  return (
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z"
  );
}

export default function ScentDNAVisualizer({ dna }: ScentDNAVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const radarPathRef = useRef<SVGPathElement>(null);

  const profileValues = PROFILE_AXES.map((axis) => dna[axis.key]);
  const cx = 160;
  const cy = 160;
  const maxRadius = 120;

  const radarPath = buildRadarPath(
    cx,
    cy,
    maxRadius,
    profileValues,
    PROFILE_AXES.length
  );

  useEffect(() => {
    const svg = svgRef.current;
    const pathEl = radarPathRef.current;
    if (!svg || !pathEl) return;

    const radarAnim = animate(pathEl, {
      opacity: [0, 1],
      scale: [0.6, 1],
      duration: 1200,
      ease: "outExpo",
    });

    const scaleBars = svg.querySelectorAll("[data-metric-bar]");
    const barAnim = animate(scaleBars, {
      scaleX: [0, 1],
      duration: 900,
      delay: stagger(150, { start: 600 }),
      ease: "outExpo",
    });

    return () => {
      radarAnim.pause();
      barAnim.pause();
    };
  }, [dna]);

  const gridLevels = [25, 50, 75, 100];

  return (
    <section className="py-16" aria-labelledby="scent-dna-heading">
      <h2
        id="scent-dna-heading"
        className="font-serif text-3xl md:text-4xl text-cream mb-3"
      >
        Scent DNA
      </h2>
      <p className="text-cream-200/70 mb-10 max-w-xl text-sm tracking-wide">
        An olfactory fingerprint mapping profile intensity and performance
        metrics.
      </p>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 320 320"
            className="w-full max-w-[320px] h-auto"
            role="img"
            aria-label="Scent profile radar chart"
          >
            {gridLevels.map((level) => (
              <polygon
                key={level}
                points={PROFILE_AXES.map((_, i) => {
                  const p = polarToCartesian(
                    cx,
                    cy,
                    (level / 100) * maxRadius,
                    (360 / PROFILE_AXES.length) * i
                  );
                  return `${p.x},${p.y}`;
                }).join(" ")}
                fill="none"
                stroke="rgba(201, 169, 98, 0.15)"
                strokeWidth="1"
              />
            ))}

            {PROFILE_AXES.map((axis, i) => {
              const p = polarToCartesian(cx, cy, maxRadius, (360 / PROFILE_AXES.length) * i);
              const labelP = polarToCartesian(
                cx,
                cy,
                maxRadius + 20,
                (360 / PROFILE_AXES.length) * i
              );
              return (
                <g key={axis.key}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={p.x}
                    y2={p.y}
                    stroke="rgba(245, 240, 232, 0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x={labelP.x}
                    y={labelP.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-cream/60 text-[10px]"
                    style={{ fontSize: "10px" }}
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}

            <path
              ref={radarPathRef}
              d={radarPath}
              fill="rgba(201, 169, 98, 0.25)"
              stroke="#C9A962"
              strokeWidth="2"
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          </svg>
        </div>

        <div className="space-y-8">
          {METRIC_AXES.map((metric, index) => (
            <div key={metric.key}>
              <div className="flex justify-between mb-2">
                <span className="text-sm uppercase tracking-widest text-cream/70">
                  {metric.label}
                </span>
                <span className="text-sm text-gold font-serif">
                  {dna[metric.key]}%
                </span>
              </div>
              <div className="h-1.5 bg-obsidian-50 rounded-full overflow-hidden">
                <div
                  data-metric-bar
                  data-index={index}
                  className="h-full bg-gradient-to-r from-gold-dark to-gold origin-left"
                  style={{
                    width: `${dna[metric.key]}%`,
                    transform: "scaleX(0)",
                  }}
                />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4 pt-4">
            {PROFILE_AXES.slice(0, 3).map((axis) => (
              <div key={axis.key} className="text-center">
                <p className="text-2xl font-serif text-gold">{dna[axis.key]}</p>
                <p className="text-xs text-cream/50 uppercase tracking-wider mt-1">
                  {axis.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
