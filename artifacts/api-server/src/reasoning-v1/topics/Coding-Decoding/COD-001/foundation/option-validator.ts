import type { GeneratedOption } from "./types";

export function validateOptions(options: readonly GeneratedOption[]): void {
  if (options.length !== 4) throw new Error(`Expected 4 options, received ${options.length}`);
  const values = options.map((option) => option.value);
  if (new Set(values).size !== 4) throw new Error("Options must be unique");
  const correctCount = options.filter((option) => option.isCorrect).length;
  if (correctCount !== 1) throw new Error(`Expected exactly one correct option, received ${correctCount}`);
}
