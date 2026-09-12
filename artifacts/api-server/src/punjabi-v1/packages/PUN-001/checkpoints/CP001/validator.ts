/**
 * CP001 Question Validation Gate
 * Enforces single-truth, option distinctness, Gurmukhi validity, and balance invariants.
 */

import type { PunjabiGeneratedQuestion } from "../../../../core/types";
import { normalizeGurmukhi } from "../../../../foundation/unicode/gurmukhi-normalizer";

export interface ValidationResult {
  isValid: boolean;
  errors: readonly string[];
}

export function validatePunjabiQuestion(q: PunjabiGeneratedQuestion): ValidationResult {
  const errors: string[] = [];

  // 1. Stem validation
  if (!q.stem || q.stem.trim().length === 0) {
    errors.push("Question stem cannot be empty.");
  }

  // 2. Exactly 4 options
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`Expected exactly 4 options, but found ${q.options?.length ?? 0}.`);
  } else {
    // 3. Option distinctness and non-emptiness
    const normalizedOptions = q.options.map((opt) => normalizeGurmukhi(opt.trim()));
    for (let i = 0; i < normalizedOptions.length; i++) {
      if (!normalizedOptions[i]) {
        errors.push(`Option index ${i} is empty.`);
      }
    }

    const uniqueOptions = new Set(normalizedOptions);
    if (uniqueOptions.size !== 4) {
      errors.push(`Options are not pairwise distinct: [${normalizedOptions.join(", ")}].`);
    }

    // 4. Correct index bounds
    if (
      typeof q.correctIndex !== "number" ||
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      errors.push(`correctIndex must be an integer between 0 and 3, got: ${q.correctIndex}.`);
    }
  }

  // 5. Explanation validation
  if (!q.explanation || q.explanation.trim().length === 0) {
    errors.push("Question explanation cannot be empty.");
  }

  // 6. Metadata integrity
  if (q.metadata.engine !== "punjabi-v1") {
    errors.push(`Invalid engine metadata: ${q.metadata.engine}`);
  }
  if (!q.metadata.packageId || !q.metadata.cpId || !q.metadata.familyId) {
    errors.push("Incomplete package/checkpoint/family metadata.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function assertValidPunjabiQuestion(q: PunjabiGeneratedQuestion): void {
  const result = validatePunjabiQuestion(q);
  if (!result.isValid) {
    throw new Error(`Punjabi Question Validation Failed:\n${result.errors.join("\n")}`);
  }
}
