import {
  generateIntCp005QuestionV15,
  INT_CP005_RUNTIME_VERSION_V15,
  type IntCp005Locale,
  type IntCp005QlId,
} from "./cp005-variable-growth-decay-runtime-v15";

export const INT_CP005_V15_FREEZE_ID = "INT-CP-005-EN-HI-PA-v15-frozen" as const;
export const INT_CP005_V15_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_IMPLEMENT_CP005_2026_08_15" as const,
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V15,
  qlRange: "INT-QL-086..INT-QL-095" as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  thresholdRealismNormalized: true as const,
  questionStudioActivationAuthorized: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp005V15FrozenQuestion(qlId: IntCp005QlId, seed: string, locale: IntCp005Locale = "en-IN") {
  const source = generateIntCp005QuestionV15(qlId, seed, locale);
  if (
    source.enabled || source.stagingStatus !== "NOT_STAGED" || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE" || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}/${locale}: V15 source delivery boundary is open`);
  return deepFreeze({
    ...source,
    freezeId: INT_CP005_V15_FREEZE_ID,
    freezeApproval: INT_CP005_V15_FREEZE_APPROVAL,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
