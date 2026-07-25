function pick<T>(items: readonly T[], style: number): T {
  return items[((style % items.length) + items.length) % items.length]!;
}

function lead(examples: string): string {
  return `In a certain code language, ${examples}.`;
}

export function buildStandardEncodeStem(examples: string, target: string, style: number): string {
  const prefix = lead(examples);
  return pick([
    `${prefix} How will ‘${target}’ be coded?`,
    `${prefix} What is the code for ‘${target}’?`,
    `${prefix} Which of the following is the correct code for ‘${target}’?`,
    `${prefix} ‘${target}’ will be coded as which of the following?`,
  ], style);
}

export function buildStandardDecodeStem(examples: string, encodedTarget: string, style: number): string {
  const prefix = lead(examples);
  return pick([
    `${prefix} Which word is coded as ‘${encodedTarget}’?`,
    `${prefix} ‘${encodedTarget}’ is the code for which word?`,
    `${prefix} What is the original word for the code ‘${encodedTarget}’?`,
    `${prefix} Which of the following words is represented by ‘${encodedTarget}’?`,
  ], style);
}

export function buildStandardMissingTokenStem(
  examples: string,
  target: string,
  displayedCode: string,
  token: "letter" | "number",
  style: number,
): string {
  const prefix = lead(examples);
  return pick([
    `${prefix} If ‘${target}’ is coded as ‘${displayedCode}’, what will replace ‘?’?`,
    `${prefix} The code for ‘${target}’ is ‘${displayedCode}’. Which ${token} replaces ‘?’?`,
    `${prefix} Find the missing ${token} in the code ‘${displayedCode}’ for ‘${target}’.`,
    `${prefix} What should replace ‘?’ in ‘${displayedCode}’, the code for ‘${target}’?`,
  ], style);
}

export function buildStandardLetterCodeStem(examples: string, sourceLetter: string, style: number): string {
  const prefix = lead(examples);
  return pick([
    `${prefix} What is the code for the letter ‘${sourceLetter}’?`,
    `${prefix} Which code represents the letter ‘${sourceLetter}’?`,
    `${prefix} The letter ‘${sourceLetter}’ is represented by which code?`,
    `${prefix} Which of the following is the code for the letter ‘${sourceLetter}’?`,
  ], style);
}
