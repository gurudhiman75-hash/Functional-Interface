import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, ListChecks, Loader2, Plus, RefreshCw, RotateCcw, Save, Trash2 } from 'lucide-react';

import { AdminErrorAlert } from '@/components/shared/AdminErrorAlert';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getPublishedQuestions, type PublishedQuestion } from '@/features/question-bank/api';
import { createLiveTest, getLiveTest, getTestCatalog, saveLiveTestDraft, type LiveTestDetail, type TestCatalogExamVersion, type TestDraftInput } from '@/features/test-builder/api';
import { toAdminApiError, type AdminApiError } from '@/lib/admin-api-error';

interface BuilderSection { clientKey: string; name: string; durationMinutes: string; questionVersionIds: string[] }
interface BuilderDraft {
  examVersionId: string; title: string; description: string; durationMinutes: number; totalMarks: number;
  marksPerQuestion: number; negativeMarks: number; testType: string; languageCode: string; access: string;
  difficulty: string; instructions: string; sections: BuilderSection[];
}
interface LocalCheckpoint { savedAt: string; serverDraftVersionId: string | null; draft: BuilderDraft }

const freshDraft = (): BuilderDraft => ({
  examVersionId: '', title: '', description: '', durationMinutes: 60, totalMarks: 0, marksPerQuestion: 2,
  negativeMarks: 0.5, testType: 'full_mock', languageCode: 'en', access: 'free', difficulty: 'Moderate',
  instructions: 'Read every question carefully. Submit the test before the timer ends.',
  sections: [{ clientKey: 'section-1', name: 'Section 1', durationMinutes: '', questionVersionIds: [] }],
});

