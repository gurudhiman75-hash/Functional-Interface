import { add, div, eq, hash, mul, pow, rat, sub, type Rational } from "./cp003-exam-model";
import {
  solveIntCp005,
  verifyIntCp005Answer,
  type IntCp005AnswerSemantic,
  type IntCp005Context,
  type IntCp005Option,
  type IntCp005QlId,
  type IntCp005State,
} from "./cp005-variable-growth-decay-runtime";
import {
  generateIntCp005QuestionV16EditorialFinal,
  type IntCp005QuestionV16,
} from "./cp005-variable-growth-decay-runtime-v16-editorial-final";

export const INT_CP005_RUNTIME_VERSION_V16_1 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v16.1-hardening" as const;
export const INT_CP005_V16_1_QL_IDS = Object.freeze([
  "INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-090",
  "INT-QL-091", "INT-QL-092", "INT-QL-093", "INT-QL-095",
] as const);
export const INT_CP005_V16_1_DECISION = Object.freeze({
  status: "MULTILINGUAL_HARDENING_CANDIDATE" as const,
  qlCount: 9 as const,
  excludedQl: "INT-QL-094" as const,
  productionContextAllowed: false as const,
  salaryContextAllowed: false as const,
  variableGrowthContexts: Object.freeze(["INVESTMENT", "POPULATION", "ASSET"] as const),
  stemTemplatesPerQl: 3 as const,
  thresholdYears: "2..5" as const,
  questionStudioActivationAuthorized: false as const,
});

export type IntCp005QuestionV16_1 = Omit<IntCp005QuestionV16, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V16_1;
};

const GROWTH_PROFILES = Object.freeze([
  [5, 10], [5, 20], [5, 25], [8, 25], [10, 12], [10, 20], [10, 25], [10, 30], [12, 25], [15, 20], [15, 25], [20, 25],
  [5, 10, 20], [5, 20, 25], [8, 10, 25], [10, 12, 25], [10, 15, 20], [10, 20, 25], [12, 20, 25], [15, 20, 25], [10, 10, 20], [15, 15, 20],
].map((profile) => Object.freeze(profile)));

const MISSING_RATE_PROFILES = Object.freeze([
  [5, 10, 20], [8, 12, 25], [10, 15, 30], [5, 15, 25], [8, 15, 30], [10, 20, 30], [12, 20, 25], [5, 20, 30],
  [8, 20, 25], [10, 12, 30], [5, 12, 25], [12, 15, 30],
].map((profile) => Object.freeze(profile)));

const DECAY_PROFILES = Object.freeze([
  [5, 10], [5, 20], [8, 20], [10, 15], [10, 20], [10, 25], [12, 20], [15, 20], [15, 25], [20, 25],
  [5, 10, 20], [5, 15, 20], [8, 10, 25], [10, 12, 20], [10, 15, 25], [10, 20, 25], [12, 15, 20], [15, 20, 25],
].map((profile) => Object.freeze(profile)));

const MIXED_PROFILES = Object.freeze([
  [20, -10], [25, -20], [15, -10], [10, -20], [-10, 20], [-20, 25],
  [10, -20, 25], [20, -10, 25], [25, -20, 10], [10, 20, -25], [-10, 20, 25], [20, -25, 10],
  [10, -20, -10], [20, -10, -15], [-10, -20, 25], [15, -20, -10], [25, -10, -20], [20, 10, -25],
].map((profile) => Object.freeze(profile)));

const PLAN_PROFILES = Object.freeze([
  { a: [5, 20, 25], b: [10, 10, 30] },
  { a: [10, 15, 25], b: [10, 20, 20] },
  { a: [5, 15, 30], b: [10, 15, 25] },
  { a: [8, 12, 30], b: [5, 20, 25] },
  { a: [10, 20, 25], b: [15, 20, 20] },
  { a: [5, 25, 30], b: [15, 20, 25] },
  { a: [5, 10, 20], b: [8, 12, 20] },
  { a: [10, 12, 20], b: [8, 15, 25] },
  { a: [10, 20, 30], b: [12, 20, 25] },
  { a: [15, 20, 25], b: [10, 20, 25] },
  { a: [8, 10, 25], b: [12, 15, 20] },
  { a: [5, 15, 25], b: [10, 15, 25] },
  { a: [8, 20, 25], b: [12, 20, 20] },
  { a: [10, 15, 30], b: [12, 20, 25] },
].map((profile) => Object.freeze({ a: Object.freeze(profile.a), b: Object.freeze(profile.b) })));

const VALUE_POOLS: Readonly<Record<"INVESTMENT" | "POPULATION" | "ASSET" | "MACHINE" | "VEHICLE", readonly bigint[]>> = Object.freeze({
  INVESTMENT: Object.freeze([10000n, 12000n, 12500n, 15000n, 16000n, 20000n, 25000n, 30000n, 40000n, 50000n, 60000n, 75000n, 80000n, 100000n, 120000n, 125000n, 150000n, 160000n, 200000n]),
  POPULATION: Object.freeze([10000n, 12500n, 16000n, 20000n, 25000n, 40000n, 50000n, 62500n, 80000n, 100000n, 125000n, 160000n, 200000n, 250000n]),
  ASSET: Object.freeze([25000n, 40000n, 50000n, 62500n, 75000n, 80000n, 100000n, 120000n, 125000n, 150000n, 160000n, 200000n, 250000n, 300000n]),
  MACHINE: Object.freeze([20000n, 25000n, 40000n, 50000n, 62500n, 75000n, 80000n, 100000n, 120000n, 125000n, 150000n, 160000n, 200000n, 250000n, 300000n]),
  VEHICLE: Object.freeze([50000n, 62500n, 75000n, 80000n, 100000n, 120000n, 125000n, 150000n, 160000n, 200000n, 250000n, 300000n]),
});

