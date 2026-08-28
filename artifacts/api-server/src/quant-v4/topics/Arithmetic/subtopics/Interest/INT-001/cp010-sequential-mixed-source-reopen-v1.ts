import { createHash } from "node:crypto";
import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";

export const INT_CP010_SEQUENTIAL_REOPEN_VERSION = "INT-CP-010-SEQUENTIAL-MIXED-SOURCE-REOPEN-v1" as const;

export const INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES = Object.freeze([
  "INT-CP010-REOPEN-PROT-001",
  "INT-CP010-REOPEN-PROT-002",
  "INT-CP010-REOPEN-PROT-003",
  "INT-CP010-REOPEN-PROT-004",
] as const);
export type IntCp010SequentialReopenPrototypeId = (typeof INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES)[number];

export const INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY = Object.freeze({
  sourceBackedReopen: true as const,
  permanentQlAllocationAuthorized: false as const,
  currentPermanentQlCount: 130 as const,
  currentNextFreeQl: "INT-QL-132" as const,
  currentNextFreeQlReserved: false as const,
  sourceDirections: Object.freeze([
    Object.freeze({
      authorityId: "EXT-IBPS-CLERK-MAINS-2021-SI-THEN-CI",
      prototypeId: "INT-CP010-REOPEN-PROT-001",
      semantic: "SI stage followed by CI stage; solve final amount",
    }),
    Object.freeze({
      authorityId: "EXT-SBI-CLERK-MAINS-2019-CI-THEN-SI",
      prototypeId: "INT-CP010-REOPEN-PROT-002",
      semantic: "CI stage followed by SI stage; solve final amount",
    }),
    Object.freeze({
      authorityId: "EXT-SBI-CLERK-2014-SEQUENTIAL-INVERSE",
      prototypeId: "INT-CP010-REOPEN-PROT-003",
      semantic: "sequential SI/CI stages; final amount known; recover opening principal",
    }),
    Object.freeze({
      authorityId: "EXT-SBI-CLERK-2022-SI-BORROW-CI-LEND-INVERSE",
      prototypeId: "INT-CP010-REOPEN-PROT-004",
      semantic: "same principal under SI borrowing and CI lending; known net gain; recover principal",
    }),
  ] as const),
  historicalHoldCorrection: Object.freeze({
    oldHoldWasValidAgainstLegacyCodeAuthority: true as const,
    oldHoldIsNotEvidenceThatTheExamSemanticDoesNotExist: true as const,
    priorHeldPrototype: "INT-CP010-PROT-001" as const,
  }),
});

type StageOrder = "SI_THEN_CI" | "CI_THEN_SI";

type SequentialForwardState = Readonly<{
  prototypeId: "INT-CP010-REOPEN-PROT-001" | "INT-CP010-REOPEN-PROT-002";
  stageOrder: StageOrder;
  principal: Rational;
  simpleRatePercent: Rational;
  simpleYears: number;
  compoundRatePercent: Rational;
  compoundYears: number;
}>;

type SequentialInverseState = Readonly<{
  prototypeId: "INT-CP010-REOPEN-PROT-003";
  stageOrder: StageOrder;
  principal: Rational;
  simpleRatePercent: Rational;
  simpleYears: number;
  compoundRatePercent: Rational;
  compoundYears: number;
  finalAmount: Rational;
}>;

type SchemeSpreadInverseState = Readonly<{
  prototypeId: "INT-CP010-REOPEN-PROT-004";
  principal: Rational;
  borrowSimpleRatePercent: Rational;
  lendNominalCompoundRatePercent: Rational;
  years: number;
  compoundPeriodsPerYear: 1 | 2;
  netGain: Rational;
}>;

export type IntCp010SequentialReopenState = SequentialForwardState | SequentialInverseState | SchemeSpreadInverseState;

export type IntCp010SequentialReopenOption = Readonly<{
  value: Rational;
  text: string;
  misconceptionId: string;
  isCorrect: boolean;
}>;

