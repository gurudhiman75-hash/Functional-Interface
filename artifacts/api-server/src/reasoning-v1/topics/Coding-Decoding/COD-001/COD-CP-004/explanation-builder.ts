import type { ExplanationTrace } from "../foundation/types";
import { shiftLetter } from "../COD-CP-003/alphabet";
import { isVowel, shiftAtPosition, wordUsesPositionWrap } from "./transform";
import type { CodCp004RuleContext, CodCp004RuleId, PositionTransformPrompt } from "./types";

const OPENINGS = [
  "The movement changes according to position or letter class.",
  "Do not apply one uniform shift; follow the branch used at each character.",
  "Read the transformation position by position.",
  "The same structured shift pattern is repeated for every word.",
] as const;

function describeRule(ruleId: CodCp004RuleId, context: CodCp004RuleContext): string {
  switch (ruleId) {
    case "INCREMENTAL_FORWARD_SHIFT":
      return `Starting with +${context.baseShift}, increase the forward shift by 1 at each next position.`;
    case "INCREMENTAL_BACKWARD_SHIFT":
      return `Starting with −${context.baseShift}, increase the backward movement by 1 at each next position.`;
    case "ALTERNATING_SIGNED_SHIFT":
      return `Move the first position ${(context.firstDirection ?? 1) > 0 ? "forward" : "backward"} by ${context.magnitude}, then alternate direction with the same magnitude.`;
    case "ODD_EVEN_POSITION_SHIFT":
      return `Use ${context.oddShift! > 0 ? "+" : ""}${context.oddShift} at odd positions and ${context.evenShift! > 0 ? "+" : ""}${context.evenShift} at even positions.`;
    case "VOWEL_CONSONANT_CLASS_SHIFT":
      return `Move vowels by ${context.vowelShift! > 0 ? "+" : ""}${context.vowelShift} and consonants by ${context.consonantShift! > 0 ? "+" : ""}${context.consonantShift}.`;
    case "ENDPOINT_INTERIOR_SHIFT":
      return `Move the first and last letters by ${context.endpointShift! > 0 ? "+" : ""}${context.endpointShift}, and interior letters by ${context.interiorShift! > 0 ? "+" : ""}${context.interiorShift}.`;
  }
}

function working(ruleId: CodCp004RuleId, context: CodCp004RuleContext, word: string, code: string): string {
  const steps = [...word].map((letter, index) => {
    const shift = shiftAtPosition(ruleId, context, letter, index, word.length);
    const label = ruleId === "VOWEL_CONSONANT_CLASS_SHIFT"
      ? (isVowel(letter) ? "vowel" : "consonant")
      : `position ${index + 1}`;
    return `${letter}→${shiftLetter(letter, shift)} (${label}, ${shift > 0 ? "+" : ""}${shift})`;
  }).join(", ");
  return `${word} → ${code}: ${steps}${wordUsesPositionWrap(ruleId, context, word) ? "; cyclic wrapping is used" : ""}.`;
}

export function buildCodCp004Explanation(input: {
  prompt: PositionTransformPrompt;
  ruleId: CodCp004RuleId;
  context: CodCp004RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
}): ExplanationTrace {
  const sourceDemonstration = input.prompt.evidence.map((pair) => working(input.ruleId, input.context, pair.source, pair.code));
  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [`Reverse the position/class shifts on ${input.prompt.encodedTarget}; the unique original word is ${input.answer}.`];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_LETTER") {
    targetApplication = [working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode), `The concealed position therefore contains ${input.answer}.`];
  } else {
    targetApplication = [working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)];
  }
  return {
    ruleStatement: `${OPENINGS[input.styleIndex % OPENINGS.length]} ${describeRule(input.ruleId, input.context)}`,
    sourceDemonstration,
    targetApplication,
    conclusion: `Therefore, the required answer is ${input.answer}.`,
    closestTrapRejection: "Applying the first shift everywhere, reversing the phase, swapping the two branches, or skipping the final position breaks the pattern shown in the examples.",
  };
}
