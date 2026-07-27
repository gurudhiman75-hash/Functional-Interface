import type {
  UniformDigitAmbiguityAudit,
  UniformDigitEvidence,
  UniformDigitStructuredPrompt,
} from "./uniform-digit-types";
import {
  inferArbitraryDigitMap,
  inferReversedUniformShiftSurvivors,
  inferUniformShiftSurvivors,
  inferWholeNumberDelta,
  inverseTranslateDigitSequence,
  translateDigitSequence,
} from "./uniform-digit-rule";

export function auditUniformDigitEvidence(
  evidence: readonly UniformDigitEvidence[],
  intendedShift: number,
): UniformDigitAmbiguityAudit {
  const uniformShiftSurvivors = inferUniformShiftSurvivors(evidence);
  const reversedUniformShiftSurvivors = inferReversedUniformShiftSurvivors(evidence);
  const wholeNumberDeltaSurvives = inferWholeNumberDelta(evidence) !== null;
  const arbitraryDigitMapConsistent = inferArbitraryDigitMap(evidence) !== null;

  if (!uniformShiftSurvivors.includes(intendedShift)) {
    return {
      accepted: false,
      intendedShift,
      uniformShiftSurvivors,
      wholeNumberDeltaSurvives,
      reversedUniformShiftSurvivors,
      arbitraryDigitMapConsistent,
      canonicalWinner: null,
      reason: "The intended decimal translation does not explain every displayed example.",
    };
  }
  if (uniformShiftSurvivors.length !== 1) {
    return {
      accepted: false,
      intendedShift,
      uniformShiftSurvivors,
      wholeNumberDeltaSurvives,
      reversedUniformShiftSurvivors,
      arbitraryDigitMapConsistent,
      canonicalWinner: null,
      reason: "More than one uniform decimal shift explains the evidence.",
    };
  }
  if (wholeNumberDeltaSurvives) {
    return {
      accepted: false,
      intendedShift,
      uniformShiftSurvivors,
      wholeNumberDeltaSurvives,
      reversedUniformShiftSurvivors,
      arbitraryDigitMapConsistent,
      canonicalWinner: null,
      reason: "Whole-number arithmetic also explains every displayed example.",
    };
  }
  if (reversedUniformShiftSurvivors.length > 0) {
    return {
      accepted: false,
      intendedShift,
      uniformShiftSurvivors,
      wholeNumberDeltaSurvives,
      reversedUniformShiftSurvivors,
      arbitraryDigitMapConsistent,
      canonicalWinner: null,
      reason: "A reversal followed by a decimal shift also explains every displayed example.",
    };
  }

  return {
    accepted: true,
    intendedShift,
    uniformShiftSurvivors,
    wholeNumberDeltaSurvives: false,
    reversedUniformShiftSurvivors,
    arbitraryDigitMapConsistent,
    canonicalWinner: `UNIFORM_MODULAR_DIGIT_TRANSLATION:{"shift":${intendedShift}}`,
  };
}

export function solveUniformDigitPrompt(prompt: UniformDigitStructuredPrompt): string {
  const shifts = inferUniformShiftSurvivors(prompt.evidence).filter((shift) => shift !== 0);
  if (shifts.length !== 1) throw new Error(`Expected one non-zero shift, received ${shifts.join(",") || "none"}`);
  const shift = shifts[0]!;

  if (prompt.taskKind === "DECODE_TARGET") {
    return inverseTranslateDigitSequence(prompt.targetCode, shift);
  }
  if (prompt.taskKind === "RECOVER_MISSING_TOKEN") {
    if (prompt.missingIndex === undefined) throw new Error("Missing-token prompt has no missing index");
    return translateDigitSequence(prompt.targetSource, shift)[prompt.missingIndex]!;
  }
  return translateDigitSequence(prompt.targetSource, shift);
}

export function independentTranslateByArithmetic(source: string, shift: number): string {
  if (!/^\d+$/u.test(source)) throw new Error("Independent verifier accepts decimal digit strings only");
  let output = "";
  for (const character of source) {
    const numeric = character.charCodeAt(0) - 48;
    const translated = (numeric + shift + 100) % 10;
    output += String.fromCharCode(48 + translated);
  }
  return output;
}

export function verifyUniformDigitAnswer(
  prompt: UniformDigitStructuredPrompt,
  answer: string,
  shift: number,
): boolean {
  if (prompt.taskKind === "DECODE_TARGET") {
    return independentTranslateByArithmetic(prompt.targetCode, -shift) === answer;
  }
  const fullCode = independentTranslateByArithmetic(prompt.targetSource, shift);
  if (prompt.taskKind === "RECOVER_MISSING_TOKEN") {
    return prompt.missingIndex !== undefined && fullCode[prompt.missingIndex] === answer;
  }
  return fullCode === answer;
}
