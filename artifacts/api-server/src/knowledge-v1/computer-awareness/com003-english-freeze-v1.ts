import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";

const expectedQlIds = Array.from({ length: 19 }, (_, index) => `COM-003-QL-${String(index + 1).padStart(3, "0")}`);
const actualQlIds = COM003_PERMANENT_QLS.map((ql) => ql.qlId);
if (JSON.stringify(actualQlIds) !== JSON.stringify(expectedQlIds)) {
  throw new Error(`COM-003 permanent QL allocation drifted before English freeze: ${actualQlIds.join(",")}`);
}

export const COM003_ENGLISH_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-ENGLISH-FREEZE-V1" as const,
  chapterCode: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  permanentQlIds: Object.freeze(expectedQlIds),
  permanentQlRange: "COM-003-QL-001..COM-003-QL-019" as const,
  frozenQuestionCount: 228,
  frozenQuestionsPerQl: 12,
  sourceGeneratorVersion: "COM003_ENGLISH_REVIEW_CORPUS_V4" as const,
  sourceBranch: "feature/com003-office-productivity-discovery-v1" as const,
  sourceHeadSha: "66f4c7b58d1bb2fb17ab3cfe1cedb91beb0035d0" as const,
  sourceGeneratorBlobSha: "d4816422f6d8ec17ab0c76e5c2783c466a82cca1" as const,
  validationGate: Object.freeze({
    workflowName: "COM-003 Review Synthesis One-Off" as const,
    workflowRunId: 33405305126,
    workflowJobId: 99531307386,
    validatedMergeSha: "bd12b2fa25650f4628f7aaf3fd79213e29116a63" as const,
    conclusion: "success" as const,
    questionCount: 228,
    qlCount: 19,
    allQuestionsDeterministic: true,
    minimumUniqueStemsPerQl: 12,
    minimumUniqueExplanationsPerQl: 7,
    duplicateStemGroups: 0,
    blockerCount: 0,
    advisoryCount: 0,
    editorialStatus: "EDITORIAL_AUDIT_CLEAN" as const,
    globalAnswerPositions: Object.freeze([67, 48, 47, 66] as const),
  }),
  frozenSemanticFields: Object.freeze([
    "qlId",
    "surfaceMode",
    "targetFactId",
    "sourceFactIds",
    "sourceIds",
    "correctIndex",
    "versionScoped",
    "reviewOnly",
    "runtimeRegistered",
  ] as const),
  versionScopeContract: Object.freeze({
    representation: "versionScoped boolean plus protected platform/version wording in stem and source fact" as const,
    standaloneVersionScopeFieldPresent: false,
  }),
  governance: Object.freeze({
    englishFrozen: true,
    englishContentMutationAllowed: false,
    hindiPunjabiLocalizationAuthorized: true,
    localizationFrozen: false,
    runtimeRegistrationAuthorized: false,
    questionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    generatedItemManualApprovalRequired: true,
  }),
  nextGate: "COM003_HINDI_PUNJABI_LOCALIZATION_REVIEW_V1" as const,
});
