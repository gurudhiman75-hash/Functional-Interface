import { createHash } from "node:crypto";
import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";

export const INT_CP010_DISCOVERY_VERSION = "INT-CP-010-MIXED-SYSTEMS-DISCOVERY-WAVE01-v1" as const;
export const INT_CP010_PROTOTYPE_IDS = Object.freeze([
  "INT-CP010-PROT-001",
  "INT-CP010-PROT-002",
  "INT-CP010-PROT-003",
  "INT-CP010-PROT-004",
] as const);
export type IntCp010PrototypeId = (typeof INT_CP010_PROTOTYPE_IDS)[number];

export const INT_CP010_SOURCE_LINEAGE = Object.freeze({
  legacyMixedFamilies: Object.freeze([
    "int_hybrid_si_ci_crossover",
    "int_si_ci_mixed_condition_inverse",
  ] as const),
  inheritedReassignment: "INT-CP009-S17-variable-or-mixed-rates-across-cash-flow-ledger" as const,
  provisionalOwner: "INT-CP-010" as const,
  permanentQlCount: 0 as const,
  nextPotentialQlIdentity: "INT-QL-130" as const,
  nextPotentialQlIdentityReserved: false as const,
});

export type IntCp010AnswerSemantic = "MONEY" | "RATE_PERCENT";
export type IntCp010PeriodUnit = "YEAR";

type HybridForwardState = Readonly<{
  prototypeId: "INT-CP010-PROT-001";
  principal: Rational;
  simpleRatePercent: Rational;
  simpleYears: number;
  compoundRatesPercent: readonly Rational[];
}>;

type HybridInverseState = Readonly<{
  prototypeId: "INT-CP010-PROT-002";
  principal: Rational;
  simpleRatePercent: Rational;
  simpleYears: number;
  compoundYears: number;
  finalAmount: Rational;
  candidateCompoundRatesPercent: readonly Rational[];
}>;

type VariableEqualInstalmentState = Readonly<{
  prototypeId: "INT-CP010-PROT-003";
  openingDebt: Rational;
  periodRatesPercent: readonly Rational[];
}>;

type VariableRepaymentOpeningDebtState = Readonly<{
  prototypeId: "INT-CP010-PROT-004";
  periodRatesPercent: readonly Rational[];
  repayments: readonly Rational[];
}>;

export type IntCp010PrototypeState =
  | HybridForwardState
  | HybridInverseState
  | VariableEqualInstalmentState
  | VariableRepaymentOpeningDebtState;

export type IntCp010Option = Readonly<{
  value: Rational;
  text: string;
  misconceptionId: string;
  isCorrect: boolean;
}>;

const RATE_LIBRARY = Object.freeze([rat(10n), rat(15n), rat(20n), rat(25n)] as const);
const SIMPLE_RATE_LIBRARY = Object.freeze([rat(5n), rat(8n), rat(10n), rat(12n), rat(15n)] as const);
const VARIABLE_RATE_SEQUENCES = Object.freeze([
  Object.freeze([rat(10n), rat(20n), rat(10n)] as const),
  Object.freeze([rat(10n), rat(25n), rat(20n)] as const),
  Object.freeze([rat(15n), rat(10n), rat(20n)] as const),
  Object.freeze([rat(20n), rat(10n), rat(25n)] as const),
  Object.freeze([rat(25n), rat(10n), rat(15n)] as const),
  Object.freeze([rat(20n), rat(15n), rat(10n)] as const),
] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[hash(`${seed}:${salt}`) % values.length]!;
}

function numericTail(seed: string) {
  const match = seed.match(/:(\d+)$/u);
  return match ? Number(match[1]) : hash(`${seed}:numeric-tail`);
}

function rateFactor(ratePercent: Rational) {
  return add(rat(1n), div(ratePercent, rat(100n)));
}