const SIMPLE_RATES = Object.freeze([rat(5n), rat(8n), rat(10n), rat(12n), rat(15n)] as const);
const COMPOUND_RATES = Object.freeze([rat(10n), rat(12n), rat(15n), rat(20n)] as const);
const PRINCIPALS = Object.freeze([
  rat(8_000n), rat(10_000n), rat(12_000n), rat(15_000n), rat(20_000n), rat(24_000n),
  rat(25_000n), rat(30_000n), rat(40_000n), rat(50_000n), rat(60_000n), rat(80_000n),
] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[hash(`${seed}:${salt}`) % values.length]!;
}

function rateFactor(ratePercent: Rational) {
  return add(rat(1n), div(ratePercent, rat(100n)));
}

function simpleFactor(ratePercent: Rational, years: number) {
  return add(rat(1n), div(mul(ratePercent, rat(BigInt(years))), rat(100n)));
}

function powFactor(base: Rational, exponent: number) {
  let result = rat(1n);
  for (let index = 0; index < exponent; index += 1) result = mul(result, base);
  return result;
}

function compoundFactor(ratePercent: Rational, years: number) {
  return powFactor(rateFactor(ratePercent), years);
}

function nominalCompoundFactor(ratePercent: Rational, years: number, periodsPerYear: 1 | 2) {
  const periodicRate = div(ratePercent, rat(BigInt(periodsPerYear)));
  return powFactor(rateFactor(periodicRate), years * periodsPerYear);
}

function sequentialFactor(state: Pick<SequentialForwardState, "stageOrder" | "simpleRatePercent" | "simpleYears" | "compoundRatePercent" | "compoundYears">) {
  const si = simpleFactor(state.simpleRatePercent, state.simpleYears);
  const ci = compoundFactor(state.compoundRatePercent, state.compoundYears);
  return state.stageOrder === "SI_THEN_CI" ? mul(si, ci) : mul(ci, si);
}

function forwardSequential(state: Pick<SequentialForwardState, "stageOrder" | "principal" | "simpleRatePercent" | "simpleYears" | "compoundRatePercent" | "compoundYears">) {
  return mul(state.principal, sequentialFactor(state));
}

function schemeSpreadGainPerPrincipal(state: Pick<SchemeSpreadInverseState, "borrowSimpleRatePercent" | "lendNominalCompoundRatePercent" | "years" | "compoundPeriodsPerYear">) {
  const borrowedAmountFactor = simpleFactor(state.borrowSimpleRatePercent, state.years);
  const lentAmountFactor = nominalCompoundFactor(state.lendNominalCompoundRatePercent, state.years, state.compoundPeriodsPerYear);
  return sub(lentAmountFactor, borrowedAmountFactor);
}

function constructForwardState(prototypeId: "INT-CP010-REOPEN-PROT-001" | "INT-CP010-REOPEN-PROT-002", seed: string): SequentialForwardState {
  return deepFreeze({
    prototypeId,
    stageOrder: prototypeId === "INT-CP010-REOPEN-PROT-001" ? "SI_THEN_CI" : "CI_THEN_SI",
    principal: pick(PRINCIPALS, seed, `${prototypeId}:principal`),
    simpleRatePercent: pick(SIMPLE_RATES, seed, `${prototypeId}:si-rate`),
    simpleYears: 1 + (hash(`${seed}:${prototypeId}:si-years`) % 3),
    compoundRatePercent: pick(COMPOUND_RATES, seed, `${prototypeId}:ci-rate`),
    compoundYears: 1 + (hash(`${seed}:${prototypeId}:ci-years`) % 3),
  });
}

