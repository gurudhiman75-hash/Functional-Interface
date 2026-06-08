import { getQuestionLanguageEntries, getTopology } from "./library";
import {
  NS_HL_001_ARCHETYPE_ID,
  NS_HL_001_CP_001,
  NS_HL_001_CP_002,
  NS_HL_001_CP_003,
  NS_HL_001_CP_004,
  NS_HL_001_CP_005,
  NS_HL_001_CP_006,
  type NsHl001CanonicalProblemId,
  type NsHl001ConditionType,
  type NsHl001DifficultyBand,
  type NsHl001Parameters,
  type NsHl001ValidityType,
} from "./types";

export interface NsHl001ParameterInput {
  seed?: string;
  difficultyBand?: NsHl001DifficultyBand;
  questionLanguageId?: string;
  hcf?: number;
  lcm?: number;
  product?: number;
  a?: number;
  b?: number;
  knownNumber?: number;
  sum?: number;
  difference?: number;
  lowerBound?: number;
  upperBound?: number;
  ratio?: string;
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

export function generateCp001Parameters(input: NsHl001ParameterInput = {}) { return generateParameters(NS_HL_001_CP_001, input); }
export function generateCp002Parameters(input: NsHl001ParameterInput = {}) { return generateParameters(NS_HL_001_CP_002, input); }
export function generateCp003Parameters(input: NsHl001ParameterInput = {}) { return generateParameters(NS_HL_001_CP_003, input); }
export function generateCp004Parameters(input: NsHl001ParameterInput = {}) { return generateParameters(NS_HL_001_CP_004, input); }
export function generateCp005Parameters(input: NsHl001ParameterInput = {}) { return generateParameters(NS_HL_001_CP_005, input); }
export function generateCp006Parameters(input: NsHl001ParameterInput = {}) { return generateParameters(NS_HL_001_CP_006, input); }

export function generateParameters(canonicalProblemId: NsHl001CanonicalProblemId, input: NsHl001ParameterInput = {}): NsHl001Parameters {
  const seed = input.seed ?? `NS-HL-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, questionLanguageId);
  if (canonicalProblemId === NS_HL_001_CP_001) return { ...base, ...selectCp001(questionLanguageId, input) };
  if (canonicalProblemId === NS_HL_001_CP_002) return { ...base, ...selectCp002(seed, questionLanguageId, input) };
  if (canonicalProblemId === NS_HL_001_CP_003) return { ...base, ...selectCp003(seed, input) };
  if (canonicalProblemId === NS_HL_001_CP_004) return { ...base, ...selectCp004(questionLanguageId, input) };
  if (canonicalProblemId === NS_HL_001_CP_005) return { ...base, ...selectCp005(seed, questionLanguageId, input) };
  return { ...base, ...selectCp006(questionLanguageId, input) };
}

function baseParameters(canonicalProblemId: NsHl001CanonicalProblemId, difficultyBand: NsHl001DifficultyBand, seed: string, questionLanguageId: string) {
  return {
    archetypeId: NS_HL_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-HL-001:${canonicalProblemId}:${seed}`,
    sourceTrace: {
      sourceId: "NS-HL-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package" as const,
      note: "Approved CP-001 through CP-006 implementation.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    questionLanguageId,
  };
}

function selectDifficultyBand(seed: string): NsHl001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQuestionLanguageId(canonicalProblemId: NsHl001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectCp001(questionLanguageId: string, input: NsHl001ParameterInput) {
  if (questionLanguageId === "QL-004") return { hcf: input.hcf ?? 8, product: input.product ?? 960, cp001Family: "findLcm" as const };
  if (questionLanguageId === "QL-005") return { lcm: input.lcm ?? 90, product: input.product ?? 540, cp001Family: "findHcf" as const };
  return { hcf: input.hcf ?? 6, lcm: input.lcm ?? 60, cp001Family: "findProduct" as const };
}

function selectCp002(seed: string, questionLanguageId: string, input: NsHl001ParameterInput) {
  const types: NsHl001ValidityType[] = questionLanguageId === "QL-010"
    ? ["validAllChecksPass", "validAllChecksPass", "validAllChecksPass", "hcfDoesNotDivideLcm", "productRelationFailure", "numberConsistencyFailure"]
    : ["validAllChecksPass", "hcfDoesNotDivideLcm"];
  const type = types[stableBucket(`${seed}:validity`, types.length)];
  if (type === "hcfDoesNotDivideLcm") return { hcf: 8, lcm: 30, a: questionLanguageId === "QL-010" ? 12 : undefined, b: questionLanguageId === "QL-010" ? 30 : undefined, validityType: type };
  if (type === "productRelationFailure") return { hcf: 6, lcm: 60, a: 12, b: 24, validityType: type };
  if (type === "numberConsistencyFailure") return { hcf: 6, lcm: 60, a: 10, b: 36, validityType: type };
  return { hcf: input.hcf ?? 6, lcm: input.lcm ?? 60, a: questionLanguageId === "QL-010" ? 12 : input.a, b: questionLanguageId === "QL-010" ? 30 : input.b, validityType: type };
}

function selectCp003(seed: string, input: NsHl001ParameterInput) {
  const fixtures = [
    { hcf: 6, lcm: 60, knownNumber: 12 },
    { hcf: 8, lcm: 120, knownNumber: 40 },
    { hcf: 12, lcm: 420, knownNumber: 84 },
  ];
  const fixture = fixtures[stableBucket(`${seed}:cp003`, fixtures.length)];
  return { hcf: input.hcf ?? fixture.hcf, lcm: input.lcm ?? fixture.lcm, knownNumber: input.knownNumber ?? fixture.knownNumber };
}

function selectCp004(questionLanguageId: string, input: NsHl001ParameterInput) {
  const conditionType = conditionForQl(questionLanguageId);
  if (conditionType === "sumCondition") return { hcf: 6, lcm: 180, sum: input.sum ?? 78, conditionType };
  if (conditionType === "differenceCondition") return { hcf: 6, lcm: 180, difference: input.difference ?? 78, conditionType };
  if (conditionType === "rangeCondition") return { hcf: 6, lcm: 180, lowerBound: input.lowerBound ?? 15, upperBound: input.upperBound ?? 20, conditionType };
  return { hcf: 6, lcm: 96, conditionType };
}

function selectCp005(seed: string, questionLanguageId: string, input: NsHl001ParameterInput) {
  const pairPolicy = questionLanguageId === "QL-026" ? "orderedPairs" as const : "unorderedPairs" as const;
  const pairCountCase = stableBucket(`${seed}:pair-count`, 2) === 0 ? "singlePairCase" as const : "multiplePairCase" as const;
  const hcf = input.hcf ?? 6;
  const lcm = input.lcm ?? (pairCountCase === "singlePairCase" ? 96 : 180);
  return { hcf, lcm, pairPolicy, pairCountCase };
}

function selectCp006(questionLanguageId: string, input: NsHl001ParameterInput) {
  if (questionLanguageId === "QL-028") return { ratio: input.ratio ?? "2:3", hcf: input.hcf ?? 7, ratioType: "ratioPlusHcf" as const, ratioReductionType: "alreadyReducedRatio" as const };
  if (questionLanguageId === "QL-029") return { ratio: input.ratio ?? "4:6", hcf: input.hcf ?? 5, ratioType: "ratioPlusHcf" as const, ratioReductionType: "reducibleRatio" as const };
  if (questionLanguageId === "QL-030") return { ratio: input.ratio ?? "3:4", lcm: input.lcm ?? 84, ratioType: "ratioPlusLcm" as const, ratioReductionType: "alreadyReducedRatio" as const };
  if (questionLanguageId === "QL-031") return { ratio: input.ratio ?? "6:8", lcm: input.lcm ?? 84, ratioType: "ratioPlusLcm" as const, ratioReductionType: "reducibleRatio" as const };
  return { ratio: input.ratio ?? "6:9", hcf: input.hcf ?? 5, lcm: input.lcm ?? 30, ratioType: "ratioPlusHcfPlusLcm" as const, ratioReductionType: "reducibleRatio" as const };
}

function conditionForQl(questionLanguageId: string): NsHl001ConditionType {
  if (questionLanguageId === "QL-015" || questionLanguageId === "QL-016") return "sumCondition";
  if (questionLanguageId === "QL-017" || questionLanguageId === "QL-018") return "differenceCondition";
  if (questionLanguageId === "QL-021" || questionLanguageId === "QL-022") return "rangeCondition";
  return "directPairCondition";
}
