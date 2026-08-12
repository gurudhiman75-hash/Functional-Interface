import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  type Cp004RegistryEntry,
  type IntCp004QlId,
} from "./cp004-frequency-math";

export const INT_CP004_ENGLISH_FREEZE_V2_ID = "INT-CP-004-EN-v2-frozen" as const;

export const INT_CP004_ENGLISH_FREEZE_V2_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF" as const,
  approvalDate: "2026-08-12" as const,
  approvalCommentId: 5261641903 as const,
  approvedSourceBranch: "feat/int-001-cp004-frequency-broken-periods" as const,
  approvedSourceHead: "3613ed2ab34cb3416935c147a5be22cca4dc1975" as const,
  approvedAuthorityVersion: "INT-CP-004-MATH-AUTHORITY-v1" as const,
  approvedGeneratorVersion: "INT-CP-004-EXAM-GENERATOR-v1" as const,
  approvedSolverVersion: "INT-CP-004-CANONICAL-SOLVER-v1" as const,
  approvedVerifierVersion: "INT-CP-004-RELATION-VERIFIER-v1" as const,
  approvedEditorialVersion: "INT-CP-004-EDITORIAL-REMEDIATION-v4" as const,
  approvedWorkflowRunId: 31506016113 as const,
  approvedArtifactId: 9107055241 as const,
  approvedArtifactDigest: "sha256:8705944586fe9c01036b8d8854a95f4c6f5cd36855bbd664d86e46ac8f72abf4" as const,
  approvedReviewMarkdownSha256: "b6832a741d7edc86fe8a2283971dba4f8ff2cf4ea05fe4424f948ed4bd74c225" as const,
  approvedReviewDataSha256: "323635a4356fc89f8603e2564a4098f8235d5cba7671a50343468daa5bdaeab8" as const,
  approvedRegistrySha256: "a7de3966fd4d2471fbee203f532c9ed4084336a5312ba7d7ec328ccdce260b67" as const,
  qlRange: "INT-QL-067..INT-QL-085" as const,
  qlCount: 19 as const,
  reviewQuestionCount: 76 as const,
  formulaFirstExplanations: true as const,
  language: "en" as const,
  locale: "en-IN" as const,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: true as const,
  solverAuthorityFrozen: true as const,
  enabled: false as const,
  stagingStatus: "NOT_STAGED" as const,
  registrationStatus: "NOT_REGISTERED" as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export type IntCp004EnglishFreezeV2Id = typeof INT_CP004_ENGLISH_FREEZE_V2_ID;

export interface IntCp004EnglishFrozenV2RegistryEntry extends Cp004RegistryEntry {
  readonly freezeId: IntCp004EnglishFreezeV2Id;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly approvalCommentId: typeof INT_CP004_ENGLISH_FREEZE_V2_APPROVAL.approvalCommentId;
  readonly approvedSourceHead: typeof INT_CP004_ENGLISH_FREEZE_V2_APPROVAL.approvedSourceHead;
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

if (INT_CP004_QL_IDS.length !== 19 || INT_CP004_QL_IDS[0] !== "INT-QL-067" || INT_CP004_QL_IDS.at(-1) !== "INT-QL-085") {
  throw new Error("INT-CP-004 approved English V6 QL boundary changed after sign-off.");
}

export const INT_CP004_ENGLISH_FROZEN_V2_REGISTRY: readonly IntCp004EnglishFrozenV2RegistryEntry[] =
  Object.freeze(INT_CP004_REGISTRY.map((entry) => Object.freeze({
    ...entry,
    freezeId: INT_CP004_ENGLISH_FREEZE_V2_ID,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
    reviewStatus: "APPROVED_ENGLISH_FROZEN" as const,
    approvalCommentId: INT_CP004_ENGLISH_FREEZE_V2_APPROVAL.approvalCommentId,
    approvedSourceHead: INT_CP004_ENGLISH_FREEZE_V2_APPROVAL.approvedSourceHead,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  })));

const registryByQl = new Map<IntCp004QlId, IntCp004EnglishFrozenV2RegistryEntry>(
  INT_CP004_ENGLISH_FROZEN_V2_REGISTRY.map((entry) => [entry.qlId, entry]),
);

export function getIntCp004EnglishFrozenV2RegistryEntry(qlId: IntCp004QlId): IntCp004EnglishFrozenV2RegistryEntry {
  const entry = registryByQl.get(qlId);
  if (!entry) throw new Error(`Unknown frozen INT-CP-004 English V2 QL '${qlId}'.`);
  return entry;
}