export function constructIntCp010SequentialReopenState(prototypeId: IntCp010SequentialReopenPrototypeId, seed: string): IntCp010SequentialReopenState {
  switch (prototypeId) {
    case "INT-CP010-REOPEN-PROT-001":
    case "INT-CP010-REOPEN-PROT-002":
      return constructForwardState(prototypeId, seed);
    case "INT-CP010-REOPEN-PROT-003": {
      const principal = pick(PRINCIPALS, seed, "p003:principal");
      const stageOrder: StageOrder = hash(`${seed}:p003:order`) % 2 === 0 ? "SI_THEN_CI" : "CI_THEN_SI";
      const simpleRatePercent = pick(SIMPLE_RATES, seed, "p003:si-rate");
      const simpleYears = 1 + (hash(`${seed}:p003:si-years`) % 3);
      const compoundRatePercent = pick(COMPOUND_RATES, seed, "p003:ci-rate");
      const compoundYears = 1 + (hash(`${seed}:p003:ci-years`) % 3);
      const finalAmount = forwardSequential({ stageOrder, principal, simpleRatePercent, simpleYears, compoundRatePercent, compoundYears });
      return deepFreeze({ prototypeId, stageOrder, principal, simpleRatePercent, simpleYears, compoundRatePercent, compoundYears, finalAmount });
    }
    case "INT-CP010-REOPEN-PROT-004": {
      const principal = pick(PRINCIPALS, seed, "p004:principal");
      const borrowSimpleRatePercent = pick(Object.freeze([rat(3n), rat(4n), rat(5n), rat(6n), rat(8n)] as const), seed, "p004:borrow-rate");
      const lendNominalCompoundRatePercent = pick(Object.freeze([rat(8n), rat(10n), rat(12n), rat(16n)] as const), seed, "p004:lend-rate");
      const years = 1 + (hash(`${seed}:p004:years`) % 3);
      const compoundPeriodsPerYear: 1 | 2 = hash(`${seed}:p004:frequency`) % 2 === 0 ? 1 : 2;
      const gainFactor = schemeSpreadGainPerPrincipal({ borrowSimpleRatePercent, lendNominalCompoundRatePercent, years, compoundPeriodsPerYear });
      if (gainFactor.numerator <= 0n) return constructIntCp010SequentialReopenState(prototypeId, `${seed}:positive-spread`);
      const netGain = mul(principal, gainFactor);
      return deepFreeze({ prototypeId, principal, borrowSimpleRatePercent, lendNominalCompoundRatePercent, years, compoundPeriodsPerYear, netGain });
    }
  }
}

export function solveIntCp010SequentialReopen(state: IntCp010SequentialReopenState): Rational {
  switch (state.prototypeId) {
    case "INT-CP010-REOPEN-PROT-001":
    case "INT-CP010-REOPEN-PROT-002":
      return forwardSequential(state);
    case "INT-CP010-REOPEN-PROT-003":
      return div(state.finalAmount, sequentialFactor(state));
    case "INT-CP010-REOPEN-PROT-004":
      return div(state.netGain, schemeSpreadGainPerPrincipal(state));
  }
}

export function verifyIntCp010SequentialReopen(state: IntCp010SequentialReopenState, candidate: Rational): boolean {
  switch (state.prototypeId) {
    case "INT-CP010-REOPEN-PROT-001":
    case "INT-CP010-REOPEN-PROT-002": {
      let balance = state.principal;
      const simpleAnnualInterest = div(mul(state.principal, state.simpleRatePercent), rat(100n));
      const applySi = () => { for (let year = 0; year < state.simpleYears; year += 1) balance = add(balance, simpleAnnualInterest); };
      const applyCi = () => { for (let year = 0; year < state.compoundYears; year += 1) balance = mul(balance, rateFactor(state.compoundRatePercent)); };
      if (state.stageOrder === "SI_THEN_CI") { applySi(); applyCi(); } else { applyCi(); const siPrincipal = balance; const annual = div(mul(siPrincipal, state.simpleRatePercent), rat(100n)); for (let year = 0; year < state.simpleYears; year += 1) balance = add(balance, annual); }
      return eq(balance, candidate);
    }
    case "INT-CP010-REOPEN-PROT-003":
      return eq(forwardSequential({ ...state, principal: candidate }), state.finalAmount);
    case "INT-CP010-REOPEN-PROT-004": {
      const borrowed = mul(candidate, simpleFactor(state.borrowSimpleRatePercent, state.years));
      const lent = mul(candidate, nominalCompoundFactor(state.lendNominalCompoundRatePercent, state.years, state.compoundPeriodsPerYear));
      return eq(sub(lent, borrowed), state.netGain);
    }
  }
}

