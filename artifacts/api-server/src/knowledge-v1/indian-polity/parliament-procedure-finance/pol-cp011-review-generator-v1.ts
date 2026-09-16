import type { PolCp011ReviewQuestion } from "./pol-cp011-review-types";
import { POL_CP011_SEEDS_A } from "./pol-cp011-seeds-a";
import { POL_CP011_SEEDS_B } from "./pol-cp011-seeds-b";
import { POL_CP011_SEEDS_C } from "./pol-cp011-seeds-c";
import { POL_CP011_SEEDS_D } from "./pol-cp011-seeds-d";

export function generatePolCp011ReviewBatchV1(): PolCp011ReviewQuestion[] {
  const seeds = [...POL_CP011_SEEDS_A, ...POL_CP011_SEEDS_B, ...POL_CP011_SEEDS_C, ...POL_CP011_SEEDS_D];

  const questions = seeds.map((seed, index): PolCp011ReviewQuestion => {
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [...seed.distractors] as string[];
    options.splice(correctIndex, 0, seed.canonicalAnswer);

    if (options.length !== 4 || new Set(options).size !== 4) {
      throw new Error(`Invalid options for POL-CP011-V1-${String(index + 1).padStart(3, "0")}`);
    }

    return {
      questionId: `POL-CP011-V1-${String(index + 1).padStart(3, "0")}`,
      qlId: seed.qlId,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: options as [string, string, string, string],
      correctIndex,
      canonicalAnswer: seed.canonicalAnswer,
      explanation: seed.explanation,
      sourceIds: seed.sourceIds,
      sourceFactIds: seed.sourceFactIds,
    };
  });

  if (questions.length !== 88) throw new Error(`Expected 88 questions, got ${questions.length}`);
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated explanation in POL-CP-011 V1");

  for (const q of questions) {
    if (q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`Answer mismatch: ${q.questionId}`);
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 11 || words > 30) throw new Error(`Explanation length ${q.questionId}: ${words}`);
    if (/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) {
      throw new Error(`Generic explanation clutter: ${q.questionId}`);
    }
    if (!q.stem.includes("Consider the statements") && q.stem.trim().split(/\s+/).length > 32) {
      throw new Error(`Stem too long: ${q.questionId}`);
    }
  }

  return questions;
}
