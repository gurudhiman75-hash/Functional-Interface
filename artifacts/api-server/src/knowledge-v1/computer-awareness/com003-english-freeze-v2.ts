import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V16_2,
  auditCom003V162,
} from "./com003-review-synthesis-v16-2";

const audit = auditCom003V162();
if (!audit.valid) {
  throw new Error(`COM-003 English Freeze V2 cannot bind an invalid V16.2 corpus: ${audit.issues.join(", ")}`);
}

const expectedQlIds = Array.from(
  { length: 19 },
  (_, index) => `COM-003-QL-${String(index + 1).padStart(3, "0")}`,
);
const actualQlIds = COM003_PERMANENT_QLS.map((ql) => ql.qlId);
if (JSON.stringify(actualQlIds) !== JSON.stringify(expectedQlIds)) {
  throw new Error(`COM-003 permanent QL allocation drifted before English Freeze V2: ${actualQlIds.join(",")}`);
}

const perQl = Object.freeze(
  expectedQlIds.map((qlId) => {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => q.qlId === qlId);
    return Object.freeze({
      qlId,
      questionCount: questions.length,
      uniqueStemCount: new Set(questions.map((q) => q.stem.trim().toLowerCase())).size,
      uniqueExplanationCount: new Set(questions.map((q) => q.explanation.trim().toLowerCase())).size,
    });
  }),
);

export const COM003_ENGLISH_FREEZE_AUTHORITY_V2 = Object.freeze({
  authorityId: "COM-003-ENGLISH-FREEZE-V2" as const,
  chapterCode: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  permanentQlIds: Object.freeze(expectedQlIds),
  permanentQlRange: "COM-003-QL-001..COM-003-QL-019" as const,
  frozenQuestionCount: COM003_ENGLISH_REVIEW_CORPUS_V16_2.length,
  frozenQuestionsPerQl: 12,
  sourceGeneratorVersion: "COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
  sourceGeneratorBlobSha: "4a178060b56225be96e8a0b45f65f70907496d1c" as const,
  sourceBranch: "feature/com003-office-productivity-discovery-v1" as const,
  reviewedHeadSha: "2290c088051c505104843bc89a90c94a39d52bc4" as const,
  validationGate: Object.freeze({
    reviewWorkflowName: "COM-003 Review Synthesis One-Off" as const,
    reviewWorkflowRunId: 33937659577,
    explanationWorkflowName: "COM-003 V16.2 Explanation Quality" as const,
    explanationWorkflowRunId: 33937659614,
    conclusion: "success" as const,
    questionCount: 228,
    qlCount: 19,
    duplicateStemGroups: 0,
    targetExplanationDiversityQls: Object.freeze([
      "COM-003-QL-011",
      "COM-003-QL-014",
      "COM-003-QL-017",
      "COM-003-QL-019",
    ] as const),
    targetExplanationDiversity: 12,
  }),
  perQl,
  frozenSemanticFields: Object.freeze([
    "qlId",
    "cpId",
    "examSurfaceFamily",
    "surfaceMode",
    "targetFactId",
    "sourceFactIds",
    "sourceIds",
    "correctIndex",
    "canonicalAnswer",
    "versionScoped",
  ] as const),
  frozenLearnerFacingFields: Object.freeze([
    "stem",
    "options",
    "explanation",
  ] as const),
  supersedesEnglishFreezeAuthorityId: "COM-003-ENGLISH-FREEZE-V1" as const,
  governance: Object.freeze({
    englishFrozen: true,
    englishContentMutationAllowed: false,
    correctionRequiresNewVersion: true,
    hindiPunjabiLocalizationV2Authorized: true,
    legacyV4LocalizationDirectReuseAuthorized: false,
    questionStudioV16_2PromotionAuthorized: false,
    difficultyAuthorityMayBindToThisCorpus: true,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    productionReleased: false,
  }),
  nextGate: "COM003_HINDI_PUNJABI_LOCALIZATION_V2" as const,
});
