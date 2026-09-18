import type { Di006V2Difficulty, Di006V2ExamProfile, Di006V2TaskKind } from "./caselet-v2-types";

export const DI006_PERMANENT_RELEASE_ID = "DI-006-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Di006PermanentQlId =
  | "DI-QL-061"
  | "DI-QL-062"
  | "DI-QL-063"
  | "DI-QL-064"
  | "DI-QL-065"
  | "DI-QL-066"
  | "DI-QL-067"
  | "DI-QL-068"
  | "DI-QL-069"
  | "DI-QL-070"
  | "DI-QL-071"
  | "DI-QL-072";

export type Di006PermanentQlDescriptor = Readonly<{
  qlId: Di006PermanentQlId;
  taskKind: Di006V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di006V2Difficulty;
  supportedProfiles: readonly Di006V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI006_PERMANENT_QLS: readonly Di006PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-061", taskKind: "DIRECT_STATED_VALUE", label: "Read directly stated caselet value", semanticContract: "Read the value stated directly for a named caselet category.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-062", taskKind: "SINGLE_RELATION_VALUE", label: "Find value from one caselet relation", semanticContract: "Start from the directly stated category and apply one given relation to determine the requested value.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-063", taskKind: "DIFFERENCE_BETWEEN_VALUES", label: "Difference between two caselet values", semanticContract: "Determine two requested shallow caselet values and find their absolute difference.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-064", taskKind: "COMBINED_TWO_VALUES", label: "Combine two caselet values", semanticContract: "Determine two requested shallow caselet values and add them.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-065", taskKind: "RATIO_OF_TWO_VALUES", label: "Ratio of two caselet values", semanticContract: "Determine two requested shallow caselet values and simplify their ratio in the order asked.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-066", taskKind: "SHARE_OF_TOTAL", label: "Percentage share of a caselet value", semanticContract: "Determine a requested caselet value and express it as a percentage of the stated overall total.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-067", taskKind: "AVERAGE_OF_TWO_VALUES", label: "Average of two caselet values", semanticContract: "Determine two requested shallow caselet values and calculate their arithmetic mean.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-068", taskKind: "CHAINED_RELATION_VALUE", label: "Find value through chained caselet relations", semanticContract: "Follow a multi-step dependency chain from the directly stated value to determine the requested category.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-069", taskKind: "REMAINDER_FROM_TOTAL", label: "Find remainder category from caselet total", semanticContract: "Reconstruct the four non-remainder categories and subtract their subtotal from the stated total.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-070", taskKind: "COMBINED_DERIVED_SHARE", label: "Combined share of two derived caselet values", semanticContract: "Reconstruct two derived categories, combine them, and express the sum as a percentage of the full total.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-071", taskKind: "REMAINDER_TO_DERIVED_RATIO", label: "Ratio of remainder to derived caselet value", semanticContract: "Reconstruct a chained category and the remainder category, then simplify their ratio in the requested order.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
  { qlId: "DI-QL-072", taskKind: "RELATIVE_PERCENT_EXCESS", label: "Relative percentage excess between derived caselet values", semanticContract: "Reconstruct two derived values, find their difference, and express the excess as a percentage of the smaller value.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED" },
] as const);

const BY_QL = new Map(DI006_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI006_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi006PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di006PermanentQlId);
}

export function getDi006PermanentQlForTask(taskKind: Di006V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-006 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI006_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-006" as const,
  releaseId: DI006_PERMANENT_RELEASE_ID,
  qlCount: DI006_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-061 through DI-QL-072 follow DI-005 DI-QL-049 through DI-QL-060" as const,
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
