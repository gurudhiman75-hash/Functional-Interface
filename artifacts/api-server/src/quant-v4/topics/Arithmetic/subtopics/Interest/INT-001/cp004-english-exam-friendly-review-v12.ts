import {
  add,
  deepFreeze,
  div,
  periodicRate,
  pow,
  rat,
  type Cp004Frequency,
  type IntCp004QlId,
  type Rational,
} from "./cp004-frequency-math";
import { frequencyScheduleLabel } from "./cp004-frequency-options";
import {
  generateIntCp004EnglishExamFriendlyReviewV11,
} from "./cp004-english-exam-friendly-review-v11";

export const INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V12 = Object.freeze({
  version: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v12" as const,
  baseVersion: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v11" as const,
  status: "ENGLISH_REMEDIATED_REVIEW_CANDIDATE" as const,
  ql078ExactFactorProof: true as const,
  approved: false as const,
  permanentIdentityChanges: false as const,
  questionStudioActivationAuthorized: false as const,
});

function fractionText(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function growthFactor(ratePercent: Rational, frequency: Cp004Frequency, years: number): Rational {
  const periodic = periodicRate(ratePercent, frequency);
  return pow(add(rat(1n), div(periodic, rat(100n))), frequency * years);
}

export function generateIntCp004EnglishExamFriendlyReviewV12(
  qlId: IntCp004QlId,
  seed: string,
) {
  const source = generateIntCp004EnglishExamFriendlyReviewV11(qlId, seed);
  if (qlId !== "INT-QL-078") {
    return deepFreeze({
      ...source,
      englishParityVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V12.version,
      v12Remediation: {
        ql078ExactFactorProofApplied: false as const,
        mathematicalStateChanged: false as const,
        permanentIdentityChanged: false as const,
        approvalGranted: false as const,
      },
    });
  }

  const state = source.mathematicalState;
  const targetFactor = growthFactor(state.nominalAnnualRatePercent, state.frequency, state.years);
  const permitted: readonly Cp004Frequency[] = [1, 2, 4];
  const comparisonSteps = permitted.map((frequency) => {
    const factor = growthFactor(state.nominalAnnualRatePercent, frequency, state.years);
    const relation = factor.numerator === targetFactor.numerator && factor.denominator === targetFactor.denominator
      ? "matches"
      : "does not match";
    return `${frequencyScheduleLabel(frequency)} compounding gives exact growth factor ${fractionText(factor)}, which ${relation} the observed factor ${fractionText(targetFactor)}.`;
  });

  const formula = source.explanation.steps[0]
    ?? "Formula: A = P(1 + R/(100m))^(mt), where m is the number of compounding periods per year.";

  return deepFreeze({
    ...source,
    englishParityVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V12.version,
    explanation: {
      ...source.explanation,
      steps: Object.freeze([
        formula,
        `Observed amount factor = final amount ÷ principal = ${fractionText(targetFactor)}.`,
        ...comparisonSteps,
        `Therefore the required schedule is ${frequencyScheduleLabel(state.frequency)} compounding.`,
      ]),
    },
    v12Remediation: {
      ql078ExactFactorProofApplied: true as const,
      mathematicalStateChanged: false as const,
      permanentIdentityChanged: false as const,
      approvalGranted: false as const,
    },
  });
}
