import type { DirectMap } from "../foundation/mapping";
import type { DirectMappingPrompt, ExplanationTrace } from "../foundation/types";
import { splitCode } from "../foundation/code-values";

const RULE_OPENINGS = [
  "Each letter keeps one fixed code wherever it appears.",
  "Treat the examples as a one-to-one substitution: the same source letter always gives the same code.",
  "The coding is position-independent; every source letter has a fixed substitute.",
  "Read the examples letter by letter and preserve each substitution throughout.",
] as const;

const CONCLUSION_OPENINGS = [
  "Therefore, the required answer is",
  "So the required result is",
  "This gives the answer",
  "Hence the matching option is",
] as const;

function repeatedLetterNote(source: string, mapping: DirectMap): string | null {
  const repeated = [...new Set([...source].filter((letter, index, letters) => letters.indexOf(letter) !== index))];
  if (repeated.length === 0) return null;
  return repeated.map((letter) => `the repeated ${letter} remains ${mapping[letter]} each time`).join("; ");
}

export function buildCodCp001Explanation(
  prompt: DirectMappingPrompt,
  mapping: DirectMap,
  answer: string,
  styleIndex: number,
): ExplanationTrace {
  const sourceDemonstration = prompt.evidence.map((pair) => {
    const repetition = repeatedLetterNote(pair.source, mapping);
    return repetition
      ? `${pair.source} → ${pair.code}; ${repetition}.`
      : `${pair.source} → ${pair.code} confirms the substitutions used for its letters.`;
  });

  let targetApplication: string[];
  if (prompt.taskKind === "DECODE_TARGET") {
    const tokens = splitCode(prompt.encodedTarget!, prompt.separator);
    const steps = tokens.map((token, index) => `${token}→${answer[index]}`).join(", ");
    targetApplication = [`Decoding the required cluster position by position gives ${steps}.`];
  } else if (prompt.taskKind === "RECOVER_MISSING_CODE") {
    targetApplication = [`The displayed examples fix ${prompt.missingSource} as ${answer}, so the blank must contain ${answer}.`];
  } else {
    const tokens = splitCode(answer, prompt.separator);
    const steps = [...prompt.target].map((letter, index) => `${letter}→${tokens[index]}`).join(", ");
    targetApplication = [`Applying the same map to ${prompt.target} gives ${steps}.`];
  }

  return {
    ruleStatement: RULE_OPENINGS[styleIndex % RULE_OPENINGS.length]!,
    sourceDemonstration,
    targetApplication,
    conclusion: `${CONCLUSION_OPENINGS[(styleIndex + 1) % CONCLUSION_OPENINGS.length]} ${answer}.`,
    closestTrapRejection: "A position shift or reordered code would contradict the fixed substitutions visible in the examples.",
  };
}
