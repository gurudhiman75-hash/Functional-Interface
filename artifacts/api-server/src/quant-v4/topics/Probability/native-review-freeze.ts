import type { ProbabilityNativeLanguage } from "./multilingual-foundation";

export const PROBABILITY_NATIVE_FREEZE_ID = "PRB-ML06-HUMAN-REVIEW-FREEZE-v1" as const;

export type ProbabilityNativeReviewDecision = Readonly<{
  qlId: string;
  language: ProbabilityNativeLanguage;
  reviewer: string;
  reviewedAt: string;
  decision: "APPROVED" | "CHANGES_REQUIRED";
  notes: string;
}>;

/**
 * ML-06 deliberately ships with no fabricated human decisions.
 * Review decisions must be recorded explicitly after the native Question Studio
 * review surface has been inspected by a human reviewer.
 */
export const PROBABILITY_NATIVE_REVIEW_DECISIONS: readonly ProbabilityNativeReviewDecision[] = Object.freeze([]);

export const PROBABILITY_NATIVE_FREEZE = Object.freeze({
  freezeId: PROBABILITY_NATIVE_FREEZE_ID,
  sourceParityCheckpoint: "ML-05",
  requiredQlCountPerLanguage: 216,
  requiredDecisionCount: 432,
  recordedDecisionCount: PROBABILITY_NATIVE_REVIEW_DECISIONS.length,
  hindiApprovedCount: 0,
  punjabiApprovedCount: 0,
  status: "PENDING_HUMAN_REVIEW" as const,
  questionStudioReviewEnabled: true,
  nativeQuestionStudioGenerationEnabled: false,
  nativeScoredMockEnabled: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});

export function getProbabilityNativeFreezeSummary() {
  const approved = PROBABILITY_NATIVE_REVIEW_DECISIONS.filter((decision) => decision.decision === "APPROVED");
  const hindiApprovedCount = approved.filter((decision) => decision.language === "hi").length;
  const punjabiApprovedCount = approved.filter((decision) => decision.language === "pa").length;
  const uniqueReviewed = new Set(
    PROBABILITY_NATIVE_REVIEW_DECISIONS.map((decision) => `${decision.qlId}:${decision.language}`),
  );
  const freezeReady =
    PROBABILITY_NATIVE_REVIEW_DECISIONS.length === 432
    && uniqueReviewed.size === 432
    && approved.length === 432
    && hindiApprovedCount === 216
    && punjabiApprovedCount === 216;

  return Object.freeze({
    ...PROBABILITY_NATIVE_FREEZE,
    recordedDecisionCount: PROBABILITY_NATIVE_REVIEW_DECISIONS.length,
    uniqueReviewedCount: uniqueReviewed.size,
    approvedDecisionCount: approved.length,
    hindiApprovedCount,
    punjabiApprovedCount,
    freezeReady,
    status: freezeReady ? "HUMAN_REVIEW_COMPLETE_AWAITING_EXPLICIT_FREEZE" as const : "PENDING_HUMAN_REVIEW" as const,
  });
}

export function assertProbabilityNativeFreezeReady(): void {
  const summary = getProbabilityNativeFreezeSummary();
  if (summary.freezeReady) return;
  throw new Error(
    `Probability native freeze is not ready: ${summary.approvedDecisionCount}/432 explicit human approvals recorded.`,
  );
}

export function assertProbabilityNativeStudentDeliveryAllowed(): never {
  throw new Error(
    "Probability Hindi/Punjabi student delivery remains disabled. ML-06 human review and a separate explicit release freeze are required.",
  );
}