function indianInteger(value: bigint): string {
  const negative = value < 0n;
  const source = (negative ? -value : value).toString();
  if (source.length <= 3) return `${negative ? "−" : ""}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${negative ? "−" : ""}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let paise = (numerator * 100n) / value.denominator;
  const remainder = (numerator * 100n) % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  const body = paisePart === 0n ? indianInteger(rupees) : `${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${body}`;
}

function percent(value: Rational): string {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

function stageName(order: StageOrder) {
  return order === "SI_THEN_CI" ? "simple interest first and compound interest afterwards" : "compound interest first and simple interest afterwards";
}

function promptFor(state: IntCp010SequentialReopenState, seed: string) {
  const family = hash(`${seed}:${state.prototypeId}:stem-family`) % 3;
  switch (state.prototypeId) {
    case "INT-CP010-REOPEN-PROT-001": {
      const stems = [
        `${money(state.principal)} is invested at ${percent(state.simpleRatePercent)} p.a. simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. The entire amount is then reinvested at ${percent(state.compoundRatePercent)} p.a. compound interest for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. Find the final amount.`,
        `A person first keeps ${money(state.principal)} at simple interest of ${percent(state.simpleRatePercent)} for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. The maturity amount is then placed at ${percent(state.compoundRatePercent)} compound interest for another ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. What amount is finally received?`,
        `An investment changes from simple to compound interest. It starts with ${money(state.principal)}, earns ${percent(state.simpleRatePercent)} simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}, and the accumulated amount then compounds at ${percent(state.compoundRatePercent)} for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. Determine the final value.`,
      ];
      return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, prompt: stems[family]! });
    }
    case "INT-CP010-REOPEN-PROT-002": {
      const stems = [
        `${money(state.principal)} is first invested at ${percent(state.compoundRatePercent)} p.a. compound interest for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. The whole amount is then kept at ${percent(state.simpleRatePercent)} p.a. simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. Find the final amount.`,
        `A sum of ${money(state.principal)} compounds at ${percent(state.compoundRatePercent)} for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. That maturity amount becomes the principal of a simple-interest investment at ${percent(state.simpleRatePercent)} for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. What is the final value?`,
        `An investment changes from compound to simple interest. Starting with ${money(state.principal)}, it compounds at ${percent(state.compoundRatePercent)} for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}; the accumulated amount then earns ${percent(state.simpleRatePercent)} simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. Determine the final amount.`,
      ];
      return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, prompt: stems[family]! });
    }
    case "INT-CP010-REOPEN-PROT-003": {
      const stems = [
        `A sum is invested with ${stageName(state.stageOrder)}. The simple-interest stage is at ${percent(state.simpleRatePercent)} for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}; the compound-interest stage is at ${percent(state.compoundRatePercent)} for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. The final amount is ${money(state.finalAmount)}. Find the original sum.`,
        `An investment ends at ${money(state.finalAmount)} after two successive stages: ${state.stageOrder === "SI_THEN_CI" ? "simple interest followed by compound interest" : "compound interest followed by simple interest"}. The rates and durations are ${percent(state.simpleRatePercent)} SI for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"} and ${percent(state.compoundRatePercent)} CI for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. What was the opening principal?`,
        `The final maturity value of a two-stage investment is ${money(state.finalAmount)}. One stage uses ${percent(state.simpleRatePercent)} simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"} and the other uses ${percent(state.compoundRatePercent)} compound interest for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}, in the stated order: ${stageName(state.stageOrder)}. Recover the initial investment.`,
      ];
      return Object.freeze({ stemFamilyId: `${state.prototypeId}-${state.stageOrder}-T${family + 1}`, prompt: stems[family]! });
    }
    case "INT-CP010-REOPEN-PROT-004": {
      const frequency = state.compoundPeriodsPerYear === 1 ? "compounded annually" : "compounded half-yearly";
      const stems = [
        `A person borrows a sum at ${percent(state.borrowSimpleRatePercent)} p.a. simple interest and lends the same sum at ${percent(state.lendNominalCompoundRatePercent)} p.a. compound interest, ${frequency}, for ${state.years} year${state.years === 1 ? "" : "s"}. The net gain is ${money(state.netGain)}. Find the sum.`,
        `The same principal is borrowed at ${percent(state.borrowSimpleRatePercent)} simple interest and invested at a nominal ${percent(state.lendNominalCompoundRatePercent)} compound rate ${frequency}. After ${state.years} year${state.years === 1 ? "" : "s"}, the difference between the lending maturity amount and the borrowing amount is ${money(state.netGain)}. Determine the principal.`,
        `A trader finances an investment by borrowing P at ${percent(state.borrowSimpleRatePercent)} simple interest. The same P earns compound interest at ${percent(state.lendNominalCompoundRatePercent)}, ${frequency}. Over ${state.years} year${state.years === 1 ? "" : "s"}, the interest-method spread produces a gain of ${money(state.netGain)}. Find P.`,
      ];
      return Object.freeze({ stemFamilyId: `${state.prototypeId}-${state.compoundPeriodsPerYear}X-T${family + 1}`, prompt: stems[family]! });
    }
  }
}

