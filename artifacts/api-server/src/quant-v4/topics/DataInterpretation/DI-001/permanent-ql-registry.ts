import type { Di001ExamProfile } from "./types";
import type { Di001V2Difficulty, Di001V2TaskKind } from "./table-v2-types";

export const DI001_PERMANENT_RELEASE_ID = "DI-001-PERMANENT-ENGLISH-REVIEW-P2" as const;

export type Di001PermanentQlId =
  | "DI-QL-027"
  | "DI-QL-028"
  | "DI-QL-029"
  | "DI-QL-030"
  | "DI-QL-031"
  | "DI-QL-032"
  | "DI-QL-033"
  | "DI-QL-034"
  | "DI-QL-035"
  | "DI-QL-036";

export type Di001PermanentQlDescriptor = Readonly<{
  qlId: Di001PermanentQlId;
  taskKind: Di001V2TaskKind;
  label: string;
  semanticContract: string;
  difficulty: Di001V2Difficulty;
  supportedProfiles: readonly Di001ExamProfile[];
  sourceStatus: "V2_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "HI_PA_REVIEW_CANDIDATE";
}>;

const PROFILES = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;

export const DI001_PERMANENT_QLS: readonly Di001PermanentQlDescriptor[] = Object.freeze([
  {
    qlId: "DI-QL-027",
    taskKind: "DIRECT_SELECTED",
    label: "Read one selected-candidate value",
    semanticContract: "Read the Selected value for a named centre directly from the shared table.",
    difficulty: "Easy",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-028",
    taskKind: "TOTAL_APPLICANTS",
    label: "Total applicants across centres",
    semanticContract: "Add the Applicants values for all five centres in the table.",
    difficulty: "Easy",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-029",
    taskKind: "LARGEST_SELECTED",
    label: "Identify the centre with highest selected count",
    semanticContract: "Compare all Selected values and identify the centre with the largest count.",
    difficulty: "Easy",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-030",
    taskKind: "DIFFERENCE_SELECTED",
    label: "Difference between selected counts",
    semanticContract: "Read two named Selected values and calculate their absolute difference.",
    difficulty: "Medium",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-031",
    taskKind: "PERCENTAGE_SELECTED",
    label: "Selection percentage at one centre",
    semanticContract: "Calculate Selected divided by Applicants multiplied by 100 for a named centre and report the nearest whole percent.",
    difficulty: "Medium",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-032",
    taskKind: "RATIO_APPLICANTS",
    label: "Ratio of applicants at two centres",
    semanticContract: "Form and simplify the Applicants ratio for two named centres in the requested order.",
    difficulty: "Medium",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-033",
    taskKind: "AVERAGE_SELECTED",
    label: "Average selected candidates",
    semanticContract: "Add the five Selected values, divide by the number of centres, and report the nearest whole number.",
    difficulty: "Medium",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-034",
    taskKind: "OVERALL_SELECTION_PERCENTAGE",
    label: "Overall selection percentage",
    semanticContract: "Aggregate applicants and selected candidates across all centres, then calculate selected as a percentage of combined applicants to the nearest whole percent.",
    difficulty: "Hard",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-035",
    taskKind: "SELECTED_TO_NOT_SELECTED_RATIO",
    label: "Selected to not-selected ratio",
    semanticContract: "Derive the combined not-selected total and simplify Selected : Not selected for all centres together.",
    difficulty: "Hard",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
  {
    qlId: "DI-QL-036",
    taskKind: "SELECTION_RATE_DIFFERENCE",
    label: "Difference between two selection rates",
    semanticContract: "Calculate two centre-specific selection percentages and report their absolute difference to the nearest whole percentage point.",
    difficulty: "Hard",
    supportedProfiles: PROFILES,
    sourceStatus: "V2_CERTIFIED",
    editorialStatus: "ENGLISH_REVIEW_APPROVED",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  },
] as const);

const BY_QL = new Map(DI001_PERMANENT_QLS.map((descriptor) => [descriptor.qlId, descriptor] as const));
const BY_TASK = new Map(DI001_PERMANENT_QLS.map((descriptor) => [descriptor.taskKind, descriptor] as const));

export function getDi001PermanentQl(qlId: string) {
  return BY_QL.get(qlId as Di001PermanentQlId);
}

export function getDi001PermanentQlForTask(taskKind: Di001V2TaskKind) {
  const descriptor = BY_TASK.get(taskKind);
  if (!descriptor) throw new Error(`DI-001 permanent ownership is missing for ${taskKind}.`);
  return descriptor;
}

export const DI001_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "DI-001" as const,
  releaseId: DI001_PERMANENT_RELEASE_ID,
  qlCount: DI001_PERMANENT_QLS.length,
  namespaceGuard: "DI-QL-027 through DI-QL-036 follow DI-010 DI-QL-014 through DI-QL-026" as const,
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
