import type {
  TmwCp007GeneratedQuestion,
  TmwCp007Option,
  TmwCp007Solution,
} from "./cp007-types";
import type {
  TmwDisplayLocale,
  TmwLocalizationEditorialStatus,
  TmwLocalizedLanguage,
} from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import { cp007LocalizedAnswerText, parseTmwCp007AnswerKey } from "./localization-cp007-language";
import { renderTmwCp007LocalizedStem } from "./localization-cp007-stems";
import {
  finalizeTmwCp007Conclusion,
  finalizeTmwCp007Givens,
  finalizeTmwCp007Stem,
  finalizeTmwCp007Text,
} from "./localization-cp007-final-polish";
import {
  tmwCp007LocalizedConclusion,
  tmwCp007LocalizedGivens,
  tmwCp007LocalizedOpening,
  tmwCp007LocalizedShortcut,
  tmwCp007LocalizedTrapReason,
} from "./localization-cp007-learning";
import { remediateTmwCp007LocalizedEditorial } from "./cp007-editorial-review-remediation";
import { getTmwCp007Entry } from "./cp007-registry";

export interface TmwCp007LocalizedOption extends TmwCp007Option {}

export interface TmwCp007LocalizedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: "TMW-CP-007";
  questionLanguageId: string;
  solveMode: TmwCp007GeneratedQuestion["solveMode"];
  language: TmwLocalizedLanguage;
  locale: TmwDisplayLocale;
  sourceLanguage: "en";
  seed: string;
  stem: string;
  parameters: TmwCp007GeneratedQuestion["parameters"];
  solution: TmwCp007Solution;
  options: string[];
  optionAudit: TmwCp007LocalizedOption[];
  correctIndex: number;
  explanation: TmwCp007GeneratedQuestion["explanation"];
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  editorialStatus: TmwLocalizationEditorialStatus;
  publiclyPublishable: false;
}

function inlineMath(latex: string): string {
  return `\\(${latex}\\)`;
}

