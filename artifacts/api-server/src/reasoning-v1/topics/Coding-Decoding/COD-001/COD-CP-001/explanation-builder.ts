import type { DirectMap } from "../foundation/mapping";
import type { DirectMappingPrompt, ExplanationTrace, GeneratedOption } from "../foundation/types";
import { splitCode } from "../foundation/code-values";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";

function exactRuleStatement(prompt: DirectMappingPrompt): string {
  const example = prompt.evidence[0]!;
  const tokens = splitCode(example.code, prompt.separator);
  const steps = [...example.source].map((letter, index) => `${letter}→${tokens[index]}`).join(", ");
  const codeKind = prompt.outputKind === "DIGIT" ? "number" : prompt.outputKind === "SYMBOL" ? "symbol" : "letter";
  return `In ${example.source} → ${example.code}, the substitutions are ${steps}. Therefore, each source letter keeps that exact ${codeKind} value wherever it appears.`;
}

function evidenceWorking(prompt: DirectMappingPrompt, mapping: DirectMap, source: string, code: string): string {
  const tokens = splitCode(code, prompt.separator);
  const steps = [...source].map((letter, index) => `${letter}→${tokens[index]}`).join(", ");
  const repeated = [...new Set([...source].filter((letter, index, letters) => letters.indexOf(letter) !== index))];
  const repetitionNote = repeated.length > 0
    ? ` The repeated ${repeated.join(" and ")} keep${repeated.length === 1 ? "s" : ""} the same code each time.`
    : "";
  return `${source} → ${code} confirms ${steps}.${repetitionNote}`;
}

function trapRejection(options: readonly GeneratedOption[]): string | undefined {
  const trap = selectedDistractor(options);
  if (!trap?.errorLabel) return undefined;
  switch (trap.errorLabel) {
    case "POSITION_SWAP":
      return `${trap.value} uses the right substitutions in the wrong positions; the code must follow the letter order of the word.`;
    case "REVERSE_ORDER":
      return `${trap.value} reverses the code, but the examples do not reverse the order of letters.`;
    case "OFF_BY_ONE_TOKEN":
    case "LAST_TOKEN_SLIP":
      return `${trap.value} changes one established substitution. A letter cannot take a new code after its value has been fixed by the examples.`;
    case "DECODE_POSITION_ERROR":
      return `${trap.value} rearranges or changes the decoded letters. Each code token must be read in its original position.`;
    case "NEIGHBOUR_MAPPING_TRAP":
      return `${trap.value} belongs to a different table entry; the examples fix only one code for the missing letter.`;
    default:
      return `${trap.value} does not preserve the same letter-by-letter mapping shown in the examples.`;
  }
}

export function buildCodCp001Explanation(
  prompt: DirectMappingPrompt,
  mapping: DirectMap,
  answer: string,
  styleIndex: number,
  options: readonly GeneratedOption[],
): ExplanationTrace {
  const evidenceStart = prompt.evidence.length > 1 ? 1 : 0;
  const sourceDemonstration = prompt.evidence
    .slice(evidenceStart, evidenceStart + 1)
    .map((pair) => evidenceWorking(prompt, mapping, pair.source, pair.code));

  let targetApplication: string[];
  if (prompt.taskKind === "DECODE_TARGET") {
    const tokens = splitCode(prompt.encodedTarget!, prompt.separator);
    const steps = tokens.map((token, index) => `${token}→${answer[index]}`).join(", ");
    targetApplication = [`Reading ${prompt.encodedTarget} in the same order gives ${steps}.`];
  } else if (prompt.taskKind === "RECOVER_MISSING_CODE") {
    targetApplication = [`The examples show that ${prompt.missingSource} is always coded as ${answer}; therefore the blank table entry is ${answer}.`];
  } else {
    const tokens = splitCode(answer, prompt.separator);
    const steps = [...prompt.target].map((letter, index) => `${letter}→${tokens[index]}`).join(", ");
    targetApplication = [`For ${prompt.target}, the substitutions are ${steps}, giving ${answer}.`];
  }

  return {
    ruleStatement: exactRuleStatement(prompt),
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(answer, styleIndex),
    closestTrapRejection: trapRejection(options),
  };
}
