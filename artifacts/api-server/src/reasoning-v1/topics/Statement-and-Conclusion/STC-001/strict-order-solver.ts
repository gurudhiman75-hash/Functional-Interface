import type { StcOrderClaim } from "./types.ts";

export function stcOrderEntails(premises: readonly StcOrderClaim[], conclusion: StcOrderClaim): boolean {
  const relevant = premises.filter((premise) => premise.relationId === conclusion.relationId);
  const adjacency = new Map<string, Set<string>>();
  for (const premise of relevant) {
    const set = adjacency.get(premise.higher) ?? new Set<string>();
    set.add(premise.lower);
    adjacency.set(premise.higher, set);
  }

  const queue = [conclusion.higher];
  const seen = new Set<string>(queue);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (next === conclusion.lower) return true;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

export const orderClaim = (relationId: string, higher: string, lower: string): StcOrderClaim => ({
  relationId,
  higher,
  lower,
});
