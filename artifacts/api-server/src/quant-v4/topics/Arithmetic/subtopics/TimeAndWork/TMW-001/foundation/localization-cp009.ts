import type {
  TmwCp009GeneratedQuestion,
  TmwCp009Option,
  TmwCp009Solution,
} from "./cp009-types";
import type {
  TmwDisplayLocale,
  TmwLocalizationEditorialStatus,
  TmwLocalizedLanguage,
} from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import {
  cp009LocalizedAnswerText,
  cp009LocalizedOptionText,
} from "./localization-cp009-language";
import { renderTmwCp009LocalizedStem } from "./localization-cp009-stems";
import {
  tmwCp009LocalizedConclusion,
  tmwCp009LocalizedGivens,
  tmwCp009LocalizedOpening,
  tmwCp009LocalizedShortcut,
  tmwCp009LocalizedTrapReason,
} from "./localization-cp009-learning";
import { polishTmwCp009Text } from "./localization-cp009-polish";
import { getTmwCp009Entry } from "./cp009-registry";

export interface TmwCp009LocalizedOption extends TmwCp009Option {}

export interface TmwCp009LocalizedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: "TMW-CP-009";
  questionLanguageId: string;
  solveMode: TmwCp009GeneratedQuestion["solveMode"];
  language: TmwLocalizedLanguage;
  locale: TmwDisplayLocale;
  sourceLanguage: "en";
  seed: string;
  stem: string;
  parameters: TmwCp009GeneratedQuestion["parameters"];
  solution: TmwCp009Solution;
  options: string[];
  optionAudit: TmwCp009LocalizedOption[];
  correctIndex: number;
  explanation: TmwCp009GeneratedQuestion["explanation"];
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  editorialStatus: TmwLocalizationEditorialStatus;
  publiclyPublishable: false;
}

export function localizeTmwCp009Question(
  source: TmwCp009GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwCp009LocalizedQuestion {
  const entry = getTmwCp009Entry(source.questionLanguageId);
  const polish = (text: string): string => polishTmwCp009Text(text, language);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: polish(cp009LocalizedOptionText(source, option, language)),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = polish(cp009LocalizedAnswerText(source, source.solution.answerValues, language));
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);

  const stem = polish(renderTmwCp009LocalizedStem(source, language));
  const opening = polish(tmwCp009LocalizedOpening(entry.ruleId, language));
  const formula = polish(source.explanation.formula);
  const givens = tmwCp009LocalizedGivens(source, language).map(polish);
  const steps = source.explanation.steps.map((step) => polish(localizeMathStep(step, language)));
  const rawShortcut = tmwCp009LocalizedShortcut(source, answerText, language);
  const shortcut = { title: polish(rawShortcut.title), steps: rawShortcut.steps.map(polish) };
  const trapExplanation = polish(tmwCp009LocalizedTrapReason(trapId, language));
  const conclusion = polish(tmwCp009LocalizedConclusion(source, answerText, language));
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (options.length !== 4) errors.push("Localized question does not contain exactly four options");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (optionAudit[source.correctIndex]?.key !== source.solution.answerKey) {
    errors.push("Localized correct option key differs from canonical answer key");
  }
  if (!stem.trim()) errors.push("Localized stem is empty");
  if (givens.length < 2) errors.push("Localized givens are incomplete");
  if (steps.length < 2) errors.push("Localized worked steps are incomplete");
  if (shortcut.steps.length < 2) errors.push("Localized shortcut is incomplete");

  const learnerText = [
    stem,
    ...options,
    opening,
    formula,
    ...givens,
    ...steps,
    shortcut.title,
    ...shortcut.steps,
    trapExplanation,
    conclusion,
  ].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) errors.push("Punjabi delivery has no Gurmukhi text");
  if (/find[A-Z]|TMW_|Independent signed-flow invariant|Don't fall for|Do not choose/i.test(learnerText)) {
    errors.push("Localized learner text contains internal or English diagnostic wording");
  }

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
      formula,
      givens,
      steps,
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
