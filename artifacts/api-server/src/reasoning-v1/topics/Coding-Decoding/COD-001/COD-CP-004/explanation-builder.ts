import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";
import { shiftLetter } from "../COD-CP-003/alphabet";
import { isVowel, shiftAtPosition, wordUsesPositionWrap } from "./transform";
import type { CodCp004RuleContext, CodCp004RuleId, PositionTransformPrompt } from "./types";

function describeRule(ruleId: CodCp004RuleId, context: CodCp004RuleContext): string {
  switch (ruleId) {
    case "INCREMENTAL_FORWARD_SHIFT":
      return `the forward shifts are +${context.baseShift}, +${(context.baseShift ?? 0) + 1}, +${(context.baseShift ?? 0) + 2}, ... from left to right`;
    case "INCREMENTAL_BACKWARD_SHIFT":
      return `the backward shifts are −${context.baseShift}, −${(context.baseShift ?? 0) + 1}, −${(context.baseShift ?? 0) + 2}, ... from left to right`;
    case "ALTERNATING_SIGNED_SHIFT":
      return `the shifts alternate ${(context.firstDirection ?? 1) > 0 ? `+${context.magnitude}, −${context.magnitude}` : `−${context.magnitude}, +${context.magnitude}`} from the first position onward`;
    case "ODD_EVEN_POSITION_SHIFT":
      return `odd positions use ${(context.oddShift ?? 0) > 0 ? "+" : ""}${context.oddShift}, while even positions use ${(context.evenShift ?? 0) > 0 ? "+" : ""}${context.evenShift}`;
    case "VOWEL_CONSONANT_CLASS_SHIFT":
      return `vowels use ${(context.vowelShift ?? 0) > 0 ? "+" : ""}${context.vowelShift}, while consonants use ${(context.consonantShift ?? 0) > 0 ? "+" : ""}${context.consonantShift}`;
    case "ENDPOINT_INTERIOR_SHIFT":
      return `the first and last letters use ${(context.endpointShift ?? 0) > 0 ? "+" : ""}${context.endpointShift}, while all middle letters use ${(context.interiorShift ?? 0) > 0 ? "+" : ""}${context.interiorShift}`;
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
  return `${word} → ${code}: ${steps}${wordUsesPositionWrap(ruleId, context, word) ? "; the alphabet wraps at A/Z" : ""}`;
}

function exactRuleStatement(prompt: PositionTransformPrompt, ruleId: CodCp004RuleId, context: CodCp004RuleContext): string {
  const example = prompt.evidence[0]!;
  return `${working(ruleId, context, example.source, example.code)}. Therefore, ${describeRule(ruleId, context)}.`;
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
    .slice(1, 2)
    .map((pair) => `${working(input.ruleId, input.context, pair.source, pair.code)}.`);

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.prompt.encodedTarget!, input.answer)];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_LETTER") {
    targetApplication = [
      `${working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)}.`,
      `${input.prompt.targetWord} is shown as ${input.prompt.displayedTargetCode}; therefore ‘?’ is ${input.answer}.`,
    ];
  } else {
    targetApplication = [`${working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)}.`];
  }

  return {
    ruleStatement: exactRuleStatement(input.prompt, input.ruleId, input.context),
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(input.answer, input.styleIndex),
    closestTrapRejection: trapRejection(input.options),
  };
}
