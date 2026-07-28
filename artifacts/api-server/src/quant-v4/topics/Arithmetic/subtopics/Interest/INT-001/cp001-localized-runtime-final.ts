import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  assertIntCp001LocaleParity,
  generateIntCp001LocalizedQuestion as generateRawLocalizedQuestion,
  type IntCp001LocalizedQuestion,
} from "./cp001-localized-runtime";
import type { IntCp001Locale } from "./cp001-multilingual-release";

const DEVANAGARI_LETTER_OR_MARK = /[\u0901-\u0939\u093A-\u094D\u0950-\u0963\u0971-\u097F]/u;
const MATH_SEGMENT = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/gu;

function learnerText(item: IntCp001LocalizedQuestion): string {
  return [
    item.stem,
    ...item.options,
    item.explanation.coreConcept.heading,
    item.explanation.coreConcept.narrative,
    item.explanation.coreConcept.displayMath,
    item.explanation.stepByStep.heading,
    ...item.explanation.stepByStep.steps,
    item.explanation.stepByStep.verification,
    item.explanation.stepByStep.conclusion,
    item.explanation.examShortcut.heading,
    item.explanation.examShortcut.narrative,
    item.explanation.examShortcut.displayMath,
    item.explanation.trapAnalysis.heading,
    ...item.explanation.trapAnalysis.items.flatMap((trap) => [trap.optionText, trap.explanation]),
  ].join(" ");
}

function containsDevanagariLanguageText(value: string): boolean {
  return DEVANAGARI_LETTER_OR_MARK.test(value.replace(MATH_SEGMENT, " "));
}

export function generateIntCp001FinalLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001LocalizedQuestion {
  const item = generateRawLocalizedQuestion(qlId, seed, locale);
  const text = learnerText(item);
  const errors = item.validation.errors.filter((error) => {
    if (locale !== "pa") return true;
    if (error !== "Punjabi learner text contains Devanagari script.") return true;
    return containsDevanagariLanguageText(text);
  });

  if (locale === "pa" && containsDevanagariLanguageText(text)) {
    if (!errors.includes("Punjabi learner text contains Devanagari language text.")) {
      errors.push("Punjabi learner text contains Devanagari language text.");
    }
  }

  return {
    ...item,
    validation: {
      ...item.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}

export { assertIntCp001LocaleParity };
export type { IntCp001LocalizedQuestion };