const THRESHOLD_TOPOLOGIES = Object.freeze([
  ...[2, 3, 4, 5].map((year) => ({ direction: "GROWTH" as const, rate: 10, year, initial: 100000n })),
  ...[2, 3, 4].map((year) => ({ direction: "GROWTH" as const, rate: 20, year, initial: 25000n })),
  ...[2, 3, 4].map((year) => ({ direction: "GROWTH" as const, rate: 25, year, initial: 64000n })),
  ...[2, 3].map((year) => ({ direction: "GROWTH" as const, rate: 5, year, initial: 80000n })),
  ...[2, 3].map((year) => ({ direction: "GROWTH" as const, rate: 15, year, initial: 80000n })),
  ...[2, 3, 4, 5].map((year) => ({ direction: "DECAY" as const, rate: 10, year, initial: 100000n })),
  ...[2, 3, 4].map((year) => ({ direction: "DECAY" as const, rate: 20, year, initial: 62500n })),
  ...[2, 3].map((year) => ({ direction: "DECAY" as const, rate: 25, year, initial: 64000n })),
  ...[2, 3].map((year) => ({ direction: "DECAY" as const, rate: 15, year, initial: 80000n })),
]);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function choose<T>(items: readonly T[], seed: string, label: string): T {
  if (!items.length) throw new Error(`${label}: empty choice pool`);
  return items[(hash(`${seed}:cp005-v16.1:${label}`) >>> 0) % items.length]!;
}
function r(value: number): Rational { return rat(BigInt(value)); }
function abs(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }
function growthFactor(rate: Rational): Rational { return add(rat(1n), div(rate, rat(100n))); }
function decayFactor(rate: Rational): Rational { return sub(rat(1n), div(rate, rat(100n))); }
function signedFactor(rate: Rational): Rational { return rate.numerator >= 0n ? growthFactor(rate) : decayFactor(abs(rate)); }
function product(values: readonly Rational[]): Rational { return values.reduce((acc, value) => mul(acc, value), rat(1n)); }
function growthProduct(rates: readonly Rational[]): Rational { return product(rates.map(growthFactor)); }
function decayProduct(rates: readonly Rational[]): Rational { return product(rates.map(decayFactor)); }
function signedProduct(rates: readonly Rational[]): Rational { return product(rates.map(signedFactor)); }
function asRates(values: readonly number[]): readonly Rational[] { return Object.freeze(values.map(r)); }
function key(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`V16.1 learner value must be integral: ${key(value)}`);
  return value.numerator;
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
function count(value: Rational): string { return indian(integer(value)); }
function percent(value: Rational): string {
  if (value.denominator === 1n) return `${value.numerator}%`;
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator !== 0n) throw new Error(`V16.1 non-terminating visible rate ${key(value)}`);
  const hundredths = scaled / value.denominator;
  const whole = hundredths / 100n;
  const fraction = hundredths % 100n;
  return fraction === 0n ? `${whole}%` : fraction % 10n === 0n ? `${whole}.${fraction / 10n}%` : `${whole}.${fraction.toString().padStart(2, "0")}%`;
}
function yearsText(years: number): string { return years === 1 ? "1 year" : `${years} years`; }
function contextPool(context: IntCp005Context): readonly bigint[] {
  if (context === "INVESTMENT" || context === "POPULATION" || context === "ASSET" || context === "MACHINE" || context === "VEHICLE") return VALUE_POOLS[context];
  throw new Error(`V16.1 rejected context ${context}`);
}
function friendlyInitial(context: IntCp005Context, factor: Rational, seed: string, label: string, maxFinal = 350000n): Rational {
  const candidates = contextPool(context).filter((value) => {
    const final = mul(rat(value), factor);
    return final.denominator === 1n && final.numerator > 0n && final.numerator <= maxFinal;
  });
  if (!candidates.length) throw new Error(`${label}: no exact context-friendly opening value`);
  return rat(choose(candidates, seed, label));
}
function growthContext(seed: string, label: string): "INVESTMENT" | "POPULATION" | "ASSET" {
  return choose(["INVESTMENT", "POPULATION", "ASSET"] as const, seed, label);
}

function thresholdState(seed: string): Extract<IntCp005State, { qlId: "INT-QL-093" }> {
  const topology = choose(THRESHOLD_TOPOLOGIES, seed, "093-topology");
  const rate = r(topology.rate);
  const factor = topology.direction === "GROWTH" ? growthFactor(rate) : decayFactor(rate);
  const initial = rat(topology.initial);
  const previous = mul(initial, pow(factor, topology.year - 1));
  const current = mul(initial, pow(factor, topology.year));
  if (previous.denominator !== 1n || current.denominator !== 1n) throw new Error("V16.1 threshold topology is not integral");
  const exactBoundary = (hash(`${seed}:cp005-v16.1:093-boundary`) & 1) === 0;
  let threshold = current;
  if (!exactBoundary) {
    const prev = integer(previous);
    const curr = integer(current);
    if (topology.direction === "GROWTH") {
      const gap = curr - prev;
      threshold = rat(prev + (gap > 2n ? gap / 2n : 1n));
      if (!(integer(previous) < integer(threshold) && integer(threshold) < integer(current))) throw new Error("V16.1 growth midpoint did not lie between years");
    } else {
      const gap = prev - curr;
      threshold = rat(curr + (gap > 2n ? gap / 2n : 1n));
      if (!(integer(current) < integer(threshold) && integer(threshold) < integer(previous))) throw new Error("V16.1 decay midpoint did not lie between years");
    }
  }
  return deepFreeze({
    qlId: "INT-QL-093",
    context: topology.direction === "GROWTH" ? "POPULATION" : "ASSET",
    initial,
    rate,
    direction: topology.direction,
    threshold,
    targetYear: topology.year,
  });
}

