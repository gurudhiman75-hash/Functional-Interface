import { getQuestionLanguageEntries } from "./library";
import { NS_EXP_001_ARCHETYPE_ID, type NsExp001CanonicalProblemId, type NsExp001DifficultyBand, type NsExp001Parameters } from "./types";

export interface NsExp001ParameterInput {
  seed?: string;
  difficultyBand?: NsExp001DifficultyBand;
  questionLanguageId?: string;
}

const ES_BY_CP: Record<NsExp001CanonicalProblemId, string> = {
  CP01: "ES-001",
  CP02: "ES-002",
  CP03: "ES-003",
  CP04: "ES-004",
  CP05: "ES-005",
  CP06: "ES-006",
  CP07: "ES-007",
  CP09: "ES-008",
};

const FIXTURES: Record<NsExp001CanonicalProblemId, { expression: string; answer: string; coverageBucket: string; operationType?: string; comparisonMode?: string }[]> = {
  CP01: [
    { expression: "2^5 x 2^3", answer: "2^8", coverageBucket: "multiplicationLaw", operationType: "multiplication" },
    { expression: "3^7 / 3^2", answer: "3^5", coverageBucket: "divisionLaw", operationType: "division" },
    { expression: "(5^2)^3", answer: "5^6", coverageBucket: "powerLaw", operationType: "powerOfPower" },
    { expression: "7^6 x 7^2 / 7^3", answer: "7^5", coverageBucket: "mixedCompression", operationType: "mixed" },
  ],
  CP02: [
    { expression: "2^x = 2^9", answer: "9", coverageBucket: "directEquality", operationType: "directEquality" },
    { expression: "3^(x+2) = 3^8", answer: "6", coverageBucket: "linearEquation", operationType: "linearEquation" },
    { expression: "5^(2x-1) = 5^7", answer: "4", coverageBucket: "coefficientEquation", operationType: "coefficientEquation" },
  ],
  CP03: [
    { expression: "8^3 / 2^5", answer: "2^4", coverageBucket: "baseConversionSimplification", operationType: "simplification" },
    { expression: "4^5 vs 2^11", answer: "2^11", coverageBucket: "baseConversionComparison", operationType: "comparison", comparisonMode: "greater" },
    { expression: "4^x = 2^10", answer: "5", coverageBucket: "baseConversionEquation", operationType: "equation" },
  ],
  CP04: [
    { expression: "2^-3", answer: "1/8", coverageBucket: "reciprocalForm", operationType: "reciprocal" },
    { expression: "3^4 x 3^-2", answer: "3^2", coverageBucket: "exponentCombination", operationType: "combination" },
  ],
  CP05: [
    { expression: "16^(1/2)", answer: "4", coverageBucket: "squareRootConversion", operationType: "squareRoot" },
    { expression: "27^(1/3)", answer: "3", coverageBucket: "cubeRootConversion", operationType: "cubeRoot" },
    { expression: "81^(3/4)", answer: "27", coverageBucket: "fractionalPowerEvaluation", operationType: "fractionalPower" },
  ],
  CP06: [
    { expression: "8^2 x 2^-3 / 4", answer: "2^1", coverageBucket: "mixedNegative", operationType: "mixedNegative" },
    { expression: "(9^(1/2))^3 / 3^2", answer: "3", coverageBucket: "mixedFractional", operationType: "mixedFractional" },
    { expression: "16^(3/4) / 2^-1", answer: "16", coverageBucket: "mixedComposite", operationType: "mixedComposite" },
  ],
  CP07: [
    { expression: "2^10 or 4^5", answer: "equal", coverageBucket: "comparison", comparisonMode: "pairComparison" },
    { expression: "2^8, 4^3, 8^2", answer: "4^3, 8^2, 2^8", coverageBucket: "ordering", comparisonMode: "ordering" },
    { expression: "16^3, 8^4, 2^13", answer: "2^13", coverageBucket: "greatestSelection", comparisonMode: "greatest" },
    { expression: "9^4, 27^3, 3^10", answer: "9^4", coverageBucket: "leastSelection", comparisonMode: "least" },
  ],
  CP09: [
    { expression: "2^x=8; 2^(x+2)", answer: "32", coverageBucket: "exponentIncrease", operationType: "increase" },
    { expression: "3^a=9; 3^(a-1)", answer: "3", coverageBucket: "exponentDecrease", operationType: "decrease" },
    { expression: "5^x=25; 5^(2x)", answer: "625", coverageBucket: "exponentMultiplication", operationType: "multiplication" },
  ],
};

export function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableBucket(seed: string, modulo: number) {
  return modulo <= 0 ? 0 : hashSeed(seed) % modulo;
}

export function generateNsExp001Parameters(cpId: NsExp001CanonicalProblemId, input: NsExp001ParameterInput = {}): NsExp001Parameters {
  const seed = input.seed ?? `NS-EXP-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficulty(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQl(cpId, seed);
  const fixture = FIXTURES[cpId][stableBucket(`${seed}:fixture`, FIXTURES[cpId].length)];
  return {
    archetypeId: NS_EXP_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `NS-EXP-001:${cpId}:${seed}`,
    difficultyBand,
    questionLanguageId,
    explanationId: ES_BY_CP[cpId],
    ...fixture,
    expectedAnswer: fixture.answer,
  };
}

function selectDifficulty(seed: string): NsExp001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQl(cpId: NsExp001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(cpId);
  const indexMatch = seed.match(/:(\d+)$/);
  const index = indexMatch ? Number(indexMatch[1]) % entries.length : stableBucket(`${seed}:ql`, entries.length);
  return entries[index].id;
}
