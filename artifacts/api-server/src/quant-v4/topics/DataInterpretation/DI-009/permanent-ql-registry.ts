import type { Di009Difficulty, Di009ExamProfile, Di009TaskKind } from "./types";

export const DI009_PERMANENT_RELEASE_ID = "DI-009-PERMANENT-ENGLISH-REVIEW-P2" as const;

export type Di009PermanentQlId =
  | "DI-QL-001"
  | "DI-QL-002"
  | "DI-QL-003"
  | "DI-QL-004"
  | "DI-QL-005"
  | "DI-QL-006"
  | "DI-QL-007"
  | "DI-QL-008"
  | "DI-QL-009"
  | "DI-QL-010"
  | "DI-QL-011"
  | "DI-QL-012"
  | "DI-QL-013";

export type Di009PermanentQlDescriptor = Readonly<{
  qlId: Di009PermanentQlId;
  taskKind: Di009TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di009Difficulty;
  supportedProfiles: readonly Di009ExamProfile[];
  sourceStatus: "V6_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "HI_PA_REVIEW_CANDIDATE";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"] as const;

export const DI009_PERMANENT_QLS: readonly Di009PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-001", taskKind: "DIRECT_CLASS_FREQUENCY", label: "Read the frequency of one class interval", semanticContract: "Read the bar height for one named continuous class interval in a histogram.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-002", taskKind: "TOTAL_FREQUENCY", label: "Find total frequency from a histogram", semanticContract: "Add the frequencies represented by all histogram bars to obtain the total number of observations.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-003", taskKind: "COMBINED_RANGE_TOTAL", label: "Combined frequency across consecutive classes", semanticContract: "Add frequencies across a specified consecutive range of histogram classes.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-004", taskKind: "ABOVE_BOUNDARY_TOTAL", label: "Frequency above a class boundary", semanticContract: "Sum all histogram frequencies from a stated class boundary upward.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-005", taskKind: "BELOW_BOUNDARY_TOTAL", label: "Frequency below a class boundary", semanticContract: "Sum all histogram frequencies below a stated class boundary.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-006", taskKind: "RANGE_RATIO", label: "Ratio of frequencies across two ranges", semanticContract: "Aggregate frequencies over two specified class ranges and form the simplified ratio of those totals.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-007", taskKind: "CLASS_SHARE_OF_TOTAL", label: "Class frequency as a percentage of total", semanticContract: "Compare one class frequency with the histogram total and express the result as the nearest whole percent.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-008", taskKind: "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES", label: "Difference between two class frequencies", semanticContract: "Read two histogram bar heights and calculate their absolute difference.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-009", taskKind: "MODAL_CLASS_IDENTIFICATION", label: "Identify the modal class", semanticContract: "Identify the class interval represented by the tallest histogram bar.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-010", taskKind: "MEDIAN_CLASS_IDENTIFICATION", label: "Identify the median class", semanticContract: "Use total frequency and cumulative frequencies to identify the class containing the median observation.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-011", taskKind: "KTH_OBSERVATION_CLASS", label: "Locate a kth observation class", semanticContract: "Use cumulative frequencies to locate the class interval containing a specified ordered observation.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-012", taskKind: "APPROX_GROUPED_MEAN_FROM_HISTOGRAM", label: "Approximate grouped mean from histogram classes", semanticContract: "Use class marks and frequencies from the histogram to calculate the grouped-data mean to the nearest whole number.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-013", taskKind: "APPROX_GROUPED_MODE_FROM_HISTOGRAM", label: "Approximate grouped mode from a histogram", semanticContract: "Use the modal class and neighboring class frequencies in the grouped-data mode formula and report the nearest whole number.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V6_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
] as const);

const BY_QL = new Map(DI009_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI009_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi009PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di009PermanentQlId);
}

export function getDi009PermanentQlForTask(taskKind: Di009TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-009 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export function getDi009PermanentQlIds() {
  return DI009_PERMANENT_QLS.map((descriptor) => descriptor.qlId);
}

export const DI009_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-009" as const,
  releaseId: DI009_PERMANENT_RELEASE_ID,
  qlCount: DI009_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-* begins with DI-009 as the first promoted Data Interpretation package" as const,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: true,
    questionStudioMode: "CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    productionReleaseAuthorized: false as const,
  }),
});
