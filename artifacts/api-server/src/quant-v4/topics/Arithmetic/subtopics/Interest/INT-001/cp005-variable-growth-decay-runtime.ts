import {
  add,
  div,
  eq,
  hash,
  mul,
  pow,
  rat,
  sub,
  type Rational,
} from "./cp003-exam-model";

export const INT_CP005_RUNTIME_VERSION = "INT-CP-005-VARIABLE-GROWTH-DECAY-v1" as const;
export const INT_CP005_QL_IDS = Object.freeze([
  "INT-QL-086",
  "INT-QL-087",
  "INT-QL-088",
  "INT-QL-089",
  "INT-QL-090",
  "INT-QL-091",
  "INT-QL-092",
  "INT-QL-093",
  "INT-QL-094",
  "INT-QL-095",
] as const);

export type IntCp005QlId = typeof INT_CP005_QL_IDS[number];
export type IntCp005Locale = "en-IN" | "hi-IN" | "pa-IN";
export type IntCp005Representation = "STANDARD_PROSE" | "RATE_TABLE" | "COMPARISON_TABLE";
export type IntCp005Context =
  | "INVESTMENT"
  | "POPULATION"
  | "SALARY"
  | "PRODUCTION"
  | "ASSET"
  | "VEHICLE"
  | "MACHINE";
export type IntCp005AnswerSemantic = "MONEY" | "COUNT" | "RATE_PERCENT" | "TIME_YEARS" | "DIFFERENCE";
export type IntCp005EventOrder = "GROWTH_THEN_ADJUSTMENT" | "ADJUSTMENT_THEN_GROWTH";
export type IntCp005ThresholdDirection = "GROWTH" | "DECAY";

export interface IntCp005RegistryEntry {
  readonly qlId: IntCp005QlId;
  readonly title: string;
  readonly solveContract:
    | "VARIABLE_RATE_FINAL_VALUE"
    | "VARIABLE_RATE_NET_GAIN"
    | "REVERSE_INITIAL_VALUE"
    | "MISSING_PERIOD_RATE"
    | "PERIODIC_DECAY_FINAL_VALUE"
    | "REVERSE_DECAY_INITIAL_VALUE"
    | "MIXED_GROWTH_DECLINE_FINAL_VALUE"
    | "THRESHOLD_CROSSING_PERIOD"
    | "EXPLICIT_EVENT_ORDER_FINAL_VALUE"
    | "TWO_PLAN_FINAL_VALUE_DIFFERENCE";
  readonly answerSemantic: IntCp005AnswerSemantic;
  readonly legacyCoverage: readonly string[];
  readonly contexts: readonly IntCp005Context[];
}

export const INT_CP005_REGISTRY: readonly IntCp005RegistryEntry[] = Object.freeze([
  Object.freeze({ qlId: "INT-QL-086", title: "Variable periodic rates — final value", solveContract: "VARIABLE_RATE_FINAL_VALUE", answerSemantic: "MONEY", legacyCoverage: Object.freeze(["int_different_rates_different_years_ci", "int_successive_growth", "int_population_growth_ci", "int_price_appreciation"]), contexts: Object.freeze(["INVESTMENT", "POPULATION", "SALARY", "PRODUCTION"] as const) }),
  Object.freeze({ qlId: "INT-QL-087", title: "Variable periodic rates — net compound gain", solveContract: "VARIABLE_RATE_NET_GAIN", answerSemantic: "MONEY", legacyCoverage: Object.freeze(["int_different_rates_different_years_ci", "int_successive_growth"]), contexts: Object.freeze(["INVESTMENT"] as const) }),
  Object.freeze({ qlId: "INT-QL-088", title: "Variable periodic rates — recover initial value", solveContract: "REVERSE_INITIAL_VALUE", answerSemantic: "MONEY", legacyCoverage: Object.freeze(["int_different_rates_different_years_ci", "int_population_growth_ci", "int_price_appreciation"]), contexts: Object.freeze(["INVESTMENT", "POPULATION", "SALARY"] as const) }),
  Object.freeze({ qlId: "INT-QL-089", title: "Variable periodic rates — recover one missing rate", solveContract: "MISSING_PERIOD_RATE", answerSemantic: "RATE_PERCENT", legacyCoverage: Object.freeze(["int_different_rates_different_years_ci", "int_successive_growth"]), contexts: Object.freeze(["INVESTMENT"] as const) }),
  Object.freeze({ qlId: "INT-QL-090", title: "Periodic depreciation — final value", solveContract: "PERIODIC_DECAY_FINAL_VALUE", answerSemantic: "MONEY", legacyCoverage: Object.freeze(["int_depreciation_ci", "int_machine_car_depreciation", "int_successive_reduction", "int_compound_depreciation_repair_sale:depreciation-only"]), contexts: Object.freeze(["ASSET", "VEHICLE", "MACHINE"] as const) }),
  Object.freeze({ qlId: "INT-QL-091", title: "Periodic depreciation — recover original value", solveContract: "REVERSE_DECAY_INITIAL_VALUE", answerSemantic: "MONEY", legacyCoverage: Object.freeze(["int_depreciation_ci", "int_machine_car_depreciation", "int_successive_reduction"]), contexts: Object.freeze(["ASSET", "VEHICLE", "MACHINE"] as const) }),
  Object.freeze({ qlId: "INT-QL-092", title: "Mixed periodic appreciation and depreciation", solveContract: "MIXED_GROWTH_DECLINE_FINAL_VALUE", answerSemantic: "MONEY", legacyCoverage: Object.freeze(["int_successive_growth", "int_successive_reduction", "int_price_appreciation", "int_depreciation_ci"]), contexts: Object.freeze(["ASSET"] as const) }),
  Object.freeze({ qlId: "INT-QL-093", title: "First period crossing a growth or decay threshold", solveContract: "THRESHOLD_CROSSING_PERIOD", answerSemantic: "TIME_YEARS", legacyCoverage: Object.freeze(["new:threshold-crossing-periodic-growth-decay"]), contexts: Object.freeze(["POPULATION", "ASSET"] as const) }),
  Object.freeze({ qlId: "INT-QL-094", title: "Periodic growth with explicit migration/event order", solveContract: "EXPLICIT_EVENT_ORDER_FINAL_VALUE", answerSemantic: "COUNT", legacyCoverage: Object.freeze(["new:explicit-growth-plus-migration-order"]), contexts: Object.freeze(["POPULATION"] as const) }),
  Object.freeze({ qlId: "INT-QL-095", title: "Compare two variable periodic plans", solveContract: "TWO_PLAN_FINAL_VALUE_DIFFERENCE", answerSemantic: "DIFFERENCE", legacyCoverage: Object.freeze(["new:two-variable-growth-plan-comparison"]), contexts: Object.freeze(["INVESTMENT"] as const) }),
]);

export const INT_CP005_SOURCE_SATURATION = Object.freeze({
  checkpoint: "INT-CP-005" as const,
  permanentQlRange: "INT-QL-086..INT-QL-095" as const,
  permanentQlCount: 10 as const,
  legacyFamiliesRecovered: Object.freeze([
    "int_population_growth_ci",
    "int_depreciation_ci",
    "int_price_appreciation",
    "int_machine_car_depreciation",
    "int_successive_growth",
    "int_successive_reduction",
    "int_different_rates_different_years_ci",
    "int_compound_depreciation_repair_sale:depreciation-only",
  ] as const),
  contextOnlyFamiliesMerged: Object.freeze(["int_population_growth_ci", "int_price_appreciation", "int_machine_car_depreciation"] as const),
  protectedBoundaries: Object.freeze([
    "one-off successive percentage without periodic historical/future value remains Percentage",
    "mixed conversion frequency remains INT-CP-004",
    "heterogeneous dated money cash flows remain INT-CP-009",
    "repair/sale commercial tail remains outside CP005",
  ] as const),
});

interface BaseState {
  readonly qlId: IntCp005QlId;
  readonly context: IntCp005Context;
}
export type IntCp005State =
  | (BaseState & { readonly qlId: "INT-QL-086"; readonly initial: Rational; readonly rates: readonly Rational[] })
  | (BaseState & { readonly qlId: "INT-QL-087"; readonly initial: Rational; readonly rates: readonly Rational[] })
  | (BaseState & { readonly qlId: "INT-QL-088"; readonly initial: Rational; readonly rates: readonly Rational[]; readonly finalValue: Rational })
  | (BaseState & { readonly qlId: "INT-QL-089"; readonly initial: Rational; readonly rates: readonly Rational[]; readonly missingIndex: number; readonly finalValue: Rational })
  | (BaseState & { readonly qlId: "INT-QL-090"; readonly initial: Rational; readonly decayRates: readonly Rational[] })
  | (BaseState & { readonly qlId: "INT-QL-091"; readonly initial: Rational; readonly decayRates: readonly Rational[]; readonly finalValue: Rational })
  | (BaseState & { readonly qlId: "INT-QL-092"; readonly initial: Rational; readonly signedRates: readonly Rational[] })
  | (BaseState & { readonly qlId: "INT-QL-093"; readonly initial: Rational; readonly rate: Rational; readonly direction: IntCp005ThresholdDirection; readonly threshold: Rational; readonly targetYear: number })
  | (BaseState & { readonly qlId: "INT-QL-094"; readonly initial: Rational; readonly rate: Rational; readonly years: number; readonly adjustment: Rational; readonly eventOrder: IntCp005EventOrder })
  | (BaseState & { readonly qlId: "INT-QL-095"; readonly initial: Rational; readonly planARates: readonly Rational[]; readonly planBRates: readonly Rational[] });

export interface IntCp005Option {
  readonly text: string;
  readonly value: Rational;
  readonly misconceptionId: string;
  readonly studentFeedback: string;
  readonly isCorrect: boolean;
}

export interface IntCp005Explanation {
  readonly keyIdea: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
  readonly commonMistake: string;
}