function misconceptionCandidates(state: IntCp010SequentialReopenState, answer: Rational) {
  switch (state.prototypeId) {
    case "INT-CP010-REOPEN-PROT-001":
    case "INT-CP010-REOPEN-PROT-002": {
      const totalYears = state.simpleYears + state.compoundYears;
      return [
        { value: mul(state.principal, simpleFactor(state.simpleRatePercent, totalYears)), misconceptionId: "KEEP_SIMPLE_FOR_BOTH_STAGES" },
        { value: mul(state.principal, compoundFactor(state.compoundRatePercent, totalYears)), misconceptionId: "KEEP_COMPOUND_FOR_BOTH_STAGES" },
        { value: state.stageOrder === "SI_THEN_CI" ? mul(state.principal, simpleFactor(state.simpleRatePercent, state.simpleYears)) : mul(state.principal, compoundFactor(state.compoundRatePercent, state.compoundYears)), misconceptionId: "STOP_AFTER_FIRST_STAGE" },
      ];
    }
    case "INT-CP010-REOPEN-PROT-003":
      return [
        { value: div(state.finalAmount, simpleFactor(state.simpleRatePercent, state.simpleYears + state.compoundYears)), misconceptionId: "TREAT_ALL_YEARS_AS_SIMPLE" },
        { value: div(state.finalAmount, compoundFactor(state.compoundRatePercent, state.simpleYears + state.compoundYears)), misconceptionId: "TREAT_ALL_YEARS_AS_COMPOUND" },
        { value: div(state.finalAmount, state.stageOrder === "SI_THEN_CI" ? simpleFactor(state.simpleRatePercent, state.simpleYears) : compoundFactor(state.compoundRatePercent, state.compoundYears)), misconceptionId: "UNDO_ONLY_ONE_STAGE" },
      ];
    case "INT-CP010-REOPEN-PROT-004": {
      const lendInterestFactor = sub(nominalCompoundFactor(state.lendNominalCompoundRatePercent, state.years, state.compoundPeriodsPerYear), rat(1n));
      const borrowInterestFactor = sub(simpleFactor(state.borrowSimpleRatePercent, state.years), rat(1n));
      return [
        { value: div(state.netGain, lendInterestFactor), misconceptionId: "IGNORE_BORROWING_INTEREST" },
        { value: div(state.netGain, borrowInterestFactor), misconceptionId: "USE_BORROWING_INTEREST_AS_GAIN_RATE" },
        { value: div(state.netGain, div(sub(state.lendNominalCompoundRatePercent, state.borrowSimpleRatePercent), rat(100n))), misconceptionId: "SUBTRACT_NOMINAL_RATES_ONLY" },
      ];
    }
  }
}

function optionsFor(state: IntCp010SequentialReopenState, answer: Rational, seed: string): readonly IntCp010SequentialReopenOption[] {
  const seen = new Set<string>();
  const key = (value: Rational) => `${value.numerator}/${value.denominator}`;
  seen.add(key(answer));
  const distractors: { value: Rational; misconceptionId: string }[] = [];
  for (const candidate of misconceptionCandidates(state, answer)) {
    if (candidate.value.numerator <= 0n || seen.has(key(candidate.value))) continue;
    seen.add(key(candidate.value));
    distractors.push(candidate);
    if (distractors.length === 3) break;
  }
  for (const [factor, misconceptionId] of [[rat(9n, 10n), "TEN_PERCENT_LOW_FALLBACK"], [rat(11n, 10n), "TEN_PERCENT_HIGH_FALLBACK"], [rat(6n, 5n), "TWENTY_PERCENT_HIGH_FALLBACK"]] as const) {
    if (distractors.length === 3) break;
    const value = mul(answer, factor);
    if (seen.has(key(value))) continue;
    seen.add(key(value));
    distractors.push({ value, misconceptionId });
  }
  const desired = hash(`${seed}:${state.prototypeId}:correct-position`) % 4;
  const arranged = [...distractors];
  arranged.splice(desired, 0, { value: answer, misconceptionId: "CORRECT" });
  return Object.freeze(arranged.map((entry) => deepFreeze({
    value: entry.value,
    text: money(entry.value),
    misconceptionId: entry.misconceptionId,
    isCorrect: eq(entry.value, answer),
  })));
}

