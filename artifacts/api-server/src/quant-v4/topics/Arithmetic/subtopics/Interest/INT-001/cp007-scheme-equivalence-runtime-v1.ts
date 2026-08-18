import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";

export const INT_CP007_RUNTIME_VERSION = "INT-CP-007-DISCOVERY-v1" as const;

export const INT_CP007_PROTOTYPE_IDS = Object.freeze([
  "INT-CP007-PROT-001",
  "INT-CP007-PROT-002",
  "INT-CP007-PROT-003",
  "INT-CP007-PROT-004",
  "INT-CP007-PROT-005",
  "INT-CP007-PROT-006",
  "INT-CP007-PROT-007",
  "INT-CP007-PROT-008",
  "INT-CP007-PROT-009",
] as const);

export type IntCp007PrototypeId = typeof INT_CP007_PROTOTYPE_IDS[number];
export type IntCp007Method = "SIMPLE" | "COMPOUND";
export type IntCp007AnswerSemantic =
  | "SCHEME_INDEX"
  | "MONEY_DIFFERENCE"
  | "ANNUAL_RATE_PERCENT"
  | "NET_GAIN"
  | "COMPONENT_PRINCIPAL"
  | "PRINCIPAL_RATIO"
  | "TIME_YEARS";

export interface IntCp007Scheme {
  readonly method: IntCp007Method;
  readonly annualRatePercent: Rational;
  readonly years: number;
}

type CompareState = Readonly<{
  prototypeId: "INT-CP007-PROT-001" | "INT-CP007-PROT-002";
  principal: Rational;
  schemeA: IntCp007Scheme;
  schemeB: IntCp007Scheme;
}>;

type MissingRateState = Readonly<{
  prototypeId: "INT-CP007-PROT-003";
  knownScheme: IntCp007Scheme;
  missingMethod: IntCp007Method;
  missingYears: number;
}>;

type BorrowLendState = Readonly<{
  prototypeId: "INT-CP007-PROT-004";
  principal: Rational;
  borrowingScheme: IntCp007Scheme;
  lendingScheme: IntCp007Scheme;
}>;

type EquivalentSimpleState = Readonly<{
  prototypeId: "INT-CP007-PROT-005";
  compoundRatePercent: Rational;
  years: number;
}>;

type EquivalentCompoundState = Readonly<{
  prototypeId: "INT-CP007-PROT-006";
  simpleRatePercent: Rational;
  years: number;
}>;

type SplitState = Readonly<{
  prototypeId: "INT-CP007-PROT-007";
  totalPrincipal: Rational;
  schemeA: IntCp007Scheme;
  schemeB: IntCp007Scheme;
}>;

type RatioState = Readonly<{
  prototypeId: "INT-CP007-PROT-008";
  schemeA: IntCp007Scheme;
  schemeB: IntCp007Scheme;
}>;

type OvertakeState = Readonly<{
  prototypeId: "INT-CP007-PROT-009";
  initiallyHigherScheme: IntCp007Scheme;
  overtakingScheme: IntCp007Scheme;
  maximumYears: number;
}>;

export type IntCp007PrototypeState =
  | CompareState
  | MissingRateState
  | BorrowLendState
  | EquivalentSimpleState
  | EquivalentCompoundState
  | SplitState
  | RatioState
  | OvertakeState;

const RATE_LIBRARY = Object.freeze([
  rat(5n), rat(8n), rat(10n), rat(21n, 2n), rat(12n), rat(25n, 2n), rat(15n),
  rat(20n), rat(21n), rat(22n), rat(25n), rat(225n, 8n),
] as const);

const PRINCIPALS = Object.freeze([10000n, 20000n, 40000n, 50000n, 80000n, 100000n] as const);

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

