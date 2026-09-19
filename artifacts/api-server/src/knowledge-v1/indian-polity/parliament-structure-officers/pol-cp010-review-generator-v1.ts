import type { PolCp010ReviewQuestion } from "./pol-cp010-review-types";
import { POL_CP010_SEEDS_A } from "./pol-cp010-seeds-a";
import { POL_CP010_SEEDS_B } from "./pol-cp010-seeds-b";
import { POL_CP010_SEEDS_C } from "./pol-cp010-seeds-c";
import { POL_CP010_SEEDS_D } from "./pol-cp010-seeds-d";

export function generatePolCp010ReviewBatchV1(): PolCp010ReviewQuestion[] {
  const seeds = [...POL_CP010_SEEDS_A, ...POL_CP010_SEEDS_B, ...POL_CP010_SEEDS_C, ...POL_CP010_SEEDS_D];
  const questions = seeds.map((q, index) => {
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [...q.distractors] as string[];
    options.splice(correctIndex, 0, q.canonicalAnswer);
    return {
      questionId: `POL-CP010-V1-${String(index + 1).padStart(3, "0")}`,
      qlId: q.qlId,
      difficulty: q.difficulty,
      stem: q.stem,
      options: options as [string, string, string, string],
      correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      explanation: q.explanation,
      sourceIds: q.sourceIds,
      sourceFactIds: q.sourceFactIds,
    };
  });

  if (questions.length !== 80) throw new Error(`Expected 80 questions, got ${questions.length}`);
  if (new Set(questions.map(q => q.qlId)).size !== 20) throw new Error("Expected 20 QLs");
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated explanation");
  for (const q of questions) {
    if (q.options.length !== 4 || new Set(q.options).size !== 4) throw new Error(`Option defect in ${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`Answer alignment defect in ${q.questionId}`);
    if (!q.stem.startsWith("Consider the following statements") && q.stem.trim().split(/\s+/).length > 28) throw new Error(`Long stem in ${q.questionId}`);
    const explanationWords = q.explanation.trim().split(/\s+/).length;
    const maxExplanationWords = q.explanation.includes("Article 84 qualifications:") ? 60 : 30;
    if (explanationWords < 11 || explanationWords > maxExplanationWords) {
      throw new Error(`Explanation length defect in ${q.questionId}: ${explanationWords}`);
    }
  }
  return questions;
}