export interface IntCp005Question {
  readonly packageId: "INT-001";
  readonly canonicalProblemId: "INT-CP-005";
  readonly permanentQlId: IntCp005QlId;
  readonly qlId: IntCp005QlId;
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION;
  readonly seed: string;
  readonly locale: IntCp005Locale;
  readonly mathematicalState: IntCp005State;
  readonly mathematicalFingerprint: string;
  readonly answerSemantic: IntCp005AnswerSemantic;
  readonly representation: IntCp005Representation;
  readonly presentation: Readonly<{ markdown: string; prompt: string; table?: Readonly<{ headers: readonly string[]; rows: readonly (readonly string[])[] }> }>;
  readonly options: readonly IntCp005Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly solution: Rational;
  readonly explanation: IntCp005Explanation;
  readonly difficulty: "Medium" | "Hard";
  readonly maturity: "MULTILINGUAL_REVIEW_CANDIDATE";
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

const GROWTH_RATES = Object.freeze([5, 8, 10, 12, 15, 20, 25, 30].map((value) => rat(BigInt(value))));
const DECAY_RATES = Object.freeze([5, 10, 12, 15, 20, 25].map((value) => rat(BigInt(value))));
const EVENT_RATES = Object.freeze([10, 20].map((value) => rat(BigInt(value))));
const BASE_MULTIPLIERS = Object.freeze([1000n, 1250n, 1600n, 2000n, 2500n, 3200n, 4000n, 5000n]);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function choice<T>(items: readonly T[], seed: string, label: string): T {
  if (!items.length) throw new Error(`${label}: empty choice list`);
  return items[(hash(`${seed}:${label}`) >>> 0) % items.length]!;
}

function growthFactor(rate: Rational): Rational { return add(rat(1n), div(rate, rat(100n))); }
function decayFactor(rate: Rational): Rational { return sub(rat(1n), div(rate, rat(100n))); }
function signedFactor(rate: Rational): Rational {
  return rate.numerator >= 0n ? growthFactor(rate) : decayFactor(rat(-rate.numerator, rate.denominator));
}
function product(values: readonly Rational[]): Rational { return values.reduce((acc, value) => mul(acc, value), rat(1n)); }
function productGrowthRates(rates: readonly Rational[]): Rational { return product(rates.map(growthFactor)); }
function productDecayRates(rates: readonly Rational[]): Rational { return product(rates.map(decayFactor)); }
function productSignedRates(rates: readonly Rational[]): Rational { return product(rates.map(signedFactor)); }
function absRat(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }

function deterministicRates(seed: string, label: string, count: number, pool: readonly Rational[]): readonly Rational[] {
  const rates = Array.from({ length: count }, (_, index) => choice(pool, seed, `${label}:${index}`));
  if (count > 1 && rates.every((rate) => eq(rate, rates[0]!))) {
    const current = rates[count - 1]!;
    const currentIndex = pool.findIndex((candidate) => eq(candidate, current));
    rates[count - 1] = pool[(currentIndex + 1) % pool.length]!;
  }
  return Object.freeze(rates);
}

function scaledInitialForFactor(factorValue: Rational, seed: string, label: string): Rational {
  const multiplier = choice(BASE_MULTIPLIERS, seed, label);
  return rat(factorValue.denominator * multiplier);
}

function amountFromGrowth(initial: Rational, rates: readonly Rational[]): Rational { return mul(initial, productGrowthRates(rates)); }
function amountFromDecay(initial: Rational, rates: readonly Rational[]): Rational { return mul(initial, productDecayRates(rates)); }
function amountFromSigned(initial: Rational, rates: readonly Rational[]): Rational { return mul(initial, productSignedRates(rates)); }

function eventValue(initial: Rational, rate: Rational, years: number, adjustment: Rational, order: IntCp005EventOrder): Rational {
  let value = initial;
  const factorValue = growthFactor(rate);
  for (let year = 0; year < years; year += 1) {
    value = order === "GROWTH_THEN_ADJUSTMENT"
      ? add(mul(value, factorValue), adjustment)
      : mul(add(value, adjustment), factorValue);
  }
  return value;
}

function generateState(qlId: IntCp005QlId, seed: string): IntCp005State {
  switch (qlId) {
    case "INT-QL-086": {
      const years = 2 + ((hash(`${seed}:years`) >>> 0) % 3);
      const rates = deterministicRates(seed, "rates", years, GROWTH_RATES);
      const initial = scaledInitialForFactor(productGrowthRates(rates), seed, "initial");
      const context = choice(["INVESTMENT", "POPULATION", "SALARY", "PRODUCTION"] as const, seed, "context");
      return deepFreeze({ qlId, context, initial, rates });
    }
    case "INT-QL-087": {
      const years = 2 + ((hash(`${seed}:years`) >>> 0) % 3);
      const rates = deterministicRates(seed, "rates", years, GROWTH_RATES);
      const initial = scaledInitialForFactor(productGrowthRates(rates), seed, "initial");
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates });
    }
    case "INT-QL-088": {
      const years = 2 + ((hash(`${seed}:years`) >>> 0) % 3);
      const rates = deterministicRates(seed, "rates", years, GROWTH_RATES);
      const initial = scaledInitialForFactor(productGrowthRates(rates), seed, "initial");
      const finalValue = amountFromGrowth(initial, rates);
      const context = choice(["INVESTMENT", "POPULATION", "SALARY"] as const, seed, "context");
      return deepFreeze({ qlId, context, initial, rates, finalValue });
    }
    case "INT-QL-089": {
      const rates = deterministicRates(seed, "rates", 3, GROWTH_RATES);
      const initial = scaledInitialForFactor(productGrowthRates(rates), seed, "initial");
      const missingIndex = (hash(`${seed}:missing-index`) >>> 0) % 3;
      const finalValue = amountFromGrowth(initial, rates);
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates, missingIndex, finalValue });
    }
    case "INT-QL-090": {
      const years = 2 + ((hash(`${seed}:years`) >>> 0) % 3);
      const decayRates = deterministicRates(seed, "decay-rates", years, DECAY_RATES);
      const initial = scaledInitialForFactor(productDecayRates(decayRates), seed, "initial");
      const context = choice(["ASSET", "VEHICLE", "MACHINE"] as const, seed, "context");
      return deepFreeze({ qlId, context, initial, decayRates });
    }
    case "INT-QL-091": {
      const years = 2 + ((hash(`${seed}:years`) >>> 0) % 3);
      const decayRates = deterministicRates(seed, "decay-rates", years, DECAY_RATES);
      const initial = scaledInitialForFactor(productDecayRates(decayRates), seed, "initial");
      const finalValue = amountFromDecay(initial, decayRates);
      const context = choice(["ASSET", "VEHICLE", "MACHINE"] as const, seed, "context");
      return deepFreeze({ qlId, context, initial, decayRates, finalValue });
    }
    case "INT-QL-092": {
      const years = 3 + ((hash(`${seed}:years`) >>> 0) % 2);
      const positives = deterministicRates(seed, "positive-rates", years, GROWTH_RATES);
      const signedRates = positives.map((rate, index) => {
        const negative = ((hash(`${seed}:sign:${index}`) >>> 0) % 3) === 0;
        return negative ? rat(-rate.numerator, rate.denominator) : rate;
      });
      if (signedRates.every((rate) => rate.numerator >= 0n)) signedRates[1] = rat(-signedRates[1]!.numerator, signedRates[1]!.denominator);
      if (signedRates.every((rate) => rate.numerator < 0n)) signedRates[0] = rat(-signedRates[0]!.numerator, signedRates[0]!.denominator);
      const frozenRates = Object.freeze(signedRates);
      const initial = scaledInitialForFactor(productSignedRates(frozenRates), seed, "initial");
      return deepFreeze({ qlId, context: "ASSET", initial, signedRates: frozenRates });
    }
    case "INT-QL-093": {
      const direction = choice(["GROWTH", "DECAY"] as const, seed, "direction");
      const rate = choice(direction === "GROWTH" ? GROWTH_RATES : DECAY_RATES, seed, "rate");
      const targetYear = 2 + ((hash(`${seed}:target-year`) >>> 0) % 4);
      const factorValue = direction === "GROWTH" ? growthFactor(rate) : decayFactor(rate);
      const finalFactor = pow(factorValue, targetYear);
      const initial = scaledInitialForFactor(finalFactor, seed, "initial");
      const threshold = mul(initial, finalFactor);
      const context: IntCp005Context = direction === "GROWTH" ? "POPULATION" : "ASSET";
      return deepFreeze({ qlId, context, initial, rate, direction, threshold, targetYear });
    }
    case "INT-QL-094": {
      const rate = choice(EVENT_RATES, seed, "rate");
      const years = 2 + ((hash(`${seed}:years`) >>> 0) % 3);
      const order = choice(["GROWTH_THEN_ADJUSTMENT", "ADJUSTMENT_THEN_GROWTH"] as const, seed, "order");
      const sign = ((hash(`${seed}:adjust-sign`) >>> 0) % 2) === 0 ? 1n : -1n;
      const adjustmentMagnitude = choice([500n, 1000n, 2000n] as const, seed, "adjustment");
      const adjustment = rat(sign * adjustmentMagnitude);
      const initial = rat(choice([50000n, 60000n, 80000n, 100000n] as const, seed, "initial"));
      return deepFreeze({ qlId, context: "POPULATION", initial, rate, years, adjustment, eventOrder: order });
    }
    case "INT-QL-095": {
      const years = 3;
      let planARates = deterministicRates(seed, "plan-a", years, GROWTH_RATES);
      let planBRates = deterministicRates(seed, "plan-b", years, GROWTH_RATES);
      if (eq(productGrowthRates(planARates), productGrowthRates(planBRates))) {
        const replacement = choice(GROWTH_RATES, seed, "plan-b-replacement");
        planBRates = Object.freeze([planBRates[0]!, planBRates[1]!, eq(replacement, planBRates[2]!) ? GROWTH_RATES[0]! : replacement]);
        if (eq(productGrowthRates(planARates), productGrowthRates(planBRates))) {
          planARates = Object.freeze([GROWTH_RATES[0]!, GROWTH_RATES[2]!, GROWTH_RATES[4]!]);
          planBRates = Object.freeze([GROWTH_RATES[1]!, GROWTH_RATES[3]!, GROWTH_RATES[5]!]);
        }
      }
      const combinedDenominator = productGrowthRates(planARates).denominator * productGrowthRates(planBRates).denominator;
      const initial = rat(combinedDenominator * choice([1000n, 1600n, 2000n, 2500n] as const, seed, "initial"));
      return deepFreeze({ qlId, context: "INVESTMENT", initial, planARates, planBRates });
    }
  }
}

export function solveIntCp005(state: IntCp005State): Rational {
  switch (state.qlId) {
    case "INT-QL-086": return amountFromGrowth(state.initial, state.rates);
    case "INT-QL-087": return sub(amountFromGrowth(state.initial, state.rates), state.initial);
    case "INT-QL-088": return div(state.finalValue, productGrowthRates(state.rates));
    case "INT-QL-089": return state.rates[state.missingIndex]!;
    case "INT-QL-090": return amountFromDecay(state.initial, state.decayRates);
    case "INT-QL-091": return div(state.finalValue, productDecayRates(state.decayRates));
    case "INT-QL-092": return amountFromSigned(state.initial, state.signedRates);
    case "INT-QL-093": return rat(BigInt(state.targetYear));
    case "INT-QL-094": return eventValue(state.initial, state.rate, state.years, state.adjustment, state.eventOrder);
    case "INT-QL-095": return absRat(sub(amountFromGrowth(state.initial, state.planARates), amountFromGrowth(state.initial, state.planBRates)));
  }
}

