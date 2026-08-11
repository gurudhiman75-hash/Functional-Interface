export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

const abs = (value: bigint): bigint => value < 0n ? -value : value;

function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left);
  let b = abs(right);
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}

export function rat(numerator: bigint | number, denominator: bigint | number = 1): Rational {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("zero denominator");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}

export const add = (left: Rational, right: Rational): Rational =>
  rat(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
export const sub = (left: Rational, right: Rational): Rational =>
  rat(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
export const mul = (left: Rational, right: Rational): Rational =>
  rat(left.numerator * right.numerator, left.denominator * right.denominator);
export const div = (left: Rational, right: Rational): Rational => {
  if (right.numerator === 0n) throw new Error("divide by zero");
  return rat(left.numerator * right.denominator, left.denominator * right.numerator);
};
export const pow = (value: Rational, exponent: number): Rational => {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("bad power");
  return rat(value.numerator ** BigInt(exponent), value.denominator ** BigInt(exponent));
};
export const eq = (left: Rational, right: Rational): boolean =>
  left.numerator === right.numerator && left.denominator === right.denominator;
export const integer = (value: Rational): number | null =>
  value.denominator === 1n ? Number(value.numerator) : null;

export function hash(text: string): number {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function pick<T>(values: readonly T[], seed: string, key: string): T {
  if (values.length === 0) throw new Error(`cannot pick from an empty collection: ${key}`);
  return values[hash(`${seed}:${key}`) % values.length]!;
}

export const INT_CP003_AUTHORITY_VERSION = "INT-CP-003-MATH-AUTHORITY-v1" as const;
export const INT_CP003_SOLVER_VERSION = "INT-CP-003-CANONICAL-SOLVER-v1" as const;
export const INT_CP003_VERIFIER_VERSION = "INT-CP-003-RELATION-VERIFIER-v1" as const;

export const INT_CP003_QL_IDS = [
  "INT-QL-053", "INT-QL-054", "INT-QL-055", "INT-QL-056", "INT-QL-057", "INT-QL-058", "INT-QL-059",
  "INT-QL-060", "INT-QL-061", "INT-QL-062", "INT-QL-063", "INT-QL-064", "INT-QL-065", "INT-QL-066",
] as const;
export type IntCp003QlId = typeof INT_CP003_QL_IDS[number];

export type Cp003AnswerSemantic = "MONEY" | "PRINCIPAL" | "RATE_PERCENT" | "TIME_YEARS";
export type Cp003Semantic = Cp003AnswerSemantic;
export type Cp003SolveContract =
  | "FIND_ANNUAL_COMPOUND_AMOUNT"
  | "FIND_ANNUAL_COMPOUND_INTEREST"
  | "FIND_PRINCIPAL_FROM_COMPOUND_AMOUNT"
  | "FIND_PRINCIPAL_FROM_COMPOUND_INTEREST"
  | "FIND_ANNUAL_RATE_FROM_AMOUNT_OR_FACTOR"
  | "FIND_COMPLETE_YEARS_FROM_AMOUNT_OR_FACTOR"
  | "FIND_SPECIFIED_YEAR_INTEREST"
  | "FIND_PRINCIPAL_FROM_SPECIFIED_YEAR_INTEREST"
  | "FIND_RATE_FROM_SPECIFIED_YEAR_INTEREST"
  | "FIND_PREVIOUS_YEAR_AMOUNT"
  | "FIND_RATE_FROM_CONSECUTIVE_AMOUNTS"
  | "FIND_PRINCIPAL_FROM_CONSECUTIVE_AMOUNTS"
  | "FIND_AMOUNT_DIFFERENCE_BETWEEN_DURATIONS"
  | "FIND_LATER_YEAR_INTEREST_FROM_EARLIER_YEAR";
export type Cp003TaskDirection = "FORWARD" | "INVERSE" | "RECONSTRUCTION" | "COMPARISON";

export const INT_CP003_LEGACY_FAMILIES = [
  "int_ci_amount_annual", "int_ci_from_amount", "int_ci_principal_from_amount", "int_ci_rate_from_amount", "int_ci_time_from_amount",
  "int_ci_two_year_formula", "int_ci_three_year_formula", "int_ci_sum_doubles", "int_ci_amount_multiplier_gap", "int_ci_specific_year_isolation",
  "int_ci_nth_year_interest_from_principal", "int_amount_ratio_find_rate_ci", "int_amount_ratio_find_time_ci", "int_ci_specific_year_rate_principal",
] as const;
export type IntCp003LegacyFamily = typeof INT_CP003_LEGACY_FAMILIES[number];

export interface Cp003RegistryEntry {
  readonly qlId: IntCp003QlId;
  readonly solveContract: Cp003SolveContract;
  readonly answerSemantic: Cp003AnswerSemantic;
  readonly taskDirection: Cp003TaskDirection;
  readonly title: string;
  readonly legacyFamilies: readonly IntCp003LegacyFamily[];
  readonly sourceDisposition: string;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly publiclyPublishable: false;
}

function registryEntry(
  qlId: IntCp003QlId,
  solveContract: Cp003SolveContract,
  answerSemantic: Cp003AnswerSemantic,
  taskDirection: Cp003TaskDirection,
  title: string,
  legacyFamilies: readonly IntCp003LegacyFamily[],
  sourceDisposition: string,
): Cp003RegistryEntry {
  return Object.freeze({
    qlId,
    solveContract,
    answerSemantic,
    taskDirection,
    title,
    legacyFamilies: Object.freeze([...legacyFamilies]),
    sourceDisposition,
    active: false,
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  });
}

export const INT_CP003_FINAL_REGISTRY: readonly Cp003RegistryEntry[] = Object.freeze([
  registryEntry("INT-QL-053", "FIND_ANNUAL_COMPOUND_AMOUNT", "MONEY", "FORWARD", "Annual compound amount", ["int_ci_amount_annual", "int_ci_two_year_formula", "int_ci_three_year_formula"], "Duration-specific shortcuts are parameters."),
  registryEntry("INT-QL-054", "FIND_ANNUAL_COMPOUND_INTEREST", "MONEY", "FORWARD", "Annual compound interest", ["int_ci_from_amount"], "Interest and amount remain separate answer contracts."),
  registryEntry("INT-QL-055", "FIND_PRINCIPAL_FROM_COMPOUND_AMOUNT", "PRINCIPAL", "INVERSE", "Principal from amount", ["int_ci_principal_from_amount"], "Exact amount inverse."),
  registryEntry("INT-QL-056", "FIND_PRINCIPAL_FROM_COMPOUND_INTEREST", "PRINCIPAL", "INVERSE", "Principal from compound interest", [], "Inverse closure distinct from amount."),
  registryEntry("INT-QL-057", "FIND_ANNUAL_RATE_FROM_AMOUNT_OR_FACTOR", "RATE_PERCENT", "INVERSE", "Rate from amount or factor", ["int_ci_rate_from_amount", "int_ci_sum_doubles", "int_amount_ratio_find_rate_ci"], "Amount multiples are factor representations."),
  registryEntry("INT-QL-058", "FIND_COMPLETE_YEARS_FROM_AMOUNT_OR_FACTOR", "TIME_YEARS", "INVERSE", "Years from amount or factor", ["int_ci_time_from_amount", "int_amount_ratio_find_time_ci"], "Bounded exact period matching."),
  registryEntry("INT-QL-059", "FIND_SPECIFIED_YEAR_INTEREST", "MONEY", "FORWARD", "Specified-year interest", ["int_ci_specific_year_isolation", "int_ci_nth_year_interest_from_principal"], "Specific/nth-year wording merges."),
  registryEntry("INT-QL-060", "FIND_PRINCIPAL_FROM_SPECIFIED_YEAR_INTEREST", "PRINCIPAL", "INVERSE", "Principal from yearly interest", ["int_ci_specific_year_rate_principal"], "Principal inverse."),
  registryEntry("INT-QL-061", "FIND_RATE_FROM_SPECIFIED_YEAR_INTEREST", "RATE_PERCENT", "INVERSE", "Rate from yearly interest", ["int_ci_specific_year_rate_principal"], "Bounded rate inverse."),
  registryEntry("INT-QL-062", "FIND_PREVIOUS_YEAR_AMOUNT", "MONEY", "RECONSTRUCTION", "Previous annual balance", ["int_ci_amount_multiplier_gap"], "Reverse one annual transition."),
  registryEntry("INT-QL-063", "FIND_RATE_FROM_CONSECUTIVE_AMOUNTS", "RATE_PERCENT", "RECONSTRUCTION", "Rate from consecutive balances", ["int_ci_amount_multiplier_gap"], "One-year factor reconstruction."),
  registryEntry("INT-QL-064", "FIND_PRINCIPAL_FROM_CONSECUTIVE_AMOUNTS", "PRINCIPAL", "RECONSTRUCTION", "Principal from consecutive balances", ["int_ci_amount_multiplier_gap"], "Factor then principal reconstruction."),
  registryEntry("INT-QL-065", "FIND_AMOUNT_DIFFERENCE_BETWEEN_DURATIONS", "MONEY", "COMPARISON", "Amount difference", [], "Pure CI duration comparison; SI-CI stays CP-006."),
  registryEntry("INT-QL-066", "FIND_LATER_YEAR_INTEREST_FROM_EARLIER_YEAR", "MONEY", "RECONSTRUCTION", "Later yearly interest", ["int_ci_specific_year_isolation", "int_ci_nth_year_interest_from_principal"], "Yearly interests form a GP."),
]);

const REGISTRY_BY_QL = new Map(INT_CP003_FINAL_REGISTRY.map((entry) => [entry.qlId, entry]));

export function getIntCp003RegistryEntry(qlId: IntCp003QlId): Cp003RegistryEntry {
  const entry = REGISTRY_BY_QL.get(qlId);
  if (!entry) throw new Error(`unknown ${qlId}`);
  return entry;
}

export interface Cp003ExactRateDefinition {
  readonly id: string;
  readonly numerator: number;
  readonly denominator: number;
}

export const INT_CP003_EXACT_RATE_DEFINITIONS: readonly Cp003ExactRateDefinition[] = Object.freeze([
  Object.freeze({ id: "R04", numerator: 4, denominator: 1 }),
  Object.freeze({ id: "R05", numerator: 5, denominator: 1 }),
  Object.freeze({ id: "R0625", numerator: 25, denominator: 4 }),
  Object.freeze({ id: "R08", numerator: 8, denominator: 1 }),
  Object.freeze({ id: "R0833", numerator: 25, denominator: 3 }),
  Object.freeze({ id: "R10", numerator: 10, denominator: 1 }),
  Object.freeze({ id: "R125", numerator: 25, denominator: 2 }),
  Object.freeze({ id: "R142857", numerator: 100, denominator: 7 }),
  Object.freeze({ id: "R15", numerator: 15, denominator: 1 }),
  Object.freeze({ id: "R1667", numerator: 50, denominator: 3 }),
  Object.freeze({ id: "R20", numerator: 20, denominator: 1 }),
  Object.freeze({ id: "R25", numerator: 25, denominator: 1 }),
  Object.freeze({ id: "R30", numerator: 30, denominator: 1 }),
  Object.freeze({ id: "R3333", numerator: 100, denominator: 3 }),
  Object.freeze({ id: "R40", numerator: 40, denominator: 1 }),
  Object.freeze({ id: "R50", numerator: 50, denominator: 1 }),
]);

export const INT_CP003_EXACT_RATE_VALUES: readonly Rational[] = Object.freeze(
  INT_CP003_EXACT_RATE_DEFINITIONS.map((definition) => rat(definition.numerator, definition.denominator)),
);

export const factor = (ratePercent: Rational): Rational => add(rat(1), div(ratePercent, rat(100)));
export const amount = (principal: Rational, ratePercent: Rational, years: number): Rational =>
  mul(principal, pow(factor(ratePercent), years));
export const compoundInterest = (principal: Rational, ratePercent: Rational, years: number): Rational =>
  sub(amount(principal, ratePercent, years), principal);
export const yearlyInterest = (principal: Rational, ratePercent: Rational, year: number): Rational =>
  sub(amount(principal, ratePercent, year), amount(principal, ratePercent, year - 1));

export function amountByRecurrence(principal: Rational, ratePercent: Rational, years: number): Rational {
  if (!Number.isInteger(years) || years < 0) throw new Error("bad years");
  let balance = principal;
  const annualFactor = factor(ratePercent);
  for (let year = 0; year < years; year += 1) balance = mul(balance, annualFactor);
  return balance;
}

export function yearlyInterestByRecurrence(principal: Rational, ratePercent: Rational, year: number): Rational {
  if (!Number.isInteger(year) || year < 1) throw new Error("bad year");
  const opening = amountByRecurrence(principal, ratePercent, year - 1);
  const closing = mul(opening, factor(ratePercent));
  return sub(closing, opening);
}

export type Cp003MathematicalState =
  | Readonly<{ qlId: "INT-QL-053"; principal: Rational; ratePercent: Rational; years: number }>
  | Readonly<{ qlId: "INT-QL-054"; principal: Rational; ratePercent: Rational; years: number }>
  | Readonly<{ qlId: "INT-QL-055"; amount: Rational; ratePercent: Rational; years: number }>
  | Readonly<{ qlId: "INT-QL-056"; compoundInterest: Rational; ratePercent: Rational; years: number }>
  | Readonly<{ qlId: "INT-QL-057"; principal: Rational; amount: Rational; years: number }>
  | Readonly<{ qlId: "INT-QL-058"; principal: Rational; amount: Rational; ratePercent: Rational }>
  | Readonly<{ qlId: "INT-QL-059"; principal: Rational; ratePercent: Rational; targetYear: number }>
  | Readonly<{ qlId: "INT-QL-060"; nthYearInterest: Rational; ratePercent: Rational; targetYear: number }>
  | Readonly<{ qlId: "INT-QL-061"; principal: Rational; nthYearInterest: Rational; targetYear: number }>
  | Readonly<{ qlId: "INT-QL-062"; currentAmount: Rational; ratePercent: Rational; currentYear: number }>
  | Readonly<{ qlId: "INT-QL-063"; openingAmount: Rational; closingAmount: Rational; yearNumber: number }>
  | Readonly<{ qlId: "INT-QL-064"; amountAtYear: Rational; nextYearAmount: Rational; yearNumber: number }>
  | Readonly<{ qlId: "INT-QL-065"; principal: Rational; ratePercent: Rational; earlierYear: number; laterYear: number }>
  | Readonly<{ qlId: "INT-QL-066"; earlierYearInterest: Rational; ratePercent: Rational; earlierYear: number; laterYear: number }>;

function findExactRate(predicate: (candidate: Rational) => boolean): Rational {
  const matches = INT_CP003_EXACT_RATE_VALUES.filter(predicate);
  if (matches.length !== 1) throw new Error(`rate inverse expected one match, found ${matches.length}`);
  return matches[0]!;
}

export function canonicalAnswer(state: Cp003MathematicalState): Rational {
  switch (state.qlId) {
    case "INT-QL-053":
      return amount(state.principal, state.ratePercent, state.years);
    case "INT-QL-054":
      return compoundInterest(state.principal, state.ratePercent, state.years);
    case "INT-QL-055":
      return div(state.amount, pow(factor(state.ratePercent), state.years));
    case "INT-QL-056":
      return div(state.compoundInterest, sub(pow(factor(state.ratePercent), state.years), rat(1)));
    case "INT-QL-057":
      return findExactRate((candidate) => eq(amount(state.principal, candidate, state.years), state.amount));
    case "INT-QL-058": {
      const matches = Array.from({ length: 12 }, (_, index) => index + 1)
        .filter((years) => eq(amount(state.principal, state.ratePercent, years), state.amount));
      if (matches.length !== 1) throw new Error(`time inverse expected one match, found ${matches.length}`);
      return rat(matches[0]!);
    }
    case "INT-QL-059":
      return yearlyInterest(state.principal, state.ratePercent, state.targetYear);
    case "INT-QL-060":
      return div(
        state.nthYearInterest,
        mul(sub(factor(state.ratePercent), rat(1)), pow(factor(state.ratePercent), state.targetYear - 1)),
      );
    case "INT-QL-061":
      return findExactRate((candidate) =>
        eq(yearlyInterest(state.principal, candidate, state.targetYear), state.nthYearInterest));
    case "INT-QL-062":
      return div(state.currentAmount, factor(state.ratePercent));
    case "INT-QL-063":
      return mul(sub(div(state.closingAmount, state.openingAmount), rat(1)), rat(100));
    case "INT-QL-064": {
      const ratePercent = mul(sub(div(state.nextYearAmount, state.amountAtYear), rat(1)), rat(100));
      return div(state.amountAtYear, pow(factor(ratePercent), state.yearNumber));
    }
    case "INT-QL-065":
      return sub(
        amount(state.principal, state.ratePercent, state.laterYear),
        amount(state.principal, state.ratePercent, state.earlierYear),
      );
    case "INT-QL-066":
      return mul(
        state.earlierYearInterest,
        pow(factor(state.ratePercent), state.laterYear - state.earlierYear),
      );
  }
}

export function verifyByRelation(state: Cp003MathematicalState, candidate: Rational): boolean {
  if (candidate.numerator <= 0n) return false;
  try {
    switch (state.qlId) {
      case "INT-QL-053":
        return eq(candidate, amountByRecurrence(state.principal, state.ratePercent, state.years));
      case "INT-QL-054":
        return eq(candidate, sub(amountByRecurrence(state.principal, state.ratePercent, state.years), state.principal));
      case "INT-QL-055":
        return eq(amountByRecurrence(candidate, state.ratePercent, state.years), state.amount);
      case "INT-QL-056":
        return eq(sub(amountByRecurrence(candidate, state.ratePercent, state.years), candidate), state.compoundInterest);
      case "INT-QL-057":
        return eq(amountByRecurrence(state.principal, candidate, state.years), state.amount);
      case "INT-QL-058": {
        const years = integer(candidate);
        return years !== null && years > 0 && years <= 12
          && eq(amountByRecurrence(state.principal, state.ratePercent, years), state.amount);
      }
      case "INT-QL-059":
        return eq(candidate, yearlyInterestByRecurrence(state.principal, state.ratePercent, state.targetYear));
      case "INT-QL-060":
        return eq(yearlyInterestByRecurrence(candidate, state.ratePercent, state.targetYear), state.nthYearInterest);
      case "INT-QL-061":
        return eq(yearlyInterestByRecurrence(state.principal, candidate, state.targetYear), state.nthYearInterest);
      case "INT-QL-062":
        return eq(mul(candidate, factor(state.ratePercent)), state.currentAmount);
      case "INT-QL-063":
        return eq(mul(state.openingAmount, factor(candidate)), state.closingAmount);
      case "INT-QL-064": {
        const observedFactor = div(state.nextYearAmount, state.amountAtYear);
        let reconstructed = candidate;
        for (let year = 0; year < state.yearNumber; year += 1) reconstructed = mul(reconstructed, observedFactor);
        return eq(reconstructed, state.amountAtYear) && eq(mul(reconstructed, observedFactor), state.nextYearAmount);
      }
      case "INT-QL-065":
        return eq(
          candidate,
          sub(
            amountByRecurrence(state.principal, state.ratePercent, state.laterYear),
            amountByRecurrence(state.principal, state.ratePercent, state.earlierYear),
          ),
        );
      case "INT-QL-066":
        return eq(
          candidate,
          mul(
            state.earlierYearInterest,
            pow(factor(state.ratePercent), state.laterYear - state.earlierYear),
          ),
        );
    }
  } catch {
    return false;
  }
}

function sortedStateEntries(state: Cp003MathematicalState): readonly [string, string][] {
  return Object.entries(state)
    .filter(([key]) => key !== "qlId")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => [
      key,
      typeof value === "number"
        ? String(value)
        : `${(value as Rational).numerator}/${(value as Rational).denominator}`,
    ] as const);
}

export function mathematicalFingerprint(state: Cp003MathematicalState, answer: Rational): string {
  return [
    state.qlId,
    ...sortedStateEntries(state).map(([key, value]) => `${key}=${value}`),
    `answer=${answer.numerator}/${answer.denominator}`,
  ].join("|");
}

export function mathematicalStateEntries(state: Cp003MathematicalState): readonly [string, string][] {
  return sortedStateEntries(state);
}
