import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  FileQuestion,
  Globe2,
  Languages,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  TestTube2,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  addTranslationComment,
  assignQuestionTranslation,
  assignTestTranslation,
  createLanguage,
  createTranslationTerm,
  getQuestionTranslation,
  getTestTranslation,
  getTranslationOverview,
  saveQuestionTranslation,
  saveTestTranslation,
  transitionQuestionTranslation,
  transitionTestTranslation,
  updateExamVersionLanguages,
  updateLanguage,
  updateTranslationTerm,
  type LanguageSummary,
  type QuestionTranslationDetail,
  type TestLocalizationSummary,
  type TestTranslationDetail,
  type TranslationOverview,
  type TranslationQueueItem,
  type TranslationStatus,
  type TranslationTerm,
} from '@/features/translations/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const STATUS_ORDER: TranslationStatus[] = ['needs_fix', 'in_review', 'missing', 'draft', 'rejected', 'approved', 'archived'];

function label(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusClass(status: string): string {
  if (status === 'approved' || status === 'source') return 'border-success/30 bg-success/10 text-success';
  if (status === 'needs_fix' || status === 'rejected') return 'border-destructive/30 bg-destructive/10 text-destructive';
  if (status === 'in_review') return 'border-info/30 bg-info/10 text-info';
  if (status === 'missing') return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted text-muted-foreground';
}

function time(value: string | null | undefined): string {
  if (!value) return 'Not recorded';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Invalid timestamp' : parsed.toLocaleString();
}

function requireJsonObject(value: string): Record<string, unknown> {
  const parsed = value.trim() ? JSON.parse(value) as unknown : {};
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Instructions must be a JSON object.');
  return parsed as Record<string, unknown>;
}

function Metric({ name, value, note, danger = false }: { name: string; value: number; note: string; danger?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{name}</p>
        <p className={cn('mt-2 text-2xl font-bold', danger && value > 0 && 'text-destructive')}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

function LanguageCoverageCard({ language, canManage, onToggle }: {
  language: LanguageSummary;
  canManage: boolean;
  onToggle: (language: LanguageSummary) => Promise<void>;
}) {
  const completion = language.sourceLanguage ? 100 : language.completionPercent;
  return (
    <Card className={cn(!language.isActive && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{language.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{language.nativeName}</p>
          </div>
          <Badge variant="outline" className={statusClass(completion === 100 ? 'approved' : 'missing')}>
            {language.sourceLanguage ? 'Source' : `${completion}%`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={completion} className="h-2" />
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border p-2"><strong className="block text-lg">{language.eligibleQuestionCount}</strong>Eligible</div>
          <div className="rounded-lg border p-2"><strong className="block text-lg">{language.approvedQuestionCount}</strong>Approved</div>
          <div className="rounded-lg border p-2"><strong className="block text-lg">{language.examVersionCount}</strong>Exams</div>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{language.inReviewQuestionCount} review · {language.needsFixQuestionCount} fixes</span>
          {canManage && !language.sourceLanguage && (
            <Button size="sm" variant="outline" onClick={() => void onToggle(language)}>
              {language.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function LanguagesPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.translations.update');
  const canReview = hasPermission('content.translations.review');
  const canManage = hasPermission('settings.languages.manage');

  const [overview, setOverview] = useState<TranslationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [queueSearch, setQueueSearch] = useState('');
  const [queueStatus, setQueueStatus] = useState('all');
  const [queueLanguage, setQueueLanguage] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState<TranslationQueueItem | null>(null);
  const [questionDetail, setQuestionDetail] = useState<QuestionTranslationDetail | null>(null);
  const [questionBusy, setQuestionBusy] = useState(false);
  const [stem, setStem] = useState('');
  const [explanation, setExplanation] = useState('');
  const [options, setOptions] = useState<Array<{ key: string; text: string; sortOrder: number }>>([]);
  const [questionReason, setQuestionReason] = useState('');
  const [questionTranslator, setQuestionTranslator] = useState('');
  const [questionReviewer, setQuestionReviewer] = useState('');
  const [comment, setComment] = useState('');

  const [selectedTest, setSelectedTest] = useState<TestLocalizationSummary | null>(null);
  const [testLanguage, setTestLanguage] = useState('');
  const [testDetail, setTestDetail] = useState<TestTranslationDetail | null>(null);
  const [testBusy, setTestBusy] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testInstructions, setTestInstructions] = useState('{}');
  const [testSections, setTestSections] = useState<Array<{ testSectionId: string; name: string }>>([]);
  const [testReason, setTestReason] = useState('');
  const [testTranslator, setTestTranslator] = useState('');
  const [testReviewer, setTestReviewer] = useState('');

  const [termLanguage, setTermLanguage] = useState('hi');
  const [termSource, setTermSource] = useState('');
  const [termPreferred, setTermPreferred] = useState('');
  const [termForbidden, setTermForbidden] = useState('');
  const [termNote, setTermNote] = useState('');
  const [termReason, setTermReason] = useState('');

  const [languageCode, setLanguageCode] = useState('');
  const [languageName, setLanguageName] = useState('');
  const [languageNativeName, setLanguageNativeName] = useState('');
  const [languageScript, setLanguageScript] = useState('');
  const [languageReason, setLanguageReason] = useState('');

  const [mappingExamVersionId, setMappingExamVersionId] = useState('');
  const [mappingLanguageIds, setMappingLanguageIds] = useState<string[]>([]);
  const [mappingPrimaryId, setMappingPrimaryId] = useState('');
  const [mappingReason, setMappingReason] = useState('');

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const next = await getTranslationOverview();
      setOverview(next);
      setPageError(null);
      setMappingExamVersionId((current) => current || next.examMappings[0]?.examVersionId || '');
    } catch (caught) {
      setPageError(caught instanceof Error ? caught.message : 'Unable to load translation operations.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const targetLanguages = useMemo(
    () => (overview?.languages ?? []).filter((language) => !language.sourceLanguage),
    [overview?.languages],
  );

  const filteredQueue = useMemo(() => {
    const search = queueSearch.trim().toLowerCase();
    return (overview?.queue ?? [])
      .filter((item) => queueStatus === 'all' || item.status === queueStatus)
      .filter((item) => queueLanguage === 'all' || item.languageCode === queueLanguage)
      .filter((item) => !search || [item.publicCode, item.sourceStem, item.examName, item.taxonomyName]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(search)))
      .sort((left, right) => STATUS_ORDER.indexOf(left.status) - STATUS_ORDER.indexOf(right.status));
  }, [overview?.queue, queueLanguage, queueSearch, queueStatus]);

  const selectedMapping = useMemo(
    () => overview?.examMappings.find((mapping) => mapping.examVersionId === mappingExamVersionId) ?? null,
    [mappingExamVersionId, overview?.examMappings],
  );

  useEffect(() => {
    if (!selectedMapping) return;
    setMappingLanguageIds(selectedMapping.languages.map((language) => language.id));
    setMappingPrimaryId(selectedMapping.languages.find((language) => language.isPrimary)?.id ?? '');
  }, [selectedMapping]);

  const hydrateQuestion = (detail: QuestionTranslationDetail) => {
    setQuestionDetail(detail);
    setStem(detail.target?.stem ?? '');
    setExplanation(detail.target?.explanation ?? '');
    setOptions(detail.target?.options.length
      ? detail.target.options.map(({ key, text, sortOrder }) => ({ key, text, sortOrder }))
      : detail.source.options.map(({ key, sortOrder }) => ({ key, text: '', sortOrder })));
    setQuestionTranslator(detail.target?.translatorUserId ?? '');
    setQuestionReviewer(detail.target?.reviewerUserId ?? '');
  };

  const openQuestion = async (item: TranslationQueueItem) => {
    setSelectedQuestion(item);
    setQuestionDetail(null);
    setQuestionReason('');
    setComment('');
    setQuestionBusy(true);
    try {
      hydrateQuestion(await getQuestionTranslation(item.questionVersionId, item.languageCode));
    } catch (caught) {
      showToast.error('Translation unavailable', caught instanceof Error ? caught.message : 'Unable to load translation.');
    } finally {
      setQuestionBusy(false);
    }
  };

  const reloadQuestion = async () => {
    if (!selectedQuestion) return;
    hydrateQuestion(await getQuestionTranslation(selectedQuestion.questionVersionId, selectedQuestion.languageCode));
  };

  const saveQuestion = async () => {
    if (!selectedQuestion) return;
    setQuestionBusy(true);
    try {
      const response = await saveQuestionTranslation({
        questionVersionId: selectedQuestion.questionVersionId,
        languageCode: selectedQuestion.languageCode,
        stem,
        explanation,
        options,
        reason: questionReason,
      });
      hydrateQuestion(response.detail);
      setQuestionReason('');
      await refresh(true);
      showToast.success('Translation saved', 'Quality evidence and audit history were refreshed.');
    } catch (caught) {
      showToast.error('Save blocked', caught instanceof Error ? caught.message : 'Unable to save translation.');
    } finally {
      setQuestionBusy(false);
    }
  };

  const saveQuestionAssignment = async () => {
    if (!questionDetail?.target) return;
    setQuestionBusy(true);
    try {
      await assignQuestionTranslation({
        translationId: questionDetail.target.id,
        translatorUserId: questionTranslator || null,
        reviewerUserId: questionReviewer || null,
        reason: questionReason,
      });
      setQuestionReason('');
      await reloadQuestion();
      await refresh(true);
      showToast.success('Assignment saved', 'Canonical translation ownership was updated.');
    } catch (caught) {
      showToast.error('Assignment blocked', caught instanceof Error ? caught.message : 'Unable to save assignment.');
    } finally {
      setQuestionBusy(false);
    }
  };

  const changeQuestionStatus = async (status: Exclude<TranslationStatus, 'missing'>) => {
    if (!questionDetail?.target) return;
    setQuestionBusy(true);
    try {
      const response = await transitionQuestionTranslation({
        translationId: questionDetail.target.id,
        status,
        reason: questionReason,
      });
      hydrateQuestion(response.detail);
      setQuestionReason('');
      await refresh(true);
      showToast.success('Review state updated', `Translation moved to ${label(status)}.`);
    } catch (caught) {
      showToast.error('Review action blocked', caught instanceof Error ? caught.message : 'Unable to update status.');
    } finally {
      setQuestionBusy(false);
    }
  };

  const postComment = async () => {
    if (!questionDetail?.target || !comment.trim()) return;
    setQuestionBusy(true);
    try {
      await addTranslationComment({ translationId: questionDetail.target.id, body: comment.trim() });
      setComment('');
      await reloadQuestion();
      showToast.success('Comment added', 'Discussion is now part of immutable review history.');
    } catch (caught) {
      showToast.error('Comment failed', caught instanceof Error ? caught.message : 'Unable to add comment.');
    } finally {
      setQuestionBusy(false);
    }
  };

  const hydrateTest = (detail: TestTranslationDetail) => {
    setTestDetail(detail);
    setTestTitle(detail.target?.title ?? '');
    setTestDescription(detail.target?.description ?? '');
    setTestInstructions(JSON.stringify(detail.target?.instructions ?? {}, null, 2));
    setTestSections(detail.source.sections.map((section) => ({
      testSectionId: section.id,
      name: detail.target?.sections.find((target) => target.testSectionId === section.id)?.name ?? '',
    })));
    setTestTranslator(detail.target?.translatorUserId ?? '');
    setTestReviewer(detail.target?.reviewerUserId ?? '');
  };

  const openTest = async (test: TestLocalizationSummary, requestedLanguage?: string) => {
    const nextLanguage = requestedLanguage || test.languageCodes.find((code) => code !== 'en') || targetLanguages[0]?.code;
    if (!nextLanguage) {
      showToast.error('No target language', 'Activate and map a non-English language first.');
      return;
    }
    setSelectedTest(test);
    setTestLanguage(nextLanguage);
    setTestDetail(null);
    setTestReason('');
    setTestBusy(true);
    try {
      hydrateTest(await getTestTranslation(test.testVersionId, nextLanguage));
    } catch (caught) {
      showToast.error('Test localization unavailable', caught instanceof Error ? caught.message : 'Unable to load test localization.');
    } finally {
      setTestBusy(false);
    }
  };

  const reloadTest = async () => {
    if (!selectedTest || !testLanguage) return;
    hydrateTest(await getTestTranslation(selectedTest.testVersionId, testLanguage));
  };

  const saveTest = async () => {
    if (!selectedTest || !testLanguage) return;
    setTestBusy(true);
    try {
      await saveTestTranslation({
        testVersionId: selectedTest.testVersionId,
        languageCode: testLanguage,
        title: testTitle,
        description: testDescription,
        instructions: requireJsonObject(testInstructions),
        sections: testSections,
        reason: testReason,
      });
      setTestReason('');
      await reloadTest();
      await refresh(true);
      showToast.success('Test localization saved', 'Metadata and every section label were updated.');
    } catch (caught) {
      showToast.error('Test save blocked', caught instanceof Error ? caught.message : 'Unable to save test localization.');
    } finally {
      setTestBusy(false);
    }
  };

  const saveTestAssignment = async () => {
    if (!testDetail?.target) return;
    setTestBusy(true);
    try {
      await assignTestTranslation({
        translationId: testDetail.target.id,
        translatorUserId: testTranslator || null,
        reviewerUserId: testReviewer || null,
        reason: testReason,
      });
      setTestReason('');
      await reloadTest();
      showToast.success('Test assignment saved', 'Canonical ownership was updated.');
    } catch (caught) {
      showToast.error('Assignment blocked', caught instanceof Error ? caught.message : 'Unable to save assignment.');
    } finally {
      setTestBusy(false);
    }
  };

  const changeTestStatus = async (status: Exclude<TranslationStatus, 'missing'>) => {
    if (!testDetail?.target) return;
    setTestBusy(true);
    try {
      const response = await transitionTestTranslation({
        translationId: testDetail.target.id,
        status,
        reason: testReason,
      });
      hydrateTest(response.detail);
      setTestReason('');
      await refresh(true);
      showToast.success('Test review state updated', `Test localization moved to ${label(status)}.`);
    } catch (caught) {
      showToast.error('Review blocked', caught instanceof Error ? caught.message : 'Unable to update test localization.');
    } finally {
      setTestBusy(false);
    }
  };

  const addTerm = async () => {
    try {
      await createTranslationTerm({
        languageCode: termLanguage,
        sourceText: termSource,
        preferredText: termPreferred,
        forbiddenVariants: termForbidden.split(',').map((value) => value.trim()).filter(Boolean),
        contextNote: termNote,
        scopeTaxonomyNodeId: null,
        reason: termReason,
      });
      setTermSource('');
      setTermPreferred('');
      setTermForbidden('');
      setTermNote('');
      setTermReason('');
      await refresh(true);
      showToast.success('Terminology rule created', 'The quality engine now enforces it.');
    } catch (caught) {
      showToast.error('Terminology save blocked', caught instanceof Error ? caught.message : 'Unable to create terminology.');
    }
  };

  const toggleTerm = async (term: TranslationTerm) => {
    try {
      await updateTranslationTerm({
        termId: term.id,
        sourceText: term.sourceText,
        preferredText: term.preferredText,
        forbiddenVariants: term.forbiddenVariants,
        contextNote: term.contextNote,
        scopeTaxonomyNodeId: term.scopeTaxonomyNodeId,
        isActive: !term.isActive,
        reason: `${term.isActive ? 'Deactivate' : 'Reactivate'} terminology rule`,
      });
      await refresh(true);
    } catch (caught) {
      showToast.error('Terminology update blocked', caught instanceof Error ? caught.message : 'Unable to update terminology.');
    }
  };

  const toggleLanguage = async (language: LanguageSummary) => {
    try {
      await updateLanguage({
        languageId: language.id,
        name: language.name,
        nativeName: language.nativeName,
        direction: language.direction,
        scriptCode: language.scriptCode,
        fallbackLanguageId: language.fallbackLanguageId,
        isActive: !language.isActive,
        reason: `${language.isActive ? 'Deactivate' : 'Activate'} language`,
      });
      await refresh(true);
    } catch (caught) {
      showToast.error('Language update blocked', caught instanceof Error ? caught.message : 'Unable to update language.');
    }
  };

  const addLanguage = async () => {
    try {
      await createLanguage({
        code: languageCode,
        name: languageName,
        nativeName: languageNativeName,
        direction: 'ltr',
        scriptCode: languageScript || null,
        fallbackLanguageId: overview?.languages.find((language) => language.code === 'en')?.id ?? null,
        isActive: true,
        reason: languageReason,
      });
      setLanguageCode('');
      setLanguageName('');
      setLanguageNativeName('');
      setLanguageScript('');
      setLanguageReason('');
      await refresh(true);
    } catch (caught) {
      showToast.error('Language creation blocked', caught instanceof Error ? caught.message : 'Unable to create language.');
    }
  };

  const saveMapping = async () => {
    if (!mappingExamVersionId) return;
    try {
      await updateExamVersionLanguages({
        examVersionId: mappingExamVersionId,
        languages: mappingLanguageIds.map((languageId) => ({ languageId, isPrimary: languageId === mappingPrimaryId })),
        reason: mappingReason,
      });
      setMappingReason('');
      await refresh(true);
      showToast.success('Exam languages saved', 'Eligibility and publication gates now use this mapping.');
    } catch (caught) {
      showToast.error('Mapping update blocked', caught instanceof Error ? caught.message : 'Unable to update exam languages.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Languages & Translation Operations"
        description="Question and test localization, terminology governance, reviewer ownership and language-specific publication readiness."
        icon={<Languages className="h-5 w-5" />}
        actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} />Refresh</Button>}
      />

      {pageError && <div className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="h-4 w-4 shrink-0" />{pageError}</div>}

      {loading && !overview ? (
        <Card><CardContent className="flex min-h-72 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading canonical translation operations…</CardContent></Card>
      ) : overview ? (
        <Tabs defaultValue="coverage" className="space-y-5">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="coverage"><Globe2 className="mr-1.5 h-4 w-4" />Coverage</TabsTrigger>
            <TabsTrigger value="questions"><FileQuestion className="mr-1.5 h-4 w-4" />Questions ({overview.queue.length})</TabsTrigger>
            <TabsTrigger value="tests"><TestTube2 className="mr-1.5 h-4 w-4" />Tests ({overview.tests.length})</TabsTrigger>
            <TabsTrigger value="terms"><BookOpenCheck className="mr-1.5 h-4 w-4" />Terminology</TabsTrigger>
            <TabsTrigger value="settings"><Settings2 className="mr-1.5 h-4 w-4" />Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="coverage" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <Metric name="Eligible pairs" value={overview.metrics.eligiblePairs} note="Question × target language" />
              <Metric name="Missing" value={overview.metrics.missing} note="Not started" danger />
              <Metric name="Draft" value={overview.metrics.draft} note="Editing in progress" />
              <Metric name="In review" value={overview.metrics.inReview} note="Awaiting decision" />
              <Metric name="Needs fix" value={overview.metrics.needsFix} note="Returned to translator" danger />
              <Metric name="Blocked tests" value={overview.metrics.testsBlocked} note="Cannot publish" danger />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {overview.languages.map((language) => <LanguageCoverageCard key={language.id} language={language} canManage={canManage} onToggle={toggleLanguage} />)}
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" />End-to-end release contract</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
                <p className="rounded-lg border p-3">Every stem, explanation, protected value and option must pass deterministic quality checks.</p>
                <p className="rounded-lg border p-3">Test metadata, section labels and every question-language dependency must be approved.</p>
                <p className="rounded-lg border p-3">Candidate delivery never silently substitutes English for an incomplete configured language.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card><CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_190px_190px]">
              <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={queueSearch} onChange={(event) => setQueueSearch(event.target.value)} placeholder="Search code, stem, exam or topic…" /></div>
              <select className="h-10 rounded-md border bg-background px-3 text-sm" value={queueStatus} onChange={(event) => setQueueStatus(event.target.value)}><option value="all">All statuses</option>{STATUS_ORDER.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select>
              <select className="h-10 rounded-md border bg-background px-3 text-sm" value={queueLanguage} onChange={(event) => setQueueLanguage(event.target.value)}><option value="all">All languages</option>{targetLanguages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}</select>
            </CardContent></Card>
            <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[980px] text-left text-sm"><thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Question</th><th className="px-4 py-3">Language</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Options</th><th className="px-4 py-3">Owners</th><th className="px-4 py-3" /></tr></thead><tbody>
              {filteredQueue.map((item) => <tr key={`${item.questionVersionId}:${item.languageCode}`} className="border-b last:border-0"><td className="max-w-md px-4 py-3"><p className="font-medium">{item.publicCode} · {item.examCode}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.sourceStem}</p></td><td className="px-4 py-3">{item.languageName}</td><td className="px-4 py-3"><Badge variant="outline" className={statusClass(item.status)}>{label(item.status)}</Badge></td><td className="px-4 py-3">{item.translatedOptionCount}/{item.sourceOptionCount}</td><td className="px-4 py-3 text-xs"><p>{item.translatorName || 'Translator unassigned'}</p><p className="text-muted-foreground">{item.reviewerName || 'Reviewer unassigned'}</p></td><td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => void openQuestion(item)}>Open</Button></td></tr>)}
              {filteredQueue.length === 0 && <tr><td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">No translation work matches these filters.</td></tr>}
            </tbody></table></CardContent></Card>
          </TabsContent>

          <TabsContent value="tests" className="grid gap-4 lg:grid-cols-2">
            {overview.tests.map((test) => <Card key={test.testVersionId} className={cn(!test.localizationReady && 'border-warning/30')}><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{test.title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · {test.examCode} · {test.questionCount} questions</p></div><Badge variant="outline" className={statusClass(test.localizationReady ? 'approved' : 'missing')}>{test.localizationReady ? 'Ready' : 'Blocked'}</Badge></div></CardHeader><CardContent className="space-y-2">{test.languages.map((language) => <div key={language.languageCode} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span><strong className="uppercase">{language.languageCode}</strong><span className="ml-2 text-xs text-muted-foreground">{language.translatedSectionCount}/{language.sectionCount} sections</span></span><span className="flex items-center gap-2"><Badge variant="outline" className={statusClass(language.status)}>{label(language.status)}</Badge>{language.languageCode !== 'en' && <Button size="sm" variant="outline" onClick={() => void openTest(test, language.languageCode)}>Manage</Button>}</span></div>)}{!test.languageCodes.some((code) => code !== 'en') && targetLanguages[0] && <Button variant="outline" className="w-full" onClick={() => void openTest(test, targetLanguages[0].code)}><Plus className="mr-1.5 h-4 w-4" />Start localization</Button>}</CardContent></Card>)}
            {overview.tests.length === 0 && <Card className="lg:col-span-2"><CardContent className="py-16 text-center text-muted-foreground">No test versions are available.</CardContent></Card>}
          </TabsContent>

          <TabsContent value="terms" className="space-y-4">
            {canManage && <Card><CardHeader><CardTitle className="text-base">Add terminology rule</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={termLanguage} onChange={(event) => setTermLanguage(event.target.value)}>{targetLanguages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}</select><Input value={termSource} onChange={(event) => setTermSource(event.target.value)} placeholder="English source term" /><Input value={termPreferred} onChange={(event) => setTermPreferred(event.target.value)} placeholder="Preferred target term" /><Input value={termForbidden} onChange={(event) => setTermForbidden(event.target.value)} placeholder="Forbidden variants, comma-separated" /><Input value={termNote} onChange={(event) => setTermNote(event.target.value)} placeholder="Context note" /><Input value={termReason} onChange={(event) => setTermReason(event.target.value)} placeholder="Audit reason" /><div className="md:col-span-2 xl:col-span-3"><Button onClick={() => void addTerm()}><Plus className="mr-1.5 h-4 w-4" />Create rule</Button></div></CardContent></Card>}
            <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Language</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Preferred</th><th className="px-4 py-3">Forbidden</th><th className="px-4 py-3">Scope</th><th className="px-4 py-3" /></tr></thead><tbody>{overview.terms.map((term) => <tr key={term.id} className="border-b last:border-0"><td className="px-4 py-3">{term.languageName}</td><td className="px-4 py-3 font-medium">{term.sourceText}</td><td className="px-4 py-3">{term.preferredText}</td><td className="px-4 py-3 text-xs text-muted-foreground">{term.forbiddenVariants.join(', ') || '—'}</td><td className="px-4 py-3 text-xs">{term.scopeTaxonomyName || 'Global'}</td><td className="px-4 py-3 text-right">{canManage && <Button size="sm" variant="outline" onClick={() => void toggleTerm(term)}>{term.isActive ? 'Deactivate' : 'Reactivate'}</Button>}</td></tr>)}{overview.terms.length === 0 && <tr><td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">No terminology rules exist.</td></tr>}</tbody></table></CardContent></Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {canManage ? <><Card><CardHeader><CardTitle className="text-base">Add supported language</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><Input value={languageCode} onChange={(event) => setLanguageCode(event.target.value)} placeholder="Code, e.g. ur" /><Input value={languageName} onChange={(event) => setLanguageName(event.target.value)} placeholder="Language name" /><Input value={languageNativeName} onChange={(event) => setLanguageNativeName(event.target.value)} placeholder="Native name" /><Input value={languageScript} onChange={(event) => setLanguageScript(event.target.value)} placeholder="Script, e.g. Arab" /><Input value={languageReason} onChange={(event) => setLanguageReason(event.target.value)} placeholder="Audit reason" /><div className="md:col-span-2 xl:col-span-5"><Button onClick={() => void addLanguage()}><Plus className="mr-1.5 h-4 w-4" />Add language</Button></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Exam language mapping</CardTitle></CardHeader><CardContent className="space-y-4"><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={mappingExamVersionId} onChange={(event) => setMappingExamVersionId(event.target.value)}>{overview.examMappings.map((mapping) => <option key={mapping.examVersionId} value={mapping.examVersionId}>{mapping.examCode} · {mapping.examVersionName}</option>)}</select><div className="grid gap-2 md:grid-cols-3">{overview.languages.filter((language) => language.isActive).map((language) => <label key={language.id} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{language.name}</span><input type="checkbox" checked={mappingLanguageIds.includes(language.id)} onChange={(event) => { if (event.target.checked) setMappingLanguageIds((current) => [...current, language.id]); else { setMappingLanguageIds((current) => current.filter((id) => id !== language.id)); if (mappingPrimaryId === language.id) setMappingPrimaryId(''); } }} /></label>)}</div><div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={mappingPrimaryId} onChange={(event) => setMappingPrimaryId(event.target.value)}><option value="">Primary language</option>{overview.languages.filter((language) => mappingLanguageIds.includes(language.id)).map((language) => <option key={language.id} value={language.id}>{language.name}</option>)}</select><Input value={mappingReason} onChange={(event) => setMappingReason(event.target.value)} placeholder="Audit reason" /><Button onClick={() => void saveMapping()}><Save className="mr-1.5 h-4 w-4" />Save</Button></div></CardContent></Card></> : <Card><CardContent className="py-16 text-center text-muted-foreground">You can view language configuration but cannot change it.</CardContent></Card>}
          </TabsContent>
        </Tabs>
      ) : null}

      <Sheet open={Boolean(selectedQuestion)} onOpenChange={(open) => { if (!open) { setSelectedQuestion(null); setQuestionDetail(null); } }}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
          <SheetHeader><SheetTitle>{selectedQuestion?.publicCode} · {selectedQuestion?.languageName}</SheetTitle><SheetDescription>Source comparison, option-safe editing, deterministic quality and auditable review.</SheetDescription></SheetHeader>
          {questionBusy && !questionDetail ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div> : questionDetail ? <div className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="text-sm">English source</CardTitle></CardHeader><CardContent className="space-y-3"><p className="whitespace-pre-wrap text-sm">{questionDetail.source.stem}</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{questionDetail.source.explanation}</p>{questionDetail.source.options.map((option) => <p key={option.key} className="rounded-lg border p-3 text-sm"><strong>{option.key}.</strong> {option.text}</p>)}</CardContent></Card><Card><CardHeader><div className="flex justify-between"><CardTitle className="text-sm">Target translation</CardTitle><Badge variant="outline" className={statusClass(questionDetail.target?.status ?? 'missing')}>{label(questionDetail.target?.status ?? 'missing')}</Badge></div></CardHeader><CardContent className="space-y-3" dir={questionDetail.language.direction}><Textarea rows={5} value={stem} onChange={(event) => setStem(event.target.value)} disabled={!canEdit} placeholder="Translated stem" /><Textarea rows={7} value={explanation} onChange={(event) => setExplanation(event.target.value)} disabled={!canEdit} placeholder="Translated explanation" />{options.map((option, index) => <div key={option.key} className="grid grid-cols-[40px_minmax(0,1fr)] gap-2"><span className="rounded border p-2 text-center font-semibold">{option.key}</span><Input value={option.text} disabled={!canEdit} onChange={(event) => setOptions((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, text: event.target.value } : entry))} /></div>)}</CardContent></Card></div>
            <Card><CardHeader><div className="flex justify-between"><CardTitle className="text-sm">Quality gate</CardTitle>{questionDetail.quality && <Badge variant="outline" className={statusClass(questionDetail.quality.approvable ? 'approved' : 'needs_fix')}>{questionDetail.quality.score}/100</Badge>}</div></CardHeader><CardContent className="space-y-2">{questionDetail.quality?.issues.map((issue) => <div key={`${issue.code}:${issue.message}`} className={cn('flex gap-2 rounded-lg border p-3 text-sm', issue.severity === 'error' ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5')}>{issue.severity === 'error' ? <XCircle className="h-4 w-4 shrink-0 text-destructive" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />}<span>{issue.message}</span></div>)}{questionDetail.quality?.issues.length === 0 && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" />No blocking quality issues.</p>}{!questionDetail.quality && <p className="text-sm text-muted-foreground">Save a draft to generate quality evidence.</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Ownership and actions</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 md:grid-cols-2"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={questionTranslator} onChange={(event) => setQuestionTranslator(event.target.value)} disabled={!canReview}><option value="">Translator unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.update')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName}</option>)}</select><select className="h-10 rounded-md border bg-background px-3 text-sm" value={questionReviewer} onChange={(event) => setQuestionReviewer(event.target.value)} disabled={!canReview}><option value="">Reviewer unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.review')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName}</option>)}</select></div><Input value={questionReason} onChange={(event) => setQuestionReason(event.target.value)} placeholder="Required audit reason" /><div className="flex flex-wrap gap-2">{canEdit && <Button disabled={questionBusy} onClick={() => void saveQuestion()}><Save className="mr-1.5 h-4 w-4" />Save draft</Button>}{canReview && <Button variant="outline" disabled={questionBusy || !questionDetail.target} onClick={() => void saveQuestionAssignment()}>Save assignment</Button>}{canReview && questionDetail.target && <><Button variant="outline" disabled={questionBusy} onClick={() => void changeQuestionStatus('in_review')}>Submit review</Button><Button variant="outline" disabled={questionBusy} onClick={() => void changeQuestionStatus('needs_fix')}>Needs fix</Button><Button disabled={questionBusy || !questionDetail.quality?.approvable} onClick={() => void changeQuestionStatus('approved')}><ShieldCheck className="mr-1.5 h-4 w-4" />Approve</Button></>}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Discussion and history</CardTitle></CardHeader><CardContent className="space-y-3">{questionDetail.target && <div className="flex gap-2"><Input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Editorial comment" /><Button variant="outline" disabled={questionBusy} onClick={() => void postComment()}>Add</Button></div>}{questionDetail.history.map((event) => <div key={event.id} className="rounded-lg border p-3 text-sm"><div className="flex justify-between gap-3"><strong>{event.summary}</strong><span className="text-xs text-muted-foreground">{time(event.occurredAt)}</span></div>{event.reason && <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{event.reason}</p>}</div>)}{questionDetail.history.length === 0 && <p className="text-sm text-muted-foreground">No history yet.</p>}</CardContent></Card>
          </div> : null}
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(selectedTest)} onOpenChange={(open) => { if (!open) { setSelectedTest(null); setTestDetail(null); } }}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
          <SheetHeader><SheetTitle>{selectedTest?.publicCode} · {testLanguage.toUpperCase()}</SheetTitle><SheetDescription>Test metadata, section labels and full question-language readiness.</SheetDescription></SheetHeader>
          {testBusy && !testDetail ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div> : testDetail ? <div className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="text-sm">English source</CardTitle></CardHeader><CardContent className="space-y-3"><strong>{testDetail.source.title}</strong><p className="text-sm text-muted-foreground">{testDetail.source.description}</p>{testDetail.source.sections.map((section) => <p key={section.id} className="rounded-lg border p-3 text-sm">{section.sortOrder}. {section.name}</p>)}</CardContent></Card><Card><CardHeader><div className="flex justify-between"><CardTitle className="text-sm">Target test</CardTitle><Badge variant="outline" className={statusClass(testDetail.target?.status ?? 'missing')}>{label(testDetail.target?.status ?? 'missing')}</Badge></div></CardHeader><CardContent className="space-y-3" dir={testDetail.language.direction}><Input value={testTitle} onChange={(event) => setTestTitle(event.target.value)} disabled={!canEdit} placeholder="Translated title" /><Textarea rows={4} value={testDescription} onChange={(event) => setTestDescription(event.target.value)} disabled={!canEdit} placeholder="Translated description" /><Textarea rows={5} className="font-mono text-xs" value={testInstructions} onChange={(event) => setTestInstructions(event.target.value)} disabled={!canEdit} />{testSections.map((section, index) => <Input key={section.testSectionId} value={section.name} onChange={(event) => setTestSections((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: event.target.value } : entry))} disabled={!canEdit} placeholder={`Section ${index + 1}`} />)}</CardContent></Card></div>
            <Card><CardHeader><div className="flex justify-between"><CardTitle className="text-sm">Readiness</CardTitle><Badge variant="outline" className={statusClass(testDetail.readiness.ready ? 'approved' : 'needs_fix')}>{testDetail.readiness.ready ? 'Ready' : `${testDetail.readiness.issues.length} blockers`}</Badge></div></CardHeader><CardContent className="space-y-2">{testDetail.readiness.issues.map((issue) => <p key={`${issue.code}:${issue.questionVersionId ?? issue.message}`} className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm"><strong>{issue.code}</strong><span className="ml-2 text-muted-foreground">{issue.message}</span></p>)}{testDetail.readiness.issues.length === 0 && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" />Every configured language dependency is complete.</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Ownership and actions</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 md:grid-cols-2"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={testTranslator} onChange={(event) => setTestTranslator(event.target.value)} disabled={!canReview}><option value="">Translator unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.update')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName}</option>)}</select><select className="h-10 rounded-md border bg-background px-3 text-sm" value={testReviewer} onChange={(event) => setTestReviewer(event.target.value)} disabled={!canReview}><option value="">Reviewer unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.review')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName}</option>)}</select></div><Input value={testReason} onChange={(event) => setTestReason(event.target.value)} placeholder="Required audit reason" /><div className="flex flex-wrap gap-2">{canEdit && <Button disabled={testBusy} onClick={() => void saveTest()}><Save className="mr-1.5 h-4 w-4" />Save</Button>}{canReview && <Button variant="outline" disabled={testBusy || !testDetail.target} onClick={() => void saveTestAssignment()}>Save assignment</Button>}{canReview && testDetail.target && <><Button variant="outline" disabled={testBusy} onClick={() => void changeTestStatus('in_review')}>Submit review</Button><Button variant="outline" disabled={testBusy} onClick={() => void changeTestStatus('needs_fix')}>Needs fix</Button><Button disabled={testBusy || !testDetail.readiness.ready} onClick={() => void changeTestStatus('approved')}><ShieldCheck className="mr-1.5 h-4 w-4" />Approve</Button></>}</div></CardContent></Card>
          </div> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
