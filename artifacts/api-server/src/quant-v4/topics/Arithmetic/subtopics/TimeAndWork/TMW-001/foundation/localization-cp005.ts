import { getTmwCp005Entry } from "./cp005-registry";
import type { TmwCp005GeneratedQuestion } from "./cp005-types";
import {
  displayLocale,
  type TmwLocalizedLanguage,
  type TmwLocalizedQuestion,
  type TmwLocalizedValue,
} from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import { cp005LocalizedAnswerText } from "./localization-cp005-language";
import { renderTmwCp005LocalizedStem } from "./localization-cp005-stems";
import {
  tmwCp005LocalizedConclusion,
  tmwCp005LocalizedOpening,
  tmwCp005LocalizedShortcut,
  tmwCp005LocalizedTrapReason,
} from "./localization-cp005-learning";

function inflectTimePostpositions(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/(\d+) दिन में/g, (_, raw: string) => raw === "1" ? "एक दिन में" : `${raw} दिनों में`)
      .replace(/(\d+) घंटा में/g, (_, raw: string) => raw === "1" ? "एक घंटे में" : `${raw} घंटों में`);
  }
  return value
    .replace(/(\d+) ਦਿਨ ਵਿੱਚ/g, (_, raw: string) => raw === "1" ? "ਇੱਕ ਦਿਨ ਵਿੱਚ" : `${raw} ਦਿਨਾਂ ਵਿੱਚ`)
    .replace(/(\d+) ਘੰਟਾ ਵਿੱਚ/g, (_, raw: string) => raw === "1" ? "ਇੱਕ ਘੰਟੇ ਵਿੱਚ" : `${raw} ਘੰਟਿਆਂ ਵਿੱਚ`);
}

function polishTimeConclusion(
  source: TmwCp005GeneratedQuestion,
  conclusion: string,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solution.answerType !== "TIME") return conclusion;
  const uninflectedPostposition = language === "hi"
    ? `${answerText} में`
    : `${answerText} ਵਿੱਚ`;
  if (!conclusion.includes(uninflectedPostposition)) return conclusion;
  return language === "hi"
    ? `अतः काम पूरा होने का कुल समय ${answerText} है।`
    : `ਇਸ ਲਈ ਕੰਮ ਪੂਰਾ ਹੋਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ${answerText} ਹੈ।`;
}

export function localizeTmwCp005Question(
  source: TmwCp005GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion<TmwLocalizedValue> {
  const entry = getTmwCp005Entry(source.questionLanguageId);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: cp005LocalizedAnswerText(source, option.value, language),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = cp005LocalizedAnswerText(source, source.solution.answer, language);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);

  const stem = inflectTimePostpositions(renderTmwCp005LocalizedStem(source, language), language);
  const opening = inflectTimePostpositions(tmwCp005LocalizedOpening(entry.ruleId, language), language);
  const trapExplanation = inflectTimePostpositions(tmwCp005LocalizedTrapReason(trapId, language), language);
  const rawShortcut = tmwCp005LocalizedShortcut(source.solveMode, answerText, language);
  const shortcut = {
    title: inflectTimePostpositions(rawShortcut.title, language),
    steps: rawShortcut.steps.map((step) => inflectTimePostpositions(step, language)),
  };
  const conclusion = inflectTimePostpositions(
    polishTimeConclusion(
      source,
      tmwCp005LocalizedConclusion(source, answerText, language),
      answerText,
      language,
    ),
    language,
  );
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (!stem.trim()) errors.push("Localized stem is empty");
  const learnerText = [stem, opening, ...shortcut.steps, trapExplanation, conclusion].join(" ");
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
      steps: source.explanation.steps.map((step) => localizeMathStep(step, language)),
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
