"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { animate } from "@/lib/anime";
import {
  quizReducer,
  initialQuizState,
  type QuizMood,
  type QuizSetting,
  type QuizPreference,
} from "@/lib/quiz-engine";
import { catalog } from "@/data/catalog";

const MOOD_OPTIONS: { value: QuizMood; label: string; desc: string }[] = [
  { value: "bold", label: "Bold", desc: "Commanding and unforgettable" },
  { value: "serene", label: "Serene", desc: "Calm, refined, and balanced" },
  { value: "romantic", label: "Romantic", desc: "Soft, intimate, and warm" },
  {
    value: "mysterious",
    label: "Mysterious",
    desc: "Enigmatic and deeply layered",
  },
];

const SETTING_OPTIONS: { value: QuizSetting; label: string; desc: string }[] = [
  { value: "daytime", label: "Daytime", desc: "Fresh presence for daylight hours" },
  { value: "evening", label: "Evening", desc: "Rich depth for after dusk" },
  { value: "formal", label: "Formal", desc: "Elevated occasions and galas" },
  { value: "casual", label: "Casual", desc: "Everyday elegance, effortless" },
];

const PREFERENCE_OPTIONS: {
  value: QuizPreference;
  label: string;
  desc: string;
}[] = [
  { value: "floral", label: "Floral", desc: "Blooms, petals, and bouquets" },
  { value: "woody", label: "Woody", desc: "Cedar, vetiver, and forest air" },
  {
    value: "oriental",
    label: "Oriental",
    desc: "Amber, spice, and resinous warmth",
  },
  { value: "citrus", label: "Citrus", desc: "Bright zest and sunlit clarity" },
];

export default function ScentQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const questionRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const animateTransition = useCallback(() => {
    const el = questionRef.current;
    if (!el) return;

    animRef.current?.pause();

    const direction = state.direction === "forward" ? 1 : -1;
    animRef.current = animate(el, {
      opacity: [0, 1],
      translateX: [30 * direction, 0],
      duration: 600,
      ease: "outExpo",
    });
  }, [state.direction]);

  useEffect(() => {
    animateTransition();
    return () => {
      animRef.current?.pause();
    };
  }, [animateTransition, state.step]);

  const handleSelectMood = (mood: QuizMood) => {
    dispatch({ type: "SET_MOOD", mood });
    setTimeout(() => dispatch({ type: "NEXT_STEP" }), 300);
  };

  const handleSelectSetting = (setting: QuizSetting) => {
    dispatch({ type: "SET_SETTING", setting });
    setTimeout(() => dispatch({ type: "NEXT_STEP" }), 300);
  };

  const handleSelectPreference = (preference: QuizPreference) => {
    dispatch({ type: "SET_PREFERENCE", preference });
    setTimeout(() => dispatch({ type: "CALCULATE_RESULT" }), 300);
  };

  const recommended = state.recommendedProduct;
  const recommendedCatalog = recommended
    ? catalog.find((c) => c.product.id === recommended.id)
    : null;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center gap-2 mb-12">
          {["intro", "mood", "setting", "preference", "result"].map(
            (step, i) => (
              <div
                key={step}
                className={`h-0.5 w-12 transition-colors duration-500 ${
                  ["intro", "mood", "setting", "preference", "result"].indexOf(
                    state.step
                  ) >= i
                    ? "bg-gold"
                    : "bg-cream/20"
                }`}
              />
            )
          )}
        </div>

        <div ref={questionRef} className="opacity-0">
          {state.step === "intro" && (
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-5xl text-cream mb-6">
                Discover Your Signature
              </h1>
              <p className="text-cream/70 mb-10 leading-relaxed max-w-md mx-auto">
                Answer three curated questions about your mood, setting, and
                ingredient preferences. Our algorithm will match you with the
                perfect Scent & Stories composition.
              </p>
              <button
                type="button"
                onClick={() => dispatch({ type: "NEXT_STEP" })}
                className="px-10 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
              >
                Begin Discovery
              </button>
            </div>
          )}

          {state.step === "mood" && (
            <QuestionPanel
              title="What mood do you wish to embody?"
              options={MOOD_OPTIONS}
              onSelect={(v) => handleSelectMood(v as QuizMood)}
            />
          )}

          {state.step === "setting" && (
            <QuestionPanel
              title="Where will you wear this fragrance?"
              options={SETTING_OPTIONS}
              onSelect={(v) => handleSelectSetting(v as QuizSetting)}
            />
          )}

          {state.step === "preference" && (
            <QuestionPanel
              title="Which ingredient family calls to you?"
              options={PREFERENCE_OPTIONS}
              onSelect={(v) => handleSelectPreference(v as QuizPreference)}
            />
          )}

          {state.step === "result" && recommended && recommendedCatalog && (
            <div className="text-center">
              <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">
                Your Signature Match
              </p>
              <h2 className="font-serif text-4xl text-cream mb-6">
                {recommended.title}
              </h2>
              <div className="relative w-48 h-64 mx-auto mb-8 overflow-hidden rounded-sm">
                <Image
                  src={recommended.image_url}
                  alt={recommended.title}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <p className="text-cream/70 mb-8 max-w-md mx-auto leading-relaxed">
                {recommended.description.slice(0, 180)}...
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/products/${recommended.handle}`}
                  className="px-10 py-4 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
                >
                  View Fragrance
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "RESET" })}
                  className="px-10 py-4 border border-cream/30 text-cream text-sm uppercase tracking-[0.2em] hover:border-cream/60 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        {state.step !== "intro" && state.step !== "result" && (
          <button
            type="button"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="mt-8 text-sm text-cream/50 hover:text-cream transition-colors uppercase tracking-widest"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionPanel<T extends string>({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: { value: T; label: string; desc: string }[];
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl text-cream text-center mb-10">
        {title}
      </h2>
      <div className="grid gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="group w-full text-left p-6 border border-cream/15 hover:border-gold/50 transition-all duration-300 hover:bg-gold/5"
          >
            <span className="block font-serif text-xl text-cream group-hover:text-gold transition-colors">
              {option.label}
            </span>
            <span className="block text-sm text-cream/50 mt-1">
              {option.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
