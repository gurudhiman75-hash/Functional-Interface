export type GeneratedItemApprovalMode = "question_bank" | "review_only";

export type GeneratedItemApprovalDisposition = Readonly<{
  mode: GeneratedItemApprovalMode;
  reason: string | null;
}>;

/**
 * This function is called only after an explicit administrator review action,
 * or when reconciling an item already approved by an administrator.
 * Chapter-level generation lifecycle labels are NOT a Question Bank veto.
 * Actual content quality, duplicates and valid answer models are checked
 * separately in the approval and conversion transactions.
 */
export function getGeneratedItemApprovalDisposition(
  _value: unknown,
): GeneratedItemApprovalDisposition {
  return Object.freeze({
    mode: "question_bank" as const,
    reason: null,
  });
}
