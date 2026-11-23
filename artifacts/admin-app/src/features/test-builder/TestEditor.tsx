import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, Archive, CalendarClock, CheckCircle2, Eye, History, Loader2, Pencil, Plus, Rocket, RotateCcw, Save, Sparkles, Trash2, Wrench,
} from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { getTranslationOverview, updateExamVersionLanguages } from '@/features/translations/api';
import { assembleBlueprint, getBlueprints, type BlueprintSummary } from '@/features/test-blueprints/api';
import {
  autoAssembleTest, createLiveTest, getLiveTest, getQuestionReadinessInfo, saveLiveTestDraft, transitionLiveTest,
  type LiveTestDetail, type PickerQuestion, type TestCatalogExamVersion, type TestDraftInput,
} from './api';
import {
  ACTIVE_ATTEMPTS_WARNING, canPublish, canSchedule, hasUnpublishedChanges, publishAction, runPublishAction,
  scheduleAction, statusBadgeClass, statusGroup, statusLabel,
} from './lifecycle';
import { ExamLanguagesPanel } from './ExamLanguagesPanel';
import { QuestionPicker } from './QuestionPicker';
import { blockers, evaluateReadiness, warnings, type ReadinessItem, type ReadinessQuestionInfo } from './readiness';

interface EditorSection { clientKey: string; name: string; durationMinutes: string; questionVersionIds: string[] }
interface EditorDraft {
  examVersionId: string; title: string; description: string; durationMinutes: number;
  marksPerQuestion: number; negativeMarks: number; testType: string; languageCode: string; access: string;
  lockCompletedSections: boolean; difficulty: string; instructions: string; sections: EditorSection[];
}
interface QuestionCard {
  versionId: string; questionId?: string; publicCode: string; stem: string; difficulty: string;
  options: Array<{ key: string; text: string; isCorrect?: boolean }>;
  usedInTests?: number; languages?: string[]; correctOptionKey?: string | null;
}

const newKey = () => `section-${Date.now()}-${Math.round(Math.random() * 1000)}`;
const freshDraft = (): EditorDraft => ({
  examVersionId: '', title: '', description: '', durationMinutes: 60, marksPerQuestion: 2, negativeMarks: 0.5,
  testType: 'full_mock', languageCode: 'en', access: 'premium', lockCompletedSections: false, difficulty: 'Moderate',
  instructions: 'Read every question carefully. Submit the test before the timer ends.',
  sections: [{ clientKey: 'section-1', name: 'Section 1', durationMinutes: '', questionVersionIds: [] }],
});
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {});
const str = (s: Record<string, unknown>, k: string, d: string) => (typeof s[k] === 'string' ? String(s[k]) : d);

function fromDetail(detail: LiveTestDetail): EditorDraft {
  const v = detail.currentVersion;
  if (!v) return freshDraft();
  const settings = rec(v.settings);
  const first = detail.sections.flatMap((s) => s.questions)[0];
  return {
    examVersionId: detail.test.examVersionId, title: v.title, description: v.description ?? '',
    durationMinutes: v.durationSeconds / 60, marksPerQuestion: first?.marks ?? 2, negativeMarks: first?.negativeMarks ?? 0.5,
    testType: str(settings, 'testType', 'full_mock'), languageCode: str(settings, 'languageCode', 'en'),
    access: str(settings, 'access', 'premium'), lockCompletedSections: settings.lockCompletedSections === true,
    difficulty: str(settings, 'difficulty', 'Moderate'),
    instructions: typeof rec(v.instructions).text === 'string' ? String(rec(v.instructions).text) : '',
    sections: detail.sections.length
      ? detail.sections.map((s) => ({
          clientKey: s.sectionKey, name: s.name,
          durationMinutes: s.durationSeconds == null ? '' : String(s.durationSeconds / 60),
          questionVersionIds: s.questions.map((q) => q.questionVersionId),
        }))
      : freshDraft().sections,
  };
}

function cardsFromDetail(detail: LiveTestDetail): Map<string, QuestionCard> {
  const map = new Map<string, QuestionCard>();
  detail.sections.forEach((s) => s.questions.forEach((q) => map.set(q.questionVersionId, {
    versionId: q.questionVersionId, questionId: q.questionId, publicCode: q.publicCode, stem: q.stem, difficulty: q.difficulty,
    options: q.options.map((o) => ({ key: o.key, text: o.text, isCorrect: o.isCorrect })),
  })));
  return map;
}

