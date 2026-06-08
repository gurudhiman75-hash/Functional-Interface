import { getQuestionLanguageEntry, getQuestionLanguageEntries, getTopology } from "./library";
import { formatNumberList, hcfOf } from "./math";
import {
  NS_HCF_001_ARCHETYPE_ID,
  NS_HCF_001_CP_001,
  NS_HCF_001_CP_002,
  NS_HCF_001_CP_003,
  NS_HCF_001_CP_004,
  type NsHcf001CanonicalProblemId,
  type NsHcf001Cp003Family,
  type NsHcf001DifficultyBand,
  type NsHcf001Parameters,
} from "./types";

export interface NsHcf001ParameterInput {
  seed?: string;
  difficultyBand?: NsHcf001DifficultyBand;
  questionLanguageId?: string;
  numbers?: number[];
  candidateValues?: number[];
  knownOperands?: number[];
  targetHcf?: number;
  cp003Family?: NsHcf001Cp003Family;
}

interface Cp003Fixture {
  qlIds: string[];
  family: NsHcf001Cp003Family;
  knownOperands: number[];
  targetHcf: number;
  answer: number;
  candidateValues: number[];
  rangeStart?: number;
  rangeEnd?: number;
  numberList?: number[];
  divisibleBy?: number;
  notDivisibleBy?: number;
  baseNumber?: number;
  increase?: number;
  decrease?: number;
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

export function generateCp001Parameters(input: NsHcf001ParameterInput = {}) {
  return generateParameters(NS_HCF_001_CP_001, input);
}
export function generateCp002Parameters(input: NsHcf001ParameterInput = {}) {
  return generateParameters(NS_HCF_001_CP_002, input);
}
export function generateCp003Parameters(input: NsHcf001ParameterInput = {}) {
  return generateParameters(NS_HCF_001_CP_003, input);
}
export function generateCp004Parameters(input: NsHcf001ParameterInput = {}) {
  return generateParameters(NS_HCF_001_CP_004, input);
}

export function generateParameters(canonicalProblemId: NsHcf001CanonicalProblemId, input: NsHcf001ParameterInput = {}): NsHcf001Parameters {
  const seed = input.seed ?? `NS-HCF-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, questionLanguageId);

  if (canonicalProblemId === NS_HCF_001_CP_001 || canonicalProblemId === NS_HCF_001_CP_002) {
    return { ...base, numbers: input.numbers ?? selectNumbers(seed, difficultyBand) };
  }

  if (canonicalProblemId === NS_HCF_001_CP_003) {
    return { ...base, ...selectCp003(seed, questionLanguageId, input) };
  }

  const text = getQuestionLanguageEntry(canonicalProblemId, questionLanguageId).text;
  return { ...base, numbers: extractIntegers(text), contextQuantities: extractIntegers(text) };
}

function baseParameters(
  canonicalProblemId: NsHcf001CanonicalProblemId,
  difficultyBand: NsHcf001DifficultyBand,
  seed: string,
  questionLanguageId: string,
): Omit<NsHcf001Parameters, "numbers"> {
  return {
    archetypeId: NS_HCF_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-HCF-001:${canonicalProblemId}:${seed}`,
    sourceTrace: {
      sourceId: "NS-HCF-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package",
      note: "Approved CP-001 through CP-004 implementation.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    questionLanguageId,
  };
}

function selectDifficultyBand(seed: string): NsHcf001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQuestionLanguageId(canonicalProblemId: NsHcf001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectNumbers(seed: string, difficultyBand: NsHcf001DifficultyBand) {
  const pools: Record<NsHcf001DifficultyBand, number[][]> = {
    Easy: [
      [24, 36],
      [18, 30, 42],
      [35, 64],
      [48, 72],
      [45, 60],
    ],
    Medium: [
      [84, 126],
      [72, 108, 180],
      [96, 144],
      [125, 175, 225],
      [81, 128],
    ],
    Hard: [
      [252, 378, 630],
      [360, 540],
      [420, 630, 840],
      [512, 729],
      [924, 1386],
    ],
  };
  const pool = pools[difficultyBand];
  return pool[stableBucket(`${seed}:numbers`, pool.length)];
}

function selectCp003(seed: string, questionLanguageId: string, input: NsHcf001ParameterInput) {
  if (input.knownOperands && input.targetHcf && input.numbers) {
    const answer = input.numbers[0];
    return {
      numbers: [...input.knownOperands, answer],
      knownOperands: input.knownOperands,
      targetHcf: input.targetHcf,
      cp003Family: input.cp003Family ?? "exam_mixed",
      missingNumber: answer,
      candidateValues: input.candidateValues ?? [answer],
    };
  }

  const fixtures = CP003_FIXTURES.filter((fixture) => fixture.qlIds.includes(questionLanguageId));
  const fixture = fixtures[stableBucket(`${seed}:cp003-fixture`, fixtures.length)];
  const candidateValues = fixture.candidateValues;
  return {
    numbers: [...fixture.knownOperands, fixture.answer],
    knownOperands: fixture.knownOperands,
    targetHcf: fixture.targetHcf,
    cp003Family: cp003FamilyFromQuestionLanguageId(questionLanguageId),
    missingNumber: fixture.answer,
    candidateValues,
    rangeStart: fixture.rangeStart,
    rangeEnd: fixture.rangeEnd,
    numberList: fixture.numberList ? formatNumberList(fixture.numberList) : undefined,
    divisibleBy: fixture.divisibleBy,
    notDivisibleBy: fixture.notDivisibleBy,
    baseNumber: fixture.baseNumber,
    increase: fixture.increase,
    decrease: fixture.decrease,
  };
}

function extractIntegers(text: string) {
  return [...text.matchAll(/\d+/g)].map((match) => Number(match[0]));
}

const CP003_FIXTURES: Cp003Fixture[] = [
  { qlIds: ["QL-016", "QL-017", "QL-018", "QL-019", "QL-020", "QL-036", "QL-039"], family: "bounded_range", knownOperands: [72], targetHcf: 12, answer: 60, candidateValues: [60, 72], rangeStart: 60, rangeEnd: 80 },
  { qlIds: ["QL-016", "QL-017", "QL-018", "QL-019", "QL-020", "QL-036", "QL-039"], family: "bounded_range", knownOperands: [54], targetHcf: 18, answer: 126, candidateValues: [108, 126], rangeStart: 100, rangeEnd: 130 },
  { qlIds: ["QL-016", "QL-017", "QL-018", "QL-019", "QL-020", "QL-036", "QL-039"], family: "bounded_range", knownOperands: [96], targetHcf: 24, answer: 120, candidateValues: [120, 132, 144], rangeStart: 120, rangeEnd: 150 },
  { qlIds: ["QL-021", "QL-022", "QL-023", "QL-024", "QL-025", "QL-037", "QL-040"], family: "candidate_set", knownOperands: [36], targetHcf: 12, answer: 48, candidateValues: [48, 54, 72, 90], numberList: [48, 54, 72, 90] },
  { qlIds: ["QL-021", "QL-022", "QL-023", "QL-024", "QL-025", "QL-037", "QL-040"], family: "candidate_set", knownOperands: [30], targetHcf: 15, answer: 75, candidateValues: [40, 60, 75, 90], numberList: [40, 60, 75, 90] },
  { qlIds: ["QL-021", "QL-022", "QL-023", "QL-024", "QL-025", "QL-037", "QL-040"], family: "candidate_set", knownOperands: [42], targetHcf: 14, answer: 56, candidateValues: [56, 63, 84, 100], numberList: [56, 63, 84, 100] },
  { qlIds: ["QL-026", "QL-027", "QL-028", "QL-029", "QL-030", "QL-038"], family: "divisibility_restriction", knownOperands: [36], targetHcf: 18, answer: 18, candidateValues: [18, 36], divisibleBy: 18, notDivisibleBy: 36 },
  { qlIds: ["QL-026", "QL-027", "QL-028", "QL-029", "QL-030", "QL-038"], family: "divisibility_restriction", knownOperands: [40], targetHcf: 20, answer: 20, candidateValues: [20, 40], divisibleBy: 20, notDivisibleBy: 40 },
  { qlIds: ["QL-026", "QL-027", "QL-028", "QL-029", "QL-030", "QL-038"], family: "divisibility_restriction", knownOperands: [60], targetHcf: 15, answer: 15, candidateValues: [15, 30, 45, 60], divisibleBy: 15, notDivisibleBy: 45 },
  { qlIds: ["QL-031", "QL-033", "QL-035"], family: "arithmetic_restriction", knownOperands: [84], targetHcf: 12, answer: 120, candidateValues: [120], baseNumber: 100, increase: 20 },
  { qlIds: ["QL-032", "QL-034"], family: "arithmetic_restriction", knownOperands: [45], targetHcf: 15, answer: 120, candidateValues: [120], baseNumber: 150, decrease: 30 },
  { qlIds: ["QL-031", "QL-033", "QL-035"], family: "arithmetic_restriction", knownOperands: [50], targetHcf: 10, answer: 120, candidateValues: [120], baseNumber: 95, increase: 25 },
];

export function cp003FamilyFromQuestionLanguageId(questionLanguageId: string): NsHcf001Cp003Family {
  const idNumber = Number(questionLanguageId.slice(3));
  if (idNumber >= 16 && idNumber <= 20) return "bounded_range";
  if (idNumber >= 21 && idNumber <= 25) return "candidate_set";
  if (idNumber >= 26 && idNumber <= 30) return "divisibility_restriction";
  if (idNumber >= 31 && idNumber <= 35) return "arithmetic_restriction";
  return "exam_mixed";
}
