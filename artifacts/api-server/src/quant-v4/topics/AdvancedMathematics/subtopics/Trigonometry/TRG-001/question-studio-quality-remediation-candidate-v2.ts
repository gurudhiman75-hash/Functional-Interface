import { generatePostFreezeRemediatedTrg001Question } from "./production-post-freeze-remediation-v1";
import type { Trg001QuestionStudioRequest } from "./question-studio-runtime";
import {
  generateQualityRemediatedTrg001QuestionStudioBatch,
} from "./question-studio-quality-remediation-candidate-v1";

export const TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V2 = Object.freeze({
  version: "TRG001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V2" as const,
  status: "AUDIT_CANDIDATE_NOT_ACTIVATED" as const,
  packageId: "TRG-001" as const,
  inheritsLearnerExplanationRemediation: true as const,
  semanticBatchDeduplication: true as const,
  semanticIdentityIncludesSeed: false as const,
  semanticIdentityIncludesOptionOrder: false as const,
  capacityPolicy: "FAIL_EXPLICITLY_IF_UNIQUE_CAPACITY_IS_EXHAUSTED" as const,
  activationAuthorized: false as const,
  publicReleaseAuthorized: false as const,
});

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record).sort().map((key) => [key, stableValue(record[key])]),
    );
  }
  return value;
}

export function semanticFingerprintForTrg001QuestionStudioPreview(preview: any) {
  const qlId = String(preview.questionLanguageId ?? preview.qlId ?? "");
  const seed = String(preview.seed ?? "");
  if (!qlId || !seed) throw new Error("TRG-001 semantic fingerprint requires qlId and seed.");

  // Use the canonical English source even for localized previews so wording,
  // locale and option order never change mathematical identity.
  const source: any = generatePostFreezeRemediatedTrg001Question(qlId, seed);
  return JSON.stringify(stableValue({
    packageId: "TRG-001",
    qlId,
    solveMode: source.solveMode,
    target: source.target,
    canonicalState: source.canonicalState ?? {},
    exactAnswer: source.exactAnswer ?? source.answer,
  }));
}

function requestedCount(request: Trg001QuestionStudioRequest) {
  return Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
}

function reindexQuestion(question: any, index: number, count: number, fingerprint: string) {
  return Object.freeze({
    ...question,
    reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V2",
    semanticFingerprint: fingerprint,
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
    qualityRemediation: TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V2,
    generationMetadata: Object.freeze({
      ...(question.generationMetadata ?? {}),
      questionIndex: index + 1,
      questionCount: count,
      reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V2",
      semanticFingerprint: fingerprint,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      semanticBatchDeduplication: true,
    }),
    proceduralLogic: Object.freeze({
      ...(question.proceduralLogic ?? {}),
      reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V2",
      semanticFingerprint: fingerprint,
      activationAuthorized: false,
      questionStudioEnabled: false,
      publicReleaseAuthorized: false,
      contentMutationAuthorized: false,
      semanticBatchDeduplication: true,
    }),
  });
}

export function generateSemanticallyUniqueTrg001QuestionStudioBatch(
  request: Trg001QuestionStudioRequest = {},
) {
  const targetCount = requestedCount(request);
  const attemptCount = Math.min(1000, Math.max(targetCount, targetCount * 8));
  const attempted: any = generateQualityRemediatedTrg001QuestionStudioBatch({
    ...request,
    count: attemptCount,
  });

  const seen = new Set<string>();
  const selectedQuestions: any[] = [];
  const selectedPackages: any[] = [];
  const selectedFingerprints: string[] = [];

  for (let index = 0; index < (attempted.questions ?? []).length; index += 1) {
    const question = attempted.questions[index];
    const fingerprint = semanticFingerprintForTrg001QuestionStudioPreview(question);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    selectedQuestions.push(question);
    selectedPackages.push((attempted.questionPackages ?? [])[index]);
    selectedFingerprints.push(fingerprint);
    if (selectedQuestions.length === targetCount) break;
  }

  if (selectedQuestions.length < targetCount) {
    throw Object.assign(
      new Error(
        `TRG-001 unique semantic capacity exhausted: requested ${targetCount}, found ${selectedQuestions.length} unique questions after ${attemptCount} attempts.`,
      ),
      {
        statusCode: 409,
        code: "TRG001_UNIQUE_SEMANTIC_CAPACITY_EXHAUSTED",
        requestedCount: targetCount,
        uniqueCount: selectedQuestions.length,
        attemptedCount: attemptCount,
      },
    );
  }

  const questions = selectedQuestions.map((question, index) =>
    reindexQuestion(question, index, targetCount, selectedFingerprints[index]!),
  );

  return Object.freeze({
    ...attempted,
    questions,
    questionPackages: selectedPackages,
    generationContext: Object.freeze({
      ...(attempted.generationContext ?? {}),
      reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V2",
      requestedQuestionCount: targetCount,
      attemptedQuestionCount: attemptCount,
      acceptedUniqueQuestionCount: questions.length,
      semanticBatchDeduplication: true,
      semanticIdentityIncludesSeed: false,
      semanticIdentityIncludesOptionOrder: false,
      capacityPolicy: "FAIL_EXPLICITLY_IF_UNIQUE_CAPACITY_IS_EXHAUSTED",
      activationAuthorized: false,
      questionStudioDiscoverable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      qualityRemediationVersion: TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V2.version,
    }),
  });
}
