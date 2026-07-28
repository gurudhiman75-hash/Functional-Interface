export type ReasoningNode = Readonly<{
  id: string;
  kind: "GIVEN" | "TRANSFORM" | "INFER" | "VERIFY";
  text: string;
  dependsOn?: readonly string[];
}>;

export function createReasoningGraph(nodes: readonly ReasoningNode[]) {
  const ids = new Set(nodes.map((node) => node.id));
  for (const node of nodes) {
    for (const dependency of node.dependsOn ?? []) {
      if (!ids.has(dependency)) throw new Error(`Missing reasoning dependency: ${dependency}`);
    }
  }
  return { nodes } as const;
}