export function verifyIntCp005Answer(state: IntCp005State, candidate: Rational): boolean {
  switch (state.qlId) {
    case "INT-QL-086": {
      let value = state.initial;
      for (const rate of state.rates) value = mul(value, growthFactor(rate));
      return eq(value, candidate);
    }
    case "INT-QL-087": {
      let value = state.initial;
      for (const rate of state.rates) value = mul(value, growthFactor(rate));
      return eq(sub(value, state.initial), candidate);
    }
    case "INT-QL-088": {
      let value = candidate;
      for (const rate of state.rates) value = mul(value, growthFactor(rate));
      return eq(value, state.finalValue);
    }
    case "INT-QL-089": {
      const testedRates = state.rates.map((rate, index) => index === state.missingIndex ? candidate : rate);
      let value = state.initial;
      for (const rate of testedRates) value = mul(value, growthFactor(rate));
      return eq(value, state.finalValue);
    }
    case "INT-QL-090": {
      let value = state.initial;
      for (const rate of state.decayRates) value = mul(value, decayFactor(rate));
      return eq(value, candidate);
    }
    case "INT-QL-091": {
      let value = candidate;
      for (const rate of state.decayRates) value = mul(value, decayFactor(rate));
      return eq(value, state.finalValue);
    }
    case "INT-QL-092": {
      let value = state.initial;
      for (const rate of state.signedRates) value = mul(value, signedFactor(rate));
      return eq(value, candidate);
    }
    case "INT-QL-093": {
      if (candidate.denominator !== 1n) return false;
      const year = Number(candidate.numerator);
      if (!Number.isInteger(year) || year < 1 || year > 12) return false;
      const factorValue = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const atYear = mul(state.initial, pow(factorValue, year));
      const prior = year === 1 ? state.initial : mul(state.initial, pow(factorValue, year - 1));
      return state.direction === "GROWTH"
        ? atYear.numerator * state.threshold.denominator >= state.threshold.numerator * atYear.denominator
          && prior.numerator * state.threshold.denominator < state.threshold.numerator * prior.denominator
        : atYear.numerator * state.threshold.denominator <= state.threshold.numerator * atYear.denominator
          && prior.numerator * state.threshold.denominator > state.threshold.numerator * prior.denominator;
    }
    case "INT-QL-094": return eq(eventValue(state.initial, state.rate, state.years, state.adjustment, state.eventOrder), candidate);
    case "INT-QL-095": {
      let a = state.initial;
      let b = state.initial;
      for (const rate of state.planARates) a = mul(a, growthFactor(rate));
      for (const rate of state.planBRates) b = mul(b, growthFactor(rate));
      return eq(absRat(sub(a, b)), candidate);
    }
  }
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}
function roundRational(value: Rational, places: number): Rational {
  const scale = 10n ** BigInt(places);
  const sign = value.numerator < 0n ? -1n : 1n;
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const scaled = numerator * scale;
  let q = scaled / value.denominator;
  if ((scaled % value.denominator) * 2n >= value.denominator) q += 1n;
  return rat(sign * q, scale);
}
function decimal(value: Rational, places = 2): string {
  const rounded = roundRational(value, places);
  const sign = rounded.numerator < 0n ? "-" : "";
  const n = rounded.numerator < 0n ? -rounded.numerator : rounded.numerator;
  const whole = n / rounded.denominator;
  const remainder = n % rounded.denominator;
  if (remainder === 0n) return `${sign}${whole}`;
  const scale = 10n ** BigInt(places);
  const fraction = ((remainder * scale) / rounded.denominator).toString().padStart(places, "0").replace(/0+$/u, "");
  return `${sign}${whole}.${fraction}`;
}
function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return sign + source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function rationalPlain(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return decimal(value, 2);
}
function money(value: Rational): string {
  const rounded = roundRational(value, 2);
  if (rounded.denominator === 1n) return `₹${indianInteger(rounded.numerator)}`;
  const numeric = decimal(rounded, 2);
  const [whole, fraction] = numeric.split(".");
  return `₹${indianInteger(BigInt(whole!))}.${fraction}`;
}
function countText(value: Rational, locale: IntCp005Locale): string {
  const rounded = roundRational(value, 0);
  const n = rounded.numerator / rounded.denominator;
  const formatted = indianInteger(n);
  if (locale === "hi-IN") return `${formatted} लोग`;
  if (locale === "pa-IN") return `${formatted} ਲੋਕ`;
  return `${formatted} people`;
}
function unitValue(value: Rational, context: IntCp005Context, locale: IntCp005Locale): string {
  if (context === "POPULATION") return countText(value, locale);
  if (context === "PRODUCTION") {
    const rounded = roundRational(value, 0).numerator;
    if (locale === "hi-IN") return `${indianInteger(rounded)} इकाइयाँ`;
    if (locale === "pa-IN") return `${indianInteger(rounded)} ਇਕਾਈਆਂ`;
    return `${indianInteger(rounded)} units`;
  }
  return money(value);
}
function rateText(value: Rational): string { return `${decimal(value, 2)}%`; }
function signedRateText(value: Rational, locale: IntCp005Locale): string {
  const magnitude = rateText(absRat(value));
  if (value.numerator >= 0n) return locale === "hi-IN" ? `${magnitude} वृद्धि` : locale === "pa-IN" ? `${magnitude} ਵਾਧਾ` : `${magnitude} increase`;
  return locale === "hi-IN" ? `${magnitude} कमी` : locale === "pa-IN" ? `${magnitude} ਘਾਟ` : `${magnitude} decrease`;
}
function ordinal(index: number, locale: IntCp005Locale): string {
  const n = index + 1;
  if (locale === "hi-IN") return ["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें"][index] ?? `${n}वें`;
  if (locale === "pa-IN") return ["ਪਹਿਲੇ", "ਦੂਜੇ", "ਤੀਜੇ", "ਚੌਥੇ", "ਪੰਜਵੇਂ"][index] ?? `${n}ਵੇਂ`;
  const suffix = n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return `${n}${suffix}`;
}
function rateSequence(rates: readonly Rational[], locale: IntCp005Locale, kind: "GROWTH" | "DECAY" = "GROWTH"): string {
  const parts = rates.map((rate, index) => {
    const year = ordinal(index, locale);
    if (locale === "hi-IN") return `${year} वर्ष ${rateText(rate)}`;
    if (locale === "pa-IN") return `${year} ਸਾਲ ${rateText(rate)}`;
    return `${rateText(rate)} in the ${year} year`;
  });
  const joiner = locale === "en-IN" ? " and " : locale === "hi-IN" ? " और " : " ਅਤੇ ";
  if (parts.length === 1) return parts[0]!;
  return `${parts.slice(0, -1).join(", ")}${joiner}${parts.at(-1)}`;
}
function signedSequence(rates: readonly Rational[], locale: IntCp005Locale): string {
  const parts = rates.map((rate, index) => {
    const year = ordinal(index, locale);
    const change = signedRateText(rate, locale);
    if (locale === "hi-IN") return `${year} वर्ष ${change}`;
    if (locale === "pa-IN") return `${year} ਸਾਲ ${change}`;
    return `${change} in the ${year} year`;
  });
  const joiner = locale === "en-IN" ? " and " : locale === "hi-IN" ? " और " : " ਅਤੇ ";
  return `${parts.slice(0, -1).join(", ")}${joiner}${parts.at(-1)}`;
}
function factorLatex(rate: Rational, sign: "PLUS" | "MINUS" = "PLUS"): string {
  return `\\left(1${sign === "PLUS" ? "+" : "-"}\\frac{${decimal(rate, 2)}}{100}\\right)`;
}
function signedFactorLatex(rate: Rational): string { return factorLatex(absRat(rate), rate.numerator >= 0n ? "PLUS" : "MINUS"); }
function mathNumber(value: Rational): string { return rationalPlain(roundRational(value, 2)).replace(/,/gu, ""); }
function mathWrapped(body: string): string { return `\\(${body}\\)`; }

function answerSemanticFor(qlId: IntCp005QlId, context: IntCp005Context): IntCp005AnswerSemantic {
  if (qlId === "INT-QL-089") return "RATE_PERCENT";
  if (qlId === "INT-QL-093") return "TIME_YEARS";
  if (qlId === "INT-QL-094") return "COUNT";
  if (qlId === "INT-QL-095") return "DIFFERENCE";
  if ((qlId === "INT-QL-086" || qlId === "INT-QL-088") && (context === "POPULATION" || context === "PRODUCTION")) return "COUNT";
  return "MONEY";
}
function formatAnswer(semantic: IntCp005AnswerSemantic, value: Rational, context: IntCp005Context, locale: IntCp005Locale): string {
  if (semantic === "RATE_PERCENT") return rateText(value);
  if (semantic === "TIME_YEARS") {
    const years = Number(value.numerator / value.denominator);
    return locale === "hi-IN" ? `${years} वर्ष` : locale === "pa-IN" ? `${years} ਸਾਲ` : `${years} years`;
  }
  if (semantic === "COUNT") return unitValue(value, context, locale);
  return money(value);
}

function representationFor(state: IntCp005State, seed: string): IntCp005Representation {
  if (state.qlId === "INT-QL-095") return "COMPARISON_TABLE";
  if (["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-090", "INT-QL-091"].includes(state.qlId) && ((hash(`${seed}:representation`) >>> 0) % 5) === 0) return "RATE_TABLE";
  return "STANDARD_PROSE";
}

function tableMarkdown(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}
function local(locale: IntCp005Locale, en: string, hi: string, pa: string): string { return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa; }

function rateTable(state: IntCp005State, locale: IntCp005Locale): Readonly<{ headers: readonly string[]; rows: readonly (readonly string[])[] }> | undefined {
  const headers = Object.freeze([local(locale, "Year", "वर्ष", "ਸਾਲ"), local(locale, "Rate", "दर", "ਦਰ")]);
  let rates: readonly Rational[] | undefined;
  let decay = false;
  if (state.qlId === "INT-QL-086" || state.qlId === "INT-QL-087" || state.qlId === "INT-QL-088" || state.qlId === "INT-QL-089") rates = state.rates;
  if (state.qlId === "INT-QL-090" || state.qlId === "INT-QL-091") { rates = state.decayRates; decay = true; }
  if (!rates) return undefined;
  const rows = rates.map((rate, index) => Object.freeze([
    String(index + 1),
    state.qlId === "INT-QL-089" && index === state.missingIndex ? "?" : decay ? local(locale, `${rateText(rate)} depreciation`, `${rateText(rate)} मूल्यह्रास`, `${rateText(rate)} ਮੁੱਲ ਘਟਾਅ`) : rateText(rate),
  ]));
  return Object.freeze({ headers, rows: Object.freeze(rows) });
}

