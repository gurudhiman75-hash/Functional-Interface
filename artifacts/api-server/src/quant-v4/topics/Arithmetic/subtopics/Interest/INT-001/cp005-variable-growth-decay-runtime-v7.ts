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
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV6,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV6,
} from "./cp005-variable-growth-decay-runtime-v6";

export const INT_CP005_RUNTIME_VERSION_V7 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v7" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV7 = Omit<IntCp005QuestionV6, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V7;
};

type ThresholdState = Extract<IntCp005QuestionV6["mathematicalState"], { qlId: "INT-QL-093" }>;

const GROWTH_RATES = Object.freeze([5n, 8n, 10n, 12n, 15n, 20n, 25n, 30n].map((value) => rat(value)));
const DECAY_RATES = Object.freeze([5n, 10n, 12n, 15n, 20n, 25n].map((value) => rat(value)));
const INITIAL_MULTIPLIERS = Object.freeze([500n, 800n, 1000n, 1250n, 1600n, 2000n, 2500n, 3200n]);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function mix32(input: number): number {
  let x = input >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function stream(seed: string): () => number {
  let state = mix32(hash(`${seed}:cp005-v7-threshold-stream`) >>> 0);
  return () => {
    state = mix32((state + 0x9e3779b9) >>> 0);
    return state;
  };
}

function growthFactor(rate: Rational): Rational {
  return add(rat(1n), div(rate, rat(100n)));
}

function decayFactor(rate: Rational): Rational {
  return sub(rat(1n), div(rate, rat(100n)));
}

function stateForThreshold(seed: string): ThresholdState {
  const next = stream(seed);
  const direction = (next() & 1) === 0 ? "GROWTH" as const : "DECAY" as const;
  const pool = direction === "GROWTH" ? GROWTH_RATES : DECAY_RATES;
  const rate = pool[next() % pool.length]!;
  const targetYear = 2 + (next() % 4);
  const factor = direction === "GROWTH" ? growthFactor(rate) : decayFactor(rate);
  const targetFactor = pow(factor, targetYear);
  const multiplier = INITIAL_MULTIPLIERS[next() % INITIAL_MULTIPLIERS.length]!;
  const initial = rat(targetFactor.denominator * multiplier);
  const threshold = mul(initial, targetFactor);
  if (initial.denominator !== 1n || threshold.denominator !== 1n) {
    throw new Error(`INT-QL-093/V7: threshold construction did not produce integral learner values`);
  }
  return deepFreeze({
    qlId: "INT-QL-093",
    context: direction === "GROWTH" ? "POPULATION" : "ASSET",
    initial,
    rate,
    direction,
    threshold,
    targetYear,
  });
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

function integerText(value: Rational): string {
  if (value.denominator !== 1n) throw new Error(`INT-QL-093/V7: non-integral visible value ${value.numerator}/${value.denominator}`);
  return indianInteger(value.numerator);
}

function rateText(rate: Rational): string {
  if (rate.denominator !== 1n) throw new Error("INT-QL-093/V7: non-integral rate profile");
  return `${rate.numerator}%`;
}

function answerText(year: number, locale: IntCp005Locale): string {
  if (locale === "hi-IN") return `${year} वर्ष`;
  if (locale === "pa-IN") return `${year} ਸਾਲ`;
  return `${year} years`;
}

function presentationFor(state: ThresholdState, locale: IntCp005Locale) {
  const rate = rateText(state.rate);
  if (state.direction === "GROWTH") {
    const initial = integerText(state.initial);
    const threshold = integerText(state.threshold);
    const prompt = locale === "en-IN"
      ? `A town has a population of ${initial} people. The population grows by ${rate} every year. After how many complete years will it first reach at least ${threshold} people?`
      : locale === "hi-IN"
        ? `एक नगर की जनसंख्या ${initial} है। जनसंख्या हर वर्ष ${rate} बढ़ती है। कितने पूरे वर्षों बाद यह पहली बार कम-से-कम ${threshold} होगी?`
        : `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${initial} ਹੈ। ਆਬਾਦੀ ਹਰ ਸਾਲ ${rate} ਵਧਦੀ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਹ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${threshold} ਹੋਵੇਗੀ?`;
    return deepFreeze({ prompt, markdown: prompt });
  }

  const initial = `₹${integerText(state.initial)}`;
  const threshold = `₹${integerText(state.threshold)}`;
  const prompt = locale === "en-IN"
    ? `An asset is worth ${initial}. Its value depreciates by ${rate} every year. After how many complete years will its value first fall to ${threshold} or below?`
    : locale === "hi-IN"
      ? `एक संपत्ति का मूल्य ${initial} है। इसका मूल्य हर वर्ष ${rate} घटता है। कितने पूरे वर्षों बाद इसका मूल्य पहली बार ${threshold} या उससे कम होगा?`
      : `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${initial} ਹੈ। ਇਸ ਦਾ ਮੁੱਲ ਹਰ ਸਾਲ ${rate} ਘਟਦਾ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${threshold} ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਵੇਗਾ?`;
  return deepFreeze({ prompt, markdown: prompt });
}

function feedbackById(source: IntCp005QuestionV6): ReadonlyMap<string, string> {
  return new Map(source.options.map((option) => [option.misconceptionId, option.studentFeedback]));
}

function optionsFor(source: IntCp005QuestionV6, state: ThresholdState, seed: string, locale: IntCp005Locale) {
  const feedback = feedbackById(source);
  const years = [
    { value: state.targetYear, misconceptionId: "CORRECT", isCorrect: true },
    { value: Math.max(1, state.targetYear - 1), misconceptionId: "ONE_YEAR_EARLY", isCorrect: false },
    { value: state.targetYear + 1, misconceptionId: "ONE_YEAR_LATE", isCorrect: false },
    { value: state.targetYear + 2, misconceptionId: "NEARBY_ARITHMETIC", isCorrect: false },
  ];
  const unique = years.filter((entry, index) => years.findIndex((candidate) => candidate.value === entry.value) === index);
  if (unique.length !== 4) throw new Error(`INT-QL-093/V7: threshold option construction lost uniqueness`);
  const items = unique.map((entry) => deepFreeze({
    text: answerText(entry.value, locale),
    value: rat(BigInt(entry.value)),
    misconceptionId: entry.misconceptionId,
    studentFeedback: feedback.get(entry.misconceptionId) ?? (locale === "en-IN" ? "This period does not satisfy the first-crossing condition." : locale === "hi-IN" ? "यह अवधि पहली सीमा-पार शर्त को संतुष्ट नहीं करती।" : "ਇਹ ਮਿਆਦ ਪਹਿਲੀ ਹੱਦ-ਪਾਰ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦੀ।"),
    isCorrect: entry.isCorrect,
  }));
  const next = stream(`${seed}:threshold-option-order`);
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = next() % (index + 1);
    [items[index], items[target]] = [items[target]!, items[index]!];
  }
  return deepFreeze(items);
}

function mathNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}

