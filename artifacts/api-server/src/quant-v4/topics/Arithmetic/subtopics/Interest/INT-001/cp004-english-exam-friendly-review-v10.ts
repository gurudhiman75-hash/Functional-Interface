import {
  FREQUENCIES,
  add,
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  deepFreeze,
  div,
  mul,
  periodicRate,
  pow,
  rat,
  sub,
  type Cp004Explanation,
  type Cp004MathematicalState,
  type Cp004Option,
  type IntCp004QlId,
  type IntCp004Question,
  type Rational,
} from "./cp004-frequency-math";
import { generateIntCp004QuestionFromState } from "./cp004-frequency-runtime";
import { generateIntCp004ExamFriendlyStateV9 } from "./cp004-exam-friendly-state-v9";
import { hardenCp004ExplanationV4 } from "./cp004-frequency-exam-readiness-v4";
import { ensureCp004InverseExplanationDepthV4 } from "./cp004-frequency-explanation-depth-v4";
import { polishCp004TargetWordingV4 } from "./cp004-frequency-wording-v4";
import {
  polishCp004ExplanationHumanV4,
  polishCp004PresentationHumanV4,
} from "./cp004-frequency-human-polish-v4";
import { polishCp004OptionsHumanV4 } from "./cp004-frequency-option-polish-v4";
import { finalizeCp004ExplanationLanguageV4 } from "./cp004-frequency-final-language-v4";
import { finalizeCp004TableLanguageV5 } from "./cp004-frequency-table-language-v5";
import { finalizeCp004PresentationLanguageV5 } from "./cp004-frequency-final-presentation-v5";
import { ensureCp004FormulaStepV6 } from "./cp004-frequency-formula-explanation-v6";
import {
  frequencyScheduleLabel,
  moneyText,
  percentText,
} from "./cp004-frequency-options";

