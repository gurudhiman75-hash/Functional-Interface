import { COM004_PERMANENT_QL_ALLOCATIONS_V1 } from "./com004-permanent-ql-allocation-v1";
import {
  COM004_ENGLISH_CHAPTER_CANDIDATE_V1,
  auditCom004EnglishChapterCandidateV1,
} from "./com004-english-chapter-candidate-v1";

const audit = auditCom004EnglishChapterCandidateV1();
if (!audit.valid) {
  throw new Error(`COM-004 English Freeze V1 cannot bind an invalid chapter candidate: ${audit.issues.join(", ")}`);
}

const expectedQlIds = Array.from(
  { length: 17 },
  (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}`,
);
const actualQlIds = COM004_PERMANENT_QL_ALLOCATIONS_V1.map((ql) => ql.permanentQlId);
if (JSON.stringify(actualQlIds) !== JSON.stringify(expectedQlIds)) {
  throw new Error(`COM-004 permanent QL allocation drifted before English Freeze V1: ${actualQlIds.join(",")}`);
}

const perQl = Object.freeze(
  expectedQlIds.map((qlId) => {
    const questions = COM004_ENGLISH_CHAPTER_CANDIDATE_V1.filter((q) => q.qlId === qlId);
    return Object.freeze({
      qlId,
      questionCount: questions.length,
      uniqueStemCount: new Set(questions.map((q) => q.stem.trim().toLowerCase())).size,
      uniqueExplanationCount: new Set(questions.map((q) => q.explanation.trim().toLowerCase())).size,
      surfaceFamilyCount: new Set(questions.map((q) => q.surfaceFamily)).size,
    });
  }),
);

export const COM004_ENGLISH_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-ENGLISH-FREEZE-V1" as const,
  chapterCode: "COM-004" as const,
  chapterTitle: "Internet, Web, E-mail & Digital Services" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  permanentQlIds: Object.freeze(expectedQlIds),
  permanentQlRange: "COM-004-QL-001..COM-004-QL-017" as const,
  frozenQuestionCount: COM004_ENGLISH_CHAPTER_CANDIDATE_V1.length,
  frozenQuestionsPerQl: 12,
  sourceGeneratorVersion: "COM004_ENGLISH_CHAPTER_CANDIDATE_V1" as const,
  sourceGeneratorBlobSha: "f8094bed97c9f50b1b2e6da51ffb55aef90df783" as const,
  sourceBranch: "feature/com004-internet-web-email-discovery-v1" as const,
  reviewedHeadSha: "560e189b28022e013d674df07910fa70d89dd191" as const,
  validationGate: Object.freeze({
    workflowName: "COM-004 English Chapter Candidate V1" as const,
    workflowRunId: 34044007854,
    conclusion: "success" as const,
    questionCount: 204,
    qlCount: 17,
    questionsPerQl: 12,
    duplicateStemGroups: 0,
    wave1EditorialOverlay: "V1.1" as const,
    wave4EditorialOverlay: "V1.1" as const,
  }),
  perQl,
  frozenSemanticFields: Object.freeze([
    "qlId",
    "authorityProposalId",
    "sourceCandidateIds",
    "surfaceFamily",
    "correctIndex",
    "canonicalAnswer",
  ] as const),
  frozenLearnerFacingFields: Object.freeze([
    "stem",
    "options",
    "explanation",
  ] as const),
  governance: Object.freeze({
    englishFrozen: true,
    englishContentMutationAllowed: false,
    correctionRequiresNewVersion: true,
    hindiPunjabiLocalizationV1Authorized: true,
    questionStudioEnglishPromotionAuthorized: false,
    difficultyAuthorityMayBindToThisCorpus: true,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publicPublicationAuthorized: false,
    productionReleased: false,
  }),
  nextGate: "COM004_HINDI_PUNJABI_LOCALIZATION_V1" as const,
});
