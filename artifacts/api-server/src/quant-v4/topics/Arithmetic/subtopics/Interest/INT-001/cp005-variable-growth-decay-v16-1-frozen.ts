import {
  INT_CP005_RUNTIME_VERSION_V16_1,
  INT_CP005_V16_1_QL_IDS,
  generateIntCp005QuestionV16_1Final,
} from "./cp005-variable-growth-decay-runtime-v16-1-final-v2";
import {
  INT_CP005_V16_1_LOCALIZED_VERSION,
  generateIntCp005QuestionV16_1Localized,
  type IntCp005V16_1Locale,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized-v5";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_1_FREEZE_ID = "INT-CP-005-EN-HI-PA-v16.1-frozen" as const;
export const INT_CP005_V16_1_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_CP005_V16_1_2026_08_16" as const,
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V16_1,
  localizedVersion: INT_CP005_V16_1_LOCALIZED_VERSION,
  learnerQls: INT_CP005_V16_1_QL_IDS,
  excludedQl: "INT-QL-094" as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  diversityHardened: true as const,
  questionStudioActivationAuthorized: false as const,
});

export type IntCp005V16_1FreezeLocale = "en-IN" | IntCp005V16_1Locale;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

export function generateIntCp005V16_1FrozenQuestion(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005V16_1FreezeLocale = "en-IN",
) {
  if (qlId === "INT-QL-094") throw new Error("INT-QL-094 remains outside CP005 V16.1 frozen learner authority.");
  const source = locale === "en-IN"
    ? generateIntCp005QuestionV16_1Final(qlId, seed, "en-IN")
    : generateIntCp005QuestionV16_1Localized(qlId, seed, locale);

  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}/${locale}: V16.1 source delivery boundary is open`);

  return deepFreeze({
    ...source,
    freezeId: INT_CP005_V16_1_FREEZE_ID,
    freezeApproval: INT_CP005_V16_1_FREEZE_APPROVAL,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
