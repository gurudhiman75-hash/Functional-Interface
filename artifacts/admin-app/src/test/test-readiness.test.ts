import { describe, expect, it } from 'vitest';

import { blockers, evaluateReadiness, warnings, type ReadinessDraft, type ReadinessQuestionInfo } from '@/features/test-builder/readiness';

const ids = (n: number, prefix = 'q') => Array.from({ length: n }, (_, i) => `${prefix}${i}`);
const base = (over: Partial<ReadinessDraft> = {}): ReadinessDraft => ({
  examVersionId: 'exam', title: 'Mock 1', durationMinutes: 10, marksPerQuestion: 2, negativeMarks: 0.5, languageCode: 'en',
  sections: [{ name: 'Quant', durationMinutes: '', questionVersionIds: ids(10) }],
  ...over,
});
const codes = (items: { code: string }[]) => items.map((i) => i.code);

describe('test readiness', () => {
  it('passes a complete English test', () => {
    const items = evaluateReadiness({ draft: base(), examLanguages: ['en'], questions: new Map() });
    expect(blockers(items)).toEqual([]);
  });

  it('blocks when the exam has no languages, with a fix', () => {
    const items = evaluateReadiness({ draft: base(), examLanguages: [], questions: new Map() });
    const item = items.find((i) => i.code === 'EXAM_HAS_NO_LANGUAGES');
    expect(item?.level).toBe('blocker');
    expect(item?.fix).toBe('allow-exam-language');
  });

  it('blocks a language the exam does not allow', () => {
    const items = evaluateReadiness({ draft: base({ languageCode: 'pa' }), examLanguages: ['en', 'hi'], questions: new Map() });
    expect(codes(blockers(items))).toContain('LANGUAGE_NOT_ALLOWED');
  });

  it('blocks empty sections, duplicates and bad section timing', () => {
    const draft = base({
      durationMinutes: 30,
      sections: [
        { name: 'A', durationMinutes: '10', questionVersionIds: ['x', 'x'] },
        { name: 'B', durationMinutes: '10', questionVersionIds: [] },
      ],
    });
    expect(codes(blockers(evaluateReadiness({ draft, examLanguages: ['en'], questions: new Map() }))))
      .toEqual(expect.arrayContaining(['EMPTY_SECTION', 'DUPLICATE_QUESTION', 'SECTION_TIME_TOTAL']));
  });

  it('warns but does not block on answer imbalance, overuse and one difficulty', () => {
    const questions = new Map<string, ReadinessQuestionInfo>(ids(10).map((id) => [id, { correctOptionKey: 'B', usedInTests: 4, difficulty: 'easy' }]));
    const items = evaluateReadiness({ draft: base(), examLanguages: ['en'], questions });
    expect(blockers(items)).toEqual([]);
    expect(codes(warnings(items))).toEqual(expect.arrayContaining(['ANSWER_BALANCE', 'OVERUSED', 'ONE_DIFFICULTY']));
  });

  it('warns about missing translations for a Hindi test', () => {
    const questions = new Map<string, ReadinessQuestionInfo>([['q0', { languages: ['en'] }], ['q1', { languages: ['en', 'hi'] }]]);
    const items = evaluateReadiness({ draft: base({ languageCode: 'hi' }), examLanguages: ['en', 'hi'], questions });
    expect(warnings(items).find((i) => i.code === 'MISSING_TRANSLATION')?.message).toMatch(/^1 question/);
  });
});
