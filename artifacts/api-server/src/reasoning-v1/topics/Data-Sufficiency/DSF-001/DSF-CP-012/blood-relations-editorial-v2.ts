import { generateDsfCp012BloodQuestion } from "./blood-relations-runtime-v2.ts";

export const DSF_CP012_BLOOD_EDITORIAL_VERSION = "DSF_CP012_BLOOD_EDITORIAL_V2" as const;

export function generateDsfCp012BloodReviewedQuestion(seed: number) {
  const question = generateDsfCp012BloodQuestion(seed);
  const difficulty = question.correctClass === "EACH_STATEMENT_ALONE"
    ? "Easy" as const
    : question.correctClass === "STATEMENT_I_ONLY" || question.correctClass === "STATEMENT_II_ONLY"
      ? "Medium" as const
      : "Hard" as const;
  return Object.freeze({
    ...question,
    editorialVersion: DSF_CP012_BLOOD_EDITORIAL_VERSION,
    difficulty,
  });
}

export function generateDsfCp012BloodReviewedBatch(seeds: readonly number[]) {
  return seeds.map((seed) => generateDsfCp012BloodReviewedQuestion(seed));
}
