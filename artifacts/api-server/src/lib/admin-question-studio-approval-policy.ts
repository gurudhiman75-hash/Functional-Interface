export type GeneratedItemApprovalMode = "question_bank" | "review_only";

export type GeneratedItemApprovalDisposition = Readonly<{
  mode: GeneratedItemApprovalMode;
  reason: string | null;
}>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Review-only approval is intentionally narrow. Both lifecycle flags must be
 * explicitly present so incomplete or legacy payloads continue through the
 * established Question Bank conversion and eligibility checks.
 */
export function getGeneratedItemApprovalDisposition(
  value: unknown,
): GeneratedItemApprovalDisposition {
  const payload = asRecord(value);
  const generationContext = asRecord(payload.generationContext);
  const questionBankStatus = asText(
    payload.questionBankStatus ?? generationContext.questionBankStatus,
  ).toUpperCase();
  const questionBankWritable =
    payload.questionBankWritable ?? generationContext.questionBankWritable;

  if (questionBankStatus === "NOT_STORED" && questionBankWritable === false) {
    return Object.freeze({
      mode: "review_only" as const,
      reason: "Payload explicitly disables Question Bank storage",
    });
  }

  return Object.freeze({
    mode: "question_bank" as const,
    reason: null,
  });
}
