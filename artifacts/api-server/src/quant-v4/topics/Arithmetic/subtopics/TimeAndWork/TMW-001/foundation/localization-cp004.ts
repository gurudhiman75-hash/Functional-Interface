import { getTmwCp004Entry } from "./cp004-registry";
import type { TmwCp004GeneratedQuestion } from "./cp004-types";
import { displayLocale, type TmwLocalizedLanguage, type TmwLocalizedQuestion } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import { cp004LocalizedAnswerText } from "./localization-cp004-language";
import { renderTmwCp004LocalizedStem } from "./localization-cp004-stems";
import {
  tmwCp004LocalizedConclusion,
  tmwCp004LocalizedOpening,
  tmwCp004LocalizedShortcut,
  tmwCp004LocalizedTrapReason,
} from "./localization-cp004-learning";
import { polishTmwCp004LocalizedQuestion } from "./localization-cp004-polish";
import { finalizeTmwCp004LocalizedQuestion } from "./localization-cp004-final-cleanup";
import { inflectTmwCp004LocalizedQuestion } from "./localization-cp004-inflection";
import { applyTmwCp004EditorialReviewRemediation } from "./cp004-editorial-review-remediation";
import { cleanTmwCp004EditorialResiduals } from "./cp004-editorial-residual-cleanup";

export function localizeTmwCp004Question(
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const entry = getTmwCp004Entry(source.questionLanguageId);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: cp004LocalizedAnswerText(source, option.value, language),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = cp004LocalizedAnswerText(source, source.solution.answer, language);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) {
    trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);
  }

  const stem = renderTmwCp004LocalizedStem(source, language);
  const opening = tmwCp004LocalizedOpening(entry.ruleId, language);
  const trapExplanation = tmwCp004LocalizedTrapReason(trapId, language);
  const conclusion = tmwCp004LocalizedConclusion(source, answerText, language);
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (!stem.trim()) errors.push("Localized stem is empty");
  const learnerText = [stem, opening, trapExplanation, conclusion].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) errors.push("Punjabi delivery has no Gurmukhi text");

  const localized: TmwLocalizedQuestion = {
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
      steps: source.explanation.steps.map((step) => localizeMathStep(step, language)),
      shortcut: tmwCp004LocalizedShortcut(source.solveMode, answerText, language),
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

  const polished = polishTmwCp004LocalizedQuestion(localized, source, language);
  const finalized = finalizeTmwCp004LocalizedQuestion(polished, source, language);
  const inflected = inflectTmwCp004LocalizedQuestion(finalized, source, language);
  const remediated = applyTmwCp004EditorialReviewRemediation(inflected, source, language);
  return cleanTmwCp004EditorialResiduals(remediated, language);
}
