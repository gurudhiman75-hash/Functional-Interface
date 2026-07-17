import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileQuestion,
  ListChecks,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getPublishedQuestions,
  type PublishedQuestion,
} from '@/features/question-bank/api';
import {
  autoAssembleTest,
  createLiveTest,
  getLiveTest,
  getTestCatalog,
  saveLiveTestDraft,
  type LiveTestDetail,
  type TestCatalogExamVersion,
  type TestDraftInput,
  type TestValidationIssue,
} from '@/features/test-builder/api';

interface BuilderSection {
  clientKey: string;
  name: string;
  durationMinutes: string;
  questionVersionIds: string[];
}

interface BuilderDraft {
  examVersionId: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  marksPerQuestion: number;
  negativeMarks: number;
  desiredQuestionCount: number;
  testType: string;
  languageCode: string;
  access: string;
  difficulty: string;
  instructions: string;
  sections: BuilderSection[];
}

const freshDraft = (): BuilderDraft => ({
  examVersionId: '',
  title: '',
  description: '',
  durationMinutes: 60,
  totalMarks: 0,
  marksPerQuestion: 2,
  negativeMarks: 0.5,
  desiredQuestionCount: 100,
  testType: 'full_mock',
  languageCode: 'en',
  access: 'free',
  difficulty: 'Moderate',
  instructions: 'Read every question carefully. Submit the test before the timer ends.',
  sections: [{ clientKey: 'section-1', name: 'Section 1', durationMinutes: '', questionVersionIds: [] }],
});

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function stringSetting(settings: Record<string, unknown>, key: string, fallback: string) {
  return typeof settings[key] === 'string' ? String(settings[key]) : fallback;
}

function draftFromDetail(detail: LiveTestDetail): BuilderDraft {
  const version = detail.currentVersion;
  if (!version) return freshDraft();
  const settings = record(version.settings);
  const firstQuestion = detail.sections.flatMap((section) => section.questions)[0];
  const marksPerQuestion = firstQuestion?.marks ?? 2;
  const negativeMarks = firstQuestion?.negativeMarks ?? 0.5;
  const questionCount = detail.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const instructions = record(version.instructions);
  return {
    examVersionId: detail.test.examVersionId,
    title: version.title,
    description: version.description ?? '',
    durationMinutes: version.durationSeconds / 60,
    totalMarks: version.totalMarks,
    marksPerQuestion,
    negativeMarks,
    desiredQuestionCount: Math.max(questionCount, 1),
    testType: stringSetting(settings, 'testType', 'full_mock'),
    languageCode: stringSetting(settings, 'languageCode', 'en'),
    access: stringSetting(settings, 'access', 'free'),
    difficulty: stringSetting(settings, 'difficulty', 'Moderate'),
    instructions: typeof instructions.text === 'string' ? instructions.text : '',
    sections: detail.sections.map((section) => ({
      clientKey: section.sectionKey,
      name: section.name,
      durationMinutes: section.durationSeconds == null ? '' : String(section.durationSeconds / 60),
      questionVersionIds: section.questions.map((question) => question.questionVersionId),
    })),
  };
}

function detailsFromError(error: unknown): TestValidationIssue[] {
  if (!error || typeof error !== 'object') return [];
  const details = (error as { details?: unknown }).details;
  if (!Array.isArray(details)) return [];
  return details.filter((item): item is TestValidationIssue => (
    !!item && typeof item === 'object' && typeof (item as TestValidationIssue).message === 'string'
  ));
}

