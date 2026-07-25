import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";
import { alphabetRankZero, oppositeLetter, shiftLetter, wordUsesWrap } from "./alphabet";
import type { AlphabetTransformPrompt, CodCp003RuleContext, CodCp003RuleId } from "./types";

function describeRule(ruleId: CodCp003RuleId, context: CodCp003RuleContext): string {
  if (ruleId === "OPPOSITE_ALPHABET_MAP") {
    return "Replace every letter by its opposite letter in the alphabet: A↔Z, B↔Y, C↔X, and so on.";
  }
  const shift = context.shift ?? 0;
  return shift > 0
    ? `Move every letter ${shift} place${shift === 1 ? "" : "s"} forward in the alphabet; continue from A after Z.`
    : `Move every letter ${Math.abs(shift)} place${shift === -1 ? "" : "s"} backward in the alphabet; continue from Z before A.`;
}

function evidenceWorking(ruleId: CodCp003RuleId, context: CodCp003RuleContext, source: string, code: string): string {
  const steps = [...source].map((letter, index) => `${letter}→${code[index]}`).join(", ");
  if (ruleId === "OPPOSITE_ALPHABET_MAP") return `${source} → ${code}: ${steps}. Each pair consists of opposite alphabet letters.`;
  return `${source} → ${code}: ${steps}${wordUsesWrap(source, context.shift ?? 0) ? "; the alphabet wraps at A/Z" : ""}.`;
}

function targetWorking(ruleId: CodCp003RuleId, context: CodCp003RuleContext, target: string, code: string): string {
  const steps = [...target].map((letter) => {
    const transformed = ruleId === "OPPOSITE_ALPHABET_MAP" ? oppositeLetter(letter) : shiftLetter(letter, context.shift ?? 0);
    const rankNote = ruleId === "UNIFORM_CYCLIC_SHIFT" && (alphabetRankZero(letter) + (context.shift ?? 0) < 0 || alphabetRankZero(letter) + (context.shift ?? 0) > 25)
      ? " (wrap)"
      : "";
    return `${letter}→${transformed}${rankNote}`;
  }).join(", ");
  return `${target}: ${steps}, giving ${code}.`;
}

function decodeWorking(ruleId: CodCp003RuleId, context: CodCp003RuleContext, encoded: string, answer: string): string {
  const steps = [...encoded].map((letter, index) => `${letter}→${answer[index]}`).join(", ");
  if (ruleId === "OPPOSITE_ALPHABET_MAP") return `The opposite-letter rule is its own reverse: ${steps}.`;
  const shift = context.shift ?? 0;
  return `Undo the ${shift > 0 ? "forward" : "backward"} shift by moving ${Math.abs(shift)} place${Math.abs(shift) === 1 ? "" : "s"} in the other direction: ${steps}.`;
}

function trapRejection(options: readonly GeneratedOption[]): string | undefined {
  const trap = selectedDistractor(options);
  if (!trap?.errorLabel) return undefined;
  const value = trap.value;
  switch (trap.errorLabel) {
    case "WRONG_DIRECTION": return `${value} moves the letters in the opposite direction from the one shown in the examples.`;
    case "OFF_BY_ONE_SHIFT": return `${value} moves every letter one place too far.`;
    case "OPPOSITE_ALPHABET_TRAP": return `${value} uses opposite alphabet letters instead of the fixed shift shown in the examples.`;
    case "FORWARD_SHIFT_TRAP": return `${value} uses a forward shift, but the examples pair each letter with its opposite.`;
    case "BACKWARD_SHIFT_TRAP": return `${value} uses a backward shift, but the examples use opposite alphabet partners.`;
    case "REVERSED_OPPOSITE_TRAP": return `${value} first reverses the word; the opposite-letter rule does not change letter order.`;
    case "WRONG_TARGET_POSITION":
    case "POSITION_SWAP": return `${value} changes the order of two coded letters, although each output remains in the same position as its source letter.`;
    case "REVERSED_DECODE": return `${value} reverses the decoded word, which is not part of the rule.`;
    case "OFF_BY_ONE_INVERSE": return `${value} reverses the rule with a one-place error.`;
    case "NEIGHBOUR_LETTER_PLUS":
    case "NEIGHBOUR_LETTER_MINUS": return `${value} is next to the required letter in the alphabet but does not complete the exact shift.`;
    default: return `${value} does not reproduce the same letter relationship shown in all the examples.`;
  }
}

export function buildCodCp003Explanation(input: {
  prompt: AlphabetTransformPrompt;
  ruleId: CodCp003RuleId;
  context: CodCp003RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
  options: readonly GeneratedOption[];
}): ExplanationTrace {
  const evidenceLimit = ["INFER_AND_ENCODE", "CHOOSE_MATCHING_CODE"].includes(input.prompt.taskKind) ? 2 : 1;
  const sourceDemonstration = input.prompt.evidence
    .slice(0, evidenceLimit)
    .map((pair) => evidenceWorking(input.ruleId, input.context, pair.source, pair.code));

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.ruleId, input.context, input.prompt.encodedTarget!, input.answer), `Therefore, ${input.prompt.encodedTarget} represents ${input.answer}.`];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_LETTER") {
    targetApplication = [
      targetWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode),
      `${input.prompt.targetWord} is shown as ${input.prompt.displayedTargetCode}; therefore ‘?’ is ${input.answer}.`,
    ];
  } else {
    targetApplication = [targetWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)];
  }

  const openings = [
    "The common coding rule is:",
    "The letter relation is:",
    "All the examples use this rule:",
    "Comparing corresponding letters gives this rule:",
  ] as const;

  return {
    ruleStatement: `${openings[input.styleIndex % openings.length]} ${describeRule(input.ruleId, input.context)}`,
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(input.answer, input.styleIndex),
    closestTrapRejection: trapRejection(input.options),
  };
}
