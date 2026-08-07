import type { GeneratedParameters, ProbabilityDifficulty, ProbabilityTaskRegistryEntry } from "./types";

export interface ProbabilityDifficultyAssessment {
  difficulty: ProbabilityDifficulty;
  estimatedSteps: number;
  reason: string;
}

const EASY_MODES = new Set([
  "findDirectProbability",
  "findFavourableOutcomeCount",
  "findMissingEventCountFromProbability",
  "findTotalOutcomeCount",
  "identifyImpossibleCertainOrPossibleEvent",
  "findProbabilityFromSimpleFrequencyTable",
  "findComplementProbability",
  "findNoneProbability",
  "findCoinPatternProbability",
  "findSingleDieEventProbability",
  "findSpinnerEventProbability",
  "findReverseDiceOrSpinnerEventCount",
  "findRankProbability",
  "findSuitProbability",
  "findColourProbability",
  "findFaceCardProbability",
  "findCardPropertyIntersection",
  "findMissingDeckCountOrEventCount",
  "findSingleDrawColourProbability",
  "findMissingObjectCountFromProbability",
  "findConditionalCardProbability",
  "findConditionalNumberProbability",
  "findMutuallyExclusiveUnion",
  "findIndependentIntersection",
  "findRandomArrangementPropertyProbability",
]);

const HARD_MODES = new Set([
  "findPositionRestrictionProbability",
  "findNumberFormationProbability",
  "findCommitteeCompositionProbability",
  "findRestrictedSelectionProbability",
  "findReverseCountFromProbability",
  "findMixedEventExpressionProbability",
  "findMissingIntersectionOrUnionProbability",
]);

export function calibrateEntryDifficulty(entry: ProbabilityTaskRegistryEntry): ProbabilityDifficulty {
  if (EASY_MODES.has(entry.solveMode)) return "Easy";
  if (HARD_MODES.has(entry.solveMode)) return "Hard";
  return "Medium";
}

export function assessProbabilityDifficulty(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters): ProbabilityDifficultyAssessment {
  let difficulty = calibrateEntryDifficulty(entry);
  let estimatedSteps = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3;
  let reason = difficulty === "Easy" ? "One direct probability step." : difficulty === "Medium" ? "Two linked counting or probability steps." : "Several restrictions or counting decisions must be combined.";

  const draw = typeof parameters.draw === "number" ? parameters.draw : 0;
  const trials = typeof parameters.trials === "number" ? parameters.trials : typeof parameters.tosses === "number" ? parameters.tosses : 0;
  const committeeSize = typeof parameters.committeeSize === "number" ? parameters.committeeSize : 0;

  if (draw >= 3 && ["findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType"].includes(entry.solveMode)) {
    difficulty = "Hard";
    estimatedSteps = 3;
    reason = "A three-object selection needs more than one favourable composition or a complement.";
  } else if (trials >= 5 && ["findAtMostKSuccessSmallCase", "findExactlyKSuccessSmallCase"].includes(entry.solveMode)) {
    difficulty = "Hard";
    estimatedSteps = 3;
    reason = "Several binomial cases must be added.";
  } else if (committeeSize >= 4 && entry.cpId === "PRB-CP-008") {
    difficulty = "Hard";
    estimatedSteps = 3;
    reason = "The committee restriction requires multiple combination counts.";
  }

  return { difficulty, estimatedSteps, reason };
}
