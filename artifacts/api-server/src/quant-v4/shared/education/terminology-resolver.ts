import type { TerminologyEntry } from "./contracts";
import type { EducationalResolverContext, ResolvedPedagogyRule, ResolvedStrategy, ResolvedTerminologyEntry } from "./renderer-contracts";
import { byIds, relatedIds, uniqueStrings } from "./resolver-utils";

function toResolvedTerminology(entry: Partial<ResolvedTerminologyEntry | TerminologyEntry>, source: ResolvedTerminologyEntry["source"]): ResolvedTerminologyEntry {
  return {
    id: entry.id ?? "TERM-FALLBACK",
    concept: entry.concept ?? "clear wording",
    preferred: entry.preferred ?? "the required value",
    avoid: entry.avoid ?? [],
    rationale: entry.rationale ?? "Use direct, student-facing language.",
    examples: entry.examples,
    source,
    review: (entry as Partial<ResolvedTerminologyEntry>).review,
  };
}

export function resolveTerminologyEntries(
  context: EducationalResolverContext,
  strategies: readonly ResolvedStrategy[] = [],
  pedagogyRules: readonly ResolvedPedagogyRule[] = [],
): ResolvedTerminologyEntry[] {
  const explicit = byIds<ResolvedTerminologyEntry>(context.assets.terminologyEntries, context.references.terminologyIds)
    .map((entry) => toResolvedTerminology(entry, "explicit"));

  const relatedTerminologyIds = uniqueStrings([
    ...strategies.flatMap((strategy) => strategy.relatedTerminologyIds ?? []),
    ...relatedIds(context.assets.knowledgeLinks, strategies.map((strategy) => strategy.id), "phrased-by"),
    ...relatedIds(context.assets.knowledgeLinks, pedagogyRules.map((rule) => rule.id), "phrased-by"),
  ]);
  const related = byIds<ResolvedTerminologyEntry>(context.assets.terminologyEntries, relatedTerminologyIds)
    .map((entry) => toResolvedTerminology(entry, "pedagogy-related"));

  const defaults = (context.assets.terminologyEntries ?? [])
    .filter((entry) => Boolean(entry.id))
    .slice(0, 4)
    .map((entry) => toResolvedTerminology(entry, "default"));

  const byId = new Map<string, ResolvedTerminologyEntry>();
  for (const entry of [...explicit, ...related, ...defaults]) {
    if (entry.id && !byId.has(entry.id)) byId.set(entry.id, entry);
  }
  return [...byId.values()];
}

export function applyTerminology(text: string, entries: readonly ResolvedTerminologyEntry[]): string {
  let output = text;
  for (const entry of entries) {
    for (const avoided of entry.avoid ?? []) {
      if (!avoided) continue;
      output = output.replace(new RegExp(escapeRegExp(avoided), "gi"), entry.preferred);
    }
  }
  return output;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