function comparisonTable(state: Extract<IntCp005State, { qlId: "INT-QL-095" }>, locale: IntCp005Locale): Readonly<{ headers: readonly string[]; rows: readonly (readonly string[])[] }> {
  const headers = Object.freeze([local(locale, "Year", "वर्ष", "ਸਾਲ"), local(locale, "Plan A", "योजना A", "ਯੋਜਨਾ A"), local(locale, "Plan B", "योजना B", "ਯੋਜਨਾ B")]);
  const rows = state.planARates.map((rate, index) => Object.freeze([String(index + 1), rateText(rate), rateText(state.planBRates[index]!) ]));
  return Object.freeze({ headers, rows: Object.freeze(rows) });
}

function promptFor(state: IntCp005State, locale: IntCp005Locale): string {
  switch (state.qlId) {
    case "INT-QL-086": {
      const sequence = rateSequence(state.rates, locale);
      if (state.context === "POPULATION") return local(locale,
        `A town has a population of ${unitValue(state.initial, state.context, locale)}. It grows by ${sequence}. What will the population be after ${state.rates.length} years?`,
        `एक नगर की जनसंख्या ${unitValue(state.initial, state.context, locale)} है। इसमें ${sequence} की वृद्धि होती है। ${state.rates.length} वर्षों बाद जनसंख्या कितनी होगी?`,
        `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${unitValue(state.initial, state.context, locale)} ਹੈ। ਇਸ ਵਿੱਚ ${sequence} ਹੁੰਦਾ ਹੈ। ${state.rates.length} ਸਾਲਾਂ ਬਾਅਦ ਆਬਾਦੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`);
      if (state.context === "SALARY") return local(locale,
        `An employee's annual salary is ${money(state.initial)}. It increases by ${sequence}. What will the annual salary be after ${state.rates.length} years?`,
        `एक कर्मचारी का वार्षिक वेतन ${money(state.initial)} है। इसमें ${sequence} की वृद्धि होती है। ${state.rates.length} वर्षों बाद वार्षिक वेतन कितना होगा?`,
        `ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ ${money(state.initial)} ਹੈ। ਇਸ ਵਿੱਚ ${sequence} ਹੁੰਦਾ ਹੈ। ${state.rates.length} ਸਾਲਾਂ ਬਾਅਦ ਸਾਲਾਨਾ ਤਨਖਾਹ ਕਿੰਨੀ ਹੋਵੇਗੀ?`);
      if (state.context === "PRODUCTION") return local(locale,
        `A plant can produce ${unitValue(state.initial, state.context, locale)} a year. Capacity increases by ${sequence}. What will its annual capacity be after ${state.rates.length} years?`,
        `एक संयंत्र की वार्षिक उत्पादन क्षमता ${unitValue(state.initial, state.context, locale)} है। इसमें ${sequence} की वृद्धि होती है। ${state.rates.length} वर्षों बाद वार्षिक क्षमता कितनी होगी?`,
        `ਇੱਕ ਪਲਾਂਟ ਦੀ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ ${unitValue(state.initial, state.context, locale)} ਹੈ। ਇਸ ਵਿੱਚ ${sequence} ਹੁੰਦਾ ਹੈ। ${state.rates.length} ਸਾਲਾਂ ਬਾਅਦ ਸਾਲਾਨਾ ਸਮਰੱਥਾ ਕਿੰਨੀ ਹੋਵੇਗੀ?`);
      return local(locale,
        `${money(state.initial)} is invested for ${state.rates.length} years. The annual compound rates are ${sequence}. What amount will be received at the end?`,
        `${money(state.initial)} को ${state.rates.length} वर्षों के लिए निवेश किया गया है। वार्षिक चक्रवृद्धि दरें ${sequence} हैं। अंत में कितनी राशि मिलेगी?`,
        `${money(state.initial)} ਨੂੰ ${state.rates.length} ਸਾਲਾਂ ਲਈ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ। ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ${sequence} ਹਨ। ਅੰਤ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?`);
    }
    case "INT-QL-087": return local(locale,
      `${money(state.initial)} is invested for ${state.rates.length} years at annual compound rates of ${rateSequence(state.rates, locale)}. How much compound interest is earned in all?`,
      `${money(state.initial)} को ${state.rates.length} वर्षों के लिए ${rateSequence(state.rates, locale)} की वार्षिक चक्रवृद्धि दरों पर निवेश किया गया है। कुल चक्रवृद्धि ब्याज कितना होगा?`,
      `${money(state.initial)} ਨੂੰ ${state.rates.length} ਸਾਲਾਂ ਲਈ ${rateSequence(state.rates, locale)} ਦੀਆਂ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ 'ਤੇ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ। ਕੁੱਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`);
    case "INT-QL-088": {
      const final = unitValue(state.finalValue, state.context, locale);
      if (state.context === "POPULATION") return local(locale,
        `After ${state.rates.length} years a town's population is ${final}. The yearly growth rates were ${rateSequence(state.rates, locale)}. What was the population at the beginning?`,
        `${state.rates.length} वर्षों बाद एक नगर की जनसंख्या ${final} है। वार्षिक वृद्धि दरें ${rateSequence(state.rates, locale)} थीं। प्रारंभिक जनसंख्या कितनी थी?`,
        `${state.rates.length} ਸਾਲਾਂ ਬਾਅਦ ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${final} ਹੈ। ਸਾਲਾਨਾ ਵਾਧੇ ਦੀਆਂ ਦਰਾਂ ${rateSequence(state.rates, locale)} ਸਨ। ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨੀ ਸੀ?`);
      return local(locale,
        `An amount grows to ${final} after ${state.rates.length} years at annual compound rates of ${rateSequence(state.rates, locale)}. What was the initial amount?`,
        `एक राशि ${state.rates.length} वर्षों में ${rateSequence(state.rates, locale)} की वार्षिक चक्रवृद्धि दरों पर बढ़कर ${final} हो जाती है। प्रारंभिक राशि कितनी थी?`,
        `ਇੱਕ ਰਕਮ ${state.rates.length} ਸਾਲਾਂ ਵਿੱਚ ${rateSequence(state.rates, locale)} ਦੀਆਂ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ਨਾਲ ਵੱਧ ਕੇ ${final} ਹੋ ਜਾਂਦੀ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕਿੰਨੀ ਸੀ?`);
    }
    case "INT-QL-089": {
      const visible = state.rates.map((rate, index) => index === state.missingIndex ? "?" : rateText(rate));
      return local(locale,
        `${money(state.initial)} becomes ${money(state.finalValue)} in 3 years under annual compounding. The rates for the three years are ${visible.join(", ")}, respectively. What is the missing rate?`,
        `${money(state.initial)} वार्षिक चक्रवृद्धि पर 3 वर्षों में ${money(state.finalValue)} हो जाता है। तीन वर्षों की दरें क्रमशः ${visible.join(", ")} हैं। लुप्त दर कितनी है?`,
        `${money(state.initial)} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ 3 ਸਾਲਾਂ ਵਿੱਚ ${money(state.finalValue)} ਹੋ ਜਾਂਦਾ ਹੈ। ਤਿੰਨ ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${visible.join(", ")} ਹਨ। ਗੁੰਮ ਦਰ ਕਿੰਨੀ ਹੈ?`);
    }
    case "INT-QL-090": return local(locale,
      `The present value of a ${state.context === "VEHICLE" ? "vehicle" : state.context === "MACHINE" ? "machine" : "capital asset"} is ${money(state.initial)}. It depreciates at ${rateSequence(state.decayRates, locale, "DECAY")}. What will its value be after ${state.decayRates.length} years?`,
      `एक ${state.context === "VEHICLE" ? "वाहन" : state.context === "MACHINE" ? "मशीन" : "पूंजीगत संपत्ति"} का वर्तमान मूल्य ${money(state.initial)} है। इसमें ${rateSequence(state.decayRates, locale, "DECAY")} का मूल्यह्रास होता है। ${state.decayRates.length} वर्षों बाद इसका मूल्य कितना होगा?`,
      `ਇੱਕ ${state.context === "VEHICLE" ? "ਵਾਹਨ" : state.context === "MACHINE" ? "ਮਸ਼ੀਨ" : "ਪੂੰਜੀ ਸੰਪਤੀ"} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਵਿੱਚ ${rateSequence(state.decayRates, locale, "DECAY")} ਦਾ ਮੁੱਲ ਘਟਾਅ ਹੁੰਦਾ ਹੈ। ${state.decayRates.length} ਸਾਲਾਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`);
    case "INT-QL-091": return local(locale,
      `After ${state.decayRates.length} years of depreciation, a ${state.context === "VEHICLE" ? "vehicle" : state.context === "MACHINE" ? "machine" : "capital asset"} is worth ${money(state.finalValue)}. The yearly depreciation rates were ${rateSequence(state.decayRates, locale, "DECAY")}. What was its original value?`,
      `${state.decayRates.length} वर्षों के मूल्यह्रास के बाद एक ${state.context === "VEHICLE" ? "वाहन" : state.context === "MACHINE" ? "मशीन" : "पूंजीगत संपत्ति"} का मूल्य ${money(state.finalValue)} है। वार्षिक मूल्यह्रास दरें ${rateSequence(state.decayRates, locale, "DECAY")} थीं। इसका मूल मूल्य कितना था?`,
      `${state.decayRates.length} ਸਾਲਾਂ ਦੇ ਮੁੱਲ ਘਟਾਅ ਤੋਂ ਬਾਅਦ ਇੱਕ ${state.context === "VEHICLE" ? "ਵਾਹਨ" : state.context === "MACHINE" ? "ਮਸ਼ੀਨ" : "ਪੂੰਜੀ ਸੰਪਤੀ"} ਦਾ ਮੁੱਲ ${money(state.finalValue)} ਹੈ। ਸਾਲਾਨਾ ਮੁੱਲ ਘਟਾਅ ਦੀਆਂ ਦਰਾਂ ${rateSequence(state.decayRates, locale, "DECAY")} ਸਨ। ਇਸ ਦਾ ਮੂਲ ਮੁੱਲ ਕਿੰਨਾ ਸੀ?`);
    case "INT-QL-092": return local(locale,
      `An asset is initially worth ${money(state.initial)}. Its value changes as follows: ${signedSequence(state.signedRates, locale)}. What is its value after the last year?`,
      `एक संपत्ति का प्रारंभिक मूल्य ${money(state.initial)} है। इसके मूल्य में क्रमशः ${signedSequence(state.signedRates, locale)} होता है। अंतिम वर्ष के बाद इसका मूल्य कितना होगा?`,
      `ਇੱਕ ਸੰਪਤੀ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${signedSequence(state.signedRates, locale)} ਹੁੰਦਾ ਹੈ। ਆਖਰੀ ਸਾਲ ਤੋਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`);
    case "INT-QL-093": return state.direction === "GROWTH"
      ? local(locale,
          `A population of ${unitValue(state.initial, "POPULATION", locale)} grows by ${rateText(state.rate)} every year. After how many complete years will it first reach at least ${unitValue(state.threshold, "POPULATION", locale)}?`,
          `${unitValue(state.initial, "POPULATION", locale)} की जनसंख्या हर वर्ष ${rateText(state.rate)} बढ़ती है। कितने पूरे वर्षों बाद यह पहली बार कम-से-कम ${unitValue(state.threshold, "POPULATION", locale)} होगी?`,
          `${unitValue(state.initial, "POPULATION", locale)} ਦੀ ਆਬਾਦੀ ਹਰ ਸਾਲ ${rateText(state.rate)} ਵਧਦੀ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਹ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${unitValue(state.threshold, "POPULATION", locale)} ਹੋਵੇਗੀ?`)
      : local(locale,
          `An asset worth ${money(state.initial)} depreciates by ${rateText(state.rate)} every year. After how many complete years will its value first fall to ${money(state.threshold)} or below?`,
          `${money(state.initial)} की संपत्ति का मूल्य हर वर्ष ${rateText(state.rate)} घटता है। कितने पूरे वर्षों बाद इसका मूल्य पहली बार ${money(state.threshold)} या उससे कम होगा?`,
          `${money(state.initial)} ਦੀ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ਹਰ ਸਾਲ ${rateText(state.rate)} ਘਟਦਾ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${money(state.threshold)} ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਵੇਗਾ?`);
    case "INT-QL-094": {
      const adjustment = state.adjustment.numerator >= 0n ? state.adjustment : rat(-state.adjustment.numerator, state.adjustment.denominator);
      const movement = state.adjustment.numerator >= 0n
        ? local(locale, `${countText(adjustment, locale)} people migrate in`, `${countText(adjustment, locale)} बाहर से आकर बसते हैं`, `${countText(adjustment, locale)} ਬਾਹਰੋਂ ਆ ਕੇ ਵੱਸਦੇ ਹਨ`)
        : local(locale, `${countText(adjustment, locale)} people migrate out`, `${countText(adjustment, locale)} लोग बाहर चले जाते हैं`, `${countText(adjustment, locale)} ਲੋਕ ਬਾਹਰ ਚਲੇ ਜਾਂਦੇ ਹਨ`);
      const order = state.eventOrder === "GROWTH_THEN_ADJUSTMENT"
        ? local(locale, `First the population grows by ${rateText(state.rate)}; then ${movement} at the end of each year.`, `हर वर्ष पहले जनसंख्या ${rateText(state.rate)} बढ़ती है; उसके बाद ${movement}।`, `ਹਰ ਸਾਲ ਪਹਿਲਾਂ ਆਬਾਦੀ ${rateText(state.rate)} ਵਧਦੀ ਹੈ; ਉਸ ਤੋਂ ਬਾਅਦ ${movement}।`)
        : local(locale, `At the start of each year ${movement}; after that the population grows by ${rateText(state.rate)}.`, `हर वर्ष की शुरुआत में ${movement}; उसके बाद जनसंख्या ${rateText(state.rate)} बढ़ती है।`, `ਹਰ ਸਾਲ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ${movement}; ਉਸ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ ${rateText(state.rate)} ਵਧਦੀ ਹੈ।`);
      return local(locale,
        `A town starts with ${countText(state.initial, locale)}. ${order} What will the population be after ${state.years} years?`,
        `एक नगर की प्रारंभिक जनसंख्या ${countText(state.initial, locale)} है। ${order} ${state.years} वर्षों बाद जनसंख्या कितनी होगी?`,
        `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ${countText(state.initial, locale)} ਹੈ। ${order} ${state.years} ਸਾਲਾਂ ਬਾਅਦ ਆਬਾਦੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`);
    }
    case "INT-QL-095": return local(locale,
      `The same sum of ${money(state.initial)} is invested for 3 years under Plan A and Plan B. The yearly rates are shown below. By how much do the final amounts differ?`,
      `समान राशि ${money(state.initial)} को 3 वर्षों के लिए योजना A और योजना B में निवेश किया जाता है। वार्षिक दरें नीचे दी गई हैं। अंतिम राशियों में कितना अंतर होगा?`,
      `ਇੱਕੋ ਜਿਹੀ ਰਕਮ ${money(state.initial)} ਨੂੰ 3 ਸਾਲਾਂ ਲਈ ਯੋਜਨਾ A ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਸਾਲਾਨਾ ਦਰਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ। ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?`);
  }
}

