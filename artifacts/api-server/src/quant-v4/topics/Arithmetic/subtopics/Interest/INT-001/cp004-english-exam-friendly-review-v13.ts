import {
  add,
  deepFreeze,
  div,
  mixedFrequencyAmount,
  mul,
  periodicRate,
  pow,
  rat,
  sub,
  type Cp004Frequency,
  type IntCp004QlId,
  type Rational,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { generateIntCp004EnglishExamFriendlyReviewV12 } from "./cp004-english-exam-friendly-review-v12";

export const INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V13 = Object.freeze({
  version: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v13" as const,
  baseVersion: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v12" as const,
  status: "ENGLISH_REMEDIATED_REVIEW_CANDIDATE" as const,
  mixedFrequencyExactFactorProof: true as const,
  approved: false as const,
  permanentIdentityChanges: false as const,
  questionStudioActivationAuthorized: false as const,
});

function fractionText(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function stageFactor(ratePercent: Rational, frequency: Cp004Frequency, years: number): Rational {
  const perPeriod = periodicRate(ratePercent, frequency);
  return pow(add(rat(1n), div(perPeriod, rat(100n))), frequency * years);
}

export function generateIntCp004EnglishExamFriendlyReviewV13(
  qlId: IntCp004QlId,
  seed: string,
) {
  const source = generateIntCp004EnglishExamFriendlyReviewV12(qlId, seed);
  if (qlId !== "INT-QL-084" && qlId !== "INT-QL-085") {
    return deepFreeze({
      ...source,
      englishParityVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V13.version,
      v13Remediation: {
        mixedFrequencyExactFactorProofApplied: false as const,
        mathematicalStateChanged: false as const,
        permanentIdentityChanged: false as const,
        approvalGranted: false as const,
      },
    });
  }

  const state = source.mathematicalState;
  const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
  const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
  const firstFactor = stageFactor(state.nominalAnnualRatePercent, state.firstFrequency, state.firstYears);
  const secondFactor = stageFactor(state.nominalAnnualRatePercent, state.secondFrequency, state.secondYears);
  const combinedFactor = mul(firstFactor, secondFactor);
  const finalAmount = mixedFrequencyAmount(
    state.principal,
    state.nominalAnnualRatePercent,
    state.firstFrequency,
    state.firstYears,
    state.secondFrequency,
    state.secondYears,
  );
  const compoundInterest = sub(finalAmount, state.principal);
  const formula = source.explanation.steps[0]
    ?? "Formula: multiply the growth factors for the two successive compounding schedules.";

  const finalStep = qlId === "INT-QL-084"
    ? `Final amount = ${moneyText(state.principal)} × ${fractionText(combinedFactor)} = ${moneyText(finalAmount)}.`
    : `Compound interest = ${moneyText(finalAmount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}.`;

  return deepFreeze({
    ...source,
    englishParityVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V13.version,
    explanation: {
      ...source.explanation,
      steps: Object.freeze([
        formula,
        `First stage: periodic rate = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}; exact stage factor = ${fractionText(firstFactor)}.`,
        `Second stage: periodic rate = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}; exact stage factor = ${fractionText(secondFactor)}.`,
        `Combined growth factor = ${fractionText(firstFactor)} × ${fractionText(secondFactor)} = ${fractionText(combinedFactor)}.`,
        `Combined amount = ${moneyText(state.principal)} × ${fractionText(combinedFactor)} = ${moneyText(finalAmount)}.`,
        finalStep,
      ]),
    },
    v13Remediation: {
      mixedFrequencyExactFactorProofApplied: true as const,
      mathematicalStateChanged: false as const,
      permanentIdentityChanged: false as const,
      approvalGranted: false as const,
    },
  });
}
