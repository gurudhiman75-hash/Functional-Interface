import {
  add,
  div,
  hash,
  mul,
  pow,
  rat,
  sub,
  type Rational,
} from "./cp003-exam-model";
import {
  solveIntCp005,
  verifyIntCp005Answer,
  type IntCp005Option,
  type IntCp005QlId,
  type IntCp005State,
} from "./cp005-variable-growth-decay-runtime";
import {
  generateIntCp005QuestionV15,
  type IntCp005Locale,
  type IntCp005QuestionV15,
} from "./cp005-variable-growth-decay-runtime-v15";

export const INT_CP005_RUNTIME_VERSION_V16 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v16" as const;

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
  checkpoint: "INT-CP-005" as const,
  learnerQlCount: 9 as const,
  excludedPermanentQl: "INT-QL-094" as const,
  excludedReason: "Generic percentage-growth plus fixed migration/event order has no recovered Interest-family authority and belongs outside INT-CP-005." as const,
  ql086Context: "INVESTMENT_ONLY" as const,
  ql088Context: "INVESTMENT_ONLY" as const,
  productionContextAllowed: false as const,
  preferredMoneyRange: "₹10,000..₹2,00,000 opening values; harder comparisons may reach ₹3,00,000 final values" as const,
  preferredDuration: "2..3 years" as const,
});

export type IntCp005QuestionV16 = Omit<IntCp005QuestionV15, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V16;
};

const GROWTH_PROFILES = Object.freeze([
  Object.freeze([10, 20]),
  Object.freeze([20, 10]),
  Object.freeze([25, 20]),
  Object.freeze([20, 25]),
  Object.freeze([10, 25]),
  Object.freeze([25, 10]),
  Object.freeze([5, 20, 25]),
  Object.freeze([10, 20, 25]),
  Object.freeze([20, 10, 25]),
  Object.freeze([25, 20, 10]),
  Object.freeze([10, 10, 20]),
  Object.freeze([20, 25, 20]),
] as const);

const THREE_YEAR_GROWTH_PROFILES = Object.freeze(GROWTH_PROFILES.filter((rates) => rates.length === 3));

const DECAY_PROFILES = Object.freeze([
  Object.freeze([10, 20]),
  Object.freeze([20, 10]),
  Object.freeze([10, 25]),
  Object.freeze([25, 20]),
  Object.freeze([20, 15]),
  Object.freeze([15, 20]),
  Object.freeze([10, 20, 25]),
  Object.freeze([20, 10, 25]),
  Object.freeze([25, 20, 10]),
  Object.freeze([15, 10, 20]),
] as const);

const MIXED_PROFILES = Object.freeze([
  Object.freeze([20, -10]),
  Object.freeze([25, -20]),
  Object.freeze([10, -20, 25]),
  Object.freeze([20, -10, 25]),
  Object.freeze([25, -20, 10]),
  Object.freeze([10, 20, -25]),
  Object.freeze([-10, 20, 25]),
  Object.freeze([20, -25, 10]),
] as const);

const PRINCIPAL_POOL = Object.freeze([
  10000n, 12000n, 12500n, 15000n, 16000n, 20000n, 25000n, 30000n,
  40000n, 50000n, 60000n, 75000n, 80000n, 100000n, 120000n, 125000n,
  150000n, 160000n, 200000n,
]);

const THRESHOLD_PROFILES = Object.freeze([
  Object.freeze({ direction: "GROWTH" as const, rate: 10, targetYear: 2, initial: 10000n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 10, targetYear: 4, initial: 10000n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 20, targetYear: 3, initial: 12500n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 25, targetYear: 2, initial: 16000n }),
  Object.freeze({ direction: "GROWTH" as const, rate: 20, targetYear: 2, initial: 25000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 10, targetYear: 2, initial: 50000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 10, targetYear: 3, initial: 100000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 20, targetYear: 2, initial: 50000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 20, targetYear: 3, initial: 62500n }),
  Object.freeze({ direction: "DECAY" as const, rate: 25, targetYear: 2, initial: 64000n }),
  Object.freeze({ direction: "DECAY" as const, rate: 15, targetYear: 2, initial: 40000n }),
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
  return items[(hash(`${seed}:v16:${label}`) >>> 0) % items.length]!;
}

function rate(value: number): Rational { return rat(BigInt(value)); }
function growthFactor(value: Rational): Rational { return add(rat(1n), div(value, rat(100n))); }
function decayFactor(value: Rational): Rational { return sub(rat(1n), div(value, rat(100n))); }
function signedFactor(value: Rational): Rational {
  return value.numerator >= 0n ? growthFactor(value) : decayFactor(rat(-value.numerator, value.denominator));
}
function product(values: readonly Rational[]): Rational { return values.reduce((acc, value) => mul(acc, value), rat(1n)); }
function growthProduct(rates: readonly Rational[]): Rational { return product(rates.map(growthFactor)); }
function decayProduct(rates: readonly Rational[]): Rational { return product(rates.map(decayFactor)); }
function signedProduct(rates: readonly Rational[]): Rational { return product(rates.map(signedFactor)); }
function absRat(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }

function rationalKey(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`INT-CP-005/V16: expected integral learner value, received ${rationalKey(value)}`);
  return value.numerator;
}

function roundInteger(value: Rational): Rational {
  const sign = value.numerator < 0n ? -1n : 1n;
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  let quotient = numerator / value.denominator;
  if ((numerator % value.denominator) * 2n >= value.denominator) quotient += 1n;
  return rat(sign * quotient);
}

function profileRates(profile: readonly number[]): readonly Rational[] {
  return Object.freeze(profile.map(rate));
}

function chooseInitialForFactor(factor: Rational, seed: string, label: string, maxFinal = 300000n): Rational {
  const candidates = PRINCIPAL_POOL.filter((principal) => {
    const finalValue = mul(rat(principal), factor);
    return finalValue.denominator === 1n && finalValue.numerator > 0n && finalValue.numerator <= maxFinal;
  });
  if (!candidates.length) throw new Error(`INT-CP-005/V16 ${label}: no friendly principal for factor ${rationalKey(factor)}`);
  return rat(choose(candidates, seed, label));
}

