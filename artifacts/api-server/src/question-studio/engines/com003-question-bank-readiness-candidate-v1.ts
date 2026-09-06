import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-english-freeze-v1";
import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-localization-chapter-freeze-v1";
import {
  runCom003QuestionStudioPreRegistration,
  type Com003QuestionStudioPreviewQuestion,
} from "../../knowledge-v1/computer-awareness/com003-question-studio-pre-registration-adapter-v1";
import { COM003_QUESTION_STUDIO_ADMIN_PREVIEW_UI_FREEZE_V1 } from "../../knowledge-v1/computer-awareness/com003-question-studio-admin-preview-ui-freeze-v1";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const COM003_REQUIRED_PREBANK_PROVENANCE_FIELDS_V1 = [
  "sourceQuestionId",
  "targetFactId",
  "sourceIds",
  "sourceFactIds",
  "solverAuthority",
  "surfaceMode",
  "qlId",
  "cpId",
  "locale",
] as const;

export type Com003QuestionBankReadinessCandidateV1 = {
  status:
    | "REVIEW_RUN_PERSISTENCE_READY_BANK_ONLY_BLOCKED_DIFFICULTY"
    | "BLOCKED_FROZEN_PAYLOAD_OR_PROVENANCE";
  auditedQuestionCount: number;
  expectedQuestionCount: 684;
  qlCount: 19;
  languages: readonly ["en", "hi", "pa"];
  uniqueArtifactIds: boolean;
  frozenCorpusIntegrityProven: boolean;
  currentBankGateClosed: boolean;
  downstreamLifecycleLocked: boolean;
  candidateProvenanceComplete: boolean;
  semanticNormalizationProven: boolean;
  standardBankOnlyOverlayEligible: boolean;
  explicitDifficultyPresent: boolean;
  auditedDifficultyAuthorityPresent: boolean;
  reviewRunPersistenceReady: boolean;
  bankOnlyActivationReady: false;
  missingBankPrerequisites: string[];
  questionBankWritable: false;
  testEligible: false;
  productionReleaseAuthorized: false;
};

