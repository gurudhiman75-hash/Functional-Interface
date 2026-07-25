import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { selectedDistractor } from "../foundation/editorial";
import { rearrangementOrder } from "./transform";
import type { CodCp005RuleContext, CodCp005RuleId, RearrangementPrompt } from "./types";

function orderText(order: readonly number[]): string {
  return order.map((index) => index + 1).join(", ");
}

function describeRule(ruleId: CodCp005RuleId, context: CodCp005RuleContext, length: number): string {
  const order = rearrangementOrder(ruleId, context, length);
  switch (ruleId) {
    case "REVERSE_SEQUENCE":
      return `the source-position order is ${orderText(order)}, so the letters are read from the last position to the first`;
    case "CYCLIC_POSITION_ROTATION": {
      const amount = context.amount ?? 1;
      const moved = amount === 1 ? "letter" : `${amount} letters`;
      return context.direction === "RIGHT"
        ? `the last ${moved} ${amount === 1 ? "moves" : "move"} to the front, giving source-position order ${orderText(order)}`
        : `the first ${moved} ${amount === 1 ? "moves" : "move"} to the end, giving source-position order ${orderText(order)}`;
    }
    case "HALF_SWAP":
      return `the two equal halves are interchanged, giving source-position order ${orderText(order)}`;
    case "ODD_THEN_EVEN_EXTRACTION":
      return `the source-position order is ${orderText(order)}: odd positions first, then even positions`;
    case "EVEN_THEN_ODD_EXTRACTION":
      return `the source-position order is ${orderText(order)}: even positions first, then odd positions`;
    case "OUTER_INNER_INTERLEAVING":
      return context.startSide === "RIGHT"
        ? `the source-position order is ${orderText(order)}, taking letters alternately from the right and left ends while moving inward`
        : `the source-position order is ${orderText(order)}, taking letters alternately from the left and right ends while moving inward`;
  }
}

function working(ruleId: CodCp005RuleId, context: CodCp005RuleContext, word: string, code: string): string {
  const order = rearrangementOrder(ruleId, context, word.length);
  const selected = order.map((sourceIndex, codeIndex) => `${codeIndex + 1}←${sourceIndex + 1}(${word[sourceIndex]})`).join(", ");
  return `${word} → ${code}: ${selected}`;
}

function exactRuleStatement(prompt: RearrangementPrompt, ruleId: CodCp005RuleId, context: CodCp005RuleContext): string {
  const example = prompt.evidence[0]!;
  return `${working(ruleId, context, example.source, example.code)}. Therefore, ${describeRule(ruleId, context, example.source.length)}.`;
}

function decodeWorking(
  ruleId: CodCp005RuleId,
  context: CodCp005RuleContext,
  encoded: string,
  answer: string,
): string {
  const order = rearrangementOrder(ruleId, context, encoded.length);
  const placements = order.map((sourceIndex, codeIndex) => `${encoded[codeIndex]}→source position ${sourceIndex + 1}`).join(", ");
  return `Place the coded letters back into their source positions: ${placements}. This reconstructs ${answer}.`;
}

function trapRejection(options: readonly GeneratedOption[]): string | undefined {
  const trap = selectedDistractor(options);
  if (!trap?.errorLabel) return undefined;
  const value = trap.value;
  const label = trap.errorLabel.replace(/^DECODE_/, "");
  if (label === "ORDER_LEFT_UNCHANGED") return `${value} keeps the original order, but the examples visibly rearrange the positions.`;
  if (label === "REVERSE_ORDER_USED") return `${value} reverses the complete word instead of following the displayed position order.`;
  if (label.startsWith("ROTATE_LEFT_")) return `${value} is formed by moving letters from the left end to the right, which is not the displayed order.`;
  if (label.startsWith("ROTATE_RIGHT_")) return `${value} is formed by moving letters from the right end to the front, which is not the displayed order.`;
  if (label === "HALVES_SWAPPED") return `${value} interchanges the two halves rather than using the required rearrangement.`;
  if (label === "ODD_POSITIONS_FIRST") return `${value} writes odd source positions before even positions.`;
  if (label === "EVEN_POSITIONS_FIRST") return `${value} writes even source positions before odd positions.`;
  if (label === "OUTER_LEFT_FIRST") return `${value} starts from the left end and then alternates between the two ends.`;
  if (label === "OUTER_RIGHT_FIRST") return `${value} starts from the right end and then alternates between the two ends.`;
  if (label.startsWith("WRONG_SOURCE_POSITION_")) {
    return `${value} comes from a different source position; the blank must use the position fixed by the displayed order.`;
  }
  return `${value} does not preserve the same source-position order as all the examples.`;
}

function exactConclusion(prompt: RearrangementPrompt, answer: string): string {
  if (prompt.taskKind === "DECODE_TARGET") return `Therefore, the decoded word is ${answer}.`;
  if (prompt.taskKind === "RECOVER_MISSING_LETTER") return `Therefore, the missing letter is ${answer}.`;
  if (prompt.taskKind === "CHOOSE_MATCHING_CODE") return `Therefore, the matching code is ${answer}.`;
  return `Therefore, ${prompt.targetWord} is coded as ${answer}.`;
}

export function buildCodCp005Explanation(input: {
  prompt: RearrangementPrompt;
  ruleId: CodCp005RuleId;
  context: CodCp005RuleContext;
  fullTargetCode: string;
  answer: string;
  options: readonly GeneratedOption[];
}): ExplanationTrace {
  const sourceDemonstration = input.prompt.evidence
    .slice(1, 2)
    .map((pair) => `${working(input.ruleId, input.context, pair.source, pair.code)}.`);

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.ruleId, input.context, input.prompt.encodedTarget!, input.answer)];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_LETTER") {
    const order = rearrangementOrder(input.ruleId, input.context, input.prompt.targetWord.length);
    const codeIndex = input.prompt.missingIndex!;
    const sourceIndex = order[codeIndex]!;
    targetApplication = [
      `${working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)}.`,
      `At code position ${codeIndex + 1}, source position ${sourceIndex + 1} supplies ${input.prompt.targetWord[sourceIndex]}; therefore, ? = ${input.answer}.`,
    ];
  } else {
    targetApplication = [`${working(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)}.`];
  }

  return {
    ruleStatement: exactRuleStatement(input.prompt, input.ruleId, input.context),
    sourceDemonstration,
    targetApplication,
    conclusion: exactConclusion(input.prompt, input.answer),
    closestTrapRejection: trapRejection(input.options),
  };
}
