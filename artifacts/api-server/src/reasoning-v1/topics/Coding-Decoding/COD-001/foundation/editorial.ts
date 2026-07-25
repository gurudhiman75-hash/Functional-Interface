import type { GeneratedOption } from "./types";

export interface CodeExample {
  source: string;
  code: string;
}

export function joinCodeExamples(examples: readonly CodeExample[]): string {
  const rendered = examples.map((example) => `‘${example.source}’ is coded as ‘${example.code}’`);
  if (rendered.length === 0) throw new Error("At least one code example is required");
  if (rendered.length === 1) return rendered[0]!;
  if (rendered.length === 2) return `${rendered[0]} and ${rendered[1]}`;
  return `${rendered.slice(0, -1).join(", ")}, and ${rendered.at(-1)}`;
}

export function maskCodeAt(code: string, index: number, separator = ""): string {
  const tokens = separator ? code.split(separator) : [...code];
  if (!Number.isInteger(index) || index < 0 || index >= tokens.length) {
    throw new Error(`Cannot mask position ${index} in code '${code}'`);
  }
  tokens[index] = "?";
  return separator ? tokens.join(separator) : tokens.join("");
}

export function selectedDistractor(options: readonly GeneratedOption[]): GeneratedOption | undefined {
  return options.find((option) => !option.isCorrect && option.errorLabel);
}

export function conclusionFor(answer: string, styleIndex: number): string {
  const openings = [
    "Therefore, the correct answer is",
    "Hence, the required code is",
    "So, the answer is",
    "Thus, the matching option is",
  ] as const;
  return `${openings[styleIndex % openings.length]} ${answer}.`;
}