function planState(seed: string): Extract<IntCp005State, { qlId: "INT-QL-095" }> {
  for (let attempt = 0; attempt < PLAN_PROFILES.length * 2; attempt += 1) {
    const profile = PLAN_PROFILES[(hash(`${seed}:cp005-v16.1:095-profile:${attempt}`) >>> 0) % PLAN_PROFILES.length]!;
    const planARates = asRates(profile.a);
    const planBRates = asRates(profile.b);
    const aFactor = growthProduct(planARates);
    const bFactor = growthProduct(planBRates);
    if (eq(aFactor, bFactor)) continue;
    const candidates = VALUE_POOLS.INVESTMENT.filter((p) => {
      const initial = rat(p);
      const a = mul(initial, aFactor);
      const b = mul(initial, bFactor);
      const correct = abs(sub(a, b));
      const linear = mul(initial, div(abs(sub(planARates.reduce((x, y) => add(x, y), rat(0n)), planBRates.reduce((x, y) => add(x, y), rat(0n)))), rat(100n)));
      const prefix = abs(sub(mul(initial, growthProduct(planARates.slice(0, -1))), mul(initial, growthProduct(planBRates.slice(0, -1)))));
      const suffix = abs(sub(mul(initial, growthProduct(planARates.slice(1))), mul(initial, growthProduct(planBRates.slice(1)))));
      const values = [a, b, correct, linear, prefix, suffix];
      return values.every((value) => value.denominator === 1n) && a.numerator <= 350000n && b.numerator <= 350000n && correct.numerator > 0n;
    });
    if (!candidates.length) continue;
    return deepFreeze({ qlId: "INT-QL-095", context: "INVESTMENT", initial: rat(choose(candidates, seed, `095-principal-${attempt}`)), planARates, planBRates });
  }
  throw new Error(`${seed}: unable to build V16.1 plan state`);
}

function buildState(qlId: IntCp005QlId, seed: string): IntCp005State {
  switch (qlId) {
    case "INT-QL-086":
    case "INT-QL-087":
    case "INT-QL-088": {
      const profile = choose(GROWTH_PROFILES, seed, `${qlId}-profile`);
      const rates = asRates(profile);
      const context = qlId === "INT-QL-087" ? "INVESTMENT" as const : growthContext(seed, `${qlId}-context`);
      const initial = friendlyInitial(context, growthProduct(rates), seed, `${qlId}-opening`);
      if (qlId === "INT-QL-086") return deepFreeze({ qlId, context, initial, rates });
      if (qlId === "INT-QL-087") return deepFreeze({ qlId, context, initial, rates });
      return deepFreeze({ qlId, context, initial, rates, finalValue: mul(initial, growthProduct(rates)) });
    }
    case "INT-QL-089": {
      const rates = asRates(choose(MISSING_RATE_PROFILES, seed, "089-profile"));
      const initial = friendlyInitial("INVESTMENT", growthProduct(rates), seed, "089-opening");
      const missingIndex = (hash(`${seed}:cp005-v16.1:089-missing`) >>> 0) % rates.length;
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates, missingIndex, finalValue: mul(initial, growthProduct(rates)) });
    }
    case "INT-QL-090":
    case "INT-QL-091": {
      const decayRates = asRates(choose(DECAY_PROFILES, seed, `${qlId}-profile`));
      const context = choose(["MACHINE", "VEHICLE"] as const, seed, `${qlId}-context`);
      const initial = friendlyInitial(context, decayProduct(decayRates), seed, `${qlId}-opening`, 300000n);
      if (qlId === "INT-QL-090") return deepFreeze({ qlId, context, initial, decayRates });
      return deepFreeze({ qlId, context, initial, decayRates, finalValue: mul(initial, decayProduct(decayRates)) });
    }
    case "INT-QL-092": {
      const signedRates = asRates(choose(MIXED_PROFILES, seed, "092-profile"));
      const initial = friendlyInitial("ASSET", signedProduct(signedRates), seed, "092-opening", 350000n);
      return deepFreeze({ qlId, context: "ASSET", initial, signedRates });
    }
    case "INT-QL-093": return thresholdState(seed);
    case "INT-QL-095": return planState(seed);
    case "INT-QL-094": throw new Error("INT-QL-094 remains outside CP005 V16.1 learner authority.");
  }
}

export function intCp005V16_1StemTemplateId(qlId: IntCp005QlId, seed: string): string {
  if (qlId === "INT-QL-094") return "EXCLUDED";
  return `${qlId}-T${(hash(`${seed}:cp005-v16.1:stem-template`) >>> 0) % 3 + 1}`;
}
function templateIndex(qlId: IntCp005QlId, seed: string): number { return Number(intCp005V16_1StemTemplateId(qlId, seed).slice(-1)) - 1; }
function schedule(rates: readonly Rational[]): string {
  return rates.map((rate, index) => `${percent(rate)} in year ${index + 1}`).join(", ");
}
function signedSchedule(rates: readonly Rational[]): string {
  return rates.map((rate, index) => `${percent(abs(rate))} ${rate.numerator >= 0n ? "increase" : "decrease"} in year ${index + 1}`).join(", ");
}
function subject(context: IntCp005Context): string { return context === "MACHINE" ? "machine" : context === "VEHICLE" ? "vehicle" : "asset"; }
function valueText(value: Rational, context: IntCp005Context): string { return context === "POPULATION" ? count(value) : money(value); }

