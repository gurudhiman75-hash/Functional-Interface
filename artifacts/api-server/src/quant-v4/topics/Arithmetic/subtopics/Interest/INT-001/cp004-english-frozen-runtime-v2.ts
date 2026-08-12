import {
  generateIntCp004Question,
  type IntCp004Question,
} from "./cp004-frequency-runtime";
import type { IntCp004QlId } from "./cp004-frequency-math";
import {
  getIntCp004EnglishFrozenV2RegistryEntry,
  INT_CP004_ENGLISH_FREEZE_V2_APPROVAL,
  INT_CP004_ENGLISH_FREEZE_V2_ID,
  type IntCp004EnglishFrozenV2RegistryEntry,
} from "./cp004-english-freeze-authority-v2";

export interface IntCp004EnglishFrozenV2Lifecycle {
  readonly permanentQlId: IntCp004QlId;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export type IntCp004EnglishFrozenV2Question = Omit<IntCp004Question, "editorialStatus" | "approvalStatus"> & {
  readonly freezeId: typeof INT_CP004_ENGLISH_FREEZE_V2_ID;
  readonly editorialStatus: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly approvalStatus: "APPROVED_ENGLISH_FROZEN";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly approval: typeof INT_CP004_ENGLISH_FREEZE_V2_APPROVAL;
  readonly frozenRegistry: IntCp004EnglishFrozenV2RegistryEntry;
  readonly lifecycle: IntCp004EnglishFrozenV2Lifecycle;
};

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

function assertApprovedSourceBoundary(question: IntCp004Question, qlId: IntCp004QlId): void {
  const approval = INT_CP004_ENGLISH_FREEZE_V2_APPROVAL;
  if (
    question.authorityVersion !== approval.approvedAuthorityVersion
    || question.generatorVersion !== approval.approvedGeneratorVersion
    || question.solverVersion !== approval.approvedSolverVersion
    || question.verifierVersion !== approval.approvedVerifierVersion
  ) throw new Error(`${qlId}/${question.seed}: source versions are not the approved English V6 authority.`);

  if (question.editorialStatus !== "ENGLISH_REVIEW_CANDIDATE" || question.approvalStatus !== "NOT_APPROVED") {
    throw new Error(`${qlId}/${question.seed}: source review boundary changed before V6 freeze.`);
  }
  if (
    question.enabled
    || question.stagingStatus !== "NOT_STAGED"
    || question.registrationStatus !== "NOT_REGISTERED"
    || question.questionStudioDiscoverable
    || question.questionBankStatus !== "NOT_STORED"
    || question.testEligibility !== "INELIGIBLE"
    || question.publiclyPublishable
  ) throw new Error(`${qlId}/${question.seed}: approved source delivery boundary is open.`);
}

export function generateIntCp004EnglishFrozenV2Question(
  qlId: IntCp004QlId,
  seed: string,
): IntCp004EnglishFrozenV2Question {
  const source = generateIntCp004Question(qlId, seed);
  const frozenRegistry = getIntCp004EnglishFrozenV2RegistryEntry(qlId);
  assertApprovedSourceBoundary(source, qlId);

  if (
    source.solveContract !== frozenRegistry.solveContract
    || source.answerSemantic !== frozenRegistry.answerSemantic
    || source.difficulty !== frozenRegistry.difficulty
  ) throw new Error(`${qlId}/${seed}: frozen registry no longer matches the approved source package.`);

  const lifecycle: IntCp004EnglishFrozenV2Lifecycle = {
    permanentQlId: qlId,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_ENGLISH_FROZEN",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };

  return deepFreeze({
    ...source,
    freezeId: INT_CP004_ENGLISH_FREEZE_V2_ID,
    editorialStatus: "ENGLISH_IMPLEMENTATION_FROZEN",
    approvalStatus: "APPROVED_ENGLISH_FROZEN",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    learnerContentFrozen: true,
    approval: INT_CP004_ENGLISH_FREEZE_V2_APPROVAL,
    frozenRegistry,
    lifecycle,
  });
}
