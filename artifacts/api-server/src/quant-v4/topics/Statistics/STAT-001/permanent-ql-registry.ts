import type {
  Sta001ContractId,
  Sta001Difficulty,
  Sta001ExamProfile,
  Sta001SolveMode,
} from "./types";

export const STAT001_PERMANENT_RELEASE_ID = "STAT-001-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Stat001PermanentQlId =
  | "STAT-QL-001"
  | "STAT-QL-002"
  | "STAT-QL-003"
  | "STAT-QL-004"
  | "STAT-QL-005"
  | "STAT-QL-006";

export type Stat001PermanentQlDescriptor = Readonly<{
  qlId: Stat001PermanentQlId;
  contractId: Sta001ContractId;
  label: string;
  semanticContract: string;
  solveMode: Sta001SolveMode;
  difficulty: Sta001Difficulty;
  supportedProfiles: readonly Sta001ExamProfile[];
  sourceStatus: "PHASE0_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_READY";
  localizationStatus: "NOT_STARTED";
}>;

export const STAT001_PERMANENT_QLS: readonly Stat001PermanentQlDescriptor[] = Object.freeze([
  {
    qlId: "STAT-QL-001",
    contractId: "STAT-TEMP-001-SIMPLE-MEAN",
    label: "Arithmetic mean of raw observations",
    semanticContract: "Given a finite raw data set, calculate its arithmetic mean from the exact total and observation count.",
    solveMode: "DIRECT_MEAN",
    difficulty: "Easy",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_READY",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-002",
    contractId: "STAT-TEMP-002-MISSING-OBSERVATION",
    label: "Missing observation from stated mean",
    semanticContract: "Given the mean, observation count and all but one observation, recover the missing observation from the required total.",
    solveMode: "REVERSE_MEAN_TOTAL",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_READY",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-003",
    contractId: "STAT-TEMP-003-CORRECTED-MEAN",
    label: "Corrected mean after a recording error",
    semanticContract: "Correct a stated mean when one recorded observation is replaced by its actual value.",
    solveMode: "MEAN_CORRECTION",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_READY",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-004",
    contractId: "STAT-TEMP-004-COMBINED-MEAN",
    label: "Combined mean of two groups",
    semanticContract: "Combine two groups with known counts and means by using their weighted totals, not an unweighted average of the means.",
    solveMode: "WEIGHTED_GROUP_MEAN",
    difficulty: "Hard",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_READY",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-005",
    contractId: "STAT-TEMP-005-MEDIAN-RAW",
    label: "Median of raw observations",
    semanticContract: "Order a raw data set and identify the central observation or average of the two central observations according to parity.",
    solveMode: "ORDER_STATISTIC_MEDIAN",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_READY",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-006",
    contractId: "STAT-TEMP-006-MODE-RAW",
    label: "Mode of raw observations",
    semanticContract: "Identify the unique observation with the greatest frequency in a raw data set and distinguish the modal value from its frequency.",
    solveMode: "FREQUENCY_MODE",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_READY",
    localizationStatus: "NOT_STARTED",
  },
] as const);

const BY_QL = new Map(STAT001_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_CONTRACT = new Map(STAT001_PERMANENT_QLS.map((descriptor) => [descriptor.contractId, descriptor] as const));

export function getStat001PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Stat001PermanentQlId);
}

export function getStat001PermanentQlForContract(contractId: Sta001ContractId) {
  const descriptor = BY_CONTRACT.get(contractId);
  if (!descriptor) throw new Error(`STAT-001 permanent ownership is missing for ${contractId}.`);
  return descriptor;
}

export function getStat001PermanentQlIds() {
  return STAT001_PERMANENT_QLS.map((descriptor) => descriptor.qlId);
}

export const STAT001_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "STAT-001" as const,
  releaseId: STAT001_PERMANENT_RELEASE_ID,
  qlCount: STAT001_PERMANENT_QLS.length,
  namespaceGuard: "STAT-QL-*; STA-001 remains Reasoning Statement & Assumption" as const,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: true,
    questionStudioMode: "CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  }),
});