function stateFor(qlId: IntCp005QlId, seed: string): IntCp005State {
  switch (qlId) {
    case "INT-QL-086": {
      const rates = profileRates(choose(GROWTH_PROFILES, seed, "ql086-profile"));
      const initial = chooseInitialForFactor(growthProduct(rates), seed, "ql086-initial");
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates });
    }
    case "INT-QL-087": {
      const rates = profileRates(choose(GROWTH_PROFILES, seed, "ql087-profile"));
      const initial = chooseInitialForFactor(growthProduct(rates), seed, "ql087-initial");
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates });
    }
    case "INT-QL-088": {
      const rates = profileRates(choose(GROWTH_PROFILES, seed, "ql088-profile"));
      const initial = chooseInitialForFactor(growthProduct(rates), seed, "ql088-initial");
      const finalValue = mul(initial, growthProduct(rates));
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates, finalValue });
    }
    case "INT-QL-089": {
      const rates = profileRates(choose(THREE_YEAR_GROWTH_PROFILES, seed, "ql089-profile"));
      const initial = chooseInitialForFactor(growthProduct(rates), seed, "ql089-initial");
      const missingIndex = (hash(`${seed}:v16:ql089-missing`) >>> 0) % rates.length;
      const finalValue = mul(initial, growthProduct(rates));
      return deepFreeze({ qlId, context: "INVESTMENT", initial, rates, missingIndex, finalValue });
    }
    case "INT-QL-090": {
      const decayRates = profileRates(choose(DECAY_PROFILES, seed, "ql090-profile"));
      const initial = chooseInitialForFactor(decayProduct(decayRates), seed, "ql090-initial");
      const context = choose(["MACHINE", "VEHICLE"] as const, seed, "ql090-context");
      return deepFreeze({ qlId, context, initial, decayRates });
    }
    case "INT-QL-091": {
      const decayRates = profileRates(choose(DECAY_PROFILES, seed, "ql091-profile"));
      const initial = chooseInitialForFactor(decayProduct(decayRates), seed, "ql091-initial");
      const finalValue = mul(initial, decayProduct(decayRates));
      const context = choose(["MACHINE", "VEHICLE"] as const, seed, "ql091-context");
      return deepFreeze({ qlId, context, initial, decayRates, finalValue });
    }
    case "INT-QL-092": {
      const signedRates = profileRates(choose(MIXED_PROFILES, seed, "ql092-profile"));
      const initial = chooseInitialForFactor(signedProduct(signedRates), seed, "ql092-initial");
      return deepFreeze({ qlId, context: "ASSET", initial, signedRates });
    }
    case "INT-QL-093": {
      const profile = choose(THRESHOLD_PROFILES, seed, "ql093-profile");
      const initial = rat(profile.initial);
      const r = rate(profile.rate);
      const factor = profile.direction === "GROWTH" ? growthFactor(r) : decayFactor(r);
      const threshold = mul(initial, pow(factor, profile.targetYear));
      if (threshold.denominator !== 1n) throw new Error(`${qlId}/${seed}: V16 threshold is not integral`);
      return deepFreeze({
        qlId,
        context: profile.direction === "GROWTH" ? "POPULATION" : "ASSET",
        initial,
        rate: r,
        direction: profile.direction,
        threshold,
        targetYear: profile.targetYear,
      });
    }
    case "INT-QL-095": {
      const profile = choose(PLAN_PROFILES, seed, "ql095-profile");
      const planARates = profileRates(profile.a);
      const planBRates = profileRates(profile.b);
      const factorA = growthProduct(planARates);
      const factorB = growthProduct(planBRates);
      const candidates = PRINCIPAL_POOL.filter((principal) => {
        const a = mul(rat(principal), factorA);
        const b = mul(rat(principal), factorB);
        const diff = absRat(sub(a, b));
        return a.denominator === 1n && b.denominator === 1n && diff.denominator === 1n
          && a.numerator <= 300000n && b.numerator <= 300000n && diff.numerator > 0n;
      });
      if (!candidates.length) throw new Error(`${qlId}/${seed}: no friendly comparison principal`);
      const initial = rat(choose(candidates, seed, "ql095-initial"));
      return deepFreeze({ qlId, context: "INVESTMENT", initial, planARates, planBRates });
    }
    case "INT-QL-094":
      throw new Error("INT-QL-094 is excluded from INT-CP-005 V16: migration/event-order growth belongs outside Interest.");
  }
}

