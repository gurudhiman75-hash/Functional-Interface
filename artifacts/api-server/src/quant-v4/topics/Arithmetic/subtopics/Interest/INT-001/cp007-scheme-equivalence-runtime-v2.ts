import { div, eq, hash, mul, rat, type Rational } from "./cp003-exam-model";
import {
  INT_CP007_DISCOVERY_DECISIONS,
  INT_CP007_PROTOTYPE_IDS,
  INT_CP007_RUNTIME_VERSION,
  answerSemanticForIntCp007Prototype,
  constructIntCp007PrototypeState,
  maturityAmount,
  schemeFactor,
  solveIntCp007Prototype,
  verifyIntCp007PrototypeAnswer,
  type IntCp007AnswerSemantic,
  type IntCp007PrototypeId,
  type IntCp007PrototypeState,
  type IntCp007Scheme,
} from "./cp007-scheme-equivalence-runtime-v1";

export const INT_CP007_RUNTIME_VERSION_V2 = "INT-CP-007-DISCOVERY-v2" as const;
export const INT_CP007_PROTOTYPE_IDS_V2 = Object.freeze([
  ...INT_CP007_PROTOTYPE_IDS,
  "INT-CP007-PROT-010",
] as const);

export type IntCp007PrototypeIdV2 = IntCp007PrototypeId | "INT-CP007-PROT-010";
export type IntCp007AnswerSemanticV2 = IntCp007AnswerSemantic | "MISSING_PRINCIPAL";

export type IntCp007MissingPrincipalState = Readonly<{
  prototypeId: "INT-CP007-PROT-010";
  knownPrincipal: Rational;
  knownScheme: IntCp007Scheme;
  missingScheme: IntCp007Scheme;
}>;

export type IntCp007PrototypeStateV2 = IntCp007PrototypeState | IntCp007MissingPrincipalState;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function scheme(method: "SIMPLE" | "COMPOUND", rateNumerator: bigint, years: number, rateDenominator = 1n): IntCp007Scheme {
  return deepFreeze({ method, annualRatePercent: rat(rateNumerator, rateDenominator), years });
}

const MISSING_PRINCIPAL_SCENARIOS = Object.freeze([
  deepFreeze({ knownPrincipal: rat(50000n), knownScheme: scheme("SIMPLE", 10n, 2), missingScheme: scheme("COMPOUND", 25n, 1) }),
  deepFreeze({ knownPrincipal: rat(52000n), knownScheme: scheme("COMPOUND", 10n, 2), missingScheme: scheme("SIMPLE", 10n, 3) }),
  deepFreeze({ knownPrincipal: rat(57600n), knownScheme: scheme("SIMPLE", 25n, 2, 2n), missingScheme: scheme("COMPOUND", 20n, 2) }),
]);

export function constructIntCp007PrototypeStateV2(prototypeId: IntCp007PrototypeIdV2, seed: string): IntCp007PrototypeStateV2 {
  if (prototypeId !== "INT-CP007-PROT-010") return constructIntCp007PrototypeState(prototypeId, seed);
  const selected = MISSING_PRINCIPAL_SCENARIOS[hash(`${seed}:${prototypeId}`) % MISSING_PRINCIPAL_SCENARIOS.length]!;
  return deepFreeze({ prototypeId, ...selected });
}

export function solveIntCp007PrototypeV2(state: IntCp007PrototypeStateV2): Rational {
  if (state.prototypeId !== "INT-CP007-PROT-010") return solveIntCp007Prototype(state);
  return div(mul(state.knownPrincipal, schemeFactor(state.knownScheme)), schemeFactor(state.missingScheme));
}

export function verifyIntCp007PrototypeAnswerV2(state: IntCp007PrototypeStateV2, candidate: Rational): boolean {
  if (state.prototypeId !== "INT-CP007-PROT-010") return verifyIntCp007PrototypeAnswer(state, candidate);
  if (candidate.numerator <= 0n) return false;
  return eq(maturityAmount(state.knownPrincipal, state.knownScheme), maturityAmount(candidate, state.missingScheme));
}

export function answerSemanticForIntCp007PrototypeV2(prototypeId: IntCp007PrototypeIdV2): IntCp007AnswerSemanticV2 {
  return prototypeId === "INT-CP007-PROT-010" ? "MISSING_PRINCIPAL" : answerSemanticForIntCp007Prototype(prototypeId);
}

export const INT_CP007_COLLISION_DISPOSITIONS = deepFreeze({
  "INT-CP007-PROT-001": "RETAIN_SCHEME_CHOICE",
  "INT-CP007-PROT-002": "RETAIN_ORDERED_RETURN_DIFFERENCE",
  "INT-CP007-PROT-003": "RETAIN_GENERAL_EQUAL_MATURITY_RATE_INVERSE",
  "INT-CP007-PROT-004": "MERGE_INTO_PROT_002_BORROW_LEND_CONTEXT",
  "INT-CP007-PROT-005": "MERGE_INTO_PROT_003_EQUIVALENT_SIMPLE_SPECIALIZATION",
  "INT-CP007-PROT-006": "MERGE_INTO_PROT_003_EQUIVALENT_COMPOUND_SPECIALIZATION",
  "INT-CP007-PROT-007": "RETAIN_TOTAL_SPLIT_EQUAL_FUTURE_VALUE",
  "INT-CP007-PROT-008": "RETAIN_PRESENT_PRINCIPAL_RATIO_EQUAL_FUTURE_VALUE",
  "INT-CP007-PROT-009": "RETAIN_FIRST_WHOLE_YEAR_OVERTAKE",
  "INT-CP007-PROT-010": "RETAIN_MISSING_PRINCIPAL_EQUAL_FUTURE_VALUE",
} as const);

export const INT_CP007_RETAINED_PROTOTYPE_IDS = Object.freeze([
  "INT-CP007-PROT-001",
  "INT-CP007-PROT-002",
  "INT-CP007-PROT-003",
  "INT-CP007-PROT-007",
  "INT-CP007-PROT-008",
  "INT-CP007-PROT-009",
  "INT-CP007-PROT-010",
] as const);

export const INT_CP007_V2_DECISION = deepFreeze({
  baseRuntimeVersion: INT_CP007_RUNTIME_VERSION,
  runtimeVersion: INT_CP007_RUNTIME_VERSION_V2,
  prototypeCountBeforeCollision: INT_CP007_PROTOTYPE_IDS_V2.length,
  retainedContractCount: INT_CP007_RETAINED_PROTOTYPE_IDS.length,
  mergedPrototypeCount: 3,
  discoveredGapClosed: "MISSING_PRESENT_PRINCIPAL_FOR_EQUAL_FUTURE_VALUE",
  inheritanceAtDifferentAges: INT_CP007_DISCOVERY_DECISIONS.inheritanceAtDifferentAges,
  standaloneEffectiveAnnualRateOwner: INT_CP007_DISCOVERY_DECISIONS.standaloneEffectiveAnnualRateOwner,
  intermediateCashFlowsAllowed: false,
  permanentQlAllocationAuthorized: false,
  learnerDeliveryAuthorized: false,
});
