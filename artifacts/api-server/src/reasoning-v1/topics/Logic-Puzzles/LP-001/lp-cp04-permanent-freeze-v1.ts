import { generateLpCp04BatchV3, LP_CP04_COUNTERFACTUAL_V3, type LpCp04CaseletV3 } from "./lp-cp04-counterfactual-v3.ts";

export const LP_CP04_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({
    qlId: "LP-QL-047" as const,
    authorityId: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY" as const,
    task: "Apply an additional condition to the original puzzle, retain every valid resulting arrangement or committee, and identify the option that must be true, must be selected, or must not be selected.",
  }),
] as const);

export const LP_CP04_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "LP_CP04_ENGLISH_FREEZE_V1" as const,
  parentAuthorityId: LP_CP04_COUNTERFACTUAL_V3.authorityId,
  packageId: "LP-CP04-COUNTERFACTUAL" as const,
  checkpointId: "LP-CP-012" as const,
  parentPackageIds: Object.freeze(["LP-001", "LP-004"] as const),
  permanentQlIds: Object.freeze(LP_CP04_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId)),
  permanentQlCount: LP_CP04_PERMANENT_QL_ALLOCATIONS.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
  learnerLanguage: "en" as const,
  supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  difficultyParentRouting: Object.freeze({
    Easy: "LP-001_GROUPING",
    Medium: "LP-001_GROUPING",
    Hard: "LP-004_COMMITTEE_SELECTION",
  } as const),
  answerDependencyContract: LP_CP04_COUNTERFACTUAL_V3.answerDependencyContract,
  hardDepthContract: LP_CP04_COUNTERFACTUAL_V3.hardDepthContract,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationStatus: "PENDING" as const,
  questionStudioStatus: "ENGLISH_INTEGRATION_PENDING" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  sourceSaturatedForTargetExams: false as const,
  productionEligible: false as const,
  nextAvailableQlId: "LP-QL-048" as const,
});

export type LpCp04PermanentCaselet = LpCp04CaseletV3 & {
  counterfactualChild: LpCp04CaseletV3["counterfactualChild"] & { qlId: "LP-QL-047" };
};

const LP001_PROFILE_BY_SURVEY_LABEL: Readonly<Record<string, string>> = Object.freeze({
  "Household Survey": "PUBLIC_HEALTH_FIELDWORK",
  "Lesson Planning": "TEACHER_TRAINING",
  "Customer-Service Audit": "BANK_BRANCH_AUDIT",
  "Field Inspection": "DISTRICT_OFFICERS",
  "Eligibility Check": "SCHOLARSHIP_VERIFICATION",
  "Household Visits": "CIVIC_WATER_AUDIT",
  "Student Interviews": "CAMPUS_RESEARCH",
  "Roads and Drainage": "MUNICIPAL_PLANNING",
});

function localizationProfileId(caselet: any): string | undefined {
  if (caselet.scenarioProfileId) return caselet.scenarioProfileId;
  const surveyLabel = caselet.groupLabels?.Survey;
  return surveyLabel ? LP001_PROFILE_BY_SURVEY_LABEL[surveyLabel] : undefined;
}

export function generateLpCp04PermanentBatch(seed = "lp-cp04-permanent-freeze-v1", count = 9): LpCp04PermanentCaselet[] {
  return generateLpCp04BatchV3(seed, count).map((caselet: any) => ({
    ...caselet,
    scenarioProfileId: localizationProfileId(caselet),
    counterfactualChild: {
      ...caselet.counterfactualChild,
      qlId: "LP-QL-047" as const,
    },
  })) as LpCp04PermanentCaselet[];
}
