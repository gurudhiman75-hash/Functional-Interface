import {
  INT_CP006_QL_IDS,
  INT_CP006_RUNTIME_VERSION,
  generateIntCp006Question,
  type IntCp006QlId,
} from "./cp006-si-ci-relations-runtime-v4-final";

export const INT_CP006_ENGLISH_FREEZE_ID = "INT-CP-006-EN-v1-frozen" as const;
export const INT_CP006_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_CP006_ENGLISH_2026_08_17" as const,
  runtimeVersion: INT_CP006_RUNTIME_VERSION,
  learnerQls: INT_CP006_QL_IDS,
  locales: Object.freeze(["en-IN"] as const),
  approvedSourceHead: "a1179b6e584a7ce8c1e842a290a3cb8fccc47068" as const,
  reviewWorkflowRun: 31959447968 as const,
  reviewArtifactId: 9266878505 as const,
  reviewArtifactDigest: "sha256:2d3516a3fa308f4e85d1673218b65be4647fd13a406e1cf949a9d67a15aa4f90" as const,
  questionStudioActivationAuthorized: false as const,
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

export function generateIntCp006EnglishFrozenQuestion(
  qlId: IntCp006QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
) {
  const source = generateIntCp006Question(qlId, seed, locale);

  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}/${locale}: CP006 source delivery boundary is open`);

  return deepFreeze({
    ...source,
    freezeId: INT_CP006_ENGLISH_FREEZE_ID,
    freezeApproval: INT_CP006_ENGLISH_FREEZE_APPROVAL,
    editorialStatus: "ENGLISH_FROZEN" as const,
    approvalStatus: "APPROVED_ENGLISH_FROZEN" as const,
    allocationStatus: "INACTIVE_ENGLISH_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
