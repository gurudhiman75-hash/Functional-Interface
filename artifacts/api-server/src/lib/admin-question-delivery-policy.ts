export type GeneratedQuestionDeliveryFlags = Readonly<{
  testEligible?: boolean | null;
  publiclyPublishable?: boolean | null;
}>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export function getGeneratedQuestionDeliveryIssues(
  flags: GeneratedQuestionDeliveryFlags,
): string[] {
  const issues: string[] = [];
  const testEligible = flags.testEligible;
  const publiclyPublishable = flags.publiclyPublishable;

  // Generated questions may be activated for scored tests without being
  // released for standalone/public delivery, and vice versa. Preserve legacy
  // payloads with no explicit generation flags, but do not let one explicit
  // negative gate be bypassed by a missing counterpart.
  if (testEligible === false && publiclyPublishable !== true) {
    issues.push("Generation lifecycle has not enabled scored-test eligibility.");
  }
  if (publiclyPublishable === false && testEligible !== true) {
    issues.push("Generation lifecycle has not enabled public publication.");
  }
  return issues;
}

export function isGeneratedQuestionBlueprintEligible(answerModel: unknown): boolean {
  const answer = asRecord(answerModel);
  const generation = asRecord(answer.generation);
  if (Object.keys(generation).length === 0) return true;
  const value = generation.testEligible;
  return value !== false;
}

export function generatedQuestionDeliveryFlagsFromAnswerModel(
  answerModel: unknown,
): GeneratedQuestionDeliveryFlags {
  const answer = asRecord(answerModel);
  const generation = asRecord(answer.generation);
  return Object.freeze({
    testEligible:
      typeof generation.testEligible === "boolean" ? generation.testEligible : null,
    publiclyPublishable:
      typeof generation.publiclyPublishable === "boolean"
        ? generation.publiclyPublishable
        : null,
  });
}
