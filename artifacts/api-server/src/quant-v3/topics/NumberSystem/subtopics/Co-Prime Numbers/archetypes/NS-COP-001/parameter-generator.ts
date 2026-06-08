import { getQuestionLanguageEntries, getTopology } from "./library";
import { formatNumberList } from "./math";
import {
  NS_COP_001_ARCHETYPE_ID,
  NS_COP_001_CP_001,
  NS_COP_001_CP_002,
  NS_COP_001_CP_003,
  NS_COP_001_CP_004,
  NS_COP_001_CP_005,
  NS_COP_001_CP_006,
  type NsCop001CanonicalProblemId,
  type NsCop001DifficultyBand,
  type NsCop001Parameters,
} from "./types";

export interface NsCop001ParameterInput {
  seed?: string;
  difficultyBand?: NsCop001DifficultyBand;
  questionLanguageId?: string;
  a?: number;
  b?: number;
  number?: number;
  nextNumber?: number;
  targetNumber?: number;
  numberList?: number[];
  numberSet?: number[];
  candidateSet?: number[];
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
  if (modulo <= 0) return 0;
  return hashSeed(seed) % modulo;
}

export function generateCp001Parameters(input: NsCop001ParameterInput = {}) { return generateParameters(NS_COP_001_CP_001, input); }
export function generateCp002Parameters(input: NsCop001ParameterInput = {}) { return generateParameters(NS_COP_001_CP_002, input); }
export function generateCp003Parameters(input: NsCop001ParameterInput = {}) { return generateParameters(NS_COP_001_CP_003, input); }
export function generateCp004Parameters(input: NsCop001ParameterInput = {}) { return generateParameters(NS_COP_001_CP_004, input); }
export function generateCp005Parameters(input: NsCop001ParameterInput = {}) { return generateParameters(NS_COP_001_CP_005, input); }
export function generateCp006Parameters(input: NsCop001ParameterInput = {}) { return generateParameters(NS_COP_001_CP_006, input); }

export function generateParameters(canonicalProblemId: NsCop001CanonicalProblemId, input: NsCop001ParameterInput = {}): NsCop001Parameters {
  const seed = input.seed ?? `NS-COP-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, questionLanguageId);
  if (canonicalProblemId === NS_COP_001_CP_001) return { ...base, ...selectCp001(seed, questionLanguageId, input) };
  if (canonicalProblemId === NS_COP_001_CP_002) return { ...base, ...selectCp002(seed, input) };
  if (canonicalProblemId === NS_COP_001_CP_003) return { ...base, ...selectCp003(seed, input) };
  if (canonicalProblemId === NS_COP_001_CP_004) return { ...base, ...selectCp004(seed, input) };
  if (canonicalProblemId === NS_COP_001_CP_005) return { ...base, ...selectCp005(seed, input) };
  return { ...base, ...selectCp006(seed, input) };
}

function baseParameters(canonicalProblemId: NsCop001CanonicalProblemId, difficultyBand: NsCop001DifficultyBand, seed: string, questionLanguageId: string) {
  return {
    archetypeId: NS_COP_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-COP-001:${canonicalProblemId}:${seed}`,
    sourceTrace: { sourceId: "NS-COP-001-FULL-IMPLEMENTATION", sourceType: "approved-library-package" as const, note: "Approved CP-001 through CP-006 implementation." },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    questionLanguageId,
  };
}

function selectDifficultyBand(seed: string): NsCop001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQuestionLanguageId(canonicalProblemId: NsCop001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectCp001(seed: string, questionLanguageId: string, input: NsCop001ParameterInput) {
  const fixtures = [
    { a: 13, b: 17, generationBucket: "primeAndPrime" as const },
    { a: 13, b: 28, generationBucket: "primeAndComposite" as const },
    { a: 14, b: 25, generationBucket: "coprime" as const },
    { a: 18, b: 30, generationBucket: "compositeAndComposite" as const },
    { a: 35, b: 36, generationBucket: "consecutiveNumbers" as const },
    { a: 8, b: 32, generationBucket: "powerRelationship" as const },
    { a: 21, b: 35, generationBucket: "commonFactorGreaterThanOne" as const },
  ];
  const fixture = fixtures[stableBucket(`${seed}:cp001`, fixtures.length)];
  return { a: input.a ?? fixture.a, b: input.b ?? fixture.b, generationBucket: fixture.generationBucket, cp001AnswerType: cp001AnswerType(questionLanguageId) };
}

function cp001AnswerType(questionLanguageId: string) {
  if (["QL-002", "QL-004", "QL-029"].includes(questionLanguageId)) return "hcfValue" as const;
  if (["QL-003", "QL-030"].includes(questionLanguageId)) return "commonFactorCount" as const;
  if (["QL-005", "QL-031", "QL-032"].includes(questionLanguageId)) return "categorySelection" as const;
  return "coprimeClassification" as const;
}

function selectCp002(seed: string, input: NsCop001ParameterInput) {
  const fixtures = [
    { targetNumber: 12, numberList: [5, 6, 7], listLength: "shortList" as const },
    { targetNumber: 18, numberList: [5, 6, 7, 12, 25], listLength: "mediumList" as const },
    { targetNumber: 30, numberList: [7, 8, 9, 11, 12, 13, 14, 25], listLength: "longList" as const },
  ];
  const fixture = fixtures[stableBucket(`${seed}:cp002`, fixtures.length)];
  return { targetNumber: input.targetNumber ?? fixture.targetNumber, numberList: input.numberList ?? fixture.numberList, listLength: fixture.listLength };
}

function selectCp003(seed: string, input: NsCop001ParameterInput) {
  const fixtures = [
    { number: 12, candidateSet: [6, 8, 25, 30] },
    { number: 17, candidateSet: [34, 51, 68, 20] },
    { number: 45, candidateSet: [15, 27, 28, 30] },
  ];
  const fixture = fixtures[stableBucket(`${seed}:cp003`, fixtures.length)];
  return { number: input.number ?? fixture.number, candidateSet: input.candidateSet ?? fixture.candidateSet };
}

function selectCp004(seed: string, input: NsCop001ParameterInput) {
  const fixtures = [
    { numberSet: [6, 10, 15], setSize: "smallSet" as const },
    { numberSet: [6, 10, 25, 49], setSize: "mediumSet" as const },
    { numberSet: [6, 10, 14, 15, 21, 35], setSize: "largeSet" as const },
    { numberSet: [6, 10, 14], setSize: "smallSet" as const },
  ];
  const fixture = fixtures[stableBucket(`${seed}:cp004`, fixtures.length)];
  return { numberSet: input.numberSet ?? fixture.numberSet, setSize: fixture.setSize };
}

function selectCp005(seed: string, input: NsCop001ParameterInput) {
  const number = input.number ?? (stableBucket(`${seed}:cp005`, 2) === 0 ? 35 : 120);
  return { number, nextNumber: input.nextNumber ?? number + 1 };
}

function selectCp006(seed: string, input: NsCop001ParameterInput) {
  const fixtures = [
    { a: 7, b: 11, ratioType: "alreadyReduced" as const },
    { a: 18, b: 30, ratioType: "reducibleOnce" as const },
    { a: 48, b: 72, ratioType: "reducibleMultipleFactors" as const },
    { a: 24, b: 24, ratioType: "equalTerms" as const },
    { a: 120, b: 180, ratioType: "largeHcf" as const },
  ];
  const fixture = fixtures[stableBucket(`${seed}:cp006`, fixtures.length)];
  return { a: input.a ?? fixture.a, b: input.b ?? fixture.b, ratioType: fixture.ratioType };
}
