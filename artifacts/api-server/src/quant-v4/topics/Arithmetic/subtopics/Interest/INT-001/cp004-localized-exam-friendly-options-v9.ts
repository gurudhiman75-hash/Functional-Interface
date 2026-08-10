import { rat, type Rational } from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type {
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
  IntCp004LocalizedQuestion,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EXAM_FRIENDLY_OPTIONS_V9_VERSION =
  "INT-CP-004-HI-PA-EXAM-FRIENDLY-OPTIONS-v9" as const;

function roundRational(value: Rational): bigint {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let quotient = numerator / value.denominator;
  const remainder = numerator % value.denominator;
  if (remainder * 2n >= value.denominator) quotient += 1n;
  return negative ? -quotient : quotient;
}

function displayIntegerOption(
  semantic: IntCp004LocalizedQuestion["answerSemantic"],
  value: bigint,
): string | null {
  if (semantic === "MONEY") return moneyText(rat(value));
  if (semantic === "RATE_PERCENT") return percentText(rat(value));
  return null;
}

function collisionStep(semantic: IntCp004LocalizedQuestion["answerSemantic"]): bigint {
  return semantic === "MONEY" ? 10n : 1n;
}

export function renderIntCp004ExamFriendlyOptionTextsV9(
  question: IntCp004LocalizedQuestion,
  _locale: IntCp004LocalizedLocale,
): readonly string[] {
  if (question.answerSemantic !== "MONEY" && question.answerSemantic !== "RATE_PERCENT") {
    return Object.freeze(question.options.map((option) => option.text));
  }

  const correctValue = roundRational(question.options[question.correctIndex]!.value);
  const step = collisionStep(question.answerSemantic);
  const used = new Set<string>();
  const texts: string[] = [];

  for (const [index, option] of question.options.entries()) {
    let displayedValue = roundRational(option.value);
    if (index === question.correctIndex) displayedValue = correctValue;

    if (index !== question.correctIndex) {
      let nudge = 0n;
      while (
        displayedValue === correctValue
        || used.has(displayedValue.toString())
        || (question.answerSemantic === "RATE_PERCENT" && displayedValue < 0n)
      ) {
        nudge += step;
        displayedValue = roundRational(option.value) + nudge;
      }
    }

    used.add(displayedValue.toString());
    texts.push(displayIntegerOption(question.answerSemantic, displayedValue) ?? option.text);
  }

  return Object.freeze(texts);
}

export function adaptIntCp004ExamFriendlyOptionsV9(
  question: IntCp004LocalizedQuestion,
  locale: IntCp004LocalizedLocale,
): readonly IntCp004LocalizedOption[] {
  const texts = renderIntCp004ExamFriendlyOptionTextsV9(question, locale);
  return Object.freeze(question.options.map((option, index) => Object.freeze({
    ...option,
    text: texts[index]!,
    feedback: "",
  })));
}
