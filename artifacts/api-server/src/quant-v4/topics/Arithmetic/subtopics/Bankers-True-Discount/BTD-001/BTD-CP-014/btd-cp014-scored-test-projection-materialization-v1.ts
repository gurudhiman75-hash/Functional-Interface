import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  buildBtdCp012QuestionBankAdmissionPreviewV1,
  type BtdCp012Language,
} from "../BTD-CP-012/btd-cp012-question-bank-admission-v1";
import {
  BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY,
  BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
  buildBtdCp013ScoredTestProjectionReadinessV1,
} from "../BTD-CP-013/btd-cp013-scored-test-projection-readiness-v1";

export const BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_VERSION =
  "BTD-001-CP014-SCORED-TEST-PROJECTION-MATERIALIZATION-v1" as const;
export const BTD_CP014_MATERIALIZATION_AUTHORITY =
  "BTD-001-CP014-EXAM-SCOPED-MATERIALIZATION-AFTER-APPROVED-ENGLISH-BANK-SOURCE-v1" as const;

export const BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY = Object.freeze({
  status: "TEST_PROJECTION_MATERIALIZATION_APPROVED_BUT_TEST_INELIGIBLE" as const,
  readinessAuthority: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
  sourceQuestionBankAdmissionRequired: true as const,
  sourceGenerationItemMustBeApproved: true as const,
  sourceGenerationLanguage: "en" as const,
  sourceBankQuestionMustBeApproved: true as const,
  examScopedProjectionRequired: true as const,
  canonicalExamVersionRequired: true as const,
  canonicalTaxonomyBindingRequired: true as const,
  frozenTranslationAuthorityRequired: true as const,
  testProjectionMaterializationApproved: true as const,
  testProjectionWriteRouteEnabled: true as const,
  projectedQuestionStatus: "approved" as const,
  testEligibilityApprovalGranted: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: false as const,
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertUuid(value: string, label: string): string {
  if (!UUID_RE.test(value)) throw new Error(`${label} must be a canonical UUID.`);
  return value.toLowerCase();
}

function frozenLearnerSurface(question: Record<string, any>) {
  return Object.freeze({
    packageId: question.packageId,
    qlId: question.qlId,
    cpId: question.cpId,
    language: question.language,
    locale: question.locale,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    packageExplanation: question.packageExplanation,
    difficulty: question.difficulty,
    frozenContentFingerprint: question.frozenContentFingerprint,
    frozenChapterFingerprint: question.frozenChapterFingerprint,
    freezeVersion: question.freezeVersion,
    sourceStateFingerprint: question.sourceStateFingerprint,
  });
}

export type BtdCp014SupportedLanguage = BtdCp012Language;

export function buildBtdCp014ScoredTestProjectionMaterializationPlanV1(input: {
  qlId: BtdPermanentQlId;
  seed: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  supportedLanguages?: readonly BtdCp014SupportedLanguage[];
}) {
  if (!BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.examScopedProjectionRequired) {
    throw new Error("BTD CP014 requires the certified CP013 exam-scoped projection authority.");
  }
  if (BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.testEligible) {
    throw new Error("BTD CP013 readiness authority unexpectedly opened scored-test eligibility.");
  }

  const examVersionId = assertUuid(input.examVersionId, "examVersionId");
  const primaryTaxonomyNodeId = assertUuid(input.primaryTaxonomyNodeId, "primaryTaxonomyNodeId");
  const languageSet = new Set<BtdCp014SupportedLanguage>(input.supportedLanguages ?? ["en", "hi", "pa"]);
  if (!languageSet.has("en")) {
    throw new Error("BTD CP014 materialization requires English as the canonical source language.");
  }

  const english = buildBtdCp012QuestionBankAdmissionPreviewV1(input.qlId, input.seed, "en") as Record<string, any>;
  if (english.language !== "en" || english.questionBankAcceptanceMode !== "BANK_ONLY") {
    throw new Error("BTD CP014 requires an English CP012 bank-only source payload.");
  }
  if (english.testEligible !== false || english.publiclyPublishable !== false) {
    throw new Error("BTD CP014 source must still be locked from scored tests and public release.");
  }

  const projection = buildBtdCp013ScoredTestProjectionReadinessV1({
    qlId: input.qlId,
    seed: input.seed,
    language: "en",
    examVersionId,
    primaryTaxonomyNodeId,
  }) as Record<string, any>;
  if (projection.sourceQuestionBankAdmissionKey !== english.questionBankAdmissionKey) {
    throw new Error("BTD CP014 projection identity drifted from the CP012 English bank source.");
  }

  const translations = (["hi", "pa"] as const)
    .filter((language) => languageSet.has(language))
    .map((language) => {
      const localized = buildBtdCp012QuestionBankAdmissionPreviewV1(input.qlId, input.seed, language) as Record<string, any>;
      if (localized.qlId !== english.qlId) throw new Error(`${language}: QL drift from English source.`);
      if (localized.semanticSignature !== english.semanticSignature) throw new Error(`${language}: semantic signature drift.`);
      if (localized.answerSemantic !== english.answerSemantic) throw new Error(`${language}: answer semantic drift.`);
      if (
        localized.sourceStateFingerprint != null
        && english.sourceStateFingerprint != null
        && localized.sourceStateFingerprint !== english.sourceStateFingerprint
      ) throw new Error(`${language}: source-state drift.`);
      if (localized.correctIndex !== english.correctIndex) throw new Error(`${language}: correct-option ownership drift.`);
      if (localized.options.length !== english.options.length) throw new Error(`${language}: option-count drift.`);
      if (localized.testEligible !== false || localized.publiclyPublishable !== false) {
        throw new Error(`${language}: localized source crossed a delivery boundary.`);
      }
      return Object.freeze({
        language,
        learner: frozenLearnerSurface(localized),
        sourceQuestionBankAdmissionKey: localized.questionBankAdmissionKey,
        frozenContentFingerprint: localized.frozenContentFingerprint,
      });
    });

  return Object.freeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-014" as const,
    materializationVersion: BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_VERSION,
    materializationAuthority: BTD_CP014_MATERIALIZATION_AUTHORITY,
    readinessAuthority: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
    projectionKey: String(projection.projectionKey),
    qlId: input.qlId,
    seed: input.seed,
    examVersionId,
    primaryTaxonomyNodeId,
    englishSourceQuestionBankAdmissionKey: english.questionBankAdmissionKey,
    englishLearner: frozenLearnerSurface(english),
    translations: Object.freeze(translations),
    lifecycle: BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  });
}
