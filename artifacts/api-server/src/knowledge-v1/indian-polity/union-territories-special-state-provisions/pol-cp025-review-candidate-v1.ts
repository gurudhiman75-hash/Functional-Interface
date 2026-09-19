import type { PolCp025ReviewQuestion, PolCp025SeedRow } from "./pol-cp025-types";
import { POL_CP025_PART_1 } from "./pol-cp025-data-part1";
import { POL_CP025_PART_2 } from "./pol-cp025-data-part2";
import { POL_CP025_PART_3 } from "./pol-cp025-data-part3";
import { POL_CP025_PART_4 } from "./pol-cp025-data-part4";

const rows: readonly PolCp025SeedRow[] = [
  ...POL_CP025_PART_1,
  ...POL_CP025_PART_2,
  ...POL_CP025_PART_3,
  ...POL_CP025_PART_4,
];

const GENERIC_CLUTTER =
  /Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i;
const LEGALISTIC_STEM = /\\bwhom\\b|for the purposes of|what is the|appointed by whom|issued by whom/i;

export function generatePolCp025ReviewBatchV1(): PolCp025ReviewQuestion[] {
  if (rows.length !== 80) throw new Error(`Expected 80 POL-CP-025 rows, got ${rows.length}`);

  const questions = rows.map((row, index): PolCp025ReviewQuestion => {
    const [qlId, difficulty, stem, answer, d1, d2, d3, explanation, sourceIds] = row;
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [d1, d2, d3];
    options.splice(correctIndex, 0, answer);

    if (new Set(options).size !== 4) throw new Error(`Duplicate options at question ${index + 1}`);
    const words = explanation.trim().split(/\s+/).length;
    if (words < 12 || words > 45) throw new Error(`Explanation length ${words} outside 12–45 at question ${index + 1}`);
    if (GENERIC_CLUTTER.test(explanation)) throw new Error(`Generic clutter at question ${index + 1}`);
    if (LEGALISTIC_STEM.test(stem)) throw new Error(`Legalistic stem at question ${index + 1}`);
    if (!stem.endsWith("?") || stem.trim().split(/\s+/).length > 30) throw new Error(`Invalid stem at question ${index + 1}`);

    return {
      questionId: `POL-CP025-V1-${String(index + 1).padStart(3, "0")}`,
      qlId,
      difficulty,
      stem,
      options: options as [string, string, string, string],
      correctIndex,
      explanation,
      sourceIds,
    };
  });

  if (new Set(questions.map((q) => q.stem)).size !== 80) throw new Error("POL-CP-025 stems must be unique");
  if (new Set(questions.map((q) => q.explanation)).size !== 80) throw new Error("POL-CP-025 explanations must be unique");
  const completionCount = questions.filter((q) => q.stem.endsWith(":")).length;
  const questionCount = questions.filter((q) => q.stem.endsWith("?")).length;
  if (completionCount !== 43 || questionCount !== 37) {
    throw new Error(`Expected V3 stem mix 43 completion + 37 question, got ${completionCount} + ${questionCount}`);
  }
  return questions;
}
