import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV10,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV10,
} from "./cp005-variable-growth-decay-runtime-v10";

export const INT_CP005_RUNTIME_VERSION_V11 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v11" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV11 = Omit<IntCp005QuestionV10, "runtimeVersion" | "explanation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V11;
  readonly explanation: IntCp005QuestionV10["explanation"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function ql089CommonMistake(locale: IntCp005Locale): string {
  if (locale === "en-IN") {
    return "A common error is to use simple interest or ignore one of the known yearly growth factors. Multiply the known factors first, then isolate the missing annual rate.";
  }
  if (locale === "hi-IN") {
    return "सामान्य गलती यह है कि साधारण ब्याज लगा दिया जाए या किसी ज्ञात वर्ष के वृद्धि-गुणक को छोड़ दिया जाए। पहले सभी ज्ञात वृद्धि-गुणकों का गुणनफल लें, फिर अज्ञात वार्षिक दर निकालें।";
  }
  return "ਆਮ ਗਲਤੀ ਇਹ ਹੈ ਕਿ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾ ਦਿੱਤਾ ਜਾਵੇ ਜਾਂ ਕਿਸੇ ਜਾਣੇ ਹੋਏ ਸਾਲ ਦੇ ਵਾਧਾ-ਗੁਣਕ ਨੂੰ ਛੱਡ ਦਿੱਤਾ ਜਾਵੇ। ਪਹਿਲਾਂ ਸਾਰੇ ਜਾਣੇ ਹੋਏ ਵਾਧਾ-ਗੁਣਕਾਂ ਦਾ ਗੁਣਨਫਲ ਲਵੋ, ਫਿਰ ਅਣਜਾਣ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।";
}

export function generateIntCp005QuestionV11(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV11 {
  const source = generateIntCp005QuestionV10(qlId, seed, locale);
  const explanation = qlId === "INT-QL-089"
    ? deepFreeze({ ...source.explanation, commonMistake: ql089CommonMistake(locale) })
    : source.explanation;
  return deepFreeze({ ...source, runtimeVersion: INT_CP005_RUNTIME_VERSION_V11, explanation });
}
