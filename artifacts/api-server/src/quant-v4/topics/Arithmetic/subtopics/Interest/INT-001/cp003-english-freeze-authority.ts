import {
  INT_CP003_FINAL_REGISTRY,
  INT_CP003_QL_IDS,
  type Cp003RegistryEntry,
  type IntCp003QlId,
} from "./cp003-exam-model";

export const INT_CP003_ENGLISH_FREEZE_ID = "INT-CP-003-EN-v1-frozen" as const;

export const INT_CP003_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF" as const,
  approvalDate: "2026-08-07" as const,
  approvalCommentId: 5211491612 as const,
  approvedSourceBranch: "fix/int-cp003-authority-consolidation" as const,
  approvedSourceHead: "f9b48eb776b644c81f1e7ad0ff5a3707511658f1" as const,
  approvedGeneratorVersion: "INT-CP-003-EXAM-GENERATOR-v13" as const,
  approvedArtifactId: 8970950939 as const,
  approvedArtifactDigest: "sha256:05bcc218170863b65383f6278426228d88d84b540b12275f73d83d79289caf4a" as const,
  approvedReviewMarkdownSha256: "281cc8df2b9cb3b2c57bc33e66107d806efc4c0805cc6bef203cfe305214825d" as const,
  approvedReviewDataSha256: "b9630a95c2e67a650d2e631bcc3ae2f961734da4aa0b06cc08c30b55c184490b" as const,
  approvedRegistrySha256: "b5119c5db5e6252c3e340c20d9e01022147bc9ad9d17c83b55a23db2093fda01" as const,
  qlRange: "INT-QL-053..INT-QL-066" as const,
  qlCount: 14 as const,
  reviewQuestionCount: 56 as const,
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

export type IntCp003EnglishFreezeId = typeof INT_CP003_ENGLISH_FREEZE_ID;

export interface IntCp003EnglishFrozenRegistryEntry extends Cp003RegistryEntry {
  readonly freezeId: IntCp003EnglishFreezeId;
  readonly sourceGeneratorVersion: typeof INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly approvalCommentId: typeof INT_CP003_ENGLISH_FREEZE_APPROVAL.approvalCommentId;
  readonly approvedSourceHead: typeof INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedSourceHead;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
}

if (INT_CP003_QL_IDS.length !== INT_CP003_ENGLISH_FREEZE_APPROVAL.qlCount) {
  throw new Error("INT-CP-003 approved English QL count changed after sign-off.");
}
if (INT_CP003_QL_IDS[0] !== "INT-QL-053" || INT_CP003_QL_IDS.at(-1) !== "INT-QL-066") {
  throw new Error("INT-CP-003 approved English QL range changed after sign-off.");
}

export const INT_CP003_ENGLISH_FROZEN_REGISTRY: readonly IntCp003EnglishFrozenRegistryEntry[] =
  Object.freeze(INT_CP003_FINAL_REGISTRY.map((entry) => Object.freeze({
    ...entry,
    freezeId: INT_CP003_ENGLISH_FREEZE_ID,
    sourceGeneratorVersion: INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
    reviewStatus: "APPROVED_ENGLISH_FROZEN" as const,
    approvalCommentId: INT_CP003_ENGLISH_FREEZE_APPROVAL.approvalCommentId,
    approvedSourceHead: INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
  })));

const frozenRegistryByQl = new Map<IntCp003QlId, IntCp003EnglishFrozenRegistryEntry>(
  INT_CP003_ENGLISH_FROZEN_REGISTRY.map((entry) => [entry.qlId, entry]),
);

export function getIntCp003EnglishFrozenRegistryEntry(
  qlId: IntCp003QlId,
): IntCp003EnglishFrozenRegistryEntry {
  const entry = frozenRegistryByQl.get(qlId);
  if (!entry) throw new Error(`Unknown frozen INT-CP-003 English QL '${qlId}'.`);
  return entry;
}
