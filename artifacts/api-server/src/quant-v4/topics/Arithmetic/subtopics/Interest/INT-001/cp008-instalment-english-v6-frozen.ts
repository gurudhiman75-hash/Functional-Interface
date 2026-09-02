import {
  INT_CP008_ENGLISH_VERSION,
  generateIntCp008EnglishQuestion as generateApprovedV6,
} from "./cp008-instalment-english-v6";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_FREEZE_ID = "INT-CP-008-EN-v6-frozen" as const;

export const INT_CP008_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_CP008_ENGLISH_V6_2026_08_20" as const,
  approvedEnglishVersion: INT_CP008_ENGLISH_VERSION,
  approvedReviewHead: "eeb6020c3605785f8d10d98650f5b0735f660835" as const,
  reviewWorkflowRun: 32339889054 as const,
  reviewWorkflowJob: 96336688857 as const,
  reviewArtifactId: 9395993328 as const,
  reviewArtifactDigest: "sha256:47febf3024cf0e9f450460c2e62ea6d249661b3e1af8ef0ec808f1310f7d4cba" as const,
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

export function generateIntCp008EnglishFrozenQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
) {
  const source = generateApprovedV6(qlId, seed, locale);

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
    throw new Error(`${qlId}/${seed}: CP008 English V6 delivery boundary is open`);
  }

  return deepFreeze({
    ...source,
    freezeId: INT_CP008_ENGLISH_FREEZE_ID,
    freezeApproval: INT_CP008_ENGLISH_FREEZE_APPROVAL,
    editorialStatus: "ENGLISH_FROZEN" as const,
    approvalStatus: "APPROVED_ENGLISH_FROZEN" as const,
    allocationStatus: "INACTIVE_ENGLISH_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
