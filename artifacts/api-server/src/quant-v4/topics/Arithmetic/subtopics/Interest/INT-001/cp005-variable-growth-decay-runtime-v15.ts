import {
  add,
  div,
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
  generateIntCp005QuestionV14,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV14,
} from "./cp005-variable-growth-decay-runtime-v14";

export const INT_CP005_RUNTIME_VERSION_V15 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v15" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV15 = Omit<IntCp005QuestionV14, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V15;
};

type ThresholdState = Extract<IntCp005QuestionV14["mathematicalState"], { qlId: "INT-QL-093" }>;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function abs(value: bigint): bigint { return value < 0n ? -value : value; }
function gcd(a: bigint, b: bigint): bigint {
  a = abs(a); b = abs(b);
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}

function normalizeThresholdState(state: ThresholdState): ThresholdState {
  if (state.initial.denominator !== 1n || state.threshold.denominator !== 1n) {
    throw new Error("INT-QL-093/V15: threshold values must be integral before realism normalization");
  }
  const common = gcd(state.initial.numerator, state.threshold.numerator);
  const initial = rat(state.initial.numerator / common);
  const threshold = rat(state.threshold.numerator / common);
  return deepFreeze({ ...state, initial, threshold });
}

function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = abs(value).toString();
  if (source.length <= 3) return sign + source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}

function integerText(value: Rational): string {
  if (value.denominator !== 1n) throw new Error("INT-QL-093/V15: non-integral visible value");
  return indianInteger(value.numerator);
}

function rateText(value: Rational): string {
  if (value.denominator !== 1n) throw new Error("INT-QL-093/V15: non-integral threshold rate");
  return `${value.numerator}%`;
}

function answerText(year: number, locale: IntCp005Locale): string {
  if (locale === "hi-IN") return `${year} वर्ष`;
  if (locale === "pa-IN") return `${year} ਸਾਲ`;
  return `${year} ${year === 1 ? "year" : "years"}`;
}

function factor(state: ThresholdState): Rational {
  const rate = div(state.rate, rat(100n));
  return state.direction === "GROWTH" ? add(rat(1n), rate) : sub(rat(1n), rate);
}

function presentationFor(state: ThresholdState, locale: IntCp005Locale) {
  const rate = rateText(state.rate);
  if (state.direction === "GROWTH") {
    const initial = integerText(state.initial);
    const threshold = integerText(state.threshold);
    const prompt = locale === "en-IN"
      ? `A city has a population of ${initial} people. The population grows by ${rate} every year. After how many complete years will it first reach at least ${threshold} people?`
      : locale === "hi-IN"
        ? `एक शहर की जनसंख्या ${initial} है। जनसंख्या हर वर्ष ${rate} बढ़ती है। कितने पूरे वर्षों बाद यह पहली बार कम-से-कम ${threshold} होगी?`
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

function thresholdOptions(source: IntCp005QuestionV14, locale: IntCp005Locale) {
  return deepFreeze(source.options.map((option) => {
    if (option.value.denominator !== 1n) throw new Error("INT-QL-093/V15: non-integral year option");
    return {
      ...option,
      text: answerText(Number(option.value.numerator), locale),
    };
  }));
}

function mathNumber(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `\\frac{${value.numerator}}{${value.denominator}}`;
}

function explanationFor(source: IntCp005QuestionV14, state: ThresholdState, locale: IntCp005Locale) {
  const f = factor(state);
  const previous = mul(state.initial, pow(f, state.targetYear - 1));
  const atTarget = mul(state.initial, pow(f, state.targetYear));
  const sign = state.direction === "GROWTH" ? "+" : "-";
  const formulaPrefix = locale === "en-IN" ? "Formula:" : locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  const boundaryPrefix = locale === "en-IN" ? "Boundary check:" : locale === "hi-IN" ? "सीमा जाँच:" : "ਹੱਦ ਜਾਂਚ:";
  const final = locale === "en-IN"
    ? `Therefore, the first crossing time is ${answerText(state.targetYear, locale)}.`
    : locale === "hi-IN"
      ? `अतः पहली सीमा-पार अवधि ${answerText(state.targetYear, locale)} है।`
      : `ਇਸ ਲਈ ਪਹਿਲੀ ਹੱਦ-ਪਾਰ ਮਿਆਦ ${answerText(state.targetYear, locale)} ਹੈ।`;
  return deepFreeze({
    ...source.explanation,
    steps: Object.freeze([
      `${formulaPrefix} \\(V_t=V_0\\left(1${sign}\\frac{r}{100}\\right)^t\\).`,
      `${boundaryPrefix} \\(V_{${state.targetYear - 1}}=${mathNumber(previous)},\\quad V_{${state.targetYear}}=${mathNumber(atTarget)}\\).`,
      final,
    ]),
    finalAnswer: answerText(state.targetYear, locale),
  });
}

function fingerprint(state: ThresholdState): string {
  const r = (value: Rational) => `${value.numerator}/${value.denominator}`;
  return `INT-QL-093|${state.direction}|${r(state.initial)}|${r(state.rate)}|${r(state.threshold)}|${state.targetYear}|V15_REALISM_NORMALIZED`;
}

export function generateIntCp005QuestionV15(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV15 {
  const source = generateIntCp005QuestionV14(qlId, seed, locale);
  if (qlId !== "INT-QL-093") return deepFreeze({ ...source, runtimeVersion: INT_CP005_RUNTIME_VERSION_V15 });

  const state = normalizeThresholdState(source.mathematicalState as ThresholdState);
  if (!verifyIntCp005Answer(state, source.solution)) {
    throw new Error(`${qlId}/${seed}: V15 normalized threshold state fails independent verifier`);
  }
  const options = thresholdOptions(source, locale);
  const correctAnswer = options[source.correctIndex]!.text;

  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V15,
    mathematicalState: state,
    mathematicalFingerprint: fingerprint(state),
    presentation: presentationFor(state, locale),
    options,
    correctAnswer,
    explanation: explanationFor(source, state, locale),
  });
}