function presentation(state: IntCp005State, seed: string): IntCp005QuestionV16["presentation"] {
  const t = templateIndex(state.qlId, seed);
  let markdown = "";
  switch (state.qlId) {
    case "INT-QL-086": {
      const opening = valueText(state.initial, state.context);
      const finalLabel = state.context === "POPULATION" ? "population" : state.context === "ASSET" ? "value" : "amount";
      const contextLead = state.context === "POPULATION" ? `A town has a population of ${opening}.` : state.context === "ASSET" ? `A property is worth ${opening}.` : `${opening} is invested.`;
      const s = schedule(state.rates);
      markdown = [
        `${contextLead} It changes at ${s}. What is the ${finalLabel} after ${yearsText(state.rates.length)}?`,
        `${contextLead} The yearly compound growth rates are ${s}. Find the ${finalLabel} at the end of the period.`,
        `${contextLead} Apply the following annual rates successively: ${s}. What will the final ${finalLabel} be?`,
      ][t]!;
      break;
    }
    case "INT-QL-087": {
      const s = schedule(state.rates);
      markdown = [
        `${money(state.initial)} is invested at compound rates of ${s}. Find the compound interest earned in ${yearsText(state.rates.length)}.`,
        `An investment of ${money(state.initial)} earns ${s} under annual compounding. How much compound interest is earned over the whole period?`,
        `The annual compound rates on ${money(state.initial)} are ${s}. Find only the interest earned, not the final amount.`,
      ][t]!;
      break;
    }
    case "INT-QL-088": {
      const final = valueText(state.finalValue, state.context);
      const initialLabel = state.context === "POPULATION" ? "initial population" : state.context === "ASSET" ? "original value" : "principal";
      const contextNoun = state.context === "POPULATION" ? "A town's population" : state.context === "ASSET" ? "A property's value" : "An investment";
      const s = schedule(state.rates);
      markdown = [
        `${contextNoun} becomes ${final} after ${yearsText(state.rates.length)} at ${s}. Find the ${initialLabel}.`,
        `After successive annual rates of ${s}, ${contextNoun.toLowerCase()} is ${final}. What was its ${initialLabel}?`,
        `${contextNoun} reaches ${final} after applying ${s}. Determine the ${initialLabel} before these changes.`,
      ][t]!;
      break;
    }
    case "INT-QL-089": {
      const shown = state.rates.map((rate, index) => index === state.missingIndex ? "?" : percent(rate)).join(", ");
      markdown = [
        `${money(state.initial)} becomes ${money(state.finalValue)} in 3 years at annual compound interest. The yearly rates are ${shown}. Find the missing rate.`,
        `An investment grows from ${money(state.initial)} to ${money(state.finalValue)} in 3 years. The annual compound rates, in order, are ${shown}. What is the unknown rate?`,
        `For a 3-year investment of ${money(state.initial)}, the compound rates are ${shown}, and the final amount is ${money(state.finalValue)}. Determine the missing yearly rate.`,
      ][t]!;
      break;
    }
    case "INT-QL-090": {
      const s = schedule(state.decayRates);
      const noun = subject(state.context);
      markdown = [
        `A ${noun} worth ${money(state.initial)} depreciates at ${s}. What is its value after ${yearsText(state.decayRates.length)}?`,
        `The present value of a ${noun} is ${money(state.initial)}. Its yearly depreciation rates are ${s}. Find its value at the end of the period.`,
        `A ${noun} has an initial value of ${money(state.initial)} and loses value successively at ${s}. What will it be worth finally?`,
      ][t]!;
      break;
    }
    case "INT-QL-091": {
      const s = schedule(state.decayRates);
      const noun = subject(state.context);
      markdown = [
        `After ${yearsText(state.decayRates.length)} of depreciation at ${s}, a ${noun} is worth ${money(state.finalValue)}. What was its original value?`,
        `A ${noun}'s value falls to ${money(state.finalValue)} after yearly depreciation rates of ${s}. Find its value before depreciation began.`,
        `The final value of a ${noun} is ${money(state.finalValue)} after successive depreciation of ${s}. Determine its initial value.`,
      ][t]!;
      break;
    }
    case "INT-QL-092": {
      const s = signedSchedule(state.signedRates);
      markdown = [
        `An asset is worth ${money(state.initial)}. Its value changes by ${s}. What is its value after ${yearsText(state.signedRates.length)}?`,
        `The value of an asset is ${money(state.initial)}. It undergoes ${s}, successively. Find the final value.`,
        `Starting from ${money(state.initial)}, an asset has these yearly changes: ${s}. What will its value be at the end?`,
      ][t]!;
      break;
    }
    case "INT-QL-093": {
      if (state.direction === "GROWTH") {
        markdown = [
          `A town has ${count(state.initial)} people and its population grows by ${percent(state.rate)} each year. After how many complete years will it first reach at least ${count(state.threshold)}?`,
          `The population of a town is ${count(state.initial)} and increases by ${percent(state.rate)} per year. Find the first complete year in which it reaches or exceeds ${count(state.threshold)}.`,
          `A town's population starts at ${count(state.initial)} and grows annually by ${percent(state.rate)}. How many complete years are needed for it to first become at least ${count(state.threshold)}?`,
        ][t]!;
      } else {
        markdown = [
          `An asset worth ${money(state.initial)} depreciates by ${percent(state.rate)} each year. After how many complete years will its value first fall to ${money(state.threshold)} or below?`,
          `An asset has value ${money(state.initial)} and loses ${percent(state.rate)} of its value every year. In which first complete year will its value be at most ${money(state.threshold)}?`,
          `Starting at ${money(state.initial)}, an asset depreciates annually by ${percent(state.rate)}. How many complete years are needed for its value to first become ${money(state.threshold)} or less?`,
        ][t]!;
      }
      break;
    }
    case "INT-QL-095": {
      const headers = Object.freeze(["Year", "Plan A", "Plan B"]);
      const rows = Object.freeze(state.planARates.map((rate, index) => Object.freeze([String(index + 1), percent(rate), percent(state.planBRates[index]!)])));
      const leads = [
        `${money(state.initial)} is invested separately under each of the two compound-interest plans below.`,
        `Two investments of ${money(state.initial)} each follow the annual compound rates shown below.`,
        `The same principal, ${money(state.initial)}, is invested under Plan A and Plan B for three years.`,
      ];
      const prompts = ["By how much do the final amounts differ?", "Find the difference between the two final amounts.", "What is the absolute difference in the amounts after three years?"];
      const table = deepFreeze({ headers, rows });
      markdown = `${leads[t]}\n\n| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n\n${prompts[t]}`;
      return deepFreeze({ markdown, prompt: prompts[t]!, table });
    }
    case "INT-QL-094": throw new Error("INT-QL-094 remains excluded");
  }
  return deepFreeze({ markdown, prompt: markdown });
}

