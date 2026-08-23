import {
  INT_CP008_LOCALIZED_VERSION,
  generateIntCp008LocalizedReviewQuestion as generateApprovedV6,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v6";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_FREEZE_ID = "INT-CP-008-HI-PA-v6-frozen" as const;
export const INT_CP008_LOCALIZED_FREEZE_AUTHORITY = "PRODUCT_OWNER_CONTINUE_INSTRUCTION_CP008_HI_PA_V6_2026_08_23" as const;
export const INT_CP008_LOCALIZED_APPROVED_REVIEW_VERSION = INT_CP008_LOCALIZED_VERSION;
export const INT_CP008_LOCALIZED_APPROVED_REVIEW_HEAD = "dfc509819d696e1567b195e1dcdbb07ecfa34c89" as const;
export const INT_CP008_LOCALIZED_APPROVED_REVIEW_RUN = 32356478704 as const;
export const INT_CP008_LOCALIZED_APPROVED_REVIEW_JOB = 96386645819 as const;
export const INT_CP008_LOCALIZED_APPROVED_REVIEW_ARTIFACT = 9401846686 as const;
export const INT_CP008_LOCALIZED_APPROVED_REVIEW_DIGEST = "sha256:cf97694b3411f1b3af07c10fbc2990262926d6075ee80f0b00590639ff7e0152" as const;
export type { IntCp008LocalizedLocale };

export const INT_CP008_LOCALIZED_FREEZE_LIFECYCLE = Object.freeze({
  questionStudioActivationAuthorized: false as const,
  registrationAuthorized: false as const,
  questionBankStorageAuthorized: false as const,
  testDeliveryAuthorized: false as const,
  publicDeliveryAuthorized: false as const,
  mergeAuthorized: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

export function generateIntCp008LocalizedFrozenQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: IntCp008LocalizedLocale,
) {
  const source = generateApprovedV6(qlId, seed, locale) as any;

  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.questionBankWritable
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${seed}/${locale}: CP008 localized V6 delivery boundary is open`);
  }

  return deepFreeze({
    ...source,
    localizedVersion: INT_CP008_LOCALIZED_FREEZE_ID,
    freezeAuthority: INT_CP008_LOCALIZED_FREEZE_AUTHORITY,
    approvedReviewVersion: INT_CP008_LOCALIZED_APPROVED_REVIEW_VERSION,
    approvedReviewHead: INT_CP008_LOCALIZED_APPROVED_REVIEW_HEAD,
    approvedReviewRun: INT_CP008_LOCALIZED_APPROVED_REVIEW_RUN,
    approvedReviewJob: INT_CP008_LOCALIZED_APPROVED_REVIEW_JOB,
    approvedReviewArtifact: INT_CP008_LOCALIZED_APPROVED_REVIEW_ARTIFACT,
    approvedReviewDigest: INT_CP008_LOCALIZED_APPROVED_REVIEW_DIGEST,
    freezeLifecycle: INT_CP008_LOCALIZED_FREEZE_LIFECYCLE,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    sourceEnglishContentFrozen: true as const,
    learnerContentFrozen: true as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_FREEZE_ID}`,
  });
}
