"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "@/lib/anime";

interface NoteSection {
  label: string;
  subtitle: string;
  notes: string[];
  accentClass: string;
}

interface FragranceLifecycleProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

const sections: (notes: FragranceLifecycleProps) => NoteSection[] = (
  props
) => [
  {
    label: "Top Notes",
    subtitle: "Volatile, immediate impression",
    notes: props.topNotes,
    accentClass: "border-gold/60 bg-gold/5",
  },
  {
    label: "Heart Notes",
    subtitle: "Core identity, medium volatility",
    notes: props.heartNotes,
    accentClass: "border-cream-200 bg-cream-50/5",
  },
  {
    label: "Base Notes",
    subtitle: "Long-lasting fixative depth",
    notes: props.baseNotes,
    accentClass: "border-obsidian-50 bg-obsidian-50/30",
  },
];

export default function FragranceLifecycle({
  topNotes,
  heartNotes,
  baseNotes,
}: FragranceLifecycleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteSections = sections({ topNotes, heartNotes, baseNotes });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sectionEls = container.querySelectorAll("[data-lifecycle-section]");
    const noteEls = container.querySelectorAll("[data-note-chip]");

    const sectionAnim = animate(sectionEls, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 800,
      delay: stagger(200),
      ease: "outExpo",
    });

    const noteAnim = animate(noteEls, {
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 600,
      delay: stagger(80, { start: 400 }),
      ease: "outBack",
    });

    return () => {
      sectionAnim.pause();
      noteAnim.pause();
    };
  }, [topNotes, heartNotes, baseNotes]);

  return (
    <section className="py-16" aria-labelledby="lifecycle-heading">
      <h2
        id="lifecycle-heading"
        className="font-serif text-3xl md:text-4xl text-cream mb-3"
      >
        Fragrance Lifecycle
      </h2>
      <p className="text-cream-200/70 mb-12 max-w-xl text-sm tracking-wide">
        Every composition unfolds in three distinct phases. Explore how each
        layer reveals itself over time.
      </p>

      <div ref={containerRef} className="grid gap-8 md:grid-cols-3">
        {noteSections.map((section) => (
          <div
            key={section.label}
            data-lifecycle-section
            className={`rounded-sm border p-6 opacity-0 ${section.accentClass}`}
          >
            <h3 className="font-serif text-xl text-cream mb-1">
              {section.label}
            </h3>
            <p className="text-xs uppercase tracking-widest text-gold/80 mb-6">
              {section.subtitle}
            </p>
            <ul className="flex flex-wrap gap-2">
              {section.notes.map((note) => (
                <li
                  key={note}
                  data-note-chip
                  className="opacity-0 px-3 py-1.5 text-sm text-cream/90 border border-cream/10 rounded-sm"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