interface Wrong { readonly value: Rational; readonly id: string; readonly feedback: string; }
function distinctExact(correct: Rational, candidates: readonly Wrong[], semantic: IntCp005AnswerSemantic, maxValue?: bigint): readonly Wrong[] {
  const used = new Set([key(correct)]);
  const output: Wrong[] = [];
  for (const candidate of candidates) {
    if (candidate.value.denominator !== 1n || candidate.value.numerator <= 0n) continue;
    if (maxValue !== undefined && candidate.value.numerator >= maxValue) continue;
    const k = key(candidate.value);
    if (used.has(k)) continue;
    if (semantic === "RATE_PERCENT" && candidate.value.numerator >= 60n) continue;
    output.push(deepFreeze(candidate));
    used.add(k);
    if (output.length === 3) return Object.freeze(output);
  }
  throw new Error(`V16.1 could not construct three exact ${semantic} distractors`);
}
function optionText(value: Rational, state: IntCp005State): string {
  if (state.qlId === "INT-QL-089") return percent(value);
  if (state.qlId === "INT-QL-093") return yearsText(Number(integer(value)));
  if ((state.qlId === "INT-QL-086" || state.qlId === "INT-QL-088") && state.context === "POPULATION") return count(value);
  return money(value);
}
function wrongOptions(state: IntCp005State, solution: Rational): readonly Wrong[] {
  switch (state.qlId) {
    case "INT-QL-086": {
      const sum = state.rates.reduce((a, b) => add(a, b), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sum, rat(100n))));
      const omitted = state.rates.map((_rate, index) => mul(state.initial, growthProduct(state.rates.filter((_r, i) => i !== index))));
      const oneYear = state.rates.map((rate) => mul(state.initial, growthFactor(rate)));
      return distinctExact(solution, [
        { value: linear, id: "ADD_RATES", feedback: "The yearly rates were added as if every rate acted on the opening value." },
        ...omitted.map((value, index) => ({ value, id: `OMIT_YEAR_${index + 1}`, feedback: `The year ${index + 1} compound factor was omitted.` })),
        ...oneYear.map((value, index) => ({ value, id: `ONLY_YEAR_${index + 1}`, feedback: `Only the year ${index + 1} rate was applied.` })),
      ], state.context === "POPULATION" ? "COUNT" : "MONEY");
    }
    case "INT-QL-087": {
      const amount = add(state.initial, solution);
      const sum = state.rates.reduce((a, b) => add(a, b), rat(0n));
      const simple = mul(state.initial, div(sum, rat(100n)));
      const omit = sub(mul(state.initial, growthProduct(state.rates.slice(0, -1))), state.initial);
      return distinctExact(solution, [
        { value: amount, id: "FINAL_AMOUNT", feedback: "This is the final amount, not the interest earned." },
        { value: simple, id: "ADD_RATES", feedback: "The yearly rates were treated as simple additions on the original principal." },
        { value: omit, id: "OMIT_LAST_YEAR", feedback: "The final year's compound factor was omitted." },
      ], "MONEY");
    }
    case "INT-QL-088": {
      const reverseOne = state.rates.map((rate) => div(state.finalValue, growthFactor(rate)));
      const linearRate = state.rates.reduce((a, b) => add(a, b), rat(0n));
      const linearReverse = div(mul(state.finalValue, rat(100n)), add(rat(100n), linearRate));
      return distinctExact(solution, [
        { value: state.finalValue, id: "NO_REVERSE", feedback: "The final value was used without reversing the yearly factors." },
        { value: linearReverse, id: "LINEAR_REVERSE", feedback: "The total percentage was reversed linearly instead of factor by factor." },
        ...reverseOne.map((value, index) => ({ value, id: `REVERSE_ONLY_YEAR_${index + 1}`, feedback: "Only one yearly factor was reversed." })),
      ], state.context === "POPULATION" ? "COUNT" : "MONEY");
    }
    case "INT-QL-089": {
      const known = state.rates.filter((_rate, index) => index !== state.missingIndex);
      const sumKnown = known.reduce((a, b) => add(a, b), rat(0n));
      return distinctExact(solution, [
        { value: known[0]!, id: "REPEAT_KNOWN_RATE_1", feedback: "This repeats one known year's rate instead of isolating the missing factor." },
        { value: known[1]!, id: "REPEAT_KNOWN_RATE_2", feedback: "This repeats the other known year's rate instead of solving the compound equation." },
        { value: sumKnown, id: "ADD_KNOWN_RATES", feedback: "This adds the two known rates and treats that sum as the missing rate." },
      ], "RATE_PERCENT");
    }
    case "INT-QL-090": {
      const sum = state.decayRates.reduce((a, b) => add(a, b), rat(0n));
      const linear = mul(state.initial, sub(rat(1n), div(sum, rat(100n))));
      const omit = mul(state.initial, decayProduct(state.decayRates.slice(0, -1)));
      const repeatFirst = mul(state.initial, pow(decayFactor(state.decayRates[0]!), state.decayRates.length));
      const repeatLast = mul(state.initial, pow(decayFactor(state.decayRates[state.decayRates.length - 1]!), state.decayRates.length));
      return distinctExact(solution, [
        { value: linear, id: "ADD_DECAY_RATES", feedback: "All depreciation percentages were subtracted from the original value at once." },
        { value: omit, id: "OMIT_LAST_YEAR", feedback: "The last year's depreciation was omitted." },
        { value: repeatFirst, id: "REPEAT_FIRST_RATE", feedback: "The first year's depreciation rate was incorrectly used for every year." },
        { value: repeatLast, id: "REPEAT_LAST_RATE", feedback: "The last year's depreciation rate was incorrectly used for every year." },
      ], "MONEY", integer(state.initial));
    }
    case "INT-QL-091": {
      const sum = state.decayRates.reduce((a, b) => add(a, b), rat(0n));
      const linearReverse = div(mul(state.finalValue, rat(100n)), sub(rat(100n), sum));
      const reverseOne = state.decayRates.map((rate) => div(state.finalValue, decayFactor(rate)));
      return distinctExact(solution, [
        { value: state.finalValue, id: "NO_REVERSE", feedback: "The final depreciated value was used as the original value." },
        { value: linearReverse, id: "LINEAR_REVERSE", feedback: "The depreciation rates were reversed as one simple percentage." },
        ...reverseOne.map((value, index) => ({ value, id: `REVERSE_ONLY_YEAR_${index + 1}`, feedback: "Only one depreciation factor was reversed." })),
      ], "MONEY");
    }
    case "INT-QL-092": {
      const sum = state.signedRates.reduce((a, b) => add(a, b), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sum, rat(100n))));
      const allIncrease = mul(state.initial, growthProduct(state.signedRates.map(abs)));
      const omit = mul(state.initial, product(state.signedRates.slice(0, -1).map(signedFactor)));
      const positive = state.signedRates.filter((rate) => rate.numerator > 0n);
      const negative = state.signedRates.filter((rate) => rate.numerator < 0n).map(abs);
      const grown = mul(state.initial, growthProduct(positive));
      const lossOnOriginal = mul(state.initial, div(negative.reduce((a, b) => add(a, b), rat(0n)), rat(100n)));
      const hybrid = sub(grown, lossOnOriginal);
      return distinctExact(solution, [
        { value: linear, id: "ADD_SIGNED_RATES", feedback: "The successive percentage changes were combined by simple addition." },
        { value: allIncrease, id: "ALL_INCREASE", feedback: "A decrease was treated as an increase." },
        { value: omit, id: "OMIT_LAST_CHANGE", feedback: "The final year's change was omitted." },
        { value: hybrid, id: "DECREASE_ON_ORIGINAL", feedback: "The decrease was taken on the original value rather than the updated value." },
      ], "MONEY");
    }
    case "INT-QL-093": {
      const y = state.targetYear;
      return distinctExact(solution, [
        { value: rat(BigInt(Math.max(1, y - 1))), id: "ONE_YEAR_EARLY", feedback: "The threshold has not yet been crossed at this time." },
        { value: rat(BigInt(y + 1)), id: "ONE_YEAR_LATE", feedback: "The threshold was already crossed one year earlier." },
        { value: rat(BigInt(y + 2)), id: "TWO_YEARS_LATE", feedback: "The threshold was already crossed earlier." },
      ], "TIME_YEARS");
    }
    case "INT-QL-095": {
      const initial = state.initial;
      const sumA = state.planARates.reduce((a, b) => add(a, b), rat(0n));
      const sumB = state.planBRates.reduce((a, b) => add(a, b), rat(0n));
      const linear = mul(initial, div(abs(sub(sumA, sumB)), rat(100n)));
      const prefix = abs(sub(mul(initial, growthProduct(state.planARates.slice(0, -1))), mul(initial, growthProduct(state.planBRates.slice(0, -1)))));
      const suffix = abs(sub(mul(initial, growthProduct(state.planARates.slice(1))), mul(initial, growthProduct(state.planBRates.slice(1)))));
      const firstYear = abs(sub(mul(initial, growthFactor(state.planARates[0]!)), mul(initial, growthFactor(state.planBRates[0]!))));
      const lastYear = abs(sub(mul(initial, growthFactor(state.planARates[state.planARates.length - 1]!)), mul(initial, growthFactor(state.planBRates[state.planBRates.length - 1]!))));
      return distinctExact(solution, [
        { value: linear, id: "ADD_PLAN_RATES", feedback: "The plans were compared by adding yearly rates instead of compounding them." },
        { value: prefix, id: "OMIT_FINAL_YEAR_COMPARISON", feedback: "The final year was omitted from both plans." },
        { value: suffix, id: "OMIT_FIRST_YEAR_COMPARISON", feedback: "The first year was omitted from both plans." },
        { value: firstYear, id: "COMPARE_FIRST_YEAR_ONLY", feedback: "Only the first-year difference was compared." },
        { value: lastYear, id: "COMPARE_LAST_YEAR_ONLY", feedback: "Only the last-year difference was compared." },
      ], "DIFFERENCE", integer(initial));
    }
    case "INT-QL-094": throw new Error("INT-QL-094 remains excluded");
  }
}
function options(state: IntCp005State, solution: Rational, correctIndex: number): readonly IntCp005Option[] {
  const semantic: IntCp005AnswerSemantic = state.qlId === "INT-QL-089" ? "RATE_PERCENT" : state.qlId === "INT-QL-093" ? "TIME_YEARS" : state.qlId === "INT-QL-095" ? "DIFFERENCE" : (state.qlId === "INT-QL-086" || state.qlId === "INT-QL-088") && state.context === "POPULATION" ? "COUNT" : "MONEY";
  const wrong = wrongOptions(state, solution);
  const output: IntCp005Option[] = [];
  let wi = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      output.push(deepFreeze({ text: optionText(solution, state), value: solution, misconceptionId: "CORRECT", studentFeedback: "Correct.", isCorrect: true }));
    } else {
      const candidate = wrong[wi++]!;
      output.push(deepFreeze({ text: optionText(candidate.value, state), value: candidate.value, misconceptionId: candidate.id, studentFeedback: candidate.feedback, isCorrect: false }));
    }
  }
  if (semantic === "MONEY" && output.some((option) => !option.text.startsWith("₹"))) throw new Error("V16.1 money option formatting failed");
  return Object.freeze(output);
}

