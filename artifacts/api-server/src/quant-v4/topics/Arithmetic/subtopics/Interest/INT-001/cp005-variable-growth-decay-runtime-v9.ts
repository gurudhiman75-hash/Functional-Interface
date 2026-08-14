import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV8,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV8,
} from "./cp005-variable-growth-decay-runtime-v8";

export const INT_CP005_RUNTIME_VERSION_V9 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v9" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV9 = Omit<IntCp005QuestionV8, "runtimeVersion" | "presentation" | "explanation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V9;
  readonly presentation: IntCp005QuestionV8["presentation"];
  readonly explanation: IntCp005QuestionV8["explanation"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function isAtLeastRupees(value: { readonly numerator: bigint; readonly denominator: bigint }, rupees: bigint): boolean {
  return value.numerator >= rupees * value.denominator;
}

function polishHighSalaryContext(source: IntCp005QuestionV8, text: string, locale: IntCp005Locale): string {
  if (source.mathematicalState.context !== "SALARY") return text;
  const highValue = isAtLeastRupees(source.mathematicalState.initial, 2_000_000n)
    || (source.mathematicalState.qlId === "INT-QL-088" && isAtLeastRupees(source.mathematicalState.finalValue, 2_000_000n));
  if (!highValue) return text;

  if (locale === "en-IN") return text.replace(/An employee's annual salary/gu, "A senior executive's annual salary");
  if (locale === "hi-IN") return text.replace(/एक कर्मचारी का वार्षिक वेतन/gu, "एक वरिष्ठ अधिकारी का वार्षिक वेतन");
  return text.replace(/ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ/gu, "ਇੱਕ ਸੀਨੀਅਰ ਅਧਿਕਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ");
}

function localizedKnownFactorDefinition(locale: IntCp005Locale): string {
  if (locale === "en-IN") return String.raw`Here, \(K\) is the product of the known yearly growth factors.`;
  if (locale === "hi-IN") return String.raw`यहाँ \(K\) ज्ञात वर्षों के वृद्धि-गुणकों का गुणनफल है।`;
  return String.raw`ਇੱਥੇ \(K\) ਜਾਣੇ ਹੋਏ ਸਾਲਾਂ ਦੇ ਵਾਧੇ-ਗੁਣਕਾਂ ਦਾ ਗੁਣਨਫਲ ਹੈ।`;
}

function ql089Steps(source: IntCp005QuestionV8, locale: IntCp005Locale): readonly string[] {
  const original = source.explanation.steps;
  if (original.length < 3) return original;
  const first = locale === "en-IN"
    ? String.raw`Formula: \(V_n=V_0K\left(1+\frac{x}{100}\right)\).`
    : locale === "hi-IN"
      ? String.raw`सूत्र: \(V_n=V_0K\left(1+\frac{x}{100}\right)\)।`
      : String.raw`ਸੂਤਰ: \(V_n=V_0K\left(1+\frac{x}{100}\right)\)।`;
  return Object.freeze([first, localizedKnownFactorDefinition(locale), ...original.slice(1)]);
}

function commonMistakeFor(source: IntCp005QuestionV8, locale: IntCp005Locale): string {
  if (source.qlId === "INT-QL-088" && source.mathematicalState.context === "SALARY") {
    if (locale === "en-IN") return "Reversing the salary changes linearly is wrong; each year must be reversed by dividing by that year's salary-growth factor.";
    if (locale === "hi-IN") return "वेतन-वृद्धि को रैखिक रूप से उलटना गलत है; हर वर्ष के वेतन-वृद्धि गुणक से भाग देकर पीछे जाना चाहिए।";
    return "ਤਨਖਾਹ ਦੇ ਵਾਧੇ ਨੂੰ ਰੇਖੀ ਤਰੀਕੇ ਨਾਲ ਉਲਟਣਾ ਗਲਤ ਹੈ; ਹਰ ਸਾਲ ਦੇ ਤਨਖਾਹ-ਵਾਧਾ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਪਿੱਛੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।";
  }

  if (source.qlId === "INT-QL-088" && source.mathematicalState.context === "POPULATION") {
    if (locale === "en-IN") return "Reversing population growth linearly is wrong; divide by each year's population-growth factor to work backward.";
    if (locale === "hi-IN") return "जनसंख्या वृद्धि को रैखिक रूप से उलटना गलत है; पीछे जाने के लिए हर वर्ष के जनसंख्या-वृद्धि गुणक से भाग दें।";
    return "ਆਬਾਦੀ ਦੇ ਵਾਧੇ ਨੂੰ ਰੇਖੀ ਤਰੀਕੇ ਨਾਲ ਉਲਟਣਾ ਗਲਤ ਹੈ; ਪਿੱਛੇ ਜਾਣ ਲਈ ਹਰ ਸਾਲ ਦੇ ਆਬਾਦੀ-ਵਾਧਾ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।";
  }

  if (source.qlId === "INT-QL-091") {
    if (locale === "en-IN") return "Adding the depreciation rates back is wrong; recover the original value by dividing by each year's remaining-value factor.";
    if (locale === "hi-IN") return "मूल्यह्रास दरों को केवल वापस जोड़ना गलत है; मूल मूल्य पाने के लिए हर वर्ष के शेष-मूल्य गुणक से भाग दें।";
    return "ਮੁੱਲ ਘਟਾਅ ਦੀਆਂ ਦਰਾਂ ਨੂੰ ਸਿਰਫ਼ ਵਾਪਸ ਜੋੜਨਾ ਗਲਤ ਹੈ; ਮੂਲ ਮੁੱਲ ਲਈ ਹਰ ਸਾਲ ਦੇ ਬਚੇ-ਮੁੱਲ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।";
  }

  if (source.qlId === "INT-QL-093") {
    if (locale === "en-IN") return "Choosing one year earlier is wrong because the boundary has not yet been crossed at that time.";
    if (locale === "hi-IN") return "एक वर्ष पहले का उत्तर चुनना गलत है, क्योंकि उस समय सीमा अभी पार नहीं हुई होती।";
    return "ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ ਵਾਲਾ ਉੱਤਰ ਚੁਣਨਾ ਗਲਤ ਹੈ, ਕਿਉਂਕਿ ਉਸ ਵੇਲੇ ਹੱਦ ਹਾਲੇ ਪਾਰ ਨਹੀਂ ਹੋਈ ਹੁੰਦੀ।";
  }

  return source.explanation.commonMistake;
}

function polishProductionFinalStep(source: IntCp005QuestionV8, step: string, locale: IntCp005Locale): string {
  if (source.qlId !== "INT-QL-086" || source.mathematicalState.context !== "PRODUCTION") return step;
  if (locale === "hi-IN") return step.replace(/([0-9,]+) इकाइयाँ है।$/u, "$1 इकाइयों की है।");
  if (locale === "pa-IN") return step.replace(/([0-9,]+) ਇਕਾਈਆਂ ਹੈ।$/u, "$1 ਇਕਾਈਆਂ ਦੀ ਹੈ।");
  return step;
}

function explanationV9(source: IntCp005QuestionV8, locale: IntCp005Locale): IntCp005QuestionV8["explanation"] {
  const baseSteps = source.qlId === "INT-QL-089" ? ql089Steps(source, locale) : source.explanation.steps;
  const steps = Object.freeze(baseSteps.map((step, index) => {
    if (index !== baseSteps.length - 1) return step;
    return polishProductionFinalStep(source, step, locale);
  }));
  return deepFreeze({
    ...source.explanation,
    steps,
    commonMistake: commonMistakeFor(source, locale),
  });
}

export function generateIntCp005QuestionV9(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV9 {
  const source = generateIntCp005QuestionV8(qlId, seed, locale);
  const prompt = polishHighSalaryContext(source, source.presentation.prompt, locale);
  const markdown = polishHighSalaryContext(source, source.presentation.markdown, locale);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V9,
    presentation: { ...source.presentation, prompt, markdown },
    explanation: explanationV9(source, locale),
  });
}
