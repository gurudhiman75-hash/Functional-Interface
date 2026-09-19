import type { Di008V2Difficulty, Di008V2ExamProfile, Di008V2TaskKind } from "./arithmetic-v2-types";

export const DI008_PERMANENT_RELEASE_ID = "DI-008-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Di008PermanentQlId =
  | "DI-QL-085"
  | "DI-QL-086"
  | "DI-QL-087"
  | "DI-QL-088"
  | "DI-QL-089"
  | "DI-QL-090"
  | "DI-QL-091"
  | "DI-QL-092"
  | "DI-QL-093"
  | "DI-QL-094"
  | "DI-QL-095"
  | "DI-QL-096";

export type Di008PermanentQlDescriptor = Readonly<{
  qlId: Di008PermanentQlId;
  taskKind: Di008V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di008V2Difficulty;
  supportedProfiles: readonly Di008V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["BANKING_PRELIMS", "BANKING_MAINS"] as const;

export const DI008_PERMANENT_QLS: readonly Di008PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-085", taskKind: "UNIT_INCREASE", label: "Increase in units sold", semanticContract: "Compare current and previous units for one named item and find the absolute increase.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-086", taskKind: "REVENUE_AMOUNT", label: "Revenue of one item", semanticContract: "Use units sold and selling price per unit for one named item to find its revenue.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-087", taskKind: "PERCENT_CHANGE", label: "Percentage change in units", semanticContract: "Compare current and previous units and express the change as a percentage of previous units.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-088", taskKind: "PROFIT_AMOUNT", label: "Profit amount", semanticContract: "Use units sold, cost price per unit and selling price per unit to calculate profit for the requested item or item group.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-089", taskKind: "PROFIT_PERCENT", label: "Profit percentage", semanticContract: "Calculate profit relative to cost for the requested item or aggregate group and express it as a percentage.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-090", taskKind: "REVENUE_SHARE", label: "Revenue share", semanticContract: "Find the requested item or group revenue and express it as a percentage share of the relevant total revenue.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-091", taskKind: "PROFIT_RATIO", label: "Ratio of profits", semanticContract: "Calculate profits for the requested items or groups and simplify their ratio in the order asked.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-092", taskKind: "AVERAGE_PROFIT", label: "Average profit", semanticContract: "Calculate the requested profits and find their arithmetic average.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-093", taskKind: "COMBINED_PERCENT_CHANGE", label: "Combined percentage change", semanticContract: "Aggregate previous and current units for multiple named items and find the overall percentage change.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-094", taskKind: "COMBINED_PROFIT_PERCENT", label: "Combined profit percentage", semanticContract: "Aggregate cost and revenue across multiple named items and calculate the combined profit percentage on total cost.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-095", taskKind: "GROUP_REVENUE_RATIO", label: "Ratio of group revenues", semanticContract: "Aggregate revenue for two requested item groups and simplify the ratio of the group totals.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-096", taskKind: "WEIGHTED_AVERAGE_SELLING_PRICE", label: "Weighted average selling price", semanticContract: "Use units sold as weights to calculate the combined average selling price per unit for the requested items.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI008_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI008_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi008PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di008PermanentQlId);
}

export function getDi008PermanentQlForTask(taskKind: Di008V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-008 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI008_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-008" as const,
  releaseId: DI008_PERMANENT_RELEASE_ID,
  qlCount: DI008_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-085 through DI-QL-096 follow DI-007 DI-QL-073 through DI-QL-084" as const,
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
