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
    .replace(/Scheme B runs for (\d+) years? under simple interest/gu, (_match, years: string) => {
      const unit = years === "1" ? "year" : "years";
      return `Scheme B uses simple interest for ${years} ${unit}`;
    })
    .replace(/Using rupees, /gu, "")
    .replace(/The required-principal scheme has factor/gu, "The second scheme's growth factor is")
    .replace(/Known-scheme accumulation factor:/gu, "The known scheme's growth factor is")
    .replace(/Known-scheme factor:/gu, "The known scheme's growth factor is")
    .replace(/Its maturity amount, in rupees, is/gu, "So its maturity amount is")
    .replace(/each complete scheme at the stated comparison date/gu, "each scheme for the given time")
    .replace(/two complete schemes/gu, "two schemes")
    .replace(/complete accumulation factors/gu, "overall growth factors")
    .replace(/complete accumulation factor/gu, "overall growth factor")
    .replace(/complete maturity factors/gu, "overall growth factors")
    .replace(/complete maturity factor/gu, "overall growth factor")
    .replace(/accumulation factors/gu, "growth factors")
    .replace(/accumulation factor/gu, "growth factor")
    .replace(/The required annual rate must make the second scheme produce exactly the same maturity factor as the known scheme for the same principal\./gu,
      "The two schemes start with the same principal, so the required rate must make their maturity amounts equal.")
    .replace(/Equal principal and equal maturity amount mean the two schemes must have the same growth factor\./gu,
      "Because both schemes start with the same principal and finish with the same amount, their growth factors must be equal.")
    .replace(/Represent Scheme A's present share by a variable and the other share by the remaining part of the total\./gu,
      "Let Scheme A's starting amount be a variable; Scheme B then receives the remaining part of the total.")
    .replace(/Grow both shares to maturity, equate their future values, and solve the resulting equation\./gu,
      "Calculate both maturity amounts, set them equal, and solve for the unknown starting amount.")
    .replace(/present-principal ratio A:B/gu, "ratio of the present investments, A:B")
    .replace(/present-principal ratio/gu, "ratio of the present investments")
    .replace(/Let the two present principals be represented by separate variables\./gu,
      "Let the two starting principals be represented by separate variables.")
    .replace(/Equal future values require each present principal multiplied by its overall growth factor to give the same result\. Therefore the present principals must be in the inverse ratio of the two factors\./gu,
      "For equal maturity amounts, each starting principal multiplied by its growth factor must give the same result. Therefore the starting principals are in the inverse ratio of the two growth factors.")
    .replace(/present principals/gu, "starting principals")
    .replace(/present principal/gu, "starting principal")
    .replace(/present share/gu, "starting amount")
    .replace(/The required principal ratio comes from the overall growth factors/gu,
      "The required principal ratio comes from the schemes' overall growth factors")
    .replace(/First calculate the maturity value produced by the known starting principal\./gu,
      "First calculate the maturity amount produced by the known starting principal.")
    .replace(/What present sum must be invested/gu, "What amount must be invested")
    .replace(/Determine the present amount under/gu, "Determine the amount that should be invested under")
    .replace(/A present investment of/gu, "An investment of")
    .replace(/required starting principal/gu, "required initial principal")
    .replace(/starting principal required/gu, "initial principal required")
    .replace(/Determine the amount that should be invested under compound interest at ([0-9.]+)% p\.a\., compounded annually for (\d+) (year|years) that will produce an equal maturity value\./gu,
      (_match, rate: string, years: string, unit: string) => `What amount should be invested at ${rate}% p.a. compound interest, compounded annually for ${years} ${unit}, to reach the same maturity value?`)
    .replace(/Find the initial principal required in Plan B to finish with the same future value as Plan A\./gu,
      "How much should be invested initially in Plan B to reach the same future value as Plan A?")
    .replace(/A first-overtake answer needs two consecutive checks: Scheme B must not be ahead at the previous whole year, and it must be ahead at the selected whole year\./gu,
      "To find the first overtake year, check two consecutive whole years: Scheme B must not be ahead one year earlier, but it must be ahead in the selected year.");
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
