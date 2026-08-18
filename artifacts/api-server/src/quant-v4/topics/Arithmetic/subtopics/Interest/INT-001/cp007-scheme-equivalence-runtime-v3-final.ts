import { type Rational } from "./cp003-exam-model";
import {
  INT_CP007_RUNTIME_VERSION_V2,
  constructIntCp007PrototypeStateV2,
  solveIntCp007PrototypeV2,
  verifyIntCp007PrototypeAnswerV2,
  type IntCp007AnswerSemanticV2,
  type IntCp007PrototypeIdV2,
  type IntCp007PrototypeStateV2,
} from "./cp007-scheme-equivalence-runtime-v2";

export const INT_CP007_RUNTIME_VERSION = "INT-CP-007-v3-permanent-allocation" as const;

export const INT_CP007_QL_IDS = Object.freeze([
  "INT-QL-109",
  "INT-QL-110",
  "INT-QL-111",
  "INT-QL-112",
  "INT-QL-113",
  "INT-QL-114",
  "INT-QL-115",
] as const);

export type IntCp007QlId = typeof INT_CP007_QL_IDS[number];

export type IntCp007AnswerSemantic =
  | "SCHEME_INDEX"
  | "MONEY_DIFFERENCE"
  | "ANNUAL_RATE_PERCENT"
  | "COMPONENT_PRINCIPAL"
  | "PRINCIPAL_RATIO"
  | "TIME_YEARS"
  | "MISSING_PRINCIPAL";

export interface IntCp007PermanentState {
  readonly checkpointId: "INT-CP-007";
  readonly qlId: IntCp007QlId;
  readonly sourcePrototypeId: IntCp007PrototypeIdV2;
  readonly contractState: IntCp007PrototypeStateV2;
  readonly answerSemantic: IntCp007AnswerSemantic;
}

export const INT_CP007_QL_TO_PROTOTYPE = Object.freeze({
  "INT-QL-109": "INT-CP007-PROT-001",
  "INT-QL-110": "INT-CP007-PROT-002",
  "INT-QL-111": "INT-CP007-PROT-003",
  "INT-QL-112": "INT-CP007-PROT-007",
  "INT-QL-113": "INT-CP007-PROT-008",
  "INT-QL-114": "INT-CP007-PROT-009",
  "INT-QL-115": "INT-CP007-PROT-010",
} as const satisfies Readonly<Record<IntCp007QlId, IntCp007PrototypeIdV2>>);

export const INT_CP007_QL_CONTRACTS = Object.freeze({
  "INT-QL-109": Object.freeze({
    title: "Choose the higher-maturity scheme",
    givenUnknown: "common principal + two complete schemes -> winning scheme",
    answerSemantic: "SCHEME_INDEX" as const,
  }),
  "INT-QL-110": Object.freeze({
    title: "Difference between two scheme returns",
    givenUnknown: "common principal + two complete schemes -> maturity amount difference",
    answerSemantic: "MONEY_DIFFERENCE" as const,
  }),
  "INT-QL-111": Object.freeze({
    title: "Missing rate from equal maturity",
    givenUnknown: "one complete scheme + second method/duration -> second annual rate",
    answerSemantic: "ANNUAL_RATE_PERCENT" as const,
  }),
  "INT-QL-112": Object.freeze({
    title: "Split a present total for equal future values",
    givenUnknown: "present total + two complete schemes -> one present component",
    answerSemantic: "COMPONENT_PRINCIPAL" as const,
  }),
  "INT-QL-113": Object.freeze({
    title: "Present-principal ratio for equal future values",
    givenUnknown: "two complete schemes -> required present-principal ratio",
    answerSemantic: "PRINCIPAL_RATIO" as const,
  }),
  "INT-QL-114": Object.freeze({
    title: "First whole-year scheme overtake",
    givenUnknown: "two complete schemes -> first whole year one exceeds the other",
    answerSemantic: "TIME_YEARS" as const,
  }),
  "INT-QL-115": Object.freeze({
    title: "Missing present principal for equal future value",
    givenUnknown: "known present principal + two complete schemes -> other present principal",
    answerSemantic: "MISSING_PRINCIPAL" as const,
  }),
} as const satisfies Readonly<Record<IntCp007QlId, Readonly<{ title: string; givenUnknown: string; answerSemantic: IntCp007AnswerSemantic }>>>);

