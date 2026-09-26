import type { Di002V2Difficulty, Di002V2ExamProfile, Di002V2TaskKind } from "./advanced-table-v2-types";

export const DI002_PERMANENT_RELEASE_ID = "DI-002-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Di002PermanentQlId =
  | "DI-QL-097"
  | "DI-QL-098"
  | "DI-QL-099"
  | "DI-QL-100"
  | "DI-QL-101"
  | "DI-QL-102"
  | "DI-QL-103"
  | "DI-QL-104"
  | "DI-QL-105"
  | "DI-QL-106"
  | "DI-QL-107"
  | "DI-QL-108";

export type Di002PermanentQlDescriptor = Readonly<{
  qlId: Di002PermanentQlId;
  taskKind: Di002V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di002V2Difficulty;
  supportedProfiles: readonly Di002V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI002_PERMANENT_QLS: readonly Di002PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-097", taskKind: "SELECTED_DIFFERENCE", label: "Difference between Selected values", semanticContract: "Find the absolute difference between Selected values for two named rows.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-098", taskKind: "COMBINED_SELECTED", label: "Combined Selected total", semanticContract: "Add the Selected values for two named rows.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-099", taskKind: "MISSING_APPLICANTS_FROM_RATE", label: "Recover missing Applicants", semanticContract: "Use Selected and Selection % from the same row to recover the missing Applicants value exactly.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-100", taskKind: "REJECTED_COUNT", label: "Find candidates not selected", semanticContract: "Subtract Selected from Applicants for the named row.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-101", taskKind: "SELECTED_SHARE_OF_TOTAL", label: "Row share of total Selected", semanticContract: "Express one row's Selected value as a percentage of the all-row Selected total, rounded to the nearest whole percent.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-102", taskKind: "COMBINED_REJECTED", label: "Combined rejected count", semanticContract: "Derive the rejected count for each of two named rows and add those two derived values.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-103", taskKind: "APPLICANTS_RATIO", label: "Ratio of Applicants", semanticContract: "Use the Applicants values for two named rows and simplify their ratio in the stated order.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-104", taskKind: "AVERAGE_SELECTED_THREE_ROWS", label: "Average Selected across three rows", semanticContract: "Add the Selected values of three named rows and divide by three.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-105", taskKind: "COMBINED_SELECTED_RATIO", label: "Ratio of two Selected subtotals", semanticContract: "Add Selected values within two named groups and simplify the ratio of the resulting subtotals in order.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-106", taskKind: "RELATIVE_SELECTED_PERCENT_EXCESS", label: "Relative excess in Selected", semanticContract: "Find the Selected difference between two rows and express it as a percentage of the smaller Selected value, rounded to the nearest whole percent.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-107", taskKind: "COMBINED_SELECTION_RATE", label: "Weighted combined selection rate", semanticContract: "Combine Selected and Applicants for two rows, then divide combined Selected by combined Applicants and round to the nearest whole percent.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-108", taskKind: "REJECTED_TO_SELECTED_RATIO", label: "Combined Rejected-to-Selected ratio", semanticContract: "Derive rejected counts for two rows, add rejected and selected subtotals separately, then simplify Rejected : Selected.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI002_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI002_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi002PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di002PermanentQlId);
}

export function getDi002PermanentQlForTask(taskKind: Di002V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-002 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI002_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-002" as const,
  releaseId: DI002_PERMANENT_RELEASE_ID,
  qlCount: DI002_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-097 through DI-QL-108 are permanent DI-002 V2 ownership" as const,
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
