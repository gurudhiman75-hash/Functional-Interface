import { solveSetRule, type NumberTriple } from "./independent-solver";
import type { SetRuleContext } from "./rule-definitions";

export type SetOption = number | readonly [number, number, number];

export function canonicalSetOption(value: SetOption): string {
  return Array.isArray(value) ? value.join(":") : String(value);
}

export function validateSetOptions(
  ruleId: string,
  context: SetRuleContext,
  options: readonly { value: SetOption; errorLabel: string | null }[],
): number {
  if (options.length !== 4) throw new Error("ANA-CP-004 requires exactly four options.");
  if (new Set(options.map((option) => canonicalSetOption(option.value))).size !== 4) throw new Error("Duplicate ANA-CP-004 options.");
  const correct = options.map((option, index) => ({ option, index })).filter(({ option }) => option.errorLabel === null);
  if (correct.length !== 1) throw new Error("ANA-CP-004 requires exactly one marked answer.");
  for (const option of options) {
    if (!Array.isArray(option.value) || option.errorLabel === null) continue;
    const [first, second, third] = option.value as readonly [number, number, number];
    if (solveSetRule(ruleId, first, second, context) === third) {
      throw new Error(`Distractor triple accidentally satisfies ${ruleId}: ${option.value.join(",")}`);
    }
  }
  return correct[0].index;
}

export function tripleKey(triple: NumberTriple): string {
  return `${triple.first}:${triple.second}:${triple.third}`;
}
