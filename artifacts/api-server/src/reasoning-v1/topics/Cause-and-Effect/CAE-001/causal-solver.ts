import type { CaeCausalWorld, CaeRelationship } from "./types.ts";

export function nodeById(world: CaeCausalWorld, nodeId: string) {
  const node = world.nodes.find((entry) => entry.id === nodeId);
  if (!node) throw new Error(`${world.id}: unknown causal node '${nodeId}'.`);
  return node;
}

export function hasDirectEdge(world: CaeCausalWorld, from: string, to: string): boolean {
  return world.edges.some((edge) => edge.from === from && edge.to === to);
}

export function causalPath(world: CaeCausalWorld, from: string, to: string): readonly string[] | null {
  nodeById(world, from);
  nodeById(world, to);
  const queue: string[][] = [[from]];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1]!;
    if (current === to) return path;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const edge of world.edges.filter((entry) => entry.from === current)) {
      if (!visited.has(edge.to)) queue.push([...path, edge.to]);
    }
  }
  return null;
}

function ancestorsOf(world: CaeCausalWorld, nodeId: string): ReadonlySet<string> {
  const ancestors = new Set<string>();
  const queue = world.edges.filter((edge) => edge.to === nodeId).map((edge) => edge.from);
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (ancestors.has(current)) continue;
    ancestors.add(current);
    for (const edge of world.edges.filter((entry) => entry.to === current)) queue.push(edge.from);
  }
  return ancestors;
}

export function hasCommonCause(world: CaeCausalWorld, first: string, second: string): boolean {
  const firstAncestors = ancestorsOf(world, first);
  return [...ancestorsOf(world, second)].some((nodeId) => firstAncestors.has(nodeId));
}

function hasParent(world: CaeCausalWorld, nodeId: string): boolean {
  return world.edges.some((edge) => edge.to === nodeId);
}

/**
 * Classifies graph structure only. It never promotes timing, wording, or a
 * real-world association into causation.
 */
export function solveCaeRelationship(world: CaeCausalWorld, first: string, second: string): CaeRelationship {
  if (hasDirectEdge(world, first, second)) return "FIRST_DIRECT_CAUSES_SECOND";
  if (hasDirectEdge(world, second, first)) return "SECOND_DIRECT_CAUSES_FIRST";

  const forward = causalPath(world, first, second);
  if (forward && forward.length > 2) return "INDIRECT_FIRST_CAUSES_SECOND";
  const reverse = causalPath(world, second, first);
  if (reverse && reverse.length > 2) return "INDIRECT_SECOND_CAUSES_FIRST";

  if (hasCommonCause(world, first, second)) return "COMMON_CAUSE";
  if (!hasParent(world, first) && !hasParent(world, second)) return "INDEPENDENT_CAUSES";
  if (hasParent(world, first) && hasParent(world, second)) return "INDEPENDENT_EFFECTS";
  return "NO_CAUSAL_LINK";
}

export function validateCaeCausalWorld(world: CaeCausalWorld): readonly string[] {
  const issues: string[] = [];
  const nodeIds = new Set<string>();
  for (const node of world.nodes) {
    if (nodeIds.has(node.id)) issues.push(`${world.id}: duplicate node id '${node.id}'.`);
    nodeIds.add(node.id);
    if (!node.text["en-IN"].trim() || !node.text["hi-IN"].trim() || !node.text["pa-IN"].trim()) {
      issues.push(`${world.id}/${node.id}: localized event text is incomplete.`);
    }
  }
  for (const edge of world.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) issues.push(`${world.id}: edge '${edge.from}->${edge.to}' references an unknown node.`);
    if (edge.from === edge.to) issues.push(`${world.id}: self-causation is invalid.`);
    if (nodeIds.has(edge.from) && nodeIds.has(edge.to) && nodeById(world, edge.from).temporalOrder >= nodeById(world, edge.to).temporalOrder) {
      issues.push(`${world.id}: edge '${edge.from}->${edge.to}' violates temporal order.`);
    }
  }
  for (const edge of world.edges) {
    if (causalPath(world, edge.to, edge.from)) {
      issues.push(`${world.id}: causal graph contains a cycle through '${edge.from}->${edge.to}'.`);
      break;
    }
  }
  return issues;
}
