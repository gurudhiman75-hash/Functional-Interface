import { add, div, hash, mul, pow, rat, sub, type Rational } from "./cp003-exam-model";
import {
  solveIntCp005,
  verifyIntCp005Answer,
  type IntCp005Option,
  type IntCp005QlId,
  type IntCp005State,
} from "./cp005-variable-growth-decay-runtime";
import { generateIntCp005QuestionV15, type IntCp005QuestionV15 } from "./cp005-variable-growth-decay-runtime-v15";

export const INT_CP005_RUNTIME_VERSION_V16 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v16-en-review" as const;

export const INT_CP005_V16_QL_IDS = Object.freeze([
  "INT-QL-086",
  "INT-QL-087",
  "INT-QL-088",
  "INT-QL-089",
  "INT-QL-090",
  "INT-QL-091",
  "INT-QL-092",
  "INT-QL-093",
  "INT-QL-095",
] as const);

export const INT_CP005_V16_SCOPE_DECISION = Object.freeze({
  status: "ENGLISH_REVIEW_CANDIDATE" as const,
  qlCount: 9 as const,
  excludedQl: "INT-QL-094" as const,
  excludedReason: "Generic percentage growth plus fixed migration/event order has no recovered Interest-family authority.",
  ql086Context: "INVESTMENT_ONLY" as const,
  ql088Context: "INVESTMENT_ONLY" as const,
  productionContextAllowed: false as const,
  salaryContextAllowed: false as const,
  ordinaryOpeningMoneyMin: 10000 as const,
  ordinaryOpeningMoneyMax: 200000 as const,
  normalDurationYears: "2..3" as const,
  questionStudioActivationAuthorized: false as const,
});

export type IntCp005QuestionV16 = Omit<IntCp005QuestionV15, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V16;
};

