import type { CodCp002RuleContext, CodCp002RuleId } from "./types";

export function forwardRank(letter: string): number {
  const rank = letter.charCodeAt(0) - 64;
  if (rank < 1 || rank > 26) throw new Error(`Unsupported letter '${letter}'`);
  return rank;
}

export function reverseRank(letter: string): number {
  return 27 - forwardRank(letter);
}

export function evaluateNumericCode(ruleId: CodCp002RuleId, context: CodCp002RuleContext, word: string): readonly number[] | number {
  const ranks = [...word].map(forwardRank);
  switch (ruleId) {
    case "A1Z26_SEQUENCE_CODE":
      return ranks;
    case "Z1A26_SEQUENCE_CODE":
      return [...word].map(reverseRank);
    case "RANK_PLUS_CONSTANT_SEQUENCE": {
      const constant = context.constant;
      if (!constant) throw new Error("Missing plus constant");
      return ranks.map((rank) => rank + constant);
    }
    case "RANK_MINUS_CONSTANT_SEQUENCE": {
      const constant = context.constant;
      if (!constant) throw new Error("Missing minus constant");
      if (ranks.some((rank) => rank - constant < 1)) throw new Error("Minus constant produces a non-positive token");
      return ranks.map((rank) => rank - constant);
    }
    case "SUM_OF_FORWARD_RANKS":
      return ranks.reduce((sum, rank) => sum + rank, 0);
    case "SUM_PLUS_WORD_LENGTH":
      return ranks.reduce((sum, rank) => sum + rank, 0) + word.length;
    case "SUM_MINUS_WORD_LENGTH":
      return ranks.reduce((sum, rank) => sum + rank, 0) - word.length;
    case "POSITION_WEIGHTED_SUM":
      return ranks.reduce((sum, rank, index) => sum + rank * (index + 1), 0);
    case "ODD_EVEN_POSITION_DIFFERENCE": {
      const odd = ranks.filter((_, index) => index % 2 === 0).reduce((sum, rank) => sum + rank, 0);
      const even = ranks.filter((_, index) => index % 2 === 1).reduce((sum, rank) => sum + rank, 0);
      return Math.abs(odd - even);
    }
  }
}

export function serializeNumericCode(value: readonly number[] | number): string {
  return Array.isArray(value) ? value.join("-") : String(value);
}

export function parseNumericSequence(value: string): number[] {
  return value.split("-").map((token) => {
    const number = Number(token);
    if (!Number.isInteger(number)) throw new Error(`Invalid numeric token '${token}'`);
    return number;
  });
}
