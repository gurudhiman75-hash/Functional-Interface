import type { QuantV4EducationReferenceSet } from "./contracts";
import type {
  EducationalAssetBundle,
  EducationalKnowledgeLink,
  EducationalReasoningGraphLike,
  EducationalReasoningNode,
  EducationalRenderingInput,
} from "./renderer-contracts";

export function uniqueStrings(values: readonly unknown[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => String(value ?? "").trim()).filter(Boolean))];
}

export function readEducationReferences(input: EducationalRenderingInput): QuantV4EducationReferenceSet {
  const source = input.educationTraceability;
  if (!source || typeof source !== "object") return {};
  const maybeWrapped = source as { references?: QuantV4EducationReferenceSet };
  const references = maybeWrapped.references ?? (source as QuantV4EducationReferenceSet);
  return {
    strategyIds: uniqueStrings(references.strategyIds),
    shortcutIds: uniqueStrings(references.shortcutIds),
    trapIds: uniqueStrings(references.trapIds),
    realismIds: uniqueStrings(references.realismIds),
    terminologyIds: uniqueStrings(references.terminologyIds),
    pedagogyRuleIds: uniqueStrings(references.pedagogyRuleIds),
  };
}

export function byIds<T extends { id?: string }>(items: readonly Partial<T>[] | undefined, ids: readonly string[] | undefined): T[] {
  const requested = new Set(uniqueStrings(ids));
  if (!requested.size) return [];
  return (items ?? []).filter((item): item is T => Boolean(item.id && requested.has(item.id)));
}

export function firstUsable<T extends { id?: string }>(items: readonly Partial<T>[] | undefined): T | undefined {
  return (items ?? []).find((item): item is T => Boolean(item.id));
}

export function relatedIds(
  links: readonly EducationalKnowledgeLink[] | undefined,
  sourceIds: readonly string[],
  relation?: EducationalKnowledgeLink["relation"],
): string[] {
  const sources = new Set(uniqueStrings(sourceIds));
  return uniqueStrings(
    (links ?? [])
      .filter((link) => sources.has(link.sourceId) && (!relation || link.relation === relation))
      .map((link) => link.targetId),
  );
}

export function extractReasoningNodes(reasoningGraph: EducationalRenderingInput["reasoningGraph"]): EducationalReasoningNode[] {
  if (Array.isArray(reasoningGraph)) return reasoningGraph as EducationalReasoningNode[];
  if (!reasoningGraph || typeof reasoningGraph !== "object") return [];
  const graph = reasoningGraph as EducationalReasoningGraphLike;
  if (Array.isArray(graph.steps)) return [...graph.steps];
  if (Array.isArray(graph.nodes)) return [...graph.nodes];
  return [];
}

export function searchableText(input: EducationalRenderingInput, assets?: EducationalAssetBundle): string {
  const nodes = extractReasoningNodes(input.reasoningGraph);
  return [
    input.stem,
    input.topic,
    input.taskKind,
    input.canonicalProblemId,
    ...nodes.flatMap((node) => [node.label, node.statement, node.expression, node.consequence, ...(node.tags ?? [])]),
    ...(assets?.knowledgeLinks ?? []).flatMap((link) => [link.sourceId, link.targetId, link.relation, link.rationale]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function hasAnyText(haystack: string, needles: readonly string[]) {
  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

export function normalizeTopic(value: unknown): string {
  return String(value ?? "general-quant").toLowerCase().replace(/\s+/g, "-");
}
