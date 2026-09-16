import type { PolCp018ReviewQuestion } from "./pol-cp018-review-types";
import { POL_CP018_SEEDS_A } from "./pol-cp018-seeds-a";
import { POL_CP018_SEEDS_B } from "./pol-cp018-seeds-b";
import { POL_CP018_SEEDS_C } from "./pol-cp018-seeds-c";
import { POL_CP018_SEEDS_D } from "./pol-cp018-seeds-d";

const GENERIC_CLUTTER = /Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i;

export function generatePolCp018ReviewBatchV1(): PolCp018ReviewQuestion[] {
  const seeds = [...POL_CP018_SEEDS_A, ...POL_CP018_SEEDS_B, ...POL_CP018_SEEDS_C, ...POL_CP018_SEEDS_D];
  if (seeds.length !== 80) throw new Error(`Expected 80 POL-CP-018 seeds, got ${seeds.length}`);

  const questions = seeds.map((seed, index): PolCp018ReviewQuestion => {
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.answer);
    if (new Set(options).size !== 4) throw new Error(`Duplicate options at POL-CP-018 question ${index + 1}`);
    const words = seed.explanation.trim().split(/\s+/).length;
    if (words < 13 || words > 32) throw new Error(`Explanation length ${words} outside 13–32 at question ${index + 1}`);
    if (GENERIC_CLUTTER.test(seed.explanation)) throw new Error(`Generic explanation clutter at question ${index + 1}`);

    return {
      questionId: `POL-CP018-V1-${String(index + 1).padStart(3, "0")}`,
      qlId: seed.qlId,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: options as [string, string, string, string],
      correctIndex,
      explanation: seed.explanation,
      sourceIds: seed.sourceIds,
    };
  });

  if (new Set(questions.map((q) => q.explanation)).size !== 80) throw new Error("POL-CP-018 explanations must be unique");
  if (new Set(questions.map((q) => q.stem)).size !== 80) throw new Error("POL-CP-018 stems must be unique");
  return questions;
}
