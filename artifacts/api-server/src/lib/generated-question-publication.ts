function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export function isGeneratedQuestionPublicationBlocked(answerModel: unknown): boolean {
  const generation = asRecord(asRecord(answerModel).generation);
  return generation.publiclyPublishable === false || generation.publicationEnabled === false;
}
