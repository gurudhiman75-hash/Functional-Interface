import {
  buildIntCp001FourTierExplanation,
  formatIndianCurrencyText,
  type IntCp001FourTierExplanation,
} from "./cp001-editorial-v2";
import { getIntCp001FinalRegistryEntry, type IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001FinalQuestion as generateIntCp001FinalCoreQuestion,
  type IntCp001FinalGeneratedQuestion,
} from "./cp001-final-runtime";

export type IntCp001FinalEditorialQuestion = Omit<
  IntCp001FinalGeneratedQuestion,
  "stem" | "options" | "optionAudit" | "explanation" | "validation"
> & {
  stem: string;
  options: string[];
  optionAudit: IntCp001FinalGeneratedQuestion["optionAudit"];
  explanation: IntCp001FourTierExplanation;
  validation: IntCp001FinalGeneratedQuestion["validation"];
};

function formatIndianInteger(raw: string): string {
  const negative = raw.startsWith("-");
  const digits = raw.replace(/[-,]/gu, "").replace(/^0+(?=\d)/u, "");
  if (digits.length <= 3) return `${negative ? "-" : ""}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/gu, ",");
  return `${negative ? "-" : ""}${leading},${lastThree}`;
}

function normaliseCurrency(text: string): string {
  return formatIndianCurrencyText(text).replace(
    /₹\s*(-?\d{4,})(?=[^\d,]|$)/gu,
    (_match, raw: string) => `₹${formatIndianInteger(raw)}`,
  );
}

function normaliseExplanationCurrency(explanation: IntCp001FourTierExplanation): IntCp001FourTierExplanation {
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
      displayMath: normaliseCurrency(explanation.coreConcept.displayMath),
    },
    stepByStep: {
      ...explanation.stepByStep,
      steps: explanation.stepByStep.steps.map(normaliseCurrency),
      verification: normaliseCurrency(explanation.stepByStep.verification),
      conclusion: normaliseCurrency(explanation.stepByStep.conclusion),
    },
    examShortcut: {
      ...explanation.examShortcut,
      narrative: normaliseCurrency(explanation.examShortcut.narrative),
      displayMath: explanation.examShortcut.displayMath
        ? normaliseCurrency(explanation.examShortcut.displayMath)
        : undefined,
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
    legacy: core.explanation,
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
  if (explanation.trapAnalysis.items.length !== 3) {
    errors.push(`Four-tier explanation must analyse three distractors; found ${explanation.trapAnalysis.items.length}.`);
  }
  if (!explanation.stepByStep.conclusion.includes(options[core.correctIndex]!)) {
    errors.push("Four-tier conclusion does not state the displayed correct option.");
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
    explanation.examShortcut.displayMath ?? "",
    ...explanation.trapAnalysis.items.flatMap((item) => [item.optionText, item.explanation]),
  ].join(" ");
  if (hasUngroupedRupees(learnerText)) {
    errors.push("Learner-facing text contains an ungrouped rupee value of four or more digits.");
  }

  return {
    ...core,
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
