import type { CodCp005RuleContext, CodCp005RuleId } from "./types";

function range(length: number): number[] {
  return Array.from({ length }, (_, index) => index);
}

export function rearrangementOrder(ruleId: CodCp005RuleId, context: CodCp005RuleContext, length: number): number[] {
  if (!Number.isInteger(length) || length < 2) throw new Error(`Unsupported rearrangement length ${length}`);
  switch (ruleId) {
    case "REVERSE_SEQUENCE":
      return range(length).reverse();
    case "CYCLIC_POSITION_ROTATION": {
      const amount = context.amount ?? 1;
      if (amount <= 0 || amount >= length) throw new Error(`Rotation amount ${amount} is invalid for length ${length}`);
      if (context.direction === "RIGHT") {
        return [...range(length).slice(length - amount), ...range(length).slice(0, length - amount)];
      }
      return [...range(length).slice(amount), ...range(length).slice(0, amount)];
    }
    case "HALF_SWAP": {
      if (length % 2 !== 0) throw new Error("HALF_SWAP requires an even number of letters");
      const half = length / 2;
      return [...range(length).slice(half), ...range(length).slice(0, half)];
    }
    case "ODD_THEN_EVEN_EXTRACTION":
      return [...range(length).filter((index) => index % 2 === 0), ...range(length).filter((index) => index % 2 === 1)];
    case "EVEN_THEN_ODD_EXTRACTION":
      return [...range(length).filter((index) => index % 2 === 1), ...range(length).filter((index) => index % 2 === 0)];
    case "OUTER_INNER_INTERLEAVING": {
      const output: number[] = [];
      let left = 0;
      let right = length - 1;
      while (left <= right) {
        if (left === right) output.push(left);
        else if (context.startSide === "RIGHT") output.push(right, left);
        else output.push(left, right);
        left += 1;
        right -= 1;
      }
      return output;
    }
  }
}

export function transformRearrangementWord(ruleId: CodCp005RuleId, context: CodCp005RuleContext, word: string): string {
  return rearrangementOrder(ruleId, context, word.length).map((index) => word[index]!).join("");
}

export function inverseRearrangementWord(ruleId: CodCp005RuleId, context: CodCp005RuleContext, code: string): string {
  const order = rearrangementOrder(ruleId, context, code.length);
  const source = Array<string>(code.length);
  order.forEach((sourceIndex, codeIndex) => {
    source[sourceIndex] = code[codeIndex]!;
  });
  if (source.some((letter) => !letter)) throw new Error(`Unable to invert ${ruleId}`);
  return source.join("");
}

export function rearrangementIsActive(ruleId: CodCp005RuleId, context: CodCp005RuleContext, word: string): boolean {
  try {
    const order = rearrangementOrder(ruleId, context, word.length);
    return new Set(order).size === word.length
      && order.some((sourceIndex, codeIndex) => sourceIndex !== codeIndex)
      && transformRearrangementWord(ruleId, context, word) !== word;
  } catch {
    return false;
  }
}

export function sameRearrangementContext(left: CodCp005RuleContext, right: CodCp005RuleContext): boolean {
  const normalize = (context: CodCp005RuleContext) =>
    JSON.stringify(Object.entries(context).sort(([a], [b]) => a.localeCompare(b)));
  return normalize(left) === normalize(right);
}