function explanationFor(source: IntCp005QuestionV6, state: ThresholdState, locale: IntCp005Locale) {
  const factor = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
  const previous = mul(state.initial, pow(factor, state.targetYear - 1));
  const atTarget = mul(state.initial, pow(factor, state.targetYear));
  const sign = state.direction === "GROWTH" ? "+" : "-";
  const formulaPrefix = locale === "en-IN" ? "Formula:" : locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  const boundaryPrefix = locale === "en-IN" ? "Boundary check:" : locale === "hi-IN" ? "सीमा जाँच:" : "ਹੱਦ ਜਾਂਚ:";
  const final = locale === "en-IN"
    ? `Therefore, the first crossing time is ${answerText(state.targetYear, locale)}.`
    : locale === "hi-IN"
      ? `अतः पहली सीमा-पार अवधि ${answerText(state.targetYear, locale)} है।`
      : `ਇਸ ਲਈ ਪਹਿਲੀ ਹੱਦ-ਪਾਰ ਮਿਆਦ ${answerText(state.targetYear, locale)} ਹੈ।`;
  return deepFreeze({
    keyIdea: source.explanation.keyIdea,
    steps: Object.freeze([
      `${formulaPrefix} \\(V_t=V_0\\left(1${sign}\\frac{r}{100}\\right)^t\\).`,
      `${boundaryPrefix} \\(V_{${state.targetYear - 1}}=${mathNumber(previous)},\\quad V_{${state.targetYear}}=${mathNumber(atTarget)}\\).`,
      final,
    ]),
    finalAnswer: answerText(state.targetYear, locale),
    commonMistake: source.explanation.commonMistake,
  });
}

function fingerprint(state: ThresholdState): string {
  const r = (value: Rational) => `${value.numerator}/${value.denominator}`;
  return `INT-QL-093|${state.direction}|${r(state.initial)}|${r(state.rate)}|${r(state.threshold)}|${state.targetYear}`;
}

export function generateIntCp005QuestionV7(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV7 {
  const source = generateIntCp005QuestionV6(qlId, seed, locale);
  if (qlId !== "INT-QL-093") return deepFreeze({ ...source, runtimeVersion: INT_CP005_RUNTIME_VERSION_V7 });

  const state = stateForThreshold(seed);
  const solution = rat(BigInt(state.targetYear));
  if (!verifyIntCp005Answer(state, solution)) throw new Error(`${qlId}/${seed}: V7 threshold solution fails independent verifier`);
  const options = optionsFor(source, state, seed, locale);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: V7 threshold option ownership failure`);

  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V7,
    seed,
    mathematicalState: state,
    mathematicalFingerprint: fingerprint(state),
    answerSemantic: "TIME_YEARS",
    representation: "STANDARD_PROSE",
    presentation: presentationFor(state, locale),
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    solution,
    explanation: explanationFor(source, state, locale),
  });
}
