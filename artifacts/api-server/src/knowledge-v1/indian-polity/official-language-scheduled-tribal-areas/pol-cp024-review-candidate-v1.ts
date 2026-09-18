import type { PolCp024ReviewQuestion, PolCp024SeedRow } from "./pol-cp024-types";
import { POL_CP024_PART_1 } from "./pol-cp024-data-part1";
import { POL_CP024_PART_2 } from "./pol-cp024-data-part2";
import { POL_CP024_PART_3 } from "./pol-cp024-data-part3";
import { POL_CP024_PART_4 } from "./pol-cp024-data-part4";

const rows: readonly PolCp024SeedRow[] = [
  ...POL_CP024_PART_1, ...POL_CP024_PART_2, ...POL_CP024_PART_3, ...POL_CP024_PART_4,
];

const GENERIC_CLUTTER = /Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i;

export function generatePolCp024ReviewBatchV1(): PolCp024ReviewQuestion[] {
  if (rows.length !== 80) throw new Error(`Expected 80 POL-CP-024 rows, got ${rows.length}`);
  const questions = rows.map((row,index): PolCp024ReviewQuestion => {
    const [qlId,difficulty,stem,answer,d1,d2,d3,explanation,sourceIds] = row;
    const correctIndex = (index % 4) as 0|1|2|3;
    const options = [d1,d2,d3]; options.splice(correctIndex,0,answer);
    if (new Set(options).size !== 4) throw new Error(`Duplicate options at question ${index+1}`);
    const words = explanation.trim().split(/\s+/).length;
    if (words < 13 || words > 45) throw new Error(`Explanation length ${words} outside 13–45 at question ${index+1}`);
    if (GENERIC_CLUTTER.test(explanation)) throw new Error(`Generic explanation clutter at question ${index+1}`);
    if (!stem.endsWith("?") || stem.trim().split(/\s+/).length > 30) throw new Error(`Invalid stem at question ${index+1}`);
    return { questionId:`POL-CP024-V1-${String(index+1).padStart(3,"0")}`, qlId, difficulty, stem,
      options:options as [string,string,string,string], correctIndex, explanation, sourceIds };
  });
  if (new Set(questions.map(q=>q.stem)).size !== 80) throw new Error("POL-CP-024 stems must be unique");
  if (new Set(questions.map(q=>q.explanation)).size !== 80) throw new Error("POL-CP-024 explanations must be unique");
  return questions;
}