const GROWTH_PROFILES = Object.freeze([
  Object.freeze([10, 20]), Object.freeze([20, 10]), Object.freeze([25, 20]), Object.freeze([20, 25]),
  Object.freeze([10, 25]), Object.freeze([25, 10]), Object.freeze([5, 20, 25]), Object.freeze([10, 20, 25]),
  Object.freeze([20, 10, 25]), Object.freeze([25, 20, 10]), Object.freeze([10, 10, 20]), Object.freeze([20, 25, 20]),
] as const);
const THREE_YEAR_GROWTH_PROFILES = Object.freeze([
  Object.freeze([5, 20, 25]), Object.freeze([10, 20, 25]), Object.freeze([20, 10, 25]),
  Object.freeze([25, 20, 10]), Object.freeze([10, 10, 20]), Object.freeze([20, 25, 20]),
] as const);
const DECAY_PROFILES = Object.freeze([
  Object.freeze([10, 20]), Object.freeze([20, 10]), Object.freeze([10, 25]), Object.freeze([25, 20]),
  Object.freeze([20, 15]), Object.freeze([15, 20]), Object.freeze([10, 20, 25]), Object.freeze([20, 10, 25]),
  Object.freeze([25, 20, 10]), Object.freeze([15, 10, 20]),
] as const);
const MIXED_PROFILES = Object.freeze([
  Object.freeze([20, -10]), Object.freeze([25, -20]), Object.freeze([10, -20, 25]), Object.freeze([20, -10, 25]),
  Object.freeze([25, -20, 10]), Object.freeze([10, 20, -25]), Object.freeze([-10, 20, 25]), Object.freeze([20, -25, 10]),
] as const);
const PRINCIPALS = Object.freeze([
  10000n, 12000n, 12500n, 15000n, 16000n, 20000n, 25000n, 30000n, 40000n, 50000n,
  60000n, 75000n, 80000n, 100000n, 120000n, 125000n, 150000n, 160000n, 200000n,
]);
const THRESHOLD_PROFILES = Object.freeze([
  Object.freeze({ direction: "GROWTH" as const, rate: 10, year: 2, initial: 10000n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 10, year: 4, initial: 10000n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 20, year: 3, initial: 12500n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 25, year: 2, initial: 16000n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 20, year: 2, initial: 25000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 10, year: 2, initial: 50000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 10, year: 3, initial: 100000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 20, year: 2, initial: 50000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 20, year: 3, initial: 62500n }),
  Object.freeze({ direction: "DECAY" as const, rate: 25, year: 2, initial: 64000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 15, year: 2, initial: 40000n }),
] as const);
const PLAN_PROFILES = Object.freeze([
  Object.freeze({ a: Object.freeze([10, 20, 25]), b: Object.freeze([20, 10, 20]) }),
  Object.freeze({ a: Object.freeze([20, 10, 25]), b: Object.freeze([10, 25, 20]) }),
  Object.freeze({ a: Object.freeze([25, 20, 10]), b: Object.freeze([20, 20, 10]) }),
  Object.freeze({ a: Object.freeze([10, 10, 20]), b: Object.freeze([20, 10, 10]) }),
  Object.freeze({ a: Object.freeze([20, 25, 20]), b: Object.freeze([25, 20, 10]) }),
  Object.freeze({ a: Object.freeze([5, 20, 25]), b: Object.freeze([10, 20, 20]) }),
] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function choose<T>(items: readonly T[], seed: string, label: string): T {
  return items[(hash(`${seed}:cp005-v16:${label}`) >>> 0) % items.length]!;
}
function r(value: number): Rational { return rat(BigInt(value)); }
function growthFactor(value: Rational): Rational { return add(rat(1n), div(value, rat(100n))); }
function decayFactor(value: Rational): Rational { return sub(rat(1n), div(value, rat(100n))); }
function signedFactor(value: Rational): Rational { return value.numerator >= 0n ? growthFactor(value) : decayFactor(rat(-value.numerator, value.denominator)); }
function product(values: readonly Rational[]): Rational { return values.reduce((acc, value) => mul(acc, value), rat(1n)); }
function growthProduct(values: readonly Rational[]): Rational { return product(values.map(growthFactor)); }
function decayProduct(values: readonly Rational[]): Rational { return product(values.map(decayFactor)); }
function signedProduct(values: readonly Rational[]): Rational { return product(values.map(signedFactor)); }
function absRat(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }
function key(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function asRates(values: readonly number[]): readonly Rational[] { return Object.freeze(values.map(r)); }
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`INT-CP-005/V16: non-integral learner value ${key(value)}`);
  return value.numerator;
}
function roundInteger(value: Rational): Rational {
  const sign = value.numerator < 0n ? -1n : 1n;
  const n = value.numerator < 0n ? -value.numerator : value.numerator;
  let q = n / value.denominator;
  if ((n % value.denominator) * 2n >= value.denominator) q += 1n;
  return rat(sign * q);
}
function friendlyInitial(factor: Rational, seed: string, label: string, maxFinal = 300000n): Rational {
  const candidates = PRINCIPALS.filter((principal) => {
    const finalValue = mul(rat(principal), factor);
    return finalValue.denominator === 1n && finalValue.numerator > 0n && finalValue.numerator <= maxFinal;
  });
  if (!candidates.length) throw new Error(`INT-CP-005/V16 ${label}: no friendly principal`);
  return rat(choose(candidates, seed, label));
}

