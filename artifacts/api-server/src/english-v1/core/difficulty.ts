import type { DifficultyDimensions, EnglishDifficulty } from "./types";

/**
 * Structural difficulty deliberately excludes lexical load from the score.
 * English Hard questions should become hard through dependency, interaction
 * and distractor structure rather than obscure vocabulary.
 */
export function structuralDifficultyScore(d: DifficultyDimensions): number {
  return d.ruleComplexity + d.dependencyDistance + d.distractorSimilarity + d.sentenceLength + d.ruleInteraction;
}

export function classifyEnglishDifficulty(d: DifficultyDimensions): EnglishDifficulty {
  const score = structuralDifficultyScore(d);
  if (score <= 8) return "easy";
  if (score <= 14) return "medium";
  return "hard";
}
