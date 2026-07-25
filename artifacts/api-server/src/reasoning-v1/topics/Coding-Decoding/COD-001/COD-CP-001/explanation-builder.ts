import type { DirectMap } from "../foundation/mapping";
import type { DirectMappingPrompt, ExplanationTrace } from "../foundation/types";
import { splitCode } from "../foundation/code-values";

export function buildCodCp001Explanation(prompt: DirectMappingPrompt, mapping: DirectMap, answer: string): ExplanationTrace {
  const pairs = Object.entries(mapping).sort(([left], [right]) => left.localeCompare(right));
  const sourceDemonstration = pairs.map(([source, code]) => `${source} is consistently represented by ${code}.`);
  let targetApplication: string[];
  if (prompt.taskKind === "DECODE_TARGET") {
    const tokens = splitCode(prompt.encodedTarget!, prompt.separator);
    targetApplication = tokens.map((token, index) => `${token} decodes to ${answer[index]}.`);
  } else if (prompt.taskKind === "RECOVER_MISSING_CODE") {
    targetApplication = [`The same substitution gives ${prompt.missingSource} → ${answer}.`];
  } else {
    const tokens = splitCode(answer, prompt.separator);
    targetApplication = [...prompt.target].map((letter, index) => `${letter} → ${tokens[index]}.`);
  }
  return {
    ruleStatement: "Use one fixed substitution for every occurrence of the same source letter.",
    sourceDemonstration,
    targetApplication,
    conclusion: `Therefore, the required answer is ${answer}.`,
    closestTrapRejection: "Do not shift letters by position or change a repeated letter's code; the displayed evidence fixes each substitution directly.",
  };
}
