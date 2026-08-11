import {
  generateIntCp004Question,
  type IntCp004Question,
} from "./cp004-frequency-runtime";
import type { IntCp004QlId } from "./cp004-frequency-math";
import {
  getIntCp004EnglishFrozenRegistryEntry,
  INT_CP004_ENGLISH_FREEZE_APPROVAL,
  INT_CP004_ENGLISH_FREEZE_ID,
  type IntCp004EnglishFrozenRegistryEntry,
} from "./cp004-english-freeze-authority";

export interface IntCp004EnglishFrozenLifecycle {
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

export type IntCp004EnglishFrozenQuestion = Omit<
  IntCp004Question,
  "editorialStatus" | "approvalStatus"
> & {
  readonly freezeId: typeof INT_CP004_ENGLISH_FREEZE_ID;
  readonly sourceGeneratorVersion: typeof INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion;
  readonly editorialStatus: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly approvalStatus: "APPROVED_ENGLISH_FROZEN";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly approval: typeof INT_CP004_ENGLISH_FREEZE_APPROVAL;
  readonly frozenRegistry: IntCp004EnglishFrozenRegistryEntry;
  readonly lifecycle: IntCp004EnglishFrozenLifecycle;
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

function assertApprovedSourceBoundary(
  question: IntCp004Question,
  qlId: IntCp004QlId,
): void {
  if (
    question.authorityVersion !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedAuthorityVersion
    || question.generatorVersion !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion
    || question.solverVersion !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedSolverVersion
    || question.verifierVersion !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedVerifierVersion
  ) {
    throw new Error(`${qlId}/${question.seed}: source versions are not the approved English authority.`);
  }
  if (
    question.editorialStatus !== "ENGLISH_REVIEW_CANDIDATE"
    || question.approvalStatus !== "NOT_APPROVED"
  ) {
    throw new Error(`${qlId}/${question.seed}: source review boundary changed before freeze.`);
  }
  if (
    question.enabled
    || question.stagingStatus !== "NOT_STAGED"
    || question.registrationStatus !== "NOT_REGISTERED"
    || question.questionStudioDiscoverable
    || question.questionBankStatus !== "NOT_STORED"
    || question.testEligibility !== "INELIGIBLE"
    || question.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${question.seed}: approved source delivery boundary is open.`);
  }
}

export function generateIntCp004EnglishFrozenQuestion(
  qlId: IntCp004QlId,
  seed: string,
): IntCp004EnglishFrozenQuestion {
  const source = generateIntCp004Question(qlId, seed);
  const frozenRegistry = getIntCp004EnglishFrozenRegistryEntry(qlId);
  assertApprovedSourceBoundary(source, qlId);

  if (
    source.solveContract !== frozenRegistry.solveContract
    || source.answerSemantic !== frozenRegistry.answerSemantic
    || source.difficulty !== frozenRegistry.difficulty
  ) {
    throw new Error(`${qlId}/${seed}: frozen registry no longer matches the approved source package.`);
  }

  const lifecycle: IntCp004EnglishFrozenLifecycle = {
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

  const frozenQuestion: IntCp004EnglishFrozenQuestion = {
    ...source,
    freezeId: INT_CP004_ENGLISH_FREEZE_ID,
    sourceGeneratorVersion: INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion,
    editorialStatus: "ENGLISH_IMPLEMENTATION_FROZEN",
    approvalStatus: "APPROVED_ENGLISH_FROZEN",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    learnerContentFrozen: true,
    approval: INT_CP004_ENGLISH_FREEZE_APPROVAL,
    frozenRegistry,
    lifecycle,
  };

  return deepFreeze(frozenQuestion);
}
