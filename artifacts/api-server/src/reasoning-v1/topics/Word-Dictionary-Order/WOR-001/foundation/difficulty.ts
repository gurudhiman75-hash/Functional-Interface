import { traceWorComparison } from "./lexical-comparator";
import type { WorClassicTaskKind, WorDifficulty, WorDifficultyFeatures, WorSortDirection } from "./types";

const inferenceBurden: Record<WorClassicTaskKind, number> = {
  SELECT_COMPLETE_ORDER: 0,
  SELECT_DESCENDING_ORDER: 0,
  SELECT_FIRST: 0,
  SELECT_LAST: 0,
  SELECT_KTH: 1,
  FIND_RANK: 1,
  SELECT_PREDECESSOR: 1,
  SELECT_SUCCESSOR: 1,
  SELECT_MIDDLE: 1,
  INSERT_WORD: 2,
  RANK_AFTER_INSERTION: 2,
  PREDECESSOR_AFTER_INSERTION: 2,
  FIND_MISPLACED_WORD: 3,
  FIND_INCORRECT_PAIR: 3,
  COMPLETE_PARTIAL_ORDER: 3,
};

export function calculateWorDifficultyFeatures(
  ascendingWords: readonly string[],
  direction: WorSortDirection,
  taskKind: WorClassicTaskKind,
): WorDifficultyFeatures {
  const traces = ascendingWords.slice(0, -1).map((word, index) => traceWorComparison(word, ascendingWords[index + 1]!));
  const depths = traces.map((trace) => trace.commonPrefixLength);
  const max = depths.length ? Math.max(...depths) : 0;
  const mean = depths.length ? depths.reduce((sum, value) => sum + value, 0) / depths.length : 0;
  const late = depths.filter((value) => value >= 3).length;
  const prefix = traces.filter((trace) => trace.decision !== "FIRST_DIFFERING_CHARACTER").length;
  const taskInferenceBurden = inferenceBurden[taskKind];
  const structuralDepth = Math.max(0, max - 1);
  const score = Math.max(0, ascendingWords.length - 4)
    + Math.round(mean)
    + structuralDepth
    + late
    + prefix * 2
    + taskInferenceBurden
    + (direction === "DESCENDING" ? 1 : 0);
  return {
    wordCount: ascendingWords.length,
    commonPrefixDepthMax: max,
    commonPrefixDepthMean: Number(mean.toFixed(2)),
    lateDecisionCount: late,
    prefixContainmentCount: prefix,
    reverseDirection: direction === "DESCENDING",
    taskInferenceBurden,
    score,
  };
}

export function classifyWorDifficulty(features: WorDifficultyFeatures): WorDifficulty {
  if (features.score <= 6) return "EASY";
  if (features.score <= 15) return "MEDIUM";
  return "HARD";
}
