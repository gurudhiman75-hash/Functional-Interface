import type { PedagogyRule } from "./contracts";
import type { EducationalResolverContext, ResolvedPedagogyRule, ResolvedStrategy } from "./renderer-contracts";
import { byIds, normalizeTopic, relatedIds, uniqueStrings } from "./resolver-utils";

function fallbackRule(id: string, priority: number): ResolvedPedagogyRule {
  return {
    id,
    title: "Explain before formula",
    principle: "Start with meaning, then show the calculation.",
    do: ["Use the quantities from the question", "Show one reasoning move at a time"],
    avoid: ["Raw formula dumps", "Variable-first reasoning when concrete arithmetic is enough"],
    appliesTo: ["general-quant"],
    enforcementStage: "authoring",
    source: "default",
    priority,
  };
}

function toResolvedRule(rule: Partial<ResolvedPedagogyRule | PedagogyRule>, source: ResolvedPedagogyRule["source"], priority: number): ResolvedPedagogyRule {
  return {
    id: rule.id ?? `PED-FALLBACK-${priority}`,
    title: rule.title ?? "Explain before formula",
    principle: rule.principle ?? "Start with meaning, then show the calculation.",
    do: rule.do ?? ["Use concrete quantities first"],
    avoid: rule.avoid ?? ["Raw formula dumps"],
    appliesTo: (rule.appliesTo as ResolvedPedagogyRule["appliesTo"]) ?? ["general-quant"],
    enforcementStage: rule.enforcementStage ?? "authoring",
    source,
    priority,
    review: (rule as Partial<ResolvedPedagogyRule>).review,
  };
}

export function resolvePedagogyRules(context: EducationalResolverContext, strategies: readonly ResolvedStrategy[] = []): ResolvedPedagogyRule[] {
  const explicit = byIds<ResolvedPedagogyRule>(context.assets.pedagogyRules, context.references.pedagogyRuleIds)
    .map((rule, index) => toResolvedRule(rule, "explicit", index));

  const strategyRuleIds = uniqueStrings([
    ...strategies.flatMap((strategy) => strategy.relatedPedagogyRuleIds ?? []),
    ...relatedIds(context.assets.knowledgeLinks, strategies.map((strategy) => strategy.id), "governed-by"),
  ]);
  const related = byIds<ResolvedPedagogyRule>(context.assets.pedagogyRules, strategyRuleIds)
    .map((rule, index) => toResolvedRule(rule, "strategy-related", explicit.length + index));

  const topic = normalizeTopic(context.input.topic);
  const defaults = (context.assets.pedagogyRules ?? [])
    .filter((rule) => Boolean(rule.id))
    .filter((rule) => (rule.appliesTo ?? []).some((candidate) => normalizeTopic(candidate) === topic || candidate === "general-quant"))
    .slice(0, 3)
    .map((rule, index) => toResolvedRule(rule, "default", explicit.length + related.length + index));

  const byId = new Map<string, ResolvedPedagogyRule>();
  for (const rule of [...explicit, ...related, ...defaults, fallbackRule("PED-FALLBACK", 999)]) {
    if (rule.id && !byId.has(rule.id)) byId.set(rule.id, rule);
  }
  return [...byId.values()].sort((left, right) => left.priority - right.priority);
}
