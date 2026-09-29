import type {
  Stat003ContractId,
  Stat003Difficulty,
  Stat003ExamProfile,
  Stat003SolveMode,
} from "./types";

export const STAT003_PERMANENT_RELEASE_ID = "STAT-003-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Stat003PermanentQlId =
  | "STAT-QL-013"
  | "STAT-QL-014"
  | "STAT-QL-015"
  | "STAT-QL-016"
  | "STAT-QL-017"
  | "STAT-QL-018"
  | "STAT-QL-019"
  | "STAT-QL-020";

export type Stat003PermanentQlDescriptor = Readonly<{
  qlId: Stat003PermanentQlId;
  contractId: Stat003ContractId;
  label: string;
  semanticContract: string;
  solveMode: Stat003SolveMode;
  difficulty: Stat003Difficulty;
  supportedProfiles: readonly Stat003ExamProfile[];
  sourceStatus: "PHASE0_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

export const STAT003_PERMANENT_QLS: readonly Stat003PermanentQlDescriptor[] = Object.freeze([
  {
    qlId: "STAT-QL-013",
    contractId: "STAT-003-TEMP-001-DISCRETE-FREQUENCY-MEAN",
    label: "Mean from a discrete frequency table",
    semanticContract: "Calculate the arithmetic mean of a discrete frequency distribution using the weighted total Σfx divided by total frequency Σf.",
    solveMode: "MEAN_FROM_DISCRETE_FREQUENCY",
    difficulty: "Easy",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-014",
    contractId: "STAT-003-TEMP-002-GROUPED-FREQUENCY-MEAN",
    label: "Mean from a grouped frequency distribution",
    semanticContract: "Use class marks as representative values for grouped classes, form Σfm and divide by Σf to obtain the grouped mean.",
    solveMode: "MEAN_FROM_GROUPED_FREQUENCY",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-015",
    contractId: "STAT-003-TEMP-003-DISCRETE-FREQUENCY-MEDIAN",
    label: "Median from a discrete frequency table",
    semanticContract: "Use cumulative frequencies in an ordered discrete distribution to locate the median observation and report its corresponding value.",
    solveMode: "MEDIAN_FROM_DISCRETE_FREQUENCY",
    difficulty: "Easy",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-016",
    contractId: "STAT-003-TEMP-004-GROUPED-FREQUENCY-MEDIAN",
    label: "Median from grouped data",
    semanticContract: "Locate the median class using cumulative frequency and apply the grouped-data interpolation formula with the displayed class boundary, frequency and class width.",
    solveMode: "MEDIAN_FROM_GROUPED_FREQUENCY",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-017",
    contractId: "STAT-003-TEMP-005-GROUPED-FREQUENCY-MODE",
    label: "Mode from grouped data",
    semanticContract: "Identify the modal class and apply the grouped-mode interpolation formula using l, h and the preceding, modal and succeeding class frequencies.",
    solveMode: "MODE_FROM_GROUPED_FREQUENCY",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-018",
    contractId: "STAT-003-TEMP-006-EMPIRICAL-MODE",
    label: "Mode from the empirical mean-median-mode relation",
    semanticContract: "Given mean and median, use Mode = 3 Median − 2 Mean to recover the mode.",
    solveMode: "MODE_FROM_EMPIRICAL_RELATION",
    difficulty: "Easy",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-019",
    contractId: "STAT-003-TEMP-007-EMPIRICAL-DIFFERENCE",
    label: "Mean-median difference from the empirical relation",
    semanticContract: "Use Mean − Mode = 3(Mean − Median) to infer the corresponding mean-median difference from a stated mean-mode difference.",
    solveMode: "DIFFERENCE_FROM_EMPIRICAL_RELATION",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-020",
    contractId: "STAT-003-TEMP-008-MISSING-VALUE-FROM-MEAN",
    label: "Missing table value from a stated frequency mean",
    semanticContract: "Reconstruct the weighted-mean equation from a discrete frequency table and solve for one unknown observation value.",
    solveMode: "MISSING_VALUE_FROM_FREQUENCY_MEAN",
    difficulty: "Hard",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
] as const);

const BY_QL = new Map(STAT003_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_CONTRACT = new Map(STAT003_PERMANENT_QLS.map((descriptor) => [descriptor.contractId, descriptor] as const));

export function getStat003PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Stat003PermanentQlId);
}

export function getStat003PermanentQlForContract(contractId: Stat003ContractId) {
  const descriptor = BY_CONTRACT.get(contractId);
  if (!descriptor) throw new Error(`STAT-003 permanent ownership is missing for ${contractId}.`);
  return descriptor;
}

export function getStat003PermanentQlIds() {
  return STAT003_PERMANENT_QLS.map((descriptor) => descriptor.qlId);
}

export const STAT003_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "STAT-003" as const,
  releaseId: STAT003_PERMANENT_RELEASE_ID,
  qlCount: STAT003_PERMANENT_QLS.length,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: true,
    questionStudioMode: "CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    productionReleaseAuthorized: false as const,
  }),
});