function presentationFor(state: IntCp005State, seed: string, locale: IntCp005Locale): IntCp005Question["presentation"] & { representation: IntCp005Representation } {
  const representation = representationFor(state, seed);
  const prompt = promptFor(state, locale);
  if (representation === "STANDARD_PROSE") return deepFreeze({ representation, markdown: prompt, prompt });
  const table = state.qlId === "INT-QL-095" ? comparisonTable(state, locale) : rateTable(state, locale)!;
  const lead = state.qlId === "INT-QL-095"
    ? local(locale, `The same sum of ${money(state.initial)} is invested for 3 years under two plans.`, `समान राशि ${money(state.initial)} को 3 वर्षों के लिए दो योजनाओं में निवेश किया जाता है।`, `ਇੱਕੋ ਜਿਹੀ ਰਕਮ ${money(state.initial)} ਨੂੰ 3 ਸਾਲਾਂ ਲਈ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`)
    : local(locale, "The period-wise rates are given below.", "अवधि-वार दरें नीचे दी गई हैं।", "ਮਿਆਦ-ਵਾਰ ਦਰਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।");
  const finalPrompt = state.qlId === "INT-QL-095"
    ? local(locale, "By how much do the final amounts differ?", "अंतिम राशियों में कितना अंतर होगा?", "ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?")
    : prompt;
  return deepFreeze({ representation, markdown: `${lead}\n\n${tableMarkdown(table.headers, table.rows)}\n\n${finalPrompt}`, prompt: finalPrompt, table });
}

