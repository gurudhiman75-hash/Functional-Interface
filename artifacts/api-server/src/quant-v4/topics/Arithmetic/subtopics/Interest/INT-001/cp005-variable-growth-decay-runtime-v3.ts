import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV2,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV2,
} from "./cp005-variable-growth-decay-runtime-v2";

export const INT_CP005_RUNTIME_VERSION_V3 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v3" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV3 = Omit<IntCp005QuestionV2, "runtimeVersion" | "presentation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V3;
  readonly presentation: IntCp005QuestionV2["presentation"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function surfaceReverseSalaryContext(text: string, locale: IntCp005Locale): string {
  if (locale === "en-IN") {
    return text
      .replace("An amount grows to", "An employee's annual salary grows to")
      .replace("What was the initial amount?", "What was the annual salary at the beginning?");
  }
  if (locale === "hi-IN") {
    return text
      .replace("एक राशि", "एक कर्मचारी का वार्षिक वेतन")
      .replace("प्रारंभिक राशि कितनी थी?", "प्रारंभ में वार्षिक वेतन कितना था?");
  }
  return text
    .replace("ਇੱਕ ਰਕਮ", "ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ")
    .replace("ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕਿੰਨੀ ਸੀ?", "ਸ਼ੁਰੂ ਵਿੱਚ ਸਾਲਾਨਾ ਤਨਖਾਹ ਕਿੰਨੀ ਸੀ?");
}

export function generateIntCp005QuestionV3(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV3 {
  const source = generateIntCp005QuestionV2(qlId, seed, locale);
  let presentation = source.presentation;

  if (source.qlId === "INT-QL-088" && source.mathematicalState.context === "SALARY") {
    const prompt = surfaceReverseSalaryContext(source.presentation.prompt, locale);
    const markdown = surfaceReverseSalaryContext(source.presentation.markdown, locale);
    presentation = deepFreeze({
      prompt,
      markdown,
      ...(source.presentation.table ? { table: source.presentation.table } : {}),
    });
  }

  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V3,
    presentation,
  });
}
