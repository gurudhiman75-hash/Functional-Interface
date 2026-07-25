import type { ExplanationTrace } from "../foundation/types";
import { forwardRank, reverseRank } from "./math";
import type { CodCp002RuleContext, CodCp002RuleId, NumericCodingPrompt } from "./types";

const OPENINGS = [
  "Read each example through the same alphabet-number rule.",
  "The displayed words use one fixed rank-based coding method.",
  "Compare the letters with their alphabet positions before applying the shared operation.",
  "Use the same numerical treatment for every displayed word.",
] as const;

function ruleStatement(ruleId: CodCp002RuleId, context: CodCp002RuleContext): string {
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE": return "Replace each letter by its forward alphabet rank, with A = 1 and Z = 26.";
    case "Z1A26_SEQUENCE_CODE": return "Replace each letter by its reverse alphabet rank, with Z = 1 and A = 26.";
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `Add ${context.constant} to the forward rank of every letter.`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `Subtract ${context.constant} from the forward rank of every letter.`;
    case "SUM_OF_FORWARD_RANKS": return "Add the forward alphabet ranks of all letters.";
    case "SUM_PLUS_WORD_LENGTH": return "Add the forward ranks, then add the number of letters in the word.";
    case "SUM_MINUS_WORD_LENGTH": return "Add the forward ranks, then subtract the number of letters in the word.";
    case "POSITION_WEIGHTED_SUM": return "Multiply each forward rank by its one-based position, then add the products.";
    case "ODD_EVEN_POSITION_DIFFERENCE": return "Find the absolute difference between the rank totals at odd and even positions.";
  }
}

function wordWorking(ruleId: CodCp002RuleId, context: CodCp002RuleContext, word: string, code: string): string {
  const ranks = [...word].map(forwardRank);
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE": return `${word}: ${[...word].map((letter) => `${letter}=${forwardRank(letter)}`).join(", ")} → ${code}.`;
    case "Z1A26_SEQUENCE_CODE": return `${word}: ${[...word].map((letter) => `${letter}=${reverseRank(letter)}`).join(", ")} → ${code}.`;
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `${word}: (${ranks.join(", ")}) + ${context.constant} at each position → ${code}.`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `${word}: (${ranks.join(", ")}) − ${context.constant} at each position → ${code}.`;
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

export function buildCodCp002Explanation(input: {
  prompt: NumericCodingPrompt;
  ruleId: CodCp002RuleId;
  context: CodCp002RuleContext;
  fullTargetCode: string;
  answer: string;
  styleIndex: number;
}): ExplanationTrace {
  const sourceDemonstration = input.prompt.evidence.map((pair) => wordWorking(input.ruleId, input.context, pair.word, pair.code));
  let targetApplication: string[];
  if (input.prompt.taskKind === "DECODE_TARGET") {
    targetApplication = [`Reverse the same sequence rule on ${input.prompt.encodedTarget}; the letters obtained are ${input.answer}.`];
  } else if (input.prompt.taskKind === "RECOVER_MISSING_VALUE") {
    targetApplication = [wordWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode), `The hidden entry is ${input.answer}.`];
  } else {
    targetApplication = [wordWorking(input.ruleId, input.context, input.prompt.targetWord, input.fullTargetCode)];
  }
  return {
    ruleStatement: `${OPENINGS[input.styleIndex % OPENINGS.length]} ${ruleStatement(input.ruleId, input.context)}`,
    sourceDemonstration,
    targetApplication,
    conclusion: `Therefore, the required answer is ${input.answer}.`,
    closestTrapRejection: "Using forward ranks in place of reverse ranks, omitting the fixed adjustment, or ignoring word length changes the displayed examples and cannot be used here.",
  };
}
