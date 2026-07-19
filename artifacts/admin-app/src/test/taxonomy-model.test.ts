import { describe, expect, it } from 'vitest';

import type { TaxonomyCoverageRow, TaxonomyNode } from '@/features/taxonomy/api';
import {
  aggregateNodeCoverage,
  coveragePercent,
  coverageReadiness,
  nodeDepth,
  sortTaxonomyNodes,
} from '@/features/taxonomy/model';

function node(input: Partial<TaxonomyNode> & Pick<TaxonomyNode, 'id' | 'code' | 'nodeType' | 'name'>): TaxonomyNode {
  return {
    description: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    parents: [],
    children: [],
    examMappings: [],
    ...input,
  };
}

function coverage(input: Partial<TaxonomyCoverageRow> & Pick<TaxonomyCoverageRow, 'taxonomyNodeId' | 'examVersionId'>): TaxonomyCoverageRow {
  return {
    targetCoverage: null,
    isActive: true,
    totalQuestions: 0,
    publishedQuestions: 0,
    approvedQuestions: 0,
    reviewQuestions: 0,
    draftQuestions: 0,
    ...input,
  };
}

describe('taxonomy hierarchy model', () => {
  it('calculates hierarchy depth and deterministic sorting', () => {
    const subject = node({ id: 'subject', code: 'SUBJECT_QUANT', nodeType: 'subject', name: 'Quant' });
    const topic = node({
      id: 'topic',
      code: 'QUANT_PERCENTAGE',
      nodeType: 'topic',
      name: 'Percentage',
      parents: [{ id: 'subject', code: 'SUBJECT_QUANT', nodeType: 'subject', name: 'Quant', sortOrder: 0 }],
    });
    const chapter = node({
      id: 'chapter',
      code: 'PCT_001',
      nodeType: 'chapter',
      name: 'Percentage Basics',
      parents: [{ id: 'topic', code: 'QUANT_PERCENTAGE', nodeType: 'topic', name: 'Percentage', sortOrder: 0 }],
    });
    const nodes = [chapter, topic, subject];

    expect(nodeDepth(subject, nodes)).toBe(0);
    expect(nodeDepth(topic, nodes)).toBe(1);
    expect(nodeDepth(chapter, nodes)).toBe(2);
    expect(sortTaxonomyNodes(nodes).map((entry) => entry.id)).toEqual(['subject', 'topic', 'chapter']);
  });

  it('classifies coverage readiness', () => {
    expect(coverageReadiness({ totalQuestions: 0, targetCoverage: null })).toBe('unplanned');
    expect(coverageReadiness({ totalQuestions: 0, targetCoverage: 50 })).toBe('empty');
    expect(coverageReadiness({ totalQuestions: 20, targetCoverage: 50 })).toBe('behind');
    expect(coverageReadiness({ totalQuestions: 50, targetCoverage: 50 })).toBe('ready');
    expect(coverageReadiness({ totalQuestions: 60, targetCoverage: 50 })).toBe('exceeded');
    expect(coveragePercent(20, 50)).toBe(40);
  });

  it('aggregates active exam-version coverage for one node', () => {
    const rows = [
      coverage({ examVersionId: 'exam-1', taxonomyNodeId: 'topic', targetCoverage: 50, totalQuestions: 20, publishedQuestions: 10 }),
      coverage({ examVersionId: 'exam-2', taxonomyNodeId: 'topic', targetCoverage: 30, totalQuestions: 15, publishedQuestions: 5 }),
      coverage({ examVersionId: 'exam-3', taxonomyNodeId: 'topic', targetCoverage: 10, totalQuestions: 10, isActive: false }),
    ];

    expect(aggregateNodeCoverage('topic', rows)).toEqual({
      targetCoverage: 80,
      totalQuestions: 35,
      publishedQuestions: 15,
      mappedExamVersions: 2,
    });
  });
});
