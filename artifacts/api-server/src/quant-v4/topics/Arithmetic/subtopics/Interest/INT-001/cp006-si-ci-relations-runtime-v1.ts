import { add, div, eq, hash, mul, pow, rat, sub, type Rational } from "./cp003-exam-model";

export const INT_CP006_RUNTIME_VERSION = "INT-CP-006-SI-CI-RELATIONS-v1-en-review" as const;
export const INT_CP006_QL_IDS = Object.freeze([
  "INT-QL-096", "INT-QL-097", "INT-QL-098", "INT-QL-099", "INT-QL-100", "INT-QL-101", "INT-QL-102",
  "INT-QL-103", "INT-QL-104", "INT-QL-105", "INT-QL-106", "INT-QL-107", "INT-QL-108",
] as const);
export type IntCp006QlId = typeof INT_CP006_QL_IDS[number];
export type IntCp006AnswerSemantic = "MONEY" | "PRINCIPAL" | "RATE_PERCENT" | "TIME_YEARS";
export type IntCp006Representation = "STANDARD_PROSE" | "COMPARISON_TABLE" | "INTEREST_LEDGER";

export const INT_CP006_DECISION = Object.freeze({
  checkpoint: "INT-CP-006 — Simple-versus-Compound Differences and Successive-Interest Relations" as const,
  qlRange: "INT-QL-096..INT-QL-108" as const,
  qlCount: 13 as const,
  locale: "en-IN" as const,
  stemTemplatesPerQl: 3 as const,
  questionStudioActivationAuthorized: false as const,
});

const RATES = Object.freeze([5, 8, 10, 12, 15, 20, 25] as const);
const PRINCIPALS = Object.freeze([
  10000n, 12000n, 12500n, 16000n, 20000n, 25000n, 32000n, 40000n, 50000n,
  62500n, 80000n, 100000n, 125000n, 160000n, 200000n,
] as const);
const THRESHOLD_RATES = Object.freeze([10, 20, 25] as const);
const THRESHOLD_PRINCIPALS = Object.freeze([100000n, 125000n, 160000n, 200000n] as const);

const r = (value: number | bigint): Rational => rat(value);
const key = (value: Rational): string => `${value.numerator}/${value.denominator}`;
const factor = (ratePercent: Rational): Rational => add(rat(1), div(ratePercent, rat(100)));
const rateDecimal = (ratePercent: Rational): Rational => div(ratePercent, rat(100));

function cmp(left: Rational, right: Rational): number {
  const delta = left.numerator * right.denominator - right.numerator * left.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}
function choose<T>(values: readonly T[], seed: string, label: string): T {
  if (!values.length) throw new Error(`${label}: empty candidate pool`);
  return values[(hash(`${seed}:cp006:${label}`) >>> 0) % values.length]!;
}

export function simpleInterest(principal: Rational, ratePercent: Rational, years: number): Rational {
  return div(mul(mul(principal, ratePercent), rat(years)), rat(100));
}
export function compoundAmount(principal: Rational, ratePercent: Rational, years: number): Rational {
  return mul(principal, pow(factor(ratePercent), years));
}
export function compoundInterest(principal: Rational, ratePercent: Rational, years: number): Rational {
  return sub(compoundAmount(principal, ratePercent, years), principal);
}
export function siCiDifference(principal: Rational, ratePercent: Rational, years: number): Rational {
  return sub(compoundInterest(principal, ratePercent, years), simpleInterest(principal, ratePercent, years));
}
export function yearlyCompoundInterest(principal: Rational, ratePercent: Rational, year: number): Rational {
  const opening = compoundAmount(principal, ratePercent, year - 1);
  return mul(opening, rateDecimal(ratePercent));
}

function ledgerObservations(principal: Rational, ratePercent: Rational, years: number) {
  const annualSimple = mul(principal, rateDecimal(ratePercent));
  let simpleBalance = principal;
  let compoundBalance = principal;
  const yearlyInterests: Rational[] = [];
  for (let year = 1; year <= years; year += 1) {
    simpleBalance = add(simpleBalance, annualSimple);
    const opening = compoundBalance;
    compoundBalance = mul(compoundBalance, factor(ratePercent));
    yearlyInterests.push(sub(compoundBalance, opening));
  }
  return deepFreeze({
    simpleInterest: sub(simpleBalance, principal),
    compoundInterest: sub(compoundBalance, principal),
    difference: sub(compoundBalance, simpleBalance),
    yearlyInterests: Object.freeze(yearlyInterests),
  });
}

