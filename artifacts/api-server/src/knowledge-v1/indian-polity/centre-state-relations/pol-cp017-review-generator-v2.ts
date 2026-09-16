import type { PolCp017ReviewQuestion } from "./pol-cp017-review-types";
import { POL_CP017_SEEDS_A } from "./pol-cp017-seeds-a";
import { POL_CP017_SEEDS_B } from "./pol-cp017-seeds-b";
import { POL_CP017_SEEDS_C } from "./pol-cp017-seeds-c";
import { POL_CP017_SEEDS_D } from "./pol-cp017-seeds-d";
import { POL_CP017_EXPLANATIONS_V2 } from "./pol-cp017-explanations-v2";

const GENERIC_CLUTTER = /Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i;

export function generatePolCp017ReviewBatchV2(): PolCp017ReviewQuestion[] {
  const seeds = [...POL_CP017_SEEDS_A, ...POL_CP017_SEEDS_B, ...POL_CP017_SEEDS_C, ...POL_CP017_SEEDS_D];
  if (seeds.length !== 96) throw new Error(`Expected 96 POL-CP-017 seeds, got ${seeds.length}`);
  if (POL_CP017_EXPLANATIONS_V2.length !== seeds.length) throw new Error("POL-CP-017 V2 explanation count does not match seed count");

  const questions = seeds.map((seed, index): PolCp017ReviewQuestion => {
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.answer);
    if (new Set(options).size !== 4) throw new Error(`Duplicate options at POL-CP-017 question ${index + 1}`);

    const explanation = POL_CP017_EXPLANATIONS_V2[index];
    const words = explanation.trim().split(/\s+/).length;
    if (words < 11 || words > 32) throw new Error(`Explanation length ${words} outside 11–32 at question ${index + 1}`);
    if (GENERIC_CLUTTER.test(explanation)) throw new Error(`Generic explanation clutter at question ${index + 1}`);

    return {
      questionId: `POL-CP017-V2-${String(index + 1).padStart(3, "0")}`,
      qlId: seed.qlId,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: options as [string, string, string, string],
      correctIndex,
      explanation,
      sourceIds: seed.sourceIds,
    };
  });

  if (new Set(questions.map((q) => q.explanation)).size !== 96) throw new Error("POL-CP-017 V2 explanations must be unique");
  if (new Set(questions.map((q) => q.stem)).size !== 96) throw new Error("POL-CP-017 stems must be unique");
  return questions;
}