export const INT_CP007_MERGED_DISCOVERY_CONTRACTS = Object.freeze({
  "INT-CP007-PROT-004": "INT-QL-110",
  "INT-CP007-PROT-005": "INT-QL-111",
  "INT-CP007-PROT-006": "INT-QL-111",
} as const);

export const INT_CP007_PERMANENT_ALLOCATION = Object.freeze({
  authority: "INT_CP007_SATURATION_V1_GREEN_2026_08_18" as const,
  discoveryRuntimeVersion: INT_CP007_RUNTIME_VERSION_V2,
  runtimeVersion: INT_CP007_RUNTIME_VERSION,
  qlIds: INT_CP007_QL_IDS,
  qlCount: 7 as const,
  firstQlId: "INT-QL-109" as const,
  lastQlId: "INT-QL-115" as const,
  meaningfulUnclassifiedSourceDirections: 0 as const,
  mergedDiscoveryContracts: 3 as const,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: false as const,
  enabled: false as const,
  stagingStatus: "NOT_STAGED" as const,
  registrationStatus: "NOT_REGISTERED" as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
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

function permanentSemantic(semantic: IntCp007AnswerSemanticV2): IntCp007AnswerSemantic {
  if (semantic === "NET_GAIN") throw new Error("CP007 merged NET_GAIN prototype cannot receive a permanent QL");
  return semantic;
}

function semanticForPrototype(prototypeId: IntCp007PrototypeIdV2): IntCp007AnswerSemantic {
  switch (prototypeId) {
    case "INT-CP007-PROT-001": return "SCHEME_INDEX";
    case "INT-CP007-PROT-002": return "MONEY_DIFFERENCE";
    case "INT-CP007-PROT-003": return "ANNUAL_RATE_PERCENT";
    case "INT-CP007-PROT-007": return "COMPONENT_PRINCIPAL";
    case "INT-CP007-PROT-008": return "PRINCIPAL_RATIO";
    case "INT-CP007-PROT-009": return "TIME_YEARS";
    case "INT-CP007-PROT-010": return "MISSING_PRINCIPAL";
    case "INT-CP007-PROT-004": return permanentSemantic("NET_GAIN");
    case "INT-CP007-PROT-005":
    case "INT-CP007-PROT-006": return "ANNUAL_RATE_PERCENT";
  }
}

export function constructIntCp007State(qlId: IntCp007QlId, seed: string): IntCp007PermanentState {
  const sourcePrototypeId = INT_CP007_QL_TO_PROTOTYPE[qlId];
  const contractState = constructIntCp007PrototypeStateV2(sourcePrototypeId, seed);
  const answerSemantic = semanticForPrototype(sourcePrototypeId);
  if (INT_CP007_QL_CONTRACTS[qlId].answerSemantic !== answerSemantic) {
    throw new Error(`${qlId}/${seed}: permanent answer-semantic mapping drift`);
  }
  return deepFreeze({ checkpointId: "INT-CP-007", qlId, sourcePrototypeId, contractState, answerSemantic });
}

export function solveIntCp007(state: IntCp007PermanentState): Rational {
  if (state.sourcePrototypeId !== INT_CP007_QL_TO_PROTOTYPE[state.qlId]) {
    throw new Error(`${state.qlId}: permanent prototype mapping drift`);
  }
  return solveIntCp007PrototypeV2(state.contractState);
}

export function verifyIntCp007Answer(state: IntCp007PermanentState, candidate: Rational): boolean {
  if (state.sourcePrototypeId !== INT_CP007_QL_TO_PROTOTYPE[state.qlId]) return false;
  if (state.contractState.prototypeId !== state.sourcePrototypeId) return false;
  return verifyIntCp007PrototypeAnswerV2(state.contractState, candidate);
}
