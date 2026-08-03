import type {
  IntCp003GeneratedQuestion,
  IntCp003OptionAudit,
  Rational,
} from "./int-001-cp003-final-runtime";

export interface IntCp003EditorialExplanation {
  readonly coreConcept: string;
  readonly stepByStepSolution: readonly string[];
  readonly examSpeedShortcut: string;
  readonly optionAnalysis: readonly string[];
}

export interface IntCp003EditorialReviewQuestion {
  readonly packageId: "INT-001";
  readonly canonicalProblemId: "INT-CP-003";
  readonly qlId: IntCp003GeneratedQuestion["qlId"];
  readonly solveContract: string;
  readonly seed: string;
  readonly difficulty: IntCp003GeneratedQuestion["difficulty"];
  readonly representation: IntCp003GeneratedQuestion["representation"];
  readonly answerSemantic: IntCp003GeneratedQuestion["answerSemantic"];
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly explanation: IntCp003EditorialExplanation;
  readonly optionAudit: readonly IntCp003OptionAudit[];
  readonly hiddenState: IntCp003GeneratedQuestion["hiddenState"];
  readonly mathematicalFingerprint: string;
  readonly editorialStatus: "REMEDIATED_REVIEW_CANDIDATE";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export const LETTERS = ["A", "B", "C", "D"] as const;

export const TRAP_CODES: Readonly<Record<string, string>> = Object.freeze({
  RETURN_INTEREST: "INTEREST_ONLY_REPORTED_TRAP",
  USE_SI: "SIMPLE_INTEREST_APPLIED_TRAP",
  ONE_YEAR: "SINGLE_PERIOD_COMPOUNDING_TRAP",
  RETURN_AMOUNT: "AMOUNT_REPORTED_INSTEAD_OF_INTEREST_TRAP",
  FIRST_YEAR_ONLY: "FIRST_YEAR_INTEREST_ONLY_TRAP",
  COPY_AMOUNT: "GIVEN_AMOUNT_COPIED_TRAP",
  REVERSE_SI: "SIMPLE_INTEREST_REVERSE_TRAP",
  ONE_FEWER_YEAR: "GROWTH_PERIOD_UNDERCOUNT_TRAP",
  COPY_INTEREST: "GIVEN_INTEREST_COPIED_TRAP",
  SI_INVERSE: "SIMPLE_INTEREST_INVERSE_TRAP",
  SIMPLE_RATE: "LINEAR_RATE_AVERAGING_TRAP",
  TOTAL_GROWTH: "TOTAL_GROWTH_AS_ANNUAL_RATE_TRAP",
  NEARBY_RATE: "UNVERIFIED_NEARBY_RATE_TRAP",
  SIMPLE_TIME: "LINEAR_TIME_ASSUMPTION_TRAP",
  ONE_EXTRA_YEAR: "GROWTH_PERIOD_OVERCOUNT_TRAP",
  TWO_EXTRA_YEARS: "TWO_EXTRA_PERIODS_TRAP",
  FIRST_YEAR: "FIRST_YEAR_INTEREST_TRAP",
  PREVIOUS_YEAR: "PREVIOUS_YEAR_INTEREST_TRAP",
  NEXT_YEAR: "NEXT_YEAR_INTEREST_TRAP",
  CUMULATIVE: "CUMULATIVE_INTEREST_REPORTED_TRAP",
  FIRST_YEAR_INVERSE: "FIRST_YEAR_INVERSE_TRAP",
  EXTRA_FACTOR: "EXTRA_GROWTH_FACTOR_TRAP",
  SIMPLE_MULTIPLIER: "SIMPLE_YEAR_MULTIPLIER_TRAP",
  FIRST_YEAR_RATE: "FIRST_YEAR_RATE_ASSUMPTION_TRAP",
  LOW_RATE: "UNVERIFIED_LOW_RATE_TRAP",
  HIGH_RATE: "UNVERIFIED_HIGH_RATE_TRAP",
  COPY_LATER: "LATER_BALANCE_COPIED_TRAP",
  SUBTRACT_RATE: "SUBTRACT_RATE_INSTEAD_OF_DIVIDE_TRAP",
  DECAY_INVERSE: "DEPRECIATION_INVERSE_TRAP",
  LATER_BASE: "CLOSING_BALANCE_AS_BASE_TRAP",
  CUMULATIVE_RATE: "CUMULATIVE_GROWTH_AS_RATE_TRAP",
  COPY_OBSERVATION: "OBSERVED_AMOUNT_AS_PRINCIPAL_TRAP",
  EXTRA_YEAR: "EXTRA_REVERSE_PERIOD_TRAP",
  FEWER_YEAR: "INSUFFICIENT_REVERSE_PERIOD_TRAP",
  RETURN_ANNUAL_INCREASE: "ANNUAL_INCREASE_AS_PRINCIPAL_TRAP",
  LATER_CI: "LATER_CUMULATIVE_INTEREST_TRAP",
  EARLIER_CI: "EARLIER_CUMULATIVE_INTEREST_TRAP",
  SI_TO_LATER: "SIMPLE_INTEREST_TO_LATER_DATE_TRAP",
  CONSTANT_INTEREST: "FLAT_SIMPLE_INTEREST_ASSUMPTION_TRAP",
  INCREASE_ONLY: "INCREMENT_ONLY_REPORTED_TRAP",
  EXTRA_GAP: "EXTRA_GROWTH_STEP_TRAP",
});

const abs = (value: bigint) => value < 0n ? -value : value;

function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left);
  let b = abs(right);
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}