function optionFeedback(locale: IntCp005Locale, id: string): string {
  const map: Record<string, readonly [string, string, string]> = {
    CORRECT: ["Correct. The complete period-by-period accumulation is used.", "सही। सभी अवधियों की क्रमिक चक्रवृद्धि का उपयोग किया गया है।", "ਸਹੀ। ਸਾਰੀਆਂ ਮਿਆਦਾਂ ਦੀ ਕ੍ਰਮਵਾਰ ਮਿਸ਼ਰਤ ਵਾਧੇ ਦੀ ਗਿਣਤੀ ਕੀਤੀ ਗਈ ਹੈ।"],
    SIMPLE_RATE_ADDITION: ["This adds the percentage rates as if every change were on the original value.", "यह सभी प्रतिशत दरों को ऐसे जोड़ता है जैसे हर बदलाव मूल मूल्य पर हुआ हो।", "ਇਹ ਸਾਰੀਆਂ ਪ੍ਰਤੀਸ਼ਤ ਦਰਾਂ ਨੂੰ ਐਸੇ ਜੋੜਦਾ ਹੈ ਜਿਵੇਂ ਹਰ ਬਦਲਾਅ ਮੂਲ ਮੁੱਲ 'ਤੇ ਹੋਇਆ ਹੋਵੇ।"],
    OMIT_LAST_PERIOD: ["This stops one period too early.", "यह एक अवधि पहले रुक जाता है।", "ਇਹ ਇੱਕ ਮਿਆਦ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
    FINAL_VALUE_NOT_GAIN: ["This is the final amount, not the compound gain asked for.", "यह अंतिम राशि है, पूछा गया चक्रवृद्धि लाभ नहीं।", "ਇਹ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਪੁੱਛਿਆ ਗਿਆ ਮਿਸ਼ਰਤ ਲਾਭ ਨਹੀਂ।"],
    FIRST_PERIOD_ONLY: ["This uses only the first period's change.", "यह केवल पहली अवधि के बदलाव का उपयोग करता है।", "ਇਹ ਸਿਰਫ਼ ਪਹਿਲੀ ਮਿਆਦ ਦੇ ਬਦਲਾਅ ਨੂੰ ਵਰਤਦਾ ਹੈ।"],
    COPY_FINAL_VALUE: ["The observed final value is not the initial value.", "दी गई अंतिम राशि प्रारंभिक राशि नहीं है।", "ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਨਹੀਂ ਹੈ।"],
    REVERSE_SIMPLE: ["This reverses the rates linearly instead of dividing by each compound factor.", "यह हर चक्रवृद्धि गुणक से भाग देने के बजाय दरों को रैखिक रूप से उलटता है।", "ਇਹ ਹਰ ਮਿਸ਼ਰਤ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇਣ ਦੀ ਥਾਂ ਦਰਾਂ ਨੂੰ ਰੇਖੀ ਤਰੀਕੇ ਨਾਲ ਉਲਟਦਾ ਹੈ।"],
    COPY_NEIGHBOUR_RATE: ["This copies another year's rate instead of solving the missing factor.", "यह लुप्त गुणक निकालने के बजाय किसी दूसरे वर्ष की दर को दोहराता है।", "ਇਹ ਗੁੰਮ ਗੁਣਕ ਕੱਢਣ ਦੀ ਥਾਂ ਕਿਸੇ ਹੋਰ ਸਾਲ ਦੀ ਦਰ ਨੂੰ ਦੁਹਰਾਉਂਦਾ ਹੈ।"],
    TOTAL_GROWTH_AS_RATE: ["This treats total multi-year growth as the missing one-year rate.", "यह कई वर्षों की कुल वृद्धि को एक वर्ष की लुप्त दर मानता है।", "ਇਹ ਕਈ ਸਾਲਾਂ ਦੇ ਕੁੱਲ ਵਾਧੇ ਨੂੰ ਇੱਕ ਸਾਲ ਦੀ ਗੁੰਮ ਦਰ ਮੰਨਦਾ ਹੈ।"],
    DEPRECIATION_AS_GROWTH: ["Depreciation uses a factor below 1, not a growth factor above 1.", "मूल्यह्रास में 1 से कम गुणक लगता है, वृद्धि वाला गुणक नहीं।", "ਮੁੱਲ ਘਟਾਅ ਵਿੱਚ 1 ਤੋਂ ਘੱਟ ਗੁਣਕ ਲੱਗਦਾ ਹੈ, ਵਾਧੇ ਵਾਲਾ ਗੁਣਕ ਨਹੀਂ।"],
    SIMPLE_DEPRECIATION: ["This subtracts all depreciation percentages from the original value instead of compounding the reductions.", "यह हर वर्ष की कमी को घटते हुए मूल्य पर लगाने के बजाय मूल मूल्य से सभी प्रतिशत घटाता है।", "ਇਹ ਹਰ ਸਾਲ ਦੀ ਘਾਟ ਨੂੰ ਘਟਦੇ ਮੁੱਲ 'ਤੇ ਲਗਾਉਣ ਦੀ ਥਾਂ ਮੂਲ ਮੁੱਲ ਤੋਂ ਸਾਰੇ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉਂਦਾ ਹੈ।"],
    IGNORE_DECLINE_SIGNS: ["This treats every period as growth and ignores the decline periods.", "यह कमी वाली अवधियों को भी वृद्धि मान लेता है।", "ਇਹ ਘਾਟ ਵਾਲੀਆਂ ਮਿਆਦਾਂ ਨੂੰ ਵੀ ਵਾਧਾ ਮੰਨ ਲੈਂਦਾ ਹੈ।"],
    NET_RATE_ONLY: ["This adds and subtracts rates once instead of multiplying the successive factors.", "यह क्रमिक गुणकों को गुणा करने के बजाय दरों को केवल जोड़-घटा देता है।", "ਇਹ ਕ੍ਰਮਵਾਰ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਨ ਦੀ ਥਾਂ ਦਰਾਂ ਨੂੰ ਸਿਰਫ਼ ਜੋੜ-ਘਟਾ ਦਿੰਦਾ ਹੈ।"],
    ONE_YEAR_EARLY: ["The threshold has not yet been crossed one year earlier.", "एक वर्ष पहले सीमा अभी पार नहीं हुई है।", "ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ ਹੱਦ ਹਾਲੇ ਪਾਰ ਨਹੀਂ ਹੋਈ।"],
    ONE_YEAR_LATE: ["The threshold is already crossed before this year.", "इस वर्ष से पहले ही सीमा पार हो चुकी है।", "ਇਸ ਸਾਲ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਹੱਦ ਪਾਰ ਹੋ ਚੁੱਕੀ ਹੈ।"],
    WRONG_EVENT_ORDER: ["This applies migration and percentage growth in the opposite order.", "यह प्रवासन और प्रतिशत वृद्धि का क्रम उलट देता है।", "ਇਹ ਮਾਈਗ੍ਰੇਸ਼ਨ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਦਾ ਕ੍ਰਮ ਉਲਟ ਦਿੰਦਾ ਹੈ।"],
    IGNORE_ADJUSTMENT: ["This ignores the fixed migration adjustment.", "यह निश्चित प्रवासन बदलाव को नज़रअंदाज़ करता है।", "ਇਹ ਨਿਸ਼ਚਿਤ ਮਾਈਗ੍ਰੇਸ਼ਨ ਬਦਲਾਅ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ।"],
    APPLY_ADJUSTMENT_ONCE: ["The fixed migration event occurs every year, not only once.", "निश्चित प्रवासन घटना हर वर्ष होती है, केवल एक बार नहीं।", "ਨਿਸ਼ਚਿਤ ਮਾਈਗ੍ਰੇਸ਼ਨ ਘਟਨਾ ਹਰ ਸਾਲ ਹੁੰਦੀ ਹੈ, ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਨਹੀਂ।"],
    SIMPLE_PLAN_DIFFERENCE: ["This compares the sums of rates instead of the two compound final values.", "यह दोनों चक्रवृद्धि अंतिम राशियों के बजाय दरों के योग की तुलना करता है।", "ਇਹ ਦੋਨਾਂ ਮਿਸ਼ਰਤ ਅੰਤਿਮ ਰਕਮਾਂ ਦੀ ਥਾਂ ਦਰਾਂ ਦੇ ਜੋੜ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ।"],
    PLAN_A_AMOUNT: ["This is Plan A's final amount, not the difference between the plans.", "यह योजना A की अंतिम राशि है, दोनों योजनाओं का अंतर नहीं।", "ਇਹ ਯੋਜਨਾ A ਦੀ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਦੋਨਾਂ ਯੋਜਨਾਵਾਂ ਦਾ ਅੰਤਰ ਨਹੀਂ।"],
    PLAN_B_AMOUNT: ["This is Plan B's final amount, not the difference between the plans.", "यह योजना B की अंतिम राशि है, दोनों योजनाओं का अंतर नहीं।", "ਇਹ ਯੋਜਨਾ B ਦੀ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਦੋਨਾਂ ਯੋਜਨਾਵਾਂ ਦਾ ਅੰਤਰ ਨਹੀਂ।"],
    NEARBY_ARITHMETIC: ["This is a nearby arithmetic result but it does not satisfy the full periodic relation.", "यह पास का गणितीय परिणाम है, पर पूरी आवधिक शर्त को संतुष्ट नहीं करता।", "ਇਹ ਨੇੜਲਾ ਗਣਿਤੀ ਨਤੀਜਾ ਹੈ, ਪਰ ਪੂਰੀ ਮਿਆਦੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।"],
  };
  const triple = map[id] ?? map.NEARBY_ARITHMETIC!;
  return locale === "en-IN" ? triple[0] : locale === "hi-IN" ? triple[1] : triple[2];
}

interface WrongCandidate { readonly value: Rational; readonly misconceptionId: string }
function sumRates(rates: readonly Rational[]): Rational { return rates.reduce((acc, rate) => add(acc, rate), rat(0n)); }
function simpleGrowthValue(initial: Rational, rates: readonly Rational[]): Rational { return mul(initial, add(rat(1n), div(sumRates(rates), rat(100n)))); }
function simpleDecayValue(initial: Rational, rates: readonly Rational[]): Rational { return mul(initial, sub(rat(1n), div(sumRates(rates), rat(100n)))); }
function optionsFor(state: IntCp005State, solution: Rational, semantic: IntCp005AnswerSemantic, locale: IntCp005Locale): readonly IntCp005Option[] {
  let candidates: WrongCandidate[] = [];
  switch (state.qlId) {
    case "INT-QL-086": candidates = [
      { value: simpleGrowthValue(state.initial, state.rates), misconceptionId: "SIMPLE_RATE_ADDITION" },
      { value: amountFromGrowth(state.initial, state.rates.slice(0, -1)), misconceptionId: "OMIT_LAST_PERIOD" },
      { value: add(state.initial, mul(state.initial, div(state.rates[0]!, rat(100n)))), misconceptionId: "FIRST_PERIOD_ONLY" },
    ]; break;
    case "INT-QL-087": candidates = [
      { value: amountFromGrowth(state.initial, state.rates), misconceptionId: "FINAL_VALUE_NOT_GAIN" },
      { value: sub(simpleGrowthValue(state.initial, state.rates), state.initial), misconceptionId: "SIMPLE_RATE_ADDITION" },
      { value: mul(state.initial, div(state.rates[0]!, rat(100n))), misconceptionId: "FIRST_PERIOD_ONLY" },
    ]; break;
    case "INT-QL-088": candidates = [
      { value: state.finalValue, misconceptionId: "COPY_FINAL_VALUE" },
      { value: div(state.finalValue, add(rat(1n), div(sumRates(state.rates), rat(100n)))), misconceptionId: "REVERSE_SIMPLE" },
      { value: div(state.finalValue, productGrowthRates(state.rates.slice(0, -1))), misconceptionId: "OMIT_LAST_PERIOD" },
    ]; break;
    case "INT-QL-089": {
      const neighbour = state.rates[(state.missingIndex + 1) % state.rates.length]!;
      const totalGrowthRate = mul(sub(div(state.finalValue, state.initial), rat(1n)), rat(100n));
      const known = state.rates.filter((_rate, index) => index !== state.missingIndex);
      candidates = [
        { value: neighbour, misconceptionId: "COPY_NEIGHBOUR_RATE" },
        { value: sub(totalGrowthRate, sumRates(known)), misconceptionId: "SIMPLE_RATE_ADDITION" },
        { value: totalGrowthRate, misconceptionId: "TOTAL_GROWTH_AS_RATE" },
      ]; break;
    }
    case "INT-QL-090": candidates = [
      { value: simpleDecayValue(state.initial, state.decayRates), misconceptionId: "SIMPLE_DEPRECIATION" },
      { value: amountFromDecay(state.initial, state.decayRates.slice(0, -1)), misconceptionId: "OMIT_LAST_PERIOD" },
      { value: amountFromGrowth(state.initial, state.decayRates), misconceptionId: "DEPRECIATION_AS_GROWTH" },
    ]; break;
    case "INT-QL-091": candidates = [
      { value: state.finalValue, misconceptionId: "COPY_FINAL_VALUE" },
      { value: div(state.finalValue, sub(rat(1n), div(sumRates(state.decayRates), rat(100n)))), misconceptionId: "REVERSE_SIMPLE" },
      { value: div(state.finalValue, productGrowthRates(state.decayRates)), misconceptionId: "DEPRECIATION_AS_GROWTH" },
    ]; break;
    case "INT-QL-092": {
      const allGrowth = state.signedRates.map(absRat);
      const simpleNet = mul(state.initial, add(rat(1n), div(sumRates(state.signedRates), rat(100n))));
      candidates = [
        { value: amountFromGrowth(state.initial, allGrowth), misconceptionId: "IGNORE_DECLINE_SIGNS" },
        { value: simpleNet, misconceptionId: "NET_RATE_ONLY" },
        { value: mul(state.initial, productSignedRates(state.signedRates.slice(0, -1))), misconceptionId: "OMIT_LAST_PERIOD" },
      ]; break;
    }
    case "INT-QL-093": candidates = [
      { value: rat(BigInt(Math.max(1, state.targetYear - 1))), misconceptionId: "ONE_YEAR_EARLY" },
      { value: rat(BigInt(state.targetYear + 1)), misconceptionId: "ONE_YEAR_LATE" },
      { value: rat(BigInt(state.targetYear + 2)), misconceptionId: "NEARBY_ARITHMETIC" },
    ]; break;
    case "INT-QL-094": {
      const opposite: IntCp005EventOrder = state.eventOrder === "GROWTH_THEN_ADJUSTMENT" ? "ADJUSTMENT_THEN_GROWTH" : "GROWTH_THEN_ADJUSTMENT";
      const factorValue = growthFactor(state.rate);
      const ignoreAdjustment = mul(state.initial, pow(factorValue, state.years));
      const oneAdjustment = state.eventOrder === "GROWTH_THEN_ADJUSTMENT" ? add(ignoreAdjustment, state.adjustment) : mul(add(state.initial, state.adjustment), pow(factorValue, state.years));
      candidates = [
        { value: eventValue(state.initial, state.rate, state.years, state.adjustment, opposite), misconceptionId: "WRONG_EVENT_ORDER" },
        { value: ignoreAdjustment, misconceptionId: "IGNORE_ADJUSTMENT" },
        { value: oneAdjustment, misconceptionId: "APPLY_ADJUSTMENT_ONCE" },
      ]; break;
    }
    case "INT-QL-095": {
      const a = amountFromGrowth(state.initial, state.planARates);
      const b = amountFromGrowth(state.initial, state.planBRates);
      const simpleA = simpleGrowthValue(state.initial, state.planARates);
      const simpleB = simpleGrowthValue(state.initial, state.planBRates);
      candidates = [
        { value: absRat(sub(simpleA, simpleB)), misconceptionId: "SIMPLE_PLAN_DIFFERENCE" },
        { value: a, misconceptionId: "PLAN_A_AMOUNT" },
        { value: b, misconceptionId: "PLAN_B_AMOUNT" },
      ]; break;
    }
  }

  const normalize = (value: Rational): Rational => semantic === "RATE_PERCENT" ? roundRational(value, 2) : semantic === "TIME_YEARS" ? roundRational(value, 0) : roundRational(value, 0);
  const correctValue = semantic === "RATE_PERCENT" ? roundRational(solution, 2) : solution;
  const wrong: WrongCandidate[] = [];
  for (const candidate of candidates) {
    const value = normalize(candidate.value);
    if (eq(value, correctValue) || wrong.some((entry) => eq(entry.value, value))) continue;
    wrong.push({ value, misconceptionId: candidate.misconceptionId });
  }
  let bump = 1n;
  while (wrong.length < 3) {
    const base = semantic === "RATE_PERCENT" ? add(correctValue, rat(bump)) : semantic === "TIME_YEARS" ? add(correctValue, rat(bump)) : add(correctValue, rat(100n * bump));
    const value = normalize(base);
    if (!eq(value, correctValue) && !wrong.some((entry) => eq(entry.value, value))) wrong.push({ value, misconceptionId: "NEARBY_ARITHMETIC" });
    bump += 1n;
  }

  const items: IntCp005Option[] = [
    { text: formatAnswer(semantic, correctValue, state.context, locale), value: correctValue, misconceptionId: "CORRECT", studentFeedback: optionFeedback(locale, "CORRECT"), isCorrect: true },
    ...wrong.slice(0, 3).map((candidate) => ({ text: formatAnswer(semantic, candidate.value, state.context, locale), value: candidate.value, misconceptionId: candidate.misconceptionId, studentFeedback: optionFeedback(locale, candidate.misconceptionId), isCorrect: false })),
  ];
  let h = hash(`${state.qlId}:${state.context}:${stateFingerprint(state)}:option-shuffle`);
  for (let index = items.length - 1; index > 0; index -= 1) {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    const target = (h >>> 0) % (index + 1);
    [items[index], items[target]] = [items[target]!, items[index]!];
  }
  return deepFreeze(items);
}

function ratesLatex(rates: readonly Rational[], sign: "PLUS" | "MINUS" = "PLUS"): string { return rates.map((rate) => factorLatex(rate, sign)).join("\\times"); }
function signedRatesLatex(rates: readonly Rational[]): string { return rates.map(signedFactorLatex).join("\\times"); }
function formulaPrefix(locale: IntCp005Locale): string { return local(locale, "Formula:", "सूत्र:", "ਸੂਤਰ:"); }
function substitutionPrefix(locale: IntCp005Locale): string { return local(locale, "Substitution:", "मान रखने पर:", "ਮੁੱਲ ਰੱਖਣ 'ਤੇ:"); }
function finalSentence(locale: IntCp005Locale, label: string, answer: string): string {
  return local(locale, `Therefore, ${label} is ${answer}.`, `अतः ${label} ${answer} है।`, `ਇਸ ਲਈ ${label} ${answer} ਹੈ।`);
}
function explanationFor(state: IntCp005State, solution: Rational, semantic: IntCp005AnswerSemantic, locale: IntCp005Locale): IntCp005Explanation {
  const answer = formatAnswer(semantic, solution, state.context, locale);
  let keyIdea = "";
  let steps: string[] = [];
  let commonMistake = "";
  switch (state.qlId) {
    case "INT-QL-086": {
      keyIdea = local(locale, "Each year's percentage acts on the updated value, so the yearly factors must be multiplied.", "हर वर्ष का प्रतिशत उस समय के बढ़े हुए मूल्य पर लगता है, इसलिए वार्षिक गुणकों को गुणा किया जाता है।", "ਹਰ ਸਾਲ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਉਸ ਵੇਲੇ ਦੇ ਵਧੇ ਮੁੱਲ 'ਤੇ ਲੱਗਦਾ ਹੈ, ਇਸ ਲਈ ਸਾਲਾਨਾ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("V_n=V_0\\prod_{k=1}^{n}\\left(1+\\frac{r_k}{100}\\right)")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`V_n=${mathNumber(state.initial)}\\times${ratesLatex(state.rates)}=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the final value", "अंतिम मूल्य", "ਅੰਤਿਮ ਮੁੱਲ"), answer),
      ];
      commonMistake = optionFeedback(locale, "SIMPLE_RATE_ADDITION");
      break;
    }
    case "INT-QL-087": {
      const final = amountFromGrowth(state.initial, state.rates);
      keyIdea = local(locale, "First find the compound final amount; compound interest is final amount minus principal.", "पहले चक्रवृद्धि अंतिम राशि निकालें; चक्रवृद्धि ब्याज अंतिम राशि में से मूलधन घटाने पर मिलता है।", "ਪਹਿਲਾਂ ਮਿਸ਼ਰਤ ਅੰਤਿਮ ਰਕਮ ਕੱਢੋ; ਮਿਸ਼ਰਤ ਵਿਆਜ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾਉਣ ਨਾਲ ਮਿਲਦਾ ਹੈ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("CI=P\\left[\\prod_{k=1}^{n}\\left(1+\\frac{r_k}{100}\\right)-1\\right]")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`A=${mathNumber(state.initial)}\\times${ratesLatex(state.rates)}=${mathNumber(final)}`)}.`,
        `${local(locale, "Interest:", "ब्याज:", "ਵਿਆਜ:")} ${mathWrapped(`CI=${mathNumber(final)}-${mathNumber(state.initial)}=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the compound interest", "चक्रवृद्धि ब्याज", "ਮਿਸ਼ਰਤ ਵਿਆਜ"), answer),
      ];
      commonMistake = optionFeedback(locale, "FINAL_VALUE_NOT_GAIN");
      break;
    }
    case "INT-QL-088": {
      keyIdea = local(locale, "Work backward by dividing the observed final value by the complete product of yearly growth factors.", "दी गई अंतिम राशि से पीछे जाते हुए उसे सभी वार्षिक वृद्धि गुणकों के गुणनफल से भाग दें।", "ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਪਿੱਛੇ ਜਾਂਦੇ ਹੋਏ ਇਸ ਨੂੰ ਸਾਰੇ ਸਾਲਾਨਾ ਵਾਧੇ ਦੇ ਗੁਣਕਾਂ ਦੇ ਗੁਣਨਫਲ ਨਾਲ ਭਾਗ ਦਿਓ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("V_0=\\frac{V_n}{\\prod_{k=1}^{n}(1+r_k/100)}")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`V_0=\\frac{${mathNumber(state.finalValue)}}{${ratesLatex(state.rates)}}=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the initial value", "प्रारंभिक मूल्य", "ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ"), answer),
      ];
      commonMistake = optionFeedback(locale, "REVERSE_SIMPLE");
      break;
    }
    case "INT-QL-089": {
      const knownFactors = state.rates.filter((_rate, index) => index !== state.missingIndex).map(growthFactor);
      const knownProduct = product(knownFactors);
      const missingFactor = div(div(state.finalValue, state.initial), knownProduct);
      keyIdea = local(locale, "Separate the known yearly factors. The remaining factor gives the missing one-year rate.", "ज्ञात वर्षों के गुणकों को अलग करें। बचा हुआ गुणक लुप्त वर्ष की दर देता है।", "ਜਾਣੇ ਹੋਏ ਸਾਲਾਂ ਦੇ ਗੁਣਕ ਵੱਖ ਕਰੋ। ਬਚਿਆ ਗੁਣਕ ਗੁੰਮ ਸਾਲ ਦੀ ਦਰ ਦਿੰਦਾ ਹੈ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("V_n=V_0\\left(\\prod \\text{known factors}\\right)\\left(1+\\frac{x}{100}\\right)")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`1+\\frac{x}{100}=\\frac{${mathNumber(state.finalValue)}}{${mathNumber(state.initial)}\\times${mathNumber(knownProduct)}}=${mathNumber(missingFactor)}`)}.`,
        `${local(locale, "So:", "इसलिए:", "ਇਸ ਲਈ:")} ${mathWrapped(`x=(${mathNumber(missingFactor)}-1)\\times100=${mathNumber(solution)}\\%`)}.`,
        finalSentence(locale, local(locale, "the missing rate", "लुप्त दर", "ਗੁੰਮ ਦਰ"), answer),
      ];
      commonMistake = optionFeedback(locale, "TOTAL_GROWTH_AS_RATE");
      break;
    }
    case "INT-QL-090": {
      keyIdea = local(locale, "Each depreciation percentage applies to the reduced value left after the previous year.", "हर वर्ष का मूल्यह्रास पिछले वर्ष के बाद बचे हुए घटे मूल्य पर लगता है।", "ਹਰ ਸਾਲ ਦਾ ਮੁੱਲ ਘਟਾਅ ਪਿਛਲੇ ਸਾਲ ਤੋਂ ਬਾਅਦ ਬਚੇ ਘੱਟ ਮੁੱਲ 'ਤੇ ਲੱਗਦਾ ਹੈ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("V_n=V_0\\prod_{k=1}^{n}\\left(1-\\frac{d_k}{100}\\right)")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`V_n=${mathNumber(state.initial)}\\times${ratesLatex(state.decayRates, "MINUS")}=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the depreciated value", "मूल्यह्रास के बाद का मूल्य", "ਮੁੱਲ ਘਟਾਅ ਤੋਂ ਬਾਅਦ ਦਾ ਮੁੱਲ"), answer),
      ];
      commonMistake = optionFeedback(locale, "SIMPLE_DEPRECIATION");
      break;
    }
    case "INT-QL-091": {
      keyIdea = local(locale, "Reverse depreciation by dividing by every remaining-value factor, not by adding the rates back.", "मूल्यह्रास को उलटने के लिए हर शेष-मूल्य गुणक से भाग दें; दरों को केवल वापस जोड़ना सही नहीं है।", "ਮੁੱਲ ਘਟਾਅ ਨੂੰ ਉਲਟਣ ਲਈ ਹਰ ਬਚੇ-ਮੁੱਲ ਦੇ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ; ਦਰਾਂ ਨੂੰ ਸਿਰਫ਼ ਵਾਪਸ ਜੋੜਨਾ ਸਹੀ ਨਹੀਂ ਹੈ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("V_0=\\frac{V_n}{\\prod_{k=1}^{n}(1-d_k/100)}")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`V_0=\\frac{${mathNumber(state.finalValue)}}{${ratesLatex(state.decayRates, "MINUS")}}=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the original value", "मूल मूल्य", "ਮੂਲ ਮੁੱਲ"), answer),
      ];
      commonMistake = optionFeedback(locale, "REVERSE_SIMPLE");
      break;
    }
    case "INT-QL-092": {
      keyIdea = local(locale, "Use a growth factor for an increase and a remaining-value factor for a decrease, in the exact order given.", "वृद्धि के लिए वृद्धि-गुणक और कमी के लिए शेष-मूल्य गुणक उसी क्रम में लगाएँ जिस क्रम में वे दिए गए हैं।", "ਵਾਧੇ ਲਈ ਵਾਧੇ ਦਾ ਗੁਣਕ ਅਤੇ ਘਾਟ ਲਈ ਬਚੇ-ਮੁੱਲ ਦਾ ਗੁਣਕ ਠੀਕ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ ਜਿਸ ਕ੍ਰਮ ਵਿੱਚ ਉਹ ਦਿੱਤੇ ਹਨ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("V_n=V_0\\prod_{k=1}^{n}f_k,\\quad f_k=1\\pm\\frac{r_k}{100}")}.`,
        `${substitutionPrefix(locale)} ${mathWrapped(`V_n=${mathNumber(state.initial)}\\times${signedRatesLatex(state.signedRates)}=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the final asset value", "अंतिम संपत्ति मूल्य", "ਅੰਤਿਮ ਸੰਪਤੀ ਮੁੱਲ"), answer),
      ];
      commonMistake = optionFeedback(locale, "NET_RATE_ONLY");
      break;
    }
    case "INT-QL-093": {
      const factorValue = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const prior = mul(state.initial, pow(factorValue, state.targetYear - 1));
      const at = mul(state.initial, pow(factorValue, state.targetYear));
      const sign = state.direction === "GROWTH" ? "+" : "-";
      keyIdea = local(locale, "A threshold question needs the first period that crosses the boundary, so check both that period and the one immediately before it.", "सीमा वाले प्रश्न में पहली सीमा-पार अवधि चाहिए, इसलिए उस अवधि और उससे ठीक पहले की अवधि दोनों की जाँच करें।", "ਹੱਦ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪਹਿਲੀ ਹੱਦ-ਪਾਰ ਮਿਆਦ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਉਸ ਮਿਆਦ ਅਤੇ ਉਸ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਵਾਲੀ ਮਿਆਦ ਦੋਵੇਂ ਜਾਂਚੋ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped(`V_t=V_0\\left(1${sign}\\frac{r}{100}\\right)^t`)}.`,
        `${local(locale, "Boundary check:", "सीमा जाँच:", "ਹੱਦ ਜਾਂਚ:")} ${mathWrapped(`V_{${state.targetYear - 1}}=${mathNumber(prior)},\\quad V_{${state.targetYear}}=${mathNumber(at)}`)}.`,
        finalSentence(locale, local(locale, "the first crossing time", "पहली सीमा-पार अवधि", "ਪਹਿਲੀ ਹੱਦ-ਪਾਰ ਮਿਆਦ"), answer),
      ];
      commonMistake = optionFeedback(locale, "ONE_YEAR_EARLY");
      break;
    }
    case "INT-QL-094": {
      const formula = state.eventOrder === "GROWTH_THEN_ADJUSTMENT"
        ? "B_k=B_{k-1}(1+r/100)+M"
        : "B_k=(B_{k-1}+M)(1+r/100)";
      const values: Rational[] = [];
      let current = state.initial;
      for (let year = 0; year < state.years; year += 1) {
        current = eventValue(current, state.rate, 1, state.adjustment, state.eventOrder);
        values.push(current);
      }
      keyIdea = local(locale, "Because percentage growth and a fixed migration change do not commute, the stated event order must be followed every year.", "प्रतिशत वृद्धि और निश्चित प्रवासन बदलाव का क्रम बदलने पर परिणाम बदलता है, इसलिए हर वर्ष दिया गया क्रम ही अपनाएँ।", "ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਅਤੇ ਨਿਸ਼ਚਿਤ ਮਾਈਗ੍ਰੇਸ਼ਨ ਬਦਲਾਅ ਦਾ ਕ੍ਰਮ ਬਦਲਣ ਨਾਲ ਨਤੀਜਾ ਬਦਲਦਾ ਹੈ, ਇਸ ਲਈ ਹਰ ਸਾਲ ਦਿੱਤਾ ਕ੍ਰਮ ਹੀ ਅਪਣਾਓ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped(formula)}.`,
        `${local(locale, "Year-end values:", "वर्ष-अंत मान:", "ਸਾਲ-ਅੰਤ ਮੁੱਲ:")} ${mathWrapped(values.map((value, index) => `B_${index + 1}=${mathNumber(value)}`).join(",\\quad "))}.`,
        finalSentence(locale, local(locale, "the final population", "अंतिम जनसंख्या", "ਅੰਤਿਮ ਆਬਾਦੀ"), answer),
      ];
      commonMistake = optionFeedback(locale, "WRONG_EVENT_ORDER");
      break;
    }
    case "INT-QL-095": {
      const a = amountFromGrowth(state.initial, state.planARates);
      const b = amountFromGrowth(state.initial, state.planBRates);
      keyIdea = local(locale, "Compute each plan's compound factor separately; comparing only the sums of yearly rates is not enough.", "हर योजना का चक्रवृद्धि गुणक अलग-अलग निकालें; केवल वार्षिक दरों के योग की तुलना पर्याप्त नहीं है।", "ਹਰ ਯੋਜਨਾ ਦਾ ਮਿਸ਼ਰਤ ਗੁਣਕ ਵੱਖ-ਵੱਖ ਕੱਢੋ; ਸਿਰਫ਼ ਸਾਲਾਨਾ ਦਰਾਂ ਦੇ ਜੋੜ ਦੀ ਤੁਲਨਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।");
      steps = [
        `${formulaPrefix(locale)} ${mathWrapped("A=P\\prod(1+r_{A,k}/100),\\quad B=P\\prod(1+r_{B,k}/100)")}.`,
        `${local(locale, "Plan values:", "योजना मान:", "ਯੋਜਨਾ ਮੁੱਲ:")} ${mathWrapped(`A=${mathNumber(state.initial)}\\times${ratesLatex(state.planARates)}=${mathNumber(a)},\\quad B=${mathNumber(state.initial)}\\times${ratesLatex(state.planBRates)}=${mathNumber(b)}`)}.`,
        `${local(locale, "Difference:", "अंतर:", "ਅੰਤਰ:")} ${mathWrapped(`|A-B|=${mathNumber(solution)}`)}.`,
        finalSentence(locale, local(locale, "the difference", "अंतर", "ਅੰਤਰ"), answer),
      ];
      commonMistake = optionFeedback(locale, "SIMPLE_PLAN_DIFFERENCE");
      break;
    }
  }
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer: answer, commonMistake });
}

