// @ts-nocheck
import * as core from "./simple-teacher-voice-core";
const {
  rawText, cleanText, mathNumber, mathValue, displayEquation, titleCaseClass,
  studentOptionDisplay, optionValues, correctIndex, gcd, isPrime, primeFactors,
  factorisationPlain, productFromFactors, digitSum, fillTemplate, setText,
  pairSetText, divisibilityEvidence, simpleDiagnostic, parseNumericOption,
  parseAdjustmentSet, parseIntegerList, smallestNonTrivialDivisor, listDifference,
} = core;

export function cp003TrapMessage(row, optionValue, tag) {
  const state = row.question.hiddenState ?? {};
  const ql = row.allocation.qlId;
  const numeric = parseNumericOption(optionValue);

  if (state.kind === "DIRECT_DIVISIBILITY" && numeric !== null) {
    const evidence = divisibilityEvidence(state.number, numeric);
    return evidence.divides
      ? `${studentOptionDisplay(optionValue)} divides the number exactly, so it cannot be the required non-divisor.`
      : `${studentOptionDisplay(optionValue)} leaves remainder ${mathNumber(evidence.remainder)}, so it cannot be the required divisor.`;
  }
  if (state.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
    if (state.projection === "VALID_DIGIT_COUNT") {
      return `There are ${mathNumber(state.validDigits.length)} valid digits, not ${studentOptionDisplay(optionValue)}.`;
    }
    if (state.projection === "VALID_DIGIT_SUM") {
      const total = state.validDigits.reduce((sum, digit) => sum + digit, 0);
      return `The valid digits are ${mathValue(setText(state.validDigits))}, and their sum is ${mathNumber(total)}.`;
    }
    if (state.projection === "COMPLETE_VALID_DIGIT_SET") {
      return `The complete set is ${mathValue(setText(state.validDigits))}. This option leaves out a valid digit or adds an invalid one.`;
    }
    if (state.projection === "EXTREMUM_COMPLETED_NUMBER") {
      const completed = state.validDigits.map((x) => Number(fillTemplate(state.template, { x })));
      const answer = state.extremumDirection === "GREATEST" ? Math.max(...completed) : Math.min(...completed);
      return `The required completed number is ${mathNumber(answer)}. This option is not the correct largest or smallest valid number.`;
    }
    if (numeric !== null) {
      if (state.validDigits.includes(numeric)) {
        const answer = state.extremumDirection === "LARGEST" ? Math.max(...state.validDigits) : Math.min(...state.validDigits);
        return `${mathValue(`X = ${numeric}`)} works, but the question asks for ${state.extremumDirection.toLowerCase()} valid digit ${mathNumber(answer)}.`;
      }
      const completed = fillTemplate(state.template, { x: numeric });
      const failed = state.divisors.find((divisor) => BigInt(completed) % BigInt(divisor) !== 0n);
      const evidence = failed ? divisibilityEvidence(completed, failed) : null;
      return `${mathValue(`X = ${numeric}`)} forms ${mathNumber(completed)}. ${evidence ? evidence.text : "It fails one of the required divisibility rules."}`;
    }
    return `The digits that satisfy every rule are ${mathValue(setText(state.validDigits))}.`;
  }
  if (state.kind === "ORDERED_PAIR_CANDIDATE_SET") {
    if (state.projection === "VALID_ORDERED_PAIR_COUNT") {
      return `There are ${mathNumber(state.validPairs.length)} valid ordered pairs, not ${studentOptionDisplay(optionValue)}.`;
    }
    if (state.projection === "PAIR_SOLUTION_CLASS") {
      const count = state.validPairs.length;
      const result = count === 0 ? "No solution" : count === 1 ? "Exactly one solution" : "More than one solution";
      return `There are ${mathNumber(count)} valid pairs, so the correct description is “${result}”.`;
    }
    return `The valid ordered pairs are ${mathValue(pairSetText(state.validPairs))}. This option misses a pair, adds a wrong pair or swaps ${mathValue("X")} and ${mathValue("Y")}.`;
  }
  if (state.kind === "DIGIT_BOUND_MULTIPLE") {
    return `The required boundary multiple is ${mathNumber(state.answer)}. ${studentOptionDisplay(optionValue)} is outside the digit limit or is not the closest valid multiple.`;
  }
  if (state.kind === "ONE_DIVISOR_RANGE") {
    return `The range formula gives ${mathNumber(state.count)} multiples, not ${studentOptionDisplay(optionValue)}.`;
  }
  if (state.kind === "IMPLICIT_REPEATED_NUMERAL" && numeric !== null) {
    const n = BigInt(state.number);
    const d = BigInt(numeric);
    const remainder = n % d;
    return remainder === 0n
      ? `${studentOptionDisplay(optionValue)} divides the repeated number exactly, so read the requested choice carefully.`
      : `Dividing the repeated number by ${studentOptionDisplay(optionValue)} leaves remainder ${mathNumber(remainder)}.`;
  }
  if (state.kind === "LINKED_ARITHMETIC_DIVISIBILITY" && numeric !== null) {
    const validDigits = state.validPairs.map((pair) => pair[0]);
    return validDigits.includes(numeric)
      ? `${mathNumber(numeric)} works, but it is not the required ${state.direction.toLowerCase()} value.`
      : `${mathNumber(numeric)} fails the divisibility condition after the addition is completed.`;
  }
  if (state.kind === "DATA_SUFFICIENCY") {
    return `Statement I leaves ${mathNumber(state.candidatesI.length)} value(s), Statement II leaves ${mathNumber(state.candidatesII.length)}, and together they leave ${mathNumber(state.candidatesTogether.length)}. This option reads those counts incorrectly.`;
  }
  if (state.kind === "CLAIM_VALIDATION") {
    const claim = state.claims.find((item) => cleanText(item.text) === cleanText(optionValue));
    if (claim) {
      const evidence = divisibilityEvidence(claim.number, claim.divisor);
      const actual = evidence.divides ? "is divisible" : "is not divisible";
      const asked = state.requestedPolarity === "CORRECT" ? "a correct" : "an incorrect";
      return `${evidence.text} Therefore, ${mathNumber(claim.number)} ${actual} by ${mathNumber(claim.divisor)}. The displayed statement is ${claim.isTrue ? "true" : "false"}, but the question asks for ${asked} statement.`;
    }
  }

  return null;
}
