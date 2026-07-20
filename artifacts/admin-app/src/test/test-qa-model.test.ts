import { describe, expect, it } from 'vitest';

import type { LiveTestDetail, LiveTestSummary } from '@/features/test-builder/api';
import type { TestQaCollaboration } from '@/features/test-qa/api';
import { buildTestQaChecks, buildTestQaQueue, isTestQaReady } from '@/features/test-qa/model';

const summary: LiveTestSummary = {
  id: 'test-1',
  publicCode: 'T-1',
  status: 'under_qa',
  examVersionId: 'exam-v1',
  currentDraftVersionId: 'version-1',
  publishedVersionId: null,
  createdAt: '2026-07-19T00:00:00.000Z',
  updatedAt: '2026-07-19T00:00:00.000Z',
  examCode: 'SSC_CGL',
  examName: 'SSC CGL',
  examFamilyName: 'SSC',
  versionNumber: 1,
  title: 'Mock Test 1',
  description: null,
  durationSeconds: 3600,
  totalMarks: 2,
  settings: {},
  sectionCount: 1,
  questionCount: 1,
  scheduledAt: null,
  publishedAt: null,
};

const collaboration: TestQaCollaboration = {
  testId: 'test-1',
  testVersionId: 'version-1',
  assignment: {
    reviewerUserId: 'reviewer-1',
    reviewerName: 'Reviewer',
    assignedAt: '2026-07-20T00:00:00.000Z',
    assignedByUserId: 'reviewer-1',
    assignedByName: 'Reviewer',
    reason: 'QA ownership',
  },
  comments: [],
  openCommentCount: 0,
};

const detail: LiveTestDetail = {
  test: {
    id: 'test-1',
    publicCode: 'T-1',
    status: 'under_qa',
    examVersionId: 'exam-v1',
    currentDraftVersionId: 'version-1',
    publishedVersionId: null,
    createdBy: null,
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    examId: 'exam-1',
    examCode: 'SSC_CGL',
    examName: 'SSC CGL',
    examFamilyId: 'family-1',
    examFamilyCode: 'SSC',
    examFamilyName: 'SSC',
  },
  versions: [],
  currentVersion: {
    id: 'version-1',
    versionNumber: 1,
    title: 'Mock Test 1',
    description: null,
    durationSeconds: 3600,
    totalMarks: 2,
    instructions: { text: 'Read all instructions carefully.' },
    settings: {},
    changeReason: 'Initial',
    createdBy: null,
    createdAt: summary.createdAt,
    sectionCount: 1,
    questionCount: 1,
  },
  sections: [{
    id: 'section-1',
    name: 'Quant',
    sectionKey: 'quant',
    sortOrder: 1,
    durationSeconds: 3600,
    settings: {},
    questions: [{
      testSectionId: 'section-1',
      questionVersionId: 'question-version-1',
      position: 1,
      marks: 2,
      negativeMarks: 0.5,
      settings: {},
      questionId: 'question-1',
      publicCode: 'Q-1',
      questionType: 'mcq_single',
      difficulty: 'Medium',
      stem: 'What is twenty percent of five hundred?',
      explanation: 'Twenty percent of five hundred is one hundred.',
      answerModel: {},
      options: [
        { id: 'a', key: 'A', text: '80', sortOrder: 1, isCorrect: false },
        { id: 'b', key: 'B', text: '100', sortOrder: 2, isCorrect: true },
      ],
    }],
  }],
  publications: [],
  auditEvents: [],
  validationIssues: [],
  generatedAt: '2026-07-20T00:00:00.000Z',
};

describe('canonical Test QA model', () => {
  it('marks complete assigned tests as QA ready', () => {
    const checks = buildTestQaChecks(detail, collaboration);
    expect(isTestQaReady(checks)).toBe(true);
    expect(checks.filter((check) => !check.passed && check.severity === 'blocker')).toHaveLength(0);
  });

  it('blocks approval when comments are unresolved', () => {
    const checks = buildTestQaChecks(detail, { ...collaboration, openCommentCount: 2 });
    expect(isTestQaReady(checks)).toBe(false);
    expect(checks.some((check) => check.code === 'QA_COMMENTS_RESOLVED' && !check.passed)).toBe(true);
  });

  it('prioritises needs-fix tests ahead of approved tests', () => {
    const queue = buildTestQaQueue([
      { ...summary, id: 'approved', status: 'qa_approved', currentDraftVersionId: 'v-approved' },
      { ...summary, id: 'fix', status: 'needs_fix', currentDraftVersionId: 'v-fix' },
    ], []);
    expect(queue[0]?.id).toBe('fix');
  });
});
