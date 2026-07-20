import type { BlueprintSection, TestBlueprint, TestSeries } from './api';

export interface PlanningIssue {
  code: string;
  severity: 'blocker' | 'warning';
  message: string;
}

export function blueprintQuestionCount(blueprint: Pick<TestBlueprint, 'sections'>): number {
  return blueprint.sections.reduce((sum, section) => sum + Number(section.questionCount || 0), 0);
}

export function blueprintSectionDurationMinutes(section: BlueprintSection): number | null {
  return section.durationSeconds == null ? null : Number(section.durationSeconds) / 60;
}

export function blueprintIssues(blueprint: Pick<TestBlueprint, 'sections' | 'totalMarks' | 'durationSeconds'>): PlanningIssue[] {
  const issues: PlanningIssue[] = [];
  const sectionMarks = blueprint.sections.reduce((sum, section) => sum + Number(section.marks || 0), 0);
  if (Math.abs(sectionMarks - Number(blueprint.totalMarks)) > 0.001) {
    issues.push({ code: 'MARKS_MISMATCH', severity: 'blocker', message: `Section marks total ${sectionMarks}, expected ${blueprint.totalMarks}.` });
  }
  const timed = blueprint.sections.filter((section) => section.durationSeconds != null);
  if (timed.length > 0) {
    const sectionDuration = timed.reduce((sum, section) => sum + Number(section.durationSeconds || 0), 0);
    if (sectionDuration !== Number(blueprint.durationSeconds)) {
      issues.push({ code: 'DURATION_MISMATCH', severity: 'blocker', message: `Section timing totals ${Math.round(sectionDuration / 60)} minutes, expected ${Math.round(Number(blueprint.durationSeconds) / 60)}.` });
    }
  }
  for (const section of blueprint.sections) {
    const difficultyTotal = Object.values(section.selectionRules.difficulties || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    if (difficultyTotal !== Number(section.questionCount)) {
      issues.push({ code: `DIFFICULTY_${section.clientKey}`, severity: 'blocker', message: `${section.name} difficulty mix totals ${difficultyTotal}, expected ${section.questionCount}.` });
    }
    if (!section.selectionRules.taxonomyNodeIds?.length) {
      issues.push({ code: `TAXONOMY_${section.clientKey}`, severity: 'blocker', message: `${section.name} has no taxonomy target.` });
    }
  }
  return issues;
}

export function seriesIssues(series: Pick<TestSeries, 'items' | 'status'>): PlanningIssue[] {
  const issues: PlanningIssue[] = [];
  if (series.status === 'active' && series.items.length === 0) {
    issues.push({ code: 'ACTIVE_EMPTY', severity: 'blocker', message: 'Active series must contain at least one test.' });
  }
  const seen = new Set<string>();
  for (const item of series.items) {
    if (seen.has(item.testId)) issues.push({ code: `DUPLICATE_${item.testId}`, severity: 'blocker', message: `${item.publicCode} appears more than once.` });
    seen.add(item.testId);
    if (series.status === 'active' && !['qa_approved', 'scheduled', 'live', 'completed'].includes(item.status)) {
      issues.push({ code: `NOT_READY_${item.testId}`, severity: 'blocker', message: `${item.publicCode} is ${item.status.replace(/_/g, ' ')} and cannot be included in an active series.` });
    }
  }
  return issues;
}

export function moveSeriesItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
}

export function planningStatusTone(status: string): 'neutral' | 'info' | 'warning' | 'success' {
  if (status === 'active') return 'success';
  if (status === 'deprecated') return 'warning';
  if (status === 'draft') return 'info';
  return 'neutral';
}
