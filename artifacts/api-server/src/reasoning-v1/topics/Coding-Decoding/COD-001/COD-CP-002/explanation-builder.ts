import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";
import { forwardRank, parseNumericSequence, reverseRank } from "./math";
import type { CodCp002RuleContext, CodCp002RuleId, NumericCodingPrompt } from "./types";

function describeRule(ruleId: CodCp002RuleId, context: CodCp002RuleContext): string {
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE": return "Write the ordinary alphabet position of each letter: A = 1, B = 2, ..., Z = 26.";
    case "Z1A26_SEQUENCE_CODE": return "Write the reverse alphabet position of each letter: Z = 1, Y = 2, ..., A = 26.";
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `Find each ordinary alphabet position and add ${context.constant}.`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `Find each ordinary alphabet position and subtract ${context.constant}.`;
    case "SUM_OF_FORWARD_RANKS": return "Add the ordinary alphabet positions of all the letters.";
    case "SUM_PLUS_WORD_LENGTH": return "Add the alphabet positions, then add the number of letters in the word.";
    case "SUM_MINUS_WORD_LENGTH": return "Add the alphabet positions, then subtract the number of letters in the word.";
    case "POSITION_WEIGHTED_SUM": return "Multiply each alphabet position by its place in the word (1, 2, 3, ...), then add the products.";
    case "ODD_EVEN_POSITION_DIFFERENCE": return "Add the alphabet positions at odd places and at even places separately, then take the positive difference.";
  }
}

function openingFor(ruleId: CodCp002RuleId, styleIndex: number): string {
  const variants = [
    "The examples follow this rule:",
    "Comparing the given words and numbers shows that",
    "The same numerical rule is used throughout:",
    "The coding is obtained as follows:",
  ] as const;
  const opening = variants[styleIndex % variants.length]!;
  return `${opening} ${describeRule(ruleId, arguments[1] as never)}`;
}

function wordWorking(ruleId: CodCp002RuleId, context: CodCp002RuleContext, word: string, code: string): string {
  const ranks = [...word].map(forwardRank);
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE": return `${word}: ${[...word].map((letter) => `${letter}=${forwardRank(letter)}`).join(", ")} → ${code}.`;
    case "Z1A26_SEQUENCE_CODE": return `${word}: ${[...word].map((letter) => `${letter}=${reverseRank(letter)}`).join(", ")} → ${code}.`;
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `${word}: (${ranks.join(", ")}) + ${context.constant} at each place → ${code}.`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `${word}: (${ranks.join(", ")}) − ${context.constant} at each place → ${code}.`;
    case "SUM_OF_FORWARD_RANKS": return `${word}: ${ranks.join(" + ")} = ${code}.`;
    case "SUM_PLUS_WORD_LENGTH": return `${word}: (${ranks.join(" + ")}) + ${word.length} = ${code}.`;
    case "SUM_MINUS_WORD_LENGTH": return `${word}: (${ranks.join(" + ")}) − ${word.length} = ${code}.`;
    case "POSITION_WEIGHTED_SUM": return `${word}: ${ranks.map((rank, index) => `${rank}×${index + 1}`).join(" + ")} = ${code}.`;
    case "ODD_EVEN_POSITION_DIFFERENCE": {
      const odd = ranks.filter((_, index) => index % 2 === 0);
      const even = ranks.filter((_, index) => index % 2 === 1);
      return `${word}: |(${odd.join(" + ")}) − (${even.join(" + ") || "0"})| = ${code}.`;
    }
  }
}

function letterFromRank(rank: number): string {
  if (!Number.isInteger(rank) || rank < 1 || rank > 26) throw new Error(`Invalid alphabet rank ${rank}`);
  return String.fromCharCode(64 + rank);
}

function decodeWorking(ruleId: CodCp002RuleId, context: CodCp002RuleContext, encoded: string, answer: string): string {
  const values = parseNumericSequence(encoded);
  const steps = values.map((value, index) => {
    let rank: number;
    if (ruleId === "A1Z26_SEQUENCE_CODE") rank = value;
    else if (ruleId === "Z1A26_SEQUENCE_CODE") rank = 27 - value;
    else if (ruleId === "RANK_PLUS_CONSTANT_SEQUENCE") rank = value - (context.constant ?? 0);
    else if (ruleId === "RANK_MINUS_CONSTANT_SEQUENCE") rank = value + (context.constant ?? 0);
    else throw new Error(`Rule ${ruleId} does not support decoding`);
    return `${value}→${letterFromRank(rank)}`;
  });
  return `${encoded} gives ${steps.join(", ")}, so the word is ${answer}.`;
}

