import type { AnalogyAnswer, AnalogyOption, OptionValidationResult } from "./types";

function stableValue(value: AnalogyAnswer): string {
  return Array.isArray(value) ? JSON.stringify([...value]) : JSON.stringify(value);
}

export function validateOptions<T extends AnalogyAnswer>(
  options: readonly AnalogyOption<T>[],
  satisfiesRelation: (value: T) => boolean,
): OptionValidationResult {
  const errors: string[] = [];
  if (options.length !== 4) errors.push(`Expected 4 options, found ${options.length}.`);

  const serialized = options.map((option) => stableValue(option.value));
  if (new Set(serialized).size !== serialized.length) errors.push("Options contain duplicate values.");

  const satisfyingOptionIndexes = options
    .map((option, index) => (satisfiesRelation(option.value) ? index : -1))
    .filter((index) => index >= 0);

  if (satisfyingOptionIndexes.length !== 1) {
    errors.push(`Expected exactly one satisfying option, found ${satisfyingOptionIndexes.length}.`);
  }

  options.forEach((option, index) => {
    if (!satisfyingOptionIndexes.includes(index) && !option.errorLabel) {
      errors.push(`Distractor at index ${index} is missing an error label.`);
    }
  });

  return { valid: errors.length === 0, satisfyingOptionIndexes, errors };
}

export function assertValidOptions<T extends AnalogyAnswer>(
  options: readonly AnalogyOption<T>[],
  satisfiesRelation: (value: T) => boolean,
): number {
  const result = validateOptions(options, satisfiesRelation);
  if (!result.valid) throw new Error(result.errors.join(" "));
  return result.satisfyingOptionIndexes[0];
}
