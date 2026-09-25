import type { Di003V2Difficulty, Di003V2ExamProfile, Di003V2TaskKind } from "./grouped-bar-v2-types";

export const DI003_PERMANENT_RELEASE_ID = "DI-003-PERMANENT-ENGLISH-REVIEW-P2" as const;

export type Di003PermanentQlId =
  | "DI-QL-037"
  | "DI-QL-038"
  | "DI-QL-039"
  | "DI-QL-040"
  | "DI-QL-041"
  | "DI-QL-042"
  | "DI-QL-043"
  | "DI-QL-044"
  | "DI-QL-045"
  | "DI-QL-046"
  | "DI-QL-047"
  | "DI-QL-048";

export type Di003PermanentQlDescriptor = Readonly<{
  qlId: Di003PermanentQlId;
  taskKind: Di003V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di003V2Difficulty;
  supportedProfiles: readonly Di003V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "HI_PA_REVIEW_CANDIDATE";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI003_PERMANENT_QLS: readonly Di003PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-037", taskKind: "DIRECT_BAR_VALUE", label: "Read one grouped-bar value", semanticContract: "Read the requested series value for a named category directly from the grouped bar chart.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-038", taskKind: "HIGHEST_CATEGORY_FOR_SERIES", label: "Identify highest category in one series", semanticContract: "Compare the five bars of one series and identify the category with the maximum value.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-039", taskKind: "LOWEST_CATEGORY_FOR_SERIES", label: "Identify lowest category in one series", semanticContract: "Compare the five bars of one series and identify the category with the minimum value.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-040", taskKind: "CROSS_SERIES_DIFFERENCE", label: "Difference between two series in one category", semanticContract: "Read both series in one named category and calculate their absolute difference.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-041", taskKind: "COMBINED_CATEGORY_TOTAL", label: "Combined total of both bars in one category", semanticContract: "Add the two visible series values for one named category.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-042", taskKind: "WITHIN_SERIES_DIFFERENCE", label: "Difference across two categories in one series", semanticContract: "Read one series across two named categories and calculate the absolute difference.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-043", taskKind: "CATEGORY_RATIO_WITHIN_SERIES", label: "Ratio across two categories in one series", semanticContract: "Read one series in two named categories and simplify their ratio in the requested order.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-044", taskKind: "SERIES_AVERAGE", label: "Average across all grouped-bar categories", semanticContract: "Add all five values of one series and divide by five.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-045", taskKind: "COMBINED_CATEGORY_RATIO", label: "Ratio of two combined category totals", semanticContract: "Add both series within each of two named categories, then simplify the ratio of the two combined totals.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-046", taskKind: "PERCENT_CHANGE_WITHIN_SERIES", label: "Percentage increase within one series", semanticContract: "Read two values from one series, find the increase from the lower value to the higher value, and report it as the nearest whole percent of the lower value.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-047", taskKind: "CATEGORY_SHARE_OF_SERIES_TOTAL", label: "Category share of a series total", semanticContract: "Find one category value as the nearest whole percent of the five-category total for the same series.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
  { qlId: "DI-QL-048", taskKind: "TOTAL_SERIES_PERCENT_EXCESS", label: "Percentage excess of one series total over the other", semanticContract: "Aggregate both series across all categories and report by what nearest whole percent the larger certified series total exceeds the smaller one.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_REVIEW_CANDIDATE" },
] as const);

const BY_QL = new Map(DI003_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI003_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi003PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di003PermanentQlId);
}

export function getDi003PermanentQlForTask(taskKind: Di003V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-003 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI003_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-003" as const,
  releaseId: DI003_PERMANENT_RELEASE_ID,
  qlCount: DI003_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-037 through DI-QL-048 follow DI-001 DI-QL-027 through DI-QL-036" as const,
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