function explanationFor(state: IntCp010SequentialReopenState, answer: Rational) {
  switch (state.prototypeId) {
    case "INT-CP010-REOPEN-PROT-001":
    case "INT-CP010-REOPEN-PROT-002": {
      const siFactor = simpleFactor(state.simpleRatePercent, state.simpleYears);
      const ciFactor = compoundFactor(state.compoundRatePercent, state.compoundYears);
      const firstFactor = state.stageOrder === "SI_THEN_CI" ? siFactor : ciFactor;
      const secondFactor = state.stageOrder === "SI_THEN_CI" ? ciFactor : siFactor;
      const afterFirst = mul(state.principal, firstFactor);
      return deepFreeze({
        keyIdea: "Treat the two interest methods as consecutive stages. The maturity amount of stage 1 becomes the principal of stage 2.",
        steps: Object.freeze([
          `Opening principal = ${money(state.principal)}.`,
          `After stage 1: ${money(state.principal)} × ${firstFactor.numerator}/${firstFactor.denominator} = ${money(afterFirst)}.`,
          `After stage 2: ${money(afterFirst)} × ${secondFactor.numerator}/${secondFactor.denominator} = ${money(answer)}.`,
          `Therefore the final amount is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP010-REOPEN-PROT-003": {
      const factor = sequentialFactor(state);
      return deepFreeze({
        keyIdea: "The two stages together form one exact multiplier. Reverse that multiplier to recover the opening principal.",
        steps: Object.freeze([
          `Combined stage factor = ${factor.numerator}/${factor.denominator}.`,
          `Opening principal = ${money(state.finalAmount)} ÷ (${factor.numerator}/${factor.denominator}).`,
          `Opening principal = ${money(answer)}.`,
          `Forward replay through ${stageName(state.stageOrder)} returns exactly ${money(state.finalAmount)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP010-REOPEN-PROT-004": {
      const borrowFactor = simpleFactor(state.borrowSimpleRatePercent, state.years);
      const lendFactor = nominalCompoundFactor(state.lendNominalCompoundRatePercent, state.years, state.compoundPeriodsPerYear);
      const spreadFactor = sub(lendFactor, borrowFactor);
      return deepFreeze({
        keyIdea: "The same principal is used in both schemes, so the net gain equals principal × (lending amount factor − borrowing amount factor).",
        steps: Object.freeze([
          `Borrowing amount factor = ${borrowFactor.numerator}/${borrowFactor.denominator}.`,
          `Lending amount factor = ${lendFactor.numerator}/${lendFactor.denominator}.`,
          `Net-gain factor = ${spreadFactor.numerator}/${spreadFactor.denominator}.`,
          `Principal = ${money(state.netGain)} ÷ (${spreadFactor.numerator}/${spreadFactor.denominator}) = ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
  }
}

export function buildIntCp010SequentialReopenPackage(prototypeId: IntCp010SequentialReopenPrototypeId, seed: string) {
  const state = constructIntCp010SequentialReopenState(prototypeId, seed);
  const answer = solveIntCp010SequentialReopen(state);
  if (!verifyIntCp010SequentialReopen(state, answer)) throw new Error(`${prototypeId}/${seed}: independent verifier rejected canonical answer`);
  const presentation = promptFor(state, seed);
  const options = optionsFor(state, answer, seed);
  if (options.length !== 4 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${prototypeId}/${seed}: invalid option ownership`);
  const explanation = explanationFor(state, answer);
  const fingerprint = createHash("sha256").update(JSON.stringify({ prototypeId, state }, (_key, value) => typeof value === "bigint" ? `${value}n` : value)).digest("hex");
  return deepFreeze({
    prototypeId,
    seed,
    state,
    answer,
    answerSemantic: "MONEY" as const,
    presentation,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation,
    mathematicalFingerprint: fingerprint,
    lifecycle: Object.freeze({
      discoveryOnly: true as const,
      permanentQlAllocated: false as const,
      nextFreeQlReserved: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}
