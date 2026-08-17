import {
  INT_CP005_RUNTIME_VERSION_V14,
  generateIntCp005QuestionV14,
  type IntCp005Locale,
  type IntCp005QlId,
} from "./cp005-variable-growth-decay-runtime-v14";

export const INT_CP005_V14_FREEZE_ID = "INT-CP-005-EN-HI-PA-v14-frozen" as const;

export const INT_CP005_V14_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_IMPLEMENT_CP005_INSTRUCTION_2026_08_14" as const,
  approvalDate: "2026-08-14" as const,
  canonicalProblemId: "INT-CP-005" as const,
  qlRange: "INT-QL-086..INT-QL-095" as const,
  qlCount: 10 as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  approvedRuntime: INT_CP005_RUNTIME_VERSION_V14,
  mathStandard: "EXAMTREE_MATHJAX_LATEX" as const,
  inlineDelimiter: "\\(...\\)" as const,
  displayDelimiter: "\\[...\\]" as const,
  contextValueSemanticQlIds: Object.freeze(["INT-QL-086", "INT-QL-088"] as const),
  contextValueFormatting: Object.freeze({
    INVESTMENT: "INR" as const,
    SALARY: "INR" as const,
    POPULATION: "COUNT_PEOPLE" as const,
    PRODUCTION: "COUNT_UNITS" as const,
  }),
  thresholdSampler: "INDEPENDENT_DETERMINISTIC_STREAM" as const,
  planComparisonSampler: "INDEPENDENT_DETERMINISTIC_STREAM_WITH_EXACT_MONEY_SAFETY" as const,
  arbitraryPlanSeedHardening: true as const,
  learnerContentFrozen: true as const,
  lifecycleClosed: true as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp005V14FrozenQuestion(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
) {
  const source = generateIntCp005QuestionV14(qlId, seed, locale);
  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${seed}/${locale}: CP005 V14 source delivery boundary is open`);
  }

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
    freezeId: INT_CP005_V14_FREEZE_ID,
    freezeApproval: INT_CP005_V14_FREEZE_APPROVAL,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    lifecycle,
  });
}
