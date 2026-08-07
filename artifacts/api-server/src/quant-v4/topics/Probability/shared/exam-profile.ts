import type { ProbabilityCanonicalProblemId, ProbabilityPackageId, ProbabilityTaskRegistryEntry } from "./types";

export type ProbabilityExamProfile =
  | "SSC_CGL_CHSL"
  | "SSC_CGL_JSO"
  | "BANKING_PRELIMS"
  | "BANKING_MAINS"
  | "GENERIC_PRACTICE";

export interface ProbabilityExamProfileConfig {
  id: ProbabilityExamProfile;
  label: string;
  optionCount: 4 | 5;
  allowedCpIds: readonly ProbabilityCanonicalProblemId[];
  excludedSolveModes: readonly string[];
  questionStyle: "DIRECT_OBJECTIVE" | "BANKING_OBJECTIVE" | "ADVANCED_STATISTICS";
}

const ALL_CP_IDS: readonly ProbabilityCanonicalProblemId[] = [
  "PRB-CP-001", "PRB-CP-002", "PRB-CP-003", "PRB-CP-004", "PRB-CP-005",
  "PRB-CP-006", "PRB-CP-007", "PRB-CP-008", "PRB-CP-009",
];

const SIMPLE_SSC_CP_IDS: readonly ProbabilityCanonicalProblemId[] = [
  "PRB-CP-001", "PRB-CP-002", "PRB-CP-003", "PRB-CP-004", "PRB-CP-005", "PRB-CP-006", "PRB-CP-008",
];

const SSC_SIMPLE_EXCLUSIONS = [
  "findConditionalProbabilityByCounting",
  "findConditionalFromTwoWayTable",
  "findConditionalCardProbability",
  "findConditionalNumberProbability",
  "findConditionalUrnProbability",
  "findReverseConditionalCount",
  "findIndependentIntersection",
  "findMissingIntersectionOrUnionProbability",
  "findMixedEventExpressionProbability",
] as const;

export const PROBABILITY_EXAM_PROFILES: Record<ProbabilityExamProfile, ProbabilityExamProfileConfig> = {
  SSC_CGL_CHSL: {
    id: "SSC_CGL_CHSL",
    label: "SSC CGL/CHSL — Simple Probability",
    optionCount: 4,
    allowedCpIds: SIMPLE_SSC_CP_IDS,
    excludedSolveModes: SSC_SIMPLE_EXCLUSIONS,
    questionStyle: "DIRECT_OBJECTIVE",
  },
  SSC_CGL_JSO: {
    id: "SSC_CGL_JSO",
    label: "SSC CGL JSO/Statistics — Probability",
    optionCount: 4,
    allowedCpIds: ALL_CP_IDS,
    excludedSolveModes: [],
    questionStyle: "ADVANCED_STATISTICS",
  },
  BANKING_PRELIMS: {
    id: "BANKING_PRELIMS",
    label: "Banking Prelims — Probability Practice",
    optionCount: 5,
    allowedCpIds: ["PRB-CP-001", "PRB-CP-002", "PRB-CP-003", "PRB-CP-004", "PRB-CP-005", "PRB-CP-006"],
    excludedSolveModes: ["findTotalOutcomeCount", "findReverseDiceOrSpinnerEventCount", "findMissingDeckCountOrEventCount", "findMissingObjectCountFromProbability"],
    questionStyle: "BANKING_OBJECTIVE",
  },
  BANKING_MAINS: {
    id: "BANKING_MAINS",
    label: "IBPS/SBI Mains — Probability",
    optionCount: 5,
    allowedCpIds: ALL_CP_IDS,
    excludedSolveModes: [],
    questionStyle: "BANKING_OBJECTIVE",
  },
  GENERIC_PRACTICE: {
    id: "GENERIC_PRACTICE",
    label: "General Probability Practice",
    optionCount: 4,
    allowedCpIds: ALL_CP_IDS,
    excludedSolveModes: [],
    questionStyle: "DIRECT_OBJECTIVE",
  },
};

export function defaultProbabilityExamProfile(packageId: ProbabilityPackageId, cpId: ProbabilityCanonicalProblemId): ProbabilityExamProfile {
  if (cpId === "PRB-CP-007" || cpId === "PRB-CP-008" || cpId === "PRB-CP-009") return "BANKING_MAINS";
  return packageId === "PRB-002" ? "BANKING_MAINS" : "SSC_CGL_CHSL";
}

export function resolveProbabilityExamProfile(
  requested: ProbabilityExamProfile | undefined,
  packageId: ProbabilityPackageId,
  cpId: ProbabilityCanonicalProblemId,
): ProbabilityExamProfileConfig {
  const id = requested ?? defaultProbabilityExamProfile(packageId, cpId);
  return PROBABILITY_EXAM_PROFILES[id];
}

export function isEntryAllowedForExamProfile(entry: ProbabilityTaskRegistryEntry, profile: ProbabilityExamProfileConfig): boolean {
  return profile.allowedCpIds.includes(entry.cpId) && !profile.excludedSolveModes.includes(entry.solveMode);
}
