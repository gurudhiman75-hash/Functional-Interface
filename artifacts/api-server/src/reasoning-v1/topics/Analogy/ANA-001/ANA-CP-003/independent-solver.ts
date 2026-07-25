import { ANA_CP003_RULES, numericRuleById, type NumericRuleContext } from "./rule-definitions";

export interface NumericPair {
  input: number;
  output: number;
}

export function solveNumericRule(ruleId: string, input: number, context: NumericRuleContext): number | null {
  const value = numericRuleById(ruleId).apply(input, context);
  return value !== null && Number.isInteger(value) && value > 0 && value <= 2000 ? value : null;
}

export function matchingNumericRules(pairs: readonly NumericPair[]): readonly { ruleId: string; context: NumericRuleContext; priority: number }[] {
  const matches: { ruleId: string; context: NumericRuleContext; priority: number }[] = [];
  for (const rule of ANA_CP003_RULES) {
    for (const context of rule.parameters) {
      if (pairs.every((pair) => solveNumericRule(rule.id, pair.input, context) === pair.output)) {
        matches.push({ ruleId: rule.id, context, priority: rule.priority });
      }
    }
  }
  return matches;
}

export function verifyNumericTransfer(
  ruleId: string,
  context: NumericRuleContext,
  source: NumericPair,
  target: NumericPair,
): boolean {
  return solveNumericRule(ruleId, source.input, context) === source.output
    && solveNumericRule(ruleId, target.input, context) === target.output;
}