function errorDetails(error: unknown): string[] {
  const details = error && typeof error === 'object' ? (error as { details?: unknown }).details : null;
  const list = Array.isArray(details) ? details : Array.isArray(rec(details).issues) ? rec(details).issues as unknown[] : [];
  return list.map((item) => rec(item).message).filter((m): m is string => typeof m === 'string');
}

interface Props {
  testId: string | null;
  catalog: TestCatalogExamVersion[];
  onCatalogChanged: () => Promise<void>;
  onSaved: (testId: string) => void;
  onChanged: () => void;
}

export function TestEditor({ testId, catalog, onCatalogChanged, onSaved, onChanged }: Props) {
  const { hasPermission } = useAdminPermissions();
  const canSetAccess = hasPermission('commerce.products.manage');
  const canEditQuestions = hasPermission('content.questions.update');
  const canManageLanguages = hasPermission('settings.languages.manage');

  const [detail, setDetail] = useState<LiveTestDetail | null>(null);
  const [draft, setDraft] = useState<EditorDraft>(freshDraft);
  const [baseline, setBaseline] = useState(JSON.stringify(freshDraft()));
  const [cards, setCards] = useState<Map<string, QuestionCard>>(new Map());
  const [activeKey, setActiveKey] = useState('section-1');
  const [view, setView] = useState<'build' | 'preview' | 'history'>('build');
  const [loading, setLoading] = useState(!!testId);
  const [busy, setBusy] = useState<'' | 'save' | 'publish' | 'schedule' | 'archive' | 'restore' | 'fill' | 'fix'>('');
  const [loadError, setLoadError] = useState('');
  const [serverIssues, setServerIssues] = useState<string[]>([]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleAt, setScheduleAt] = useState('');
  const [fillCount, setFillCount] = useState(25);
  const [blueprints, setBlueprints] = useState<BlueprintSummary[]>([]);
  const [patternId, setPatternId] = useState('');

  useEffect(() => {
    if (testId) return;
    getBlueprints().then(({ blueprints: list }) => setBlueprints(list.filter((b) => !b.deletedAt))).catch(() => setBlueprints([]));
  }, [testId]);

  const loadedIdRef = useRef<string | null>(null);
  const apply = (next: LiveTestDetail) => {
    loadedIdRef.current = next.test.id;
    const d = fromDetail(next);
    setDetail(next);
    setDraft(d);
    setBaseline(JSON.stringify(d));
    setCards((current) => new Map([...current, ...cardsFromDetail(next)]));
    setActiveKey((key) => (d.sections.some((s) => s.clientKey === key) ? key : d.sections[0]?.clientKey ?? 'section-1'));
    setServerIssues(next.validationIssues.filter((i) => !i.code.startsWith('STRUCTURE_')).map((i) => i.message));
    enrich(next.sections.flatMap((s) => s.questions.map((q) => q.questionVersionId)), next.test.id);
  };

  /** Load usage, languages and answer key for questions so readiness warnings cover them. */
  const enrich = (ids: string[], excludeTestId?: string) => {
    if (!ids.length) return;
    getQuestionReadinessInfo(ids, excludeTestId)
      .then(({ questions }) => setCards((current) => {
        const merged = new Map(current);
        questions.forEach((info) => {
          const card = merged.get(info.versionId);
          if (card) merged.set(info.versionId, { ...card, usedInTests: info.usedInTests, languages: info.languages, correctOptionKey: info.correctOptionKey, difficulty: card.difficulty || info.difficulty });
        });
        return merged;
      }))
      .catch(() => undefined);
  };

  useEffect(() => {
    let cancelled = false;
    // A test we just created in this editor is already loaded; don't reload over it.
    if (testId && loadedIdRef.current === testId) return;
    setLoadError('');
    setServerIssues([]);
    setView('build');
    setScheduleOpen(false);
    if (!testId) {
      const d = freshDraft();
      loadedIdRef.current = null;
      setDetail(null); setDraft(d); setBaseline(JSON.stringify(d)); setActiveKey('section-1'); setLoading(false);
      return;
    }
    setLoading(true);
    getLiveTest(testId)
      .then((next) => { if (!cancelled) apply(next); })
      .catch((error) => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load this test.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [testId]);

  const dirty = JSON.stringify(draft) !== baseline;
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const exam = catalog.find((e) => e.id === draft.examVersionId);
  const examLanguages = exam ? exam.languages.map((l) => l.code.toLowerCase()) : null;
  const active = draft.sections.find((s) => s.clientKey === activeKey) ?? draft.sections[0];
  const allIds = draft.sections.flatMap((s) => s.questionVersionIds);
  const totalMarks = allIds.length * draft.marksPerQuestion;

  const readinessInfo = useMemo(() => {
    const map = new Map<string, ReadinessQuestionInfo>();
    cards.forEach((c, id) => map.set(id, {
      difficulty: c.difficulty, usedInTests: c.usedInTests, languages: c.languages,
      correctOptionKey: c.correctOptionKey ?? c.options.find((o) => o.isCorrect)?.key ?? null,
    }));
    return map;
  }, [cards]);
  const readiness = evaluateReadiness({ draft, examLanguages, questions: readinessInfo });
  const blocking = blockers(readiness);
  const warningItems = warnings(readiness);

  const status = detail?.test.status ?? 'draft';
  const group = statusGroup(status);
  const changes = detail ? hasUnpublishedChanges(detail.test) : false;
  const isLive = status === 'live';
  const publishable = !detail || canPublish(detail.test) || dirty;
  const publishLabel = isLive ? 'Publish changes' : 'Publish now';

  const setField = <K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setSection = (key: string, patch: Partial<EditorSection>) =>
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.clientKey === key ? { ...s, ...patch } : s)) }));

  const addSection = () => {
    const key = newKey();
    setDraft((d) => ({ ...d, sections: [...d.sections, { clientKey: key, name: `Section ${d.sections.length + 1}`, durationMinutes: '', questionVersionIds: [] }] }));
    setActiveKey(key);
  };
  const removeSection = (key: string) => {
    const section = draft.sections.find((s) => s.clientKey === key);
    if (!section || draft.sections.length <= 1) return;
    if (section.questionVersionIds.length && !window.confirm(`Remove ${section.name} and its ${section.questionVersionIds.length} questions?`)) return;
    const rest = draft.sections.filter((s) => s.clientKey !== key);
    setDraft((d) => ({ ...d, sections: rest }));
    if (activeKey === key) setActiveKey(rest[0].clientKey);
  };

  const addQuestion = (q: PickerQuestion) => {
    if (!active) return;
    setCards((m) => new Map(m).set(q.versionId, {
      versionId: q.versionId, questionId: q.questionId, publicCode: q.publicCode, stem: q.stem, difficulty: q.difficulty,
      options: q.options.map((o) => ({ key: o.key, text: o.text, isCorrect: o.isCorrect })), usedInTests: q.usedInTests, languages: q.languages,
    }));
    setDraft((d) => (d.sections.some((s) => s.questionVersionIds.includes(q.versionId)) ? d : {
      ...d, sections: d.sections.map((s) => (s.clientKey === active.clientKey ? { ...s, questionVersionIds: [...s.questionVersionIds, q.versionId] } : s)),
    }));
  };
  const removeQuestion = (id: string) =>
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => ({ ...s, questionVersionIds: s.questionVersionIds.filter((x) => x !== id) })) }));
  const moveQuestion = (id: string, dir: -1 | 1) => {
    if (!active) return;
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.clientKey !== active.clientKey) return s;
        const list = [...s.questionVersionIds];
        const from = list.indexOf(id);
        const to = from + dir;
        if (from < 0 || to < 0 || to >= list.length) return s;
        [list[from], list[to]] = [list[to], list[from]];
        return { ...s, questionVersionIds: list };
      }),
    }));
  };

  const payload = (): TestDraftInput => ({
    expectedCurrentDraftVersionId: detail?.test.currentDraftVersionId ?? null,
    examVersionId: draft.examVersionId, title: draft.title.trim(), description: draft.description,
    durationMinutes: draft.durationMinutes, totalMarks,
    instructions: { text: draft.instructions },
    settings: {
      testType: draft.testType, languageCode: draft.languageCode, difficulty: draft.difficulty, access: draft.access,
      ...(!detail && canSetAccess ? { initialAccessMode: draft.access } : {}),
      lockCompletedSections: draft.lockCompletedSections,
      sectionTiming: draft.sections.some((s) => s.durationMinutes !== '') ? 'sectional' : 'shared',
      navigationRules: { switchSections: true, markForReview: true },
    },
    changeReason: detail ? 'Saved from Tests workspace' : 'Created in Tests workspace',
    sections: draft.sections.map((s) => ({
      clientKey: s.clientKey, name: s.name.trim(),
      durationMinutes: s.durationMinutes === '' ? null : Number(s.durationMinutes), settings: {},
      questions: s.questionVersionIds.map((id) => ({ questionVersionId: id, marks: draft.marksPerQuestion, negativeMarks: draft.negativeMarks, settings: {} })),
    })),
  });

  /** Save if needed; returns the up-to-date detail. */
  const persist = async (): Promise<LiveTestDetail | null> => {
    if (detail && !dirty) return detail;
    if (!draft.examVersionId || draft.title.trim().length < 3) {
      showToast.warning('Not saved yet', 'Choose an exam and enter a title first.');
      return null;
    }
    try {
      const next = detail ? await saveLiveTestDraft(detail.test.id, payload()) : await createLiveTest(payload());
      apply(next);
      onChanged();
      if (!detail) onSaved(next.test.id);
      return next;
    } catch (error) {
      setServerIssues(errorDetails(error));
      showToast.error('Could not save', error instanceof Error ? error.message : 'Save failed.');
      return null;
    }
  };

  const save = async () => {
    setBusy('save');
    const next = await persist();
    if (next) showToast.success('Saved', `${next.test.publicCode} · version ${next.currentVersion?.versionNumber ?? ''}`);
    setBusy('');
  };

  const confirmWarnings = () => warningItems.length === 0
    || window.confirm(`Please check before publishing:\n\n• ${warningItems.map((w) => w.message).join('\n• ')}\n\nContinue anyway?`);

  const lifecycle = async (kind: 'publish' | 'schedule') => {
    if (blocking.length) { showToast.warning('Not ready yet', blocking[0].message); return; }
    if (!confirmWarnings()) return;
    let scheduledAt: string | undefined;
    if (kind === 'schedule') {
      const when = new Date(scheduleAt);
      if (!scheduleAt || Number.isNaN(when.getTime()) || when.getTime() < Date.now() + 60_000) {
        showToast.warning('Pick a future time', 'Schedule at least a minute ahead.');
        return;
      }
      scheduledAt = when.toISOString();
    }
    setBusy(kind);
    try {
      const saved = await persist();
      if (!saved?.test.currentDraftVersionId) return;
      const action = kind === 'publish' ? publishAction(saved.test.status) : scheduleAction(saved.test.status);
      const next = await runPublishAction(saved.test.id, action, { expectedCurrentDraftVersionId: saved.test.currentDraftVersionId, scheduledAt }, (n) => window.confirm(ACTIVE_ATTEMPTS_WARNING(n)));
      if (!next) return;
      apply(next);
      onChanged();
      setScheduleOpen(false);
      showToast.success(kind === 'publish' ? 'Published' : 'Scheduled', kind === 'publish' ? 'Students can see this version now.' : `Goes live ${new Date(scheduledAt!).toLocaleString()}.`);
    } catch (error) {
      setServerIssues(errorDetails(error));
      showToast.error(kind === 'publish' ? 'Could not publish' : 'Could not schedule', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy('');
    }
  };

  const archiveOrRestore = async (kind: 'archive' | 'restore') => {
    if (!detail?.test.currentDraftVersionId) return;
    const reason = window.prompt(kind === 'archive' ? 'Why archive this test? Students will no longer see it.' : 'Why restore this test to draft?');
    if (!reason || reason.trim().length < 3) return;
    setBusy(kind);
    try {
      const next = await transitionLiveTest(detail.test.id, kind === 'archive' ? 'archive' : 'restore-draft', { expectedCurrentDraftVersionId: detail.test.currentDraftVersionId, reason: reason.trim() });
      apply(next);
      onChanged();
      showToast.success(kind === 'archive' ? 'Archived' : 'Back to draft', detail.test.publicCode);
    } catch (error) {
      showToast.error('Action failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy('');
    }
  };

  const fill = async () => {
    if (!draft.examVersionId || !active) return;
    setBusy('fill');
    try {
      const result = await autoAssembleTest({ examVersionId: draft.examVersionId, questionCount: fillCount, seed: `${draft.title}-${Date.now()}` });
      const taken = new Set(allIds);
      const fresh = result.questions.filter((q) => !taken.has(q.questionVersionId));
      setCards((m) => {
        const next = new Map(m);
        fresh.forEach((q) => next.set(q.questionVersionId, { versionId: q.questionVersionId, questionId: q.id, publicCode: q.publicCode, stem: q.stem, difficulty: q.difficulty, options: [] }));
        return next;
      });
      setSection(active.clientKey, { questionVersionIds: [...active.questionVersionIds, ...fresh.map((q) => q.questionVersionId)] });
      enrich(fresh.map((q) => q.questionVersionId), detail?.test.id);
      if (result.shortages.length) showToast.warning('Fewer questions available', result.shortages[0]);
      else showToast.success('Added', `${fresh.length} questions added to ${active.name}. Swap any you don't want.`);
    } catch (error) {
      showToast.error('Could not fill', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy('');
    }
  };

  const startFromPattern = async () => {
    const pattern = blueprints.find((b) => b.id === patternId);
    if (!pattern) return;
    if (draft.title.trim().length < 3) { showToast.warning('Add a title first', 'Enter the test title, then create from the pattern.'); return; }
    setBusy('fill');
    try {
      const result = await assembleBlueprint(pattern.id, { title: draft.title.trim(), seed: `${draft.title}-${Date.now()}`, changeReason: `Created from pattern ${pattern.code} in Tests workspace` });
      onChanged();
      onSaved(result.testId);
      showToast.success('Test created from pattern', `${result.publicCode}: review the questions, swap any you don't want, then publish.`);
    } catch (error) {
      showToast.error('Could not build from pattern', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy('');
    }
  };

  const fixLanguage = async () => {
    if (!exam) return;
    const code = (draft.languageCode || 'en').toLowerCase();
    if (!window.confirm(`Allow ${code.toUpperCase()} tests for ${exam.examName}? This changes the exam's language setting for all its tests.`)) return;
    setBusy('fix');
    try {
      const overview = await getTranslationOverview();
      const byCode = new Map(overview.languages.filter((l) => l.isActive).map((l) => [l.code.toLowerCase(), l.id]));
      const wanted = byCode.get(code);
      if (!wanted) throw new Error(`${code.toUpperCase()} is not an active language.`);
      const existing = exam.languages.map((l) => ({ languageId: l.id, isPrimary: l.isPrimary }));
      const languages = existing.some((l) => l.languageId === wanted) ? existing : [...existing, { languageId: wanted, isPrimary: existing.length === 0 }];
      await updateExamVersionLanguages({ examVersionId: exam.id, languages, reason: `Allowed ${code} from Tests workspace so tests can be published` });
      await onCatalogChanged();
      showToast.success('Exam updated', `${exam.examName} now allows ${code.toUpperCase()} tests.`);
    } catch (error) {
      showToast.error('Could not update exam languages', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy('');
    }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading test…</div>;
  if (loadError) return <Card><CardContent className="p-6 text-center text-sm"><AlertTriangle className="mx-auto mb-2 h-6 w-6 text-destructive" />{loadError}</CardContent></Card>;

  const sectionCards = (active?.questionVersionIds ?? []).map((id) => cards.get(id) ?? { versionId: id, publicCode: 'Question', stem: '(details load after save)', difficulty: '', options: [] });

  return (
    <div className="space-y-4">
      {/* Header + actions */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold">{draft.title || (detail ? 'Untitled test' : 'New test')}</h2>
            {detail && <Badge className={statusBadgeClass(group, changes)}>{statusLabel(detail.test)}</Badge>}
            {dirty && <Badge variant="outline" className="border-warning/50 text-warning">Unsaved</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail ? `${detail.test.publicCode} · ` : ''}{exam ? `${exam.examName} · ` : ''}{allIds.length} questions · {totalMarks} marks · {draft.durationMinutes} min
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void save()} disabled={!!busy || (!dirty && !!detail)}>
            {busy === 'save' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save draft
          </Button>
          {group !== 'archived' && publishable && (
            <Button size="sm" onClick={() => void lifecycle('publish')} disabled={!!busy || blocking.length > 0}>
              {busy === 'publish' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Rocket className="mr-1.5 h-4 w-4" />} {publishLabel}
            </Button>
          )}
          {(!detail || canSchedule(status)) && (
            <Button variant="outline" size="sm" onClick={() => setScheduleOpen((o) => !o)} disabled={!!busy}>
              <CalendarClock className="mr-1.5 h-4 w-4" /> Schedule
            </Button>
          )}
          {detail && group !== 'archived' && (
            <Button variant="ghost" size="sm" onClick={() => void archiveOrRestore('archive')} disabled={!!busy}><Archive className="mr-1.5 h-4 w-4" /> Archive</Button>
          )}
          {detail && group === 'archived' && (
            <Button variant="outline" size="sm" onClick={() => void archiveOrRestore('restore')} disabled={!!busy}><RotateCcw className="mr-1.5 h-4 w-4" /> Restore to draft</Button>
          )}
        </div>
      </div>

      {scheduleOpen && (
        <Card><CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="space-y-1.5"><Label>Go live at</Label><Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} /></div>
          <Button size="sm" onClick={() => void lifecycle('schedule')} disabled={!!busy || blocking.length > 0}>
            {busy === 'schedule' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <CalendarClock className="mr-1.5 h-4 w-4" />} Confirm schedule
          </Button>
          <p className="w-full text-xs text-warning">Note: automatic go-live isn't switched on yet, so a scheduled test must still be published manually at that time.</p>
        </CardContent></Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-4">
          <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 text-sm">
            {(['build', 'preview', 'history'] as const).map((v) => (
              <button key={v} type="button" onClick={() => setView(v)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 ${view === v ? 'bg-background font-medium shadow-sm' : 'text-muted-foreground'}`}>
                {v === 'build' ? <Pencil className="h-4 w-4" /> : v === 'preview' ? <Eye className="h-4 w-4" /> : <History className="h-4 w-4" />}
                {v === 'build' ? 'Build' : v === 'preview' ? 'Student preview' : 'History'}
              </button>
            ))}
          </div>

          {view === 'build' && <>
            {!detail && draft.examVersionId && blueprints.some((b) => b.examVersionId === draft.examVersionId) && (
              <Card className="border-primary/30">
                <CardContent className="flex flex-wrap items-end gap-3 p-4">
                  <div className="min-w-56 flex-1 space-y-1.5">
                    <Label>Start from exam pattern (optional)</Label>
                    <Select value={patternId} onValueChange={setPatternId}>
                      <SelectTrigger><SelectValue placeholder="Choose a pattern" /></SelectTrigger>
                      <SelectContent>{blueprints.filter((b) => b.examVersionId === draft.examVersionId).map((b) => <SelectItem key={b.id} value={b.id}>{b.name} · {b.sectionCount} sections · {b.questionCount} Q</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="h-10" disabled={!patternId || !!busy} onClick={() => void startFromPattern()}>
                    {busy === 'fill' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />} Build from pattern
                  </Button>
                  <p className="w-full text-xs text-muted-foreground">Creates the sections, timing and marks from the pattern and picks matching questions. You can then swap any question before publishing.</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Setup</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Exam</Label>
                    <Select value={draft.examVersionId} disabled={!!detail} onValueChange={(value) => {
                      const next = catalog.find((e) => e.id === value);
                      setDraft((d) => ({ ...d, examVersionId: value, languageCode: next?.languages.find((l) => l.isPrimary)?.code ?? next?.languages[0]?.code ?? 'en' }));
                    }}>
                      <SelectTrigger><SelectValue placeholder="Choose exam" /></SelectTrigger>
                      <SelectContent>{catalog.map((e) => <SelectItem key={e.id} value={e.id}>{e.examName} · {e.versionName}{e.languages.length === 0 ? ' (no languages set)' : ''}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Title</Label><Input value={draft.title} onChange={(e) => setField('title', e.target.value)} placeholder="SSC CGL Full Mock 01" /></div>
                </div>
                {exam && (
                  <ExamLanguagesPanel examVersionId={exam.id} examName={exam.examName} current={exam.languages} canManage={canManageLanguages} onChanged={onCatalogChanged} />
                )}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <NumberField label="Duration (min)" value={draft.durationMinutes} min={1} onChange={(v) => setField('durationMinutes', v)} />
                  <NumberField label="Marks / question" value={draft.marksPerQuestion} min={0.25} step={0.25} onChange={(v) => setField('marksPerQuestion', v)} />
                  <NumberField label="Negative marks" value={draft.negativeMarks} min={0} step={0.25} onChange={(v) => setField('negativeMarks', v)} />
                  <div className="space-y-1.5"><Label>Total marks</Label><div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm">{totalMarks}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <SelectField label="Type" value={draft.testType} options={[['full_mock', 'Full mock'], ['sectional', 'Sectional'], ['quiz', 'Quiz'], ['previous_year', 'Previous year']]} onChange={(v) => setField('testType', v)} />
                  <div className="space-y-1.5"><Label>Language</Label>
                    <Select value={draft.languageCode} onValueChange={(v) => setField('languageCode', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{(exam?.languages.length ? exam.languages : [{ id: 'en', code: 'en', name: 'English' }]).map((l) => <SelectItem key={l.id} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {!detail && canSetAccess && <SelectField label="Student access" value={draft.access} options={[['free', 'Free'], ['premium', 'Premium']]} onChange={(v) => setField('access', v)} />}
                  <SelectField label="Difficulty label" value={draft.difficulty} options={[['Easy', 'Easy'], ['Moderate', 'Moderate'], ['Hard', 'Hard'], ['Mixed', 'Mixed']]} onChange={(v) => setField('difficulty', v)} />
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground">Instructions, description and rules</summary>
                  <div className="mt-3 space-y-3">
                    <label className="flex items-center gap-2"><Checkbox checked={draft.lockCompletedSections} onCheckedChange={(c) => setField('lockCompletedSections', c === true)} /> Lock completed sections</label>
                    <div className="space-y-1.5"><Label>Instructions</Label><Textarea rows={4} value={draft.instructions} onChange={(e) => setField('instructions', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Description</Label><Textarea rows={2} value={draft.description} onChange={(e) => setField('description', e.target.value)} /></div>
                  </div>
                </details>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Sections &amp; questions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {draft.sections.map((s) => (
                    <button key={s.clientKey} type="button" onClick={() => setActiveKey(s.clientKey)}
                      className={`rounded-full border px-3 py-1 text-sm ${s.clientKey === active?.clientKey ? 'border-primary bg-primary/10 font-medium text-primary' : 'text-muted-foreground'}`}>
                      {s.name || 'Unnamed'} · {s.questionVersionIds.length}
                    </button>
                  ))}
                  <Button variant="ghost" size="sm" onClick={addSection}><Plus className="mr-1 h-4 w-4" /> Section</Button>
                </div>
                {active && (
                  <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-3">
                    <div className="min-w-40 flex-1 space-y-1.5"><Label>Section name</Label><Input value={active.name} onChange={(e) => setSection(active.clientKey, { name: e.target.value })} /></div>
                    <div className="w-32 space-y-1.5"><Label>Time (min)</Label><Input type="number" min={1} placeholder="Shared" value={active.durationMinutes} onChange={(e) => setSection(active.clientKey, { durationMinutes: e.target.value })} /></div>
                    <div className="flex items-end gap-2">
                      <Input className="w-20" type="number" min={1} max={300} value={fillCount} onChange={(e) => setFillCount(Number(e.target.value) || 1)} />
                      <Button variant="outline" size="sm" className="h-10" onClick={() => void fill()} disabled={!draft.examVersionId || !!busy}>
                        {busy === 'fill' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />} Auto-fill
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10" aria-label="Remove section" disabled={draft.sections.length <= 1} onClick={() => removeSection(active.clientKey)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
                {!draft.examVersionId
                  ? <p className="py-10 text-center text-sm text-muted-foreground">Choose an exam in Setup to start adding questions.</p>
                  : <QuestionPicker
                      examVersionId={draft.examVersionId}
                      sectionName={active?.name ?? 'Section'}
                      sectionQuestions={sectionCards}
                      allSelectedIds={allIds}
                      canEditQuestions={canEditQuestions}
                      onAdd={addQuestion}
                      onRemove={removeQuestion}
                      onMove={moveQuestion}
                    />}
              </CardContent>
            </Card>
          </>}

          {view === 'preview' && (
            <Card><CardContent className="space-y-6 p-5">
              <div className="rounded-lg border bg-muted/20 p-4">
                <h3 className="text-lg font-semibold">{draft.title || 'Untitled test'}</h3>
                <p className="text-sm text-muted-foreground">{draft.durationMinutes} minutes · {totalMarks} marks · +{draft.marksPerQuestion} / −{draft.negativeMarks}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{draft.instructions}</p>
              </div>
              {draft.sections.map((s) => (
                <div key={s.clientKey} className="space-y-3">
                  <h4 className="font-semibold">{s.name} <span className="text-sm font-normal text-muted-foreground">({s.questionVersionIds.length})</span></h4>
                  {s.questionVersionIds.map((id, i) => {
                    const q = cards.get(id);
                    return (
                      <div key={id} className="rounded-lg border p-3 text-sm">
                        <p className="font-medium">{i + 1}. {q?.stem ?? id}</p>
                        {q && q.options.length > 0 && <div className="mt-2 grid gap-1.5 sm:grid-cols-2">{q.options.map((o) => <div key={o.key} className={`rounded border px-2 py-1 ${o.isCorrect ? 'border-success/50 bg-success/5' : ''}`}><strong>{o.key}.</strong> {o.text}</div>)}</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </CardContent></Card>
          )}

          {view === 'history' && (
            <Card><CardContent className="space-y-2 p-5 text-sm">
              {!detail?.auditEvents.length && <p className="text-muted-foreground">No history yet.</p>}
              {detail?.auditEvents.slice(0, 30).map((event) => (
                <div key={event.id} className="flex gap-3 border-b pb-2 last:border-0">
                  <span className="w-36 shrink-0 text-xs text-muted-foreground">{new Date(event.occurredAt).toLocaleString()}</span>
                  <div><p>{event.summary}</p>{event.reason && <p className="text-xs text-muted-foreground">{event.reason}</p>}</div>
                </div>
              ))}
            </CardContent></Card>
          )}
        </div>

        {/* Readiness */}
        <div className="space-y-3 xl:sticky xl:top-4 xl:self-start">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base">
              {blocking.length === 0 ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
              {blocking.length === 0 ? 'Ready to publish' : `${blocking.length} to fix before publishing`}
            </CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[...blocking, ...warningItems].length === 0 && <p className="text-sm text-muted-foreground">All checks pass.</p>}
              {[...blocking, ...warningItems].map((item) => (
                <ReadinessRow key={item.code} item={item} busy={busy === 'fix'} canFix={canManageLanguages} onFix={() => void fixLanguage()} />
              ))}
              {serverIssues.length > 0 && (
                <div className="space-y-1.5 border-t pt-2">
                  <p className="text-xs font-medium text-muted-foreground">From the server</p>
                  {serverIssues.map((message, i) => <p key={i} className="rounded border border-destructive/30 bg-destructive/5 p-2 text-xs">{message}</p>)}
                </div>
              )}
            </CardContent>
          </Card>
          {isLive && (
            <p className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
              This test is live. Edits are saved as a new draft version; students keep seeing the published version until you press <strong>Publish changes</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadinessRow({ item, busy, canFix, onFix }: { item: ReadinessItem; busy: boolean; canFix: boolean; onFix: () => void }) {
  const blocker = item.level === 'blocker';
  return (
    <div className={`rounded-md border p-2 text-sm ${blocker ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5'}`}>
      <p>{item.message}</p>
      {item.fix === 'allow-exam-language' && (canFix
        ? <Button size="sm" variant="outline" className="mt-2" onClick={onFix} disabled={busy}>{busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Wrench className="mr-1.5 h-4 w-4" />} Allow this language for the exam</Button>
        : <p className="mt-1 text-xs text-muted-foreground">Ask an admin with language settings access to enable it.</p>)}
    </div>
  );
}

function NumberField({ label, value, onChange, min, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min: number; step?: number }) {
  return <div className="space-y-1.5"><Label>{label}</Label><Input type="number" min={min} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></div>;
}
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (v: string) => void }) {
  return <div className="space-y-1.5"><Label>{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>;
}
