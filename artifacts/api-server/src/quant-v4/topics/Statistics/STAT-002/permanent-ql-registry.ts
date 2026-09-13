import type {
  Stat002ContractId,
  Stat002Difficulty,
  Stat002ExamProfile,
  Stat002SolveMode,
} from "./types";

export const STAT002_PERMANENT_RELEASE_ID = "STAT-002-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Stat002PermanentQlId =
  | "STAT-QL-007"
  | "STAT-QL-008"
  | "STAT-QL-009"
  | "STAT-QL-010"
  | "STAT-QL-011"
  | "STAT-QL-012";

export type Stat002PermanentQlDescriptor = Readonly<{
  qlId: Stat002PermanentQlId;
  contractId: Stat002ContractId;
  label: string;
  semanticContract: string;
  solveMode: Stat002SolveMode;
  difficulty: Stat002Difficulty;
  supportedProfiles: readonly Stat002ExamProfile[];
  sourceStatus: "PHASE0_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

export const STAT002_PERMANENT_QLS: readonly Stat002PermanentQlDescriptor[] = Object.freeze([
  {
    qlId: "STAT-QL-007",
    contractId: "STAT-002-TEMP-001-RAW-SD",
    label: "Population standard deviation of raw observations",
    semanticContract: "Given a finite raw data set, calculate population standard deviation by finding the mean, squared deviations, variance and square root.",
    solveMode: "DIRECT_POPULATION_SD",
    difficulty: "Easy",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-008",
    contractId: "STAT-002-TEMP-002-MEAN-SQUARES-SD",
    label: "Standard deviation from mean and mean of squares",
    semanticContract: "Recover variance from mean(x²) minus [mean(x)]² and take its square root to obtain standard deviation.",
    solveMode: "SD_FROM_MEAN_AND_MEAN_SQUARES",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-009",
    contractId: "STAT-002-TEMP-003-TRANSLATION-INVARIANCE",
    label: "Standard deviation under translation",
    semanticContract: "Recognize that adding the same constant to every observation shifts the mean equally and leaves all deviations, variance and standard deviation unchanged.",
    solveMode: "TRANSLATION_INVARIANCE",
    difficulty: "Easy",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-010",
    contractId: "STAT-002-TEMP-004-SCALE-TRANSFORMATION",
    label: "Standard deviation under positive scaling",
    semanticContract: "Apply the rule that multiplying every observation by a positive constant multiplies standard deviation by the same constant.",
    solveMode: "SCALE_STANDARD_DEVIATION",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-011",
    contractId: "STAT-002-TEMP-005-REVERSE-SCALE",
    label: "Infer a positive scale factor from standard deviations",
    semanticContract: "Given original and transformed standard deviations after a common positive multiplication, infer the multiplier from their ratio.",
    solveMode: "INFER_SCALE_FROM_STANDARD_DEVIATION",
    difficulty: "Medium",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
  {
    qlId: "STAT-QL-012",
    contractId: "STAT-002-TEMP-006-AFFINE-FROM-MOMENTS",
    label: "Standard deviation after affine transformation from moments",
    semanticContract: "First recover source standard deviation from mean and mean of squares, then apply y = ax + b with the shift leaving spread unchanged and |a| scaling standard deviation.",
    solveMode: "AFFINE_SD_FROM_MOMENTS",
    difficulty: "Hard",
    supportedProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    sourceStatus: "PHASE0_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "NOT_STARTED",
  },
] as const);

const BY_QL = new Map(STAT002_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_CONTRACT = new Map(STAT002_PERMANENT_QLS.map((descriptor) => [descriptor.contractId, descriptor] as const));

export function getStat002PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Stat002PermanentQlId);
}

export function getStat002PermanentQlForContract(contractId: Stat002ContractId) {
  const descriptor = BY_CONTRACT.get(contractId);
  if (!descriptor) throw new Error(`STAT-002 permanent ownership is missing for ${contractId}.`);
  return descriptor;
}

export function getStat002PermanentQlIds() {
  return STAT002_PERMANENT_QLS.map((descriptor) => descriptor.qlId);
}

export const STAT002_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "STAT-002" as const,
  releaseId: STAT002_PERMANENT_RELEASE_ID,
  qlCount: STAT002_PERMANENT_QLS.length,
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
