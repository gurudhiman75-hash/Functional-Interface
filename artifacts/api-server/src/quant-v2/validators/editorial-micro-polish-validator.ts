import type { EditorialRealization } from "../editorial/editorial-types";
import type { ValidationResult } from "./problem-validator";

export interface EditorialMicroPolishMetrics {
  transitionCollisionScore: number;
  semanticRealismScore: number;
  signRealizationScore: number;
  shortcutReadabilityScore: number;
  editorialPolishScore: number;
}

const TRANSITION_COLLISION_PATTERN =
  /\b(?:So|Hence|Therefore|Thus|Now),\s+(?:so|hence|therefore|thus|now)\b/iu;
const TRANSITION_LABEL_COLLISION_PATTERN =
  /\b(?:So|Hence|Therefore|Thus|Now),\s+(?:Difference in shares|For the same expenditure|So the full value is|Total value is|Required percentage is|100% value is):/u;
const SYNTHETIC_LABELS = [
  "The required base is:",
  "The unchanged part is:",
  "The given value represents this share.",
  "Change factor =",
  "On the changed value:",
  "Use this percentage change.",
  "Use the updated base here.",
] as const;
const AWKWARD_STEM_PATTERN =
  /\b(?:For a fuel item|For a measured quantity|For a product)\b/iu;
const COMPUTATIONAL_SIGN_PATTERN =
  /(?:Loss percentage|Required reduction)\s*=\s*[\s\S]*?=\s*-\d/u;
const NEGATIVE_FINAL_PATTERN = /required answer is -\d/iu;
const BARE_SHORTCUT_PATTERN = /Shortcut:\n\s*\d+(?:\.\d+)?%\s*=\s*\d/iu;

function hasSyntheticLabel(text: string) {
  return SYNTHETIC_LABELS.some((label) => text.includes(label));
}

function score(hit: boolean, penalty = 40) {
  return hit ? Math.max(0, 100 - penalty) : 100;
}

export function createEditorialMicroPolishMetrics(
  realization: EditorialRealization,
): EditorialMicroPolishMetrics {
  const text = `${realization.stem}\n${realization.explanation}`;
  const transitionCollision =
    TRANSITION_COLLISION_PATTERN.test(text) ||
    TRANSITION_LABEL_COLLISION_PATTERN.test(text);
  const semanticIssue =
    hasSyntheticLabel(text) || AWKWARD_STEM_PATTERN.test(realization.stem);
  const signIssue =
    COMPUTATIONAL_SIGN_PATTERN.test(realization.explanation) ||
    NEGATIVE_FINAL_PATTERN.test(realization.explanation);
  const shortcutIssue = BARE_SHORTCUT_PATTERN.test(realization.explanation);

  const transitionCollisionScore = score(transitionCollision);
  const semanticRealismScore = score(semanticIssue);
  const signRealizationScore = score(signIssue);
  const shortcutReadabilityScore = score(shortcutIssue);
  const editorialPolishScore = Math.round(
    (
      transitionCollisionScore +
      semanticRealismScore +
      signRealizationScore +
      shortcutReadabilityScore
    ) / 4,
  );

  return {
    transitionCollisionScore,
    semanticRealismScore,
    signRealizationScore,
    shortcutReadabilityScore,
    editorialPolishScore,
  };
}

export function validateEditorialMicroPolish(
  realization: EditorialRealization,
): ValidationResult {
  const issues: string[] = [];
  const text = `${realization.stem}\n${realization.explanation}`;
  const metrics = createEditorialMicroPolishMetrics(realization);

  if (TRANSITION_COLLISION_PATTERN.test(text)) {
    issues.push("Transition phrases are stacked.");
  }
  if (TRANSITION_LABEL_COLLISION_PATTERN.test(text)) {
    issues.push("Transition phrase collides with a semantic lead-in.");
  }
  for (const label of SYNTHETIC_LABELS) {
    if (text.includes(label)) {
      issues.push(`Synthetic semantic label found: ${label}`);
    }
  }
  if (AWKWARD_STEM_PATTERN.test(realization.stem)) {
    issues.push("Stem contains awkward generic opening.");
  }
  if (COMPUTATIONAL_SIGN_PATTERN.test(realization.explanation)) {
    issues.push("Negative percentage is shown computationally.");
  }
  if (NEGATIVE_FINAL_PATTERN.test(realization.explanation)) {
    issues.push("Final answer leaks a negative sign instead of semantic sign.");
  }
  if (BARE_SHORTCUT_PATTERN.test(realization.explanation)) {
    issues.push("Shortcut percentage relation is too bare.");
  }
  if (metrics.editorialPolishScore < 90) {
    issues.push(`Editorial polish score is too low: ${metrics.editorialPolishScore}.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
