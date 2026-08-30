import type { StcTemporalClaim } from "./types.ts";

function reachable(edges: readonly [string, string][], from: string, to: string): boolean {
  const adjacency = new Map<string, Set<string>>();
  for (const [higher, lower] of edges) {
    const set = adjacency.get(higher) ?? new Set<string>();
    set.add(lower);
    adjacency.set(higher, set);
  }
  const queue = [from];
  const seen = new Set<string>(queue);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (next === to) return true;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

export function stcTemporalEntails(premises: readonly StcTemporalClaim[], conclusion: StcTemporalClaim): boolean {
  if (conclusion.kind === "before") {
    const edges: [string, string][] = premises
      .filter((premise): premise is Extract<StcTemporalClaim, { kind: "before" }> => premise.kind === "before")
      .map((premise) => [premise.first, premise.second]);
    return reachable(edges, conclusion.first, conclusion.second);
  }

  const trendPremises = premises.filter(
    (premise): premise is Extract<StcTemporalClaim, { kind: "trend" }> => premise.kind === "trend" && premise.metric === conclusion.metric,
  );
  const edges: [string, string][] = [];
  for (const premise of trendPremises) {
    if (premise.direction === "INCREASED") edges.push([premise.to, premise.from]);
    else edges.push([premise.from, premise.to]);
  }
  if (conclusion.direction === "INCREASED") return reachable(edges, conclusion.to, conclusion.from);
  return reachable(edges, conclusion.from, conclusion.to);
}

export const beforeClaim = (first: string, second: string): StcTemporalClaim => ({ kind: "before", first, second });
export const trendClaim = (
  metric: string,
  from: string,
  to: string,
  direction: "INCREASED" | "DECREASED",
): StcTemporalClaim => ({ kind: "trend", metric, from, to, direction });
