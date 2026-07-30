export type FamilyTreeGender = "male" | "female" | "unknown";

export type FamilyTreeNode = {
  id: string;
  label: string;
  gender: FamilyTreeGender;
  generation: number;
  roleLabel?: string;
};

export type FamilyTreeEdgeType = "marriage" | "parent-child" | "sibling";

export type FamilyTreeEdge = {
  id: string;
  type: FamilyTreeEdgeType;
  sourceId: string;
  targetId: string;
};

export type FamilyTreeQuery = {
  subjectId?: string;
  referenceId?: string;
  answerLabel?: string;
  pathPersonIds?: string[];
};

export type FamilyTreeDiagramData = {
  kind: "blood-relation-family-tree";
  version: 1;
  title?: string;
  nodes: FamilyTreeNode[];
  edges: FamilyTreeEdge[];
  query?: FamilyTreeQuery;
  accessibleSummary?: string;
  asciiFallback?: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isGender(value: unknown): value is FamilyTreeGender {
  return value === "male" || value === "female" || value === "unknown";
}

function isEdgeType(value: unknown): value is FamilyTreeEdgeType {
  return value === "marriage" || value === "parent-child" || value === "sibling";
}

function parseNode(value: unknown): FamilyTreeNode | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    !isGender(value.gender) ||
    typeof value.generation !== "number" ||
    !Number.isInteger(value.generation)
  ) {
    return null;
  }
  return {
    id: value.id,
    label: value.label,
    gender: value.gender,
    generation: value.generation,
    ...(typeof value.roleLabel === "string" ? { roleLabel: value.roleLabel } : {}),
  };
}

function parseEdge(value: unknown): FamilyTreeEdge | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
    !isEdgeType(value.type) ||
    typeof value.sourceId !== "string" ||
    typeof value.targetId !== "string"
  ) {
    return null;
  }
  return {
    id: value.id,
    type: value.type,
    sourceId: value.sourceId,
    targetId: value.targetId,
  };
}

function parseQuery(value: unknown): FamilyTreeQuery | undefined {
  if (!isRecord(value)) return undefined;
  const pathPersonIds = Array.isArray(value.pathPersonIds)
    ? value.pathPersonIds.filter((entry): entry is string => typeof entry === "string")
    : undefined;
  return {
    ...(typeof value.subjectId === "string" ? { subjectId: value.subjectId } : {}),
    ...(typeof value.referenceId === "string" ? { referenceId: value.referenceId } : {}),
    ...(typeof value.answerLabel === "string" ? { answerLabel: value.answerLabel } : {}),
    ...(pathPersonIds?.length ? { pathPersonIds } : {}),
  };
}

export function parseFamilyTreeDiagram(value: unknown): FamilyTreeDiagramData | null {
  const candidate = isRecord(value) && isRecord(value.familyTreeDiagram)
    ? value.familyTreeDiagram
    : value;
  if (!isRecord(candidate)) return null;
  if (candidate.kind !== "blood-relation-family-tree" || candidate.version !== 1) return null;
  if (!Array.isArray(candidate.nodes) || !Array.isArray(candidate.edges)) return null;

  const nodes = candidate.nodes.map(parseNode);
  const edges = candidate.edges.map(parseEdge);
  if (nodes.some((node) => node === null) || edges.some((edge) => edge === null)) return null;

  const safeNodes = nodes as FamilyTreeNode[];
  const safeEdges = edges as FamilyTreeEdge[];
  const nodeIds = new Set(safeNodes.map((node) => node.id));
  if (nodeIds.size !== safeNodes.length || safeNodes.length === 0) return null;
  if (safeEdges.some((edge) => !nodeIds.has(edge.sourceId) || !nodeIds.has(edge.targetId))) {
    return null;
  }

  return {
    kind: "blood-relation-family-tree",
    version: 1,
    ...(typeof candidate.title === "string" ? { title: candidate.title } : {}),
    nodes: safeNodes,
    edges: safeEdges,
    ...(parseQuery(candidate.query) ? { query: parseQuery(candidate.query) } : {}),
    ...(typeof candidate.accessibleSummary === "string"
      ? { accessibleSummary: candidate.accessibleSummary }
      : {}),
    ...(typeof candidate.asciiFallback === "string"
      ? { asciiFallback: candidate.asciiFallback }
      : {}),
  };
}
