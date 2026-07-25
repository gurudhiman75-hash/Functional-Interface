import { ANA_CP004_RULES, setRuleById, type SetRuleContext } from "./rule-definitions";

export interface NumberTriple {
  first: number;
  second: number;
  third: number;
}

export function solveSetRule(ruleId: string, first: number, second: number, context: SetRuleContext): number | null {
  const value = setRuleById(ruleId).apply(first, second, context);
  return value !== null && Number.isInteger(value) && value > 0 && value <= 2000 ? value : null;
}

export function verifySetTransfer(ruleId: string, context: SetRuleContext, ...triples: readonly NumberTriple[]): boolean {
  return triples.every((triple) => solveSetRule(ruleId, triple.first, triple.second, context) === triple.third);
}

export interface MatchingSetRule {
  ruleId: string;
  context: SetRuleContext;
  priority: number;
}

export function matchingSetRules(triples: readonly NumberTriple[]): MatchingSetRule[] {
  return ANA_CP004_RULES.flatMap((rule) => rule.contexts
    .filter((context) => triples.every((triple) => solveSetRule(rule.id, triple.first, triple.second, context) === triple.third))
    .map((context) => ({ ruleId: rule.id, context, priority: rule.priority })));
}