function simpleAmount(principal: Rational, ratePercent: Rational, years: number) {
  return mul(principal, add(rat(1n), div(mul(ratePercent, rat(BigInt(years))), rat(100n))));
}

function compoundVariable(principal: Rational, ratesPercent: readonly Rational[]) {
  return ratesPercent.reduce((balance, rate) => mul(balance, rateFactor(rate)), principal);
}

function hybridAmount(principal: Rational, simpleRatePercent: Rational, simpleYears: number, compoundRatesPercent: readonly Rational[]) {
  return compoundVariable(simpleAmount(principal, simpleRatePercent, simpleYears), compoundRatesPercent);
}

function variableDebtBalance(openingDebt: Rational, repayments: readonly Rational[], ratesPercent: readonly Rational[]) {
  if (repayments.length !== ratesPercent.length) throw new Error("CP010 repayment/rate length mismatch");
  let balance = openingDebt;
  for (let index = 0; index < ratesPercent.length; index += 1) {
    balance = sub(mul(balance, rateFactor(ratesPercent[index]!)), repayments[index]!);
  }
  return balance;
}

function openingDebtFromVariableRepayments(repayments: readonly Rational[], ratesPercent: readonly Rational[]) {
  if (repayments.length !== ratesPercent.length) throw new Error("CP010 repayment/rate length mismatch");
  let balanceAfter = rat(0n);
  for (let index = ratesPercent.length - 1; index >= 0; index -= 1) {
    balanceAfter = div(add(balanceAfter, repayments[index]!), rateFactor(ratesPercent[index]!));
  }
  return balanceAfter;
}

function equalInstalmentForVariableRates(openingDebt: Rational, ratesPercent: readonly Rational[]) {
  let suffix = rat(1n);
  let weight = rat(0n);
  for (let index = ratesPercent.length - 1; index >= 0; index -= 1) {
    weight = add(weight, suffix);
    suffix = mul(suffix, rateFactor(ratesPercent[index]!));
  }
  return div(mul(openingDebt, suffix), weight);
}

function openingDebtForEqualInstalment(instalment: Rational, ratesPercent: readonly Rational[]) {
  return openingDebtFromVariableRepayments(ratesPercent.map(() => instalment), ratesPercent);
}

function factorNumeratorProduct(ratesPercent: readonly Rational[]) {
  return ratesPercent.reduce((product, rate) => product * rateFactor(rate).numerator, 1n);
}

