import {
  INT_CP003_EXAM_GENERATOR_VERSION,
  generateIntCp003ExamQuestion,
  type IntCp003ExamQuestion,
  type IntCp003QlId,
} from "./cp003-exam-runtime";
import {
  getIntCp003EnglishFrozenRegistryEntry,
  INT_CP003_ENGLISH_FREEZE_APPROVAL,
  INT_CP003_ENGLISH_FREEZE_ID,
  type IntCp003EnglishFrozenRegistryEntry,
} from "./cp003-english-freeze-authority";

export interface IntCp003EnglishFrozenLifecycle {
  readonly permanentQlId: IntCp003QlId;
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

export type IntCp003EnglishFrozenQuestion = Omit<
  IntCp003ExamQuestion,
  "editorialStatus" | "approvalStatus"
> & {
  readonly freezeId: typeof INT_CP003_ENGLISH_FREEZE_ID;
  readonly sourceGeneratorVersion: typeof INT_CP003_EXAM_GENERATOR_VERSION;
  readonly editorialStatus: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly approvalStatus: "APPROVED_ENGLISH_FROZEN";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly approval: typeof INT_CP003_ENGLISH_FREEZE_APPROVAL;
  readonly frozenRegistry: IntCp003EnglishFrozenRegistryEntry;
  readonly lifecycle: IntCp003EnglishFrozenLifecycle;
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
  question: IntCp003ExamQuestion,
  qlId: IntCp003QlId,
): void {
  if (question.generatorVersion !== INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion) {
    throw new Error(`${qlId}/${question.seed}: source generator is not the approved English authority.`);
  }
  if (
    question.editorialStatus !== "SECOND_REMEDIATION_REVIEW_CANDIDATE"
    || question.approvalStatus !== "WITHDRAWN_PENDING_REAUDIT"
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

export function generateIntCp003EnglishFrozenQuestion(
  qlId: IntCp003QlId,
  seed: string,
): IntCp003EnglishFrozenQuestion {
  const source = generateIntCp003ExamQuestion(qlId, seed);
  const frozenRegistry = getIntCp003EnglishFrozenRegistryEntry(qlId);
  assertApprovedSourceBoundary(source, qlId);

  if (
    source.solveContract !== frozenRegistry.solveContract
    || source.answerSemantic !== frozenRegistry.answerSemantic
  ) {
    throw new Error(`${qlId}/${seed}: frozen registry no longer matches the approved source package.`);
  }

  const lifecycle: IntCp003EnglishFrozenLifecycle = {
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

  const frozenQuestion: IntCp003EnglishFrozenQuestion = {
    ...source,
    freezeId: INT_CP003_ENGLISH_FREEZE_ID,
    sourceGeneratorVersion: INT_CP003_EXAM_GENERATOR_VERSION,
    editorialStatus: "ENGLISH_IMPLEMENTATION_FROZEN",
    approvalStatus: "APPROVED_ENGLISH_FROZEN",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    learnerContentFrozen: true,
    approval: INT_CP003_ENGLISH_FREEZE_APPROVAL,
    frozenRegistry,
    lifecycle,
  };

  return deepFreeze(frozenQuestion);
}
