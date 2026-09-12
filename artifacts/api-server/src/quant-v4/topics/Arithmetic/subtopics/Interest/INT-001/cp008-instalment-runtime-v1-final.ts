import type { Rational } from "./cp003-exam-model";
import {
  INT_CP008_DISCOVERY_VERSION,
  answerSemanticForIntCp008Prototype,
  constructIntCp008PrototypeState,
  solveIntCp008Prototype,
  verifyIntCp008PrototypeAnswer,
  type IntCp008AnswerSemantic,
  type IntCp008PrototypeId,
  type IntCp008PrototypeState,
} from "./cp008-instalment-discovery-v1";
import {
  INT_CP008_AUTHORITY_PROPOSAL_VERSION,
  INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT,
  type IntCp008AuthoritySlot,
} from "./cp008-authority-proposal-v1";

export const INT_CP008_RUNTIME_VERSION = "INT-CP-008-v1-permanent-allocation" as const;

export const INT_CP008_QL_IDS = Object.freeze([
  "INT-QL-116",
  "INT-QL-117",
  "INT-QL-118",
  "INT-QL-119",
  "INT-QL-120",
  "INT-QL-121",
  "INT-QL-122",
  "INT-QL-123",
  "INT-QL-124",
] as const);

export type IntCp008QlId = (typeof INT_CP008_QL_IDS)[number];

export interface IntCp008PermanentState {
  readonly checkpointId: "INT-CP-008";
  readonly qlId: IntCp008QlId;
  readonly authoritySlot: IntCp008AuthoritySlot;
  readonly sourcePrototypeId: IntCp008PrototypeId;
  readonly contractState: IntCp008PrototypeState;
  readonly answerSemantic: IntCp008AnswerSemantic;
}

export const INT_CP008_QL_TO_PROTOTYPE = Object.freeze({
  "INT-QL-116": "INT-CP008-PROT-001",
  "INT-QL-117": "INT-CP008-PROT-002",
  "INT-QL-118": "INT-CP008-PROT-003",
  "INT-QL-119": "INT-CP008-PROT-004",
  "INT-QL-120": "INT-CP008-PROT-005",
  "INT-QL-121": "INT-CP008-PROT-007",
  "INT-QL-122": "INT-CP008-PROT-008",
  "INT-QL-123": "INT-CP008-PROT-010",
  "INT-QL-124": "INT-CP008-PROT-011",
} as const satisfies Readonly<Record<IntCp008QlId, IntCp008PrototypeId>>);

export const INT_CP008_QL_TO_AUTHORITY_SLOT = Object.freeze({
  "INT-QL-116": "CP008-A01",
  "INT-QL-117": "CP008-A02",
  "INT-QL-118": "CP008-A03",
  "INT-QL-119": "CP008-A04",
  "INT-QL-120": "CP008-A05",
  "INT-QL-121": "CP008-A06",
  "INT-QL-122": "CP008-A07",
  "INT-QL-123": "CP008-A08",
  "INT-QL-124": "CP008-A09",
} as const satisfies Readonly<Record<IntCp008QlId, IntCp008AuthoritySlot>>);

export const INT_CP008_QL_CONTRACTS = Object.freeze({
  "INT-QL-116": Object.freeze({
    title: "Equal end-of-period instalment",
    givenUnknown: "opening balance + periodic rate + payment count -> equal end-period instalment",
    answerSemantic: "INSTALLMENT_AMOUNT" as const,
  }),
  "INT-QL-117": Object.freeze({
    title: "Opening balance from equal periodic cash flow",
    givenUnknown: "equal end-period cash flow + periodic rate + count -> opening balance",
    answerSemantic: "OPENING_BALANCE" as const,
  }),
  "INT-QL-118": Object.freeze({
    title: "Outstanding balance after regular payments",
    givenUnknown: "opening balance + recurring instalment + periodic rate + payments made -> outstanding balance",
    answerSemantic: "OUTSTANDING_BALANCE" as const,
  }),
  "INT-QL-119": Object.freeze({
    title: "Final balancing payment",
    givenUnknown: "opening balance + periodic rate + earlier regular payments -> final clearing payment",
    answerSemantic: "FINAL_BALANCING_PAYMENT" as const,
  }),
  "INT-QL-120": Object.freeze({
    title: "Beginning-of-period equal instalment",
    givenUnknown: "opening balance + periodic rate + payment count + payment-before-interest order -> equal instalment",
    answerSemantic: "INSTALLMENT_AMOUNT" as const,
  }),
  "INT-QL-121": Object.freeze({
    title: "Periodic rate from equal-instalment schedule",
    givenUnknown: "opening balance + equal instalment + payment count -> bounded exact periodic rate",
    answerSemantic: "PERIODIC_RATE_PERCENT" as const,
  }),
  "INT-QL-122": Object.freeze({
    title: "Future fund from equal recurring deposits",
    givenUnknown: "equal end-period deposit + periodic rate + deposit count -> accumulated fund",
    answerSemantic: "FUTURE_FUND" as const,
  }),
  "INT-QL-123": Object.freeze({
    title: "Missed-instalment catch-up",
    givenUnknown: "regular schedule + missed payment position -> extra amount with final payment",
    answerSemantic: "EXTRA_PAYMENT" as const,
  }),
  "INT-QL-124": Object.freeze({
    title: "Difference between instalments under two rates",
    givenUnknown: "same opening balance + duration + two periodic rates -> absolute instalment difference",
    answerSemantic: "INSTALLMENT_DIFFERENCE" as const,
  }),
} as const satisfies Readonly<Record<IntCp008QlId, Readonly<{
  title: string;
  givenUnknown: string;
  answerSemantic: IntCp008AnswerSemantic;
}>>>);