function buildState(qlId: IntCp005QlId, seed: string): IntCp005State {
  switch (qlId) {
    case "INT-QL-086": {
      const rates = asRates(choose(GROWTH_PROFILES, seed, "086-profile"));
      return deepFreeze({ qlId, context: "INVESTMENT", initial: friendlyInitial(growthProduct(rates), seed, "086-principal"), rates });
    }
    case "INT-QL-087": {
      const rates = asRates(choose(GROWTH_PROFILES, seed, "087-profile"));
      return deepFreeze({ qlId, context: "INVESTMENT", initial: friendlyInitial(growthProduct(rates), seed, "087-principal"), rates });
    }
    case "INT-QL-088": {
      const rates = asRates(choose(GROWTH_PROFILES, seed, "088-profile"));
      const initial = friendlyInitial(growthProduct(rates), seed, "088-principal");
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates, finalValue: mul(initial, growthProduct(rates)) });
    }
    case "INT-QL-089": {
      const rates = asRates(choose(THREE_YEAR_GROWTH_PROFILES, seed, "089-profile"));
      const initial = friendlyInitial(growthProduct(rates), seed, "089-principal");
      const missingIndex = (hash(`${seed}:cp005-v16:089-missing`) >>> 0) % 3;
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates, missingIndex, finalValue: mul(initial, growthProduct(rates)) });
    }
    case "INT-QL-090": {
      const decayRates = asRates(choose(DECAY_PROFILES, seed, "090-profile"));
      const initial = friendlyInitial(decayProduct(decayRates), seed, "090-value");
      return deepFreeze({ qlId, context: choose(["MACHINE", "VEHICLE"] as const, seed, "090-context"), initial, decayRates });
    }
    case "INT-QL-091": {
      const decayRates = asRates(choose(DECAY_PROFILES, seed, "091-profile"));
      const initial = friendlyInitial(decayProduct(decayRates), seed, "091-value");
      return deepFreeze({
        qlId,
        context: choose(["MACHINE", "VEHICLE"] as const, seed, "091-context"),
        initial,
        decayRates,
        finalValue: mul(initial, decayProduct(decayRates)),
      });
    }
    case "INT-QL-092": {
      const signedRates = asRates(choose(MIXED_PROFILES, seed, "092-profile"));
      return deepFreeze({ qlId, context: "ASSET", initial: friendlyInitial(signedProduct(signedRates), seed, "092-value"), signedRates });
    }
    case "INT-QL-093": {
      const profile = choose(THRESHOLD_PROFILES, seed, "093-profile");
      const initial = rat(profile.initial);
      const rate = r(profile.rate);
      const factor = profile.direction === "GROWTH" ? growthFactor(rate) : decayFactor(rate);
      const threshold = mul(initial, pow(factor, profile.year));
      if (threshold.denominator !== 1n) throw new Error(`${qlId}/${seed}: non-integral threshold`);
      return deepFreeze({
        qlId,
        context: profile.direction === "GROWTH" ? "POPULATION" : "ASSET",
        initial,
        rate,
        direction: profile.direction,
        threshold,
        targetYear: profile.year,
      });
    }
    case "INT-QL-095": {
      const profile = choose(PLAN_PROFILES, seed, "095-profile");
      const planARates = asRates(profile.a);
      const planBRates = asRates(profile.b);
      const aFactor = growthProduct(planARates);
      const bFactor = growthProduct(planBRates);
      const candidates = PRINCIPALS.filter((principal) => {
        const a = mul(rat(principal), aFactor);
        const b = mul(rat(principal), bFactor);
        const difference = absRat(sub(a, b));
        return a.denominator === 1n && b.denominator === 1n && difference.denominator === 1n
          && a.numerator <= 300000n && b.numerator <= 300000n && difference.numerator > 0n;
      });
      if (!candidates.length) throw new Error(`${qlId}/${seed}: no friendly plan principal`);
      return deepFreeze({ qlId, context: "INVESTMENT", initial: rat(choose(candidates, seed, "095-principal")), planARates, planBRates });
    }
    case "INT-QL-094":
      throw new Error("INT-QL-094 is outside INT-CP-005 V16 learner scope.");
  }
}

