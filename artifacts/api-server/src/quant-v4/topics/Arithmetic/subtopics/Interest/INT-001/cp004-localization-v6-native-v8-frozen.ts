import { generateIntCp004V6NativeEditorialV8Question } from "./cp004-localization-v6-native-editorial-v8";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_V8_FREEZE_ID = "INT-CP-004-HI-PA-V6-v8-frozen" as const;

export const INT_CP004_HI_PA_V6_V8_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_FREEZE_INSTRUCTION_2026_08_14" as const,
  approvalDate: "2026-08-14" as const,
  approvedContentHead: "8055c9631173194ea79064db10d88611289dad4f" as const,
  approvedEditorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v8" as const,
  canonicalEnglishFreezeId: "INT-CP-004-EN-v2-frozen" as const,
  approvedWorkflowRunId: 31765956031 as const,
  approvedArtifactId: 9206323262 as const,
  approvedArtifactDigest: "sha256:1c9fca6914a3697caac0e5b35684953d760153010fee8d50cd22d15857065ca0" as const,
  qlRange: "INT-QL-067..INT-QL-085" as const,
  qlCount: 19 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  PunjabiCompoundInterest: "ਮਿਸ਼ਰਤ ਵਿਆਜ" as const,
  mathWrappers: "EXAMTREE_MATHJAX_LATEX" as const,
  inlineDelimiter: "\\(...\\)" as const,
  displayDelimiter: "\\[...\\]" as const,
  maximumVisibleDecimalPlaces: 2 as const,
  wholeRupeeDotZeroZeroAllowed: false as const,
  genuinePaisePreserved: true as const,
  roundedEffectiveRatesStayApproximate: true as const,
  stemStyle: "SLIGHTLY_WORDIER_EXAM_STYLE" as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function assertApprovedSource(question: IntCp004V6LocalizedQuestion, locale: IntCp004V6Locale): void {
  if (question.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED") {
    throw new Error(`${question.qlId}/${question.seed}/${locale}: V8 source approval boundary changed.`);
  }
  if (
    question.enabled
    || question.stagingStatus !== "NOT_STAGED"
    || question.registrationStatus !== "NOT_REGISTERED"
    || question.questionStudioDiscoverable
    || question.questionBankStatus !== "NOT_STORED"
    || question.testEligibility !== "INELIGIBLE"
    || question.publiclyPublishable
  ) throw new Error(`${question.qlId}/${question.seed}/${locale}: V8 source delivery boundary is open.`);
}

export function generateIntCp004HiPaV6V8FrozenQuestion(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
) {
  const source = generateIntCp004V6NativeEditorialV8Question(qlId, seed, locale);
  assertApprovedSource(source, locale);

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
    freezeId: INT_CP004_HI_PA_V6_V8_FREEZE_ID,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    approval: INT_CP004_HI_PA_V6_V8_APPROVAL,
    lifecycle,
  });
}