function trapRejection(options: readonly GeneratedOption[]): string | undefined {
  const trap = selectedDistractor(options);
  if (!trap?.errorLabel) return undefined;
  const value = trap.value;
  switch (trap.errorLabel) {
    case "REVERSED_TOKEN_ORDER": return `${value} places the correct numbers in reverse order; the code must follow the order of the letters.`;
    case "POSITION_SWAP": return `${value} swaps two positions, which does not match the given examples.`;
    case "OFF_BY_ONE_RANK": return `${value} is obtained by increasing every required value by 1.`;
    case "WRONG_CONSTANT_DIRECTION": return `${value} applies the fixed adjustment in the wrong direction.`;
    case "INVERSE_RULE_ERROR":
    case "REVERSED_DECODE":
    case "OFF_BY_ONE_INVERSE": return `${value} does not reverse the displayed numerical rule correctly.`;
    case "MISSING_TOKEN_TRAP": return `${value} does not match the calculation at the position marked ‘?’.`;
    case "WORD_LENGTH_ADDED": return `${value} adds the word length even though the rule uses only the letter positions.`;
    case "WORD_LENGTH_SUBTRACTED": return `${value} subtracts the word length without support from the examples.`;
    case "WORD_LENGTH_OMITTED": return `${value} stops after adding the letter positions and omits the required length adjustment.`;
    case "WORD_LENGTH_SIGN_REVERSED": return `${value} uses the word-length adjustment with the wrong sign.`;
    case "WORD_LENGTH_ADDED_TWICE":
    case "WORD_LENGTH_SUBTRACTED_TWICE": return `${value} applies the word-length adjustment twice.`;
    case "POSITION_WEIGHTS_OMITTED": return `${value} simply adds the letter positions and ignores their places in the word.`;
    case "ZERO_BASED_POSITION_WEIGHTS": return `${value} starts the position multipliers from 0 instead of 1.`;
    case "POSITION_WEIGHTS_REVERSED": return `${value} assigns the largest multiplier to the first letter instead of the last.`;
    case "ODD_EVEN_TOTAL_USED": return `${value} adds the odd- and even-place totals instead of finding their difference.`;
    case "FINAL_LETTER_OMITTED": return `${value} leaves out the last letter while forming the odd/even totals.`;
    case "ODD_EVEN_DIFFERENCE_SLIP":
    case "ARITHMETIC_PLUS_ONE":
    case "ARITHMETIC_MINUS_ONE": return `${value} is a nearby arithmetic result, but it does not equal the complete calculation.`;
    default:
      if (trap.errorLabel.startsWith("COMPETING_")) return `${value} follows a different alphabet-number rule that fails on at least one given example.`;
      return `${value} does not reproduce the same numerical relationship in all the examples.`;
  }
}

export function buildCodCp002Explanation(input: {
  prompt: NumericCodingPrompt;
  ruleId: CodCp002RuleId;
  context: CodCp002RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
  options: readonly GeneratedOption[];
}): ExplanationTrace {
  const evidenceLimit = input.prompt.outputShape === "SCALAR" || ["INFER_AND_ENCODE", "CHOOSE_MATCHING_CODE"].includes(input.prompt.taskKind) ? 2 : 1;
  const sourceDemonstration = input.prompt.evidence
    .slice(0, evidenceLimit)
    .map((pair) => wordWorking(input.ruleId, input.context, pair.word, pair.code));

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.ruleId, input.context, input.prompt.encodedTarget!, input.answer)];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_VALUE") {
    targetApplication = [
      wordWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode),
      `${input.prompt.targetWord} is shown as ${input.prompt.displayedTargetCode}; therefore ‘?’ must be ${input.answer}.`,
    ];
  } else {
    targetApplication = [wordWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)];
  }

  const openings = [
    "The examples follow this rule:",
    "Comparing the given codes shows that",
    "The same numerical method is used throughout:",
    "The code is formed as follows:",
  ] as const;

  return {
    ruleStatement: `${openings[input.styleIndex % openings.length]} ${describeRule(input.ruleId, input.context)}`,
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(input.answer, input.styleIndex),
    closestTrapRejection: trapRejection(input.options),
  };
}
