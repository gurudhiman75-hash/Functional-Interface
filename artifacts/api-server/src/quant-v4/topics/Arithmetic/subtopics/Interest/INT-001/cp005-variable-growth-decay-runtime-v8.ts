import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV7,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV7,
} from "./cp005-variable-growth-decay-runtime-v7";

export const INT_CP005_RUNTIME_VERSION_V8 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v8" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV8 = Omit<IntCp005QuestionV7, "runtimeVersion" | "presentation" | "explanation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V8;
  readonly presentation: IntCp005QuestionV7["presentation"];
  readonly explanation: IntCp005QuestionV7["explanation"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function polishPresentationText(
  source: IntCp005QuestionV7,
  text: string,
  locale: IntCp005Locale,
): string {
  let result = text;

  if (locale === "hi-IN") {
    // Population is the count itself; "जनसंख्या 80,000 लोग है" is not natural Hindi.
    result = result.replace(/जनसंख्या ([0-9,]+) लोग है/gu, "जनसंख्या $1 है");
    result = result.replace(/लोग लोग/gu, "लोग");
  }
  if (locale === "pa-IN") {
    result = result.replace(/ਆਬਾਦੀ ([0-9,]+) ਲੋਕ ਹੈ/gu, "ਆਬਾਦੀ $1 ਹੈ");
    result = result.replace(/ਲੋਕ ਲੋਕ/gu, "ਲੋਕ");
  }

  if (source.qlId === "INT-QL-088" && source.mathematicalState.context === "SALARY") {
    if (locale === "en-IN") {
      result = result.replace(/annual compound rates/gu, "annual salary-growth rates");
    } else if (locale === "hi-IN") {
      result = result.replace(/वार्षिक चक्रवृद्धि दरों/gu, "वार्षिक वेतन-वृद्धि दरों");
    } else {
      result = result.replace(/ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ/gu, "ਸਾਲਾਨਾ ਤਨਖਾਹ-ਵਾਧੇ ਦੀਆਂ ਦਰਾਂ");
    }
  }

  return result;
}

function answerValueFromStep(step: string, locale: IntCp005Locale): string | undefined {
  if (locale === "en-IN") return step.match(/(?:is|was) (₹?[0-9,]+(?: people| units)?)[.]?$/u)?.[1];
  if (locale === "hi-IN") return step.match(/(₹?[0-9,]+(?: लोग| इकाइयाँ)?) (?:है|था|थी)।?$/u)?.[1];
  return step.match(/(₹?[0-9,]+(?: ਲੋਕ| ਇਕਾਈਆਂ)?) (?:ਹੈ|ਸੀ)।?$/u)?.[1];
}

function contextualFinalStep(
  source: IntCp005QuestionV7,
  step: string,
  locale: IntCp005Locale,
): string {
  const context = source.mathematicalState.context;
  const value = answerValueFromStep(step, locale);
  if (!value) return step;
  const numeric = value.replace(/ (?:people|units|लोग|इकाइयाँ|ਲੋਕ|ਇਕਾਈਆਂ)$/u, "");

  if (source.qlId === "INT-QL-086") {
    if (context === "POPULATION") {
      return locale === "en-IN" ? `Therefore, the final population is ${numeric} people.` : locale === "hi-IN" ? `अतः अंतिम जनसंख्या ${numeric} है।` : `ਇਸ ਲਈ ਅੰਤਿਮ ਆਬਾਦੀ ${numeric} ਹੈ।`;
    }
    if (context === "PRODUCTION") {
      return locale === "en-IN" ? `Therefore, the final annual production capacity is ${numeric} units.` : locale === "hi-IN" ? `अतः अंतिम वार्षिक उत्पादन क्षमता ${numeric} इकाइयाँ है।` : `ਇਸ ਲਈ ਅੰਤਿਮ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ ${numeric} ਇਕਾਈਆਂ ਹੈ।`;
    }
    if (context === "SALARY") {
      return locale === "en-IN" ? `Therefore, the annual salary after the stated increases is ${numeric}.` : locale === "hi-IN" ? `अतः दी गई वृद्धियों के बाद वार्षिक वेतन ${numeric} है।` : `ਇਸ ਲਈ ਦਿੱਤੇ ਵਾਧਿਆਂ ਤੋਂ ਬਾਅਦ ਸਾਲਾਨਾ ਤਨਖਾਹ ${numeric} ਹੈ।`;
    }
    return locale === "en-IN" ? `Therefore, the final investment amount is ${numeric}.` : locale === "hi-IN" ? `अतः अंतिम निवेश राशि ${numeric} है।` : `ਇਸ ਲਈ ਅੰਤਿਮ ਨਿਵੇਸ਼ ਰਕਮ ${numeric} ਹੈ।`;
  }

  if (source.qlId === "INT-QL-088") {
    if (context === "POPULATION") {
      return locale === "en-IN" ? `Therefore, the population at the beginning was ${numeric} people.` : locale === "hi-IN" ? `अतः प्रारंभिक जनसंख्या ${numeric} थी।` : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ${numeric} ਸੀ।`;
    }
    if (context === "SALARY") {
      return locale === "en-IN" ? `Therefore, the annual salary at the beginning was ${numeric}.` : locale === "hi-IN" ? `अतः प्रारंभिक वार्षिक वेतन ${numeric} था।` : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਸਾਲਾਨਾ ਤਨਖਾਹ ${numeric} ਸੀ।`;
    }
    return locale === "en-IN" ? `Therefore, the initial investment amount was ${numeric}.` : locale === "hi-IN" ? `अतः प्रारंभिक निवेश राशि ${numeric} थी।` : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਨਿਵੇਸ਼ ਰਕਮ ${numeric} ਸੀ।`;
  }

  if (source.qlId === "INT-QL-094") {
    return locale === "en-IN" ? `Therefore, the final population is ${numeric} people.` : locale === "hi-IN" ? `अतः अंतिम जनसंख्या ${numeric} है।` : `ਇਸ ਲਈ ਅੰਤਿਮ ਆਬਾਦੀ ${numeric} ਹੈ।`;
  }

  return step;
}

function explanationV8(source: IntCp005QuestionV7, locale: IntCp005Locale): IntCp005QuestionV7["explanation"] {
  const steps = source.explanation.steps.map((step, index) => {
    if (index !== source.explanation.steps.length - 1) return step;
    return contextualFinalStep(source, step, locale);
  });
  return deepFreeze({ ...source.explanation, steps: Object.freeze(steps) });
}

export function generateIntCp005QuestionV8(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV8 {
  const source = generateIntCp005QuestionV7(qlId, seed, locale);
  const prompt = polishPresentationText(source, source.presentation.prompt, locale);
  const markdown = polishPresentationText(source, source.presentation.markdown, locale);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V8,
    presentation: {
      ...source.presentation,
      prompt,
      markdown,
    },
    explanation: explanationV8(source, locale),
  });
}
