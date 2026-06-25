import type { Metadata } from "next";
import ScentQuiz from "@/components/quiz/ScentQuiz";

export const metadata: Metadata = {
  title: "Scent Discovery Quiz",
  description:
    "Answer three curated questions and discover your perfect Scent & Stories signature fragrance.",
};

export default function QuizPage() {
  return <ScentQuiz />;
}
