import { getQuestionLanguageEntries } from "./library";
import { NS_CLASS_001_ARCHETYPE_ID, type NsClass001CanonicalProblemId, type NsClass001DifficultyBand, type NsClass001Parameters } from "./types";

export interface NsClass001ParameterInput {
  seed?: string;
  difficultyBand?: NsClass001DifficultyBand;
  questionLanguageId?: string;
}

type Fixture = Omit<NsClass001Parameters, "archetypeId" | "canonicalProblemId" | "questionId" | "difficultyBand" | "questionLanguageId" | "explanationId">;

const ES_BY_CP: Record<NsClass001CanonicalProblemId, string> = {
  CP01: "ES-001",
  CP02: "ES-002",
  CP03: "ES-003",
  CP04: "ES-004",
  CP05: "ES-005",
  CP06: "ES-006",
};

const RP_BY_CP: Record<NsClass001CanonicalProblemId, Fixture["reasoningPatternId"]> = {
  CP01: "RP01",
  CP02: "RP02",
  CP03: "RP03",
  CP04: "RP04",
  CP05: "RP05",
  CP06: "RP06",
};

const FIXTURES: Record<NsClass001CanonicalProblemId, Fixture[]> = {
  CP01: [
    f("even", "evenResult", "additionParity", "addition"), f("odd", "oddResult", "additionParity", "addition"), f("odd", "oddResult", "subtractionParity", "subtraction"), f("even", "evenResult", "multiplicationParity", "multiplication"), f("odd", "oddResult", "multiplicationParity", "multiplication"),
    f("odd", "oddResult", "additionParity", "addition"), f("odd", "oddResult", "powerParity", "power"), f("odd", "oddResult", "additionParity", "addition"), f("even", "evenResult", "multiplicationParity", "multiplication"), f("odd", "oddResult", "additionParity", "addition"),
    f("even", "evenResult", "additionParity", "addition"), f("even", "evenResult", "mixedParityOperations", "mixed"), f("odd", "oddResult", "mixedParityOperations", "mixed"), f("even", "evenResult", "mixedParityOperations", "mixed"), f("odd", "oddResult", "mixedParityOperations", "mixed"),
    f("even", "evenResult", "multiplicationParity", "multiplication"), f("odd", "oddResult", "powerParity", "power"), f("even", "evenResult", "subtractionParity", "subtraction"), f("odd", "oddResult", "mixedParityOperations", "mixed"), f("odd", "oddResult", "additionParity", "addition"),
  ],
  CP02: [
    f("negative", "negativeResult", "productSign", "product"), f("positive", "positiveResult", "productSign", "product"), f("positive", "positiveResult", "productSign", "product"), f("positive", "positiveResult", "powerSign", "power"), f("negative", "negativeResult", "powerSign", "power"),
    f("negative", "negativeResult", "productSign", "product"), f("positive", "positiveResult", "powerSign", "power"), f("negative", "negativeResult", "quotientSign", "quotient"), f("positive", "positiveResult", "quotientSign", "quotient"), f("negative", "negativeResult", "powerSign", "power"),
    f("positive", "positiveResult", "powerSign", "power"), f("positive", "positiveResult", "productSign", "product"), f("negative", "negativeResult", "productSign", "product"), f("zero", "zeroResult", "zeroCases", "zero"), f("negative", "negativeResult", "zeroCases", "sum"),
    f("negative", "negativeResult", "zeroCases", "subtraction"), f("negative", "negativeResult", "powerSign", "mixed"), f("positive", "positiveResult", "quotientSign", "quotient"), f("negative", "negativeResult", "zeroCases", "subtraction"), f("negative", "negativeResult", "powerSign", "power"),
  ],
  CP03: [
    f("2", "sequenceProperty", "consecutiveIntegers", "property", "consecutiveIntegers"), f("1", "sequenceProperty", "consecutiveIntegers", "property", "consecutiveIntegers"), f("12", "sumProperty", "consecutiveIntegers", "sum", "consecutiveIntegers"), f("15, 16, 17", "sumProperty", "consecutiveIntegers", "sum", "consecutiveIntegers"), f("none", "sequenceProperty", "consecutiveIntegers", "property", "consecutiveIntegers"),
    f("20 and 21", "sumProperty", "consecutiveIntegers", "sum", "consecutiveIntegers"), f("20", "missingElement", "missingTerm", "missing", "consecutiveIntegers"), f("6", "productProperty", "consecutiveIntegers", "product", "consecutiveIntegers"), f("12, 14, 16", "sumProperty", "consecutiveEvenIntegers", "sum", "consecutiveEvenIntegers"), f("15", "sumProperty", "consecutiveOddIntegers", "sum", "consecutiveOddIntegers"),
    f("40", "sequenceProperty", "consecutiveEvenIntegers", "next", "consecutiveEvenIntegers"), f("49", "sequenceProperty", "consecutiveOddIntegers", "previous", "consecutiveOddIntegers"), f("34", "sumProperty", "consecutiveEvenIntegers", "sum", "consecutiveEvenIntegers"), f("33", "sumProperty", "consecutiveOddIntegers", "sum", "consecutiveOddIntegers"), f("50", "sumProperty", "consecutiveIntegers", "sum", "consecutiveIntegers"),
    f("even", "productProperty", "consecutiveIntegers", "product", "consecutiveIntegers"), f("3x", "sumProperty", "consecutiveIntegers", "sum", "consecutiveIntegers"), f("25", "sumProperty", "consecutiveIntegers", "sum", "consecutiveIntegers"), f("8", "productProperty", "consecutiveEvenIntegers", "product", "consecutiveEvenIntegers"), f("odd", "productProperty", "consecutiveOddIntegers", "product", "consecutiveOddIntegers"),
    f("33", "missingElement", "missingTerm", "missing", "consecutiveOddIntegers"), f("46", "missingElement", "missingTerm", "missing", "consecutiveEvenIntegers"), f("26 and 28", "missingElement", "consecutiveIntegers", "missing", "consecutiveIntegers"), f("32", "sumProperty", "consecutiveEvenIntegers", "sum", "consecutiveEvenIntegers"), f("23", "sumProperty", "consecutiveOddIntegers", "sum", "consecutiveOddIntegers"),
  ],
  CP04: [
    f("25", "countEven", "rangeCount", "range", undefined, "range"), f("10", "countOdd", "rangeCount", "range", undefined, "range"), f("3", "countPositive", "listCount", "list", undefined, "list"), f("3", "countNegative", "listCount", "list", undefined, "list"), f("6", "countPositive", "rangeCount", "range", undefined, "range"),
    f("3", "countEven", "listCount", "list", undefined, "list"), f("3", "countOdd", "listCount", "list", undefined, "list"), f("10", "countOdd", "rangeCount", "range", undefined, "range"), f("50", "countEven", "rangeCount", "range", undefined, "range"), f("13", "countOdd", "rangeCount", "range", undefined, "range"),
    f("10", "countNegative", "rangeCount", "range", undefined, "range"), f("10", "countNegative", "rangeCount", "range", undefined, "range"), f("4", "countPositive", "listCount", "list", undefined, "list"), f("9", "countOdd", "rangeCount", "range", undefined, "range"), f("15", "countEven", "rangeCount", "range", undefined, "range"),
    f("3", "countPositive", "listCount", "list", undefined, "list"), f("15", "countEven", "rangeCount", "range", undefined, "range"), f("10", "countNegative", "rangeCount", "range", undefined, "range"), f("45", "countOdd", "rangeCount", "range", undefined, "range"), f("5", "countEven", "rangeCount", "range", undefined, "range"),
    f("3", "countOdd", "listCount", "list", undefined, "list"), f("9", "countNegative", "rangeCount", "range", undefined, "range"), f("14", "countEven", "rangeCount", "range", undefined, "range"), f("25", "countEven", "rangeCount", "range", undefined, "range"), f("26", "countOdd", "rangeCount", "range", undefined, "range"),
  ],
  CP05: [
    f("even", "parityBased", "parityClassification", "classification"), f("n is odd", "indirectProperty", "conditionInference", "classification"), f("negative integer", "signBased", "signClassification", "classification"), f("positive even integer", "combinedProperty", "combinedClassification", "classification"), f("even", "parityBased", "parityClassification", "classification"),
    f("even", "parityBased", "parityClassification", "classification"), f("zero", "signBased", "signClassification", "classification"), f("positive odd integer", "combinedProperty", "combinedClassification", "classification"), f("negative even integer", "combinedProperty", "combinedClassification", "classification"), f("odd", "parityBased", "parityClassification", "classification"),
    f("odd", "parityBased", "parityClassification", "classification"), f("negative even integer", "combinedProperty", "combinedClassification", "classification"), f("n is even", "indirectProperty", "conditionInference", "classification"), f("positive odd integer", "combinedProperty", "combinedClassification", "classification"), f("positive", "signBased", "signClassification", "classification"),
    f("positive", "signBased", "signClassification", "classification"), f("odd", "parityBased", "parityClassification", "classification"), f("even", "parityBased", "parityClassification", "classification"), f("odd", "combinedProperty", "conditionInference", "classification"), f("negative odd integer", "combinedProperty", "combinedClassification", "classification"),
    f("positive even integer", "combinedProperty", "combinedClassification", "classification"), f("negative odd integer", "combinedProperty", "combinedClassification", "classification"), f("0", "indirectProperty", "conditionInference", "classification"), f("odd", "parityBased", "conditionInference", "classification"), f("even", "parityBased", "conditionInference", "classification"),
  ],
  CP06: [
    f("14", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveIntegers"), f("21 or 23", "multipleConstraints", "parityConstraint", "elimination", undefined, "candidate", 2, false), f("x is odd", "directMissingValue", "parityConstraint", "constraint"), f("33", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveOddIntegers"), f("48", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveEvenIntegers"),
    f("-7", "directMissingValue", "signConstraint", "missing"), f("6", "directMissingValue", "signConstraint", "missing"), f("20", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveEvenIntegers"), f("43", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveOddIntegers"), f("any positive even integer", "multipleConstraints", "mixedConstraint", "constraint", undefined, "candidate", 2, false),
    f("5 or 7", "eliminationMethod", "parityConstraint", "elimination", undefined, "candidate", 2, false), f("12", "directMissingValue", "mixedConstraint", "missing"), f("-9", "directMissingValue", "signConstraint", "missing"), f("16 or 18", "multipleConstraints", "mixedConstraint", "elimination", undefined, "candidate", 2, false), f("27", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveIntegers"),
    f("25", "directMissingValue", "parityConstraint", "missing"), f("26", "directMissingValue", "parityConstraint", "missing"), f("-4", "directMissingValue", "signConstraint", "missing"), f("x is odd", "directMissingValue", "parityConstraint", "constraint"), f("56", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveIntegers"),
    f("3", "eliminationMethod", "mixedConstraint", "elimination"), f("32", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveEvenIntegers"), f("61", "directMissingValue", "consecutiveConstraint", "missing", "consecutiveOddIntegers"), f("-3", "eliminationMethod", "mixedConstraint", "elimination"), f("0", "directMissingValue", "mixedConstraint", "missing"),
  ],
};

function f(answer: string, coverageBucket: string, variableRange: string, operationType?: string, sequenceType?: string, inputShape?: string, candidateCount = 1, uniqueAnswer = true): Fixture {
  return { answer, coverageBucket, variableRange, operationType, sequenceType, inputShape, propertyType: coverageBucket, candidateCount, uniqueAnswer, reasoningPatternId: "RP01" };
}

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

export function generateNsClass001Parameters(cpId: NsClass001CanonicalProblemId, input: NsClass001ParameterInput = {}): NsClass001Parameters {
  const seed = input.seed ?? `NS-CLASS-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficulty(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQl(cpId, seed);
  const fixture = FIXTURES[cpId][qlIndex(cpId, questionLanguageId)];
  return {
    archetypeId: NS_CLASS_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `NS-CLASS-001:${cpId}:${seed}`,
    difficultyBand,
    questionLanguageId,
    explanationId: ES_BY_CP[cpId],
    ...fixture,
    reasoningPatternId: RP_BY_CP[cpId],
  };
}

function selectDifficulty(seed: string): NsClass001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQl(cpId: NsClass001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(cpId);
  const indexMatch = seed.match(/:(\d+)$/);
  const index = indexMatch ? Number(indexMatch[1]) % entries.length : stableBucket(`${seed}:ql`, entries.length);
  return entries[index].id;
}

function qlIndex(cpId: NsClass001CanonicalProblemId, questionLanguageId: string) {
  const entries = getQuestionLanguageEntries(cpId);
  const index = entries.findIndex((entry) => entry.id === questionLanguageId);
  if (index < 0) throw new Error(`Question language ${questionLanguageId} not approved for ${cpId}.`);
  return index;
}
