import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";
import { alphabetRankZero, shiftLetter } from "../COD-CP-003/alphabet";
import { isVowel } from "../COD-CP-004/transform";
import { rearrangementOrder } from "../COD-CP-005/transform";
import {
  compositeStageResult,
  earlierTransformDescription,
  pipelinePositionOrder,
} from "./transform";
import type { CodCp006RuleContext, CodCp006RuleId, CompositePrompt } from "./types";

function signed(value: number): string {
  return `${value > 0 ? "+" : ""}${value}`;
}

function describePermutation(ruleId: string, context: Record<string, unknown>): string {
  switch (ruleId) {
    case "REVERSE_SEQUENCE": return "read the positions from right to left";
    case "CYCLIC_POSITION_ROTATION": return `rotate ${String(context.direction).toLowerCase()} by ${context.amount} position${context.amount === 1 ? "" : "s"}`;
    case "HALF_SWAP": return "interchange the two equal halves";
    case "ODD_THEN_EVEN_EXTRACTION": return "write odd-position letters before even-position letters";
    case "EVEN_THEN_ODD_EXTRACTION": return "write even-position letters before odd-position letters";
    case "OUTER_INNER_INTERLEAVING": return `take letters alternately from the ${String(context.startSide).toLowerCase()} and opposite ends while moving inward`;
    default: return "apply the registered position permutation";
  }
}

function describeRule(ruleId: CodCp006RuleId, context: CodCp006RuleContext): string {
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT":
      return `first reverse the word; then move code positions by ${signed((context.direction ?? 1) * (context.baseShift ?? 1))}, ${signed((context.direction ?? 1) * ((context.baseShift ?? 1) + 1))}, ${signed((context.direction ?? 1) * ((context.baseShift ?? 1) + 2))}, and so on`;
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT":
      return `first swap each adjacent pair; then alternate ${(context.firstDirection ?? 1) > 0 ? `+${context.magnitude}, −${context.magnitude}` : `−${context.magnitude}, +${context.magnitude}`} from the first code position`;
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT":
      return `first interchange the equal halves; then shift odd code positions by ${signed(context.oddShift ?? 1)} and even code positions by ${signed(context.evenShift ?? 2)}`;
    case "ROTATE_THEN_CLASS_SHIFT":
      return `using the canonical pipeline order, first rotate ${String(context.rotationDirection).toLowerCase()} by ${context.rotationAmount}; then shift vowels by ${signed(context.vowelShift ?? 1)} and consonants by ${signed(context.consonantShift ?? -1)}`;
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION":
      return `using the canonical pipeline order, first replace every letter by its opposite alphabet partner; then ${describePermutation(context.permutationRuleId!, context.permutationContext as Record<string, unknown>)}`;
    case "TRANSFORM_THEN_RANK_SEQUENCE":
      return `first ${earlierTransformDescription(context)}; then replace each transformed letter by its ordinary alphabet rank`;
  }
}

function stageTwoSteps(ruleId: CodCp006RuleId, context: CodCp006RuleContext, stage1: string, finalCode: string): string {
  if (ruleId === "TRANSFORM_THEN_RANK_SEQUENCE") {
    return [...stage1].map((letter) => `${letter}=${alphabetRankZero(letter) + 1}`).join(", ");
  }
  if (ruleId === "OPPOSITE_MAP_WITH_POSITION_PERMUTATION") {
    const order = rearrangementOrder(context.permutationRuleId!, context.permutationContext ?? {}, stage1.length);
    return `read stage-one positions ${order.map((index) => index + 1).join(", ")} to obtain ${finalCode}`;
  }
  return [...stage1].map((letter, index) => {
    let shift: number;
    let reason: string;
    switch (ruleId) {
      case "REVERSE_THEN_INDEXED_SHIFT":
        shift = (context.direction ?? 1) * ((context.baseShift ?? 1) + index);
        reason = `code position ${index + 1}`;
        break;
      case "PAIR_SWAP_THEN_ALTERNATING_SHIFT":
        shift = (context.firstDirection ?? 1) * (index % 2 === 0 ? 1 : -1) * (context.magnitude ?? 1);
        reason = `code position ${index + 1}`;
        break;
      case "HALF_SWAP_THEN_ODD_EVEN_SHIFT":
        shift = index % 2 === 0 ? (context.oddShift ?? 1) : (context.evenShift ?? 2);
        reason = `${index % 2 === 0 ? "odd" : "even"} code position`;
        break;
      case "ROTATE_THEN_CLASS_SHIFT":
        shift = isVowel(letter) ? (context.vowelShift ?? 1) : (context.consonantShift ?? -1);
        reason = isVowel(letter) ? "vowel" : "consonant";
        break;
      default:
        shift = 0;
        reason = `code position ${index + 1}`;
    }
    return `${letter}→${finalCode[index]} (${reason}, ${signed(shift)})`;
  }).join(", ");
}