function inflectGovernedDuration(text: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return text
      .replace(/(\d+(?:\.\d+)?) दिन में/g, "$1 दिनों में")
      .replace(/(\d+(?:\.\d+)?) घंटे में/g, "$1 घंटों में")
      .replace(/(\d+(?:\.\d+)?) घंटा में/g, "$1 घंटे में");
  }
  return text
    .replace(/(\d+(?:\.\d+)?) ਦਿਨ ਵਿੱਚ/g, "$1 ਦਿਨਾਂ ਵਿੱਚ")
    .replace(/(\d+(?:\.\d+)?) ਘੰਟੇ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ")
    .replace(/(\d+(?:\.\d+)?) ਘੰਟਾ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ");
}

function naturalConclusionWithExactAnswer(
  text: string,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  if (!text.includes(answerText)) return text;
  const governed = `${answerText} ${language === "hi" ? "में" : "ਵਿੱਚ"}`;
  if (!text.includes(governed)) return inflectGovernedDuration(text, language);
  return text.replace(governed, `${answerText} ${language === "hi" ? "लगेंगे" : "ਲੱਗਣਗੇ"}`);
}

function naturalizeCountAnswerCopula(
  text: string,
  answerText: string,
  answerType: TmwCp007Solution["answerType"],
  language: TmwLocalizedLanguage,
): string {
  if (answerType !== "COUNT") return text;
  if (language === "hi") {
    return text.replace(`${answerText} है।`, `${answerText} चाहिए।`);
  }
  return text.replace(`${answerText} ਹੈ।`, `${answerText} ਚਾਹੀਦੇ ਹਨ।`);
}

export function localizeTmwCp007Question(
  source: TmwCp007GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwCp007LocalizedQuestion {
  const entry = getTmwCp007Entry(source.questionLanguageId);
  const polish = (text: string): string => finalizeTmwCp007Text(text, language);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: polish(cp007LocalizedAnswerText(source, parseTmwCp007AnswerKey(option.key), language)),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = polish(cp007LocalizedAnswerText(source, source.solution.answerValues, language));
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);

  const rawStem = finalizeTmwCp007Stem(source, renderTmwCp007LocalizedStem(source, language), language);
  const rawOpening = polish(tmwCp007LocalizedOpening(entry.ruleId, language));
  const rawGivens = finalizeTmwCp007Givens(source, tmwCp007LocalizedGivens(source, language), language);
  const rawShortcutValue = tmwCp007LocalizedShortcut(source, answerText, language);
  const rawShortcut = {
    title: polish(rawShortcutValue.title),
    steps: rawShortcutValue.steps.map(polish),
  };
  const rawTrapExplanation = polish(tmwCp007LocalizedTrapReason(trapId, language));
  const rawConclusion = finalizeTmwCp007Conclusion(
    source,
    answerText,
    tmwCp007LocalizedConclusion(source, answerText, language),
    language,
  );
  const rawWorkedSteps = source.solution.workedLatex.map((step) => localizeMathStep(inlineMath(step), language));
  const editorial = remediateTmwCp007LocalizedEditorial(
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
  const constrainedEditorial = source.solveMode === "findIntegerCrewCompositionUnderConstraints"
    ? {
        ...editorial,
        opening: `${editorial.opening} ${language === "hi" ? "क्योंकि ये सदस्यों की संख्याएँ हैं, इसलिए x और y धनात्मक पूर्णांक होने चाहिए।" : "ਕਿਉਂਕਿ ਇਹ ਮੈਂਬਰਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਹਨ, ਇਸ ਲਈ x ਅਤੇ y ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।"}`,
        shortcut: {
          ...editorial.shortcut,
          steps: [
            `${editorial.shortcut.steps[0]} ${language === "hi" ? "केवल धनात्मक पूर्णांक हल स्वीकार करें।" : "ਕੇਵਲ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹੱਲ ਹੀ ਮੰਨੋ।"}`,
            ...editorial.shortcut.steps.slice(1),
          ],
        },
      }
    : editorial;
  const finalEditorial = {
    ...constrainedEditorial,
    stem: inflectGovernedDuration(constrainedEditorial.stem, language),
    opening: inflectGovernedDuration(constrainedEditorial.opening, language),
    givens: constrainedEditorial.givens.map((text) => inflectGovernedDuration(text, language)),
    shortcut: {
      title: inflectGovernedDuration(constrainedEditorial.shortcut.title, language),
      steps: constrainedEditorial.shortcut.steps.map((text) => naturalizeCountAnswerCopula(
        inflectGovernedDuration(text, language),
        answerText,
        source.solution.answerType,
        language,
      )),
    },
    trapExplanation: inflectGovernedDuration(constrainedEditorial.trapExplanation, language),
    conclusion: naturalizeCountAnswerCopula(
      naturalConclusionWithExactAnswer(constrainedEditorial.conclusion, answerText, language),
      answerText,
      source.solution.answerType,
      language,
    ),
  };
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (options.length !== 4) errors.push("Localized question does not contain exactly four options");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (optionAudit[source.correctIndex]?.key !== source.solution.answerKey) errors.push("Localized correct option key differs from canonical answer key");
  if (!finalEditorial.stem.trim()) errors.push("Localized stem is empty");
  if (finalEditorial.givens.length < 2) errors.push("Localized givens are incomplete");
  if (finalEditorial.shortcut.steps.length < 2) errors.push("Localized shortcut is incomplete");

  const learnerText = [
    finalEditorial.stem,
    ...options,
    finalEditorial.opening,
    ...finalEditorial.givens,
    finalEditorial.shortcut.title,
    ...finalEditorial.shortcut.steps,
    finalEditorial.trapExplanation,
    finalEditorial.conclusion,
  ].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) errors.push("Punjabi delivery has no Gurmukhi text");
  if (/find[A-Z]|TMW_|Independent heterogeneous-crew invariant|Don't fall for|Do not/i.test(learnerText)) {
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
    stem: finalEditorial.stem,
    parameters: source.parameters,
    solution: { ...source.solution, answerText },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: finalEditorial.opening,
      formula: source.explanation.formula,
      givens: finalEditorial.givens,
      steps: finalEditorial.workedSteps,
      shortcut: finalEditorial.shortcut,
      commonTrap: {
        optionLabel: localizedOptionLabel(trapIndex, language),
        optionText: options[trapIndex] ?? options[0] ?? "",
        misconceptionId: trapId,
        explanation: finalEditorial.trapExplanation,
      },
      conclusion: finalEditorial.conclusion,
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