export const INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V10 = Object.freeze({
  version: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v10" as const,
  checkpointId: "INT-CP-004" as const,
  qlRange: "INT-QL-067..INT-QL-085" as const,
  qlCount: 19 as const,
  sourceMathematics: "INT-CP-004-EXAM-FRIENDLY-STATE-v9" as const,
  historicalEnglishAuthority: "INT-CP-004-EN-v2-frozen" as const,
  status: "ENGLISH_REMEDIATED_REVIEW_CANDIDATE" as const,
  approved: false as const,
  permanentIdentityChanges: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

export type IntCp004EnglishExamFriendlyReviewQuestionV10 = IntCp004Question & Readonly<{
  englishParityVersion: typeof INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V10.version;
  reviewAuthorityStatus: "ENGLISH_REMEDIATED_REVIEW_CANDIDATE";
  sourceMathematicalPolicy: "INT-CP-004-EXAM-FRIENDLY-STATE-v9";
  historicalEnglishAuthorityPreserved: true;
  learnerContentFrozen: false;
  manualApprovalRequired: true;
}>;

function roundRational(value: Rational): bigint {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let quotient = numerator / value.denominator;
  const remainder = numerator % value.denominator;
  if (remainder * 2n >= value.denominator) quotient += 1n;
  return negative ? -quotient : quotient;
}

function fractionText(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function cleanEnglishText(value: string): string {
  return value
    .replace(/\s*\(approximately\s+[+-]?\d+(?:\.\d+)?\)/giu, "")
    .replace(/\s*\(about\s+[+-]?\d+(?:\.\d+)?\)/giu, "")
    .replace(/\bcorrect\s+to\s+two\s+decimal\s+places\b/giu, "")
    .replace(/\bto\s+two\s+decimal\s+places\b/giu, "")
    .replace(/\brounded?\s+to\s+two\s+decimal\s+places\b/giu, "")
    .replace(/\bapproximately\b/giu, "")
    .replace(/\s+([,.;:?])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .replace(/\.\s*\./gu, ".")
    .trim();
}

function displayIntegerOption(question: IntCp004Question, value: bigint): string | null {
  if (question.answerSemantic === "MONEY") return moneyText(rat(value));
  if (question.answerSemantic === "RATE_PERCENT") return percentText(rat(value));
  return null;
}

function adaptIntegerCleanOptions(question: IntCp004Question, options: readonly Cp004Option[]) {
  if (question.answerSemantic !== "MONEY" && question.answerSemantic !== "RATE_PERCENT") {
    return Object.freeze(options.map((option) => Object.freeze({ ...option, feedback: "" })));
  }

  if (question.solution.denominator !== 1n) {
    throw new Error(`${question.qlId}/${question.seed}: V10 expected an integer verified answer.`);
  }

  const correctValue = question.solution.numerator;
  const step = question.answerSemantic === "MONEY" ? 10n : 1n;
  const used = new Set<string>();

  return Object.freeze(options.map((option, index) => {
    let displayedValue = index === question.correctIndex ? correctValue : roundRational(option.value);
    if (index !== question.correctIndex) {
      let nudge = 0n;
      while (
        displayedValue === correctValue
        || used.has(displayedValue.toString())
        || (question.answerSemantic === "RATE_PERCENT" && displayedValue < 0n)
      ) {
        nudge += step;
        displayedValue = roundRational(option.value) + nudge;
      }
    }
    used.add(displayedValue.toString());
    return Object.freeze({
      ...option,
      text: displayIntegerOption(question, displayedValue) ?? option.text,
      feedback: "",
    });
  }));
}

function periodGrowthFactor(state: Extract<Cp004MathematicalState, { qlId: "INT-QL-069" | "INT-QL-070" | "INT-QL-071" | "INT-QL-072" | "INT-QL-076" | "INT-QL-077" | "INT-QL-078" }>): Rational {
  const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  return add(rat(1n), div(perPeriod, rat(100n)));
}

function exactV10Steps(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
  solution: Rational,
): readonly string[] {
  const formula = explanation.steps[0] ?? "Formula: use the stated compounding rule.";

  switch (state.qlId) {
    case "INT-QL-069": {
      const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const factor = pow(periodGrowthFactor(state), state.periods);
      const finalAmount = completeAmountForState(state);
      return Object.freeze([
        formula,
        `Rate per compounding period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}.`,
        `Growth factor for ${state.periods} periods = (1 + ${fractionText(perPeriod)}/100)^${state.periods} = ${fractionText(factor)}.`,
        `Principal = ${moneyText(finalAmount)} ÷ (${fractionText(factor)}) = ${moneyText(solution)}.`,
        `Check: ${moneyText(solution)} × ${fractionText(factor)} = ${moneyText(finalAmount)}.`,
      ]);
    }
    case "INT-QL-070": {
      const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const amountFactor = pow(periodGrowthFactor(state), state.periods);
      const interestFactor = sub(amountFactor, rat(1n));
      const finalAmount = completeAmountForState(state);
      const compoundInterest = sub(finalAmount, state.principal);
      return Object.freeze([
        formula,
        `Rate per compounding period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}.`,
        `Amount factor = (1 + ${fractionText(perPeriod)}/100)^${state.periods} = ${fractionText(amountFactor)}, so the compound-interest factor is ${fractionText(interestFactor)}.`,
        `Principal = ${moneyText(compoundInterest)} ÷ (${fractionText(interestFactor)}) = ${moneyText(solution)}.`,
        `Check: ${moneyText(solution)} × ${fractionText(interestFactor)} = ${moneyText(compoundInterest)}.`,
      ]);
    }
    case "INT-QL-071": {
      const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const amountFactor = pow(periodGrowthFactor(state), state.periods);
      const finalAmount = completeAmountForState(state);
      return Object.freeze([
        formula,
        `Observed growth factor = ${moneyText(finalAmount)} ÷ ${moneyText(state.principal)} = ${fractionText(amountFactor)}.`,
        `For ${state.periods} compounding periods, the matching per-period rate is ${percentText(perPeriod)}, because (1 + ${fractionText(perPeriod)}/100)^${state.periods} = ${fractionText(amountFactor)}.`,
        `Nominal annual rate = ${percentText(perPeriod)} × ${state.frequency} = ${percentText(solution)}.`,
        `Check: compounding ${moneyText(state.principal)} at ${percentText(solution)} per annum on the stated schedule gives ${moneyText(finalAmount)}.`,
      ]);
    }
    case "INT-QL-076": {
      const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const oneYearFactor = pow(periodGrowthFactor(state), state.frequency);
      const effectiveFraction = sub(oneYearFactor, rat(1n));
      return Object.freeze([
        formula,
        `Rate per compounding period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}.`,
        `One-year growth factor = (1 + ${fractionText(perPeriod)}/100)^${state.frequency} = ${fractionText(oneYearFactor)}.`,
        `Effective annual increase = (${fractionText(oneYearFactor)} − 1) × 100% = ${percentText(solution)}.`,
      ]);
    }
    case "INT-QL-077": {
      const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const oneYearFactor = pow(periodGrowthFactor(state), state.frequency);
      const effective = mul(sub(oneYearFactor, rat(1n)), rat(100n));
      return Object.freeze([
        formula,
        `With ${state.frequency} compounding period${state.frequency === 1 ? "" : "s"} in a year, the matching per-period rate is ${percentText(perPeriod)}.`,
        `That gives one-year factor (1 + ${fractionText(perPeriod)}/100)^${state.frequency} = ${fractionText(oneYearFactor)}, hence effective rate ${percentText(effective)}.`,
        `Nominal annual rate = ${percentText(perPeriod)} × ${state.frequency} = ${percentText(solution)}.`,
      ]);
    }
    case "INT-QL-078": {
      const target = completeAmountForState(state);
      const targetRatio = div(target, state.principal);
      const comparisons = FREQUENCIES.filter((frequency) => frequency !== 12).map((frequency) => {
        const amount = completeAmountFromNominal(
          state.principal,
          state.nominalAnnualRatePercent,
          frequency,
          frequency * state.years,
        );
        return `${frequencyScheduleLabel(frequency)} compounding gives ${moneyText(amount)}.`;
      });
      return Object.freeze([
        formula,
        `Observed amount factor = ${moneyText(target)} ÷ ${moneyText(state.principal)} = ${fractionText(targetRatio)}.`,
        ...comparisons,
        `Only ${frequencyScheduleLabel(state.frequency)} compounding matches ${moneyText(target)} exactly.`,
      ]);
    }
    case "INT-QL-081": {
      const annualFactor = add(rat(1n), div(state.nominalAnnualRatePercent, rat(100n)));
      const compoundedFactor = pow(annualFactor, state.fullYears);
      const tailFactor = add(
        rat(1n),
        mul(
          div(state.nominalAnnualRatePercent, rat(100n)),
          rat(BigInt(state.tailMonths), 12n),
        ),
      );
      const combined = mul(compoundedFactor, tailFactor);
      const finalAmount = brokenAmountForState(state);
      return Object.freeze([
        formula,
        `Factor for ${state.fullYears} year${state.fullYears === 1 ? "" : "s"} of annual compounding = ${fractionText(compoundedFactor)}.`,
        `For the remaining ${state.tailMonths} months, simple-interest factor on that balance = ${fractionText(tailFactor)}.`,
        `Combined factor = ${fractionText(compoundedFactor)} × ${fractionText(tailFactor)} = ${fractionText(combined)}.`,
        `Principal = ${moneyText(finalAmount)} ÷ (${fractionText(combined)}) = ${moneyText(solution)}.`,
      ]);
    }
    default:
      return explanation.steps;
  }
}

export function generateIntCp004EnglishExamFriendlyReviewV10(
  qlId: IntCp004QlId,
  seed: string,
): IntCp004EnglishExamFriendlyReviewQuestionV10 {
  const mathematicalState = generateIntCp004ExamFriendlyStateV9(qlId, seed);
  const base = generateIntCp004QuestionFromState(qlId, seed, mathematicalState);

  const presentation0 = Object.freeze({
    representation: base.representation,
    stemFamilyId: base.stemFamilyId,
    stem: base.stem,
  });
  const presentation1 = polishCp004PresentationHumanV4(mathematicalState, presentation0);
  const presentation2 = finalizeCp004TableLanguageV5(mathematicalState, presentation1);
  const presentation3 = finalizeCp004PresentationLanguageV5(mathematicalState, presentation2);
  const presentation = Object.freeze({
    ...presentation3,
    stem: cleanEnglishText(presentation3.stem),
  });

  const polishedOptions = polishCp004OptionsHumanV4(mathematicalState, base.options);
  const options = adaptIntegerCleanOptions(base, polishedOptions);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${qlId}/${seed}: V10 option ownership failed.`);
  }
  const correctAnswer = options[correctIndex]!.text;

  const explanation1 = hardenCp004ExplanationV4(mathematicalState, base.explanation);
  const explanation2 = ensureCp004InverseExplanationDepthV4(mathematicalState, explanation1);
  const explanation3 = polishCp004TargetWordingV4(mathematicalState, explanation2);
  const explanation4 = polishCp004ExplanationHumanV4(mathematicalState, explanation3);
  const explanation5 = finalizeCp004ExplanationLanguageV4(mathematicalState, explanation4);
  const explanation6 = ensureCp004FormulaStepV6(mathematicalState, explanation5);
  const exactSteps = exactV10Steps(mathematicalState, explanation6, base.solution);
  const explanation = Object.freeze({
    ...explanation6,
    whatAsked: cleanEnglishText(explanation6.whatAsked),
    steps: Object.freeze(exactSteps.map(cleanEnglishText)),
    finalAnswer: correctAnswer,
    commonMistake: cleanEnglishText(explanation6.commonMistake),
  });

  return deepFreeze({
    ...base,
    mathematicalState,
    representation: presentation.representation,
    stemFamilyId: presentation.stemFamilyId,
    stem: presentation.stem,
    options,
    correctIndex,
    correctAnswer,
    explanation,
    editorialStatus: "ENGLISH_REVIEW_CANDIDATE",
    approvalStatus: "NOT_APPROVED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    englishParityVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V10.version,
    reviewAuthorityStatus: "ENGLISH_REMEDIATED_REVIEW_CANDIDATE",
    sourceMathematicalPolicy: "INT-CP-004-EXAM-FRIENDLY-STATE-v9",
    historicalEnglishAuthorityPreserved: true,
    learnerContentFrozen: false,
    manualApprovalRequired: true,
  });
}
