import { getQuestionLanguageEntry, getQuestionLanguageEntries, getTopology } from "./library";
import { formatNumberList, lcmOf } from "./math";
import {
  NS_LCM_001_ARCHETYPE_ID,
  NS_LCM_001_CP_001,
  NS_LCM_001_CP_002,
  NS_LCM_001_CP_003,
  NS_LCM_001_CP_004,
  NS_LCM_001_CP_005,
  type NsLcm001CanonicalProblemId,
  type NsLcm001Cp003Family,
  type NsLcm001CycleContext,
  type NsLcm001DifficultyBand,
  type NsLcm001Parameters,
} from "./types";

export interface NsLcm001ParameterInput {
  seed?: string;
  difficultyBand?: NsLcm001DifficultyBand;
  questionLanguageId?: string;
  numbers?: number[];
  lowerBound?: number;
  upperBound?: number;
  threshold?: number;
  candidateValues?: number[];
  knownNumbers?: number[];
  targetLcm?: number;
}

interface Cp003Fixture {
  qlId: string;
  family: NsLcm001Cp003Family;
  knownNumbers: number[];
  targetLcm: number;
  answer: number;
  candidateValues: number[];
  candidateSet?: number[];
  lowerBound?: number;
  upperBound?: number;
  divisor?: number;
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

export function generateCp001Parameters(input: NsLcm001ParameterInput = {}) {
  return generateParameters(NS_LCM_001_CP_001, input);
}
export function generateCp002Parameters(input: NsLcm001ParameterInput = {}) {
  return generateParameters(NS_LCM_001_CP_002, input);
}
export function generateCp003Parameters(input: NsLcm001ParameterInput = {}) {
  return generateParameters(NS_LCM_001_CP_003, input);
}
export function generateCp004Parameters(input: NsLcm001ParameterInput = {}) {
  return generateParameters(NS_LCM_001_CP_004, input);
}
export function generateCp005Parameters(input: NsLcm001ParameterInput = {}) {
  return generateParameters(NS_LCM_001_CP_005, input);
}

export function generateParameters(canonicalProblemId: NsLcm001CanonicalProblemId, input: NsLcm001ParameterInput = {}): NsLcm001Parameters {
  const seed = input.seed ?? `NS-LCM-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, questionLanguageId);
  if (canonicalProblemId === NS_LCM_001_CP_001) return { ...base, numbers: input.numbers ?? selectNumbers(seed, difficultyBand) };
  if (canonicalProblemId === NS_LCM_001_CP_002) return { ...base, ...selectCp002(seed, questionLanguageId) };
  if (canonicalProblemId === NS_LCM_001_CP_003) return { ...base, ...selectCp003(seed, questionLanguageId, input) };
  if (canonicalProblemId === NS_LCM_001_CP_004) return { ...base, ...selectCp004(seed, questionLanguageId, input) };
  return { ...base, ...selectCp005(seed, questionLanguageId, input) };
}

function baseParameters(
  canonicalProblemId: NsLcm001CanonicalProblemId,
  difficultyBand: NsLcm001DifficultyBand,
  seed: string,
  questionLanguageId: string,
): Omit<NsLcm001Parameters, "numbers"> {
  return {
    archetypeId: NS_LCM_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-LCM-001:${canonicalProblemId}:${seed}`,
    sourceTrace: {
      sourceId: "NS-LCM-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package",
      note: "Approved CP-001 through CP-005 implementation.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    questionLanguageId,
  };
}

function selectDifficultyBand(seed: string): NsLcm001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQuestionLanguageId(canonicalProblemId: NsLcm001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectNumbers(seed: string, difficultyBand: NsLcm001DifficultyBand) {
  const pools: Record<NsLcm001DifficultyBand, number[][]> = {
    Easy: [[4, 6], [8, 12, 18], [5, 7], [6, 10, 15], [9, 12]],
    Medium: [[12, 18, 30], [16, 24, 36], [25, 40, 60], [21, 28, 36, 42], [35, 64]],
    Hard: [[48, 72, 108], [125, 150, 225], [84, 126, 210, 315], [128, 192, 320], [101, 103, 107]],
  };
  const pool = pools[difficultyBand];
  return pool[stableBucket(`${seed}:numbers`, pool.length)];
}

function selectCp002(seed: string, questionLanguageId: string) {
  const context = getQuestionLanguageEntry(NS_LCM_001_CP_002, questionLanguageId).contextFamily as NsLcm001CycleContext;
  const pool = [[6, 8, 12], [10, 15, 20], [12, 18, 30], [20, 30, 45], [25, 40, 50]];
  const cycleLengths = pool[stableBucket(`${seed}:cycle`, pool.length)];
  return { numbers: cycleLengths, cycleLengths, cycleContext: context };
}

function selectCp003(seed: string, questionLanguageId: string, input: NsLcm001ParameterInput) {
  if (input.knownNumbers && input.targetLcm && input.numbers) {
    const answer = input.numbers[0];
    return {
      numbers: [...input.knownNumbers, answer],
      knownNumbers: input.knownNumbers,
      targetLcm: input.targetLcm,
      cp003Family: familyForQl(questionLanguageId),
      missingNumber: answer,
      candidateValues: input.candidateValues ?? [answer],
    };
  }
  const fixtures = CP003_FIXTURES.filter((fixture) => fixture.qlId === questionLanguageId);
  const fixture = fixtures[stableBucket(`${seed}:cp003-fixture`, fixtures.length)];
  return {
    numbers: [...fixture.knownNumbers, fixture.answer],
    knownNumbers: fixture.knownNumbers,
    targetLcm: fixture.targetLcm,
    cp003Family: fixture.family,
    missingNumber: fixture.answer,
    candidateValues: fixture.candidateValues,
    candidateSet: fixture.candidateSet ? formatNumberList(fixture.candidateSet) : undefined,
    lowerBound: fixture.lowerBound,
    upperBound: fixture.upperBound,
    divisor: fixture.divisor,
  };
}

function selectCp004(seed: string, questionLanguageId: string, input: NsLcm001ParameterInput) {
  const fixtures = [
    { numbers: [6, 10], lowerBound: 1, upperBound: 20 },
    { numbers: [8, 12], lowerBound: 50, upperBound: 150 },
    { numbers: [12, 15], lowerBound: 1, upperBound: 50 },
    { numbers: [18, 24, 30], lowerBound: 100, upperBound: 500 },
  ];
  const fixture = fixtures[stableBucket(`${seed}:${questionLanguageId}:range`, fixtures.length)];
  return {
    numbers: input.numbers ?? fixture.numbers,
    lowerBound: input.lowerBound ?? fixture.lowerBound,
    upperBound: input.upperBound ?? fixture.upperBound,
  };
}

function selectCp005(seed: string, questionLanguageId: string, input: NsLcm001ParameterInput) {
  const fixtures = [
    { numbers: [6, 10], threshold: 60 },
    { numbers: [8, 12], threshold: 70 },
    { numbers: [15, 20, 30], threshold: 180 },
    { numbers: [25, 40], threshold: 199 },
  ];
  const fixture = fixtures[stableBucket(`${seed}:${questionLanguageId}:threshold`, fixtures.length)];
  return {
    numbers: input.numbers ?? fixture.numbers,
    threshold: input.threshold ?? fixture.threshold,
  };
}

function familyForQl(questionLanguageId: string): NsLcm001Cp003Family {
  if (questionLanguageId === "QL-011") return "candidate_list";
  if (questionLanguageId === "QL-012") return "bounded_range";
  if (questionLanguageId === "QL-013") return "divisibility_condition";
  return "arithmetic_condition";
}

const CP003_FIXTURES: Cp003Fixture[] = [
  { qlId: "QL-011", family: "candidate_list", knownNumbers: [12], targetLcm: 60, answer: 20, candidateValues: [8, 18, 20, 25], candidateSet: [8, 18, 20, 25] },
  { qlId: "QL-012", family: "bounded_range", knownNumbers: [18], targetLcm: 90, answer: 45, candidateValues: [30, 36, 45, 54], lowerBound: 40, upperBound: 50 },
  { qlId: "QL-013", family: "divisibility_condition", knownNumbers: [20], targetLcm: 60, answer: 12, candidateValues: [8, 12, 25, 40], divisor: 6 },
  { qlId: "QL-014", family: "arithmetic_condition", knownNumbers: [24], targetLcm: 120, answer: 40, candidateValues: [16, 25, 40, 80], upperBound: 60 },
];

export function cp003FamilyFromQuestionLanguageId(questionLanguageId: string) {
  return familyForQl(questionLanguageId);
}

export function lcmForGeneratedNumbers(numbers: readonly number[]) {
  return lcmOf(numbers);
}