function visible(value: Rational): boolean {
  const scaled = value.numerator * 100n;
  return scaled % value.denominator === 0n;
}
function positiveVisible(value: Rational): boolean { return value.numerator > 0n && visible(value); }
function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return `${sign}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function decimal(value: Rational): string {
  const scaledNumerator = value.numerator * 100n;
  if (scaledNumerator % value.denominator !== 0n) throw new Error(`non-displayable value ${key(value)}`);
  const hundredths = scaledNumerator / value.denominator;
  const sign = hundredths < 0n ? "-" : "";
  const magnitude = hundredths < 0n ? -hundredths : hundredths;
  const whole = magnitude / 100n;
  const fraction = magnitude % 100n;
  const wholeText = indianInteger(whole);
  if (fraction === 0n) return `${sign}${wholeText}`;
  if (fraction % 10n === 0n) return `${sign}${wholeText}.${fraction / 10n}`;
  return `${sign}${wholeText}.${fraction.toString().padStart(2, "0")}`;
}
const money = (value: Rational): string => `₹${decimal(value)}`;
const percent = (value: Rational): string => `${decimal(value)}%`;
const yearText = (value: number): string => value === 1 ? "1 year" : `${value} years`;

interface BasePair { readonly principal: Rational; readonly ratePercent: Rational; }
function baseCandidates(maxYear = 3): readonly BasePair[] {
  const results: BasePair[] = [];
  for (const rate of RATES) {
    for (const principal of PRINCIPALS) {
      const p = rat(principal);
      const rp = rat(rate);
      const observations = ledgerObservations(p, rp, Math.max(maxYear, 2));
      const required = [
        observations.simpleInterest, observations.compoundInterest, observations.difference,
        siCiDifference(p, rp, 2), siCiDifference(p, rp, 3), yearlyCompoundInterest(p, rp, 1),
      ];
      if (maxYear >= 3) required.push(yearlyCompoundInterest(p, rp, 2), yearlyCompoundInterest(p, rp, 3), yearlyCompoundInterest(p, rp, 4));
      if (required.every(positiveVisible)) results.push(deepFreeze({ principal: p, ratePercent: rp }));
    }
  }
  return Object.freeze(results);
}
const BASES = baseCandidates(3);

function base(seed: string, label: string): BasePair { return choose(BASES, seed, label); }

export type IntCp006State =
  | Readonly<{ qlId: "INT-QL-096"; principal: Rational; ratePercent: Rational }>
  | Readonly<{ qlId: "INT-QL-097"; principal: Rational; ratePercent: Rational }>
  | Readonly<{ qlId: "INT-QL-098"; difference2: Rational; ratePercent: Rational }>
  | Readonly<{ qlId: "INT-QL-099"; difference2: Rational; principal: Rational }>
  | Readonly<{ qlId: "INT-QL-100"; simpleInterest2: Rational; compoundInterest2: Rational }>
  | Readonly<{ qlId: "INT-QL-101"; simpleInterest2: Rational; compoundInterest2: Rational }>
  | Readonly<{ qlId: "INT-QL-102"; ratePercent: Rational; knownYears: 2 | 3; knownDifference: Rational }>
  | Readonly<{ qlId: "INT-QL-103"; difference2: Rational; difference3: Rational }>
  | Readonly<{ qlId: "INT-QL-104"; difference2: Rational; difference3: Rational }>
  | Readonly<{ qlId: "INT-QL-105"; yearNumber: 1 | 2 | 3; earlierInterest: Rational; laterInterest: Rational }>
  | Readonly<{ qlId: "INT-QL-106"; yearNumber: 1 | 2 | 3; earlierInterest: Rational; laterInterest: Rational }>
  | Readonly<{ qlId: "INT-QL-107"; principal: Rational; ratePercent: Rational; targetDifference: Rational; boundary: "EXACT" | "BETWEEN" }>
  | Readonly<{ qlId: "INT-QL-108"; secondYearExcess: Rational; ratePercent: Rational }>;

function thresholdState(seed: string): Extract<IntCp006State, { qlId: "INT-QL-107" }> {
  const ratePercent = rat(choose(THRESHOLD_RATES, seed, "107-rate"));
  const principal = rat(choose(THRESHOLD_PRINCIPALS, seed, "107-principal"));
  const targetYear = choose([2, 3, 4, 5] as const, seed, "107-year");
  const previous = siCiDifference(principal, ratePercent, targetYear - 1);
  const current = siCiDifference(principal, ratePercent, targetYear);
  const preferBetween = (hash(`${seed}:cp006:107-boundary`) & 1) === 1 && targetYear > 2;
  if (preferBetween) {
    const midpoint = div(add(previous, current), rat(2));
    if (visible(midpoint) && cmp(previous, midpoint) < 0 && cmp(midpoint, current) < 0) {
      return deepFreeze({ qlId: "INT-QL-107", principal, ratePercent, targetDifference: midpoint, boundary: "BETWEEN" });
    }
  }
  return deepFreeze({ qlId: "INT-QL-107", principal, ratePercent, targetDifference: current, boundary: "EXACT" });
}

export function constructIntCp006State(qlId: IntCp006QlId, seed: string): IntCp006State {
  if (qlId === "INT-QL-107") return thresholdState(seed);
  const selected = base(seed, `${qlId}-base`);
  const { principal, ratePercent } = selected;
  const d2 = siCiDifference(principal, ratePercent, 2);
  const d3 = siCiDifference(principal, ratePercent, 3);
  const ledger2 = ledgerObservations(principal, ratePercent, 2);
  switch (qlId) {
    case "INT-QL-096": return deepFreeze({ qlId, principal, ratePercent });
    case "INT-QL-097": return deepFreeze({ qlId, principal, ratePercent });
    case "INT-QL-098": return deepFreeze({ qlId, difference2: d2, ratePercent });
    case "INT-QL-099": return deepFreeze({ qlId, difference2: d2, principal });
    case "INT-QL-100": return deepFreeze({ qlId, simpleInterest2: ledger2.simpleInterest, compoundInterest2: ledger2.compoundInterest });
    case "INT-QL-101": return deepFreeze({ qlId, simpleInterest2: ledger2.simpleInterest, compoundInterest2: ledger2.compoundInterest });
    case "INT-QL-102": {
      const knownYears = (hash(`${seed}:cp006:102-direction`) & 1) === 0 ? 2 : 3;
      return deepFreeze({ qlId, ratePercent, knownYears, knownDifference: knownYears === 2 ? d2 : d3 });
    }
    case "INT-QL-103": return deepFreeze({ qlId, difference2: d2, difference3: d3 });
    case "INT-QL-104": return deepFreeze({ qlId, difference2: d2, difference3: d3 });
    case "INT-QL-105":
    case "INT-QL-106": {
      const yearNumber = choose([1, 2, 3] as const, seed, `${qlId}-year`);
      return deepFreeze({
        qlId,
        yearNumber,
        earlierInterest: yearlyCompoundInterest(principal, ratePercent, yearNumber),
        laterInterest: yearlyCompoundInterest(principal, ratePercent, yearNumber + 1),
      });
    }
    case "INT-QL-108": return deepFreeze({ qlId, secondYearExcess: sub(yearlyCompoundInterest(principal, ratePercent, 2), yearlyCompoundInterest(principal, ratePercent, 1)), ratePercent });
  }
}

function exactRateFromTwoYearDifference(principal: Rational, difference2: Rational): Rational {
  const matches = RATES.map((value) => rat(value)).filter((candidate) => eq(siCiDifference(principal, candidate, 2), difference2));
  if (matches.length !== 1) throw new Error(`expected one exact rate, found ${matches.length}`);
  return matches[0]!;
}
function rateFromSiCi(simple2: Rational, compound2: Rational): Rational {
  const difference = sub(compound2, simple2);
  return div(mul(difference, rat(200)), simple2);
}
function rateFromD2D3(d2: Rational, d3: Rational): Rational {
  return mul(sub(div(d3, d2), rat(3)), rat(100));
}
function rateFromConsecutiveInterests(earlier: Rational, later: Rational): Rational {
  return mul(sub(div(later, earlier), rat(1)), rat(100));
}

export function solveIntCp006(state: IntCp006State): Rational {
  switch (state.qlId) {
    case "INT-QL-096": return siCiDifference(state.principal, state.ratePercent, 2);
    case "INT-QL-097": return siCiDifference(state.principal, state.ratePercent, 3);
    case "INT-QL-098": return div(mul(state.difference2, rat(10000)), mul(state.ratePercent, state.ratePercent));
    case "INT-QL-099": return exactRateFromTwoYearDifference(state.principal, state.difference2);
    case "INT-QL-100": return rateFromSiCi(state.simpleInterest2, state.compoundInterest2);
    case "INT-QL-101": {
      const ratePercent = rateFromSiCi(state.simpleInterest2, state.compoundInterest2);
      return div(mul(state.simpleInterest2, rat(100)), mul(rat(2), ratePercent));
    }
    case "INT-QL-102": {
      const relation = add(rat(3), rateDecimal(state.ratePercent));
      return state.knownYears === 2 ? mul(state.knownDifference, relation) : div(state.knownDifference, relation);
    }
    case "INT-QL-103": return rateFromD2D3(state.difference2, state.difference3);
    case "INT-QL-104": {
      const ratePercent = rateFromD2D3(state.difference2, state.difference3);
      return div(mul(state.difference2, rat(10000)), mul(ratePercent, ratePercent));
    }
    case "INT-QL-105": return rateFromConsecutiveInterests(state.earlierInterest, state.laterInterest);
    case "INT-QL-106": {
      const ratePercent = rateFromConsecutiveInterests(state.earlierInterest, state.laterInterest);
      const multiplier = mul(rateDecimal(ratePercent), pow(factor(ratePercent), state.yearNumber - 1));
      return div(state.earlierInterest, multiplier);
    }
    case "INT-QL-107": {
      for (let year = 2; year <= 6; year += 1) {
        if (cmp(siCiDifference(state.principal, state.ratePercent, year), state.targetDifference) >= 0) return rat(year);
      }
      throw new Error("threshold not crossed in bounded domain");
    }
    case "INT-QL-108": return div(state.secondYearExcess, rateDecimal(state.ratePercent));
  }
}

function inferredPrincipalFromSimpleInterest(simple2: Rational, ratePercent: Rational): Rational {
  return div(mul(simple2, rat(100)), mul(rat(2), ratePercent));
}
function principalCandidates(): readonly Rational[] { return PRINCIPALS.map((value) => rat(value)); }

export function verifyIntCp006Answer(state: IntCp006State, candidate: Rational): boolean {
  if (!positiveVisible(candidate)) return false;
  switch (state.qlId) {
    case "INT-QL-096": return eq(ledgerObservations(state.principal, state.ratePercent, 2).difference, candidate);
    case "INT-QL-097": return eq(ledgerObservations(state.principal, state.ratePercent, 3).difference, candidate);
    case "INT-QL-098": return eq(ledgerObservations(candidate, state.ratePercent, 2).difference, state.difference2);
    case "INT-QL-099": return RATES.includes(Number(candidate.numerator / candidate.denominator) as typeof RATES[number]) && eq(ledgerObservations(state.principal, candidate, 2).difference, state.difference2);
    case "INT-QL-100": {
      const principal = inferredPrincipalFromSimpleInterest(state.simpleInterest2, candidate);
      const observations = ledgerObservations(principal, candidate, 2);
      return eq(observations.simpleInterest, state.simpleInterest2) && eq(observations.compoundInterest, state.compoundInterest2);
    }
    case "INT-QL-101": {
      const matches = RATES.map((value) => rat(value)).filter((ratePercent) => {
        const observations = ledgerObservations(candidate, ratePercent, 2);
        return eq(observations.simpleInterest, state.simpleInterest2) && eq(observations.compoundInterest, state.compoundInterest2);
      });
      return matches.length === 1;
    }
    case "INT-QL-102": {
      const otherYears = state.knownYears === 2 ? 3 : 2;
      const matches = principalCandidates().filter((principal) => eq(ledgerObservations(principal, state.ratePercent, state.knownYears).difference, state.knownDifference));
      return matches.length === 1 && eq(ledgerObservations(matches[0]!, state.ratePercent, otherYears).difference, candidate);
    }
    case "INT-QL-103": {
      const matches = principalCandidates().filter((principal) => {
        const d2 = ledgerObservations(principal, candidate, 2).difference;
        const d3 = ledgerObservations(principal, candidate, 3).difference;
        return eq(d2, state.difference2) && eq(d3, state.difference3);
      });
      return matches.length === 1;
    }
    case "INT-QL-104": {
      const matches = RATES.map((value) => rat(value)).filter((ratePercent) => {
        const d2 = ledgerObservations(candidate, ratePercent, 2).difference;
        const d3 = ledgerObservations(candidate, ratePercent, 3).difference;
        return eq(d2, state.difference2) && eq(d3, state.difference3);
      });
      return matches.length === 1;
    }
    case "INT-QL-105": {
      const matches = principalCandidates().filter((principal) => {
        const ledger = ledgerObservations(principal, candidate, state.yearNumber + 1).yearlyInterests;
        return eq(ledger[state.yearNumber - 1]!, state.earlierInterest) && eq(ledger[state.yearNumber]!, state.laterInterest);
      });
      return matches.length === 1;
    }
    case "INT-QL-106": {
      const matches = RATES.map((value) => rat(value)).filter((ratePercent) => {
        const ledger = ledgerObservations(candidate, ratePercent, state.yearNumber + 1).yearlyInterests;
        return eq(ledger[state.yearNumber - 1]!, state.earlierInterest) && eq(ledger[state.yearNumber]!, state.laterInterest);
      });
      return matches.length === 1;
    }
    case "INT-QL-107": {
      const candidateYear = candidate.denominator === 1n ? Number(candidate.numerator) : NaN;
      if (!Number.isInteger(candidateYear) || candidateYear < 2 || candidateYear > 6) return false;
      const current = ledgerObservations(state.principal, state.ratePercent, candidateYear).difference;
      const previous = ledgerObservations(state.principal, state.ratePercent, candidateYear - 1).difference;
      return cmp(current, state.targetDifference) >= 0 && cmp(previous, state.targetDifference) < 0;
    }
    case "INT-QL-108": {
      const principal = div(candidate, rateDecimal(state.ratePercent));
      const ledger = ledgerObservations(principal, state.ratePercent, 2).yearlyInterests;
      return eq(sub(ledger[1]!, ledger[0]!), state.secondYearExcess) && eq(ledger[0]!, candidate);
    }
  }
}

function answerSemantic(qlId: IntCp006QlId): IntCp006AnswerSemantic {
  if (["INT-QL-099", "INT-QL-100", "INT-QL-103", "INT-QL-105"].includes(qlId)) return "RATE_PERCENT";
  if (["INT-QL-098", "INT-QL-101", "INT-QL-104", "INT-QL-106"].includes(qlId)) return "PRINCIPAL";
  if (qlId === "INT-QL-107") return "TIME_YEARS";
  return "MONEY";
}

interface Distractor { readonly value: Rational; readonly misconceptionId: string; }
function distractors(state: IntCp006State, answer: Rational): readonly Distractor[] {
  const list: Distractor[] = [];
  const addCandidate = (value: Rational, misconceptionId: string) => {
    if (!positiveVisible(value) || eq(value, answer) || list.some((item) => eq(item.value, value))) return;
    list.push({ value, misconceptionId });
  };
  switch (state.qlId) {
    case "INT-QL-096":
      addCandidate(mul(answer, rat(2)), "APPLY_RATE_TO_TWO_YEAR_SI");
      addCandidate(mul(answer, factor(state.ratePercent)), "COMPOUND_EXCESS_ONE_EXTRA_YEAR");
      addCandidate(mul(answer, rat(4)), "SQUARE_TWO_YEAR_TOTAL_RATE");
      break;
    case "INT-QL-097": {
      const d2 = siCiDifference(state.principal, state.ratePercent, 2);
      addCandidate(mul(d2, rat(3)), "OMIT_CUBIC_TERM");
      addCandidate(mul(d2, rat(2)), "COUNT_ONLY_TWO_EXTRA_LAYERS");
      addCandidate(mul(d2, add(rat(3), mul(rateDecimal(state.ratePercent), rat(2)))), "DOUBLE_CUBIC_TERM");
      break;
    }
    case "INT-QL-098":
      addCandidate(div(mul(state.difference2, rat(100)), state.ratePercent), "TREAT_DIFFERENCE_AS_FIRST_YEAR_SI");
      addCandidate(mul(answer, rat(2)), "DIVIDE_BY_TWO_RATE_SQUARES");
      addCandidate(div(answer, factor(state.ratePercent)), "DISCOUNT_PRINCIPAL_ONE_YEAR");
      break;
    case "INT-QL-099":
      addCandidate(div(answer, rat(2)), "TAKE_HALF_SQUARE_ROOT_RATE");
      addCandidate(mul(answer, rat(2)), "DOUBLE_SQUARE_ROOT_RATE");
      addCandidate(div(mul(answer, answer), rat(100)), "USE_DIFFERENCE_RATIO_AS_PERCENT");
      break;
    case "INT-QL-100": {
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      addCandidate(div(mul(difference, rat(100)), state.simpleInterest2), "MISS_TWO_YEAR_FACTOR");
      addCandidate(div(mul(difference, rat(200)), state.compoundInterest2), "DIVIDE_BY_CI_INSTEAD_OF_SI");
      addCandidate(div(mul(difference, rat(100)), state.compoundInterest2), "MISS_TWO_YEAR_FACTOR_AND_USE_CI");
      break;
    }
    case "INT-QL-101": {
      const ratePercent = rateFromSiCi(state.simpleInterest2, state.compoundInterest2);
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      addCandidate(mul(answer, rat(2)), "FORGET_TWO_YEARS_IN_SI");
      addCandidate(div(mul(state.compoundInterest2, rat(100)), mul(rat(2), ratePercent)), "TREAT_CI_AS_TWO_YEAR_SI");
      addCandidate(div(mul(difference, rat(100)), ratePercent), "TREAT_DIFFERENCE_AS_FIRST_YEAR_SI");
      break;
    }
    case "INT-QL-102": {
      if (state.knownYears === 2) {
        addCandidate(mul(state.knownDifference, rat(3)), "OMIT_CUBIC_TERM");
        addCandidate(mul(state.knownDifference, add(rat(2), rateDecimal(state.ratePercent))), "COUNT_TWO_LAYERS");
        addCandidate(mul(state.knownDifference, add(rat(3), mul(rateDecimal(state.ratePercent), rat(2)))), "DOUBLE_CUBIC_TERM");
      } else {
        addCandidate(div(state.knownDifference, rat(3)), "OMIT_CUBIC_TERM");
        addCandidate(div(state.knownDifference, add(rat(2), rateDecimal(state.ratePercent))), "COUNT_TWO_LAYERS");
        addCandidate(div(state.knownDifference, add(rat(3), mul(rateDecimal(state.ratePercent), rat(2)))), "DOUBLE_CUBIC_TERM");
      }
      break;
    }
    case "INT-QL-103":
      addCandidate(div(answer, rat(2)), "HALVE_EXCESS_RATIO");
      addCandidate(mul(answer, rat(2)), "DOUBLE_EXCESS_RATIO");
      addCandidate(div(mul(answer, answer), rat(100)), "TREAT_RATE_DECIMAL_AS_PERCENT");
      break;
    case "INT-QL-104": {
      const ratePercent = rateFromD2D3(state.difference2, state.difference3);
      addCandidate(div(answer, rat(2)), "USE_DOUBLE_RATE_SQUARE");
      addCandidate(mul(answer, rat(2)), "USE_HALF_RATE_SQUARE");
      addCandidate(div(mul(state.difference3, rat(10000)), mul(ratePercent, ratePercent)), "TREAT_THREE_YEAR_DIFFERENCE_AS_D2");
      break;
    }
    case "INT-QL-105":
      addCandidate(div(answer, rat(2)), "TREAT_INTERESTS_AS_TWO_YEAR_SPAN");
      addCandidate(div(mul(sub(state.laterInterest, state.earlierInterest), rat(100)), state.laterInterest), "DIVIDE_EXCESS_BY_LATER_INTEREST");
      addCandidate(div(mul(sub(state.laterInterest, state.earlierInterest), rat(100)), add(state.earlierInterest, state.laterInterest)), "DIVIDE_EXCESS_BY_SUM_OF_INTERESTS");
      break;
    case "INT-QL-106": {
      const ratePercent = rateFromConsecutiveInterests(state.earlierInterest, state.laterInterest);
      addCandidate(div(mul(state.laterInterest, rat(100)), ratePercent), "TREAT_LATER_INTEREST_AS_FIRST_YEAR_INTEREST");
      addCandidate(div(mul(state.earlierInterest, rat(100)), mul(ratePercent, rat(2))), "TREAT_TWO_OBSERVATIONS_AS_TWO_YEAR_SI");
      addCandidate(div(mul(state.earlierInterest, rat(100)), ratePercent), "TREAT_EARLIER_INTEREST_AS_FIRST_YEAR_INTEREST");
      addCandidate(mul(answer, rat(2)), "DOUBLE_RECONSTRUCTED_PRINCIPAL");
      break;
    }
    case "INT-QL-107": {
      const correctYear = Number(answer.numerator);
      for (const year of [correctYear - 1, correctYear + 1, correctYear - 2, correctYear + 2]) if (year >= 1 && year <= 6) addCandidate(rat(year), "OFF_BY_ONE_THRESHOLD_CHECK");
      break;
    }
    case "INT-QL-108":
      addCandidate(div(answer, rat(2)), "DIVIDE_EXCESS_ACROSS_TWO_YEARS");
      addCandidate(mul(answer, factor(state.ratePercent)), "USE_SECOND_YEAR_INTEREST");
      addCandidate(div(answer, factor(state.ratePercent)), "DISCOUNT_FIRST_YEAR_INTEREST");
      break;
  }
  if (list.length < 3) throw new Error(`${state.qlId}: only ${list.length} distinct misconception distractors`);
  return Object.freeze(list.slice(0, 3).map((item) => deepFreeze(item)));
}

function formatAnswer(value: Rational, semantic: IntCp006AnswerSemantic): string {
  if (semantic === "RATE_PERCENT") return percent(value);
  if (semantic === "TIME_YEARS") {
    if (value.denominator !== 1n) throw new Error("time answer must be integral");
    return yearText(Number(value.numerator));
  }
  return money(value);
}

function representationFor(qlId: IntCp006QlId, template: number): IntCp006Representation {
  if (template === 2 && ["INT-QL-100", "INT-QL-101", "INT-QL-103", "INT-QL-104"].includes(qlId)) return "COMPARISON_TABLE";
  if (template === 2 && ["INT-QL-105", "INT-QL-106"].includes(qlId)) return "INTEREST_LEDGER";
  return "STANDARD_PROSE";
}
function table(rows: readonly (readonly [string, string])[]): string {
  return `| Item | Value |\n|---|---:|\n${rows.map(([name, value]) => `| ${name} | ${value} |`).join("\n")}`;
}

function presentation(state: IntCp006State, seed: string) {
  const template = hash(`${seed}:cp006:template`) % 3;
  let markdown = "";
  switch (state.qlId) {
    case "INT-QL-096": {
      const frames = [
        `Find the difference between compound interest and simple interest on ${money(state.principal)} for 2 years at ${percent(state.ratePercent)} per annum.`,
        `${money(state.principal)} is invested for 2 years at ${percent(state.ratePercent)} per annum. How much more interest is earned under annual compounding than under simple interest?`,
        `At ${percent(state.ratePercent)} per annum for 2 years, by how much does CI exceed SI on a principal of ${money(state.principal)}?`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-097": {
      const frames = [
        `Find the difference between compound interest and simple interest on ${money(state.principal)} for 3 years at ${percent(state.ratePercent)} per annum.`,
        `${money(state.principal)} is kept for 3 years at ${percent(state.ratePercent)} per annum. Find the excess of annual compound interest over simple interest.`,
        `For a principal of ${money(state.principal)} at ${percent(state.ratePercent)} per annum, how much greater is CI than SI after 3 years?`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-098": {
      const frames = [
        `For 2 years at ${percent(state.ratePercent)} per annum, CI exceeds SI by ${money(state.difference2)}. Find the principal.`,
        `The difference between compound and simple interest for 2 years is ${money(state.difference2)} at ${percent(state.ratePercent)} per annum. What sum was invested?`,
        `A sum gives ${money(state.difference2)} more under annual compound interest than under simple interest in 2 years at ${percent(state.ratePercent)}. Find the sum.`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-099": {
      const frames = [
        `On ${money(state.principal)}, the difference between CI and SI for 2 years is ${money(state.difference2)}. Find the annual rate.`,
        `${money(state.principal)} earns ${money(state.difference2)} more as compound interest than as simple interest over 2 years. What is the rate per annum?`,
        `For a 2-year period, CI exceeds SI by ${money(state.difference2)} on ${money(state.principal)}. Determine the annual rate.`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-100":
    case "INT-QL-101": {
      const ask = state.qlId === "INT-QL-100" ? "Find the annual rate." : "Find the principal.";
      const frames = [
        `For the same sum and the same rate over 2 years, the simple interest is ${money(state.simpleInterest2)} and the compound interest is ${money(state.compoundInterest2)}. ${ask}`,
        `A 2-year investment gives SI = ${money(state.simpleInterest2)} and CI = ${money(state.compoundInterest2)} at one annual rate. ${ask}`,
        `${table([["Simple interest for 2 years", money(state.simpleInterest2)], ["Compound interest for 2 years", money(state.compoundInterest2)]])}\n\nBoth refer to the same principal and annual rate. ${ask}`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-102": {
      const other = state.knownYears === 2 ? 3 : 2;
      const frames = [
        `At ${percent(state.ratePercent)} per annum, the CI−SI difference for ${state.knownYears} years is ${money(state.knownDifference)}. Find the CI−SI difference for ${other} years.`,
        `For the same principal at ${percent(state.ratePercent)} annually, CI exceeds SI by ${money(state.knownDifference)} after ${state.knownYears} years. By how much will CI exceed SI after ${other} years?`,
        `The ${state.knownYears}-year SI–CI difference is ${money(state.knownDifference)} at ${percent(state.ratePercent)} per annum. Determine the corresponding ${other}-year difference.`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-103":
    case "INT-QL-104": {
      const ask = state.qlId === "INT-QL-103" ? "Find the annual rate." : "Find the principal.";
      const frames = [
        `For the same principal and annual rate, CI exceeds SI by ${money(state.difference2)} in 2 years and by ${money(state.difference3)} in 3 years. ${ask}`,
        `The SI–CI differences on one sum are ${money(state.difference2)} after 2 years and ${money(state.difference3)} after 3 years. ${ask}`,
        `${table([["CI−SI after 2 years", money(state.difference2)], ["CI−SI after 3 years", money(state.difference3)]])}\n\nThe principal and annual rate are unchanged. ${ask}`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-105":
    case "INT-QL-106": {
      const next = state.yearNumber + 1;
      const ask = state.qlId === "INT-QL-105" ? "Find the annual compound-interest rate." : "Find the original principal.";
      const frames = [
        `The interest earned in year ${state.yearNumber} is ${money(state.earlierInterest)}, and in year ${next} it is ${money(state.laterInterest)} under annual compounding. ${ask}`,
        `Under one fixed annual compound rate, the ${state.yearNumber}${state.yearNumber === 1 ? "st" : state.yearNumber === 2 ? "nd" : "rd"}-year interest is ${money(state.earlierInterest)} and the next year's interest is ${money(state.laterInterest)}. ${ask}`,
        `${table([[`Interest in year ${state.yearNumber}`, money(state.earlierInterest)], [`Interest in year ${next}`, money(state.laterInterest)]])}\n\nThe annual compound rate is constant. ${ask}`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-107": {
      const frames = [
        `On ${money(state.principal)} at ${percent(state.ratePercent)} per annum, after how many complete years will the difference between CI and SI first reach at least ${money(state.targetDifference)}?`,
        `${money(state.principal)} is considered under simple and annual compound interest at ${percent(state.ratePercent)}. Find the first complete year when CI exceeds SI by ${money(state.targetDifference)} or more.`,
        `At ${percent(state.ratePercent)} per annum on ${money(state.principal)}, determine the earliest whole year for which CI−SI is at least ${money(state.targetDifference)}.`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-108": {
      const frames = [
        `At ${percent(state.ratePercent)} compound interest, the interest earned in the second year exceeds that of the first year by ${money(state.secondYearExcess)}. Find the first-year interest.`,
        `The second-year compound interest is ${money(state.secondYearExcess)} more than the first-year interest at ${percent(state.ratePercent)} per annum. What was the interest in year 1?`,
        `Under annual compounding at ${percent(state.ratePercent)}, J₂−J₁ = ${money(state.secondYearExcess)}. Find J₁.`,
      ]; markdown = frames[template]!; break;
    }
  }
  return deepFreeze({ markdown, prompt: markdown, representation: representationFor(state.qlId, template), stemFamilyId: `${state.qlId}-T${template + 1}` });
}