export function TestBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit') ?? '';

  const [catalog, setCatalog] = useState<TestCatalogExamVersion[]>([]);
  const [publishedQuestions, setPublishedQuestions] = useState<PublishedQuestion[]>([]);
  const [detail, setDetail] = useState<LiveTestDetail | null>(null);
  const [draft, setDraft] = useState<BuilderDraft>(freshDraft);
  const [activeSectionKey, setActiveSectionKey] = useState('section-1');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assembling, setAssembling] = useState(false);
  const [error, setError] = useState('');
  const [serverIssues, setServerIssues] = useState<TestValidationIssue[]>([]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [catalogResponse, questionResponse, testResponse] = await Promise.all([
        getTestCatalog(),
        getPublishedQuestions(),
        editId ? getLiveTest(editId) : Promise.resolve(null),
      ]);
      setCatalog(catalogResponse.examVersions);
      setPublishedQuestions(questionResponse.questions);
      if (testResponse) {
        setDetail(testResponse);
        const restored = draftFromDetail(testResponse);
        setDraft(restored);
        setActiveSectionKey(restored.sections[0]?.clientKey ?? 'section-1');
        setServerIssues(testResponse.validationIssues);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Test Builder.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [editId]);

  const selectedExam = catalog.find((exam) => exam.id === draft.examVersionId);
  const activeSection = draft.sections.find((section) => section.clientKey === activeSectionKey) ?? draft.sections[0];
  const questionMap = useMemo(
    () => new Map(publishedQuestions.map((question) => [question.versionId, question])),
    [publishedQuestions],
  );
  const selectedQuestionIds = draft.sections.flatMap((section) => section.questionVersionIds);
  const selectedQuestionSet = useMemo(() => new Set(selectedQuestionIds), [selectedQuestionIds.join('|')]);
  const calculatedMarks = selectedQuestionIds.length * draft.marksPerQuestion;

  const availableQuestions = useMemo(() => publishedQuestions.filter((question) => {
    if (draft.examVersionId && question.examVersionId !== draft.examVersionId) return false;
    if (difficultyFilter !== 'all' && question.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
    const term = search.trim().toLowerCase();
    if (term && !question.stem.toLowerCase().includes(term) && !question.publicCode.toLowerCase().includes(term)) return false;
    return true;
  }), [publishedQuestions, draft.examVersionId, difficultyFilter, search]);

  const localIssues = useMemo(() => {
    const issues: TestValidationIssue[] = [];
    if (!draft.examVersionId) issues.push({ code: 'EXAM_REQUIRED', message: 'Select an exam version.' });
    if (draft.title.trim().length < 3) issues.push({ code: 'TITLE_REQUIRED', message: 'Enter a test title.' });
    if (draft.sections.length === 0) issues.push({ code: 'SECTION_REQUIRED', message: 'Add at least one section.' });
    draft.sections.forEach((section) => {
      if (!section.name.trim()) issues.push({ code: 'SECTION_NAME_REQUIRED', message: 'Every section needs a name.' });
      if (section.questionVersionIds.length === 0) issues.push({ code: 'EMPTY_SECTION', message: `${section.name || 'A section'} has no questions.` });
    });
    if (selectedQuestionIds.length === 0) issues.push({ code: 'QUESTIONS_REQUIRED', message: 'Select at least one published question.' });
    if (Math.abs(calculatedMarks - draft.totalMarks) > 0.001) {
      issues.push({ code: 'MARKS_MISMATCH', message: `Selected questions total ${calculatedMarks} marks, while test total is ${draft.totalMarks}.` });
    }
    const timed = draft.sections.filter((section) => section.durationMinutes !== '');
    if (timed.length > 0) {
      const total = timed.reduce((sum, section) => sum + Number(section.durationMinutes || 0), 0);
      if (total !== draft.durationMinutes) issues.push({ code: 'DURATION_MISMATCH', message: `Section durations total ${total} minutes, while test duration is ${draft.durationMinutes}.` });
    }
    return issues;
  }, [draft, calculatedMarks, selectedQuestionIds.length]);

  const addSection = () => {
    const next = draft.sections.length + 1;
    const clientKey = `section-${Date.now()}`;
    setDraft((current) => ({
      ...current,
      sections: [...current.sections, { clientKey, name: `Section ${next}`, durationMinutes: '', questionVersionIds: [] }],
    }));
    setActiveSectionKey(clientKey);
  };

  const removeSection = (clientKey: string) => {
    if (draft.sections.length <= 1) return;
    const next = draft.sections.filter((section) => section.clientKey !== clientKey);
    setDraft((current) => ({ ...current, sections: next, totalMarks: next.flatMap((section) => section.questionVersionIds).length * current.marksPerQuestion }));
    if (activeSectionKey === clientKey) setActiveSectionKey(next[0].clientKey);
  };

  const updateSection = (clientKey: string, patch: Partial<BuilderSection>) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => section.clientKey === clientKey ? { ...section, ...patch } : section),
    }));
  };

  const toggleQuestion = (questionVersionId: string) => {
    if (!activeSection) return;
    setDraft((current) => {
      const alreadySelected = current.sections.some((section) => section.questionVersionIds.includes(questionVersionId));
      const sections = current.sections.map((section) => {
        const without = section.questionVersionIds.filter((id) => id !== questionVersionId);
        if (section.clientKey !== activeSection.clientKey || alreadySelected) return { ...section, questionVersionIds: without };
        return { ...section, questionVersionIds: [...without, questionVersionId] };
      });
      const count = sections.flatMap((section) => section.questionVersionIds).length;
      return { ...current, sections, totalMarks: count * current.marksPerQuestion };
    });
  };

  const payload = (): TestDraftInput => ({
    expectedCurrentDraftVersionId: detail?.test.currentDraftVersionId ?? null,
    examVersionId: draft.examVersionId,
    title: draft.title,
    description: draft.description,
    durationMinutes: draft.durationMinutes,
    totalMarks: draft.totalMarks,
    instructions: { text: draft.instructions },
    settings: {
      testType: draft.testType,
      languageCode: draft.languageCode,
      access: draft.access,
      difficulty: draft.difficulty,
      sectionTiming: draft.sections.some((section) => section.durationMinutes !== '') ? 'sectional' : 'shared',
      navigationRules: { switchSections: true, markForReview: true },
    },
    changeReason: detail ? 'Saved from live Test Builder' : 'Initial live Test Builder draft',
    sections: draft.sections.map((section) => ({
      clientKey: section.clientKey,
      name: section.name,
      durationMinutes: section.durationMinutes === '' ? null : Number(section.durationMinutes),
      settings: {},
      questions: section.questionVersionIds.map((questionVersionId) => ({
        questionVersionId,
        marks: draft.marksPerQuestion,
        negativeMarks: draft.negativeMarks,
        settings: {},
      })),
    })),
  });

  const save = async () => {
    setSaving(true);
    setServerIssues([]);
    try {
      const next = detail
        ? await saveLiveTestDraft(detail.test.id, payload())
        : await createLiveTest(payload());
      setDetail(next);
      setDraft(draftFromDetail(next));
      setServerIssues(next.validationIssues);
      showToast.success('Draft saved to Neon', `${next.test.publicCode} version ${next.currentVersion?.versionNumber ?? ''} is stored.`);
      if (!editId) navigate(`/tests/builder?edit=${next.test.id}`, { replace: true });
    } catch (caught) {
      setServerIssues(detailsFromError(caught));
      showToast.error('Unable to save test', caught instanceof Error ? caught.message : 'Test save failed.');
    } finally {
      setSaving(false);
    }
  };

  const autoAssemble = async () => {
    if (!draft.examVersionId || !activeSection) {
      showToast.warning('Select exam and section', 'Choose an exam version and active section first.');
      return;
    }
    setAssembling(true);
    try {
      const result = await autoAssembleTest({
        examVersionId: draft.examVersionId,
        questionCount: draft.desiredQuestionCount,
        seed: `${draft.title}-${Date.now()}`,
        difficulties: difficultyFilter === 'all' ? [] : [difficultyFilter],
      });
      const ids = result.questions.map((question) => question.questionVersionId);
      setDraft((current) => {
        const otherIds = new Set(current.sections.filter((section) => section.clientKey !== activeSection.clientKey).flatMap((section) => section.questionVersionIds));
        const unique = ids.filter((id) => !otherIds.has(id));
        const sections = current.sections.map((section) => section.clientKey === activeSection.clientKey ? { ...section, questionVersionIds: unique } : section);
        const count = sections.flatMap((section) => section.questionVersionIds).length;
        return { ...current, sections, totalMarks: count * current.marksPerQuestion };
      });
      if (result.shortages.length > 0) showToast.warning('Auto-assembly shortage', result.shortages[0]);
      else showToast.success('Auto-assembly complete', `${result.selectedCount} published questions selected.`);
    } catch (caught) {
      showToast.error('Auto-assembly failed', caught instanceof Error ? caught.message : 'Unable to select questions.');
    } finally {
      setAssembling(false);
    }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading live Test Builder…</div>;
  if (error) return <Card><CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><AlertTriangle className="h-8 w-8 text-destructive" /><p className="mt-3 font-medium">{error}</p><Button className="mt-4" onClick={() => void load()}><RefreshCw className="mr-1.5 h-4 w-4" /> Retry</Button></CardContent></Card>;

  return (
    <div>
      <PageHeader
        title={detail ? `Edit ${detail.test.publicCode}` : 'Build Live Test'}
        description="Canonical Neon-backed test draft with exact published question versions."
        icon={<ListChecks className="h-5 w-5" />}
        actions={<div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link to="/tests"><ArrowLeft className="mr-1.5 h-4 w-4" /> Tests</Link></Button><Button variant="outline" size="sm" onClick={() => void load()} disabled={saving}><RefreshCw className="mr-1.5 h-4 w-4" /> Reload</Button><Button size="sm" onClick={() => void save()} disabled={saving}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save to Neon</Button></div>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {detail && <Badge variant="outline">Version {detail.currentVersion?.versionNumber ?? '—'}</Badge>}
        {detail && <Badge>{detail.test.status.replace(/_/g, ' ')}</Badge>}
        <Badge variant="outline">{selectedQuestionIds.length} questions</Badge>
        <Badge variant="outline">{draft.totalMarks} marks</Badge>
        {localIssues.length === 0 ? <Badge className="bg-success/10 text-success hover:bg-success/10"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Locally valid</Badge> : <Badge className="bg-warning/10 text-warning hover:bg-warning/10"><AlertTriangle className="mr-1 h-3.5 w-3.5" /> {localIssues.length} issue(s)</Badge>}
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="details">Basic info</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="questions">Published questions</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="preview"><Eye className="mr-1.5 h-4 w-4" /> Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card><CardHeader><CardTitle className="text-base">Test configuration</CardTitle></CardHeader><CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Exam version</Label><Select value={draft.examVersionId} onValueChange={(value) => setDraft((current) => ({ ...current, examVersionId: value, languageCode: catalog.find((exam) => exam.id === value)?.languages.find((language) => language.isPrimary)?.code ?? 'en', sections: current.sections.map((section) => ({ ...section, questionVersionIds: [] })), totalMarks: 0 }))}><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger><SelectContent>{catalog.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.familyName} • {exam.examName} • {exam.versionName}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Title</Label><Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="SSC CGL Full Mock 01" /></div></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} /></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><NumberField label="Duration (minutes)" value={draft.durationMinutes} min={1} onChange={(value) => setDraft((current) => ({ ...current, durationMinutes: value }))} /><NumberField label="Marks per question" value={draft.marksPerQuestion} min={0.01} step={0.25} onChange={(value) => setDraft((current) => ({ ...current, marksPerQuestion: value, totalMarks: selectedQuestionIds.length * value }))} /><NumberField label="Negative marks" value={draft.negativeMarks} min={0} step={0.25} onChange={(value) => setDraft((current) => ({ ...current, negativeMarks: value }))} /><NumberField label="Total marks" value={draft.totalMarks} min={0.01} step={0.25} onChange={(value) => setDraft((current) => ({ ...current, totalMarks: value }))} /></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><SelectField label="Test type" value={draft.testType} options={[['full_mock', 'Full Mock'], ['sectional', 'Sectional Test'], ['quiz', 'Quiz'], ['previous_year', 'Previous Year']]} onChange={(value) => setDraft((current) => ({ ...current, testType: value }))} /><SelectField label="Access" value={draft.access} options={[['free', 'Free'], ['paid', 'Paid'], ['premium', 'Premium']]} onChange={(value) => setDraft((current) => ({ ...current, access: value }))} /><SelectField label="Difficulty" value={draft.difficulty} options={[['Easy', 'Easy'], ['Moderate', 'Moderate'], ['Hard', 'Hard'], ['Mixed', 'Mixed']]} onChange={(value) => setDraft((current) => ({ ...current, difficulty: value }))} /><div className="space-y-2"><Label>Language</Label><Select value={draft.languageCode} onValueChange={(value) => setDraft((current) => ({ ...current, languageCode: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{selectedExam?.languages.map((language) => <SelectItem key={language.id} value={language.code}>{language.name}</SelectItem>) ?? <SelectItem value="en">English</SelectItem>}</SelectContent></Select></div></div>
            <div className="space-y-2"><Label>Instructions</Label><Textarea value={draft.instructions} onChange={(event) => setDraft((current) => ({ ...current, instructions: event.target.value }))} rows={5} /></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="sections">
          <div className="space-y-4"><div className="flex justify-end"><Button onClick={addSection}><Plus className="mr-1.5 h-4 w-4" /> Add section</Button></div>{draft.sections.map((section, index) => <Card key={section.clientKey} className={section.clientKey === activeSectionKey ? 'border-primary/50' : ''}><CardContent className="p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-end"><div className="flex-1 space-y-2"><Label>Section {index + 1} name</Label><Input value={section.name} onFocus={() => setActiveSectionKey(section.clientKey)} onChange={(event) => updateSection(section.clientKey, { name: event.target.value })} /></div><div className="w-full space-y-2 lg:w-48"><Label>Duration (optional)</Label><Input type="number" min={1} value={section.durationMinutes} onChange={(event) => updateSection(section.clientKey, { durationMinutes: event.target.value })} placeholder="Shared timer" /></div><Button variant={section.clientKey === activeSectionKey ? 'default' : 'outline'} onClick={() => setActiveSectionKey(section.clientKey)}>{section.questionVersionIds.length} questions</Button><Button variant="ghost" size="icon" disabled={draft.sections.length <= 1} onClick={() => removeSection(section.clientKey)}><Trash2 className="h-4 w-4" /></Button></div></CardContent></Card>)}</div>
        </TabsContent>

        <TabsContent value="questions">
          <Card><CardHeader><CardTitle className="text-base">Published Question Bank</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/20 p-3 text-sm">Questions are added to <strong>{activeSection?.name ?? 'the active section'}</strong>. Selecting an already-used question removes it from its previous section.</div>
            <div className="flex flex-wrap gap-2"><Input className="max-w-sm" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search published questions" /><Select value={difficultyFilter} onValueChange={setDifficultyFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All difficulties</SelectItem><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Moderate">Moderate</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select><Input className="w-32" type="number" min={1} max={300} value={draft.desiredQuestionCount} onChange={(event) => setDraft((current) => ({ ...current, desiredQuestionCount: Number(event.target.value) }))} /><Button onClick={() => void autoAssemble()} disabled={assembling}>{assembling ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />} Auto-assemble</Button></div>
            {!draft.examVersionId ? <p className="py-12 text-center text-sm text-muted-foreground">Select an exam version to load its published questions.</p> : availableQuestions.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">No published questions match these filters.</p> : <div className="max-h-[560px] divide-y overflow-y-auto rounded-lg border">{availableQuestions.map((question) => <label key={question.versionId} className="flex cursor-pointer items-start gap-3 p-3 hover:bg-muted/30"><Checkbox className="mt-1" checked={selectedQuestionSet.has(question.versionId)} onCheckedChange={() => toggleQuestion(question.versionId)} /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><Badge variant="outline">{question.publicCode}</Badge><Badge variant="outline">{question.difficulty}</Badge>{question.taxonomy.map((node) => <Badge key={node.id} variant="secondary">{node.name}</Badge>)}</div><p className="mt-2 text-sm leading-6">{question.stem}</p></div></label>)}</div>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="validation">
          <div className="grid gap-4 lg:grid-cols-2"><IssueCard title="Current local checks" issues={localIssues} /><IssueCard title="Last server validation" issues={serverIssues} /></div>
        </TabsContent>

        <TabsContent value="preview">
          <Card><CardHeader><CardTitle className="text-base">Exact student test preview</CardTitle></CardHeader><CardContent className="space-y-6"><div className="rounded-lg border bg-muted/20 p-4"><h2 className="font-display text-xl font-semibold">{draft.title || 'Untitled test'}</h2><p className="mt-1 text-sm text-muted-foreground">{selectedExam?.examName ?? 'No exam selected'} • {draft.durationMinutes} minutes • {draft.totalMarks} marks</p><p className="mt-3 whitespace-pre-wrap text-sm">{draft.instructions}</p></div>{draft.sections.map((section) => <div key={section.clientKey}><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{section.name}</h3><Badge variant="outline">{section.questionVersionIds.length} questions</Badge></div><div className="space-y-4">{section.questionVersionIds.map((id, index) => { const question = questionMap.get(id); if (!question) return null; return <div key={id} className="rounded-lg border p-4"><p className="text-sm font-medium">{index + 1}. {question.stem}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <div key={option.id} className="rounded-md border px-3 py-2 text-sm"><strong>{option.key}.</strong> {option.text}</div>)}</div><p className="mt-3 text-xs text-muted-foreground">+{draft.marksPerQuestion} / -{draft.negativeMarks}</p></div>; })}</div></div>)}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NumberField({ label, value, onChange, min, step = 1 }: { label: string; value: number; onChange: (value: number) => void; min: number; step?: number }) {
  return <div className="space-y-2"><Label>{label}</Label><Input type="number" min={min} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label>{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{options.map(([optionValue, optionLabel]) => <SelectItem key={optionValue} value={optionValue}>{optionLabel}</SelectItem>)}</SelectContent></Select></div>;
}

function IssueCard({ title, issues }: { title: string; issues: TestValidationIssue[] }) {
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent>{issues.length === 0 ? <div className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="h-4 w-4" /> No issues found.</div> : <div className="space-y-2">{issues.map((issue, index) => <div key={`${issue.code}-${index}`} className="flex gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><div><p>{issue.message}</p><p className="mt-1 text-xs text-muted-foreground">{issue.code}</p></div></div>)}</div>}</CardContent></Card>;
}