export function constructIntCp010DiscoveryState(prototypeId: IntCp010PrototypeId, seed: string): IntCp010PrototypeState {
  const tail = numericTail(seed);
  switch (prototypeId) {
    case "INT-CP010-PROT-001": {
      const principal = rat(10_000n * BigInt(4 + (hash(`${seed}:p001:principal`) % 17)));
      const simpleRatePercent = pick(SIMPLE_RATE_LIBRARY, seed, "p001:simple-rate");
      const simpleYears = 1 + (hash(`${seed}:p001:simple-years`) % 2);
      const sequence = pick(VARIABLE_RATE_SEQUENCES, seed, "p001:compound-sequence");
      const compoundRatesPercent = Object.freeze(sequence.slice(0, 1 + (hash(`${seed}:p001:compound-years`) % 2)));
      return deepFreeze({ prototypeId, principal, simpleRatePercent, simpleYears, compoundRatesPercent });
    }
    case "INT-CP010-PROT-002": {
      const principal = rat(10_000n * BigInt(5 + (hash(`${seed}:p002:principal`) % 16)));
      const simpleRatePercent = pick(SIMPLE_RATE_LIBRARY, seed, "p002:simple-rate");
      const simpleYears = 1 + (hash(`${seed}:p002:simple-years`) % 2);
      const compoundYears = 1 + (hash(`${seed}:p002:compound-years`) % 2);
      const hiddenRate = RATE_LIBRARY[tail % RATE_LIBRARY.length]!;
      const finalAmount = hybridAmount(principal, simpleRatePercent, simpleYears, Array.from({ length: compoundYears }, () => hiddenRate));
      return deepFreeze({
        prototypeId,
        principal,
        simpleRatePercent,
        simpleYears,
        compoundYears,
        finalAmount,
        candidateCompoundRatesPercent: RATE_LIBRARY,
      });
    }
    case "INT-CP010-PROT-003": {
      const periodRatesPercent = VARIABLE_RATE_SEQUENCES[tail % VARIABLE_RATE_SEQUENCES.length]!;
      const scale = BigInt(55 + (hash(`${seed}:p003:scale`) % 111));
      const instalment = rat(factorNumeratorProduct(periodRatesPercent) * scale);
      const openingDebt = openingDebtForEqualInstalment(instalment, periodRatesPercent);
      if (openingDebt.denominator !== 1n) throw new Error(`${prototypeId}/${seed}: friendly opening debt construction failed`);
      return deepFreeze({ prototypeId, openingDebt, periodRatesPercent });
    }
    case "INT-CP010-PROT-004": {
      const periodRatesPercent = VARIABLE_RATE_SEQUENCES[tail % VARIABLE_RATE_SEQUENCES.length]!;
      const scale = BigInt(45 + (hash(`${seed}:p004:scale`) % 91));
      const base = factorNumeratorProduct(periodRatesPercent) * scale;
      const coefficientSets = Object.freeze([
        Object.freeze([1n, 2n, 1n] as const),
        Object.freeze([2n, 1n, 2n] as const),
        Object.freeze([1n, 3n, 2n] as const),
        Object.freeze([2n, 2n, 3n] as const),
      ] as const);
      const coefficients = coefficientSets[hash(`${seed}:p004:coefficients`) % coefficientSets.length]!;
      const repayments = Object.freeze(coefficients.map((coefficient) => rat(base * coefficient)));
      const openingDebt = openingDebtFromVariableRepayments(repayments, periodRatesPercent);
      if (openingDebt.denominator !== 1n) throw new Error(`${prototypeId}/${seed}: friendly opening debt construction failed`);
      return deepFreeze({ prototypeId, periodRatesPercent, repayments });
    }
  }
}

export function solveIntCp010Discovery(state: IntCp010PrototypeState): Rational {
  switch (state.prototypeId) {
    case "INT-CP010-PROT-001":
      return hybridAmount(state.principal, state.simpleRatePercent, state.simpleYears, state.compoundRatesPercent);
    case "INT-CP010-PROT-002": {
      const matches = state.candidateCompoundRatesPercent.filter((candidate) =>
        eq(
          hybridAmount(state.principal, state.simpleRatePercent, state.simpleYears, Array.from({ length: state.compoundYears }, () => candidate)),
          state.finalAmount,
        ),
      );
      if (matches.length !== 1) throw new Error(`${state.prototypeId}: expected one exact compound rate, found ${matches.length}`);
      return matches[0]!;
    }
    case "INT-CP010-PROT-003":
      return equalInstalmentForVariableRates(state.openingDebt, state.periodRatesPercent);
    case "INT-CP010-PROT-004":
      return openingDebtFromVariableRepayments(state.repayments, state.periodRatesPercent);
  }
}

export function verifyIntCp010DiscoveryAnswer(state: IntCp010PrototypeState, candidate: Rational): boolean {
  switch (state.prototypeId) {
    case "INT-CP010-PROT-001": {
      const yearlySimpleInterest = div(mul(state.principal, state.simpleRatePercent), rat(100n));
      let balance = state.principal;
      for (let year = 0; year < state.simpleYears; year += 1) balance = add(balance, yearlySimpleInterest);
      for (const rate of state.compoundRatesPercent) balance = mul(balance, rateFactor(rate));
      return eq(balance, candidate);
    }
    case "INT-CP010-PROT-002":
      return state.candidateCompoundRatesPercent.some((allowed) => eq(allowed, candidate))
        && eq(
          hybridAmount(state.principal, state.simpleRatePercent, state.simpleYears, Array.from({ length: state.compoundYears }, () => candidate)),
          state.finalAmount,
        );
    case "INT-CP010-PROT-003":
      return eq(variableDebtBalance(state.openingDebt, state.periodRatesPercent.map(() => candidate), state.periodRatesPercent), rat(0n));
    case "INT-CP010-PROT-004":
      return eq(variableDebtBalance(candidate, state.repayments, state.periodRatesPercent), rat(0n));
  }
}