function indianInteger(value: bigint): string {
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

function money(value: Rational): string { return `₹${indianInteger(integer(value))}`; }
function percent(value: Rational): string { return `${integer(value)}%`; }
function yearText(year: number, locale: IntCp005Locale): string {
  if (locale === "hi-IN") return `${year} वर्ष`;
  if (locale === "pa-IN") return `${year} ਸਾਲ`;
  return `${year} ${year === 1 ? "year" : "years"}`;
}
function ordinal(index: number, locale: IntCp005Locale): string {
  if (locale === "hi-IN") return ["पहले", "दूसरे", "तीसरे"][index] ?? `${index + 1}वें`;
  if (locale === "pa-IN") return ["ਪਹਿਲੇ", "ਦੂਜੇ", "ਤੀਜੇ"][index] ?? `${index + 1}ਵੇਂ`;
  return ["1st", "2nd", "3rd"][index] ?? `${index + 1}th`;
}
function joinNatural(parts: readonly string[], locale: IntCp005Locale): string {
  if (parts.length <= 1) return parts[0] ?? "";
  const conjunction = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
  return `${parts.slice(0, -1).join(", ")}${conjunction}${parts[parts.length - 1]}`;
}
function rateSchedule(rates: readonly Rational[], locale: IntCp005Locale): string {
  return joinNatural(rates.map((r, index) => {
    if (locale === "hi-IN") return `${ordinal(index, locale)} वर्ष ${percent(r)}`;
    if (locale === "pa-IN") return `${ordinal(index, locale)} ਸਾਲ ${percent(r)}`;
    return `${percent(r)} in the ${ordinal(index, locale)} year`;
  }), locale);
}
function signedSchedule(rates: readonly Rational[], locale: IntCp005Locale): string {
  return joinNatural(rates.map((r, index) => {
    const magnitude = percent(absRat(r));
    if (locale === "hi-IN") return `${ordinal(index, locale)} वर्ष ${magnitude} ${r.numerator >= 0n ? "वृद्धि" : "कमी"}`;
    if (locale === "pa-IN") return `${ordinal(index, locale)} ਸਾਲ ${magnitude} ${r.numerator >= 0n ? "ਵਾਧਾ" : "ਘਾਟ"}`;
    return `${magnitude} ${r.numerator >= 0n ? "increase" : "decrease"} in the ${ordinal(index, locale)} year`;
  }), locale);
}
function objectName(context: IntCp005State["context"], locale: IntCp005Locale): string {
  if (context === "MACHINE") return locale === "hi-IN" ? "मशीन" : locale === "pa-IN" ? "ਮਸ਼ੀਨ" : "machine";
  if (context === "VEHICLE") return locale === "hi-IN" ? "वाहन" : locale === "pa-IN" ? "ਵਾਹਨ" : "vehicle";
  return locale === "hi-IN" ? "संपत्ति" : locale === "pa-IN" ? "ਸੰਪਤੀ" : "asset";
}

function promptFor(state: IntCp005State, locale: IntCp005Locale): IntCp005QuestionV15["presentation"] {
  let markdown: string;
  switch (state.qlId) {
    case "INT-QL-086": {
      const years = state.rates.length;
      markdown = locale === "en-IN"
        ? `${money(state.initial)} is invested at annual compound rates of ${rateSchedule(state.rates, locale)}. What will the amount be after ${years} years?`
        : locale === "hi-IN"
          ? `${money(state.initial)} को वार्षिक मिश्रित ब्याज की दरों ${rateSchedule(state.rates, locale)} पर निवेश किया गया है। ${years} वर्षों बाद राशि कितनी होगी?`
          : `${money(state.initial)} ਨੂੰ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀਆਂ ਦਰਾਂ ${rateSchedule(state.rates, locale)} 'ਤੇ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ। ${years} ਸਾਲਾਂ ਬਾਅਦ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
      break;
    }
    case "INT-QL-087": {
      const years = state.rates.length;
      markdown = locale === "en-IN"
        ? `${money(state.initial)} is invested at annual compound rates of ${rateSchedule(state.rates, locale)}. Find the compound interest earned in ${years} years.`
        : locale === "hi-IN"
          ? `${money(state.initial)} को वार्षिक मिश्रित ब्याज की दरों ${rateSchedule(state.rates, locale)} पर निवेश किया गया है। ${years} वर्षों का मिश्रित ब्याज ज्ञात कीजिए।`
          : `${money(state.initial)} ਨੂੰ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀਆਂ ਦਰਾਂ ${rateSchedule(state.rates, locale)} 'ਤੇ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ। ${years} ਸਾਲਾਂ ਦਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "INT-QL-088": {
      const years = state.rates.length;
      markdown = locale === "en-IN"
        ? `An amount becomes ${money(state.finalValue)} after ${years} years at annual compound rates of ${rateSchedule(state.rates, locale)}. What was the principal?`
        : locale === "hi-IN"
          ? `एक राशि ${years} वर्षों में वार्षिक मिश्रित ब्याज की दरों ${rateSchedule(state.rates, locale)} पर बढ़कर ${money(state.finalValue)} हो जाती है। मूलधन कितना था?`
          : `ਇੱਕ ਰਕਮ ${years} ਸਾਲਾਂ ਵਿੱਚ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀਆਂ ਦਰਾਂ ${rateSchedule(state.rates, locale)} ਨਾਲ ਵੱਧ ਕੇ ${money(state.finalValue)} ਹੋ ਜਾਂਦੀ ਹੈ। ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
      break;
    }
    case "INT-QL-089": {
      const schedule = state.rates.map((r, index) => index === state.missingIndex ? "?" : percent(r));
      markdown = locale === "en-IN"
        ? `${money(state.initial)} becomes ${money(state.finalValue)} in 3 years at annual compound interest. The yearly rates are ${schedule.join(", ")}. What is the missing rate?`
        : locale === "hi-IN"
          ? `${money(state.initial)} वार्षिक मिश्रित ब्याज पर 3 वर्षों में ${money(state.finalValue)} हो जाता है। तीन वर्षों की दरें क्रमशः ${schedule.join(", ")} हैं। लुप्त दर कितनी है?`
          : `${money(state.initial)} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ 3 ਸਾਲਾਂ ਵਿੱਚ ${money(state.finalValue)} ਹੋ ਜਾਂਦਾ ਹੈ। ਤਿੰਨ ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${schedule.join(", ")} ਹਨ। ਗੁੰਮ ਦਰ ਕਿੰਨੀ ਹੈ?`;
      break;
    }
    case "INT-QL-090": {
      const years = state.decayRates.length;
      const noun = objectName(state.context, locale);
      markdown = locale === "en-IN"
        ? `A ${noun} worth ${money(state.initial)} depreciates by ${rateSchedule(state.decayRates, locale)}. What will its value be after ${years} years?`
        : locale === "hi-IN"
          ? `${money(state.initial)} मूल्य की एक ${noun} का मूल्यह्रास ${rateSchedule(state.decayRates, locale)} की दर से होता है। ${years} वर्षों बाद उसका मूल्य कितना होगा?`
          : `${money(state.initial)} ਮੁੱਲ ਦੀ ਇੱਕ ${noun} ਦਾ ਮੁੱਲ ਘਟਾਅ ${rateSchedule(state.decayRates, locale)} ਦੀ ਦਰ ਨਾਲ ਹੁੰਦਾ ਹੈ। ${years} ਸਾਲਾਂ ਬਾਅਦ ਉਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      break;
    }
    case "INT-QL-091": {
      const years = state.decayRates.length;
      const noun = objectName(state.context, locale);
      markdown = locale === "en-IN"
        ? `After ${years} years, a ${noun} is worth ${money(state.finalValue)}. Its yearly depreciation rates were ${rateSchedule(state.decayRates, locale)}. What was its original value?`
        : locale === "hi-IN"
          ? `${years} वर्षों बाद एक ${noun} का मूल्य ${money(state.finalValue)} है। वार्षिक मूल्यह्रास दरें ${rateSchedule(state.decayRates, locale)} थीं। उसका मूल मूल्य कितना था?`
          : `${years} ਸਾਲਾਂ ਬਾਅਦ ਇੱਕ ${noun} ਦਾ ਮੁੱਲ ${money(state.finalValue)} ਹੈ। ਸਾਲਾਨਾ ਮੁੱਲ ਘਟਾਅ ਦੀਆਂ ਦਰਾਂ ${rateSchedule(state.decayRates, locale)} ਸਨ। ਉਸ ਦਾ ਮੂਲ ਮੁੱਲ ਕਿੰਨਾ ਸੀ?`;
      break;
    }
    case "INT-QL-092": {
      const years = state.signedRates.length;
      markdown = locale === "en-IN"
        ? `An asset is worth ${money(state.initial)}. Its value changes by ${signedSchedule(state.signedRates, locale)}. What is its value after ${years} years?`
        : locale === "hi-IN"
          ? `एक संपत्ति का मूल्य ${money(state.initial)} है। उसके मूल्य में ${signedSchedule(state.signedRates, locale)} का परिवर्तन होता है। ${years} वर्षों बाद उसका मूल्य कितना होगा?`
          : `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਉਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ${signedSchedule(state.signedRates, locale)} ਦਾ ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ। ${years} ਸਾਲਾਂ ਬਾਅਦ ਉਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      break;
    }
    case "INT-QL-093": {
      if (state.direction === "GROWTH") {
        const initial = indianInteger(integer(state.initial));
        const threshold = indianInteger(integer(state.threshold));
        markdown = locale === "en-IN"
          ? `A town has ${initial} people and its population grows by ${percent(state.rate)} each year. After how many complete years will it first reach at least ${threshold}?`
          : locale === "hi-IN"
            ? `एक नगर की जनसंख्या ${initial} है और वह हर वर्ष ${percent(state.rate)} बढ़ती है। कितने पूरे वर्षों बाद जनसंख्या पहली बार कम-से-कम ${threshold} होगी?`
            : `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${initial} ਹੈ ਅਤੇ ਉਹ ਹਰ ਸਾਲ ${percent(state.rate)} ਵਧਦੀ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਆਬਾਦੀ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${threshold} ਹੋਵੇਗੀ?`;
      } else {
        markdown = locale === "en-IN"
          ? `An asset is worth ${money(state.initial)} and depreciates by ${percent(state.rate)} each year. After how many complete years will its value first fall to ${money(state.threshold)} or below?`
          : locale === "hi-IN"
            ? `एक संपत्ति का मूल्य ${money(state.initial)} है और उसका मूल्य हर वर्ष ${percent(state.rate)} घटता है। कितने पूरे वर्षों बाद उसका मूल्य पहली बार ${money(state.threshold)} या उससे कम होगा?`
            : `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ ਅਤੇ ਉਸ ਦਾ ਮੁੱਲ ਹਰ ਸਾਲ ${percent(state.rate)} ਘਟਦਾ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਉਸ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${money(state.threshold)} ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਵੇਗਾ?`;
      }
      break;
    }
    case "INT-QL-095": {
      const headers = locale === "en-IN" ? ["Year", "Plan A", "Plan B"] : locale === "hi-IN" ? ["वर्ष", "योजना A", "योजना B"] : ["ਸਾਲ", "ਯੋਜਨਾ A", "ਯੋਜਨਾ B"];
      const rows = state.planARates.map((a, index) => Object.freeze([`${index + 1}`, percent(a), percent(state.planBRates[index]!)]));
      markdown = locale === "en-IN"
        ? `The same sum of ${money(state.initial)} is invested for 3 years under the two compound-interest plans shown below. By how much will their final amounts differ?`
        : locale === "hi-IN"
          ? `समान राशि ${money(state.initial)} को 3 वर्षों के लिए नीचे दी गई दो मिश्रित-ब्याज योजनाओं में निवेश किया जाता है। दोनों की अंतिम राशियों में कितना अंतर होगा?`
          : `ਇੱਕੋ ਰਕਮ ${money(state.initial)} ਨੂੰ 3 ਸਾਲਾਂ ਲਈ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਦੋ ਮਿਸ਼ਰਤ-ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਦੋਨਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?`;
      return deepFreeze({ markdown, prompt: markdown, table: deepFreeze({ headers: Object.freeze(headers), rows: Object.freeze(rows) }) });
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
  return deepFreeze({ markdown, prompt: markdown });
}

interface Distractor {
  readonly value: Rational;
  readonly misconceptionId: string;
  readonly feedback: string;
}

function localizedFeedback(locale: IntCp005Locale, key: string): string {
  const map: Record<string, readonly [string, string, string]> = {
    CORRECT: ["Correct. The yearly factors have been applied successively.", "सही। वार्षिक गुणकों को क्रमशः लागू किया गया है।", "ਸਹੀ। ਸਾਲਾਨਾ ਗੁਣਕਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਕੀਤਾ ਗਿਆ ਹੈ।"],
    ADD_RATES: ["This treats all percentages as if they acted on the original value.", "इसमें सभी प्रतिशतों को मूल राशि पर लागू मान लिया गया है।", "ਇਸ ਵਿੱਚ ਸਾਰੇ ਪ੍ਰਤੀਸ਼ਤਾਂ ਨੂੰ ਮੂਲ ਰਕਮ ਉੱਤੇ ਲਾਗੂ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।"],
    FINAL_NOT_GAIN: ["This is the final amount, not the compound interest asked for.", "यह अंतिम राशि है, पूछा गया मिश्रित ब्याज नहीं।", "ਇਹ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਪੁੱਛਿਆ ਗਿਆ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਹੀਂ।"],
    OMIT_PERIOD: ["One yearly factor has been omitted.", "एक वार्षिक गुणक छूट गया है।", "ਇੱਕ ਸਾਲਾਨਾ ਗੁਣਕ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
    NO_REVERSE: ["The final value has not been reversed through all yearly factors.", "अंतिम मूल्य को सभी वार्षिक गुणकों से उल्टा नहीं किया गया है।", "ਅੰਤਿਮ ਮੁੱਲ ਨੂੰ ਸਾਰੇ ਸਾਲਾਨਾ ਗੁਣਕਾਂ ਰਾਹੀਂ ਵਾਪਸ ਨਹੀਂ ਕੱਢਿਆ ਗਿਆ।"],
    ONE_FACTOR_REVERSE: ["Only one yearly factor has been reversed.", "केवल एक वार्षिक गुणक को उल्टा किया गया है।", "ਕੇਵਲ ਇੱਕ ਸਾਲਾਨਾ ਗੁਣਕ ਨੂੰ ਵਾਪਸ ਕੀਤਾ ਗਿਆ ਹੈ।"],
    NEAR_RATE: ["This nearby rate does not reproduce the stated final amount.", "यह निकट दर दी गई अंतिम राशि नहीं देती।", "ਇਹ ਨੇੜਲੀ ਦਰ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨਹੀਂ ਦਿੰਦੀ।"],
    WRONG_DIRECTION: ["Depreciation must reduce the updated value each year.", "मूल्यह्रास हर वर्ष अद्यतन मूल्य को घटाता है।", "ਮੁੱਲ ਘਟਾਅ ਹਰ ਸਾਲ ਅੱਪਡੇਟ ਮੁੱਲ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ।"],
    ALL_INCREASE: ["A decrease has been treated as an increase.", "कमी को वृद्धि मान लिया गया है।", "ਘਾਟ ਨੂੰ ਵਾਧਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।"],
    EARLY: ["The threshold has not yet been crossed at this time.", "इस समय सीमा अभी पार नहीं हुई है।", "ਇਸ ਸਮੇਂ ਹੱਦ ਹਾਲੇ ਪਾਰ ਨਹੀਂ ਹੋਈ।"],
    LATE: ["The threshold was already crossed earlier.", "सीमा इससे पहले ही पार हो चुकी थी।", "ਹੱਦ ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਪਾਰ ਹੋ ਚੁੱਕੀ ਸੀ।"],
    PLAN_FINAL: ["This is one plan's final amount, not the difference between the two plans.", "यह एक योजना की अंतिम राशि है, दोनों योजनाओं का अंतर नहीं।", "ਇਹ ਇੱਕ ਯੋਜਨਾ ਦੀ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਦੋਨਾਂ ਯੋਜਨਾਵਾਂ ਦਾ ਅੰਤਰ ਨਹੀਂ।"],
  };
  const triple = map[key] ?? map.NEAR_RATE!;
  return locale === "en-IN" ? triple[0] : locale === "hi-IN" ? triple[1] : triple[2];
}

function semanticText(value: Rational, state: IntCp005State, locale: IntCp005Locale): string {
  if (state.qlId === "INT-QL-089") return percent(value);
  if (state.qlId === "INT-QL-093") return yearText(Number(integer(value)), locale);
  return money(value);
}

function distinctDistractors(correct: Rational, candidates: readonly Distractor[]): readonly Distractor[] {
  const seen = new Set([rationalKey(correct)]);
  const output: Distractor[] = [];
  for (const candidate of candidates) {
    const value = candidate.value.denominator === 1n ? candidate.value : roundInteger(candidate.value);
    const key = rationalKey(value);
    if (value.numerator > 0n && !seen.has(key)) {
      output.push({ ...candidate, value });
      seen.add(key);
    }
    if (output.length === 3) return Object.freeze(output.map(deepFreeze));
  }
  let delta = 1n;
  while (output.length < 3) {
    const fallback = rat(integer(roundInteger(correct)) + delta);
    const key = rationalKey(fallback);
    if (!seen.has(key) && fallback.numerator > 0n) {
      output.push(deepFreeze({ value: fallback, misconceptionId: "NEARBY_ARITHMETIC", feedback: "" }));
      seen.add(key);
    }
    delta += 1n;
  }
  return Object.freeze(output);
}

function distractorsFor(state: IntCp005State, solution: Rational, locale: IntCp005Locale): readonly Distractor[] {
  switch (state.qlId) {
    case "INT-QL-086": {
      const sumRates = state.rates.reduce((sum, r) => add(sum, r), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sumRates, rat(100n))));
      const omitted = mul(state.initial, growthProduct(state.rates.slice(0, -1)));
      return distinctDistractors(solution, [
        { value: linear, misconceptionId: "ADD_RATES", feedback: localizedFeedback(locale, "ADD_RATES") },
        { value: omitted, misconceptionId: "OMIT_LAST_RATE", feedback: localizedFeedback(locale, "OMIT_PERIOD") },
        { value: add(state.initial, sub(solution, state.initial) |> ((x) => div(x, rat(2n)))), misconceptionId: "HALF_GAIN", feedback: localizedFeedback(locale, "NEAR_RATE") },
      ]);
    }
    case "INT-QL-087": {
      const finalValue = add(state.initial, solution);
      const sumRates = state.rates.reduce((sum, r) => add(sum, r), rat(0n));
      const simpleGain = mul(state.initial, div(sumRates, rat(100n)));
      const omittedFinal = mul(state.initial, growthProduct(state.rates.slice(0, -1)));
      const omittedGain = sub(omittedFinal, state.initial);
      return distinctDistractors(solution, [
        { value: finalValue, misconceptionId: "FINAL_AMOUNT_NOT_CI", feedback: localizedFeedback(locale, "FINAL_NOT_GAIN") },
        { value: simpleGain, misconceptionId: "ADD_RATES", feedback: localizedFeedback(locale, "ADD_RATES") },
        { value: omittedGain, misconceptionId: "OMIT_LAST_RATE", feedback: localizedFeedback(locale, "OMIT_PERIOD") },
      ]);
    }
    case "INT-QL-088": {
      const sumRates = state.rates.reduce((sum, r) => add(sum, r), rat(0n));
      const linearReverse = div(mul(state.finalValue, rat(100n)), add(rat(100n), sumRates));
      const oneFactor = div(state.finalValue, growthFactor(state.rates[state.rates.length - 1]!));
      return distinctDistractors(solution, [
        { value: state.finalValue, misconceptionId: "NO_REVERSE", feedback: localizedFeedback(locale, "NO_REVERSE") },
        { value: linearReverse, misconceptionId: "LINEAR_REVERSE", feedback: localizedFeedback(locale, "ADD_RATES") },
        { value: oneFactor, misconceptionId: "ONE_FACTOR_REVERSE", feedback: localizedFeedback(locale, "ONE_FACTOR_REVERSE") },
      ]);
    }
    case "INT-QL-089": {
      const correct = integer(solution);
      return distinctDistractors(solution, [
        { value: rat(correct + 5n), misconceptionId: "RATE_PLUS_5", feedback: localizedFeedback(locale, "NEAR_RATE") },
        { value: rat(correct > 5n ? correct - 5n : correct + 10n), misconceptionId: "RATE_MINUS_5", feedback: localizedFeedback(locale, "NEAR_RATE") },
        { value: rat(correct + 10n), misconceptionId: "RATE_PLUS_10", feedback: localizedFeedback(locale, "NEAR_RATE") },
      ]);
    }
    case "INT-QL-090": {
      const sum = state.decayRates.reduce((acc, r) => add(acc, r), rat(0n));
      const linear = mul(state.initial, sub(rat(1n), div(sum, rat(100n))));
      const omitted = mul(state.initial, decayProduct(state.decayRates.slice(0, -1)));
      const growthWrong = mul(state.initial, growthProduct(state.decayRates));
      return distinctDistractors(solution, [
        { value: linear, misconceptionId: "ADD_DECAY_RATES", feedback: localizedFeedback(locale, "ADD_RATES") },
        { value: omitted, misconceptionId: "OMIT_LAST_DECAY", feedback: localizedFeedback(locale, "OMIT_PERIOD") },
        { value: growthWrong, misconceptionId: "TREAT_DECAY_AS_GROWTH", feedback: localizedFeedback(locale, "WRONG_DIRECTION") },
      ]);
    }
    case "INT-QL-091": {
      const sum = state.decayRates.reduce((acc, r) => add(acc, r), rat(0n));
      const linearReverse = div(mul(state.finalValue, rat(100n)), sub(rat(100n), sum));
      const oneFactor = div(state.finalValue, decayFactor(state.decayRates[state.decayRates.length - 1]!));
      return distinctDistractors(solution, [
        { value: state.finalValue, misconceptionId: "NO_REVERSE", feedback: localizedFeedback(locale, "NO_REVERSE") },
        { value: linearReverse, misconceptionId: "LINEAR_REVERSE", feedback: localizedFeedback(locale, "ADD_RATES") },
        { value: oneFactor, misconceptionId: "ONE_FACTOR_REVERSE", feedback: localizedFeedback(locale, "ONE_FACTOR_REVERSE") },
      ]);
    }
    case "INT-QL-092": {
      const sum = state.signedRates.reduce((acc, r) => add(acc, r), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sum, rat(100n))));
      const allIncrease = mul(state.initial, growthProduct(state.signedRates.map(absRat)));
      const omitted = mul(state.initial, signedProduct(state.signedRates.slice(0, -1)));
      return distinctDistractors(solution, [
        { value: linear, misconceptionId: "ADD_SIGNED_RATES", feedback: localizedFeedback(locale, "ADD_RATES") },
        { value: allIncrease, misconceptionId: "ALL_INCREASE", feedback: localizedFeedback(locale, "ALL_INCREASE") },
        { value: omitted, misconceptionId: "OMIT_LAST_CHANGE", feedback: localizedFeedback(locale, "OMIT_PERIOD") },
      ]);
    }
    case "INT-QL-093": {
      const year = state.targetYear;
      return distinctDistractors(solution, [
        { value: rat(BigInt(Math.max(1, year - 1))), misconceptionId: "ONE_YEAR_EARLY", feedback: localizedFeedback(locale, "EARLY") },
        { value: rat(BigInt(year + 1)), misconceptionId: "ONE_YEAR_LATE", feedback: localizedFeedback(locale, "LATE") },
        { value: rat(BigInt(year + 2)), misconceptionId: "TWO_YEARS_LATE", feedback: localizedFeedback(locale, "LATE") },
      ]);
    }
    case "INT-QL-095": {
      const a = mul(state.initial, growthProduct(state.planARates));
      const b = mul(state.initial, growthProduct(state.planBRates));
      const sumA = state.planARates.reduce((acc, r) => add(acc, r), rat(0n));
      const sumB = state.planBRates.reduce((acc, r) => add(acc, r), rat(0n));
      const linearDiff = mul(state.initial, div(absRat(sub(sumA, sumB)), rat(100n)));
      return distinctDistractors(solution, [
        { value: a, misconceptionId: "PLAN_A_FINAL", feedback: localizedFeedback(locale, "PLAN_FINAL") },
        { value: b, misconceptionId: "PLAN_B_FINAL", feedback: localizedFeedback(locale, "PLAN_FINAL") },
        { value: linearDiff, misconceptionId: "ADD_PLAN_RATES", feedback: localizedFeedback(locale, "ADD_RATES") },
      ]);
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
}

function optionsFor(state: IntCp005State, solution: Rational, correctIndex: number, locale: IntCp005Locale): readonly IntCp005Option[] {
  const distractors = [...distractorsFor(state, solution, locale)];
  const result: IntCp005Option[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      result.push(deepFreeze({
        text: semanticText(solution, state, locale),
        value: solution,
        misconceptionId: "CORRECT",
        studentFeedback: localizedFeedback(locale, "CORRECT"),
        isCorrect: true,
      }));
    } else {
      const distractor = distractors[distractorIndex++]!;
      result.push(deepFreeze({
        text: semanticText(distractor.value, state, locale),
        value: distractor.value,
        misconceptionId: distractor.misconceptionId,
        studentFeedback: distractor.feedback || localizedFeedback(locale, "NEAR_RATE"),
        isCorrect: false,
      }));
    }
  }
  return Object.freeze(result);
}

function mathInt(value: Rational): string { return integer(value).toString(); }
function factorMath(r: Rational, sign: "+" | "-" = "+"): string { return `\\left(1${sign}\\frac{${mathInt(absRat(r))}}{100}\\right)`; }
function formulaLabel(locale: IntCp005Locale): string { return locale === "en-IN" ? "Formula" : locale === "hi-IN" ? "सूत्र" : "ਸੂਤਰ"; }
function substitutionLabel(locale: IntCp005Locale): string { return locale === "en-IN" ? "Substitution" : locale === "hi-IN" ? "मान रखकर" : "ਮੁੱਲ ਰੱਖ ਕੇ"; }
function resultSentence(text: string, locale: IntCp005Locale): string {
  return locale === "en-IN" ? `Therefore, the answer is ${text}.` : locale === "hi-IN" ? `अतः उत्तर ${text} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${text} ਹੈ।`;
}

function explanationFor(state: IntCp005State, solution: Rational, locale: IntCp005Locale): IntCp005QuestionV15["explanation"] {
  let keyIdea: string;
  const steps: string[] = [];
  let commonMistake: string;
  const formula = formulaLabel(locale);
  const substitution = substitutionLabel(locale);
  switch (state.qlId) {
    case "INT-QL-086": {
      keyIdea = locale === "en-IN" ? "Apply each year's compound factor to the updated amount." : locale === "hi-IN" ? "हर वर्ष का मिश्रित गुणक अद्यतन राशि पर लागू करें।" : "ਹਰ ਸਾਲ ਦਾ ਮਿਸ਼ਰਤ ਗੁਣਕ ਅੱਪਡੇਟ ਰਕਮ ਉੱਤੇ ਲਗਾਓ।";
      const factors = state.rates.map((r) => factorMath(r)).join("\\times");
      steps.push(`${formula}: \\(A=P\\prod(1+r_k/100)\\).`);
      steps.push(`${substitution}: \\(A=${mathInt(state.initial)}\\times${factors}=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "ADD_RATES");
      break;
    }
    case "INT-QL-087": {
      keyIdea = locale === "en-IN" ? "Find the compound amount first, then subtract the principal." : locale === "hi-IN" ? "पहले मिश्रित राशि निकालें, फिर मूलधन घटाएँ।" : "ਪਹਿਲਾਂ ਮਿਸ਼ਰਤ ਰਕਮ ਕੱਢੋ, ਫਿਰ ਮੂਲਧਨ ਘਟਾਓ।";
      const amount = add(state.initial, solution);
      const factors = state.rates.map((r) => factorMath(r)).join("\\times");
      steps.push(`${formula}: \\(A=P\\prod(1+r_k/100),\\quad CI=A-P\\).`);
      steps.push(`${substitution}: \\(A=${mathInt(state.initial)}\\times${factors}=${mathInt(amount)}\\).`);
      steps.push(`\\(CI=${mathInt(amount)}-${mathInt(state.initial)}=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "FINAL_NOT_GAIN");
      break;
    }
    case "INT-QL-088": {
      keyIdea = locale === "en-IN" ? "Reverse all compound factors to recover the principal." : locale === "hi-IN" ? "मूलधन पाने के लिए सभी मिश्रित गुणकों को उल्टा करें।" : "ਮੂਲਧਨ ਕੱਢਣ ਲਈ ਸਾਰੇ ਮਿਸ਼ਰਤ ਗੁਣਕਾਂ ਨੂੰ ਵਾਪਸ ਕਰੋ।";
      const factors = state.rates.map((r) => factorMath(r)).join("\\times");
      steps.push(`${formula}: \\(P=\\frac{A}{\\prod(1+r_k/100)}\\).`);
      steps.push(`${substitution}: \\(P=\\frac{${mathInt(state.finalValue)}}{${factors}}=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "NO_REVERSE");
      break;
    }
    case "INT-QL-089": {
      keyIdea = locale === "en-IN" ? "Multiply the known yearly factors and isolate the missing factor." : locale === "hi-IN" ? "ज्ञात वार्षिक गुणकों को गुणा करके लुप्त गुणक अलग करें।" : "ਜਾਣੇ ਸਾਲਾਨਾ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਗੁੰਮ ਗੁਣਕ ਵੱਖ ਕਰੋ।";
      const known = state.rates.filter((_r, index) => index !== state.missingIndex);
      const knownFactors = known.map((r) => factorMath(r)).join("\\times");
      steps.push(`${formula}: \\(A=P\\times K\\times\\left(1+\\frac{x}{100}\\right)\\).`);
      steps.push(`${substitution}: \\(1+\\frac{x}{100}=\\frac{${mathInt(state.finalValue)}}{${mathInt(state.initial)}\\times${knownFactors}}\\).`);
      steps.push(`\\(x=${mathInt(solution)}\\%\\).`);
      commonMistake = localizedFeedback(locale, "OMIT_PERIOD");
      break;
    }
    case "INT-QL-090": {
      keyIdea = locale === "en-IN" ? "Apply each depreciation factor to the reduced value." : locale === "hi-IN" ? "हर मूल्यह्रास गुणक को घटे हुए मूल्य पर लागू करें।" : "ਹਰ ਮੁੱਲ-ਘਟਾਅ ਗੁਣਕ ਨੂੰ ਘਟੇ ਹੋਏ ਮੁੱਲ ਉੱਤੇ ਲਗਾਓ।";
      const factors = state.decayRates.map((r) => factorMath(r, "-")).join("\\times");
      steps.push(`${formula}: \\(V=P\\prod(1-d_k/100)\\).`);
      steps.push(`${substitution}: \\(V=${mathInt(state.initial)}\\times${factors}=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "WRONG_DIRECTION");
      break;
    }
    case "INT-QL-091": {
      keyIdea = locale === "en-IN" ? "Reverse every depreciation factor to recover the original value." : locale === "hi-IN" ? "मूल मूल्य पाने के लिए सभी मूल्यह्रास गुणकों को उल्टा करें।" : "ਮੂਲ ਮੁੱਲ ਕੱਢਣ ਲਈ ਸਾਰੇ ਮੁੱਲ-ਘਟਾਅ ਗੁਣਕਾਂ ਨੂੰ ਵਾਪਸ ਕਰੋ।";
      const factors = state.decayRates.map((r) => factorMath(r, "-")).join("\\times");
      steps.push(`${formula}: \\(P=\\frac{V}{\\prod(1-d_k/100)}\\).`);
      steps.push(`${substitution}: \\(P=\\frac{${mathInt(state.finalValue)}}{${factors}}=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "NO_REVERSE");
      break;
    }
    case "INT-QL-092": {
      keyIdea = locale === "en-IN" ? "Use a growth factor for an increase and a decay factor for a decrease." : locale === "hi-IN" ? "वृद्धि के लिए वृद्धि-गुणक और कमी के लिए ह्रास-गुणक लगाएँ।" : "ਵਾਧੇ ਲਈ ਵਾਧਾ-ਗੁਣਕ ਅਤੇ ਘਾਟ ਲਈ ਘਟਾਅ-ਗੁਣਕ ਲਗਾਓ।";
      const factors = state.signedRates.map((r) => factorMath(r, r.numerator >= 0n ? "+" : "-")).join("\\times");
      steps.push(`${formula}: \\(V=P\\prod f_k\\).`);
      steps.push(`${substitution}: \\(V=${mathInt(state.initial)}\\times${factors}=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "ALL_INCREASE");
      break;
    }
    case "INT-QL-093": {
      keyIdea = locale === "en-IN" ? "Check the first year at which the threshold is crossed, not just a later year." : locale === "hi-IN" ? "उस पहले वर्ष की जाँच करें जब सीमा पार होती है।" : "ਉਸ ਪਹਿਲੇ ਸਾਲ ਦੀ ਜਾਂਚ ਕਰੋ ਜਦੋਂ ਹੱਦ ਪਾਰ ਹੁੰਦੀ ਹੈ।";
      const factor = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const previous = mul(state.initial, pow(factor, state.targetYear - 1));
      const atTarget = mul(state.initial, pow(factor, state.targetYear));
      const sign = state.direction === "GROWTH" ? "+" : "-";
      steps.push(`${formula}: \\(V_t=V_0\\left(1${sign}\\frac{r}{100}\\right)^t\\).`);
      steps.push(`${substitution}: \\(V_{${state.targetYear - 1}}=${mathInt(previous)},\\quad V_{${state.targetYear}}=${mathInt(atTarget)}\\).`);
      commonMistake = localizedFeedback(locale, "EARLY");
      break;
    }
    case "INT-QL-095": {
      keyIdea = locale === "en-IN" ? "Compound each plan separately, then compare their final amounts." : locale === "hi-IN" ? "दोनों योजनाओं की अंतिम राशि अलग-अलग निकालकर अंतर लें।" : "ਦੋਨਾਂ ਯੋਜਨਾਵਾਂ ਦੀ ਅੰਤਿਮ ਰਕਮ ਵੱਖ-ਵੱਖ ਕੱਢ ਕੇ ਅੰਤਰ ਲਓ।";
      const a = mul(state.initial, growthProduct(state.planARates));
      const b = mul(state.initial, growthProduct(state.planBRates));
      const fa = state.planARates.map((r) => factorMath(r)).join("\\times");
      const fb = state.planBRates.map((r) => factorMath(r)).join("\\times");
      steps.push(`\\(A=${mathInt(state.initial)}\\times${fa}=${mathInt(a)}\\).`);
      steps.push(`\\(B=${mathInt(state.initial)}\\times${fb}=${mathInt(b)}\\).`);
      steps.push(`\\(|A-B|=${mathInt(solution)}\\).`);
      commonMistake = localizedFeedback(locale, "PLAN_FINAL");
      break;
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
  const finalAnswer = semanticText(solution, state, locale);
  steps.push(resultSentence(finalAnswer, locale));
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer, commonMistake });
}

function fingerprint(state: IntCp005State): string {
  const r = (value: Rational) => rationalKey(value);
  switch (state.qlId) {
    case "INT-QL-086": return `${state.qlId}|INVESTMENT|${r(state.initial)}|${state.rates.map(r).join(",")}|V16`;
    case "INT-QL-087": return `${state.qlId}|INVESTMENT|${r(state.initial)}|${state.rates.map(r).join(",")}|V16`;
    case "INT-QL-088": return `${state.qlId}|INVESTMENT|${r(state.initial)}|${state.rates.map(r).join(",")}|${r(state.finalValue)}|V16`;
    case "INT-QL-089": return `${state.qlId}|INVESTMENT|${r(state.initial)}|${state.rates.map(r).join(",")}|${state.missingIndex}|${r(state.finalValue)}|V16`;
    case "INT-QL-090": return `${state.qlId}|${state.context}|${r(state.initial)}|${state.decayRates.map(r).join(",")}|V16`;
    case "INT-QL-091": return `${state.qlId}|${state.context}|${r(state.initial)}|${state.decayRates.map(r).join(",")}|${r(state.finalValue)}|V16`;
    case "INT-QL-092": return `${state.qlId}|ASSET|${r(state.initial)}|${state.signedRates.map(r).join(",")}|V16`;
    case "INT-QL-093": return `${state.qlId}|${state.direction}|${r(state.initial)}|${r(state.rate)}|${r(state.threshold)}|${state.targetYear}|V16`;
    case "INT-QL-095": return `${state.qlId}|INVESTMENT|${r(state.initial)}|A:${state.planARates.map(r).join(",")}|B:${state.planBRates.map(r).join(",")}|V16`;
    case "INT-QL-094": throw new Error("INT-QL-094 is outside V16 learner scope");
  }
}

export function generateIntCp005QuestionV16(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV16 {
  if (qlId === "INT-QL-094") {
    throw new Error("INT-QL-094 is excluded from INT-CP-005 V16 and must not be generated from the Interest learner authority.");
  }
  const source = generateIntCp005QuestionV15(qlId, seed, locale);
  const state = stateFor(qlId, seed);
  const solution = solveIntCp005(state);
  if (!verifyIntCp005Answer(state, solution)) throw new Error(`${qlId}/${seed}: V16 independent verifier failed`);
  if (solution.denominator !== 1n) throw new Error(`${qlId}/${seed}: V16 correct answer is not exam-friendly integer`);
  const options = optionsFor(state, solution, source.correctIndex, locale);
  const correctAnswer = options[source.correctIndex]!.text;
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V16,
    seed,
    mathematicalState: state,
    mathematicalFingerprint: fingerprint(state),
    answerSemantic: qlId === "INT-QL-089" ? "RATE_PERCENT" : qlId === "INT-QL-093" ? "TIME_YEARS" : qlId === "INT-QL-095" ? "DIFFERENCE" : "MONEY",
    representation: qlId === "INT-QL-095" ? "COMPARISON_TABLE" : "STANDARD_PROSE",
    presentation: promptFor(state, locale),
    options,
    correctIndex: source.correctIndex,
    correctAnswer,
    solution,
    explanation: explanationFor(state, solution, locale),
  });
}
