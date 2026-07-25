import type { ExplanationTrace } from "../foundation/types";
import { alphabetRankZero, oppositeLetter, shiftLetter, wordUsesWrap } from "./alphabet";
import type { AlphabetTransformPrompt, CodCp003RuleContext, CodCp003RuleId } from "./types";

const OPENINGS = [
  "Apply one unchanged alphabet transformation to every character.",
  "The displayed words follow the same character-by-character rule.",
  "Read each pair position by position; the movement does not change within a word.",
  "Use the common alphabet relation shown by all examples.",
] as const;

function describeRule(ruleId: CodCp003RuleId, context: CodCp003RuleContext): string {
  if (ruleId === "OPPOSITE_ALPHABET_MAP") {
    return "Replace each letter by its opposite partner, so A↔Z, B↔Y, C↔X, and so on.";
  }
  const shift = context.shift ?? 0;
  return shift > 0
    ? `Move every letter ${shift} place${shift === 1 ? "" : "s"} forward, wrapping after Z.`
    : `Move every letter ${Math.abs(shift)} place${shift === -1 ? "" : "s"} backward, wrapping before A.`;
}

function correspondence(ruleId: CodCp003RuleId, context: CodCp003RuleContext, source: string, code: string): string {
  const steps = [...source].map((letter, index) => `${letter}→${code[index]}`).join(", ");
  if (ruleId === "OPPOSITE_ALPHABET_MAP") return `${source} → ${code}: ${steps}, using opposite alphabet partners.`;
  const wrapped = wordUsesWrap(source, context.shift ?? 0);
  return `${source} → ${code}: ${steps}${wrapped ? "; cyclic wrapping is used" : ""}.`;
}

function targetWorking(ruleId: CodCp003RuleId, context: CodCp003RuleContext, target: string, code: string): string {
  const steps = [...target].map((letter, index) => {
    const transformed = ruleId === "OPPOSITE_ALPHABET_MAP" ? oppositeLetter(letter) : shiftLetter(letter, context.shift ?? 0);
    const rankNote = ruleId === "UNIFORM_CYCLIC_SHIFT" && (alphabetRankZero(letter) + (context.shift ?? 0) < 0 || alphabetRankZero(letter) + (context.shift ?? 0) > 25)
      ? " (wrap)"
      : "";
    return `${letter}→${transformed}${rankNote}`;
  }).join(", ");
  return `${target} becomes ${code}: ${steps}.`;
}

export function buildCodCp003Explanation(input: {
  prompt: AlphabetTransformPrompt;
  ruleId: CodCp003RuleId;
  context: CodCp003RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
}): ExplanationTrace {
  const sourceDemonstration = input.prompt.evidence.map((pair) => correspondence(input.ruleId, input.context, pair.source, pair.code));
  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [`Reverse the inferred rule on ${input.prompt.encodedTarget}; this restores ${input.answer}.`];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_LETTER") {
    targetApplication = [targetWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode), `The concealed position therefore contains ${input.answer}.`];
  } else {
    targetApplication = [targetWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)];
  }
  return {
    ruleStatement: `${OPENINGS[input.styleIndex % OPENINGS.length]} ${describeRule(input.ruleId, input.context)}`,
    sourceDemonstration,
    targetApplication,
    conclusion: `Therefore, the required answer is ${input.answer}.`,
    closestTrapRejection: "Changing direction, moving one extra place, skipping cyclic wrap, or using opposite letters would contradict the displayed correspondences.",
  };
}