export function rat(numerator: bigint | number, denominator: bigint | number = 1): Rational {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("A rational denominator cannot be zero.");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}

export const add = (a: Rational, b: Rational) => rat(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
export const sub = (a: Rational, b: Rational) => rat(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
export const mul = (a: Rational, b: Rational) => rat(a.numerator * b.numerator, a.denominator * b.denominator);
export const div = (a: Rational, b: Rational) => rat(a.numerator * b.denominator, a.denominator * b.numerator);
export function pow(value: Rational, exponent: number): Rational {
  return rat(value.numerator ** BigInt(exponent), value.denominator ** BigInt(exponent));
}

export function parseRational(value: string | number): Rational {
  if (typeof value === "number") return rat(value);
  const [numerator, denominator = "1"] = value.split("/");
  return rat(BigInt(numerator!), BigInt(denominator));
}

export function factor(ratePercent: Rational): Rational {
  return add(rat(1), div(ratePercent, rat(100)));
}

export function amount(principal: Rational, ratePercent: Rational, years: number): Rational {
  return mul(principal, pow(factor(ratePercent), years));
}

export function yearlyInterest(principal: Rational, ratePercent: Rational, year: number): Rational {
  return sub(amount(principal, ratePercent, year), amount(principal, ratePercent, year - 1));
}

function formatInteger(value: bigint): string {
  const source = abs(value).toString();
  const groups: string[] = [];
  for (let index = source.length; index > 0; index -= 3) {
    groups.unshift(source.slice(Math.max(0, index - 3), index));
  }
  return `${value < 0n ? "-" : ""}${groups.join(",")}`;
}

export function decimal(value: Rational, maximumPlaces = 6): string {
  if (value.denominator === 1n) return value.numerator.toString();
  let remainingDenominator = value.denominator;
  while (remainingDenominator % 2n === 0n) remainingDenominator /= 2n;
  while (remainingDenominator % 5n === 0n) remainingDenominator /= 5n;
  if (remainingDenominator !== 1n) return `${value.numerator}/${value.denominator}`;

  const sign = value.numerator < 0n ? "-" : "";
  const numerator = abs(value.numerator);
  const integerPart = numerator / value.denominator;
  let remainder = numerator % value.denominator;
  let fractionalPart = "";
  for (let index = 0; remainder !== 0n && index < maximumPlaces; index += 1) {
    remainder *= 10n;
    fractionalPart += (remainder / value.denominator).toString();
    remainder %= value.denominator;
  }
  return fractionalPart ? `${sign}${integerPart}.${fractionalPart}` : `${sign}${integerPart}`;
}

export function fractionLatex(value: Rational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `\\frac{${value.numerator}}{${value.denominator}}`;
}

export function moneyPlain(value: Rational): string {
  if (value.denominator !== 1n) return `₹${decimal(value, 4)}`;
  return `₹${formatInteger(value.numerator)}`;
}

export const moneyMath = (value: Rational) => `$${moneyPlain(value)}$`;
export const percentMath = (value: Rational) => `$${decimal(value)}\\%$`;

export function optionMath(option: string): string {
  if (option.startsWith("₹")) return `$${option}$`;
  if (option.endsWith("%")) return `$${option.slice(0, -1)}\\%$`;
  const years = option.match(/^(\\d+) years?$/u);
  if (years) return `$${years[1]}$ year${years[1] === "1" ? "" : "s"}`;
  return `$${option}$`;
}

export function ordinal(value: number): string {
  let suffix = "th";
  if (![11, 12, 13].includes(value % 100)) {
    suffix = ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[value % 10] ?? "th";
  }
  return `$${value}^{\\text{${suffix}}}$`;
}

export interface EditorialState {
  readonly principal: Rational;
  readonly ratePercent: Rational;
  readonly years: number;
  readonly specifiedYear: number;
  readonly observationYear: number;
  readonly earlierYear: number;
  readonly laterYear: number;
  readonly annualFactor: Rational;
  readonly maturityAmount: Rational;
  readonly compoundInterest: Rational;
  readonly specifiedYearInterest: Rational;
  readonly observedAmount: Rational;
  readonly nextObservedAmount: Rational;
  readonly earlierAmount: Rational;
  readonly laterAmount: Rational;
  readonly earlierYearInterest: Rational;
  readonly laterYearInterest: Rational;
}

export function stateOf(question: IntCp003GeneratedQuestion): EditorialState {
  const principal = parseRational(question.hiddenState.principal as string);
  const ratePercent = parseRational(question.hiddenState.ratePercent as string);
  const years = Number(question.hiddenState.years);
  const specifiedYear = Number(question.hiddenState.specifiedYear);
  const observationYear = Number(question.hiddenState.observationYear);
  const earlierYear = Number(question.hiddenState.earlierYear);
  const laterYear = Number(question.hiddenState.laterYear);
  return Object.freeze({
    principal,
    ratePercent,
    years,
    specifiedYear,
    observationYear,
    earlierYear,
    laterYear,
    annualFactor: factor(ratePercent),
    maturityAmount: amount(principal, ratePercent, years),
    compoundInterest: sub(amount(principal, ratePercent, years), principal),
    specifiedYearInterest: yearlyInterest(principal, ratePercent, specifiedYear),
    observedAmount: amount(principal, ratePercent, observationYear),
    nextObservedAmount: amount(principal, ratePercent, observationYear + 1),
    earlierAmount: amount(principal, ratePercent, earlierYear),
    laterAmount: amount(principal, ratePercent, laterYear),
    earlierYearInterest: yearlyInterest(principal, ratePercent, earlierYear),
    laterYearInterest: yearlyInterest(principal, ratePercent, laterYear),
  });
}

export function cancellationProduct(base: Rational, multiplier: Rational, label: string): string[] {
  const firstCancellation = gcd(base.numerator, multiplier.denominator);
  const secondCancellation = gcd(multiplier.numerator, base.denominator);
  const reducedBaseNumerator = base.numerator / firstCancellation;
  const reducedMultiplierDenominator = multiplier.denominator / firstCancellation;
  const reducedMultiplierNumerator = multiplier.numerator / secondCancellation;
  const reducedBaseDenominator = base.denominator / secondCancellation;
  const reducedNumerator = reducedBaseNumerator * reducedMultiplierNumerator;
  const reducedDenominator = reducedBaseDenominator * reducedMultiplierDenominator;
  const result = mul(base, multiplier);
  const lines: string[] = [];
  if (firstCancellation > 1n || secondCancellation > 1n) {
    lines.push(
      `Cancel common factors before multiplying: $\\frac{${base.numerator}}{${base.denominator}}\\times\\frac{${multiplier.numerator}}{${multiplier.denominator}}=\\frac{${reducedBaseNumerator}\\times${reducedMultiplierNumerator}}{${reducedBaseDenominator}\\times${reducedMultiplierDenominator}}$.`,
    );
  }
  lines.push(
    reducedDenominator === 1n
      ? `Therefore, $${label}=${reducedNumerator}=${moneyPlain(result)}$.`
      : `Therefore, $${label}=\\frac{${reducedNumerator}}{${reducedDenominator}}=${decimal(result)}$.`,
  );
  return lines;
}

export function examStem(question: IntCp003GeneratedQuestion, state: EditorialState): string {
  const { principal: p, ratePercent: r, years: n, specifiedYear: k, observationYear: t, earlierYear: e, laterYear: l } = state;
  switch (question.qlId) {
    case "INT-QL-053":
      return `A sum of ${moneyMath(p)} is invested at ${percentMath(r)} per annum, compounded annually. What will be the amount after $${n}$ years?`;
    case "INT-QL-054":
      return `Find the compound interest on ${moneyMath(p)} for $${n}$ years at ${percentMath(r)} per annum, compounded annually.`;
    case "INT-QL-055":
      return `A sum amounts to ${moneyMath(state.maturityAmount)} in $${n}$ years at ${percentMath(r)} per annum, compounded annually. Find the original sum.`;
    case "INT-QL-056":
      return `The compound interest on a certain sum for $${n}$ years at ${percentMath(r)} per annum, compounded annually, is ${moneyMath(state.compoundInterest)}. Find the principal.`;
    case "INT-QL-057":
      return `A sum of ${moneyMath(p)} amounts to ${moneyMath(state.maturityAmount)} in $${n}$ years at compound interest, compounded annually. Find the rate per annum.`;
    case "INT-QL-058":
      return `In how many years will ${moneyMath(p)} amount to ${moneyMath(state.maturityAmount)} at ${percentMath(r)} per annum, compounded annually?`;
    case "INT-QL-059":
      return `A sum of ${moneyMath(p)} is invested at ${percentMath(r)} per annum, compounded annually. Find the interest earned during the ${ordinal(k)} year.`;
    case "INT-QL-060":
      return `At ${percentMath(r)} per annum, compounded annually, the interest earned during the ${ordinal(k)} year is ${moneyMath(state.specifiedYearInterest)}. Find the principal.`;
    case "INT-QL-061":
      return `The interest earned during the ${ordinal(k)} year on ${moneyMath(p)}, compounded annually, is ${moneyMath(state.specifiedYearInterest)}. Find the annual rate of interest.`;
    case "INT-QL-062":
      return `At ${percentMath(r)} per annum, compounded annually, an amount is ${moneyMath(state.observedAmount)} at the end of year $${t}$. What was the amount at the end of the previous year?`;
    case "INT-QL-063":
      return `An account shows ${moneyMath(state.observedAmount)} at the end of year $${t}$ and ${moneyMath(state.nextObservedAmount)} at the end of year $${t + 1}$. If interest is compounded annually, find the rate per annum.`;
    case "INT-QL-064":
      return `A sum amounts to ${moneyMath(state.observedAmount)} after $${t}$ years and ${moneyMath(state.nextObservedAmount)} after $${t + 1}$ years at the same annual compound rate. Find the principal.`;
    case "INT-QL-065":
      return `A sum of ${moneyMath(p)} is invested at ${percentMath(r)} per annum, compounded annually. Find the difference between the amounts after $${e}$ years and $${l}$ years.`;
    case "INT-QL-066":
      return `At ${percentMath(r)} per annum, compounded annually, the interest earned during the ${ordinal(e)} year is ${moneyMath(state.earlierYearInterest)}. Find the interest earned during the ${ordinal(l)} year.`;
  }
}