function math(value: Rational): string { return value.denominator === 1n ? value.numerator.toString() : `\\frac{${value.numerator}}{${value.denominator}}`; }
function factor(rate: Rational, sign: "+" | "-" = "+"): string { return `\\left(1${sign}\\frac{${math(abs(rate))}}{100}\\right)`; }
function finalAnswerText(solution: Rational, state: IntCp005State): string { return optionText(solution, state); }
function explanation(state: IntCp005State, solution: Rational, seed: string): IntCp005QuestionV16["explanation"] {
  const variant = (hash(`${seed}:cp005-v16.1:explanation`) >>> 0) % 2;
  const steps: string[] = [];
  let keyIdea = "";
  let commonMistake = "";
  switch (state.qlId) {
    case "INT-QL-086": {
      keyIdea = variant === 0 ? "Apply each year's growth factor successively." : "Multiply the opening value by all yearly growth factors.";
      steps.push(`\\(V=${math(state.initial)}\\times${state.rates.map((rate) => factor(rate)).join("\\times")}=${math(solution)}\\).`);
      commonMistake = "Do not add the yearly rates and apply them once to the opening value.";
      break;
    }
    case "INT-QL-087": {
      const amount = add(state.initial, solution);
      keyIdea = variant === 0 ? "Find the compound amount, then subtract the principal." : "Compound the principal through all years and take only the gain.";
      steps.push(`\\(A=${math(state.initial)}\\times${state.rates.map((rate) => factor(rate)).join("\\times")}=${math(amount)}\\).`);
      steps.push(`\\(CI=${math(amount)}-${math(state.initial)}=${math(solution)}\\).`);
      commonMistake = "The final amount is not the same as the compound interest earned.";
      break;
    }
    case "INT-QL-088": {
      keyIdea = variant === 0 ? "Reverse every yearly growth factor." : "Divide the final value by the complete compound multiplier.";
      steps.push(`\\(P=\\frac{${math(state.finalValue)}}{${state.rates.map((rate) => factor(rate)).join("\\times")}}=${math(solution)}\\).`);
      commonMistake = "Subtracting the rates from the final value does not reverse compounding.";
      break;
    }
    case "INT-QL-089": {
      const known = state.rates.filter((_rate, index) => index !== state.missingIndex);
      keyIdea = variant === 0 ? "Isolate the missing yearly factor." : "Divide out the two known compound factors first.";
      steps.push(`\\(1+\\frac{x}{100}=\\frac{${math(state.finalValue)}}{${math(state.initial)}\\times${known.map((rate) => factor(rate)).join("\\times")}}\\).`);
      steps.push(`\\(x=${math(solution)}\\%\\).`);
      commonMistake = "Do not infer the missing rate by adding or repeating the known rates.";
      break;
    }
    case "INT-QL-090": {
      keyIdea = variant === 0 ? "Apply each depreciation rate to the reduced value." : "Multiply the initial value by every depreciation factor.";
      steps.push(`\\(V=${math(state.initial)}\\times${state.decayRates.map((rate) => factor(rate, "-")).join("\\times")}=${math(solution)}\\).`);
      commonMistake = "Do not subtract all depreciation percentages from the original value at once.";
      break;
    }
    case "INT-QL-091": {
      keyIdea = variant === 0 ? "Reverse every depreciation factor." : "Divide the final value by the complete depreciation multiplier.";
      steps.push(`\\(P=\\frac{${math(state.finalValue)}}{${state.decayRates.map((rate) => factor(rate, "-")).join("\\times")}}=${math(solution)}\\).`);
      commonMistake = "The total depreciation cannot be reversed as one simple percentage.";
      break;
    }
    case "INT-QL-092": {
      keyIdea = variant === 0 ? "Use growth factors for increases and decay factors for decreases." : "Treat every yearly percentage change successively, with the correct sign.";
      steps.push(`\\(V=${math(state.initial)}\\times${state.signedRates.map((rate) => factor(rate, rate.numerator >= 0n ? "+" : "-")).join("\\times")}=${math(solution)}\\).`);
      commonMistake = "A decrease must use a factor below 1 and acts on the updated value.";
      break;
    }
    case "INT-QL-093": {
      const f = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const previous = mul(state.initial, pow(f, state.targetYear - 1));
      const current = mul(state.initial, pow(f, state.targetYear));
      keyIdea = variant === 0 ? "Check the first year in which the threshold condition becomes true." : "Verify both the year before crossing and the crossing year.";
      steps.push(`\\(V_{${state.targetYear - 1}}=${math(previous)},\\quad V_{${state.targetYear}}=${math(current)}\\).`);
      steps.push(state.direction === "GROWTH" ? `\\(V_{${state.targetYear - 1}}<${math(state.threshold)}\\le V_{${state.targetYear}}\\).` : `\\(V_{${state.targetYear - 1}}>${math(state.threshold)}\\ge V_{${state.targetYear}}\\).`);
      commonMistake = "The question asks for the first crossing year, not just any later year that satisfies the condition.";
      break;
    }
    case "INT-QL-095": {
      const a = mul(state.initial, growthProduct(state.planARates));
      const b = mul(state.initial, growthProduct(state.planBRates));
      keyIdea = variant === 0 ? "Compound both plans separately, then compare the results." : "Find each plan's final amount before taking the absolute difference.";
      steps.push(`\\(A=${math(state.initial)}\\times${state.planARates.map((rate) => factor(rate)).join("\\times")}=${math(a)}\\).`);
      steps.push(`\\(B=${math(state.initial)}\\times${state.planBRates.map((rate) => factor(rate)).join("\\times")}=${math(b)}\\).`);
      steps.push(`\\(|A-B|=${math(solution)}\\).`);
      commonMistake = "Adding each plan's yearly rates does not correctly compare compound growth.";
      break;
    }
    case "INT-QL-094": throw new Error("INT-QL-094 remains excluded");
  }
  steps.push(`Therefore, the answer is ${finalAnswerText(solution, state)}.`);
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer: finalAnswerText(solution, state), commonMistake });
}

