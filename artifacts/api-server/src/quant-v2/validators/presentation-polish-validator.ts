import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import { createProblemSignature } from "../utils/problem-signature";
import type { ValidationResult } from "./problem-validator";

export interface PresentationPolishMetrics {
  labelNaturalnessScore: number;
  narrationCompressionScore: number;
  domainDiversityScore: number;
  transitionVariationScore: number;
  signatureSemanticSafetyScore: number;
  editorialCompactnessScore: number;
}

const WEAK_LABEL_PATTERN =
  /^(?:Filtered total|Remaining share|Result|Required value)\s*=/mu;
const ROBOTIC_SHORTCUT_PATTERN =
  /\b(?:This directly gives|This gives|This means)\b/iu;
const NEGATIVE_SIGNATURE_PATTERN = /(?:^|[|_])-\d|ans=-/u;
const GENERIC_SCENARIO = "general_percentage";
const WORD_PATTERN = /\b[A-Za-z][A-Za-z-]*\b/gu;
const FINAL_TRANSITION_PATTERN = /^(Hence|Therefore|Thus|So|Accordingly)\b/iu;

function score(hit: boolean, penalty = 35) {
  return hit ? Math.max(0, 100 - penalty) : 100;
}

function wordCount(text: string) {
  return [...text.matchAll(WORD_PATTERN)].length;
}

function finalLine(realization: EditorialRealization) {
  return realization.explanation.split("\n").at(-1)?.trim() ?? "";
}

export function createPresentationPolishMetrics(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
): PresentationPolishMetrics {
  const explanation = realization.explanation;
  const weakLabel = WEAK_LABEL_PATTERN.test(explanation);
  const roboticShortcut = ROBOTIC_SHORTCUT_PATTERN.test(explanation);
  const genericScenario = realization.scenario.family === GENERIC_SCENARIO;
  const signatureLeak = NEGATIVE_SIGNATURE_PATTERN.test(
    createProblemSignature(problem),
  );
  const words = wordCount(explanation);
  const compactnessIssue = words < 6 || words > 180;
  const transitionIssue =
    finalLine(realization).startsWith("Therefore, the required answer") ||
    !FINAL_TRANSITION_PATTERN.test(finalLine(realization)) &&
      !/^(?:Total|Maximum|Final|Required|Reduction|Profit|Loss|Pure)/u.test(
        finalLine(realization),
      );

  return {
    labelNaturalnessScore: score(weakLabel),
    narrationCompressionScore: score(roboticShortcut, 45),
    domainDiversityScore: score(genericScenario, 45),
    transitionVariationScore: score(transitionIssue, 25),
    signatureSemanticSafetyScore: score(signatureLeak, 55),
    editorialCompactnessScore: score(compactnessIssue, 30),
  };
}

export function validatePresentationPolish(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
): ValidationResult {
  const issues: string[] = [];
  const metrics = createPresentationPolishMetrics(problem, realization);
  const signature = createProblemSignature(problem);

  if (WEAK_LABEL_PATTERN.test(realization.explanation)) {
    issues.push("Explanation contains weak systemic labels.");
  }
  if (ROBOTIC_SHORTCUT_PATTERN.test(realization.explanation)) {
    issues.push("Shortcut narration is robotic.");
  }
  if (realization.scenario.family === GENERIC_SCENARIO) {
    issues.push("Scenario uses generic percentage fallback.");
  }
  if (NEGATIVE_SIGNATURE_PATTERN.test(signature)) {
    issues.push("Signature contains negative sign leakage.");
  }
  if (Math.min(...Object.values(metrics)) < 75) {
    issues.push("Presentation polish score is too low.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validatePresentationPolishBatch(
  realizations: readonly EditorialRealization[],
): ValidationResult {
  const issues: string[] = [];
  const scenarioCounts = new Map<string, number>();
  const finalTransitions = new Map<string, number>();

  for (const realization of realizations) {
    scenarioCounts.set(
      realization.scenario.family,
      (scenarioCounts.get(realization.scenario.family) ?? 0) + 1,
    );
    const transition = finalLine(realization).split(/[,\s=]/u)[0] ?? "";
    finalTransitions.set(
      transition,
      (finalTransitions.get(transition) ?? 0) + 1,
    );
  }

  const genericCount = scenarioCounts.get(GENERIC_SCENARIO) ?? 0;
  if (genericCount / Math.max(1, realizations.length) > 0.03) {
    issues.push("Generic scenario frequency is too high.");
  }
  if (scenarioCounts.size < Math.min(12, realizations.length)) {
    issues.push("Institutional domain diversity is too narrow.");
  }

  const largestTransition = Math.max(0, ...finalTransitions.values());
  if (largestTransition / Math.max(1, realizations.length) > 0.45) {
    issues.push("Final transition usage is too concentrated.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
