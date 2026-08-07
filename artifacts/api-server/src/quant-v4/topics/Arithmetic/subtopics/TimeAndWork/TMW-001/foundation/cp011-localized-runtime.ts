import { runTmwCp011Pipeline } from "./cp011-runtime";
import {
  localizeTmwCp011Question,
  type TmwCp011LocalizedQuestion,
} from "./localization-cp011";
import { remediateTmwCp011LocalizedQuestion } from "./cp011-editorial-review-remediation";
import type { TmwLocalizedLanguage } from "./localization-types";

function learnerText(question: TmwCp011LocalizedQuestion): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.opening,
    question.explanation.formula,
    ...question.explanation.givens,
    ...question.explanation.steps,
    question.explanation.shortcut.title,
    ...question.explanation.shortcut.steps,
    question.explanation.commonTrap.explanation,
    question.explanation.conclusion,
  ].join("\n");
}

function removePunjabiDandaFalsePositive(
  question: TmwCp011LocalizedQuestion,
): TmwCp011LocalizedQuestion {
  if (question.language !== "pa") return question;
  if (!question.validation.errors.includes("Punjabi delivery contains Devanagari text")) return question;

  const outsideMath = learnerText(question).replace(/\\\([\s\S]*?\\\)/g, "");
  const hasActualDevanagari = /[\u0900-\u0963\u0966-\u097F]/.test(outsideMath);
  if (hasActualDevanagari) return question;

  const errors = question.validation.errors.filter(
    (error) => error !== "Punjabi delivery contains Devanagari text",
  );
  return {
    ...question,
    validation: {
      valid: errors.length === 0,
      errors,
    },
  };
}

export function runTmwCp011LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp011LocalizedQuestion {
  const source = runTmwCp011Pipeline(input.questionLanguageId, input.seed);
  const localized = localizeTmwCp011Question(source, input.language);
  const remediated = remediateTmwCp011LocalizedQuestion(source, localized);
  return removePunjabiDandaFalsePositive(remediated);
}
