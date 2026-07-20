import { describe, expect, it } from 'vitest';

import type { TestBlueprint, TestSeries } from '@/features/test-planning/api';
import {
  blueprintIssues,
  blueprintQuestionCount,
  moveSeriesItem,
  seriesIssues,
} from '@/features/test-planning/model';

function blueprint(): TestBlueprint {
  return {
    id: 'bp-1',
    examVersionId: 'exam-1',
    code: 'BP-1',
    name: 'Blueprint',
    currentVersionNumber: 1,
    createdBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examCode: 'SSC',
    examName: 'SSC CGL',
    examFamilyName: 'SSC',
    versionId: 'bpv-1',
    durationSeconds: 3600,
    totalMarks: 100,
    instructions: {},
    configuration: { status: 'draft' },
    changeReason: 'create',
    versionCreatedAt: new Date().toISOString(),
    versionCount: 1,
    sections: [
      {
        clientKey: 'quant',
        name: 'Quant',
        questionCount: 25,
        marks: 50,
        durationSeconds: 1800,
        selectionRules: {
          taxonomyNodeIds: ['node-1'],
          languageCode: 'en',
          negativeMarks: 0.5,
          difficulties: { easy: 8, medium: 12, hard: 5 },
        },
      },
      {
        clientKey: 'reasoning',
        name: 'Reasoning',
        questionCount: 25,
        marks: 50,
        durationSeconds: 1800,
        selectionRules: {
          taxonomyNodeIds: ['node-2'],
          languageCode: 'en',
          negativeMarks: 0.5,
          difficulties: { easy: 8, medium: 12, hard: 5 },
        },
      },
    ],
  };
}

function series(status: TestSeries['status'] = 'active'): TestSeries {
  return {
    id: 'series-1',
    examVersionId: 'exam-1',
    code: 'SER-1',
    name: 'Series',
    currentVersionNumber: 1,
    createdBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examCode: 'SSC',
    examName: 'SSC CGL',
    examFamilyName: 'SSC',
    versionId: 'sv-1',
    status,
    description: '',
    validityDays: 365,
    progressionRules: {},
    settings: {},
    changeReason: 'create',
    versionCreatedAt: new Date().toISOString(),
    versionCount: 1,
    items: [
      {
        testId: 'test-1',
        sortOrder: 1,
        accessMode: 'free',
        availability: {},
        publicCode: 'T-1',
        status: 'qa_approved',
        title: 'Test 1',
        questionCount: 100,
        durationSeconds: 3600,
        totalMarks: 200,
      },
    ],
  };
}

describe('test planning readiness', () => {
  it('calculates blueprint totals and accepts exact quotas', () => {
    const value = blueprint();
    expect(blueprintQuestionCount(value)).toBe(50);
    expect(blueprintIssues(value)).toEqual([]);
  });

  it('detects difficulty mismatch', () => {
    const value = blueprint();
    value.sections[0]!.selectionRules.difficulties = { easy: 5, medium: 5, hard: 5 };
    expect(blueprintIssues(value).some((issue) => issue.code === 'DIFFICULTY_quant')).toBe(true);
  });

  it('accepts an active series containing QA-ready tests', () => {
    expect(seriesIssues(series())).toEqual([]);
  });

  it('blocks non-ready tests from active series', () => {
    const value = series();
    value.items[0]!.status = 'draft';
    expect(seriesIssues(value).some((issue) => issue.code === 'NOT_READY_test-1')).toBe(true);
  });

  it('reorders series membership without mutation', () => {
    const source = ['a', 'b', 'c'];
    const moved = moveSeriesItem(source, 1, -1);
    expect(moved).toEqual(['b', 'a', 'c']);
    expect(source).toEqual(['a', 'b', 'c']);
  });
});
