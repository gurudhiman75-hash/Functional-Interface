import type {
  TaxonomyCoverageRow,
  TaxonomyNode,
  TaxonomyNodeType,
} from './api';

export const TAXONOMY_TYPE_LABELS: Record<TaxonomyNodeType, string> = {
  subject: 'Subject',
  section: 'Section',
  topic: 'Topic',
  subtopic: 'Subtopic',
  chapter: 'Chapter',
  canonical_problem: 'Canonical problem',
  skill: 'Skill',
};

export const TAXONOMY_TYPE_ORDER: TaxonomyNodeType[] = [
  'subject',
  'section',
  'topic',
  'subtopic',
  'chapter',
  'canonical_problem',
  'skill',
];

export type CoverageReadiness = 'unplanned' | 'empty' | 'behind' | 'ready' | 'exceeded';

export function coveragePercent(actual: number, target: number | null): number | null {
  if (target === null || target <= 0) return null;
  return Math.min(999, Math.round((actual / target) * 100));
}

export function coverageReadiness(row: Pick<TaxonomyCoverageRow, 'totalQuestions' | 'targetCoverage'>): CoverageReadiness {
  if (row.targetCoverage === null || row.targetCoverage <= 0) return 'unplanned';
  if (row.totalQuestions === 0) return 'empty';
  if (row.totalQuestions < row.targetCoverage) return 'behind';
  if (row.totalQuestions === row.targetCoverage) return 'ready';
  return 'exceeded';
}

export function nodeDepth(node: TaxonomyNode, nodes: TaxonomyNode[]): number {
  const byId = new Map(nodes.map((entry) => [entry.id, entry]));
  const seen = new Set<string>();
  const visit = (current: TaxonomyNode): number => {
    if (seen.has(current.id)) return 0;
    seen.add(current.id);
    const parentDepth = current.parents.reduce((max, parent) => {
      const parentNode = byId.get(parent.id);
      return parentNode ? Math.max(max, visit(parentNode) + 1) : max;
    }, 0);
    seen.delete(current.id);
    return parentDepth;
  };
  return visit(node);
}

export function sortTaxonomyNodes(nodes: TaxonomyNode[]): TaxonomyNode[] {
  const typeIndex = new Map(TAXONOMY_TYPE_ORDER.map((type, index) => [type, index]));
  return [...nodes].sort((left, right) => {
    const depthDifference = nodeDepth(left, nodes) - nodeDepth(right, nodes);
    if (depthDifference !== 0) return depthDifference;
    const typeDifference = (typeIndex.get(left.nodeType) ?? 999) - (typeIndex.get(right.nodeType) ?? 999);
    if (typeDifference !== 0) return typeDifference;
    return left.name.localeCompare(right.name);
  });
}

export function aggregateNodeCoverage(
  nodeId: string,
  coverageRows: TaxonomyCoverageRow[],
): {
  targetCoverage: number;
  totalQuestions: number;
  publishedQuestions: number;
  mappedExamVersions: number;
} {
  const rows = coverageRows.filter((row) => row.taxonomyNodeId === nodeId && row.isActive);
  return rows.reduce(
    (summary, row) => ({
      targetCoverage: summary.targetCoverage + (row.targetCoverage ?? 0),
      totalQuestions: summary.totalQuestions + row.totalQuestions,
      publishedQuestions: summary.publishedQuestions + row.publishedQuestions,
      mappedExamVersions: summary.mappedExamVersions + 1,
    }),
    { targetCoverage: 0, totalQuestions: 0, publishedQuestions: 0, mappedExamVersions: 0 },
  );
}
