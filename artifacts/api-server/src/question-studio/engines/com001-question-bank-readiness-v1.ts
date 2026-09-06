import { normalizeGeneratedQuestionPayload } from "../../lib/admin-question-conversion";
import type { QuestionStudioGeneratedQuestion } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";

export const COM001_REQUIRED_BANK_PROVENANCE_FIELDS = [
  "sourceIds",
  "sourceFactIds",
  "solverAuthority",
  "contentAuthorityVersion",
  "englishFreezeAuthorityId",
  "englishCombinedFingerprint",
  "localizationFreezeAuthorityId",
  "localizationCombinedFingerprint",
  "difficultyClassifierVersion",
  "difficultyTopology",
  "difficultyRationale",
  "relationalSurfaceMode",
  "capacityConvention",
] as const;

export type Com001QuestionBankReadinessV1 = {
  status: "STANDARD_LIFECYCLE_READY" | "BLOCKED_METADATA_PROVENANCE";
  auditedQuestionCount: number;
  qlCount: number;
  languages: readonly ["en", "hi", "pa"];
  currentLifecycleMatchesStandard: boolean;
  downstreamLifecycleLocked: boolean;
  semanticNormalizationProven: boolean;
  missingNormalizedProvenanceFields: string[];
  productionReleaseAuthorized: false;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function present(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

function buildNormalizationPayload(
  question: QuestionStudioGeneratedQuestion,
  generationContext: Record<string, unknown>,
) {
  const review = asRecord(question.questionStudioReview);
  return {
    ...question,
    generationContext: {
      ...generationContext,
      contentAuthorityVersion:
        review.contentAuthorityVersion ?? generationContext.contentAuthorityVersion,
      englishFreezeAuthorityId:
        review.englishFreezeAuthorityId ?? generationContext.englishFreezeAuthorityId,
      englishCombinedFingerprint:
        review.englishCombinedFingerprint ?? generationContext.englishCombinedFingerprint,
      localizationFreezeAuthorityId:
        review.localizationFreezeAuthorityId ?? generationContext.localizationFreezeAuthorityId,
      localizationCombinedFingerprint:
        review.localizationCombinedFingerprint ?? generationContext.localizationCombinedFingerprint,
      difficultyClassifierVersion:
        review.difficultyClassifierVersion ?? generationContext.difficultyClassifierVersion,
      difficultyTopology: review.difficultyTopology ?? null,
      difficultyRationale: review.difficultyRationale ?? null,
      sourceIds: question.sourceIds ?? null,
      sourceFactIds: question.sourceFactIds ?? null,
      solverAuthority: question.solverAuthority ?? null,
      relationalSurfaceMode: question.relationalSurfaceMode ?? null,
      capacityConvention: question.capacityConvention ?? null,
    },
  };
}

export async function auditCom001QuestionBankReadinessV1(): Promise<Com001QuestionBankReadinessV1> {
  const qlIds = Array.from({ length: 9 }, (_, index) =>
    `COM-001-QL-${String(index + 1).padStart(3, "0")}`,
  );
  const languages = ["en", "hi", "pa"] as const;
  const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
  const missing = new Set<string>();
  let auditedQuestionCount = 0;
  let semanticNormalizationProven = true;
  let currentLifecycleMatchesStandard = true;
  let downstreamLifecycleLocked = true;

  for (const qlId of qlIds) {
    for (const language of languages) {
      const generated = await knowledgeV1Com001QuestionStudioAdapter.generate({
        engineId: "knowledge-v1",
        packageId: "COM-001",
        patternId: qlId,
        language,
        runtimeMode: "review-only",
        difficulty: "Mixed",
        count: 10,
        seed: `com001-bank-normalization-v1:${qlId}:${language}`,
      });

      for (const question of generated.questions) {
        auditedQuestionCount += 1;
        currentLifecycleMatchesStandard &&=
          question.lifecycleId === lifecycle.lifecycleId &&
          question.stage === lifecycle.stage &&
          question.questionBankStatus === lifecycle.questionBankStatus &&
          question.questionBankWritable === lifecycle.questionBankWritable &&
          question.questionBankAcceptanceMode === lifecycle.questionBankAcceptanceMode &&
          question.questionBankAcceptanceAuthority === lifecycle.questionBankAcceptanceAuthority &&
          question.reviewSurfaceRequired === lifecycle.reviewSurfaceRequired &&
          question.reviewRunPersistenceAllowed === lifecycle.reviewRunPersistenceAllowed &&
          question.canonicalQuestionPersistenceAllowed === lifecycle.canonicalQuestionPersistenceAllowed &&
          question.manualApprovalRequired === lifecycle.manualApprovalRequired;
        downstreamLifecycleLocked &&=
          question.testEligible === false &&
          question.mockTestEligible === false &&
          question.publiclyPublishable === false &&
          question.automaticStudentPublication === false &&
          question.productionReleaseAuthorized === false;

        const normalized = normalizeGeneratedQuestionPayload(
          buildNormalizationPayload(question, asRecord(generated.generationContext)),
          {
            itemId: `com001-bank-normalization-${auditedQuestionCount}`,
            generationRunCode: "COM001-STANDARD-LIFECYCLE-NORMALIZATION-V1",
          },
        );
        const generation = asRecord(normalized.answerModel.generation);

        semanticNormalizationProven &&=
          normalized.stem === String(question.stem ?? question.text ?? "") &&
          normalized.explanation === String(question.explanation ?? "") &&
          normalized.difficulty === String(question.difficultyLabel ?? question.difficulty ?? "") &&
          normalized.correctIndex === Number(question.correctIndex ?? question.correct) &&
          normalized.options.length === (Array.isArray(question.options) ? question.options.length : 0) &&
          normalized.answerModel.canonicalAnswer === question.canonicalAnswer;

        currentLifecycleMatchesStandard &&=
          generation.lifecycleId === lifecycle.lifecycleId &&
          generation.lifecycleStage === lifecycle.stage &&
          generation.reviewSurfaceRequired === lifecycle.reviewSurfaceRequired &&
          generation.reviewRunPersistenceAllowed === lifecycle.reviewRunPersistenceAllowed &&
          generation.canonicalQuestionPersistenceAllowed === lifecycle.canonicalQuestionPersistenceAllowed &&
          generation.manualApprovalRequired === lifecycle.manualApprovalRequired &&
          generation.questionBankStatus === lifecycle.questionBankStatus &&
          generation.questionBankWritable === lifecycle.questionBankWritable &&
          generation.questionBankAcceptanceMode === lifecycle.questionBankAcceptanceMode &&
          generation.questionBankAcceptanceAuthority === lifecycle.questionBankAcceptanceAuthority;
        downstreamLifecycleLocked &&=
          generation.testEligible === false &&
          generation.mockTestEligible === false &&
          generation.publiclyPublishable === false &&
          generation.automaticStudentPublication === false &&
          generation.productionReleaseAuthorized === false;

        const expectedProvenance = {
          sourceIds: question.sourceIds,
          sourceFactIds: question.sourceFactIds,
          solverAuthority: question.solverAuthority,
          contentAuthorityVersion: asRecord(question.questionStudioReview).contentAuthorityVersion,
          englishFreezeAuthorityId: asRecord(question.questionStudioReview).englishFreezeAuthorityId,
          englishCombinedFingerprint: asRecord(question.questionStudioReview).englishCombinedFingerprint,
          localizationFreezeAuthorityId: asRecord(question.questionStudioReview).localizationFreezeAuthorityId,
          localizationCombinedFingerprint: asRecord(question.questionStudioReview).localizationCombinedFingerprint,
          difficultyClassifierVersion: asRecord(question.questionStudioReview).difficultyClassifierVersion,
          difficultyTopology: asRecord(question.questionStudioReview).difficultyTopology,
          difficultyRationale: asRecord(question.questionStudioReview).difficultyRationale,
          relationalSurfaceMode: question.relationalSurfaceMode,
          capacityConvention: question.capacityConvention,
        } as Record<string, unknown>;

        for (const field of COM001_REQUIRED_BANK_PROVENANCE_FIELDS) {
          if (present(expectedProvenance[field]) && !present(generation[field])) {
            missing.add(field);
          }
        }
      }
    }
  }

  const missingNormalizedProvenanceFields = [...missing].sort();
  return {
    status:
      missingNormalizedProvenanceFields.length === 0 &&
      currentLifecycleMatchesStandard &&
      downstreamLifecycleLocked &&
      semanticNormalizationProven
        ? "STANDARD_LIFECYCLE_READY"
        : "BLOCKED_METADATA_PROVENANCE",
    auditedQuestionCount,
    qlCount: qlIds.length,
    languages,
    currentLifecycleMatchesStandard,
    downstreamLifecycleLocked,
    semanticNormalizationProven,
    missingNormalizedProvenanceFields,
    productionReleaseAuthorized: false,
  };
}
