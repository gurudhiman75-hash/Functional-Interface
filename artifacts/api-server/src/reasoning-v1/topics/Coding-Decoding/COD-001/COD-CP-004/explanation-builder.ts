import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";
import { shiftLetter } from "../COD-CP-003/alphabet";
import { isVowel, shiftAtPosition, wordUsesPositionWrap } from "./transform";
import type { CodCp004RuleContext, CodCp004RuleId, PositionTransformPrompt } from "./types";

function describeRule(ruleId: CodCp004RuleId, context: CodCp004RuleContext): string {
  switch (ruleId) {
    case "INCREMENTAL_FORWARD_SHIFT":
      return `Move the first letter ${context.baseShift} place${context.baseShift === 1 ? "" : "s"} forward, the second one place farther, the third one place farther again, and so on.`;
    case "INCREMENTAL_BACKWARD_SHIFT":
      return `Move the first letter ${context.baseShift} place${context.baseShift === 1 ? "" : "s"} backward, then increase the backward movement by 1 at each next position.`;
    case "ALTERNATING_SIGNED_SHIFT":
      return `Move letters alternately ${(context.firstDirection ?? 1) > 0 ? "forward and backward" : "backward and forward"} by ${context.magnitude} place${context.magnitude === 1 ? "" : "s"}.`;
    case "ODD_EVEN_POSITION_SHIFT":
      return `At odd positions move letters ${Math.abs(context.oddShift ?? 0)} place${Math.abs(context.oddShift ?? 0) === 1 ? "" : "s"} ${(context.oddShift ?? 0) > 0 ? "forward" : "backward"}; at even positions move them ${Math.abs(context.evenShift ?? 0)} place${Math.abs(context.evenShift ?? 0) === 1 ? "" : "s"} ${(context.evenShift ?? 0) > 0 ? "forward" : "backward"}.`;
    case "VOWEL_CONSONANT_CLASS_SHIFT":
      return `Move every vowel ${Math.abs(context.vowelShift ?? 0)} place${Math.abs(context.vowelShift ?? 0) === 1 ? "" : "s"} ${(context.vowelShift ?? 0) > 0 ? "forward" : "backward"}, and every consonant ${Math.abs(context.consonantShift ?? 0)} place${Math.abs(context.consonantShift ?? 0) === 1 ? "" : "s"} ${(context.consonantShift ?? 0) > 0 ? "forward" : "backward"}.`;
    case "ENDPOINT_INTERIOR_SHIFT":
      return `Move the first and last letters ${Math.abs(context.endpointShift ?? 0)} place${Math.abs(context.endpointShift ?? 0) === 1 ? "" : "s"} ${(context.endpointShift ?? 0) > 0 ? "forward" : "backward"}; move all middle letters ${Math.abs(context.interiorShift ?? 0)} place${Math.abs(context.interiorShift ?? 0) === 1 ? "" : "s"} ${(context.interiorShift ?? 0) > 0 ? "forward" : "backward"}.`;
  }
}

function working(ruleId: CodCp004RuleId, context: CodCp004RuleContext, word: string, code: string): string {
  const steps = [...word].map((letter, index) => {
    const shift = shiftAtPosition(ruleId, context, letter, index, word.length);
    let reason: string;
    if (ruleId === "VOWEL_CONSONANT_CLASS_SHIFT") reason = isVowel(letter) ? "vowel" : "consonant";
    else if (ruleId === "ENDPOINT_INTERIOR_SHIFT") reason = index === 0 || index === word.length - 1 ? "end letter" : "middle letter";
    else reason = `position ${index + 1}`;
    return `${letter}→${shiftLetter(letter, shift)} (${reason}, ${shift > 0 ? "+" : ""}${shift})`;
  }).join(", ");
  return `${word} → ${code}: ${steps}${wordUsesPositionWrap(ruleId, context, word) ? "; the alphabet wraps at A/Z" : ""}.`;
}

function decodeWorking(encoded: string, answer: string): string {
  const steps = [...encoded].map((letter, index) => `${letter}→${answer[index]}`).join(", ");
  return `Reversing the rule position by position gives ${steps}, so ${encoded} represents ${answer}.`;
}

function trapRejection(options: readonly GeneratedOption[]): string | undefined {
  const trap = selectedDistractor(options);
  if (!trap?.errorLabel) return undefined;
  const value = trap.value;
  switch (trap.errorLabel) {
    case "FIRST_SHIFT_APPLIED_TO_ALL": return `${value} repeats the first movement at every position instead of changing it as shown in the examples.`;
    case "START_INDEX_ONE_TOO_HIGH": return `${value} starts the sequence of movements one place too high.`;
    case "WRONG_DIRECTION":
    case "POSITION_DIRECTION_REVERSED":
    case "CLASS_DIRECTIONS_REVERSED":
    case "GROUP_DIRECTIONS_REVERSED": return `${value} uses the required movements in the opposite direction.`;
    case "ALTERNATING_PHASE_REVERSED": return `${value} starts the alternating pattern in the wrong direction.`;
    case "ALTERNATING_MAGNITUDE_OFF_BY_ONE": return `${value} uses a movement that is one place larger than the one established by the examples.`;
    case "ODD_EVEN_SHIFTS_SWAPPED": return `${value} applies the even-position movement at odd positions and vice versa.`;
    case "VOWEL_CONSONANT_SHIFTS_SWAPPED": return `${value} applies the consonant movement to vowels and the vowel movement to consonants.`;
    case "ENDPOINT_INTERIOR_SHIFTS_SWAPPED": return `${value} applies the middle-letter movement to the first and last letters, and the end-letter movement to the middle.`;
    case "FINAL_POSITION_SKIPPED": return `${value} leaves the last letter unchanged even though the rule applies to it.`;
    case "REVERSED_DECODE": return `${value} reverses the decoded word, which is not part of the coding rule.`;
    case "POSITION_SWAP": return `${value} swaps two letters after decoding.`;
    case "OFF_BY_ONE_INVERSE": return `${value} reverses one coded letter with a one-place error.`;
    case "NEIGHBOUR_LETTER_PLUS":
    case "NEIGHBOUR_LETTER_MINUS": return `${value} is adjacent to the required letter but does not satisfy the exact movement at ‘?’.`;
    default: return `${value} does not follow the same position-by-position rule as the given examples.`;
  }
}

export function buildCodCp004Explanation(input: {
  prompt: PositionTransformPrompt;
  ruleId: CodCp004RuleId;
  context: CodCp004RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
  options: readonly GeneratedOption[];
}): ExplanationTrace {
  const sourceDemonstration = input.prompt.evidence
    .slice(0, 1)
    .map((pair) => working(input.ruleId, input.context, pair.source, pair.code));

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.prompt.encodedTarget!, input.answer)];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_LETTER") {
    targetApplication = [
      working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode),
      `${input.prompt.targetWord} is shown as ${input.prompt.displayedTargetCode}; therefore ‘?’ is ${input.answer}.`,
    ];
  } else {
    targetApplication = [working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)];
  }

  const openings = [
    "Comparing corresponding letters gives this rule:",
    "The same method is used in each example:",
    "The coding pattern is:",
    "The letter movements follow this order:",
  ] as const;

  return {
    ruleStatement: `${openings[input.styleIndex % openings.length]} ${describeRule(input.ruleId, input.context)}`,
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(input.answer, input.styleIndex),
    closestTrapRejection: trapRejection(input.options),
  };
}
