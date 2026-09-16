import type { PolCp014ReviewQuestion } from "./pol-cp014-review-types";
import { POL_CP014_SEEDS_A } from "./pol-cp014-seeds-a";
import { POL_CP014_SEEDS_B } from "./pol-cp014-seeds-b";
import { POL_CP014_SEEDS_C } from "./pol-cp014-seeds-c";
import { POL_CP014_SEEDS_D } from "./pol-cp014-seeds-d";

export function generatePolCp014ReviewBatchV1(): PolCp014ReviewQuestion[] {
  const seeds = [...POL_CP014_SEEDS_A, ...POL_CP014_SEEDS_B, ...POL_CP014_SEEDS_C, ...POL_CP014_SEEDS_D];
  const questions = seeds.map((seed,index):PolCp014ReviewQuestion => {
    const correctIndex = (index % 4) as 0|1|2|3;
    const options = [...seed.distractors] as string[];
    options.splice(correctIndex,0,seed.canonicalAnswer);
    if (options.length !== 4 || new Set(options).size !== 4) throw new Error(`Invalid options POL-CP014-V1-${index+1}`);
    return {
      questionId:`POL-CP014-V1-${String(index+1).padStart(3,"0")}`,
      qlId:seed.qlId,
      difficulty:seed.difficulty,
      stem:seed.stem,
      options:options as [string,string,string,string],
      correctIndex,
      canonicalAnswer:seed.canonicalAnswer,
      explanation:seed.explanation,
      sourceIds:seed.sourceIds,
      sourceFactIds:seed.sourceFactIds,
    };
  });

  if (questions.length !== 80) throw new Error(`Expected 80 questions, got ${questions.length}`);
  if (new Set(questions.map(q => q.stem)).size !== 80) throw new Error("Repeated substantive stem in POL-CP-014 V1");
  if (new Set(questions.map(q => q.explanation)).size !== 80) throw new Error("Repeated explanation in POL-CP-014 V1");

  for (const q of questions) {
    if (q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`Answer mismatch ${q.questionId}`);
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 13 || words > 32) throw new Error(`Explanation length ${q.questionId}: ${words}`);
    if (/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) throw new Error(`Generic clutter ${q.questionId}`);
    if (!q.stem.startsWith("Consider the following statements:") && !q.stem.endsWith("?")) throw new Error(`Incomplete stem ${q.questionId}`);
    if (!q.stem.startsWith("Consider the following statements:") && q.stem.trim().split(/\s+/).length > 30) throw new Error(`Stem too long ${q.questionId}`);
    if (/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:|\bis mainly under:$|\bis a:$/i.test(q.stem)) throw new Error(`Database-style stem ${q.questionId}`);
  }
  return questions;
}
