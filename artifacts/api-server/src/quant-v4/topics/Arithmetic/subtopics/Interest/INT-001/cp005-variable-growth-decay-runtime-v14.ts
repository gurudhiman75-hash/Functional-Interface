import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV13,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV13,
} from "./cp005-variable-growth-decay-runtime-v13";

export const INT_CP005_RUNTIME_VERSION_V14 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v14" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV14 = Omit<IntCp005QuestionV13, "runtimeVersion" | "answerSemantic"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V14;
  readonly answerSemantic: IntCp005QuestionV13["answerSemantic"];
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp005QuestionV14(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV14 {
  const source = generateIntCp005QuestionV13(qlId, seed, locale);
  const answerSemantic = qlId === "INT-QL-086" || qlId === "INT-QL-088"
    ? "CONTEXT_VALUE"
    : source.answerSemantic;
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V14,
    answerSemantic,
  });
}
