import { normalizeGeneratedQuestionPayload } from "../../lib/admin-question-conversion";
import type { QuestionStudioGeneratedQuestion } from "../engine-types";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";

export const COM001_QUESTION_BANK_DRY_RUN_AUTHORITY =
  "COM-001-QUESTION-BANK-DRY-RUN-CANDIDATE-V1" as const;

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
  status: "BLOCKED_METADATA_PROVENANCE" | "READY_FOR_BANK_ONLY_REVIEW";
  auditedQuestionCount: number;
  qlCount: number;
  languages: readonly ["en", "hi", "pa"];
  bankOnlyLifecycleProven: boolean;
  liveQuestionBankLockPreserved: boolean;
  semanticNormalizationProven: boolean;
  missingNormalizedProvenanceFields: string[];
  productionActivationAuthorized: false;
};

const BANK_ONLY_DRY_RUN_LIFECYCLE = {
  questionBankStatus: "READY_FOR_STORAGE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY",
  questionBankAcceptanceAuthority: COM001_QUESTION_BANK_DRY_RUN_AUTHORITY,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
} as const;

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

function buildDryRunPayload(
  question: QuestionStudioGeneratedQuestion,
  generationContext: Record<string, unknown>,
) {
  const review = asRecord(question.questionStudioReview);
  return {
    ...question,
    ...BANK_ONLY_DRY_RUN_LIFECYCLE,
    generationContext: {
      ...generationContext,
      ...BANK_ONLY_DRY_RUN_LIFECYCLE,
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
  const missing = new Set<string>();
  let auditedQuestionCount = 0;
  let semanticNormalizationProven = true;
  let liveQuestionBankLockPreserved = true;
  let bankOnlyLifecycleProven = true;

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
        seed: `com001-bank-readiness-v1:${qlId}:${language}`,
      });

      for (let index = 0; index < generated.questions.length; index += 1) {
        const question = generated.questions[index]!;
        auditedQuestionCount += 1;
        liveQuestionBankLockPreserved &&=
          question.questionBankStatus === "NOT_STORED" &&
          question.questionBankWritable === false &&
          question.testEligible === false &&
          question.publiclyPublishable === false;

        const dryRunPayload = buildDryRunPayload(
          question,
          asRecord(generated.generationContext),
        );
        const normalized = normalizeGeneratedQuestionPayload(dryRunPayload, {
          itemId: `com001-bank-dry-run-${auditedQuestionCount}`,
          generationRunCode: "COM001-BANK-DRY-RUN-V1",
        });
        const generation = asRecord(normalized.answerModel.generation);

        semanticNormalizationProven &&=
          normalized.stem === String(question.stem ?? question.text ?? "") &&
          normalized.explanation === String(question.explanation ?? "") &&
          normalized.difficulty === String(question.difficultyLabel ?? question.difficulty ?? "") &&
          normalized.correctIndex === Number(question.correctIndex ?? question.correct) &&
          normalized.options.length === (Array.isArray(question.options) ? question.options.length : 0) &&
          normalized.answerModel.canonicalAnswer === question.canonicalAnswer;

        bankOnlyLifecycleProven &&=
          generation.questionBankStatus === "READY_FOR_STORAGE" &&
          generation.questionBankWritable === true &&
          generation.questionBankAcceptanceMode === "BANK_ONLY" &&
          generation.questionBankAcceptanceAuthority === COM001_QUESTION_BANK_DRY_RUN_AUTHORITY &&
          generation.testEligible === false &&
          generation.mockTestEligible === false &&
          generation.publiclyPublishable === false &&
          generation.automaticStudentPublication === false;

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
      bankOnlyLifecycleProven &&
      liveQuestionBankLockPreserved &&
      semanticNormalizationProven
        ? "READY_FOR_BANK_ONLY_REVIEW"
        : "BLOCKED_METADATA_PROVENANCE",
    auditedQuestionCount,
    qlCount: qlIds.length,
    languages,
    bankOnlyLifecycleProven,
    liveQuestionBankLockPreserved,
    semanticNormalizationProven,
    missingNormalizedProvenanceFields,
    productionActivationAuthorized: false,
  };
}
