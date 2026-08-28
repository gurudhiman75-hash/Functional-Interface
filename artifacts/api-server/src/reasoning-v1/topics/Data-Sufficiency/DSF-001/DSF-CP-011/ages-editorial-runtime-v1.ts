import {
  generateDsfCp011AgesQuestion,
  normalizeDsfCp011AgesSurface,
} from "./ages-runtime-v1.ts";

export const DSF_CP011_AGES_EDITORIAL_VERSION = "DSF_CP011_AGES_EDITORIAL_V1" as const;

export { normalizeDsfCp011AgesSurface };

export function realizeDsfCp011AgesDifficulty(seed: number) {
  const question = generateDsfCp011AgesQuestion(seed);
  const hasDirectExactAgeStatement = question.statements.some(
    (statement) => statement.statementFamily === "EXACT_AGE",
  );
  const directSingleStatementClass = [
    "STATEMENT_I_ONLY",
    "STATEMENT_II_ONLY",
    "EACH_STATEMENT_ALONE",
  ].includes(question.canonicalAnswer);

  return Object.freeze({
    ...question,
    editorialVersion: DSF_CP011_AGES_EDITORIAL_VERSION,
    difficulty: directSingleStatementClass && hasDirectExactAgeStatement
      ? "Easy" as const
      : question.difficulty,
  });
}

export function generateDsfCp011AgesEditorialBatch(seeds: readonly number[]) {
  return seeds.map(realizeDsfCp011AgesDifficulty);
}