export const INT_CP008_MERGED_DISCOVERY_CONTRACTS = Object.freeze({
  "INT-CP008-PROT-006": Object.freeze({
    permanentQlId: "INT-QL-116" as const,
    authoritySlot: "CP008-A01" as const,
    disposition: "CONTEXT_PREPROCESSING_VARIANT" as const,
    rationale: "Immediate down payment only changes the financed opening balance before the same end-period instalment recurrence.",
  }),
  "INT-CP008-PROT-009": Object.freeze({
    permanentQlId: "INT-QL-117" as const,
    authoritySlot: "CP008-A02" as const,
    disposition: "CONTEXT_DIRECTION_VARIANT" as const,
    rationale: "Equal withdrawals use the same opening-balance inverse as equal repayments; fund wording is contextual.",
  }),
} as const);

export const INT_CP008_PERMANENT_ALLOCATION = Object.freeze({
  approvalAuthority: "PRODUCT_OWNER_APPROVED_CP008_9_AUTHORITY_STRUCTURE_2026_08_20" as const,
  approvalSignal: "USER_CONTINUE_AFTER_CERTIFIED_CP008_9_AUTHORITY_PROPOSAL" as const,
  proposalVersion: INT_CP008_AUTHORITY_PROPOSAL_VERSION,
  proposalExactHead: "9d6e6f5cf414ccd5c4f4127bb4bcd8752cf3efe1" as const,
  proposalRun: 32327721843 as const,
  proposalJob: 96302244170 as const,
  proposalArtifact: 9391955740 as const,
  proposalArtifactDigest: "sha256:30434d1a1d7d5b6a163870d2b741ced9639d8e0e74891b723ea0db021ce9ab55" as const,
  discoveryRuntimeVersion: INT_CP008_DISCOVERY_VERSION,
  runtimeVersion: INT_CP008_RUNTIME_VERSION,
  qlIds: INT_CP008_QL_IDS,
  qlCount: 9 as const,
  firstQlId: "INT-QL-116" as const,
  lastQlId: "INT-QL-124" as const,
  nextFreeQlId: "INT-QL-125" as const,
  sourceMaterialGaps: 0 as const,
  mergedDiscoveryContracts: 2 as const,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: false as const,
  enabled: false as const,
  stagingStatus: "NOT_STAGED" as const,
  registrationStatus: "NOT_REGISTERED" as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
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

export function constructIntCp008State(qlId: IntCp008QlId, seed: string): IntCp008PermanentState {
  const sourcePrototypeId = INT_CP008_QL_TO_PROTOTYPE[qlId];
  const authoritySlot = INT_CP008_QL_TO_AUTHORITY_SLOT[qlId];
  if (INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT[sourcePrototypeId] !== authoritySlot) {
    throw new Error(`${qlId}/${seed}: authority-slot mapping drift`);
  }
  const contractState = constructIntCp008PrototypeState(sourcePrototypeId, seed);
  const answerSemantic = answerSemanticForIntCp008Prototype(sourcePrototypeId);
  if (INT_CP008_QL_CONTRACTS[qlId].answerSemantic !== answerSemantic) {
    throw new Error(`${qlId}/${seed}: permanent answer-semantic mapping drift`);
  }
  return deepFreeze({
    checkpointId: "INT-CP-008",
    qlId,
    authoritySlot,
    sourcePrototypeId,
    contractState,
    answerSemantic,
  });
}

export function solveIntCp008(state: IntCp008PermanentState): Rational {
  if (state.sourcePrototypeId !== INT_CP008_QL_TO_PROTOTYPE[state.qlId]) {
    throw new Error(`${state.qlId}: permanent prototype mapping drift`);
  }
  if (state.authoritySlot !== INT_CP008_QL_TO_AUTHORITY_SLOT[state.qlId]) {
    throw new Error(`${state.qlId}: permanent authority-slot drift`);
  }
  return solveIntCp008Prototype(state.contractState);
}

export function verifyIntCp008Answer(state: IntCp008PermanentState, candidate: Rational): boolean {
  if (state.sourcePrototypeId !== INT_CP008_QL_TO_PROTOTYPE[state.qlId]) return false;
  if (state.authoritySlot !== INT_CP008_QL_TO_AUTHORITY_SLOT[state.qlId]) return false;
  if (state.contractState.prototypeId !== state.sourcePrototypeId) return false;
  if (state.answerSemantic !== INT_CP008_QL_CONTRACTS[state.qlId].answerSemantic) return false;
  return verifyIntCp008PrototypeAnswer(state.contractState, candidate);
}
