import type { PolCp027ReviewQuestion, PolCp027SeedRow } from "./pol-cp027-types";
import { POL_CP027_PART_1 } from "./pol-cp027-data-part1";
import { POL_CP027_PART_2 } from "./pol-cp027-data-part2";
import { POL_CP027_PART_3 } from "./pol-cp027-data-part3";
import { POL_CP027_PART_4 } from "./pol-cp027-data-part4";

const rows: readonly PolCp027SeedRow[] = [
  ...POL_CP027_PART_1,
  ...POL_CP027_PART_2,
  ...POL_CP027_PART_3,
  ...POL_CP027_PART_4,
];

const GENERIC_CLUTTER =
  /Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i;

const BAD_STEM =
  /\bwhom\b|\bby whom\b|for the purposes of|CP027|ownership|review candidate|reimplemented|is dealt with in|is covered by|is contained in|expressly mentioned|provided under|provided in|governed by/i;

export function generatePolCp027ReviewBatchV1(): PolCp027ReviewQuestion[] {
  if (rows.length !== 80) throw new Error(`Expected 80 POL-CP-027 rows, got ${rows.length}`);

  const questions = rows.map((row, index): PolCp027ReviewQuestion => {
    const [qlId, difficulty, stem, answer, d1, d2, d3, explanation, sourceIds] = row;
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [d1, d2, d3];
    options.splice(correctIndex, 0, answer);

    if (new Set(options).size !== 4) throw new Error(`Duplicate options at question ${index + 1}`);
    if (!/[?:]$/.test(stem)) throw new Error(`Stem must end in ? or : at question ${index + 1}`);
    if (stem.trim().split(/\s+/).length > 30) throw new Error(`Stem too long at question ${index + 1}`);
    if (BAD_STEM.test(stem)) throw new Error(`Non-exam stem wording at question ${index + 1}`);

    const words = explanation.trim().split(/\s+/).length;
    if (words < 13 || words > 42) throw new Error(`Explanation length ${words} outside 13–42 at question ${index + 1}`);
    if (GENERIC_CLUTTER.test(explanation)) throw new Error(`Generic explanation clutter at question ${index + 1}`);

    return {
      questionId: `POL-CP027-V1-${String(index + 1).padStart(3, "0")}`,
      qlId,
      difficulty,
      stem,
      options: options as [string, string, string, string],
      correctIndex,
      explanation,
      sourceIds,
    };
  });

  if (new Set(questions.map((q) => q.stem)).size !== 80) throw new Error("POL-CP-027 stems must be unique");
  if (new Set(questions.map((q) => q.explanation)).size !== 80) throw new Error("POL-CP-027 explanations must be unique");

  const completionCount = questions.filter((q) => q.stem.endsWith(":")).length;
  const questionCount = questions.filter((q) => q.stem.endsWith("?")).length;
  if (completionCount !== 40 || questionCount !== 40) {
    throw new Error(`Expected 40 completion + 40 question stems, got ${completionCount} + ${questionCount}`);
  }

  return questions;
}
