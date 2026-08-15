import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV11,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV11,
} from "./cp005-variable-growth-decay-runtime-v11";

export const INT_CP005_RUNTIME_VERSION_V12 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v12" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV12 = Omit<IntCp005QuestionV11, "runtimeVersion" | "answerSemantic" | "options" | "correctAnswer" | "explanation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V12;
  readonly answerSemantic: IntCp005QuestionV11["answerSemantic"];
  readonly options: IntCp005QuestionV11["options"];
  readonly correctAnswer: string;
  readonly explanation: IntCp005QuestionV11["explanation"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function numericText(text: string): string {
  return text
    .replace(/^₹/u, "")
    .replace(/\s+(?:people|units|लोग|इकाइयाँ|ਲੋਕ|ਇਕਾਈਆਂ)$/u, "");
}

function contextValueText(text: string, context: "POPULATION" | "PRODUCTION", locale: IntCp005Locale): string {
  const value = numericText(text);
  if (context === "POPULATION") {
    if (locale === "en-IN") return `${value} people`;
    if (locale === "hi-IN") return `${value} लोग`;
    return `${value} ਲੋਕ`;
  }
  if (locale === "en-IN") return `${value} units`;
  if (locale === "hi-IN") return `${value} इकाइयाँ`;
  return `${value} ਇਕਾਈਆਂ`;
}

export function generateIntCp005QuestionV12(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV12 {
  const source = generateIntCp005QuestionV11(qlId, seed, locale);
  const isContextValue = (qlId === "INT-QL-086" || qlId === "INT-QL-088")
    && (source.mathematicalState.context === "POPULATION" || source.mathematicalState.context === "PRODUCTION");

  if (!isContextValue) {
    return deepFreeze({ ...source, runtimeVersion: INT_CP005_RUNTIME_VERSION_V12 });
  }

  const context = source.mathematicalState.context as "POPULATION" | "PRODUCTION";
  const options = Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    text: contextValueText(option.text, context, locale),
  })));
  const correctAnswer = options[source.correctIndex]!.text;
  const explanation = deepFreeze({ ...source.explanation, finalAnswer: correctAnswer });

  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V12,
    answerSemantic: "CONTEXT_VALUE",
    options,
    correctAnswer,
    explanation,
  });
}
