import {
  INT_CP007_ENGLISH_VERSION,
  generateIntCp007EnglishQuestion as generateApprovedV8,
} from "./cp007-scheme-equivalence-english-v8";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_FREEZE_ID = "INT-CP-007-EN-v8-frozen" as const;
export const INT_CP007_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_CP007_ENGLISH_V8_2026_08_19" as const,
  approvedEnglishVersion: INT_CP007_ENGLISH_VERSION,
  approvedReviewHead: "c657dad54e2c8ecc5f7c451247bbf5db7114dc96" as const,
  reviewWorkflowRun: 32165510413 as const,
  reviewWorkflowJob: 95804042994 as const,
  reviewArtifactId: 9335310867 as const,
  reviewArtifactDigest: "sha256:07985fc95a8d3a3a3f1fee43c559fbbe33fdd4033e47af6697e69ed00f7ffe97" as const,
  questionStudioActivationAuthorized: false as const,
  registrationAuthorized: false as const,
  questionBankStorageAuthorized: false as const,
  testDeliveryAuthorized: false as const,
  publicDeliveryAuthorized: false as const,
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

export function generateIntCp007EnglishFrozenQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
) {
  const source = generateApprovedV8(qlId, seed, locale);
  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}: CP007 English V8 delivery boundary is open`);

  return deepFreeze({
    ...source,
    freezeId: INT_CP007_ENGLISH_FREEZE_ID,
    freezeApproval: INT_CP007_ENGLISH_FREEZE_APPROVAL,
    editorialStatus: "ENGLISH_FROZEN" as const,
    approvalStatus: "APPROVED_ENGLISH_FROZEN" as const,
    allocationStatus: "INACTIVE_ENGLISH_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