function explanation(state: IntCp006State, answer: Rational, semantic: IntCp006AnswerSemantic) {
  let keyIdea = "";
  let steps: string[] = [];
  let commonMistake = "Do not replace compound accumulation with simple addition of annual rates.";
  switch (state.qlId) {
    case "INT-QL-096":
      keyIdea = `For 2 years, \\(CI-SI=P(r/100)^2\\).`;
      steps = [`\\(D_2=${money(state.principal)}\\times(${percent(state.ratePercent)}/100)^2=${money(answer)}\\).`];
      commonMistake = "Do not multiply the two-year simple interest by the rate; that doubles the required excess.";
      break;
    case "INT-QL-097": {
      const d2 = siCiDifference(state.principal, state.ratePercent, 2);
      keyIdea = `For 3 years, \\(D_3=D_2(3+r/100)\\).`;
      steps = [`First, \\(D_2=${money(d2)}\\).`, `Then \\(D_3=${money(d2)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\).`];
      commonMistake = "Using only 3D₂ drops the cubic compounding term.";
      break;
    }
    case "INT-QL-098":
      keyIdea = `Use \\(D_2=P(r/100)^2\\) and solve for P.`;
      steps = [`\\(P=${money(state.difference2)}\\div(${percent(state.ratePercent)}/100)^2=${money(answer)}\\).`];
      commonMistake = "The two-year excess contains the square of the rate, not one rate factor.";
      break;
    case "INT-QL-099":
      keyIdea = `The observed two-year excess must satisfy \\(D_2=P(r/100)^2\\).`;
      steps = [`Among the exact admissible rates, ${percent(answer)} reproduces ${money(state.difference2)} on ${money(state.principal)}.`];
      commonMistake = "Do not treat D₂/P itself as the percentage rate; it equals the square of the decimal rate.";
      break;
    case "INT-QL-100": {
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      keyIdea = `For 2 years, \\(D_2/SI_2=r/2\\).`;
      steps = [`\\(D_2=${money(state.compoundInterest2)}-${money(state.simpleInterest2)}=${money(difference)}\\).`, `\\(r=2D_2/SI_2=2\\times${money(difference)}\\div${money(state.simpleInterest2)}=${percent(answer)}\\).`];
      commonMistake = "Dividing D₂ by SI₂ without the factor 2 gives half the rate.";
      break;
    }
    case "INT-QL-101": {
      const ratePercent = rateFromSiCi(state.simpleInterest2, state.compoundInterest2);
      keyIdea = "First recover the rate from the SI–CI excess, then use the 2-year SI relation.";
      steps = [`The annual rate is ${percent(ratePercent)}.`, `\\(P=SI_2\\times100/(2r)=${money(state.simpleInterest2)}\\times100/(2\\times${decimal(ratePercent)})=${money(answer)}\\).`];
      commonMistake = "Compound interest is not the quantity to substitute into the simple-interest formula.";
      break;
    }
    case "INT-QL-102": {
      const other = state.knownYears === 2 ? 3 : 2;
      keyIdea = `Use \\(D_3=D_2(3+r/100)\\) for the same principal and rate.`;
      steps = [state.knownYears === 2 ? `\\(D_3=${money(state.knownDifference)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\).` : `\\(D_2=${money(state.knownDifference)}\\div(3+${percent(state.ratePercent)}/100)=${money(answer)}\\).`, `Therefore the ${other}-year difference is ${money(answer)}.`];
      commonMistake = "Multiplying or dividing by exactly 3 ignores the cubic term.";
      break;
    }
    case "INT-QL-103":
      keyIdea = `Since \\(D_3/D_2=3+r/100\\), the principal cancels.`;
      steps = [`\\(r=100(D_3/D_2-3)=100(${money(state.difference3)}\\div${money(state.difference2)}-3)=${percent(answer)}\\).`];
      commonMistake = "Subtract 3 before converting the remaining decimal to a percentage.";
      break;
    case "INT-QL-104": {
      const ratePercent = rateFromD2D3(state.difference2, state.difference3);
      keyIdea = "Use D₃/D₂ to recover the rate, then D₂ to recover the principal.";
      steps = [`From the ratio of differences, the annual rate is ${percent(ratePercent)}.`, `\\(P=D_2/(r/100)^2=${money(state.difference2)}\\div(${percent(ratePercent)}/100)^2=${money(answer)}\\).`];
      commonMistake = "D₃ cannot be substituted into the two-year identity D₂=P(r/100)².";
      break;
    }
    case "INT-QL-105":
      keyIdea = `Consecutive yearly compound interests satisfy \\(J_{k+1}=J_k(1+r/100)\\).`;
      steps = [`\\(r=100(J_{k+1}/J_k-1)=100(${money(state.laterInterest)}\\div${money(state.earlierInterest)}-1)=${percent(answer)}\\).`];
      commonMistake = "Use the earlier year's interest as the base; dividing the excess by the later interest understates the rate.";
      break;
    case "INT-QL-106": {
      const ratePercent = rateFromConsecutiveInterests(state.earlierInterest, state.laterInterest);
      keyIdea = "The ratio of consecutive yearly interests gives the rate; then reverse the earlier yearly-interest factor to the principal.";
      steps = [`The annual rate is ${percent(ratePercent)}.`, `\\(J_k=P(r/100)(1+r/100)^{k-1}\\), so the principal is ${money(answer)}.`];
      commonMistake = "For k>1, Jₖ is not the first-year interest; it already contains earlier compounding.";
      break;
    }
    case "INT-QL-107": {
      const year = Number(answer.numerator);
      const previous = ledgerObservations(state.principal, state.ratePercent, year - 1).difference;
      const current = ledgerObservations(state.principal, state.ratePercent, year).difference;
      keyIdea = "Check CI and SI year by year and stop at the first difference that reaches the target.";
      steps = [`After ${year - 1} years, CI−SI = ${money(previous)}, which is below ${money(state.targetDifference)}.`, `After ${year} years, CI−SI = ${money(current)}, so the first crossing occurs in ${yearText(year)}.`];
      commonMistake = "The question asks for the first crossing year, not merely any later year above the target.";
      break;
    }
    case "INT-QL-108":
      keyIdea = `Because \\(J_2-J_1=J_1(r/100)\\), the excess is r% of the first-year interest.`;
      steps = [`\\(J_1=${money(state.secondYearExcess)}\\div(${percent(state.ratePercent)}/100)=${money(answer)}\\).`];
      commonMistake = "Do not split the excess equally between two years; it arises from interest on the first year's interest.";
      break;
  }
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer: formatAnswer(answer, semantic), commonMistake });
}