function indian(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return sign + source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function money(value: Rational): string { return `₹${indian(integer(value))}`; }
function percent(value: Rational): string { return `${integer(value)}%`; }
function ordinal(index: number): string { return ["1st", "2nd", "3rd"][index] ?? `${index + 1}th`; }
function joinNatural(items: readonly string[]): string {
  return items.length <= 1 ? items[0] ?? "" : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
function schedule(rates: readonly Rational[]): string {
  return joinNatural(rates.map((value, index) => `${percent(value)} in the ${ordinal(index)} year`));
}
function signedSchedule(rates: readonly Rational[]): string {
  return joinNatural(rates.map((value, index) => `${percent(absRat(value))} ${value.numerator >= 0n ? "increase" : "decrease"} in the ${ordinal(index)} year`));
}
function objectName(context: IntCp005State["context"]): string { return context === "MACHINE" ? "machine" : context === "VEHICLE" ? "vehicle" : "asset"; }

function presentation(state: IntCp005State): IntCp005QuestionV15["presentation"] {
  let markdown: string;
  switch (state.qlId) {
    case "INT-QL-086":
      markdown = `${money(state.initial)} is invested at annual compound rates of ${schedule(state.rates)}. What will the amount be after ${state.rates.length} years?`;
      break;
    case "INT-QL-087":
      markdown = `${money(state.initial)} is invested at annual compound rates of ${schedule(state.rates)}. Find the compound interest earned in ${state.rates.length} years.`;
      break;
    case "INT-QL-088":
      markdown = `An amount becomes ${money(state.finalValue)} after ${state.rates.length} years at annual compound rates of ${schedule(state.rates)}. What was the principal?`;
      break;
    case "INT-QL-089": {
      const shown = state.rates.map((value, index) => index === state.missingIndex ? "?" : percent(value));
      markdown = `${money(state.initial)} becomes ${money(state.finalValue)} in 3 years at annual compound interest. The yearly rates are ${shown.join(", ")}. What is the missing rate?`;
      break;
    }
    case "INT-QL-090":
      markdown = `A ${objectName(state.context)} worth ${money(state.initial)} depreciates by ${schedule(state.decayRates)}. What will its value be after ${state.decayRates.length} years?`;
      break;
    case "INT-QL-091":
      markdown = `After ${state.decayRates.length} years, a ${objectName(state.context)} is worth ${money(state.finalValue)}. Its yearly depreciation rates were ${schedule(state.decayRates)}. What was its original value?`;
      break;
    case "INT-QL-092":
      markdown = `An asset is worth ${money(state.initial)}. Its value changes by ${signedSchedule(state.signedRates)}. What is its value after ${state.signedRates.length} years?`;
      break;
    case "INT-QL-093":
      markdown = state.direction === "GROWTH"
        ? `A town has ${indian(integer(state.initial))} people and its population grows by ${percent(state.rate)} each year. After how many complete years will it first reach at least ${indian(integer(state.threshold))}?`
        : `An asset is worth ${money(state.initial)} and depreciates by ${percent(state.rate)} each year. After how many complete years will its value first fall to ${money(state.threshold)} or below?`;
      break;
    case "INT-QL-095": {
      const headers = Object.freeze(["Year", "Plan A", "Plan B"]);
      const rows = Object.freeze(state.planARates.map((value, index) => Object.freeze([`${index + 1}`, percent(value), percent(state.planBRates[index]!)])));
      markdown = `The same sum of ${money(state.initial)} is invested for 3 years under the two compound-interest plans shown below. By how much will their final amounts differ?`;
      return deepFreeze({ markdown, prompt: markdown, table: deepFreeze({ headers, rows }) });
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
  return deepFreeze({ markdown, prompt: markdown });
}

interface WrongOption { readonly value: Rational; readonly id: string; readonly feedback: string; }
function distinct(correct: Rational, candidates: readonly WrongOption[]): readonly WrongOption[] {
  const used = new Set([key(correct)]);
  const output: WrongOption[] = [];
  for (const candidate of candidates) {
    const value = candidate.value.denominator === 1n ? candidate.value : roundInteger(candidate.value);
    if (value.numerator > 0n && !used.has(key(value))) {
      output.push(deepFreeze({ ...candidate, value }));
      used.add(key(value));
    }
    if (output.length === 3) return Object.freeze(output);
  }
  let delta = 1n;
  while (output.length < 3) {
    const fallback = rat(integer(correct) + delta);
    if (fallback.numerator > 0n && !used.has(key(fallback))) {
      output.push(deepFreeze({ value: fallback, id: "NEARBY_ARITHMETIC", feedback: "This nearby value comes from an arithmetic slip." }));
      used.add(key(fallback));
    }
    delta += 1n;
  }
  return Object.freeze(output);
}
function distractors(state: IntCp005State, solution: Rational): readonly WrongOption[] {
  switch (state.qlId) {
    case "INT-QL-086": {
      const sum = state.rates.reduce((acc, value) => add(acc, value), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sum, rat(100n))));
      const omit = mul(state.initial, growthProduct(state.rates.slice(0, -1)));
      const halfGain = add(state.initial, div(sub(solution, state.initial), rat(2n)));
      return distinct(solution, [
        { value: linear, id: "ADD_RATES", feedback: "This adds the rates as if every year acted on the original principal." },
        { value: omit, id: "OMIT_LAST_YEAR", feedback: "The last year's compound factor has been omitted." },
        { value: halfGain, id: "PARTIAL_GAIN", feedback: "Only part of the compound gain has been included." },
      ]);
    }
    case "INT-QL-087": {
      const amount = add(state.initial, solution);
      const sum = state.rates.reduce((acc, value) => add(acc, value), rat(0n));
      const simpleGain = mul(state.initial, div(sum, rat(100n)));
      const omitGain = sub(mul(state.initial, growthProduct(state.rates.slice(0, -1))), state.initial);
      return distinct(solution, [
        { value: amount, id: "FINAL_AMOUNT", feedback: "This is the final amount, not the compound interest." },
        { value: simpleGain, id: "ADD_RATES", feedback: "This treats all yearly rates as simple additions on the original principal." },
        { value: omitGain, id: "OMIT_LAST_YEAR", feedback: "The last year's compound factor has been omitted." },
      ]);
    }
    case "INT-QL-088": {
      const sum = state.rates.reduce((acc, value) => add(acc, value), rat(0n));
      return distinct(solution, [
        { value: state.finalValue, id: "NO_REVERSE", feedback: "The final amount has not been reversed to the principal." },
        { value: div(mul(state.finalValue, rat(100n)), add(rat(100n), sum)), id: "LINEAR_REVERSE", feedback: "This reverses the combined percentage linearly instead of dividing by each compound factor." },
        { value: div(state.finalValue, growthFactor(state.rates[state.rates.length - 1]!)), id: "ONE_FACTOR_REVERSE", feedback: "Only the last year's factor has been reversed." },
      ]);
    }
    case "INT-QL-089": {
      const answer = integer(solution);
      return distinct(solution, [
        { value: rat(answer + 5n), id: "RATE_PLUS_5", feedback: "This nearby rate does not reproduce the stated final amount." },
        { value: rat(answer > 5n ? answer - 5n : answer + 10n), id: "RATE_MINUS_5", feedback: "This nearby rate does not reproduce the stated final amount." },
        { value: rat(answer + 10n), id: "RATE_PLUS_10", feedback: "This nearby rate does not reproduce the stated final amount." },
      ]);
    }
    case "INT-QL-090": {
      const sum = state.decayRates.reduce((acc, value) => add(acc, value), rat(0n));
      return distinct(solution, [
        { value: mul(state.initial, sub(rat(1n), div(sum, rat(100n)))), id: "ADD_DECAY_RATES", feedback: "This subtracts all depreciation rates from the original value at once." },
        { value: mul(state.initial, decayProduct(state.decayRates.slice(0, -1))), id: "OMIT_LAST_YEAR", feedback: "The last year's depreciation has been omitted." },
        { value: mul(state.initial, growthProduct(state.decayRates)), id: "GROWTH_INSTEAD", feedback: "Depreciation has been treated as growth." },
      ]);
    }
    case "INT-QL-091": {
      const sum = state.decayRates.reduce((acc, value) => add(acc, value), rat(0n));
      return distinct(solution, [
        { value: state.finalValue, id: "NO_REVERSE", feedback: "The depreciated value has not been reversed to the original value." },
        { value: div(mul(state.finalValue, rat(100n)), sub(rat(100n), sum)), id: "LINEAR_REVERSE", feedback: "This reverses all depreciation rates linearly instead of factor by factor." },
        { value: div(state.finalValue, decayFactor(state.decayRates[state.decayRates.length - 1]!)), id: "ONE_FACTOR_REVERSE", feedback: "Only one depreciation factor has been reversed." },
      ]);
    }
    case "INT-QL-092": {
      const sum = state.signedRates.reduce((acc, value) => add(acc, value), rat(0n));
      return distinct(solution, [
        { value: mul(state.initial, add(rat(1n), div(sum, rat(100n)))), id: "ADD_SIGNED_RATES", feedback: "This combines all percentage changes linearly." },
        { value: mul(state.initial, growthProduct(state.signedRates.map(absRat))), id: "ALL_INCREASE", feedback: "A decrease has been treated as an increase." },
        { value: mul(state.initial, signedProduct(state.signedRates.slice(0, -1))), id: "OMIT_LAST_CHANGE", feedback: "The final year's change has been omitted." },
      ]);
    }
    case "INT-QL-093": {
      const year = state.targetYear;
      return distinct(solution, [
        { value: rat(BigInt(Math.max(1, year - 1))), id: "ONE_YEAR_EARLY", feedback: "The threshold has not yet been crossed." },
        { value: rat(BigInt(year + 1)), id: "ONE_YEAR_LATE", feedback: "The threshold was already crossed one year earlier." },
        { value: rat(BigInt(year + 2)), id: "TWO_YEARS_LATE", feedback: "The threshold was already crossed earlier." },
      ]);
    }
    case "INT-QL-095": {
      const a = mul(state.initial, growthProduct(state.planARates));
      const b = mul(state.initial, growthProduct(state.planBRates));
      const sumA = state.planARates.reduce((acc, value) => add(acc, value), rat(0n));
      const sumB = state.planBRates.reduce((acc, value) => add(acc, value), rat(0n));
      const linearDifference = mul(state.initial, div(absRat(sub(sumA, sumB)), rat(100n)));
      return distinct(solution, [
        { value: a, id: "PLAN_A_FINAL", feedback: "This is Plan A's final amount, not the difference." },
        { value: b, id: "PLAN_B_FINAL", feedback: "This is Plan B's final amount, not the difference." },
        { value: linearDifference, id: "ADD_PLAN_RATES", feedback: "This compares the plans by adding yearly rates instead of compounding them." },
      ]);
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
}
function answerText(value: Rational, state: IntCp005State): string {
  if (state.qlId === "INT-QL-089") return percent(value);
  if (state.qlId === "INT-QL-093") return `${integer(value)} ${integer(value) === 1n ? "year" : "years"}`;
  return money(value);
}
function options(state: IntCp005State, solution: Rational, correctIndex: number): readonly IntCp005Option[] {
  const wrong = distractors(state, solution);
  const result: IntCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      result.push(deepFreeze({ text: answerText(solution, state), value: solution, misconceptionId: "CORRECT", studentFeedback: "Correct.", isCorrect: true }));
    } else {
      const candidate = wrong[wrongIndex++]!;
      result.push(deepFreeze({ text: answerText(candidate.value, state), value: candidate.value, misconceptionId: candidate.id, studentFeedback: candidate.feedback, isCorrect: false }));
    }
  }
  return Object.freeze(result);
}

function math(value: Rational): string { return integer(value).toString(); }
function factor(value: Rational, sign: "+" | "-" = "+"): string { return `\\left(1${sign}\\frac{${math(absRat(value))}}{100}\\right)`; }
function explanation(state: IntCp005State, solution: Rational): IntCp005QuestionV15["explanation"] {
  const steps: string[] = [];
  let keyIdea: string;
  let commonMistake: string;
  switch (state.qlId) {
    case "INT-QL-086":
      keyIdea = "Each year's rate acts on the updated amount.";
      steps.push(`Formula: \\(A=P\\prod(1+r_k/100)\\).`);
      steps.push(`Substitution: \\(A=${math(state.initial)}\\times${state.rates.map((value) => factor(value)).join("\\times")}=${math(solution)}\\).`);
      commonMistake = "Adding the rates assumes every year acts on the original principal.";
      break;
    case "INT-QL-087": {
      keyIdea = "Find the compound amount first, then subtract the principal.";
      const amount = add(state.initial, solution);
      steps.push(`\\(A=${math(state.initial)}\\times${state.rates.map((value) => factor(value)).join("\\times")}=${math(amount)}\\).`);
      steps.push(`\\(CI=${math(amount)}-${math(state.initial)}=${math(solution)}\\).`);
      commonMistake = "Do not report the final amount when the question asks for compound interest.";
      break;
    }
    case "INT-QL-088":
      keyIdea = "Reverse every yearly compound factor.";
      steps.push(`Formula: \\(P=\\frac{A}{\\prod(1+r_k/100)}\\).`);
      steps.push(`Substitution: \\(P=\\frac{${math(state.finalValue)}}{${state.rates.map((value) => factor(value)).join("\\times")}}=${math(solution)}\\).`);
      commonMistake = "Subtracting the rates from the final amount does not reverse compounding.";
      break;
    case "INT-QL-089": {
      keyIdea = "Multiply the known yearly factors and isolate the missing factor.";
      const known = state.rates.filter((_value, index) => index !== state.missingIndex);
      steps.push(`\\(A=P\\times K\\times\\left(1+\\frac{x}{100}\\right)\\).`);
      steps.push(`\\(1+\\frac{x}{100}=\\frac{${math(state.finalValue)}}{${math(state.initial)}\\times${known.map((value) => factor(value)).join("\\times")}}\\).`);
      steps.push(`\\(x=${math(solution)}\\%\\).`);
      commonMistake = "Do not use simple interest; the known yearly factors must be multiplied.";
      break;
    }
    case "INT-QL-090":
      keyIdea = "Depreciation is applied successively to the reduced value.";
      steps.push(`\\(V=${math(state.initial)}\\times${state.decayRates.map((value) => factor(value, "-")).join("\\times")}=${math(solution)}\\).`);
      commonMistake = "Adding depreciation percentages treats every decrease as if it were on the original value.";
      break;
    case "INT-QL-091":
      keyIdea = "Reverse every depreciation factor to recover the original value.";
      steps.push(`\\(P=\\frac{${math(state.finalValue)}}{${state.decayRates.map((value) => factor(value, "-")).join("\\times")}}=${math(solution)}\\).`);
      commonMistake = "Do not reverse the total percentage linearly.";
      break;
    case "INT-QL-092":
      keyIdea = "Use a growth factor for an increase and a decay factor for a decrease.";
      steps.push(`\\(V=${math(state.initial)}\\times${state.signedRates.map((value) => factor(value, value.numerator >= 0n ? "+" : "-")).join("\\times")}=${math(solution)}\\).`);
      commonMistake = "A decrease must use a factor below 1; it cannot be treated as another increase.";
      break;
    case "INT-QL-093": {
      keyIdea = "Check the first year in which the threshold is crossed.";
      const f = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const previous = mul(state.initial, pow(f, state.targetYear - 1));
      const current = mul(state.initial, pow(f, state.targetYear));
      const sign = state.direction === "GROWTH" ? "+" : "-";
      steps.push(`\\(V_t=V_0\\left(1${sign}\\frac{r}{100}\\right)^t\\).`);
      steps.push(`\\(V_{${state.targetYear - 1}}=${math(previous)},\\quad V_{${state.targetYear}}=${math(current)}\\).`);
      commonMistake = "A later year may satisfy the threshold, but the question asks for the first crossing year.";
      break;
    }
    case "INT-QL-095": {
      keyIdea = "Compound each plan separately, then compare the final amounts.";
      const a = mul(state.initial, growthProduct(state.planARates));
      const b = mul(state.initial, growthProduct(state.planBRates));
      steps.push(`\\(A=${math(state.initial)}\\times${state.planARates.map((value) => factor(value)).join("\\times")}=${math(a)}\\).`);
      steps.push(`\\(B=${math(state.initial)}\\times${state.planBRates.map((value) => factor(value)).join("\\times")}=${math(b)}\\).`);
      steps.push(`\\(|A-B|=${math(solution)}\\).`);
      commonMistake = "Do not compare plans by simply adding their yearly rates.";
      break;
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
  const finalAnswer = answerText(solution, state);
  steps.push(`Therefore, the answer is ${finalAnswer}.`);
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer, commonMistake });
}

function fingerprint(state: IntCp005State): string {
  return JSON.stringify(state, (_key, value) => typeof value === "bigint" ? `${value}n` : value) + "|V16_EXAM_REALISM";
}

export function generateIntCp005QuestionV16(qlId: IntCp005QlId, seed: string, locale: "en-IN" = "en-IN"): IntCp005QuestionV16 {
  if (locale !== "en-IN") throw new Error("INT-CP-005 V16 is an English review candidate; Hindi/Punjabi remain on V15 until approval.");
  if (qlId === "INT-QL-094") throw new Error("INT-QL-094 is excluded from INT-CP-005 V16 learner authority.");
  const source = generateIntCp005QuestionV15(qlId, seed, "en-IN");
  const mathematicalState = buildState(qlId, seed);
  const solution = solveIntCp005(mathematicalState);
  if (!verifyIntCp005Answer(mathematicalState, solution)) throw new Error(`${qlId}/${seed}: independent verifier failed`);
  if (solution.denominator !== 1n) throw new Error(`${qlId}/${seed}: correct answer is not a learner-friendly integer`);
  const optionList = options(mathematicalState, solution, source.correctIndex);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V16,
    locale: "en-IN",
    mathematicalState,
    mathematicalFingerprint: fingerprint(mathematicalState),
    answerSemantic: qlId === "INT-QL-089" ? "RATE_PERCENT" : qlId === "INT-QL-093" ? "TIME_YEARS" : qlId === "INT-QL-095" ? "DIFFERENCE" : "MONEY",
    representation: qlId === "INT-QL-095" ? "COMPARISON_TABLE" : "STANDARD_PROSE",
    presentation: presentation(mathematicalState),
    options: optionList,
    correctIndex: source.correctIndex,
    correctAnswer: optionList[source.correctIndex]!.text,
    solution,
    explanation: explanation(mathematicalState, solution),
  });
}