function stateFingerprint(state: IntCp005State): string {
  const rational = (value: Rational) => `${value.numerator}/${value.denominator}`;
  switch (state.qlId) {
    case "INT-QL-086": case "INT-QL-087": return `${state.qlId}|${state.context}|${rational(state.initial)}|${state.rates.map(rational).join(",")}`;
    case "INT-QL-088": return `${state.qlId}|${state.context}|${rational(state.initial)}|${state.rates.map(rational).join(",")}|${rational(state.finalValue)}`;
    case "INT-QL-089": return `${state.qlId}|${rational(state.initial)}|${state.rates.map(rational).join(",")}|${state.missingIndex}|${rational(state.finalValue)}`;
    case "INT-QL-090": return `${state.qlId}|${state.context}|${rational(state.initial)}|${state.decayRates.map(rational).join(",")}`;
    case "INT-QL-091": return `${state.qlId}|${state.context}|${rational(state.initial)}|${state.decayRates.map(rational).join(",")}|${rational(state.finalValue)}`;
    case "INT-QL-092": return `${state.qlId}|${rational(state.initial)}|${state.signedRates.map(rational).join(",")}`;
    case "INT-QL-093": return `${state.qlId}|${state.direction}|${rational(state.initial)}|${rational(state.rate)}|${rational(state.threshold)}|${state.targetYear}`;
    case "INT-QL-094": return `${state.qlId}|${rational(state.initial)}|${rational(state.rate)}|${state.years}|${rational(state.adjustment)}|${state.eventOrder}`;
    case "INT-QL-095": return `${state.qlId}|${rational(state.initial)}|${state.planARates.map(rational).join(",")}|${state.planBRates.map(rational).join(",")}`;
  }
}