export interface IntCp006Option {
  readonly text: string;
  readonly value: Rational;
  readonly misconceptionId: "CORRECT" | string;
}
export interface IntCp006Question {
  readonly id: string;
  readonly runtimeVersion: typeof INT_CP006_RUNTIME_VERSION;
  readonly checkpointId: "INT-CP-006";
  readonly qlId: IntCp006QlId;
  readonly locale: "en-IN";
  readonly seed: string;
  readonly mathematicalState: IntCp006State;
  readonly answerSemantic: IntCp006AnswerSemantic;
  readonly presentation: Readonly<{ markdown: string; prompt: string; representation: IntCp006Representation; stemFamilyId: string }>;
  readonly options: readonly IntCp006Option[];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly correctAnswer: string;
  readonly explanation: Readonly<{ keyIdea: string; steps: readonly string[]; finalAnswer: string; commonMistake: string }>;
  readonly mathematicalFingerprint: string;
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

function stateFingerprint(state: IntCp006State): string {
  return `${state.qlId}|${Object.entries(state).filter(([name]) => name !== "qlId").map(([name, value]) => {
    if (typeof value === "object" && value && "numerator" in value) return `${name}=${key(value as Rational)}`;
    return `${name}=${String(value)}`;
  }).join("|")}`;
}

export function generateIntCp006Question(qlId: IntCp006QlId, seed: string, locale: "en-IN" = "en-IN"): IntCp006Question {
  if (locale !== "en-IN") throw new Error("CP006 v1 review authority is English-only");
  const mathematicalState = constructIntCp006State(qlId, seed);
  const semantic = answerSemantic(qlId);
  const answer = solveIntCp006(mathematicalState);
  if (!positiveVisible(answer)) throw new Error(`${qlId}/${seed}: answer is not positive/displayable: ${key(answer)}`);
  if (!verifyIntCp006Answer(mathematicalState, answer)) throw new Error(`${qlId}/${seed}: independent verifier rejected canonical answer`);
  const wrong = distractors(mathematicalState, answer);
  const correctIndex = (hash(`${seed}:cp006:correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(deepFreeze({ text: formatAnswer(answer, semantic), value: answer, misconceptionId: "CORRECT" }));
    else {
      const item = wrong[wrongIndex++]!;
      options.push(deepFreeze({ text: formatAnswer(item.value, semantic), value: item.value, misconceptionId: item.misconceptionId }));
    }
  }
  const question = deepFreeze({
    id: `${qlId}:${seed}`,
    runtimeVersion: INT_CP006_RUNTIME_VERSION,
    checkpointId: "INT-CP-006" as const,
    qlId,
    locale,
    seed,
    mathematicalState,
    answerSemantic: semantic,
    presentation: presentation(mathematicalState, seed),
    options: Object.freeze(options),
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: explanation(mathematicalState, answer, semantic),
    mathematicalFingerprint: `${stateFingerprint(mathematicalState)}|answer=${key(answer)}`,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });
  return question;
}

export const INT_CP006_LEGACY_RECOVERY = Object.freeze({
  recovered: Object.freeze([
    "int_ci_si_difference_2_years", "int_ci_si_difference_3_years", "int_rate_from_ci_si_diff_2y",
    "int_principal_from_ci_si_diff_2y", "int_si_ci_amount_difference",
  ] as const),
  amountDifferenceDisposition: "PRESENTATION_VARIANT_OF_SAME_SI_CI_DIFFERENCE" as const,
  cp003CollisionExclusions: Object.freeze(["INT-QL-059", "INT-QL-060", "INT-QL-061", "INT-QL-066"] as const),
});
