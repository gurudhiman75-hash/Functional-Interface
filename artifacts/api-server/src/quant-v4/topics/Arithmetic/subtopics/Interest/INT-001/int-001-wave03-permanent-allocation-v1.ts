import { hash, type Rational } from "./cp003-exam-model";
import {
  constructIntCp010SequentialReopenState,
  solveIntCp010SequentialReopen,
  verifyIntCp010SequentialReopen,
  type IntCp010SequentialReopenPrototypeId,
  type IntCp010SequentialReopenState,
} from "./cp010-sequential-mixed-source-reopen-v2";

export const INT_001_WAVE03_PERMANENT_ALLOCATION_VERSION = "INT-001-WAVE03-PERMANENT-ALLOCATION-v1" as const;

export const INT_001_WAVE03_QL_IDS = Object.freeze([
  "INT-QL-132",
  "INT-QL-133",
  "INT-QL-134",
] as const);

export type Int001Wave03QlId = (typeof INT_001_WAVE03_QL_IDS)[number];

export type Int001Wave03CheckpointId = "INT-CP-007" | "INT-CP-010";
export type Int001Wave03AnswerSemantic = "FINAL_AMOUNT" | "OPENING_PRINCIPAL" | "COMMON_PRINCIPAL";

export const INT_001_WAVE03_AUTHORITY_CONTRACTS = Object.freeze({
  "INT-QL-132": Object.freeze({
    checkpointId: "INT-CP-010" as const,
    title: "Sequential simple-interest and compound-interest stages — final amount",
    givenUnknown: "opening principal + one SI stage + one CI stage -> final amount",
    answerSemantic: "FINAL_AMOUNT" as const,
    sourcePrototypeIds: Object.freeze([
      "INT-CP010-REOPEN-PROT-001",
      "INT-CP010-REOPEN-PROT-002",
    ] as const),
    ownershipNote: "SI→CI and CI→SI remain one mathematical authority; stage order is generated state, not a separate QL.",
  }),
  "INT-QL-133": Object.freeze({
    checkpointId: "INT-CP-010" as const,
    title: "Sequential simple-interest and compound-interest stages — opening principal",
    givenUnknown: "final amount + one SI stage + one CI stage -> opening principal",
    answerSemantic: "OPENING_PRINCIPAL" as const,
    sourcePrototypeIds: Object.freeze(["INT-CP010-REOPEN-PROT-003"] as const),
    ownershipNote: "Both stage orders are parameterized states inside one inverse authority.",
  }),
  "INT-QL-134": Object.freeze({
    checkpointId: "INT-CP-007" as const,
    title: "Common principal from difference between SI borrowing and CI lending returns",
    givenUnknown: "known return difference + complete SI/CI schemes -> common principal",
    answerSemantic: "COMMON_PRINCIPAL" as const,
    sourcePrototypeIds: Object.freeze(["INT-CP010-REOPEN-PROT-004"] as const),
    ownershipNote: "This is the inverse of INT-QL-110 return-difference ownership, not INT-QL-115 equal-future-value principal ownership.",
  }),
} as const satisfies Readonly<Record<Int001Wave03QlId, Readonly<{
  checkpointId: Int001Wave03CheckpointId;
  title: string;
  givenUnknown: string;
  answerSemantic: Int001Wave03AnswerSemantic;
  sourcePrototypeIds: readonly IntCp010SequentialReopenPrototypeId[];
  ownershipNote: string;
}>>>);

export const INT_001_WAVE03_PERMANENT_ALLOCATION = Object.freeze({
  authority: "INT_001_COMPREHENSIVE_GAP_WAVE02_ALLOCATION_READY_GREEN" as const,
  productOwnerApprovalBasis: "CONTINUE_INTEREST_CHAPTER_2026_08_31" as const,
  baselinePermanentQlCount: 130 as const,
  allocatedQlCount: 3 as const,
  resultingPermanentQlCount: 133 as const,
  qlIds: INT_001_WAVE03_QL_IDS,
  firstQlId: "INT-QL-132" as const,
  lastQlId: "INT-QL-134" as const,
  intentionalVacancy: "INT-QL-094" as const,
  nextFreeQl: "INT-QL-135" as const,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: false as const,
  multilingualAuthorityFrozen: false as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export interface Int001Wave03PermanentState {
  readonly checkpointId: Int001Wave03CheckpointId;
  readonly qlId: Int001Wave03QlId;
  readonly sourcePrototypeId: IntCp010SequentialReopenPrototypeId;
  readonly contractState: IntCp010SequentialReopenState;
  readonly answerSemantic: Int001Wave03AnswerSemantic;
}

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

function prototypeFor(qlId: Int001Wave03QlId, seed: string): IntCp010SequentialReopenPrototypeId {
  switch (qlId) {
    case "INT-QL-132":
      return hash(`${seed}:INT-QL-132:stage-order`) % 2 === 0
        ? "INT-CP010-REOPEN-PROT-001"
        : "INT-CP010-REOPEN-PROT-002";
    case "INT-QL-133":
      return "INT-CP010-REOPEN-PROT-003";
    case "INT-QL-134":
      return "INT-CP010-REOPEN-PROT-004";
  }
}

export function constructInt001Wave03PermanentState(qlId: Int001Wave03QlId, seed: string): Int001Wave03PermanentState {
  const contract = INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId];
  const sourcePrototypeId = prototypeFor(qlId, seed);
  if (!(contract.sourcePrototypeIds as readonly string[]).includes(sourcePrototypeId)) {
    throw new Error(`${qlId}/${seed}: source prototype escaped the frozen authority mapping`);
  }
  const contractState = constructIntCp010SequentialReopenState(sourcePrototypeId, seed);
  if (contractState.prototypeId !== sourcePrototypeId) {
    throw new Error(`${qlId}/${seed}: nested prototype identity drift`);
  }
  return deepFreeze({
    checkpointId: contract.checkpointId,
    qlId,
    sourcePrototypeId,
    contractState,
    answerSemantic: contract.answerSemantic,
  });
}

export function solveInt001Wave03Permanent(state: Int001Wave03PermanentState): Rational {
  const contract = INT_001_WAVE03_AUTHORITY_CONTRACTS[state.qlId];
  if (contract.checkpointId !== state.checkpointId) throw new Error(`${state.qlId}: checkpoint ownership drift`);
  if (!(contract.sourcePrototypeIds as readonly string[]).includes(state.sourcePrototypeId)) {
    throw new Error(`${state.qlId}: source prototype ownership drift`);
  }
  return solveIntCp010SequentialReopen(state.contractState);
}

export function verifyInt001Wave03PermanentAnswer(state: Int001Wave03PermanentState, candidate: Rational): boolean {
  const contract = INT_001_WAVE03_AUTHORITY_CONTRACTS[state.qlId];
  if (contract.checkpointId !== state.checkpointId) return false;
  if (!(contract.sourcePrototypeIds as readonly string[]).includes(state.sourcePrototypeId)) return false;
  if (state.contractState.prototypeId !== state.sourcePrototypeId) return false;
  return verifyIntCp010SequentialReopen(state.contractState, candidate);
}
