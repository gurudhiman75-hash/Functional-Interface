import type { Di005V2Difficulty, Di005V2ExamProfile, Di005V2TaskKind } from "./pie-v2-types";

export const DI005_PERMANENT_RELEASE_ID = "DI-005-PERMANENT-ENGLISH-REVIEW-P1" as const;

export type Di005PermanentQlId =
  | "DI-QL-049"
  | "DI-QL-050"
  | "DI-QL-051"
  | "DI-QL-052"
  | "DI-QL-053"
  | "DI-QL-054"
  | "DI-QL-055"
  | "DI-QL-056"
  | "DI-QL-057"
  | "DI-QL-058"
  | "DI-QL-059"
  | "DI-QL-060";

export type Di005PermanentQlDescriptor = Readonly<{
  qlId: Di005PermanentQlId;
  taskKind: Di005V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di005V2Difficulty;
  supportedProfiles: readonly Di005V2ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "HI_PA_FROZEN";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI005_PERMANENT_QLS: readonly Di005PermanentQlDescriptor[] = Object.freeze([
  { qlId: "DI-QL-049", taskKind: "DIRECT_SECTOR_PERCENT", label: "Read a visible pie-sector percentage", semanticContract: "Read the printed percentage for a named visible sector directly from the pie chart.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-050", taskKind: "LARGEST_SECTOR_IDENTIFICATION", label: "Identify the largest pie sector", semanticContract: "Compare all sector shares and identify the category with the largest share.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-051", taskKind: "SMALLEST_SECTOR_IDENTIFICATION", label: "Identify the smallest pie sector", semanticContract: "Compare all sector shares and identify the category with the smallest share.", difficulty: "Easy", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-052", taskKind: "MISSING_SECTOR_PERCENT", label: "Recover a missing pie-sector percentage", semanticContract: "Add the printed sector percentages and subtract from 100% to recover the hidden sector share.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-053", taskKind: "SECTOR_ANGLE_DEGREES", label: "Convert a pie-sector percentage to angle", semanticContract: "Convert a named sector percentage to its central angle using percentage multiplied by 360 degrees divided by 100.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-054", taskKind: "SECTOR_COUNT_FROM_TOTAL", label: "Find sector count from total", semanticContract: "Apply a named sector percentage to the stated whole-chart total to obtain the represented count.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-055", taskKind: "COMBINED_SECTOR_PERCENT", label: "Combine two pie-sector percentages", semanticContract: "Add the percentage shares of two named sectors of the same pie chart.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-056", taskKind: "DIFFERENCE_IN_COUNTS", label: "Difference between two pie-sector counts", semanticContract: "Convert two named sector shares to counts from the common total and find their absolute difference.", difficulty: "Medium", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-057", taskKind: "RATIO_OF_TWO_SECTORS", label: "Ratio of two pie sectors after hidden-share recovery", semanticContract: "Recover the hidden sector when required and simplify the ratio of the two requested sector shares in order.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-058", taskKind: "RELATIVE_SECTOR_PERCENT_EXCESS", label: "Relative percentage excess between two sectors", semanticContract: "Recover the hidden share when required, find the difference between two sector shares, and express that difference as a percentage of the smaller sector.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-059", taskKind: "COMBINED_SECTOR_ANGLE", label: "Combined angle of two sectors after hidden-share recovery", semanticContract: "Recover the hidden share when required, convert the two requested shares to central angles, and add those angles.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
  { qlId: "DI-QL-060", taskKind: "REMAINDER_AFTER_TWO_SECTORS_COUNT", label: "Remaining count after excluding two sectors", semanticContract: "Recover the hidden share when required, subtract two named sector shares from the whole, and convert the remaining share to a count.", difficulty: "Hard", supportedProfiles: PROFILES, sourceStatus: "V2_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "HI_PA_FROZEN" },
] as const);

const BY_QL = new Map(DI005_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI005_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi005PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di005PermanentQlId);
}

export function getDi005PermanentQlForTask(taskKind: Di005V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-005 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI005_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-005" as const,
  releaseId: DI005_PERMANENT_RELEASE_ID,
  qlCount: DI005_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-049 through DI-QL-060 follow DI-003 DI-QL-037 through DI-QL-048" as const,
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
