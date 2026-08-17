import type {
  TmwCp008GeneratedQuestion,
  TmwCp008Option,
  TmwCp008Solution,
} from "./cp008-types";
import type {
  TmwDisplayLocale,
  TmwLocalizationEditorialStatus,
  TmwLocalizedLanguage,
} from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import {
  cp008LocalizedAnswerText,
  parseTmwCp008AnswerKey,
} from "./localization-cp008-language";
import { renderTmwCp008LocalizedStem } from "./localization-cp008-stems";
import {
  tmwCp008LocalizedConclusion,
  tmwCp008LocalizedGivens,
  tmwCp008LocalizedOpening,
  tmwCp008LocalizedShortcut,
  tmwCp008LocalizedTrapReason,
} from "./localization-cp008-learning";
import {
  finalizeTmwCp008Conclusion,
  finalizeTmwCp008Givens,
  finalizeTmwCp008Shortcut,
  finalizeTmwCp008Stem,
  finalizeTmwCp008Trap,
  polishTmwCp008Text,
} from "./localization-cp008-polish";
import {
  finalizeTmwCp008FinalConclusion,
  finalizeTmwCp008FinalGivens,
  finalizeTmwCp008FinalShortcut,
  finalizeTmwCp008FinalStem,
  finalizeTmwCp008FinalText,
  finalizeTmwCp008FinalTrap,
} from "./localization-cp008-final-polish";
import { remediateTmwCp008LocalizedEditorial } from "./cp008-editorial-review-remediation";
import { getTmwCp008Entry } from "./cp008-registry";

export interface TmwCp008LocalizedOption extends TmwCp008Option {}

export interface TmwCp008LocalizedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: "TMW-CP-008";
  questionLanguageId: string;
  solveMode: TmwCp008GeneratedQuestion["solveMode"];
  language: TmwLocalizedLanguage;
  locale: TmwDisplayLocale;
  sourceLanguage: "en";
  seed: string;
  stem: string;
  parameters: TmwCp008GeneratedQuestion["parameters"];
  solution: TmwCp008Solution;
  options: string[];
  optionAudit: TmwCp008LocalizedOption[];
  correctIndex: number;
  explanation: TmwCp008GeneratedQuestion["explanation"];
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  editorialStatus: TmwLocalizationEditorialStatus;
  publiclyPublishable: false;
}

export function localizeTmwCp008Question(
  source: TmwCp008GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwCp008LocalizedQuestion {
  const entry = getTmwCp008Entry(source.questionLanguageId);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: finalizeTmwCp008FinalText(
      polishTmwCp008Text(
        cp008LocalizedAnswerText(source, parseTmwCp008AnswerKey(option.key), language),
        language,
      ),
      language,
    ),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = finalizeTmwCp008FinalText(
    polishTmwCp008Text(
      cp008LocalizedAnswerText(source, source.solution.answerValues, language),
      language,
    ),
    language,
  );
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) {
    trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);
  }

  const rawStem = finalizeTmwCp008FinalStem(
    source,
    finalizeTmwCp008Stem(
      source,
      renderTmwCp008LocalizedStem(source, language),
      language,
    ),
    language,
  );
  const rawOpening = finalizeTmwCp008FinalText(
    polishTmwCp008Text(tmwCp008LocalizedOpening(entry.ruleId, language), language),
    language,
  );
  const rawGivens = finalizeTmwCp008FinalGivens(
    finalizeTmwCp008Givens(
      source,
      tmwCp008LocalizedGivens(source, language),
      language,
    ),
    language,
  );
  const rawShortcut = finalizeTmwCp008FinalShortcut(
    source,
    finalizeTmwCp008Shortcut(
      source,
      tmwCp008LocalizedShortcut(source, answerText, language),
      answerText,
      language,
    ),
    answerText,
    language,
  );
  const rawTrapExplanation = finalizeTmwCp008FinalTrap(
    finalizeTmwCp008Trap(
      source,
      tmwCp008LocalizedTrapReason(trapId, language),
      language,
    ),
    language,
  );
  const rawConclusion = finalizeTmwCp008FinalConclusion(
    finalizeTmwCp008Conclusion(
      source,
      answerText,
      tmwCp008LocalizedConclusion(source, answerText, language),
      language,
    ),
    language,
  );
  const rawWorkedSteps = source.explanation.steps.map((step) => finalizeTmwCp008FinalText(
    polishTmwCp008Text(localizeMathStep(step, language), language),
    language,
  ));
  const editorial = remediateTmwCp008LocalizedEditorial(
    source,
    {
      stem: rawStem,
      opening: rawOpening,
      givens: rawGivens,
      workedSteps: rawWorkedSteps,
      shortcut: rawShortcut,
      trapExplanation: rawTrapExplanation,
      conclusion: rawConclusion,
    },
    answerText,
    language,
  );
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (options.length !== 4) errors.push("Localized question does not contain exactly four options");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (optionAudit[source.correctIndex]?.key !== source.solution.answerKey) {
    errors.push("Localized correct option key differs from canonical answer key");
  }
  if (!editorial.stem.trim()) errors.push("Localized stem is empty");
  if (editorial.givens.length < 2) errors.push("Localized givens are incomplete");
  if (editorial.shortcut.steps.length < 2) errors.push("Localized shortcut is incomplete");

  const learnerText = [
    editorial.stem,
    ...options,
    editorial.opening,
    ...editorial.givens,
    editorial.shortcut.title,
    ...editorial.shortcut.steps,
    editorial.trapExplanation,
    editorial.conclusion,
  ].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) {
    errors.push("Hindi delivery has no Devanagari text");
  }
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) {
    errors.push("Punjabi delivery has no Gurmukhi text");
  }
  if (/find[A-Z]|TMW_|Independent contribution invariant|Don't fall for|Do not choose/i.test(learnerText)) {
    errors.push("Localized learner text contains internal or English diagnostic wording");
  }
  if (["MONEY", "MONEY_TRIPLE"].includes(source.solution.answerType) && options.some((option) => option.split(", ").some((part) => !part.startsWith("₹")))) {
    errors.push("Localized money option lacks the rupee unit");
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
    stem: editorial.stem,
    parameters: source.parameters,
    solution: { ...source.solution, answerText },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: editorial.opening,
      formula: source.explanation.formula,
      givens: editorial.givens,
      steps: editorial.workedSteps,
      shortcut: editorial.shortcut,
      commonTrap: {
        optionLabel: localizedOptionLabel(trapIndex, language),
        optionText: options[trapIndex] ?? options[0] ?? "",
        misconceptionId: trapId,
        explanation: editorial.trapExplanation,
      },
      conclusion: editorial.conclusion,
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
