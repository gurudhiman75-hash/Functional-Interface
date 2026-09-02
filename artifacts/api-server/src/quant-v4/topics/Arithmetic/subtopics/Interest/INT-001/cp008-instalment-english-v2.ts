import {
  INT_CP008_ENGLISH_VERSION as INT_CP008_ENGLISH_VERSION_V1,
  generateIntCp008EnglishQuestion as generateV1,
  type IntCp008EnglishQuestion as IntCp008EnglishQuestionV1,
} from "./cp008-instalment-english-v1";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_VERSION = "INT-CP-008-EN-v2-mathjax-fix-review" as const;
export const INT_CP008_ENGLISH_V2_SUPERSEDES = INT_CP008_ENGLISH_VERSION_V1;

export type IntCp008EnglishQuestion = Omit<IntCp008EnglishQuestionV1, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP008_ENGLISH_VERSION;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function repairQl120Step(step: string, stepIndex: number): string {
  if (stepIndex !== 2) return step;
  return step.replace(/\$\.$/u, ".");
}

export function generateIntCp008EnglishQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp008EnglishQuestion {
  const source = generateV1(qlId, seed, locale);
  const steps = qlId === "INT-QL-120"
    ? Object.freeze(source.explanation.steps.map(repairQl120Step))
    : source.explanation.steps;

  return deepFreeze({
    ...source,
    englishVersion: INT_CP008_ENGLISH_VERSION,
    explanation: deepFreeze({
      ...source.explanation,
      steps,
    }),
  });
}
