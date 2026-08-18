import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V7,
  generateIntCp007EnglishQuestion as generateV7,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV7,
} from "./cp007-scheme-equivalence-english-v7";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v8-exam-editorial-review" as const;
export const INT_CP007_ENGLISH_V8_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V7;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV7, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP007_ENGLISH_VERSION;
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

function polishLearnerProse(text: string): string {
  return text
    .replace(/compound interest compounded annually at ([0-9.]+)% p\.a\. for (\d+) years?/gu, (_match, rate: string, years: string) => {
      const unit = years === "1" ? "year" : "years";
      return `compound interest at ${rate}% p.a., compounded annually for ${years} ${unit}`;
    })
    .replace(/compound interest compounded annually for (\d+) years?/gu, (_match, years: string) => {
      const unit = years === "1" ? "year" : "years";
      return `compound interest with annual compounding for ${years} ${unit}`;
    })
    .replace(/Using rupees, /gu, "")
    .replace(/The required-principal scheme has factor/gu, "The second scheme has accumulation factor")
    .replace(/Known-scheme accumulation factor:/gu, "Known scheme's accumulation factor:")
    .replace(/Known-scheme factor:/gu, "Known scheme's accumulation factor:")
    .replace(/Its maturity amount, in rupees, is/gu, "So its maturity amount is")
    .replace(/each complete scheme at the stated comparison date/gu, "each scheme for the given time")
    .replace(/two complete schemes/gu, "two schemes")
    .replace(/complete accumulation factors/gu, "overall growth factors")
    .replace(/complete accumulation factor/gu, "overall growth factor")
    .replace(/complete maturity factors/gu, "overall growth factors")
    .replace(/complete maturity factor/gu, "overall growth factor")
    .replace(/The required annual rate must make the second scheme produce exactly the same maturity factor as the known scheme for the same principal\./gu,
      "The two schemes start with the same principal, so the required rate must make their maturity amounts equal.")
    .replace(/Equal principal and equal maturity amount mean the two schemes must have the same overall growth factor\./gu,
      "Because the starting principal and maturity amount are the same, both schemes must have the same overall growth factor.")
    .replace(/Represent Scheme A's present share by a variable and the other share by the remaining part of the total\./gu,
      "Let Scheme A's present investment be a variable; Scheme B then receives the remaining part of the total.")
    .replace(/Let the two present principals be represented by separate variables\./gu,
      "Let the two starting principals be represented by separate variables.")
    .replace(/The required principal ratio comes from the overall growth factors/gu,
      "The required principal ratio comes from the schemes' overall growth factors")
    .replace(/First calculate the maturity value produced by the known present principal\./gu,
      "First calculate the maturity amount produced by the known starting principal.")
    .replace(/The known present principal is/gu, "The known starting principal is")
    .replace(/required present principal/gu, "required starting principal")
    .replace(/present principal required/gu, "starting principal required");
}

function polishExplanation(explanation: IntCp007EnglishQuestionV7["explanation"]): IntCp007EnglishQuestionV7["explanation"] {
  return deepFreeze({
    keyIdea: polishLearnerProse(explanation.keyIdea),
    steps: Object.freeze(explanation.steps.map(polishLearnerProse)),
    finalAnswer: explanation.finalAnswer,
    commonMistake: polishLearnerProse(explanation.commonMistake),
  });
}

export function generateIntCp007EnglishQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp007EnglishQuestion {
  const source = generateV7(qlId, seed, locale);
  const markdown = polishLearnerProse(source.presentation.markdown);
  const prompt = polishLearnerProse(source.presentation.prompt);
  const explanation = polishExplanation(source.explanation);

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    presentation: deepFreeze({
      ...source.presentation,
      markdown,
      prompt,
    }),
    explanation,
  });
}