function stageOneDetail(ruleId: CodCp006RuleId, context: CodCp006RuleContext, word: string, stage1: string): string {
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT":
      return `reverse ${word} to get ${stage1}`;
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT":
      return `swap adjacent pairs in ${word} to get ${stage1}`;
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT": {
      const half = word.length / 2;
      return `interchange ${word.slice(0, half)} and ${word.slice(half)} to get ${stage1}`;
    }
    case "ROTATE_THEN_CLASS_SHIFT":
      return `rotate ${word} ${String(context.rotationDirection).toLowerCase()} by ${context.rotationAmount} to get ${stage1}`;
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION":
      return `${[...word].map((letter, index) => `${letter}→${stage1[index]}`).join(", ")} gives ${stage1}`;
    case "TRANSFORM_THEN_RANK_SEQUENCE":
      return `${earlierTransformDescription(context)}: ${[...word].map((letter, index) => `${letter}→${stage1[index]}`).join(", ")}`;
  }
}

function working(ruleId: CodCp006RuleId, context: CodCp006RuleContext, word: string): string {
  const { stage1, finalCode } = compositeStageResult(ruleId, context, word);
  return `${word} → ${stage1} → ${finalCode}: Stage 1—${stageOneDetail(ruleId, context, word, stage1)}. Stage 2—${stageTwoSteps(ruleId, context, stage1, finalCode)}.`;
}

function decodeWorking(ruleId: CodCp006RuleId, context: CodCp006RuleContext, code: string, answer: string): string {
  const { stage1 } = compositeStageResult(ruleId, context, answer);
  if (ruleId === "TRANSFORM_THEN_RANK_SEQUENCE") {
    return `${code} gives transformed letters ${stage1} from the displayed ranks; reversing the first-stage transformation then gives ${answer}.`;
  }
  return `Undo stage 2 in ${code} to recover ${stage1}; then undo stage 1 to recover ${answer}. Thus, ${code} → ${stage1} → ${answer}.`;
}

function missingWorking(
  prompt: CompositePrompt,
  ruleId: CodCp006RuleId,
  context: CodCp006RuleContext,
  answer: string,
): string {
  const index = prompt.missingIndex!;
  const { stage1 } = compositeStageResult(ruleId, context, prompt.targetWord);
  if (ruleId === "TRANSFORM_THEN_RANK_SEQUENCE") {
    return `At code position ${index + 1}, the transformed letter is ${stage1[index]}, whose alphabet rank is ${answer}; therefore, ? = ${answer}.`;
  }
  const order = pipelinePositionOrder(ruleId, context, prompt.targetWord.length);
  const sourcePosition = order?.[index];
  const sourceText = sourcePosition === undefined
    ? `stage-one letter ${stage1[index]}`
    : `source position ${sourcePosition + 1} supplies ${prompt.targetWord[sourcePosition]}, which becomes stage-one letter ${stage1[index]}`;
  return `At code position ${index + 1}, ${sourceText}; after stage 2 it becomes ${answer}. Therefore, ? = ${answer}.`;
}