function present(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

function currentBankGatePayload(question: Com003QuestionStudioPreviewQuestion) {
  return {
    ...question,
    generationContext: {
      questionBankStatus: question.questionBankStatus,
      questionBankWritable: false,
      testEligibility: question.testEligibility,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };
}

function standardBankOverlayPayload(question: Com003QuestionStudioPreviewQuestion) {
  const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
  return {
    ...question,
    ...lifecycle,
    text: question.stem,
    correct: question.correctIndex,
    integrationAuthority: COM003_QUESTION_STUDIO_ADMIN_PREVIEW_UI_FREEZE_V1.authorityId,
    sourceFreezeAuthority: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: "COM-003",
      runtimeMode: "review-only",
      registrationStatus: "AUDIT_OVERLAY_NOT_REGISTERED",
      contentAuthorityVersion: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      localizationFreezeAuthorityId: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
      integrationAuthority: COM003_QUESTION_STUDIO_ADMIN_PREVIEW_UI_FREEZE_V1.authorityId,
      sourceFreezeAuthority: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
      sourceIds: question.sourceIds,
      sourceFactIds: question.sourceFactIds,
      targetFactId: question.targetFactId,
      solverAuthority: question.solverAuthority,
      surfaceMode: question.surfaceMode,
      versionScoped: question.versionScoped,
      language: question.language,
      locale: question.locale,
      qlId: question.qlId,
      cpId: question.cpId,
      difficultyClassifierVersion: null,
      productionDifficultyClaimAuthorized: false,
    },
  };
}

export function auditCom003QuestionBankReadinessCandidateV1(): Com003QuestionBankReadinessCandidateV1 {
  const qlIds = Array.from({ length: 19 }, (_, index) =>
    `COM-003-QL-${String(index + 1).padStart(3, "0")}`,
  );
  const languages = ["en", "hi", "pa"] as const;
  const artifactIds = new Set<string>();
  const missing = new Set<string>();
  let auditedQuestionCount = 0;
  let frozenCorpusIntegrityProven = true;
  let currentBankGateClosed = true;
  let downstreamLifecycleLocked = true;
  let semanticNormalizationProven = true;
  let standardBankOnlyOverlayEligible = true;
  let explicitDifficultyPresent = true;

  for (const qlId of qlIds) {
    for (const language of languages) {
      const generated = runCom003QuestionStudioPreRegistration({
        packageId: "COM-003",
        qlId,
        language,
        seed: `com003-prebank-readiness-v1:${qlId}:${language}`,
        count: 12,
      });

      frozenCorpusIntegrityProven &&=
        generated.questions.length === 12 &&
        generated.generationContext.registrationStatus === "NOT_REGISTERED" &&
        generated.generationContext.readOnly === true &&
        generated.generationContext.questionBankStatus === "NOT_STORED" &&
        generated.generationContext.testEligibility === "INELIGIBLE" &&
        generated.generationContext.productionReleased === false;

      for (const question of generated.questions) {
        auditedQuestionCount += 1;
        artifactIds.add(question.id);

        const currentIssue = getGeneratedQuestionBankEligibilityIssue(
          currentBankGatePayload(question),
        );
        currentBankGateClosed &&=
          currentIssue === "questionBankStatus is NOT_STORED" ||
          currentIssue === "questionBankWritable is false";

        downstreamLifecycleLocked &&=
          question.registrationStatus === "NOT_REGISTERED" &&
          question.preRegistrationOnly === true &&
          question.questionStudioDiscoverable === false &&
          question.readOnly === true &&
          question.questionBankStatus === "NOT_STORED" &&
          question.testEligibility === "INELIGIBLE" &&
          question.publiclyPublishable === false &&
          question.productionReleased === false;

        const provenance: Record<string, unknown> = {
          sourceQuestionId: question.sourceQuestionId,
          targetFactId: question.targetFactId,
          sourceIds: question.sourceIds,
          sourceFactIds: question.sourceFactIds,
          solverAuthority: question.solverAuthority,
          surfaceMode: question.surfaceMode,
          qlId: question.qlId,
          cpId: question.cpId,
          locale: question.locale,
        };
        for (const field of COM003_REQUIRED_PREBANK_PROVENANCE_FIELDS_V1) {
          if (!present(provenance[field])) missing.add(field);
        }

        explicitDifficultyPresent &&=
          present((question as Record<string, unknown>).difficulty) ||
          present((question as Record<string, unknown>).difficultyLabel);

        const overlay = standardBankOverlayPayload(question);
        const overlayIssue = getGeneratedQuestionBankEligibilityIssue(overlay);
        standardBankOnlyOverlayEligible &&= overlayIssue === null;

        try {
          const normalized = normalizeGeneratedQuestionPayload(overlay, {
            itemId: `com003-prebank-readiness-${auditedQuestionCount}`,
            generationRunCode: "COM003-PREBANK-READINESS-V1",
          });
          semanticNormalizationProven &&=
            normalized.stem === question.stem &&
            normalized.explanation === question.explanation &&
            normalized.correctIndex === question.correctIndex &&
            normalized.options.length === question.options.length &&
            normalized.options.every((option, index) => option === question.options[index]) &&
            normalized.answerModel.canonicalAnswer === question.canonicalAnswer;
        } catch {
          semanticNormalizationProven = false;
        }
      }
    }
  }

  const uniqueArtifactIds = artifactIds.size === auditedQuestionCount;
  frozenCorpusIntegrityProven &&=
    auditedQuestionCount === 684 &&
    artifactIds.size === 684;
  const missingCandidateProvenanceFields = [...missing].sort();
  const candidateProvenanceComplete = missingCandidateProvenanceFields.length === 0;
  const auditedDifficultyAuthorityPresent = false;
  const reviewRunPersistenceReady =
    frozenCorpusIntegrityProven &&
    currentBankGateClosed &&
    downstreamLifecycleLocked &&
    candidateProvenanceComplete &&
    semanticNormalizationProven &&
    standardBankOnlyOverlayEligible;

  const missingBankPrerequisites = [
    ...(!explicitDifficultyPresent ? ["explicitQuestionDifficulty"] : []),
    ...(!auditedDifficultyAuthorityPresent ? ["auditedDifficultyClassifierAuthority"] : []),
    "standardLifecycleRegistrationAuthority",
    "reviewRunPersistenceActivationAuthority",
  ];

  return {
    status: reviewRunPersistenceReady && !auditedDifficultyAuthorityPresent
      ? "REVIEW_RUN_PERSISTENCE_READY_BANK_ONLY_BLOCKED_DIFFICULTY"
      : "BLOCKED_FROZEN_PAYLOAD_OR_PROVENANCE",
    auditedQuestionCount,
    expectedQuestionCount: 684,
    qlCount: 19,
    languages,
    uniqueArtifactIds,
    frozenCorpusIntegrityProven,
    currentBankGateClosed,
    downstreamLifecycleLocked,
    candidateProvenanceComplete,
    semanticNormalizationProven,
    standardBankOnlyOverlayEligible,
    explicitDifficultyPresent,
    auditedDifficultyAuthorityPresent,
    reviewRunPersistenceReady,
    bankOnlyActivationReady: false,
    missingBankPrerequisites,
    questionBankWritable: false,
    testEligible: false,
    productionReleaseAuthorized: false,
  };
}