function compare(left: Rational, right: Rational): number {
  const delta = left.numerator * right.denominator - right.numerator * left.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

function abs(value: Rational): Rational {
  return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value;
}

function rateDecimal(ratePercent: Rational): Rational {
  return div(ratePercent, rat(100n));
}

export function schemeFactor(scheme: IntCp007Scheme): Rational {
  const periodic = rateDecimal(scheme.annualRatePercent);
  if (scheme.method === "SIMPLE") return add(rat(1n), mul(rat(BigInt(scheme.years)), periodic));
  const onePlusRate = add(rat(1n), periodic);
  let result = rat(1n);
  for (let year = 0; year < scheme.years; year += 1) result = mul(result, onePlusRate);
  return result;
}

export function maturityAmount(principal: Rational, scheme: IntCp007Scheme): Rational {
  return mul(principal, schemeFactor(scheme));
}

function scheme(method: IntCp007Method, rateNumerator: bigint, years: number, rateDenominator = 1n): IntCp007Scheme {
  return deepFreeze({ method, annualRatePercent: rat(rateNumerator, rateDenominator), years });
}

const COMPARE_SCENARIOS = Object.freeze([
  deepFreeze({ principal: rat(40000n), schemeA: scheme("SIMPLE", 10n, 2), schemeB: scheme("COMPOUND", 10n, 2) }),
  deepFreeze({ principal: rat(50000n), schemeA: scheme("SIMPLE", 12n, 3), schemeB: scheme("COMPOUND", 10n, 3) }),
  deepFreeze({ principal: rat(80000n), schemeA: scheme("COMPOUND", 25n, 2), schemeB: scheme("SIMPLE", 30n, 2) }),
]);

const MISSING_RATE_SCENARIOS = Object.freeze([
  deepFreeze({ knownScheme: scheme("SIMPLE", 10n, 2), missingMethod: "COMPOUND" as const, missingYears: 1 }),
  deepFreeze({ knownScheme: scheme("COMPOUND", 10n, 2), missingMethod: "SIMPLE" as const, missingYears: 1 }),
  deepFreeze({ knownScheme: scheme("COMPOUND", 20n, 2), missingMethod: "SIMPLE" as const, missingYears: 2 }),
  deepFreeze({ knownScheme: scheme("SIMPLE", 25n, 1), missingMethod: "COMPOUND" as const, missingYears: 1 }),
]);

const BORROW_LEND_SCENARIOS = Object.freeze([
  deepFreeze({ principal: rat(40000n), borrowingScheme: scheme("SIMPLE", 8n, 2), lendingScheme: scheme("COMPOUND", 10n, 2) }),
  deepFreeze({ principal: rat(50000n), borrowingScheme: scheme("SIMPLE", 10n, 2), lendingScheme: scheme("COMPOUND", 25n, 2, 2n) }),
  deepFreeze({ principal: rat(100000n), borrowingScheme: scheme("SIMPLE", 12n, 3), lendingScheme: scheme("COMPOUND", 15n, 3) }),
]);

const EQUIVALENT_SIMPLE_SCENARIOS = Object.freeze([
  deepFreeze({ compoundRatePercent: rat(10n), years: 2 }),
  deepFreeze({ compoundRatePercent: rat(20n), years: 2 }),
  deepFreeze({ compoundRatePercent: rat(25n), years: 2 }),
]);

const EQUIVALENT_COMPOUND_SCENARIOS = Object.freeze([
  deepFreeze({ simpleRatePercent: rat(21n, 2n), years: 2 }),
  deepFreeze({ simpleRatePercent: rat(22n), years: 2 }),
  deepFreeze({ simpleRatePercent: rat(225n, 8n), years: 2 }),
]);

const SPLIT_SCENARIOS = Object.freeze([
  deepFreeze({ totalPrincipal: rat(98000n), schemeA: scheme("SIMPLE", 10n, 2), schemeB: scheme("COMPOUND", 25n, 1) }),
  deepFreeze({ totalPrincipal: rat(100400n), schemeA: scheme("COMPOUND", 10n, 2), schemeB: scheme("SIMPLE", 10n, 3) }),
  deepFreeze({ totalPrincipal: rat(107600n), schemeA: scheme("SIMPLE", 25n, 2, 2n), schemeB: scheme("COMPOUND", 20n, 2) }),
]);

const OVERTAKE_SCENARIOS = Object.freeze([
  deepFreeze({ initiallyHigherScheme: scheme("SIMPLE", 12n, 1), overtakingScheme: scheme("COMPOUND", 10n, 1), maximumYears: 6 }),
  deepFreeze({ initiallyHigherScheme: scheme("SIMPLE", 15n, 1), overtakingScheme: scheme("COMPOUND", 25n, 1, 2n), maximumYears: 6 }),
  deepFreeze({ initiallyHigherScheme: scheme("SIMPLE", 20n, 1), overtakingScheme: scheme("COMPOUND", 15n, 1), maximumYears: 6 }),
]);

function annualized(base: IntCp007Scheme, years: number): IntCp007Scheme {
  return deepFreeze({ ...base, years });
}

function pickBySeed<T>(values: readonly T[], seed: string, salt: string): T {
  return values[hash(`${seed}:${salt}`) % values.length]!;
}

export function constructIntCp007PrototypeState(prototypeId: IntCp007PrototypeId, seed: string): IntCp007PrototypeState {
  switch (prototypeId) {
    case "INT-CP007-PROT-001":
    case "INT-CP007-PROT-002": {
      const selected = pickBySeed(COMPARE_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
    case "INT-CP007-PROT-003": {
      const selected = pickBySeed(MISSING_RATE_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
    case "INT-CP007-PROT-004": {
      const selected = pickBySeed(BORROW_LEND_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
    case "INT-CP007-PROT-005": {
      const selected = pickBySeed(EQUIVALENT_SIMPLE_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
    case "INT-CP007-PROT-006": {
      const selected = pickBySeed(EQUIVALENT_COMPOUND_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
    case "INT-CP007-PROT-007": {
      const selected = pickBySeed(SPLIT_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
    case "INT-CP007-PROT-008": {
      const selected = pickBySeed(SPLIT_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, schemeA: selected.schemeA, schemeB: selected.schemeB });
    }
    case "INT-CP007-PROT-009": {
      const selected = pickBySeed(OVERTAKE_SCENARIOS, seed, prototypeId);
      return deepFreeze({ prototypeId, ...selected });
    }
  }
}

function exactRateForFactor(method: IntCp007Method, years: number, targetFactor: Rational): Rational {
  if (method === "SIMPLE") return mul(div(sub(targetFactor, rat(1n)), rat(BigInt(years))), rat(100n));
  const matches = RATE_LIBRARY.filter((rate) => eq(schemeFactor({ method: "COMPOUND", annualRatePercent: rate, years }), targetFactor));
  if (matches.length !== 1) throw new Error(`CP007 compound inverse expected one bounded rate, found ${matches.length}`);
  return matches[0]!;
}

export function solveIntCp007Prototype(state: IntCp007PrototypeState): Rational {
  switch (state.prototypeId) {
    case "INT-CP007-PROT-001": {
      const amountA = maturityAmount(state.principal, state.schemeA);
      const amountB = maturityAmount(state.principal, state.schemeB);
      if (compare(amountA, amountB) === 0) throw new Error("CP007 better-scheme prototype cannot be tied");
      return rat(compare(amountA, amountB) > 0 ? 1n : 2n);
    }
    case "INT-CP007-PROT-002":
      return abs(sub(maturityAmount(state.principal, state.schemeA), maturityAmount(state.principal, state.schemeB)));
    case "INT-CP007-PROT-003":
      return exactRateForFactor(state.missingMethod, state.missingYears, schemeFactor(state.knownScheme));
    case "INT-CP007-PROT-004":
      return sub(maturityAmount(state.principal, state.lendingScheme), maturityAmount(state.principal, state.borrowingScheme));
    case "INT-CP007-PROT-005": {
      const targetFactor = schemeFactor({ method: "COMPOUND", annualRatePercent: state.compoundRatePercent, years: state.years });
      return mul(div(sub(targetFactor, rat(1n)), rat(BigInt(state.years))), rat(100n));
    }
    case "INT-CP007-PROT-006": {
      const targetFactor = schemeFactor({ method: "SIMPLE", annualRatePercent: state.simpleRatePercent, years: state.years });
      return exactRateForFactor("COMPOUND", state.years, targetFactor);
    }
    case "INT-CP007-PROT-007": {
      const factorA = schemeFactor(state.schemeA);
      const factorB = schemeFactor(state.schemeB);
      return div(mul(state.totalPrincipal, factorB), add(factorA, factorB));
    }
    case "INT-CP007-PROT-008":
      return div(schemeFactor(state.schemeB), schemeFactor(state.schemeA));
    case "INT-CP007-PROT-009": {
      for (let year = 1; year <= state.maximumYears; year += 1) {
        const initialFactor = schemeFactor(annualized(state.initiallyHigherScheme, year));
        const overtakingFactor = schemeFactor(annualized(state.overtakingScheme, year));
        if (compare(overtakingFactor, initialFactor) > 0) return rat(BigInt(year));
      }
      throw new Error("CP007 overtake state has no crossing inside the production bound");
    }
  }
}

export function answerSemanticForIntCp007Prototype(prototypeId: IntCp007PrototypeId): IntCp007AnswerSemantic {
  switch (prototypeId) {
    case "INT-CP007-PROT-001": return "SCHEME_INDEX";
    case "INT-CP007-PROT-002": return "MONEY_DIFFERENCE";
    case "INT-CP007-PROT-003":
    case "INT-CP007-PROT-005":
    case "INT-CP007-PROT-006": return "ANNUAL_RATE_PERCENT";
    case "INT-CP007-PROT-004": return "NET_GAIN";
    case "INT-CP007-PROT-007": return "COMPONENT_PRINCIPAL";
    case "INT-CP007-PROT-008": return "PRINCIPAL_RATIO";
    case "INT-CP007-PROT-009": return "TIME_YEARS";
  }
}

export function verifyIntCp007PrototypeAnswer(state: IntCp007PrototypeState, candidate: Rational): boolean {
  switch (state.prototypeId) {
    case "INT-CP007-PROT-001": {
      if (!(eq(candidate, rat(1n)) || eq(candidate, rat(2n)))) return false;
      const amountA = maturityAmount(state.principal, state.schemeA);
      const amountB = maturityAmount(state.principal, state.schemeB);
      return eq(candidate, rat(1n)) ? compare(amountA, amountB) > 0 : compare(amountB, amountA) > 0;
    }
    case "INT-CP007-PROT-002": {
      const amountA = maturityAmount(state.principal, state.schemeA);
      const amountB = maturityAmount(state.principal, state.schemeB);
      return eq(candidate, abs(sub(amountA, amountB)));
    }
    case "INT-CP007-PROT-003": {
      const candidateFactor = schemeFactor({ method: state.missingMethod, annualRatePercent: candidate, years: state.missingYears });
      return eq(candidateFactor, schemeFactor(state.knownScheme));
    }
    case "INT-CP007-PROT-004": {
      const borrowed = maturityAmount(state.principal, state.borrowingScheme);
      const lent = maturityAmount(state.principal, state.lendingScheme);
      return eq(candidate, sub(lent, borrowed)) && compare(lent, borrowed) > 0;
    }
    case "INT-CP007-PROT-005": {
      const simple = schemeFactor({ method: "SIMPLE", annualRatePercent: candidate, years: state.years });
      const compound = schemeFactor({ method: "COMPOUND", annualRatePercent: state.compoundRatePercent, years: state.years });
      return eq(simple, compound);
    }
    case "INT-CP007-PROT-006": {
      if (!RATE_LIBRARY.some((rate) => eq(rate, candidate))) return false;
      const compound = schemeFactor({ method: "COMPOUND", annualRatePercent: candidate, years: state.years });
      const simple = schemeFactor({ method: "SIMPLE", annualRatePercent: state.simpleRatePercent, years: state.years });
      return eq(compound, simple);
    }
    case "INT-CP007-PROT-007": {
      const other = sub(state.totalPrincipal, candidate);
      if (candidate.numerator <= 0n || other.numerator <= 0n) return false;
      return eq(maturityAmount(candidate, state.schemeA), maturityAmount(other, state.schemeB));
    }
    case "INT-CP007-PROT-008": {
      const factorA = schemeFactor(state.schemeA);
      const factorB = schemeFactor(state.schemeB);
      return eq(mul(candidate, factorA), factorB);
    }
    case "INT-CP007-PROT-009": {
      if (candidate.denominator !== 1n) return false;
      const year = Number(candidate.numerator);
      if (year < 1 || year > state.maximumYears) return false;
      const overtakesAtCandidate = compare(
        schemeFactor(annualized(state.overtakingScheme, year)),
        schemeFactor(annualized(state.initiallyHigherScheme, year)),
      ) > 0;
      if (!overtakesAtCandidate) return false;
      for (let earlier = 1; earlier < year; earlier += 1) {
        if (compare(
          schemeFactor(annualized(state.overtakingScheme, earlier)),
          schemeFactor(annualized(state.initiallyHigherScheme, earlier)),
        ) > 0) return false;
      }
      return true;
    }
  }
}

export const INT_CP007_DISCOVERY_DECISIONS = deepFreeze({
  standaloneEffectiveAnnualRateOwner: "INT-CP-004",
  simpleOnlySplitLedgerOwner: "INT-CP-002",
  recurringEqualCashFlowsOwner: "INT-CP-008",
  heterogeneousDatedCashFlowsOwner: "INT-CP-009",
  inheritanceAtDifferentAges: "CONTEXT_VARIANT_OF_PROT_007",
  intermediateCashFlowsAllowed: false,
  permanentQlAllocationAuthorized: false,
  learnerDeliveryAuthorized: false,
});
