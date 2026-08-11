import {
  buildIntCp001FourTierExplanation,
  type IntCp001FourTierExplanation,
  type LegacyExplanationLike,
} from "./cp001-editorial-v2";
import { INT_CP001_EDITORIAL_RELEASE_ID } from "./cp001-editorial-release";
import { getIntCp001FinalRegistryEntry, type IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001FinalQuestion as generateIntCp001FinalCoreQuestion,
  type IntCp001FinalGeneratedQuestion,
} from "./cp001-final-runtime";

export type IntCp001FinalEditorialQuestion = Omit<
  IntCp001FinalGeneratedQuestion,
  "stem" | "options" | "optionAudit" | "explanation" | "validation" | "releaseId"
> & {
  releaseId: typeof INT_CP001_EDITORIAL_RELEASE_ID;
  stem: string;
  options: string[];
  optionAudit: IntCp001FinalGeneratedQuestion["optionAudit"];
  explanation: IntCp001FourTierExplanation;
  validation: IntCp001FinalGeneratedQuestion["validation"];
};

const CURRENCY_COMMA_TOKEN = "⟦CURRENCY_COMMA⟧";

function formatIndianInteger(raw: string): string {
  const negative = raw.startsWith("-");
  const digits = raw.replace(/[-,]/gu, "").replace(/^0+(?=\d)/u, "");
  if (digits.length <= 3) return `${negative ? "-" : ""}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/gu, ",");
  return `${negative ? "-" : ""}${leading},${lastThree}`;
}

function protectCurrencyPunctuation(text: string): string {
  return text.replace(/(₹\s*-?\d+),(?=\s)/gu, `$1${CURRENCY_COMMA_TOKEN}`);
}

function protectLegacyExplanation(explanation: LegacyExplanationLike): LegacyExplanationLike {
  return {
    notice: protectCurrencyPunctuation(explanation.notice),
    relation: protectCurrencyPunctuation(explanation.relation),
    steps: explanation.steps.map(protectCurrencyPunctuation),
    verification: protectCurrencyPunctuation(explanation.verification),
    conclusion: protectCurrencyPunctuation(explanation.conclusion),
    commonTrap: protectCurrencyPunctuation(explanation.commonTrap),
  };
}

function normaliseCurrency(text: string): string {
  const restored = text.replaceAll(CURRENCY_COMMA_TOKEN, ",");
  return restored.replace(
    /₹\s*(-?\d+)(?=(?:\.\d+)?(?:\D|$))/gu,
    (_match, raw: string) => `₹${formatIndianInteger(raw)}`,
  );
}

function normaliseExplanationCurrency(explanation: IntCp001FourTierExplanation): IntCp001FourTierExplanation {
  const coreDisplayMath = normaliseCurrency(explanation.coreConcept.displayMath);
  const shortcutNarrative = normaliseCurrency(explanation.examShortcut.narrative)
    .replace(
      /^Find the total interest percentage of principal first,/u,
      "Calculate the total interest percentage of principal,",
    )
    .replace(/^Find /u, "Calculate ");
  const shortcutDisplayMath = explanation.examShortcut.displayMath
    ? normaliseCurrency(explanation.examShortcut.displayMath)
    : coreDisplayMath;

  return {
    ...explanation,
    notice: normaliseCurrency(explanation.notice),
    relation: normaliseCurrency(explanation.relation),
    steps: explanation.steps.map(normaliseCurrency),
    verification: normaliseCurrency(explanation.verification),
    conclusion: normaliseCurrency(explanation.conclusion),
    commonTrap: normaliseCurrency(explanation.commonTrap),
    coreConcept: {
      ...explanation.coreConcept,
      narrative: normaliseCurrency(explanation.coreConcept.narrative),
      displayMath: coreDisplayMath,
    },
    stepByStep: {
      ...explanation.stepByStep,
      steps: explanation.stepByStep.steps.map(normaliseCurrency),
      verification: normaliseCurrency(explanation.stepByStep.verification),
      conclusion: normaliseCurrency(explanation.stepByStep.conclusion),
    },
    examShortcut: {
      ...explanation.examShortcut,
      narrative: shortcutNarrative,
      displayMath: shortcutDisplayMath,
    },
    trapAnalysis: {
      ...explanation.trapAnalysis,
      items: explanation.trapAnalysis.items.map((item) => ({
        ...item,
        optionText: normaliseCurrency(item.optionText),
        explanation: normaliseCurrency(item.explanation),
      })),
    },
  };
}

function hasUngroupedRupees(text: string): boolean {
  return /₹\s*-?\d{4,}(?![\d,])/u.test(text);
}

function hasBalancedDisplayMath(text: string): boolean {
  const matches = text.match(/\$\$/gu) ?? [];
  return matches.length >= 2 && matches.length % 2 === 0;
}

function appearsToLoseCurrencyPunctuation(text: string): boolean {
  const indianNumber = String.raw`(?:\d{1,3}(?:,\d{2})*,\d{3}|\d+)`;
  const pattern = new RegExp(`₹\\s*-?${indianNumber}\\s+(?:the|and|but|while|whereas)\\b`, "iu");
  return pattern.test(text);
}

export function generateIntCp001FinalEditorialQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001FinalEditorialQuestion {
  const core = generateIntCp001FinalCoreQuestion(qlId, seed);
  const entry = getIntCp001FinalRegistryEntry(qlId);
  const stem = normaliseCurrency(core.stem);
  const options = core.options.map(normaliseCurrency);
  const optionAudit = core.optionAudit.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const explanation = normaliseExplanationCurrency(buildIntCp001FourTierExplanation({
    qlId,
    entry,
    legacy: protectLegacyExplanation(core.explanation),
    parameters: core.internalProvenance.sourceParameters,
    options,
    optionAudit,
    correctIndex: core.correctIndex,
  }));

  const errors = [...core.validation.errors];
  if (!explanation.coreConcept.displayMath || !hasBalancedDisplayMath(explanation.coreConcept.displayMath)) {
    errors.push("Four-tier core concept is missing balanced display MathJax.");
  }
  if (!explanation.examShortcut.narrative.trim()) {
    errors.push("Four-tier explanation is missing an exam-speed shortcut.");
  }
  if (!explanation.examShortcut.displayMath || !hasBalancedDisplayMath(explanation.examShortcut.displayMath)) {
    errors.push("Four-tier shortcut is missing balanced display MathJax.");
  }
  if (/^(?:Find|Determine)\b/u.test(explanation.examShortcut.narrative)) {
    errors.push("Exam shortcut begins with an imperative fragment.");
  }
  if (/\bfirst\b[^.]*\bfirst\b/iu.test(explanation.examShortcut.narrative)) {
    errors.push("Exam shortcut repeats the word 'first'.");
  }
  if (explanation.trapAnalysis.items.length !== 3) {
    errors.push(`Four-tier explanation must analyse three distractors; found ${explanation.trapAnalysis.items.length}.`);
  }
  if (!explanation.stepByStep.conclusion.includes(options[core.correctIndex]!)) {
    errors.push("Four-tier conclusion does not state the displayed correct option.");
  }
  if (appearsToLoseCurrencyPunctuation(stem)) {
    errors.push("Currency normalisation appears to have removed required sentence punctuation.");
  }

  const learnerText = [
    stem,
    ...options,
    explanation.coreConcept.narrative,
    explanation.coreConcept.displayMath,
    ...explanation.stepByStep.steps,
    explanation.stepByStep.verification,
    explanation.stepByStep.conclusion,
    explanation.examShortcut.narrative,
    explanation.examShortcut.displayMath,
    ...explanation.trapAnalysis.items.flatMap((item) => [item.optionText, item.explanation]),
  ].join(" ");
  if (hasUngroupedRupees(learnerText)) {
    errors.push("Learner-facing text contains an ungrouped rupee value of four or more digits.");
  }

  return {
    ...core,
    releaseId: INT_CP001_EDITORIAL_RELEASE_ID,
    stem,
    options,
    optionAudit,
    explanation,
    validation: {
      ...core.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}
