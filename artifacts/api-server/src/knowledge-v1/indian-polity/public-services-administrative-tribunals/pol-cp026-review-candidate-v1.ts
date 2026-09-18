import type { PolCp026ReviewQuestion, PolCp026SeedRow } from "./pol-cp026-types";
import { POL_CP026_PART_1 } from "./pol-cp026-data-part1";
import { POL_CP026_PART_2 } from "./pol-cp026-data-part2";
import { POL_CP026_PART_3 } from "./pol-cp026-data-part3";
import { POL_CP026_PART_4 } from "./pol-cp026-data-part4";

const rows: readonly PolCp026SeedRow[] = [
  ...POL_CP026_PART_1,
  ...POL_CP026_PART_2,
  ...POL_CP026_PART_3,
  ...POL_CP026_PART_4,
];

const GENERIC_CLUTTER =
  /Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i;

const LEGALISTIC_STEM =
  /\bwhom\b|\bby whom\b|for the purposes of/i;

export function generatePolCp026ReviewBatchV1(): PolCp026ReviewQuestion[] {
  if (rows.length !== 80) throw new Error(`Expected 80 POL-CP-026 rows, got ${rows.length}`);

  const questions = rows.map((row, index): PolCp026ReviewQuestion => {
    const [qlId, difficulty, stem, answer, d1, d2, d3, explanation, sourceIds] = row;
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [d1, d2, d3];
    options.splice(correctIndex, 0, answer);

    if (new Set(options).size !== 4) throw new Error(`Duplicate options at question ${index + 1}`);
    if (!/[?:]$/.test(stem)) throw new Error(`Stem must end in ? or : at question ${index + 1}`);
    if (stem.trim().split(/\s+/).length > 30) throw new Error(`Stem too long at question ${index + 1}`);
    if (LEGALISTIC_STEM.test(stem)) throw new Error(`Legalistic stem repetition at question ${index + 1}`);

    const words = explanation.trim().split(/\s+/).length;
    if (words < 13 || words > 42) throw new Error(`Explanation length ${words} outside 13–42 at question ${index + 1}`);
    if (GENERIC_CLUTTER.test(explanation)) throw new Error(`Generic clutter at question ${index + 1}`);

    return {
      questionId: `POL-CP026-V1-${String(index + 1).padStart(3, "0")}`,
      qlId,
      difficulty,
      stem,
      options: options as [string, string, string, string],
      correctIndex,
      explanation,
      sourceIds,
    };
  });

  if (new Set(questions.map((q) => q.stem)).size !== 80) throw new Error("POL-CP-026 stems must be unique");
  if (new Set(questions.map((q) => q.explanation)).size !== 80) throw new Error("POL-CP-026 explanations must be unique");

  const completionCount = questions.filter((q) => q.stem.endsWith(":")).length;
  const questionCount = questions.filter((q) => q.stem.endsWith("?")).length;
  if (completionCount !== 40 || questionCount !== 40) {
    throw new Error(`Expected 40 completion + 40 question stems, got ${completionCount} + ${questionCount}`);
  }

  return questions;
}
