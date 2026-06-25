import type { Product } from "@/types/catalog";
import { catalog } from "@/data/catalog";

export type QuizMood = "bold" | "serene" | "romantic" | "mysterious";
export type QuizSetting = "daytime" | "evening" | "formal" | "casual";
export type QuizPreference = "floral" | "woody" | "oriental" | "citrus";

export interface QuizAnswers {
  mood: QuizMood | null;
  setting: QuizSetting | null;
  preference: QuizPreference | null;
}

export type QuizStep = "intro" | "mood" | "setting" | "preference" | "result";

export interface QuizState {
  step: QuizStep;
  answers: QuizAnswers;
  direction: "forward" | "backward";
  recommendedProduct: Product | null;
  scores: Record<string, number>;
}

export type QuizAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_MOOD"; mood: QuizMood }
  | { type: "SET_SETTING"; setting: QuizSetting }
  | { type: "SET_PREFERENCE"; preference: QuizPreference }
  | { type: "CALCULATE_RESULT" }
  | { type: "RESET" };

const STEP_ORDER: QuizStep[] = [
  "intro",
  "mood",
  "setting",
  "preference",
  "result",
];

const MOOD_WEIGHTS: Record<QuizMood, Partial<Record<string, number>>> = {
  bold: { "obsidian-orchid": 3, "amber-meridian": 2, "cedar-and-silk": 1 },
  serene: { "cedar-and-silk": 3, "obsidian-orchid": 1, "amber-meridian": 1 },
  romantic: { "obsidian-orchid": 3, "amber-meridian": 2, "cedar-and-silk": 0 },
  mysterious: {
    "obsidian-orchid": 2,
    "amber-meridian": 3,
    "cedar-and-silk": 1,
  },
};

const SETTING_WEIGHTS: Record<
  QuizSetting,
  Partial<Record<string, number>>
> = {
  daytime: { "cedar-and-silk": 3, "obsidian-orchid": 1, "amber-meridian": 0 },
  evening: { "obsidian-orchid": 2, "amber-meridian": 3, "cedar-and-silk": 1 },
  formal: { "obsidian-orchid": 3, "amber-meridian": 2, "cedar-and-silk": 2 },
  casual: { "cedar-and-silk": 3, "amber-meridian": 1, "obsidian-orchid": 1 },
};

const PREFERENCE_WEIGHTS: Record<
  QuizPreference,
  Partial<Record<string, number>>
> = {
  floral: { "obsidian-orchid": 3, "cedar-and-silk": 1, "amber-meridian": 0 },
  woody: { "cedar-and-silk": 3, "obsidian-orchid": 1, "amber-meridian": 2 },
  oriental: { "amber-meridian": 3, "obsidian-orchid": 2, "cedar-and-silk": 0 },
  citrus: { "cedar-and-silk": 3, "amber-meridian": 1, "obsidian-orchid": 0 },
};

export function calculateQuizScores(answers: QuizAnswers): Record<string, number> {
  const scores: Record<string, number> = {};
  catalog.forEach((item) => {
    scores[item.product.handle] = 0;
  });

  if (answers.mood) {
    const weights = MOOD_WEIGHTS[answers.mood];
    Object.entries(weights).forEach(([handle, weight]) => {
      scores[handle] = (scores[handle] ?? 0) + (weight ?? 0);
    });
  }

  if (answers.setting) {
    const weights = SETTING_WEIGHTS[answers.setting];
    Object.entries(weights).forEach(([handle, weight]) => {
      scores[handle] = (scores[handle] ?? 0) + (weight ?? 0);
    });
  }

  if (answers.preference) {
    const weights = PREFERENCE_WEIGHTS[answers.preference];
    Object.entries(weights).forEach(([handle, weight]) => {
      scores[handle] = (scores[handle] ?? 0) + (weight ?? 0);
    });
  }

  return scores;
}

export function getTopRecommendation(
  scores: Record<string, number>
): Product | null {
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  if (sorted.length === 0 || sorted[0][1] === 0) return null;
  const handle = sorted[0][0];
  const item = catalog.find((c) => c.product.handle === handle);
  return item?.product ?? null;
}

export const initialQuizState: QuizState = {
  step: "intro",
  answers: { mood: null, setting: null, preference: null },
  direction: "forward",
  recommendedProduct: null,
  scores: {},
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "NEXT_STEP": {
      const currentIndex = STEP_ORDER.indexOf(state.step);
      const nextStep = STEP_ORDER[Math.min(currentIndex + 1, STEP_ORDER.length - 1)];
      return { ...state, step: nextStep, direction: "forward" };
    }
    case "PREV_STEP": {
      const currentIndex = STEP_ORDER.indexOf(state.step);
      const prevStep = STEP_ORDER[Math.max(currentIndex - 1, 0)];
      return { ...state, step: prevStep, direction: "backward" };
    }
    case "SET_MOOD":
      return {
        ...state,
        answers: { ...state.answers, mood: action.mood },
      };
    case "SET_SETTING":
      return {
        ...state,
        answers: { ...state.answers, setting: action.setting },
      };
    case "SET_PREFERENCE":
      return {
        ...state,
        answers: { ...state.answers, preference: action.preference },
      };
    case "CALCULATE_RESULT": {
      const scores = calculateQuizScores(state.answers);
      const recommendedProduct = getTopRecommendation(scores);
      return {
        ...state,
        scores,
        recommendedProduct,
        step: "result",
        direction: "forward",
      };
    }
    case "RESET":
      return initialQuizState;
    default:
      return state;
  }
}