function record(value: unknown): Record<string, unknown> { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function setting(settings: Record<string, unknown>, key: string, fallback: string) { return typeof settings[key] === 'string' ? String(settings[key]) : fallback; }
function fingerprint(value: BuilderDraft) { return JSON.stringify(value); }
function formatTime(value: string | null) { if (!value) return 'Not saved yet'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString(); }

function draftFromDetail(detail: LiveTestDetail): BuilderDraft {
  const version = detail.currentVersion;
  if (!version) return freshDraft();
  const settings = record(version.settings);
  const instructions = record(version.instructions);
  const firstQuestion = detail.sections.flatMap((section) => section.questions)[0];
  return {
    examVersionId: detail.test.examVersionId,
    title: version.title,
    description: version.description ?? '',
    durationMinutes: version.durationSeconds / 60,
    totalMarks: version.totalMarks,
    marksPerQuestion: firstQuestion?.marks ?? 2,
    negativeMarks: firstQuestion?.negativeMarks ?? 0.5,
    testType: setting(settings, 'testType', 'full_mock'),
    languageCode: setting(settings, 'languageCode', 'en'),
    access: setting(settings, 'access', 'free'),
    difficulty: setting(settings, 'difficulty', 'Moderate'),
    instructions: typeof instructions.text === 'string' ? instructions.text : '',
    sections: detail.sections.map((section) => ({
      clientKey: section.sectionKey,
      name: section.name,
      durationMinutes: section.durationSeconds == null ? '' : String(section.durationSeconds / 60),
      questionVersionIds: section.questions.map((question) => question.questionVersionId),
    })),
  };
}

export function TestBuilderRecoveryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit') ?? '';
  const storageKey = `examtree:test-builder:${editId || 'new'}`;
  const [catalog, setCatalog] = useState<TestCatalogExamVersion[]>([]);
  const [questions, setQuestions] = useState<PublishedQuestion[]>([]);
  const [detail, setDetail] = useState<LiveTestDetail | null>(null);
  const [draft, setDraft] = useState<BuilderDraft>(freshDraft);
  const [activeSectionKey, setActiveSectionKey] = useState('section-1');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [error, setError] = useState<AdminApiError | null>(null);
  const [recovery, setRecovery] = useState<LocalCheckpoint | null>(null);
  const [localSavedAt, setLocalSavedAt] = useState<string | null>(null);
  const [serverSavedAt, setServerSavedAt] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const baselineRef = useRef(fingerprint(freshDraft()));
  const hydratedRef = useRef(false);

  const selectedIds = useMemo(() => draft.sections.flatMap((section) => section.questionVersionIds), [draft.sections]);
  const dirty = hydratedRef.current && fingerprint(draft) !== baselineRef.current;
  const activeSection = draft.sections.find((section) => section.clientKey === activeSectionKey) ?? draft.sections[0];
  const selectedExam = catalog.find((exam) => exam.id === draft.examVersionId);
  const filteredQuestions = useMemo(() => questions.filter((question) => {
    if (draft.examVersionId && question.examVersionId !== draft.examVersionId) return false;
    const term = query.trim().toLowerCase();
    return !term || question.publicCode.toLowerCase().includes(term) || question.stem.toLowerCase().includes(term);
  }), [draft.examVersionId, query, questions]);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setConflict(false); hydratedRef.current = false;
    try {
      const [catalogResponse, questionResponse, testResponse] = await Promise.all([
        getTestCatalog(), getPublishedQuestions(), editId ? getLiveTest(editId) : Promise.resolve(null),
      ]);
      setCatalog(catalogResponse.examVersions); setQuestions(questionResponse.questions);
      const serverDraft = testResponse ? draftFromDetail(testResponse) : freshDraft();
      setDetail(testResponse); setDraft(serverDraft); setActiveSectionKey(serverDraft.sections[0]?.clientKey ?? 'section-1');
      baselineRef.current = fingerprint(serverDraft); setServerSavedAt(testResponse?.generatedAt ?? null);
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const checkpoint = JSON.parse(raw) as LocalCheckpoint;
          if (checkpoint?.draft && fingerprint(checkpoint.draft) !== fingerprint(serverDraft)) setRecovery(checkpoint);
        } catch { localStorage.removeItem(storageKey); }
      }
      hydratedRef.current = true;
    } catch (caught) { setError(toAdminApiError(caught, { fallbackMessage: 'Unable to load Test Builder.', affectedRecord: editId || undefined })); }
    finally { setLoading(false); }
  }, [editId, storageKey]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const timer = window.setTimeout(() => {
      const checkpoint: LocalCheckpoint = { savedAt: new Date().toISOString(), serverDraftVersionId: detail?.test.currentDraftVersionId ?? null, draft };
      localStorage.setItem(storageKey, JSON.stringify(checkpoint));
      setLocalSavedAt(checkpoint.savedAt);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [detail?.test.currentDraftVersionId, draft, storageKey]);

  const payload = useCallback((changeReason: string): TestDraftInput => ({
    expectedCurrentDraftVersionId: detail?.test.currentDraftVersionId ?? null,
    examVersionId: draft.examVersionId,
    title: draft.title,
    description: draft.description,
    durationMinutes: draft.durationMinutes,
    totalMarks: draft.totalMarks,
    instructions: { text: draft.instructions },
    settings: { testType: draft.testType, languageCode: draft.languageCode, access: draft.access, difficulty: draft.difficulty, sectionTiming: draft.sections.some((section) => section.durationMinutes !== '') ? 'sectional' : 'shared' },
    changeReason,
    sections: draft.sections.map((section) => ({
      clientKey: section.clientKey, name: section.name, durationMinutes: section.durationMinutes === '' ? null : Number(section.durationMinutes), settings: {},
      questions: section.questionVersionIds.map((questionVersionId) => ({ questionVersionId, marks: draft.marksPerQuestion, negativeMarks: draft.negativeMarks, settings: {} })),
    })),
  }), [detail?.test.currentDraftVersionId, draft]);

  const canServerAutosave = Boolean(detail && dirty && !saving && draft.examVersionId && draft.title.trim().length >= 3 && draft.sections.length > 0 && selectedIds.length > 0 && !conflict);
  useEffect(() => {
    if (!canServerAutosave || !detail) return;
    const timer = window.setTimeout(async () => {
      setAutosaving(true);
      try {
        const next = await saveLiveTestDraft(detail.test.id, payload('Automatic Test Builder checkpoint'));
        setDetail(next); setDraft(draftFromDetail(next)); baselineRef.current = fingerprint(draftFromDetail(next));
        setServerSavedAt(new Date().toISOString()); localStorage.removeItem(storageKey); setLocalSavedAt(null); setError(null);
      } catch (caught) {
        const parsed = toAdminApiError(caught, { fallbackMessage: 'Automatic server save failed.', affectedRecord: detail.test.id });
        setError(parsed); if (parsed.status === 409) setConflict(true);
      } finally { setAutosaving(false); }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [canServerAutosave, detail, payload, storageKey]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => { if (!dirty) return; event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const next = detail ? await saveLiveTestDraft(detail.test.id, payload('Manual Test Builder save')) : await createLiveTest(payload('Initial Test Builder draft'));
      const normalized = draftFromDetail(next); setDetail(next); setDraft(normalized); baselineRef.current = fingerprint(normalized);
      setServerSavedAt(new Date().toISOString()); setConflict(false); setRecovery(null); localStorage.removeItem(storageKey); setLocalSavedAt(null);
      showToast.success('Draft saved', `${next.test.publicCode} version ${next.currentVersion?.versionNumber ?? ''} is stored.`);
      if (!editId) navigate(`/tests/builder?edit=${next.test.id}`, { replace: true });
    } catch (caught) { const parsed = toAdminApiError(caught, { fallbackMessage: 'Unable to save test.', affectedRecord: detail?.test.id }); setError(parsed); if (parsed.status === 409) setConflict(true); }
    finally { setSaving(false); }
  };

  const restoreLocal = () => { if (!recovery) return; setDraft(recovery.draft); setActiveSectionKey(recovery.draft.sections[0]?.clientKey ?? 'section-1'); setLocalSavedAt(recovery.savedAt); setRecovery(null); showToast.success('Local draft restored', `Checkpoint from ${formatTime(recovery.savedAt)} loaded.`); };
  const discardLocal = () => { localStorage.removeItem(storageKey); setRecovery(null); setLocalSavedAt(null); };
  const reloadServer = async () => { localStorage.removeItem(storageKey); setRecovery(null); await load(); };

  const addSection = () => { const key = `section-${Date.now()}`; setDraft((current) => ({ ...current, sections: [...current.sections, { clientKey: key, name: `Section ${current.sections.length + 1}`, durationMinutes: '', questionVersionIds: [] }] })); setActiveSectionKey(key); };
  const toggleQuestion = (id: string) => {
    if (!activeSection) return;
    setDraft((current) => {
      const already = current.sections.some((section) => section.questionVersionIds.includes(id));
      const sections = current.sections.map((section) => ({ ...section, questionVersionIds: section.clientKey === activeSection.clientKey && !already ? [...section.questionVersionIds.filter((item) => item !== id), id] : section.questionVersionIds.filter((item) => item !== id) }));
      return { ...current, sections, totalMarks: sections.flatMap((section) => section.questionVersionIds).length * current.marksPerQuestion };
    });
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Test Builder…</div>;

  return <div className="space-y-4">
    <PageHeader title={detail ? `Edit ${detail.test.publicCode}` : 'Build Live Test'} description="Canonical test drafting with local recovery and safe server checkpoints." icon={<ListChecks className="h-5 w-5" />} actions={<div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link to="/tests"><ArrowLeft className="mr-1.5 h-4 w-4" /> Tests</Link></Button><Button variant="outline" size="sm" onClick={() => void reloadServer()} disabled={saving || autosaving}><RefreshCw className="mr-1.5 h-4 w-4" /> Reload server</Button><Button size="sm" onClick={() => void save()} disabled={saving || autosaving}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save now</Button></div>} />

    <div className="flex flex-wrap gap-2"><Badge variant={dirty ? 'destructive' : 'secondary'}>{dirty ? 'Unsaved changes' : 'Server synchronized'}</Badge><Badge variant="outline"><Clock3 className="mr-1 h-3.5 w-3.5" /> Local {formatTime(localSavedAt)}</Badge><Badge variant="outline">Server {formatTime(serverSavedAt)}</Badge>{autosaving && <Badge className="bg-warning/10 text-warning"><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Autosaving</Badge>}{conflict && <Badge variant="destructive">Server conflict</Badge>}</div>

    {recovery && <Card className="border-warning/40 bg-warning/5"><CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-medium">Recovered local checkpoint available</p><p className="text-sm text-muted-foreground">Saved {formatTime(recovery.savedAt)}. Server version at that time: {recovery.serverDraftVersionId ?? 'new draft'}.</p></div><div className="flex gap-2"><Button onClick={restoreLocal}><RotateCcw className="mr-1.5 h-4 w-4" /> Restore</Button><Button variant="outline" onClick={discardLocal}>Discard</Button></div></CardContent></Card>}
    {conflict && <Card className="border-destructive/40"><CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-medium text-destructive">A newer server draft exists</p><p className="text-sm text-muted-foreground">Your local checkpoint is preserved. Reload the server copy before deciding what to reapply.</p></div><Button variant="destructive" onClick={() => void reloadServer()}>Load newer server draft</Button></CardContent></Card>}
    {error && <AdminErrorAlert error={error} title="Test Builder operation failed" onRetry={() => void (conflict ? reloadServer() : save())} />}

    <Tabs defaultValue="details" className="space-y-4"><TabsList><TabsTrigger value="details">Basic info</TabsTrigger><TabsTrigger value="sections">Sections</TabsTrigger><TabsTrigger value="questions">Questions</TabsTrigger><TabsTrigger value="preview">Preview</TabsTrigger></TabsList>
      <TabsContent value="details"><Card><CardHeader><CardTitle>Test configuration</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Exam version</Label><Select value={draft.examVersionId} onValueChange={(value) => setDraft((current) => ({ ...current, examVersionId: value, languageCode: catalog.find((exam) => exam.id === value)?.languages.find((language) => language.isPrimary)?.code ?? 'en', sections: current.sections.map((section) => ({ ...section, questionVersionIds: [] })), totalMarks: 0 }))}><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger><SelectContent>{catalog.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.familyName} • {exam.examName} • {exam.versionName}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Title</Label><Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></div></div><div className="space-y-2"><Label>Description</Label><Textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} /></div><div className="grid gap-4 sm:grid-cols-3"><NumberField label="Duration" value={draft.durationMinutes} min={1} onChange={(value) => setDraft((current) => ({ ...current, durationMinutes: value }))} /><NumberField label="Marks/question" value={draft.marksPerQuestion} min={0.01} onChange={(value) => setDraft((current) => ({ ...current, marksPerQuestion: value, totalMarks: selectedIds.length * value }))} /><NumberField label="Negative marks" value={draft.negativeMarks} min={0} onChange={(value) => setDraft((current) => ({ ...current, negativeMarks: value }))} /></div><div className="space-y-2"><Label>Instructions</Label><Textarea rows={4} value={draft.instructions} onChange={(event) => setDraft((current) => ({ ...current, instructions: event.target.value }))} /></div></CardContent></Card></TabsContent>
      <TabsContent value="sections"><div className="space-y-3"><div className="flex justify-end"><Button onClick={addSection}><Plus className="mr-1.5 h-4 w-4" /> Add section</Button></div>{draft.sections.map((section, index) => <Card key={section.clientKey} className={section.clientKey === activeSectionKey ? 'border-primary/50' : ''}><CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-end"><div className="flex-1 space-y-2"><Label>Section {index + 1}</Label><Input value={section.name} onFocus={() => setActiveSectionKey(section.clientKey)} onChange={(event) => setDraft((current) => ({ ...current, sections: current.sections.map((item) => item.clientKey === section.clientKey ? { ...item, name: event.target.value } : item) }))} /></div><Button variant="outline" onClick={() => setActiveSectionKey(section.clientKey)}>{section.questionVersionIds.length} questions</Button><Button variant="ghost" size="icon" disabled={draft.sections.length === 1} onClick={() => setDraft((current) => ({ ...current, sections: current.sections.filter((item) => item.clientKey !== section.clientKey) }))}><Trash2 className="h-4 w-4" /></Button></CardContent></Card>)}</div></TabsContent>
      <TabsContent value="questions"><Card><CardHeader><CardTitle>Published Question Bank</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search question code or stem" />{!draft.examVersionId ? <p className="py-12 text-center text-sm text-muted-foreground">Select an exam version first.</p> : <div className="max-h-[560px] divide-y overflow-y-auto rounded-lg border">{filteredQuestions.map((question) => <label key={question.versionId} className="flex cursor-pointer gap-3 p-3"><Checkbox checked={selectedIds.includes(question.versionId)} onCheckedChange={() => toggleQuestion(question.versionId)} /><div><div className="flex gap-2"><Badge variant="outline">{question.publicCode}</Badge><Badge variant="secondary">{question.difficulty}</Badge></div><p className="mt-2 text-sm">{question.stem}</p></div></label>)}</div>}</CardContent></Card></TabsContent>
      <TabsContent value="preview"><Card><CardContent className="space-y-4 p-5"><div><h2 className="text-xl font-semibold">{draft.title || 'Untitled test'}</h2><p className="text-sm text-muted-foreground">{selectedExam?.examName ?? 'No exam'} • {draft.durationMinutes} minutes • {draft.totalMarks} marks</p></div>{draft.sections.map((section) => <div key={section.clientKey}><h3 className="font-medium">{section.name} ({section.questionVersionIds.length})</h3></div>)}</CardContent></Card></TabsContent>
    </Tabs>
  </div>;
}

function NumberField({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (value: number) => void }) {
  return <div className="space-y-2"><Label>{label}</Label><Input type="number" min={min} step="0.25" value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}
