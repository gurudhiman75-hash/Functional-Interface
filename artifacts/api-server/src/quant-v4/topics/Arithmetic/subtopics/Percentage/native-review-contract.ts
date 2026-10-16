/** Native Percentage delivery is a technical review candidate, not publication approval. */
export function pctNativeReviewLifecycle(packageId: string, language: string) {
  if (
    !/^PCT-(?:00[1-7]|ALL)$/.test(packageId) ||
    !["hi", "pa"].includes(language)
  )
    return {};
  return {
    runtimeMode: "REVIEW_ONLY" as const,
    reviewStatus: "NATIVE_REVIEW_CANDIDATE" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    questionBankEligible: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    productionReleaseAuthorized: false as const,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
  };
}

export function withPctNativeReviewContract(pkg: any) {
  const lifecycle = pctNativeReviewLifecycle(pkg.archetypeId, pkg.language);
  if (!lifecycle.reviewOnly) return pkg;
  if (pkg.nativeReviewContract === "PCT-NATIVE-REVIEW-V1") return pkg;
  return {
    ...pkg,
    ...lifecycle,
    nativeReviewContract: "PCT-NATIVE-REVIEW-V1",
    sourceQuestionId: pkg.questionId,
    questionId: `${pkg.archetypeId}:${pkg.questionId}:${pkg.language}:native-review-v1`,
    parameters: { ...pkg.parameters, ...lifecycle },
    traceability: {
      ...pkg.traceability,
      ...lifecycle,
      sourceQuestionId: pkg.questionId,
      localizationReview: "HUMAN_REVIEW_PENDING",
      language: pkg.language,
    },
  };
}
