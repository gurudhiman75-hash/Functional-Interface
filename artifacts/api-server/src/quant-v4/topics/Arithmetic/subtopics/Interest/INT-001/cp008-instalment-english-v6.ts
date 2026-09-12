import {
  INT_CP008_ENGLISH_VERSION as INT_CP008_ENGLISH_VERSION_V5,
  generateIntCp008EnglishQuestion as generateV5,
  type IntCp008EnglishQuestion as IntCp008EnglishQuestionV5,
} from "./cp008-instalment-english-v5";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_VERSION = "INT-CP-008-EN-v6-final-review-candidate" as const;
export const INT_CP008_ENGLISH_V6_SUPERSEDES = INT_CP008_ENGLISH_VERSION_V5;

export type IntCp008EnglishQuestion = Omit<IntCp008EnglishQuestionV5, "englishVersion"> & {
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

function repairSingularEach(prompt: string): string {
  return prompt.replace(/(\bpayment is ₹[\d,]+(?:\.\d+)?) each\b/gu, "$1");
}

export function generateIntCp008EnglishQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp008EnglishQuestion {
  const source = generateV5(qlId, seed, locale);
  const prompt = repairSingularEach(source.presentation.prompt);
  return deepFreeze({
    ...source,
    englishVersion: INT_CP008_ENGLISH_VERSION,
    presentation: deepFreeze({
      ...source.presentation,
      prompt,
      markdown: prompt,
    }),
  });
}
