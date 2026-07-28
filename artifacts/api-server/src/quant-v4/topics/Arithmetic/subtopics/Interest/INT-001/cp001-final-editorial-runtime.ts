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
  const stem = formatIndianCurrencyText(core.stem);
  const options = core.options.map(formatIndianCurrencyText);
  const optionAudit = core.optionAudit.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const explanation = buildIntCp001FourTierExplanation({
    qlId,
    entry,
    legacy: core.explanation,
    parameters: core.internalProvenance.sourceParameters,
    options,
    optionAudit,
    correctIndex: core.correctIndex,
  });

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
