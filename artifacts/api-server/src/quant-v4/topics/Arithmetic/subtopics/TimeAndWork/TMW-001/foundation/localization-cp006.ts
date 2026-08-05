import { getTmwCp006Entry } from "./cp006-registry";
import type { TmwCp006GeneratedQuestion } from "./cp006-types";
import { cleanupTmwCp006EditorialFields } from "./cp006-editorial-field-cleanup";
import { remediateTmwCp006LocalizedQuestion } from "./cp006-editorial-review-remediation";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import { cp006LocalizedAnswerText } from "./localization-cp006-language";
import { renderTmwCp006LocalizedStem } from "./localization-cp006-stems";
import {
  finalizeTmwCp006Conclusion,
  finalizeTmwCp006Givens,
  finalizeTmwCp006Opening,
  finalizeTmwCp006Text,
  finalizeTmwCp006Trap,
} from "./localization-cp006-final-polish";
import {
  tmwCp006LocalizedConclusion,
  tmwCp006LocalizedGivens,
  tmwCp006LocalizedOpening,
  tmwCp006LocalizedShortcut,
  tmwCp006LocalizedTrapReason,
} from "./localization-cp006-learning";

function inlineMath(latex: string): string {
  return `\\(${latex}\\)`;
}

export function localizeTmwCp006Question(
  source: TmwCp006GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const entry = getTmwCp006Entry(source.questionLanguageId);
  const polish = (text: string): string => finalizeTmwCp006Text(text, language);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: polish(cp006LocalizedAnswerText(source, option.value, language)),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = polish(cp006LocalizedAnswerText(source, source.solution.answer, language));
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);

  const stem = polish(renderTmwCp006LocalizedStem(source, language));
  const opening = finalizeTmwCp006Opening(
    source,
    tmwCp006LocalizedOpening(entry.ruleId, language),
    language,
  );
  const givens = finalizeTmwCp006Givens(
    source,
    tmwCp006LocalizedGivens(source, language),
    language,
  );
  const rawShortcut = tmwCp006LocalizedShortcut(source, answerText, language);
  const shortcut = {
    title: polish(rawShortcut.title),
    steps: rawShortcut.steps.map(polish),
  };
  const trapExplanation = finalizeTmwCp006Trap(
    source,
    tmwCp006LocalizedTrapReason(trapId, language),
    language,
  );
  const conclusion = finalizeTmwCp006Conclusion(
    source,
    answerText,
    tmwCp006LocalizedConclusion(source, answerText, language),
    language,
  );
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (!stem.trim()) errors.push("Localized stem is empty");
  const learnerText = [stem, opening, ...givens, shortcut.title, ...shortcut.steps, trapExplanation, conclusion].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) errors.push("Punjabi delivery has no Gurmukhi text");

  const localized = remediateTmwCp006LocalizedQuestion(source, {
    archetypeId: source.archetypeId,
    canonicalProblemId: source.canonicalProblemId,
    questionLanguageId: source.questionLanguageId,
    solveMode: source.solveMode,
    language,
    locale: displayLocale(language),
    sourceLanguage: "en",
    seed: source.seed,
    stem,
    parameters: source.parameters,
    solution: { ...source.solution, answerText },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening,
      formula: source.explanation.formula,
      givens,
      steps: source.solution.workedLatex.map((step) => localizeMathStep(inlineMath(step), language)),
      shortcut,
      commonTrap: {
        optionLabel: localizedOptionLabel(trapIndex, language),
        optionText: options[trapIndex] ?? options[0] ?? "",
        misconceptionId: trapId,
        explanation: trapExplanation,
      },
      conclusion,
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  }, language);

  return cleanupTmwCp006EditorialFields(localized, language);
}
