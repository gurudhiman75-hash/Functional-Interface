import {
  INT_CP002_RELEASE_CANDIDATE_ID,
  type IntCp002FinalQlId,
} from "./cp002-final-registry";
import {
  generateIntCp002FinalQuestion,
  type IntCp002FinalGeneratedQuestion,
} from "./cp002-final-runtime";
import {
  getIntCp002EnglishFrozenRegistryEntry,
  INT_CP002_ENGLISH_FREEZE_APPROVAL,
  INT_CP002_ENGLISH_FREEZE_ID,
  type IntCp002EnglishFrozenRegistryEntry,
} from "./cp002-english-freeze-authority";

export interface IntCp002EnglishFrozenLifecycle {
  readonly permanentQlId: IntCp002FinalQlId;
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

export type IntCp002EnglishFrozenQuestion = Omit<
  IntCp002FinalGeneratedQuestion,
  "maturity" | "reviewStatus"
> & {
  readonly freezeId: typeof INT_CP002_ENGLISH_FREEZE_ID;
  readonly sourceReleaseCandidateId: typeof INT_CP002_RELEASE_CANDIDATE_ID;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly approval: typeof INT_CP002_ENGLISH_FREEZE_APPROVAL;
  readonly frozenRegistry: IntCp002EnglishFrozenRegistryEntry;
  readonly lifecycle: IntCp002EnglishFrozenLifecycle;
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
  question: IntCp002FinalGeneratedQuestion,
  qlId: IntCp002FinalQlId,
): void {
  if (!question.validation.ok) {
    throw new Error(`${qlId}/${question.seed}: approved source validation failed: ${question.validation.errors.join("; ")}`);
  }
  if (
    question.releaseCandidateId !== INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedReleaseCandidateId
    || question.maturity !== "FINAL_ENGLISH_REVIEW_CANDIDATE"
    || question.reviewStatus !== "FINAL_ENGLISH_REVIEW_CANDIDATE"
  ) {
    throw new Error(`${qlId}/${question.seed}: source is not the approved final English review authority.`);
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

export function generateIntCp002EnglishFrozenQuestion(
  qlId: IntCp002FinalQlId,
  seed: string,
): IntCp002EnglishFrozenQuestion {
  const source = generateIntCp002FinalQuestion(qlId, seed);
  const frozenRegistry = getIntCp002EnglishFrozenRegistryEntry(qlId);
  assertApprovedSourceBoundary(source, qlId);

  if (
    source.solveContract !== frozenRegistry.solveContract
    || source.topology !== frozenRegistry.topology
    || source.taskDirection !== frozenRegistry.taskDirection
    || source.answerSemantic !== frozenRegistry.answerSemantic
  ) {
    throw new Error(`${qlId}/${seed}: frozen registry no longer matches the approved source package.`);
  }

  const lifecycle: IntCp002EnglishFrozenLifecycle = {
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

  const frozenQuestion: IntCp002EnglishFrozenQuestion = {
    ...source,
    freezeId: INT_CP002_ENGLISH_FREEZE_ID,
    sourceReleaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_ENGLISH_FROZEN",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    learnerContentFrozen: true,
    approval: INT_CP002_ENGLISH_FREEZE_APPROVAL,
    frozenRegistry,
    lifecycle,
  };

  return deepFreeze(frozenQuestion);
}
