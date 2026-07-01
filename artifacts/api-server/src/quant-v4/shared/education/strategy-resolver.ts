import type { Strategy } from "./contracts";
import type { EducationalResolverContext, ResolvedStrategy } from "./renderer-contracts";
import { byIds, firstUsable, normalizeTopic, relatedIds, searchableText } from "./resolver-utils";

function toResolvedStrategy(strategy: Partial<ResolvedStrategy | Strategy>, source: ResolvedStrategy["source"], order: number): ResolvedStrategy {
  return {
    id: strategy.id ?? `STRAT-FALLBACK-${order}`,
    topic: (strategy.topic as ResolvedStrategy["topic"]) ?? "general-quant",
    title: strategy.title ?? "Use the clearest solving strategy",
    description: strategy.description ?? "Read the given values, connect them to the required value, and compute step by step.",
    applicableCPs: strategy.applicableCPs ?? ["*"],
    difficulty: strategy.difficulty ?? "foundation",
    reusableExamples: strategy.reusableExamples ?? [],
    tags: strategy.tags,
    source,
    order,
    prerequisites: (strategy as Partial<ResolvedStrategy>).prerequisites,
    relatedShortcutIds: (strategy as Partial<ResolvedStrategy>).relatedShortcutIds,
    relatedTrapIds: (strategy as Partial<ResolvedStrategy>).relatedTrapIds,
    relatedPedagogyRuleIds: (strategy as Partial<ResolvedStrategy>).relatedPedagogyRuleIds,
    relatedTerminologyIds: (strategy as Partial<ResolvedStrategy>).relatedTerminologyIds,
    review: (strategy as Partial<ResolvedStrategy>).review,
  };
}

function cpMatches(strategy: Partial<Strategy>, cpId: string | undefined) {
  if (!cpId || !strategy.applicableCPs?.length) return false;
  return strategy.applicableCPs.some((pattern) => {
    if (pattern === "*") return true;
    if (pattern.endsWith("*")) return cpId.startsWith(pattern.slice(0, -1));
    return pattern === cpId;
  });
}

export function resolveStrategies(context: EducationalResolverContext): ResolvedStrategy[] {
  const explicit = byIds<ResolvedStrategy>(context.assets.strategies, context.references.strategyIds)
    .map((strategy, index) => toResolvedStrategy(strategy, "explicit", index));

  if (explicit.length) {
    const prerequisiteIds = relatedIds(context.assets.knowledgeLinks, explicit.map((strategy) => strategy.id), "prerequisite");
    const prerequisites = byIds<ResolvedStrategy>(context.assets.strategies, prerequisiteIds)
      .map((strategy, index) => toResolvedStrategy(strategy, "inferred", index));
    const merged = [...prerequisites, ...explicit];
    return merged.map((strategy, index) => ({ ...strategy, order: index }));
  }

  const topic = normalizeTopic(context.input.topic);
  const text = searchableText(context.input, context.assets);
  const inferred = (context.assets.strategies ?? [])
    .filter((strategy) => Boolean(strategy.id))
    .filter((strategy) => cpMatches(strategy as Strategy, context.input.canonicalProblemId) || normalizeTopic(strategy.topic) === topic || text.includes(String(strategy.topic ?? "").toLowerCase()))
    .slice(0, 2)
    .map((strategy, index) => toResolvedStrategy(strategy, "inferred", index));

  if (inferred.length) return inferred;

  const fallback = firstUsable<ResolvedStrategy>(context.assets.strategies);
  return [toResolvedStrategy(fallback ?? {}, "fallback", 0)];
}
