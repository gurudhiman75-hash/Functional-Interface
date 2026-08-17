import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV12,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV12,
} from "./cp005-variable-growth-decay-runtime-v12";

export const INT_CP005_RUNTIME_VERSION_V13 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v13" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV13 = Omit<IntCp005QuestionV12, "runtimeVersion" | "answerSemantic" | "correctAnswer" | "explanation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V13;
  readonly answerSemantic: IntCp005QuestionV12["answerSemantic"];
  readonly correctAnswer: string;
  readonly explanation: IntCp005QuestionV12["explanation"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function explicitSemantic(question: IntCp005QuestionV12): IntCp005QuestionV12["answerSemantic"] {
  if (question.qlId !== "INT-QL-086" && question.qlId !== "INT-QL-088") return question.answerSemantic;
  const context = question.mathematicalState.context;
  if (context === "POPULATION" || context === "PRODUCTION") return "CONTEXT_VALUE";
  if (context === "INVESTMENT" || context === "SALARY") return "MONEY";
  return question.answerSemantic;
}

export function generateIntCp005QuestionV13(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV13 {
  const source = generateIntCp005QuestionV12(qlId, seed, locale);
  const answerSemantic = explicitSemantic(source);
  const correctAnswer = source.options[source.correctIndex]!.text;
  const explanation = source.explanation.finalAnswer === correctAnswer
    ? source.explanation
    : deepFreeze({ ...source.explanation, finalAnswer: correctAnswer });

  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V13,
    answerSemantic,
    correctAnswer,
    explanation,
  });
}
