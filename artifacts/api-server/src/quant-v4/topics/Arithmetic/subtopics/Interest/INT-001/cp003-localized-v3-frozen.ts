import type { IntCp003QlId } from "./cp003-exam-model";
import { generateIntCp003FinalLocalizedQuestionV3, INT_CP003_HI_PA_FINAL_RUNTIME_V3 } from "./cp003-localized-final-runtime-v3";
import type { IntCp003LocalizedLocale, IntCp003LocalizedQuestion } from "./cp003-localization-types";

export const INT_CP003_HI_PA_V3_FREEZE_ID = "INT-CP-003-HI-PA-v3-frozen" as const;

export const INT_CP003_HI_PA_V3_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_FINISH_CP003_INSTRUCTION_2026_08_14" as const,
  approvalDate: "2026-08-14" as const,
  canonicalEnglishFreezeId: "INT-CP-003-EN-v1-frozen" as const,
  approvedLocalizedRuntime: INT_CP003_HI_PA_FINAL_RUNTIME_V3,
  approvedSourceHead: "b79bbafda70b69394793c7355f5b9bd51d1aad72" as const,
  approvedWorkflowRunId: 31792783876 as const,
  approvedArtifactId: 9216158934 as const,
  approvedArtifactDigest: "sha256:16fd4787a40a1a3a4549512f40d3f857a49fd6a749155c03e3e5bb1c74ab87bc" as const,
  qlRange: "INT-QL-053..INT-QL-066" as const,
  qlCount: 14 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  punjabiCompoundInterest: "ਮਿਸ਼ਰਤ ਵਿਆਜ" as const,
  mathWrappers: "EXAMTREE_MATHJAX_LATEX" as const,
  inlineDelimiter: "\\(...\\)" as const,
  displayDelimiter: "\\[...\\]" as const,
  maximumVisibleDecimalPlaces: 2 as const,
  wholeRupeeDotZeroZeroAllowed: false as const,
  formulaFirstExplanations: true as const,
  optionMisconceptionOwnershipPreserved: true as const,
  sourceStepIdentityPreserved: true as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function assertFrozenSourceBoundary(question: IntCp003LocalizedQuestion, locale: IntCp003LocalizedLocale): void {
  if (question.editorialStatus !== "MULTILINGUAL_LOCALISATION_REVIEW" || question.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED") {
    throw new Error(`${question.qlId}/${question.seed}/${locale}: V3 source review boundary changed.`);
  }
  if (
    question.enabled
    || question.stagingStatus !== "NOT_STAGED"
    || question.registrationStatus !== "NOT_REGISTERED"
    || question.questionStudioDiscoverable
    || question.questionBankStatus !== "NOT_STORED"
    || question.testEligibility !== "INELIGIBLE"
    || question.publiclyPublishable
    || question.lifecycle.enabled
    || question.lifecycle.registrationStatus !== "NOT_REGISTERED"
    || question.lifecycle.questionStudioDiscoverable
  ) throw new Error(`${question.qlId}/${question.seed}/${locale}: V3 source delivery boundary is open.`);
}

export function generateIntCp003HiPaV3FrozenQuestion(
  qlId: IntCp003QlId,
  seed: string,
  locale: IntCp003LocalizedLocale,
) {
  const source = generateIntCp003FinalLocalizedQuestionV3(qlId, seed, locale);
  assertFrozenSourceBoundary(source, locale);

  const lifecycle = Object.freeze({
    permanentQlId: qlId,
    maturity: "MULTILINGUAL_FROZEN" as const,
    reviewStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });

  return deepFreeze({
    ...source,
    freezeId: INT_CP003_HI_PA_V3_FREEZE_ID,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    freezeApproval: INT_CP003_HI_PA_V3_FREEZE_APPROVAL,
    lifecycle,
  });
}
