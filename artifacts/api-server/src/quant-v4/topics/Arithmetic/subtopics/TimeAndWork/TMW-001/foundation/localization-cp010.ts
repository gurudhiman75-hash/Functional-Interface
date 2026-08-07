import type {
  TmwCp010GeneratedQuestion,
  TmwCp010Option,
  TmwCp010Solution,
} from "./cp010-types";
import type {
  TmwDisplayLocale,
  TmwLocalizationEditorialStatus,
  TmwLocalizedLanguage,
} from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel, localizeMathStep } from "./localization-glossary";
import { getTmwCp010Entry } from "./cp010-registry";
import {
  cp010AnswerText,
  cp010OptionText,
} from "./localization-cp010-language";
import { renderTmwCp010LocalizedStem } from "./localization-cp010-stems";
import {
  tmwCp010LocalizedConclusion,
  tmwCp010LocalizedGivens,
  tmwCp010LocalizedOpening,
  tmwCp010LocalizedShortcut,
  tmwCp010LocalizedTrapReason,
} from "./localization-cp010-learning";
import { polishTmwCp010Text } from "./localization-cp010-polish";
import { remediateTmwCp010LocalizedEditorial } from "./cp010-editorial-review-remediation";

export interface TmwCp010LocalizedOption extends TmwCp010Option {}

export interface TmwCp010LocalizedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: "TMW-CP-010";
  questionLanguageId: string;
  solveMode: TmwCp010GeneratedQuestion["solveMode"];
  language: TmwLocalizedLanguage;
  locale: TmwDisplayLocale;
  sourceLanguage: "en";
  seed: string;
  stem: string;
  parameters: TmwCp010GeneratedQuestion["parameters"];
  solution: TmwCp010Solution;
  options: string[];
  optionAudit: TmwCp010LocalizedOption[];
  correctIndex: number;
  explanation: TmwCp010GeneratedQuestion["explanation"];
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  editorialStatus: TmwLocalizationEditorialStatus;
  publiclyPublishable: false;
}

function localizeDynamicScheduleLabels(text: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return text
      .replace(/Fast inlet\s+पाली/gi, "तेज़ भराव वाली पाली")
      .replace(/Slow inlet\s+पाली/gi, "धीमे भराव वाली पाली")
      .replace(/Fast outlet\s+पाली/gi, "तेज़ निकासी वाली पाली")
      .replace(/Slow outlet\s+पाली/gi, "धीमी निकासी वाली पाली")
      .replace(/Fast inlet/gi, "तेज़ भराव")
      .replace(/Slow inlet/gi, "धीमा भराव")
      .replace(/Fast outlet/gi, "तेज़ निकासी")
      .replace(/Slow outlet/gi, "धीमी निकासी")
      .replace(/कार्यक्रम/g, "समय-सारणी")
      .replace(/चिह्न सहित/g, "भराव और निकासी जोड़कर")
      .replace(/अंतिम सक्रिय खंड/g, "लक्ष्य पूरा करने वाला अंतिम हिस्सा")
      .replace(/टर्मिनल खंड/g, "अंतिम हिस्सा")
      .replace(/(भरने वाली पाइप [A-Z] और भरने वाली पाइप [A-Z]) एक साथ चलते हैं/g, "$1 एक साथ काम करती हैं")
      .replace(/पाइपें एक साथ चलते हैं/g, "पाइपें एक साथ काम करती हैं")
      .replace(/पाइपें चलती है(?:ं+)*/g, "पाइपें काम करती हैं");
  }
  return text
    .replace(/Fast inlet\s+(?:ਪਾਰੀ|ਵਾਰੀ)/gi, "ਤੇਜ਼ ਭਰਾਵ ਵਾਲੀ ਵਾਰੀ")
    .replace(/Slow inlet\s+(?:ਪਾਰੀ|ਵਾਰੀ)/gi, "ਹੌਲੇ ਭਰਾਵ ਵਾਲੀ ਵਾਰੀ")
    .replace(/Fast outlet\s+(?:ਪਾਰੀ|ਵਾਰੀ)/gi, "ਤੇਜ਼ ਨਿਕਾਸੀ ਵਾਲੀ ਵਾਰੀ")
    .replace(/Slow outlet\s+(?:ਪਾਰੀ|ਵਾਰੀ)/gi, "ਹੌਲੀ ਨਿਕਾਸੀ ਵਾਲੀ ਵਾਰੀ")
    .replace(/Fast inlet/gi, "ਤੇਜ਼ ਭਰਾਵ")
    .replace(/Slow inlet/gi, "ਹੌਲਾ ਭਰਾਵ")
    .replace(/Fast outlet/gi, "ਤੇਜ਼ ਨਿਕਾਸੀ")
    .replace(/Slow outlet/gi, "ਹੌਲੀ ਨਿਕਾਸੀ")
    .replace(/ਕਾਰਜਕ੍ਰਮ/g, "ਸਮਾਂ-ਸਾਰਣੀ")
    .replace(/ਚਿੰਨ੍ਹ ਸਮੇਤ/g, "ਭਰਨ ਅਤੇ ਨਿਕਾਸੀ ਜੋੜ ਕੇ")
    .replace(/ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ/g, "ਟੀਚਾ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਅੰਤਿਮ ਹਿੱਸਾ")
    .replace(/ਟਰਮੀਨਲ ਖੰਡ/g, "ਅੰਤਿਮ ਹਿੱਸਾ")
    .replace(/ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ/g, "ਪਾਈਪਾਂ ਇਕੱਠੀਆਂ ਕੰਮ ਕਰਦੀਆਂ ਹਨ")
    .replace(/ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/g, "ਪਾਈਪਾਂ ਕੰਮ ਕਰਦੀਆਂ ਹਨ");
}