export function intCp005V16_1TopologyKey(state: IntCp005State, seed?: string): string {
  const rk = (rate: Rational) => key(rate);
  const sorted = (rates: readonly Rational[]) => rates.map(rk).sort().join(",");
  switch (state.qlId) {
    case "INT-QL-086":
    case "INT-QL-087":
    case "INT-QL-088": return `${state.qlId}|${state.context}|${sorted(state.rates)}`;
    case "INT-QL-089": return `${state.qlId}|MISSING=${rk(state.rates[state.missingIndex]!)}|KNOWN=${sorted(state.rates.filter((_r, i) => i !== state.missingIndex))}`;
    case "INT-QL-090":
    case "INT-QL-091": return `${state.qlId}|${state.context}|${sorted(state.decayRates)}`;
    case "INT-QL-092": return `${state.qlId}|${sorted(state.signedRates)}`;
    case "INT-QL-093": {
      const f = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const exact = eq(state.threshold, mul(state.initial, pow(f, state.targetYear))) ? "EXACT" : "BETWEEN";
      return `${state.qlId}|${state.direction}|${rk(state.rate)}|Y${state.targetYear}|${exact}`;
    }
    case "INT-QL-095": {
      const a = sorted(state.planARates); const b = sorted(state.planBRates);
      return `${state.qlId}|${[a, b].sort().join("||")}`;
    }
    case "INT-QL-094": return `${state.qlId}|EXCLUDED|${seed ?? ""}`;
  }
}

