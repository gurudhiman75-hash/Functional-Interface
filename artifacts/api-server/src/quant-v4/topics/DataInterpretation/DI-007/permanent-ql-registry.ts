import type { Di007V2Difficulty, Di007V2ExamProfile, Di007V2TaskKind } from "./missing-v2-types";

export const DI007_PERMANENT_RELEASE_ID = "DI-007-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Di007PermanentQlId =
  | "DI-QL-073"
  | "DI-QL-074"
  | "DI-QL-075"
  | "DI-QL-076"
  | "DI-QL-077"
  | "DI-QL-078"
  | "DI-QL-079"
  | "DI-QL-080"
  | "DI-QL-081"
  | "DI-QL-082"
  | "DI-QL-083"
  | "DI-QL-084";

export type Di007PermanentQlDescriptor = Readonly<{
  qlId: Di007PermanentQlId;
  taskKind: Di007V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di007V2Difficulty;
  supportedProfiles: readonly Di007V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["BANKING_PRELIMS", "BANKING_MAINS"] as const;

export const DI007_PERMANENT_QLS: readonly Di007PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-073", taskKind: "DIRECT_VISIBLE_VALUE", label: "Read a visible table value", semanticContract: "Read a directly visible value from the requested row and column of the missing-data table.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-074", taskKind: "VISIBLE_ROW_DIFFERENCE", label: "Difference between visible row values", semanticContract: "Use the two visible values in one row and find their absolute difference without reconstructing the missing cell.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-075", taskKind: "RECOVER_MISSING_VALUE", label: "Recover the missing table value", semanticContract: "Use the aggregate condition to reconstruct the full target-column total and recover the hidden cell.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-076", taskKind: "HIDDEN_ROW_COMBINED_TOTAL", label: "Combined total of hidden row", semanticContract: "Recover the hidden cell and add it to the visible value in the same row.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-077", taskKind: "MISSING_TO_PAIRED_RATIO", label: "Ratio using recovered missing value", semanticContract: "Recover the hidden cell and simplify its ratio to the paired visible value in the requested order.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-078", taskKind: "B_TOTAL_AS_PERCENT_OF_A_TOTAL", label: "One column total as percentage of the other", semanticContract: "Recover the missing cell, complete both column totals, and express the target-column total as a percentage of the comparison-column total.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-079", taskKind: "MISSING_SHARE_OF_B_TOTAL", label: "Recovered value share of column total", semanticContract: "Recover the hidden cell and express it as a percentage of the full total of its column.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-080", taskKind: "VISIBLE_TWO_ROW_B_TOTAL", label: "Combine two visible column values", semanticContract: "Add the target-column values for two named visible rows.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-081", taskKind: "MISSING_AS_PERCENT_OF_PAIRED_A", label: "Recovered value as percentage of paired row value", semanticContract: "Recover the hidden cell and express it as a percentage of the paired value in the same row.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-082", taskKind: "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL", label: "Combined hidden and visible share of total", semanticContract: "Recover the hidden cell, combine it with a named visible value from the same column, and express the sum as a percentage of the full column total.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-083", taskKind: "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS", label: "Percentage excess between hidden and visible values", semanticContract: "Recover the hidden cell, compare it with a named visible value, and express the excess of the larger over the smaller as a percentage of the smaller.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-084", taskKind: "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO", label: "Ratio of hidden-row total to visible-row total", semanticContract: "Recover the hidden cell, form the two-column totals for the hidden row and a named visible row, then simplify their ratio.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI007_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI007_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi007PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di007PermanentQlId);
}

export function getDi007PermanentQlForTask(taskKind: Di007V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-007 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI007_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-007" as const,
  releaseId: DI007_PERMANENT_RELEASE_ID,
  qlCount: DI007_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-073 through DI-QL-084 follow DI-006 DI-QL-061 through DI-QL-072" as const,
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
