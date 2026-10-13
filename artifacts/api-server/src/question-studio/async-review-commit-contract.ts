// Pure batch/snapshot gate for a future task receiver before Neon mutation.
// The universal worker cannot choose run IDs, package ownership or review
// lifecycle flags: those always come from a queued canonical run in Neon.
import type { UniversalStudioComputeInput, UniversalStudioComputeResult } from "./universal-executor";

export class QuestionStudioReviewCommitError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "QuestionStudioReviewCommitError";
  }
}

export function validateQuestionStudioAsyncReviewBatch(
  rawSnapshot: unknown,
  batch: UniversalStudioComputeResult,
): UniversalStudioComputeInput {
  if (!rawSnapshot || typeof rawSnapshot !== "object" || Array.isArray(rawSnapshot)) {
    throw new QuestionStudioReviewCommitError("ASYNC_RUN_SNAPSHOT_INVALID","Stored queued request is invalid");
  }
  const snapshot=rawSnapshot as Record<string,unknown>;
  if (snapshot.queueVersion !== 1 || !snapshot.request ||
      typeof snapshot.request !== "object" || Array.isArray(snapshot.request)) {
    throw new QuestionStudioReviewCommitError("ASYNC_RUN_SNAPSHOT_INVALID","Stored queue protocol does not match");
  }
  const req=snapshot.request as Record<string,unknown>;
  const count=snapshot.count;
  if (!Number.isInteger(count) || (count as number) < 1 || (count as number) > 50 ||
      req.count !== count || typeof req.packageId !== "string" ||
      typeof req.engineId !== "string" || !Array.isArray(snapshot.selectedCpIds)) {
    throw new QuestionStudioReviewCommitError("ASYNC_RUN_SNAPSHOT_INVALID","Queued request is incomplete");
  }
  if (!batch || typeof batch !== "object" ||
      batch.packageId !== req.packageId || batch.engineId !== req.engineId ||
      !Array.isArray(batch.questions) || batch.questions.length !== count ||
      !Array.isArray(batch.generationContexts) || batch.generationContexts.length < 1 ||
      (batch.engineId === "quant-v4" && !batch.quantPlan)) {
    throw new QuestionStudioReviewCommitError("ASYNC_BATCH_MISMATCH","Worker response does not match the queued request");
  }
  for(const q of batch.questions) {
    if (!q || typeof q !== "object" ||
        !Array.isArray(q.options) || q.options.length < 2 ||
        !(typeof q.stem === "string" && q.stem.trim()) &&
        !(typeof q.text === "string" && q.text.trim())) {
      throw new QuestionStudioReviewCommitError("ASYNC_BATCH_INVALID","Generated question is incomplete");
    }
    if (q.correctIndex === undefined && q.correct === undefined && q.answer === undefined) {
      throw new QuestionStudioReviewCommitError("ASYNC_BATCH_INVALID","Generated answer is missing");
    }
    if (!(typeof q.explanation === "string" && q.explanation.trim()) &&
        !(Array.isArray(q.explanationLines) && q.explanationLines.length > 0)) {
      throw new QuestionStudioReviewCommitError("ASYNC_BATCH_INVALID","Generated explanation is missing");
    }
  }
  return {
    request: req as UniversalStudioComputeInput["request"],
    count: count as number,
    selectedCpIds: snapshot.selectedCpIds as string[],
    examProfileId: snapshot.examProfileId,
    difficultyPreset: snapshot.difficultyPreset,
    difficultyDistribution: snapshot.difficultyDistribution,
    forwardLegacyExamProfile: snapshot.forwardLegacyExamProfile as boolean|undefined,
    difficultyFilterSupported: snapshot.difficultyFilterSupported as boolean|undefined,
  };
}
