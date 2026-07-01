import type { ExamTrap } from "./contracts";
import type { EducationalResolverContext, ResolvedStrategy, ResolvedTrap } from "./renderer-contracts";
import { byIds, hasAnyText, relatedIds, searchableText, uniqueStrings } from "./resolver-utils";

function toResolvedTrap(trap: Partial<ResolvedTrap | ExamTrap>, source: ResolvedTrap["source"], relevance: ResolvedTrap["relevance"]): ResolvedTrap {
  return {
    id: trap.id ?? "TRAP-FALLBACK",
    topic: (trap.topic as ResolvedTrap["topic"]) ?? "general-quant",
    misconception: trap.misconception ?? "A common mistake is to skip the base or unit check.",
    whyItHappens: trap.whyItHappens ?? "The visible numbers are used before checking what they represent.",
    correction: trap.correction ?? "Check the base, units, and required answer type before final calculation.",
    detectionHints: trap.detectionHints,
    examples: trap.examples,
    tags: trap.tags,
    source,
    relevance,
    review: (trap as Partial<ResolvedTrap>).review,
  };
}

export function resolveTraps(context: EducationalResolverContext, strategies: readonly ResolvedStrategy[] = []): ResolvedTrap[] {
  const explicit = byIds<ResolvedTrap>(context.assets.traps, context.references.trapIds)
    .map((trap) => toResolvedTrap(trap, "explicit", "high"));

  const strategyTrapIds = uniqueStrings([
    ...strategies.flatMap((strategy) => strategy.relatedTrapIds ?? []),
    ...relatedIds(context.assets.knowledgeLinks, strategies.map((strategy) => strategy.id), "warns-about"),
  ]);
  const related = byIds<ResolvedTrap>(context.assets.traps, strategyTrapIds)
    .map((trap) => toResolvedTrap(trap, "related", "medium"));

  const text = searchableText(context.input, context.assets);
  const inferred = (context.assets.traps ?? [])
    .filter((trap) => Boolean(trap.id))
    .filter((trap) => hasAnyText(text, [...(trap.detectionHints ?? []), ...(trap.tags ?? [])]))
    .slice(0, 2)
    .map((trap) => toResolvedTrap(trap, "inferred", "low"));

  const byId = new Map<string, ResolvedTrap>();
  for (const trap of [...explicit, ...related, ...inferred]) {
    if (trap.id && !byId.has(trap.id)) byId.set(trap.id, trap);
  }
  return [...byId.values()];
}