export function generateIntCp005QuestionV16_1(
  qlId: IntCp005QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp005QuestionV16_1 {
  if (locale !== "en-IN") throw new Error("Use the V16.1 localized runtime for Hindi/Punjabi.");
  if (qlId === "INT-QL-094") throw new Error("INT-QL-094 remains outside CP005 V16.1 learner authority.");
  const source = generateIntCp005QuestionV16EditorialFinal(qlId, seed, "en-IN");
  const mathematicalState = buildState(qlId, seed);
  const solution = solveIntCp005(mathematicalState);
  if (!verifyIntCp005Answer(mathematicalState, solution)) throw new Error(`${qlId}/${seed}: V16.1 independent verifier failed`);
  if (solution.denominator !== 1n) throw new Error(`${qlId}/${seed}: V16.1 answer is not integral`);
  const semantic: IntCp005AnswerSemantic = qlId === "INT-QL-089" ? "RATE_PERCENT" : qlId === "INT-QL-093" ? "TIME_YEARS" : qlId === "INT-QL-095" ? "DIFFERENCE" : (qlId === "INT-QL-086" || qlId === "INT-QL-088") && mathematicalState.context === "POPULATION" ? "COUNT" : "MONEY";
  const optionList = options(mathematicalState, solution, source.correctIndex);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V16_1,
    locale: "en-IN",
    mathematicalState,
    mathematicalFingerprint: `${intCp005V16_1TopologyKey(mathematicalState)}|${intCp005V16_1StemTemplateId(qlId, seed)}|${seed}`,
    answerSemantic: semantic,
    representation: qlId === "INT-QL-095" ? "COMPARISON_TABLE" : "STANDARD_PROSE",
    presentation: presentation(mathematicalState, seed),
    options: optionList,
    correctIndex: source.correctIndex,
    correctAnswer: optionList[source.correctIndex]!.text,
    solution,
    explanation: explanation(mathematicalState, solution, seed),
  });
}