export function answerSemanticForIntCp010Prototype(prototypeId: IntCp010PrototypeId): IntCp010AnswerSemantic {
  return prototypeId === "INT-CP010-PROT-002" ? "RATE_PERCENT" : "MONEY";
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
  const p = paise % 100n;
  const body = p === 0n ? indianInteger(rupees) : `${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${body}`;
}

function percent(value: Rational): string {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

function ratesText(rates: readonly Rational[]) {
  return rates.map(percent).join(", ");
}

function familyIndex(seed: string) {
  return numericTail(seed) % 3;
}

function promptFor(state: IntCp010PrototypeState, seed: string) {
  const index = familyIndex(seed);
  const stemFamilyId = `${state.prototypeId}-W1-T${index + 1}`;
  switch (state.prototypeId) {
    case "INT-CP010-PROT-001": {
      const transition = money(simpleAmount(state.principal, state.simpleRatePercent, state.simpleYears));
      const variants = [
        `A sum of ${money(state.principal)} earns simple interest at ${percent(state.simpleRatePercent)} p.a. for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. The amount then earns compound interest at successive annual rates ${ratesText(state.compoundRatesPercent)}. Find the final amount.`,
        `${money(state.principal)} is first kept at ${percent(state.simpleRatePercent)} simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. The resulting amount is then compounded for ${state.compoundRatesPercent.length} year${state.compoundRatesPercent.length === 1 ? "" : "s"} at ${ratesText(state.compoundRatesPercent)} respectively. What is the maturity amount?`,
        `An investment grows to ${transition} after its simple-interest stage. It originally was ${money(state.principal)} at ${percent(state.simpleRatePercent)} p.a. simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. It then faces annual compound rates ${ratesText(state.compoundRatesPercent)}. Determine the final value.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP010-PROT-002": {
      const variants = [
        `A sum of ${money(state.principal)} earns ${percent(state.simpleRatePercent)} p.a. simple interest for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. That amount is then compounded annually at a fixed rate for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"} and becomes ${money(state.finalAmount)}. Find the compound rate.`,
        `${money(state.principal)} first remains at simple interest of ${percent(state.simpleRatePercent)} for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}. After switching to annual compound interest for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}, the balance is ${money(state.finalAmount)}. Which compound rate was used?`,
        `An account changes method after ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"}: before the change it earns ${percent(state.simpleRatePercent)} simple interest on ${money(state.principal)}, and afterwards it compounds for ${state.compoundYears} year${state.compoundYears === 1 ? "" : "s"}. If the final amount is ${money(state.finalAmount)}, determine the later annual rate.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP010-PROT-003": {
      const variants = [
        `A loan of ${money(state.openingDebt)} is repaid by three equal end-of-year instalments. The interest rates for years 1, 2 and 3 are ${ratesText(state.periodRatesPercent)} respectively. Find each instalment.`,
        `A debt of ${money(state.openingDebt)} carries changing annual compound rates of ${ratesText(state.periodRatesPercent)} over the next three years. It is cleared by the same payment at the end of each year. What is that payment?`,
        `Three equal annual repayments exactly clear a loan of ${money(state.openingDebt)}. The reducing balance is charged at ${ratesText(state.periodRatesPercent)} in successive years. Determine the equal repayment.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP010-PROT-004": {
      const payments = state.repayments.map((value, i) => `${money(value)} at the end of year ${i + 1}`).join(", ");
      const variants = [
        `A loan is exactly cleared by repayments of ${payments}. The annual compound rates in years 1, 2 and 3 are ${ratesText(state.periodRatesPercent)} respectively. Find the amount originally borrowed.`,
        `Repayments of ${payments} settle a debt completely. If the reducing balance is charged at successive annual rates ${ratesText(state.periodRatesPercent)}, what was the opening debt?`,
        `A borrower follows the unequal repayment schedule ${payments}. The rate changes each year to ${ratesText(state.periodRatesPercent)}. Determine the loan balance immediately before the first year's interest is charged.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
  }
}

function constantRateEqualInstalment(openingDebt: Rational, rate: Rational, periods: number) {
  return equalInstalmentForVariableRates(openingDebt, Array.from({ length: periods }, () => rate));
}

function constantRateOpeningDebt(repayments: readonly Rational[], rate: Rational) {
  return openingDebtFromVariableRepayments(repayments, repayments.map(() => rate));
}

function uniqueMoneyDistractors(correct: Rational, candidates: readonly { value: Rational; misconceptionId: string }[], seed: string) {
  const result: { value: Rational; misconceptionId: string }[] = [];
  const seen = new Set([stable(correct)]);
  for (const candidate of candidates) {
    const key = stable(candidate.value);
    if (candidate.value.numerator > 0n && !seen.has(key)) { seen.add(key); result.push(candidate); }
    if (result.length === 3) break;
  }
  let offset = 1;
  while (result.length < 3) {
    const step = rat(500n * BigInt(2 + ((numericTail(seed) + offset) % 9)));
    const candidate = add(correct, mul(step, rat(BigInt(offset))));
    const key = stable(candidate);
    if (!seen.has(key)) { seen.add(key); result.push({ value: candidate, misconceptionId: "ARITHMETIC_NEAR_MISS" }); }
    offset += 1;
  }
  return result;
}

function optionsFor(state: IntCp010PrototypeState, answer: Rational, seed: string): readonly IntCp010Option[] {
  if (state.prototypeId === "INT-CP010-PROT-002") {
    const desired = numericTail(seed) % 4;
    const distractors = state.candidateCompoundRatesPercent.filter((rate) => !eq(rate, answer));
    const ordered = [...distractors];
    ordered.splice(desired, 0, answer);
    return Object.freeze(ordered.map((value) => deepFreeze({
      value,
      text: percent(value),
      misconceptionId: eq(value, answer) ? "CORRECT" : "BOUNDED_RATE_ALTERNATIVE",
      isCorrect: eq(value, answer),
    })));
  }

  let candidates: readonly { value: Rational; misconceptionId: string }[];
  switch (state.prototypeId) {
    case "INT-CP010-PROT-001": {
      const totalYears = state.simpleYears + state.compoundRatesPercent.length;
      candidates = [
        { value: simpleAmount(state.principal, state.simpleRatePercent, totalYears), misconceptionId: "KEEP_SIMPLE_FOR_ALL_PERIODS" },
        { value: compoundVariable(state.principal, Array.from({ length: totalYears }, () => state.compoundRatesPercent[0]!)), misconceptionId: "COMPOUND_FROM_DAY_ONE" },
        { value: simpleAmount(state.principal, state.simpleRatePercent, state.simpleYears), misconceptionId: "STOP_AT_METHOD_CHANGE" },
      ];
      break;
    }
    case "INT-CP010-PROT-003":
      candidates = [
        { value: div(state.openingDebt, rat(BigInt(state.periodRatesPercent.length))), misconceptionId: "IGNORE_INTEREST" },
        { value: constantRateEqualInstalment(state.openingDebt, state.periodRatesPercent[0]!, state.periodRatesPercent.length), misconceptionId: "USE_FIRST_RATE_FOR_ALL_YEARS" },
        { value: constantRateEqualInstalment(state.openingDebt, state.periodRatesPercent.at(-1)!, state.periodRatesPercent.length), misconceptionId: "USE_LAST_RATE_FOR_ALL_YEARS" },
      ];
      break;
    case "INT-CP010-PROT-004":
      candidates = [
        { value: state.repayments.reduce((sum, value) => add(sum, value), rat(0n)), misconceptionId: "ADD_FUTURE_PAYMENTS_WITHOUT_DISCOUNTING" },
        { value: constantRateOpeningDebt(state.repayments, state.periodRatesPercent[0]!), misconceptionId: "USE_FIRST_RATE_FOR_ALL_YEARS" },
        { value: constantRateOpeningDebt(state.repayments, state.periodRatesPercent.at(-1)!), misconceptionId: "USE_LAST_RATE_FOR_ALL_YEARS" },
      ];
      break;
  }
  const distractors = uniqueMoneyDistractors(answer, candidates!, seed);
  const desired = numericTail(seed) % 4;
  const values = distractors.map((entry) => entry.value);
  values.splice(desired, 0, answer);
  return Object.freeze(values.map((value) => {
    const correct = eq(value, answer);
    const source = distractors.find((entry) => eq(entry.value, value));
    return deepFreeze({
      value,
      text: money(value),
      misconceptionId: correct ? "CORRECT" : source?.misconceptionId ?? "ARITHMETIC_NEAR_MISS",
      isCorrect: correct,
    });
  }));
}

function explanationFor(state: IntCp010PrototypeState, answer: Rational) {
  switch (state.prototypeId) {
    case "INT-CP010-PROT-001": {
      const transition = simpleAmount(state.principal, state.simpleRatePercent, state.simpleYears);
      const stages: string[] = [];
      let balance = transition;
      state.compoundRatesPercent.forEach((rate, index) => {
        const next = mul(balance, rateFactor(rate));
        stages.push(`Compound year ${index + 1}: ${money(balance)} × ${rateFactor(rate).numerator}/${rateFactor(rate).denominator} = ${money(next)}`);
        balance = next;
      });
      return deepFreeze({
        keyIdea: "The method change creates two separate stages: simple interest is first computed on the original principal, then compound growth starts from that accumulated amount.",
        steps: Object.freeze([
          `Simple-interest stage: ${money(state.principal)} at ${percent(state.simpleRatePercent)} for ${state.simpleYears} year${state.simpleYears === 1 ? "" : "s"} gives ${money(transition)}.`,
          stages[0]!,
          stages.slice(1).join("; ") || "There is one compound year in this state.",
          `Therefore, the final amount is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP010-PROT-002": {
      const transition = simpleAmount(state.principal, state.simpleRatePercent, state.simpleYears);
      const trials = state.candidateCompoundRatesPercent.map((rate) => {
        const value = compoundVariable(transition, Array.from({ length: state.compoundYears }, () => rate));
        return `${percent(rate)} → ${money(value)}`;
      });
      return deepFreeze({
        keyIdea: "Finish the simple-interest stage first. Then test the bounded compound-rate options exactly against the stated final amount.",
        steps: Object.freeze([
          `After the simple-interest stage the balance is ${money(transition)}.`,
          `Candidate results: ${trials.slice(0, 2).join("; ")}.`,
          `Candidate results: ${trials.slice(2).join("; ")}.`,
          `Only ${percent(answer)} produces ${money(state.finalAmount)}, so the later compound rate is ${percent(answer)}.`,
        ]),
        finalAnswer: percent(answer),
      });
    }
    case "INT-CP010-PROT-003": {
      const factors = state.periodRatesPercent.map(rateFactor);
      return deepFreeze({
        keyIdea: "With changing rates, one ordinary annuity formula with a single rate is invalid. Carry each instalment through the exact sequence of later yearly factors.",
        steps: Object.freeze([
          `Successive growth factors are ${factors.map((factor) => `${factor.numerator}/${factor.denominator}`).join(", ")}.`,
          `For equal payment X, final balance = opening debt × product of all factors − X × (1 + last factor + product of the last two factors).`,
          `Setting the final balance to zero gives X = ${money(answer)}.`,
          `A period-by-period reducing-balance replay with ${money(answer)} each year ends exactly at ₹0.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP010-PROT-004": {
      let balanceAfter = rat(0n);
      const lines: string[] = [];
      for (let index = state.periodRatesPercent.length - 1; index >= 0; index -= 1) {
        const factor = rateFactor(state.periodRatesPercent[index]!);
        const previous = div(add(balanceAfter, state.repayments[index]!), factor);
        lines.push(`Before year ${index + 1}: (${money(balanceAfter)} + ${money(state.repayments[index]!)}) ÷ ${factor.numerator}/${factor.denominator} = ${money(previous)}`);
        balanceAfter = previous;
      }
      return deepFreeze({
        keyIdea: "Work backward from the final zero balance. At each year, add back that year's repayment and then undo that year's own growth factor.",
        steps: Object.freeze([
          lines[0]!,
          lines[1]!,
          lines[2]!,
          `Working back to the start gives the opening debt ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
  }
}

export function buildIntCp010DiscoveryPackage(prototypeId: IntCp010PrototypeId, seed: string) {
  const mathematicalState = constructIntCp010DiscoveryState(prototypeId, seed);
  const answer = solveIntCp010Discovery(mathematicalState);
  if (!verifyIntCp010DiscoveryAnswer(mathematicalState, answer)) throw new Error(`${prototypeId}/${seed}: independent verifier rejected canonical answer`);
  const presentation = promptFor(mathematicalState, seed);
  const options = optionsFor(mathematicalState, answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${prototypeId}/${seed}: invalid correct option ownership`);
  const explanation = explanationFor(mathematicalState, answer);
  const mathematicalFingerprint = createHash("sha256").update(stable({ prototypeId, mathematicalState, answer })).digest("hex");

  return deepFreeze({
    discoveryVersion: INT_CP010_DISCOVERY_VERSION,
    checkpointId: "INT-CP-010" as const,
    prototypeId,
    permanentQlId: null,
    seed,
    sourceLineage: prototypeId === "INT-CP010-PROT-001"
      ? "LEGACY:int_hybrid_si_ci_crossover"
      : prototypeId === "INT-CP010-PROT-002"
        ? "LEGACY:int_si_ci_mixed_condition_inverse"
        : "INHERITED:INT-CP009-S17-variable-or-mixed-rates-across-cash-flow-ledger",
    componentAuthorities: prototypeId === "INT-CP010-PROT-001" || prototypeId === "INT-CP010-PROT-002"
      ? Object.freeze(["INT-CP-001/002:SIMPLE", "INT-CP-003:COMPOUND"] as const)
      : prototypeId === "INT-CP010-PROT-003"
        ? Object.freeze(["INT-CP-005:VARIABLE_RATE", "INT-CP-008:EQUAL_INSTALMENT"] as const)
        : Object.freeze(["INT-CP-005:VARIABLE_RATE", "INT-CP-009:HETEROGENEOUS_DATED_CASH_FLOW"] as const),
    answerSemantic: answerSemanticForIntCp010Prototype(prototypeId),
    mathematicalState,
    mathematicalFingerprint,
    answer,
    presentation,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation,
    difficultyBand: prototypeId === "INT-CP010-PROT-001" ? "Medium" as const : "Hard" as const,
    locale: "en-IN" as const,
    lifecycle: deepFreeze({
      enabled: false as const,
      permanentIdentityAllocated: false as const,
      stagingStatus: "NOT_STAGED" as const,
      registrationStatus: "NOT_REGISTERED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