function trapRejection(options: readonly GeneratedOption[]): string | undefined {
  const trap = selectedDistractor(options);
  if (!trap?.errorLabel) return undefined;
  const value = trap.value;
  switch (trap.errorLabel) {
    case "STAGE_TWO_SKIPPED": return `${value} stops after stage 1 and never applies the second transformation.`;
    case "STAGE_ONE_SKIPPED": return `${value} applies the second transformation directly to the original word, skipping stage 1.`;
    case "INDEXED_DIRECTION_REVERSED": return `${value} uses the increasing indexed shifts in the opposite direction.`;
    case "INDEX_START_OFF_BY_ONE": return `${value} starts the indexed shift sequence with the wrong amount.`;
    case "ALTERNATING_PHASE_REVERSED": return `${value} begins the alternating shifts in the wrong direction.`;
    case "ALTERNATING_MAGNITUDE_WRONG": return `${value} uses the wrong alternating shift size.`;
    case "ODD_EVEN_SHIFTS_SWAPPED": return `${value} applies the even-position shift at odd positions and the odd-position shift at even positions.`;
    case "ODD_EVEN_DIRECTIONS_REVERSED": return `${value} reverses the required odd- and even-position directions.`;
    case "ROTATION_DIRECTION_REVERSED": return `${value} rotates the letters in the opposite direction before the class shifts.`;
    case "CLASS_SHIFTS_SWAPPED": return `${value} applies the consonant shift to vowels and the vowel shift to consonants.`;
    case "PERMUTATION_SKIPPED": return `${value} performs the opposite-alphabet map but omits the position permutation.`;
    case "OPPOSITE_MAP_SKIPPED": return `${value} permutes the original letters without first replacing them by opposite partners.`;
    case "WRONG_POSITION_PERMUTATION": return `${value} uses a different position order from the one established by the examples.`;
    case "TRANSFORM_SKIPPED": return `${value} writes ranks of the original letters instead of ranks of the transformed letters.`;
    case "ZERO_BASED_RANKS": return `${value} counts A as 0, but ordinary alphabet ranks count A as 1.`;
    case "RANK_ORDER_REVERSED": return `${value} reverses the transformed rank order without support from the examples.`;
    case "DECODE_STAGE_ORDER_WRONG": return `${value} reverses the decoded word instead of undoing the two stages in reverse order.`;
    case "DECODE_POSITION_SWAP": return `${value} introduces an extra position swap after decoding.`;
    case "DECODE_OFF_BY_ONE":
    case "DECODE_FINAL_OFF_BY_ONE": return `${value} contains a one-letter inverse error.`;
    case "NEIGHBOUR_RANK_PLUS":
    case "NEIGHBOUR_RANK_MINUS": return `${value} is adjacent to the required rank but does not match the transformed letter at ‘?’.`;
    case "NEIGHBOUR_LETTER_PLUS":
    case "NEIGHBOUR_LETTER_MINUS": return `${value} is adjacent to the required letter but does not follow both coding stages.`;
    default: return `${value} does not reproduce both stages shown in the examples.`;
  }
}

export function buildCodCp006Explanation(input: {
  prompt: CompositePrompt;
  ruleId: CodCp006RuleId;
  context: CodCp006RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
  options: readonly GeneratedOption[];
}): ExplanationTrace {
  const first = input.prompt.evidence[0]!;
  const ruleStatement = `${working(input.ruleId, input.context, first.source)} Therefore, ${describeRule(input.ruleId, input.context)}.`;
  const sourceDemonstration = input.prompt.evidence.slice(1, 2).map((pair) => working(input.ruleId, input.context, pair.source));

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.ruleId, input.context, input.prompt.encodedTarget!, input.answer)];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_TOKEN") {
    targetApplication = [
      working(input.ruleId, input.context, input.prompt.targetWord),
      missingWorking(input.prompt, input.ruleId, input.context, input.answer),
    ];
  } else {
    targetApplication = [working(input.ruleId, input.context, input.prompt.targetWord)];
  }

  return {
    ruleStatement,
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(input.answer, input.styleIndex),
    closestTrapRejection: trapRejection(input.options),
  };
}
