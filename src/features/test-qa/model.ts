import type {
  LiveTestDetail,
  LiveTestQuestion,
  LiveTestStatus,
  LiveTestSummary,
} from '@/features/test-builder/api';
import type { TestQaCollaboration } from './api';

export type TestQaSeverity = 'blocker' | 'warning' | 'info';

export interface TestQaCheck {
  code: string;
  label: string;
  passed: boolean;
  severity: TestQaSeverity;
  message: string;
}

export type TestQaQueueItem = LiveTestSummary & {
  collaboration: TestQaCollaboration | null;
  priority: number;
  ageHours: number;
};

export function testQaAgeHours(test: Pick<LiveTestSummary, 'updatedAt'>, now = Date.now()): number {
  const timestamp = new Date(test.updatedAt).getTime();
  return Number.isFinite(timestamp) ? Math.max(0, (now - timestamp) / 3_600_000) : 0;
}

export function testQaAgeBand(test: Pick<LiveTestSummary, 'updatedAt'>): 'fresh' | 'warning' | 'overdue' {
  const hours = testQaAgeHours(test);
  if (hours >= 72) return 'overdue';
  if (hours >= 24) return 'warning';
  return 'fresh';
}

export function formatTestQaAge(test: Pick<LiveTestSummary, 'updatedAt'>): string {
  const hours = testQaAgeHours(test);
  if (hours < 1) return 'Updated recently';
  if (hours < 24) return `${Math.floor(hours)}h in queue`;
  return `${Math.floor(hours / 24)}d in queue`;
}

function allQuestions(detail: LiveTestDetail): LiveTestQuestion[] {
  return detail.sections.flatMap((section) => section.questions);
}

function normalizedStem(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function buildTestQaChecks(
  detail: LiveTestDetail,
  collaboration: TestQaCollaboration | null,
): TestQaCheck[] {
  const questions = allQuestions(detail);
  const exactDuplicates = questions.filter((question, index, list) => (
    list.findIndex((candidate) => normalizedStem(candidate.stem) === normalizedStem(question.stem)) !== index
  ));
  const invalidAnswers = questions.filter((question) => {
    const correctOptions = question.options.filter((option) => option.isCorrect);
    return question.options.length < 2 || correctOptions.length !== 1;
  });
  const missingExplanations = questions.filter((question) => !question.explanation.trim());
  const instructions = detail.currentVersion?.instructions ?? {};
  const hasInstructions = Object.values(instructions).some((value) => (
    typeof value === 'string' ? value.trim().length > 0 : value != null
  ));

  const checks: TestQaCheck[] = [
    {
      code: 'QA_REVIEWER_ASSIGNED',
      label: 'Reviewer ownership',
      passed: Boolean(collaboration?.assignment.reviewerUserId),
      severity: 'blocker',
      message: collaboration?.assignment.reviewerName
        ? `Assigned to ${collaboration.assignment.reviewerName}.`
        : 'Assign a QA reviewer before approval.',
    },
    {
      code: 'QA_COMMENTS_RESOLVED',
      label: 'Review discussion resolved',
      passed: (collaboration?.openCommentCount ?? 0) === 0,
      severity: 'blocker',
      message: collaboration?.openCommentCount
        ? `${collaboration.openCommentCount} QA comment(s) remain open.`
        : 'No unresolved QA comments.',
    },
    {
      code: 'QA_SECTIONS_PRESENT',
      label: 'Sections present',
      passed: detail.sections.length > 0,
      severity: 'blocker',
      message: detail.sections.length > 0
        ? `${detail.sections.length} section(s) are configured.`
        : 'The test has no sections.',
    },
    {
      code: 'QA_QUESTIONS_PRESENT',
      label: 'Questions present',
      passed: questions.length > 0,
      severity: 'blocker',
      message: questions.length > 0
        ? `${questions.length} published question(s) are assigned.`
        : 'The test has no questions.',
    },
    {
      code: 'QA_NO_EXACT_DUPLICATES',
      label: 'No exact duplicate stems',
      passed: exactDuplicates.length === 0,
      severity: 'blocker',
      message: exactDuplicates.length
        ? `${exactDuplicates.length} duplicate question occurrence(s) were detected.`
        : 'No exact duplicate stems detected.',
    },
    {
      code: 'QA_VALID_ANSWERS',
      label: 'Answer models valid',
      passed: invalidAnswers.length === 0,
      severity: 'blocker',
      message: invalidAnswers.length
        ? `${invalidAnswers.length} question(s) have invalid options or correct-answer state.`
        : 'All questions have one valid correct option.',
    },
    {
      code: 'QA_EXPLANATIONS_PRESENT',
      label: 'Explanations present',
      passed: missingExplanations.length === 0,
      severity: 'warning',
      message: missingExplanations.length
        ? `${missingExplanations.length} question(s) are missing explanations.`
        : 'All questions include explanations.',
    },
    {
      code: 'QA_INSTRUCTIONS_PRESENT',
      label: 'Instructions configured',
      passed: hasInstructions,
      severity: 'warning',
      message: hasInstructions ? 'Candidate instructions are configured.' : 'Add candidate-facing instructions.',
    },
  ];

  for (const issue of detail.validationIssues) {
    checks.push({
      code: issue.code,
      label: issue.code.replace(/_/g, ' '),
      passed: false,
      severity: 'blocker',
      message: issue.message,
    });
  }
  return checks;
}

export function isTestQaReady(checks: TestQaCheck[]): boolean {
  return checks.every((check) => check.passed || check.severity !== 'blocker');
}

export function testQaPriority(test: LiveTestSummary, collaboration: TestQaCollaboration | null): number {
  const statusWeight: Record<LiveTestStatus, number> = {
    needs_fix: 900,
    under_qa: 800,
    content_ready: 700,
    draft: 600,
    qa_approved: 350,
    scheduled: 300,
    live: 100,
    completed: 50,
    archived: 0,
  };
  return (statusWeight[test.status] ?? 0)
    + Math.min(200, Math.floor(testQaAgeHours(test)))
    + (collaboration?.openCommentCount ?? 0) * 30
    + (collaboration?.assignment.reviewerUserId ? 0 : 20);
}

export function buildTestQaQueue(
  tests: LiveTestSummary[],
  collaboration: TestQaCollaboration[],
): TestQaQueueItem[] {
  const byKey = new Map(collaboration.map((item) => [`${item.testId}:${item.testVersionId}`, item]));
  return tests
    .filter((test) => test.status !== 'archived' && test.currentDraftVersionId)
    .map((test) => {
      const state = byKey.get(`${test.id}:${test.currentDraftVersionId}`) ?? null;
      return {
        ...test,
        collaboration: state,
        priority: testQaPriority(test, state),
        ageHours: testQaAgeHours(test),
      };
    })
    .sort((left, right) => right.priority - left.priority || (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    ));
}
