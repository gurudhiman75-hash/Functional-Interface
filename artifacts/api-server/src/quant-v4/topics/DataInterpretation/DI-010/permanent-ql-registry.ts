import type { Di010Difficulty, Di010ExamProfile, Di010TaskKind } from "./types";

export const DI010_PERMANENT_RELEASE_ID = "DI-010-PERMANENT-ENGLISH-REVIEW-P2" as const;

export type Di010PermanentQlId =
  | "DI-QL-014"
  | "DI-QL-015"
  | "DI-QL-016"
  | "DI-QL-017"
  | "DI-QL-018"
  | "DI-QL-019"
  | "DI-QL-020"
  | "DI-QL-021"
  | "DI-QL-022"
  | "DI-QL-023"
  | "DI-QL-024"
  | "DI-QL-025"
  | "DI-QL-026";

export type Di010PermanentQlDescriptor = Readonly<{
  qlId: Di010PermanentQlId;
  taskKind: Di010TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di010Difficulty;
  supportedProfiles: readonly Di010ExamProfile[];
  sourceStatus: "P2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"] as const;

export const DI010_PERMANENT_QLS: readonly Di010PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-014", taskKind: "CONSTRUCTION_PROPERTY", label: "Frequency-polygon construction property", semanticContract: "Recognize the defining construction rule of a frequency polygon from class marks and frequencies.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-015", taskKind: "READ_CLASS_FREQUENCY_CONTEXT", label: "Read one class frequency in context", semanticContract: "Read the frequency for a named class interval from the polygon and express it in the stimulus context.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-016", taskKind: "MODAL_CLASS_FROM_POLYGON", label: "Identify modal class from polygon", semanticContract: "Identify the class interval corresponding to the highest frequency-polygon point.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-017", taskKind: "CLASS_INTERVAL_FROM_MARK", label: "Recover class interval from class mark", semanticContract: "Use the plotted class mark and equal class width to identify its class interval.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-018", taskKind: "TOTAL_FREQUENCY_FROM_POLYGON", label: "Find total frequency from polygon", semanticContract: "Add all class frequencies represented by the frequency polygon.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-019", taskKind: "CONSECUTIVE_RANGE_TOTAL_CONTEXT", label: "Consecutive-range total in context", semanticContract: "Aggregate frequencies over a consecutive class range using natural context wording.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-020", taskKind: "FREQUENCY_DIFFERENCE_CONTEXT", label: "Difference between two class frequencies", semanticContract: "Compare two class frequencies represented by the polygon and calculate their absolute difference.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-021", taskKind: "CLASS_SHARE_OF_TOTAL", label: "Class share of total frequency", semanticContract: "Express one class frequency as the nearest whole percent of the total frequency represented by the polygon.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-022", taskKind: "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON", label: "Translate polygon point to histogram bar height", semanticContract: "Infer the corresponding equal-width histogram bar height from a frequency-polygon class frequency.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-023", taskKind: "ZERO_CLOSING_ENDPOINTS", label: "Find zero-frequency closing endpoints", semanticContract: "Construct the two zero-frequency points at the midpoints of adjoining equal-width classes used to close the polygon.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-024", taskKind: "RANGE_RATIO_FROM_POLYGON", label: "Ratio of two frequency ranges", semanticContract: "Aggregate two separate class ranges and simplify the ratio of their frequency totals.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-025", taskKind: "GROUPED_MEAN_FROM_POLYGON", label: "Approximate grouped mean from polygon", semanticContract: "Use class marks and frequencies represented by the polygon to calculate the grouped-data mean to the nearest whole number.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-026", taskKind: "MEDIAN_CLASS_FROM_POLYGON", label: "Identify median class from polygon", semanticContract: "Build cumulative frequencies from the polygon and identify the first class reaching or exceeding N/2.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "P2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI010_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI010_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi010PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di010PermanentQlId);
}

export function getDi010PermanentQlForTask(taskKind: Di010TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-010 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI010_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-010" as const,
  releaseId: DI010_PERMANENT_RELEASE_ID,
  qlCount: DI010_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-014 through DI-QL-026 follow DI-009 DI-QL-001 through DI-QL-013" as const,
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
