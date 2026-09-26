import type { Di002V2Difficulty, Di002V2ExamProfile, Di002V2TaskKind } from "./advanced-table-v2-types";

export type Di002V2ReviewQlId =
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

export type Di002V2ReviewQlDescriptor = Readonly<{
  qlId: Di002V2ReviewQlId;
  taskKind: Di002V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di002V2Difficulty;
  supportedProfiles: readonly Di002V2ExamProfile[];
  sourceStatus: "V2_REVIEW_CANDIDATE";
  editorialStatus: "ENGLISH_REVIEW_PENDING";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI002_V2_REVIEW_QLS: readonly Di002V2ReviewQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-097", taskKind: "SELECTED_DIFFERENCE", label: "Difference between Selected values", semanticContract: "Find the absolute difference between Selected values for two named rows.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-098", taskKind: "COMBINED_SELECTED", label: "Combined Selected total", semanticContract: "Add the Selected values for two named rows.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-099", taskKind: "MISSING_APPLICANTS_FROM_RATE", label: "Recover missing Applicants", semanticContract: "Use Selected and Selection % from the same row to recover the missing Applicants value exactly.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-100", taskKind: "REJECTED_COUNT", label: "Find candidates not selected", semanticContract: "Subtract Selected from Applicants for the named row.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-101", taskKind: "SELECTED_SHARE_OF_TOTAL", label: "Row share of total Selected", semanticContract: "Express one row's Selected value as a percentage of the all-row Selected total, rounded to the nearest whole percent.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-102", taskKind: "COMBINED_REJECTED", label: "Combined rejected count", semanticContract: "Derive the rejected count for each of two named rows and add those two derived values.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-103", taskKind: "APPLICANTS_RATIO", label: "Ratio of Applicants", semanticContract: "Use the Applicants values for two named rows and simplify their ratio in the stated order.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-104", taskKind: "AVERAGE_SELECTED_THREE_ROWS", label: "Average Selected across three rows", semanticContract: "Add the Selected values of three named rows and divide by three.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-105", taskKind: "COMBINED_SELECTED_RATIO", label: "Ratio of two Selected subtotals", semanticContract: "Add Selected values within two named groups and simplify the ratio of the resulting subtotals in order.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-106", taskKind: "RELATIVE_SELECTED_PERCENT_EXCESS", label: "Relative excess in Selected", semanticContract: "Find the Selected difference between two rows and express it as a percentage of the smaller Selected value, rounded to the nearest whole percent.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-107", taskKind: "COMBINED_SELECTION_RATE", label: "Weighted combined selection rate", semanticContract: "Combine Selected and Applicants for two rows, then divide combined Selected by combined Applicants and round to the nearest whole percent.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-108", taskKind: "REJECTED_TO_SELECTED_RATIO", label: "Combined Rejected-to-Selected ratio", semanticContract: "Derive rejected counts for two rows, add rejected and selected subtotals separately, then simplify Rejected : Selected.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_REVIEW_CANDIDATE", editorialStatus: "ENGLISH_REVIEW_PENDING", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI002_V2_REVIEW_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));

export function getDi002V2ReviewQl(qlId: string) {
  return BY_QL.get(qlId as Di002V2ReviewQlId);
}

export const DI002_V2_REVIEW_OWNERSHIP = Object.freeze({
  packageId: "DI-002" as const,
  qlCount: DI002_V2_REVIEW_QLS.length,
  namespaceReservation: "DI-QL-097 through DI-QL-108" as const,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    humanApprovalRequired: true,
  }),
});