export function localizeTmwCp010Question(
  source: TmwCp010GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwCp010LocalizedQuestion {
  const entry = getTmwCp010Entry(source.questionLanguageId);
  const polish = (text: string): string => polishTmwCp010Text(text, language);
  const polishProse = (text: string): string => localizeDynamicScheduleLabels(polish(text), language);
  const answerText = polishProse(cp010AnswerText(
    source,
    source.solution.answerValues,
    language,
    source.solution.terminalSegmentIndex,
  ));
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: polishProse(
      option.key === source.solution.answerKey
        ? answerText
        : cp010OptionText(source, option.key, language),
    ),
  }));
  const options = optionAudit.map((option) => option.text);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);

  const rawStem = polishProse(renderTmwCp010LocalizedStem(source, language));
  const rawOpening = polishProse(tmwCp010LocalizedOpening(entry.ruleId, language));
  const formula = polish(source.explanation.formula);
  const rawGivens = tmwCp010LocalizedGivens(source, language).map(polishProse);
  const rawSteps = source.explanation.steps.map((step) => polishProse(localizeMathStep(step, language)));
  const rawShortcutSource = tmwCp010LocalizedShortcut(source, answerText, language);
  const rawShortcut = {
    title: polishProse(rawShortcutSource.title),
    steps: rawShortcutSource.steps.map(polishProse),
  };
  const rawTrapExplanation = polishProse(tmwCp010LocalizedTrapReason(trapId, language));
  const rawConclusion = polishProse(tmwCp010LocalizedConclusion(source, answerText, language));
  const editorial = remediateTmwCp010LocalizedEditorial(
    source,
    {
      stem: rawStem,
      opening: rawOpening,
      givens: rawGivens,
      workedSteps: rawSteps,
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
  if (options[source.correctIndex] !== answerText) {
    errors.push("Localized correct option text differs from localized answer text");
  }
  if (!editorial.stem.trim()) errors.push("Localized stem is empty");
  if (editorial.givens.length < 2) errors.push("Localized givens are incomplete");
  if (editorial.workedSteps.length < 3) errors.push("Localized worked steps are incomplete");
  if (editorial.shortcut.steps.length < 2) errors.push("Localized shortcut is incomplete");

  const learnerText = [
    editorial.stem,
    ...options,
    editorial.opening,
    formula,
    ...editorial.givens,
    ...editorial.workedSteps,
    editorial.shortcut.title,
    ...editorial.shortcut.steps,
    editorial.trapExplanation,
    editorial.conclusion,
  ].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(learnerText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(learnerText)) errors.push("Punjabi delivery has no Gurmukhi text");
  if (/find[A-Z]|TMW_|Independent staged|Do not choose|Don't fall for/i.test(learnerText)) {
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
    stem: editorial.stem,
    parameters: source.parameters,
    solution: { ...source.solution, answerText },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: editorial.opening,
      formula,
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
