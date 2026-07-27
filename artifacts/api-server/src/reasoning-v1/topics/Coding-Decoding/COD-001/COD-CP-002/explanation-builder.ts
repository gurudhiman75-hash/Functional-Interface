import type { ExplanationTrace, GeneratedOption } from "../foundation/types";
import { conclusionFor, selectedDistractor } from "../foundation/editorial";
import { forwardRank, parseNumericSequence, reverseRank } from "./math";
import type { CodCp002RuleContext, CodCp002RuleId, NumericCodingPrompt } from "./types";

function describeRule(ruleId: CodCp002RuleId, context: CodCp002RuleContext): string {
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE": return "each letter is replaced by its ordinary alphabet position (A = 1, ..., Z = 26)";
    case "Z1A26_SEQUENCE_CODE": return "each letter is replaced by its reverse alphabet position (Z = 1, ..., A = 26)";
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `the ordinary alphabet position of every letter is increased by ${context.constant}`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `the ordinary alphabet position of every letter is reduced by ${context.constant}`;
    case "SUM_OF_FORWARD_RANKS": return "the ordinary alphabet positions of all letters are added";
    case "SUM_PLUS_WORD_LENGTH": return "the alphabet-position total is increased by the number of letters in the word";
    case "SUM_MINUS_WORD_LENGTH": return "the number of letters in the word is subtracted from the alphabet-position total";
    case "POSITION_WEIGHTED_SUM": return "each alphabet position is multiplied by its place in the word (1, 2, 3, ...), and the products are added";
    case "ODD_EVEN_POSITION_DIFFERENCE": return "the positive difference is taken between the alphabet-position totals at odd and even places";
  }
}

function wordWorking(ruleId: CodCp002RuleId, context: CodCp002RuleContext, word: string, code: string): string {
  const letters = [...word];
  const ranks = letters.map(forwardRank);
  const assignments = letters.map((letter, index) => `${letter}=${ranks[index]}`).join(", ");
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE": return `${word} → ${code}: ${assignments}`;
    case "Z1A26_SEQUENCE_CODE": return `${word} → ${code}: ${letters.map((letter) => `${letter}=${reverseRank(letter)}`).join(", ")}`;
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `${word} → ${code}: ${assignments}; add ${context.constant} to each value`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `${word} → ${code}: ${assignments}; subtract ${context.constant} from each value`;
    case "SUM_OF_FORWARD_RANKS": return `${word} → ${code}: ${assignments}; ${ranks.join(" + ")} = ${code}`;
    case "SUM_PLUS_WORD_LENGTH": return `${word} → ${code}: ${assignments}; (${ranks.join(" + ")}) + ${word.length} = ${code}`;
    case "SUM_MINUS_WORD_LENGTH": return `${word} → ${code}: ${assignments}; (${ranks.join(" + ")}) − ${word.length} = ${code}`;
    case "POSITION_WEIGHTED_SUM": return `${word} → ${code}: ${assignments}; ${ranks.map((rank, index) => `${rank}×${index + 1}`).join(" + ")} = ${code}`;
    case "ODD_EVEN_POSITION_DIFFERENCE": {
      const odd = ranks.filter((_, index) => index % 2 === 0);
      const even = ranks.filter((_, index) => index % 2 === 1);
      return `${word} → ${code}: ${assignments}; |(${odd.join(" + ")}) − (${even.join(" + ") || "0"})| = ${code}`;
    }
  }
}

function exactRuleStatement(prompt: NumericCodingPrompt, ruleId: CodCp002RuleId, context: CodCp002RuleContext): string {
  const example = prompt.evidence[0]!;
  return `${wordWorking(ruleId, context, example.word, example.code)}. Therefore, ${describeRule(ruleId, context)}.`;
}

function letterFromRank(rank: number): string {
  if (!Number.isInteger(rank) || rank < 1 || rank > 26) throw new Error(`Invalid alphabet rank ${rank}`);
  return String.fromCharCode(64 + rank);
}

function decodeWorking(ruleId: CodCp002RuleId, context: CodCp002RuleContext, encoded: string, answer: string): string {
  const values = parseNumericSequence(encoded);
  const steps = values.map((value) => {
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
  const sourceDemonstration = input.prompt.evidence
    .slice(1, 2)
    .map((pair) => `${wordWorking(input.ruleId, input.context, pair.word, pair.code)}.`);

  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [decodeWorking(input.ruleId, input.context, input.prompt.encodedTarget!, input.answer)];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_VALUE") {
    const exactWorking = `${wordWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)}.`;
    if (input.prompt.outputShape === "SCALAR") {
      targetApplication = [exactWorking, `Therefore, ? = ${input.answer}.`];
    } else {
      const missingIndex = input.prompt.missingIndex!;
      const sourceLetter = input.prompt.targetWord[missingIndex]!;
      targetApplication = [
        exactWorking,
        `At the position marked ‘?’, ${sourceLetter} has the code value ${input.answer}; therefore, ? = ${input.answer}.`,
      ];
    }
  } else {
    targetApplication = [`${wordWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)}.`];
  }

  return {
    ruleStatement: exactRuleStatement(input.prompt, input.ruleId, input.context),
    sourceDemonstration,
    targetApplication,
    conclusion: conclusionFor(input.answer, input.styleIndex),
    closestTrapRejection: trapRejection(input.options),
  };
}
