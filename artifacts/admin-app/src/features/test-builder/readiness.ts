/**
 * Readiness checks for the Tests workspace.
 *
 * Blockers stop Publish/Schedule. Warnings are shown and confirmed once, but
 * never block: the admin decides. The server still validates on publish.
 */

export interface ReadinessSection {
  name: string;
  durationMinutes: string;
  questionVersionIds: string[];
}

export interface ReadinessDraft {
  examVersionId: string;
  title: string;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarks: number;
  languageCode: string;
  sections: ReadinessSection[];
}

/** What the workspace knows about each selected question (from the test or the picker). */
export interface ReadinessQuestionInfo {
  difficulty?: string;
  correctOptionKey?: string | null;
  usedInTests?: number;
  languages?: string[];
}

export type ReadinessFix = 'allow-exam-language';

export interface ReadinessItem {
  level: 'blocker' | 'warning';
  code: string;
  message: string;
  fix?: ReadinessFix;
}

export interface ReadinessInput {
  draft: ReadinessDraft;
  /** Language codes allowed for the selected exam version; null while unknown. */
  examLanguages: string[] | null;
  questions: Map<string, ReadinessQuestionInfo>;
}

const OVERUSED_THRESHOLD = 3;

export function evaluateReadiness({ draft, examLanguages, questions }: ReadinessInput): ReadinessItem[] {
  const items: ReadinessItem[] = [];
  const block = (code: string, message: string, fix?: ReadinessFix) => items.push({ level: 'blocker', code, message, fix });
  const warn = (code: string, message: string) => items.push({ level: 'warning', code, message });

  if (!draft.examVersionId) block('EXAM_REQUIRED', 'Choose the exam this test is for.');
  if (draft.title.trim().length < 3) block('TITLE_REQUIRED', 'Give the test a title (at least 3 characters).');

  const language = (draft.languageCode || 'en').toLowerCase();
  if (draft.examVersionId && examLanguages) {
    if (examLanguages.length === 0) {
      block('EXAM_HAS_NO_LANGUAGES', 'This exam has no languages set up, so no test under it can be published.', 'allow-exam-language');
    } else if (!examLanguages.includes(language)) {
      block('LANGUAGE_NOT_ALLOWED', `This exam does not allow ${language.toUpperCase()} tests yet.`, 'allow-exam-language');
    }
  }

  const all = draft.sections.flatMap((section) => section.questionVersionIds);
  if (all.length === 0) block('NO_QUESTIONS', 'Add at least one question.');
  draft.sections.forEach((section, index) => {
    const label = section.name.trim() || `Section ${index + 1}`;
    if (!section.name.trim()) block('SECTION_NAME', `Section ${index + 1} needs a name.`);
    if (section.questionVersionIds.length === 0 && all.length > 0) block('EMPTY_SECTION', `${label} has no questions.`);
  });
  if (new Set(all).size !== all.length) block('DUPLICATE_QUESTION', 'The same question appears more than once.');

  if (!(draft.marksPerQuestion > 0)) block('MARKS', 'Marks per question must be more than 0.');
  if (draft.negativeMarks < 0 || draft.negativeMarks > draft.marksPerQuestion) {
    block('NEGATIVE_MARKS', 'Negative marks must be between 0 and the marks per question.');
  }

  const timed = draft.sections.filter((section) => section.durationMinutes !== '');
  if (timed.length > 0 && timed.length < draft.sections.length) {
    block('SECTION_TIME', 'Give every section a time, or leave all blank for one shared timer.');
  } else if (timed.length > 0) {
    const total = timed.reduce((sum, section) => sum + Number(section.durationMinutes || 0), 0);
    if (Math.abs(total - draft.durationMinutes) > 0.001) {
      block('SECTION_TIME_TOTAL', `Section times add up to ${total} min but the test is ${draft.durationMinutes} min.`);
    }
  }

  // ---- Warnings (never block) ----
  if (all.length > 0 && draft.durationMinutes > 0) {
    const secondsPerQuestion = (draft.durationMinutes * 60) / all.length;
    if (secondsPerQuestion < 20) warn('TIME_TIGHT', `Only ${Math.round(secondsPerQuestion)} seconds per question.`);
    if (secondsPerQuestion > 300) warn('TIME_LOOSE', `${Math.round(secondsPerQuestion / 60)} minutes per question — check the duration.`);
  }

  const overused = all.filter((id) => (questions.get(id)?.usedInTests ?? 0) >= OVERUSED_THRESHOLD).length;
  if (overused > 0) warn('OVERUSED', `${overused} question${overused === 1 ? ' is' : 's are'} already in ${OVERUSED_THRESHOLD}+ published tests.`);

  const keys = all.map((id) => questions.get(id)?.correctOptionKey).filter((key): key is string => !!key);
  if (keys.length >= 8) {
    const counts = new Map<string, number>();
    keys.forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1));
    const [topKey, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCount / keys.length > 0.4) {
      warn('ANSWER_BALANCE', `${Math.round((topCount / keys.length) * 100)}% of answers are option ${topKey}.`);
    }
  }

  const levels = all.map((id) => questions.get(id)?.difficulty?.toLowerCase()).filter((level): level is string => !!level);
  if (levels.length >= 10 && new Set(levels).size === 1) warn('ONE_DIFFICULTY', `Every question is ${levels[0]}.`);

  if (language !== 'en') {
    const missing = all.filter((id) => {
      const langs = questions.get(id)?.languages;
      return langs && !langs.includes(language);
    }).length;
    if (missing > 0) warn('MISSING_TRANSLATION', `${missing} question${missing === 1 ? ' has' : 's have'} no approved ${language.toUpperCase()} version.`);
  }

  return items;
}

export function blockers(items: ReadinessItem[]) {
  return items.filter((item) => item.level === 'blocker');
}
export function warnings(items: ReadinessItem[]) {
  return items.filter((item) => item.level === 'warning');
}
