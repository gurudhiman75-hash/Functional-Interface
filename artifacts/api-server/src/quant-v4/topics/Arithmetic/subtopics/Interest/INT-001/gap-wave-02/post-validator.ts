import {
  divideRational,
  formatDecimalIfTerminating,
  formatRational,
  isWholeRational,
  multiplyRational,
} from "../foundation/rational";
import type {
  IntCp001Wave2Explanation,
  IntCp001Wave2OptionAudit,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2SolveResult,
  IntCp001Wave2VerificationResult,
  Rational,
} from "./types";

function exactFactor(value: Rational): string {
  return formatDecimalIfTerminating(value, 6) ?? formatRational(value);
}

interface PostValidationInput {
  parameters: IntCp001Wave2PrototypeParameters;
  solution: IntCp001Wave2SolveResult;
  stem: string;
  optionAudit: IntCp001Wave2OptionAudit[];
  explanation: IntCp001Wave2Explanation;
  base: IntCp001Wave2VerificationResult;
}

export function applyIntCp001Wave2PostValidation(
  input: PostValidationInput,
): IntCp001Wave2VerificationResult {
  const errors = [...input.base.errors];
  const combinedPresentation = [
    input.stem,
    input.explanation.notice,
    input.explanation.relation,
    ...input.explanation.steps,
    input.explanation.verification,
    input.explanation.conclusion,
  ].join(" ");

  if (/\ba (?:education|equipment) loan\b/iu.test(input.stem)) {
    errors.push("Stem contains an incorrect indefinite article before a vowel sound.");
  }
  if (/how many times the principal is the final amount/iu.test(input.stem)) {
    errors.push("Amount-multiple stem uses an unnatural inversion.");
  }
  if (/\bratio\s+1:\d+\s+\d+\/\d+/iu.test(input.stem)) {
    errors.push("Amount-ratio stem exposes an unreadable mixed-number ratio.");
  }
  if (/\byear\(s\)/iu.test(combinedPresentation)) {
    errors.push("Presentation contains the mechanical label 'year(s)'.");
  }
  if (/(?<!\d )\b\d+\/\d+ years\b/u.test(combinedPresentation)) {
    errors.push("Presentation uses a standalone fractional year with plural grammar.");
  }
  if (/\bUsing \d+\/1%/u.test(combinedPresentation)) {
    errors.push("Verification exposes an unreduced denominator-one percentage.");
  }

  if (input.solution.semantic === "TIME_MONTHS") {
    for (const [index, option] of input.optionAudit.entries()) {
      if (!isWholeRational(option.result.value)) {
        errors.push(`Month option ${index} is fractional.`);
      }
    }
  }

  const request = input.parameters.request;
  const state = input.parameters.hiddenState;
  if (request.mode === "PRINCIPAL_FROM_INTEREST") {
    const factor = exactFactor(multiplyRational(state.annualRate, request.timeYears));
    if (!input.explanation.steps.some((step) => step.includes(factor))) {
      errors.push("Principal-from-interest explanation does not show the exact rate–time factor.");
    }
  }
  if (request.mode === "PRINCIPAL_FROM_AMOUNT") {
    const multiplier = exactFactor(divideRational(state.laterAmount, state.principal));
    if (!input.explanation.steps.some((step) => step.includes(multiplier))) {
      errors.push("Principal-from-amount explanation does not show the exact amount multiplier.");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    matchingCandidates: input.base.matchingCandidates,
  };
}
