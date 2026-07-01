import type { MentalShortcut } from "./contracts";
import type { EducationalResolverContext, ResolvedShortcut, ResolvedStrategy } from "./renderer-contracts";
import { byIds, hasAnyText, relatedIds, searchableText, uniqueStrings } from "./resolver-utils";

function toResolvedShortcut(shortcut: Partial<ResolvedShortcut | MentalShortcut>, source: ResolvedShortcut["source"], usefulness: ResolvedShortcut["usefulness"]): ResolvedShortcut {
  return {
    id: shortcut.id ?? "MSC-FALLBACK",
    topic: (shortcut.topic as ResolvedShortcut["topic"]) ?? "general-quant",
    title: shortcut.title ?? "Useful shortcut",
    pattern: shortcut.pattern ?? "",
    shortcut: shortcut.shortcut ?? "",
    explanation: shortcut.explanation ?? "Use the shortcut only after the main reasoning is clear.",
    difficulty: shortcut.difficulty ?? "foundation",
    examples: shortcut.examples,
    tags: shortcut.tags,
    source,
    usefulness,
    review: (shortcut as Partial<ResolvedShortcut>).review,
  };
}

export function resolveShortcuts(context: EducationalResolverContext, strategies: readonly ResolvedStrategy[] = []): ResolvedShortcut[] {
  const explicit = byIds<ResolvedShortcut>(context.assets.shortcuts, context.references.shortcutIds)
    .map((shortcut) => toResolvedShortcut(shortcut, "explicit", "primary-support"));

  const strategyShortcutIds = uniqueStrings([
    ...strategies.flatMap((strategy) => strategy.relatedShortcutIds ?? []),
    ...relatedIds(context.assets.knowledgeLinks, strategies.map((strategy) => strategy.id), "supports"),
  ]);
  const related = byIds<ResolvedShortcut>(context.assets.shortcuts, strategyShortcutIds)
    .map((shortcut) => toResolvedShortcut(shortcut, "related", "speed-up"));

  const text = searchableText(context.input, context.assets);
  const inferred = (context.assets.shortcuts ?? [])
    .filter((shortcut) => Boolean(shortcut.id))
    .filter((shortcut) => {
      const pattern = String(shortcut.pattern ?? "").toLowerCase();
      const tags = shortcut.tags ?? [];
      return (pattern && text.includes(pattern)) || hasAnyText(text, tags);
    })
    .slice(0, 2)
    .map((shortcut) => toResolvedShortcut(shortcut, "inferred", "optional"));

  const byId = new Map<string, ResolvedShortcut>();
  for (const shortcut of [...explicit, ...related, ...inferred]) {
    if (shortcut.id && !byId.has(shortcut.id)) byId.set(shortcut.id, shortcut);
  }
  return [...byId.values()];
}