function difficultyFor(qlId: IntCp005QlId): "Medium" | "Hard" {
  return ["INT-QL-089", "INT-QL-093", "INT-QL-094", "INT-QL-095"].includes(qlId) ? "Hard" : "Medium";
}

export function generateIntCp005Question(qlId: IntCp005QlId, seed: string, locale: IntCp005Locale = "en-IN"): IntCp005Question {
  if (!(INT_CP005_QL_IDS as readonly string[]).includes(qlId)) throw new Error(`Unknown CP005 QL: ${qlId}`);
  const state = generateState(qlId, seed);
  const solution = solveIntCp005(state);
  if (!verifyIntCp005Answer(state, solution)) throw new Error(`${qlId}/${seed}: solver-verifier disagreement`);
  const semantic = answerSemanticFor(qlId, state.context);
  const rendered = presentationFor(state, seed, locale);
  const options = optionsFor(state, solution, semantic, locale);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: option ownership failure`);
  const question: IntCp005Question = {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-005",
    permanentQlId: qlId,
    qlId,
    runtimeVersion: INT_CP005_RUNTIME_VERSION,
    seed,
    locale,
    mathematicalState: state,
    mathematicalFingerprint: stateFingerprint(state),
    answerSemantic: semantic,
    representation: rendered.representation,
    presentation: { markdown: rendered.markdown, prompt: rendered.prompt, ...(rendered.table ? { table: rendered.table } : {}) },
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    solution,
    explanation: explanationFor(state, solution, semantic, locale),
    difficulty: difficultyFor(qlId),
    maturity: "MULTILINGUAL_REVIEW_CANDIDATE",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
  return deepFreeze(question);
}

export function getIntCp005RegistryEntry(qlId: IntCp005QlId): IntCp005RegistryEntry {
  const entry = INT_CP005_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`${qlId}: missing CP005 registry entry`);
  return entry;
}
