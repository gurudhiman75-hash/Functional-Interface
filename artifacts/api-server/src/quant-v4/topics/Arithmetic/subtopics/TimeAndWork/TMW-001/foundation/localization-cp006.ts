import { getTmwCp006Entry } from "./cp006-registry";
import type { TmwCp006GeneratedQuestion } from "./cp006-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import { cp006LocalizedAnswerText } from "./localization-cp006-language";
import { renderTmwCp006LocalizedStem } from "./localization-cp006-stems";
import {
  polishTmwCp006ManualConclusion,
  polishTmwCp006ManualGivens,
  polishTmwCp006ManualOpening,
  polishTmwCp006ManualText,
  polishTmwCp006ManualTrap,
} from "./localization-cp006-manual-polish";
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
  const polish = (text: string): string => polishTmwCp006ManualText(text, language);
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
  const opening = polishTmwCp006ManualOpening(
    source,
    tmwCp006LocalizedOpening(entry.ruleId, language),
    language,
  );
  const givens = polishTmwCp006ManualGivens(
    source,
    tmwCp006LocalizedGivens(source, language),
    language,
  );
  const rawShortcut = tmwCp006LocalizedShortcut(source, answerText, language);
  const shortcut = {
    title: polish(rawShortcut.title),
    steps: rawShortcut.steps.map(polish),
  };
  const trapExplanation = polishTmwCp006ManualTrap(
    source,
    tmwCp006LocalizedTrapReason(trapId, language),
    language,
  );
  const conclusion = polishTmwCp006ManualConclusion(
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

  return {
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
  };
}
