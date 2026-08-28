export type InequalityRelation = ">" | "<" | "=" | "unknown";

export type InequalityFact = Readonly<{
  left: string;
  relation: ">" | "=";
  right: string;
}>;

function buildEqualityGroups(facts: readonly InequalityFact[], symbols: readonly string[]) {
  const parent = new Map<string, string>();
  for (const symbol of symbols) parent.set(symbol, symbol);

  const find = (symbol: string): string => {
    const current = parent.get(symbol) ?? symbol;
    if (current === symbol) return current;
    const root = find(current);
    parent.set(symbol, root);
    return root;
  };

  const union = (left: string, right: string) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent.set(rightRoot, leftRoot);
  };

  for (const fact of facts) {
    if (fact.relation === "=") union(fact.left, fact.right);
  }

  return { find };
}

/**
 * Reusable inequality-graph authority extracted from the existing
 * `createInequalityScenario` reasoning engine. Equality facts are collapsed
 * first; strict greater-than facts then form a directed graph. The query is
 * resolved by transitive reachability in either direction.
 */
export function resolveInequalityRelation(
  symbols: readonly string[],
  facts: readonly InequalityFact[],
  left: string,
  right: string,
): InequalityRelation {
  const allSymbols = new Set([...symbols, left, right, ...facts.flatMap((fact) => [fact.left, fact.right])]);
  const { find } = buildEqualityGroups(facts, [...allSymbols]);
  const adjacency = new Map<string, Set<string>>();

  for (const fact of facts) {
    if (fact.relation !== ">") continue;
    const from = find(fact.left);
    const to = find(fact.right);
    if (from === to) continue;
    const outgoing = adjacency.get(from) ?? new Set<string>();
    outgoing.add(to);
    adjacency.set(from, outgoing);
  }

  const hasPath = (from: string, to: string): boolean => {
    if (from === to) return true;
    const visited = new Set<string>();
    const queue = [from];
    while (queue.length) {
      const current = queue.shift()!;
      if (current === to) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const next of adjacency.get(current) ?? []) {
        if (!visited.has(next)) queue.push(next);
      }
    }
    return false;
  };

  const leftRoot = find(left);
  const rightRoot = find(right);
  if (leftRoot === rightRoot) return "=";
  if (hasPath(leftRoot, rightRoot)) return ">";
  if (hasPath(rightRoot, leftRoot)) return "<";
  return "unknown";
}
