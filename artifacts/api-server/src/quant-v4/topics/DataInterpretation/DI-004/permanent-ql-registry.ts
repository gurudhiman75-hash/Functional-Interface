import type { Di004V2Difficulty, Di004V2ExamProfile, Di004V2TaskKind } from "./line-v2-types";

export type Di004PermanentQlId =
  | "DI-QL-109"
  | "DI-QL-110"
  | "DI-QL-111"
  | "DI-QL-112"
  | "DI-QL-113"
  | "DI-QL-114"
  | "DI-QL-115"
  | "DI-QL-116"
  | "DI-QL-117"
  | "DI-QL-118"
  | "DI-QL-119"
  | "DI-QL-120";

export const DI004_PERMANENT_RELEASE_ID = "DI-004-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Di004PermanentQlDescriptor = Readonly<{
  qlId: Di004PermanentQlId;
  taskKind: Di004V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di004V2Difficulty;
  supportedProfiles: readonly Di004V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI004_PERMANENT_QLS: readonly Di004PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-109", taskKind: "CROSS_SERIES_DIFFERENCE", label: "Difference between two line values", semanticContract: "Read both series for one named period and calculate their absolute difference.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-110", taskKind: "COMBINED_PERIOD_TOTAL", label: "Combined total in one period", semanticContract: "Read both series for one named period and add the two values.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-111", taskKind: "FIRST_OVERTAKE_PERIOD", label: "Identify first overtake", semanticContract: "Scan the two lines left to right and identify the first period where the first series moves above the second after being lower.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-112", taskKind: "CLOSEST_LINES_PERIOD", label: "Identify minimum line gap", semanticContract: "Compare the absolute gap between the two series across all six periods and identify the minimum.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-113", taskKind: "THREE_PERIOD_AVERAGE", label: "Three-period average", semanticContract: "Add one named series across three consecutive periods and report the average to the nearest whole number.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-114", taskKind: "CONSECUTIVE_PERCENT_INCREASE", label: "Consecutive-period percentage increase", semanticContract: "Find the increase of one named series between consecutive periods and express it as the nearest whole percent of the earlier value.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-115", taskKind: "TWO_PERIOD_SERIES_RATIO", label: "Two-period series ratio", semanticContract: "Add the first series across two named periods, do the same for the second series, then simplify their ratio.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-116", taskKind: "TWO_PERIOD_COMBINED_TOTAL", label: "Two-period four-value total", semanticContract: "Add both series across two named periods to obtain the four-value combined total.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-117", taskKind: "TOTAL_SERIES_RATIO", label: "Ratio of complete series totals", semanticContract: "Add all six values for each series separately and simplify the ratio of the two totals.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-118", taskKind: "COMBINED_PERIOD_PERCENT_EXCESS", label: "Percentage excess between combined period totals", semanticContract: "Combine both series in each of two periods and express how much the larger combined total exceeds the smaller as a nearest whole percent.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-119", taskKind: "TOTAL_SERIES_PERCENT_EXCESS", label: "Percentage excess between complete series totals", semanticContract: "Add all six values for both series, find the total difference, and express it as a nearest whole percent of the smaller total.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-120", taskKind: "THREE_VS_THREE_RATIO", label: "Three-period group ratio across series", semanticContract: "Add three specified values from the first series and three specified values from the second series, then simplify the ratio of the two group totals.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI004_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI004_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi004PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di004PermanentQlId);
}

export function getDi004PermanentQlForTask(taskKind: Di004V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-004 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI004_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-004" as const,
  releaseId: DI004_PERMANENT_RELEASE_ID,
  qlCount: DI004_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-109 through DI-QL-120 are permanent DI-004 V2 ownership" as const,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: true,
    questionStudioMode: "CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
});
