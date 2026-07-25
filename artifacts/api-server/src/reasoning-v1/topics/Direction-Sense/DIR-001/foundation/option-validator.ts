import type { DirectionOption, OptionValidationResult } from "./types";

function defaultNormalize(value: unknown): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : `NON_FINITE:${value}`;
  }
  if (typeof value === "string") {
    return value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
  }
  return JSON.stringify(value, Object.keys((value ?? {}) as Record<string, unknown>).sort());
}

export function validateDirectionOptions<T>(
  options: readonly DirectionOption<T>[],
  satisfies: (value: T) => boolean,
  normalize: (value: T) => string = defaultNormalize,
): OptionValidationResult {
  const errors: string[] = [];

  if (options.length !== 4) {
    errors.push(`Expected exactly four options, received ${options.length}`);
  }

  const normalized = options.map((option) => normalize(option.value));
  if (new Set(normalized).size !== normalized.length) {
    errors.push("Rendered option values are not unique");
  }

  const satisfyingOptionIndexes = options
    .map((option, index) => (satisfies(option.value) ? index : -1))
    .filter((index) => index >= 0);

  if (satisfyingOptionIndexes.length !== 1) {
    errors.push(`Expected exactly one satisfying option, received ${satisfyingOptionIndexes.length}`);
  }

  options.forEach((option, index) => {
    const isCorrect = satisfyingOptionIndexes.includes(index);
    if (isCorrect && option.errorLabel !== null) {
      errors.push(`Correct option at index ${index} must have a null error label`);
    }
    if (!isCorrect && !option.errorLabel?.trim()) {
      errors.push(`Distractor at index ${index} must carry an error label`);
    }
  });

  return {
    valid: errors.length === 0,
    satisfyingOptionIndexes,
    errors,
  };
}
