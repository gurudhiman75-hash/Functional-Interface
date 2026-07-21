import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileQuestion,
  Filter,
  Globe2,
  Languages,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  TestTube2,
  Users,
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
  type ExamLanguageMapping,
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

function statusTone(status: string): string {
  if (status === 'approved' || status === 'source') return 'border-success/30 bg-success/10 text-success';
  if (status === 'needs_fix' || status === 'rejected') return 'border-destructive/30 bg-destructive/10 text-destructive';
  if (status === 'in_review') return 'border-info/30 bg-info/10 text-info';
  if (status === 'missing') return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTime(value: string | null | undefined): string {
  if (!value) return 'Not recorded';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Invalid timestamp' : parsed.toLocaleString();
}

function parseJsonObject(value: string): Record<string, unknown> {
  if (!value.trim()) return {};
  const parsed = JSON.parse(value) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Instructions must be a JSON object.');
  return parsed as Record<string, unknown>;
}

function MetricCard({ label, value, detail, tone = 'neutral' }: {
  label: string;
  value: number | string;
  detail: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const valueClass = tone === 'success'
    ? 'text-success'
    : tone === 'warning'
      ? 'text-warning'
      : tone === 'danger'
        ? 'text-destructive'
        : 'text-foreground';
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn('mt-2 text-2xl font-bold', valueClass)}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function LanguageCard({ language, canManage, onToggle }: {
  language: LanguageSummary;
  canManage: boolean;
  onToggle: (language: LanguageSummary) => void;
}) {
  return (
    <Card className={cn(!language.isActive && 'opacity-65')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{language.name} <span className="font-normal text-muted-foreground">{language.nativeName}</span></CardTitle>
            <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">{language.code} · {language.scriptCode || 'script not set'} · {language.direction}</p>
          </div>
          <Badge variant="outline" className={statusTone(language.sourceLanguage || language.completionPercent === 100 ? 'approved' : 'missing')}>
            {language.sourceLanguage ? 'Source' : `${language.completionPercent}%`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={language.sourceLanguage ? 100 : language.completionPercent} className="h-2" />
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border p-2"><p className="text-lg font-semibold">{language.eligibleQuestionCount}</p><p className="text-muted-foreground">Eligible</p></div>
          <div className="rounded-lg border p-2"><p className="text-lg font-semibold">{language.approvedQuestionCount}</p><p className="text-muted-foreground">Approved</p></div>
          <div className="rounded-lg border p-2"><p className="text-lg font-semibold">{language.examVersionCount}</p><p className="text-muted-foreground">Exams</p></div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{language.inReviewQuestionCount} in review · {language.needsFixQuestionCount} need fixes</span>
          {canManage && !language.sourceLanguage && (
            <Button size="sm" variant="outline" onClick={() => onToggle(language)}>
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
  const canManageLanguages = hasPermission('settings.languages.manage');

  const [overview, setOverview] = useState<TranslationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [queueSearch, setQueueSearch] = useState('');
  const [queueStatus, setQueueStatus] = useState('all');
  const [queueLanguage, setQueueLanguage] = useState('all');
  const [queueExam, setQueueExam] = useState('all');

  const [selectedQueueItem, setSelectedQueueItem] = useState<TranslationQueueItem | null>(null);
  const [questionDetail, setQuestionDetail] = useState<QuestionTranslationDetail | null>(null);
  const [questionDetailLoading, setQuestionDetailLoading] = useState(false);
  const [questionStem, setQuestionStem] = useState('');
  const [questionExplanation, setQuestionExplanation] = useState('');
  const [questionOptions, setQuestionOptions] = useState<Array<{ key: string; text: string; sortOrder: number }>>([]);
  const [questionReason, setQuestionReason] = useState('');
  const [translatorUserId, setTranslatorUserId] = useState('');
  const [reviewerUserId, setReviewerUserId] = useState('');
  const [questionComment, setQuestionComment] = useState('');
  const [mutatingQuestion, setMutatingQuestion] = useState(false);

  const [selectedTest, setSelectedTest] = useState<TestLocalizationSummary | null>(null);
  const [selectedTestLanguage, setSelectedTestLanguage] = useState('');
  const [testDetail, setTestDetail] = useState<TestTranslationDetail | null>(null);
  const [testDetailLoading, setTestDetailLoading] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testInstructions, setTestInstructions] = useState('{}');
  const [testSections, setTestSections] = useState<Array<{ testSectionId: string; name: string }>>([]);
  const [testReason, setTestReason] = useState('');
  const [testTranslatorUserId, setTestTranslatorUserId] = useState('');
  const [testReviewerUserId, setTestReviewerUserId] = useState('');
  const [mutatingTest, setMutatingTest] = useState(false);

  const [termLanguage, setTermLanguage] = useState('hi');
  const [termSource, setTermSource] = useState('');
  const [termPreferred, setTermPreferred] = useState('');
  const [termForbidden, setTermForbidden] = useState('');
  const [termContext, setTermContext] = useState('');
  const [termReason, setTermReason] = useState('');

  const [newLanguageCode, setNewLanguageCode] = useState('');
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageNativeName, setNewLanguageNativeName] = useState('');
  const [newLanguageScript, setNewLanguageScript] = useState('');
  const [newLanguageReason, setNewLanguageReason] = useState('');

  const [mappingExamVersionId, setMappingExamVersionId] = useState('');
  const [mappingLanguageIds, setMappingLanguageIds] = useState<string[]>([]);
  const [mappingPrimaryLanguageId, setMappingPrimaryLanguageId] = useState('');
  const [mappingReason, setMappingReason] = useState('');

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const next = await getTranslationOverview();
      setOverview(next);
      setError(null);
      if (!mappingExamVersionId && next.examMappings[0]) setMappingExamVersionId(next.examMappings[0].examVersionId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load translation operations.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [mappingExamVersionId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const nonEnglishLanguages = useMemo(
    () => (overview?.languages ?? []).filter((language) => !language.sourceLanguage),
    [overview?.languages],
  );

  const filteredQueue = useMemo(() => {
    const query = queueSearch.trim().toLowerCase();
    return (overview?.queue ?? []).filter((item) => {
      if (queueStatus !== 'all' && item.status !== queueStatus) return false;
      if (queueLanguage !== 'all' && item.languageCode !== queueLanguage) return false;
      if (queueExam !== 'all' && item.examCode !== queueExam) return false;
      if (!query) return true;
      return [item.publicCode, item.sourceStem, item.examName, item.taxonomyName, item.translatorName, item.reviewerName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    }).sort((left, right) => STATUS_ORDER.indexOf(left.status) - STATUS_ORDER.indexOf(right.status));
  }, [overview?.queue, queueExam, queueLanguage, queueSearch, queueStatus]);

  const examCodes = useMemo(
    () => Array.from(new Set((overview?.queue ?? []).map((item) => item.examCode))).sort(),
    [overview?.queue],
  );

  const openQuestion = useCallback(async (item: TranslationQueueItem) => {
    setSelectedQueueItem(item);
    setQuestionDetail(null);
    setQuestionDetailLoading(true);
    setQuestionReason('');
    setQuestionComment('');
    try {
      const detail = await getQuestionTranslation(item.questionVersionId, item.languageCode);
      setQuestionDetail(detail);
      setQuestionStem(detail.target?.stem ?? '');
      setQuestionExplanation(detail.target?.explanation ?? '');
      setQuestionOptions(detail.target?.options.length
        ? detail.target.options.map(({ key, text, sortOrder }) => ({ key, text, sortOrder }))
        : detail.source.options.map(({ key, sortOrder }) => ({ key, text: '', sortOrder })));
      setTranslatorUserId(detail.target?.translatorUserId ?? '');
      setReviewerUserId(detail.target?.reviewerUserId ?? '');
    } catch (caught) {
      showToast.error('Translation detail unavailable', caught instanceof Error ? caught.message : 'Unable to load translation.');
    } finally {
      setQuestionDetailLoading(false);
    }
  }, []);

  const reloadQuestionDetail = useCallback(async () => {
    if (!selectedQueueItem) return;
    const detail = await getQuestionTranslation(selectedQueueItem.questionVersionId, selectedQueueItem.languageCode);
    setQuestionDetail(detail);
    setQuestionStem(detail.target?.stem ?? '');
    setQuestionExplanation(detail.target?.explanation ?? '');
    setQuestionOptions(detail.target?.options.length
      ? detail.target.options.map(({ key, text, sortOrder }) => ({ key, text, sortOrder }))
      : detail.source.options.map(({ key, sortOrder }) => ({ key, text: '', sortOrder })));
    setTranslatorUserId(detail.target?.translatorUserId ?? '');
    setReviewerUserId(detail.target?.reviewerUserId ?? '');
  }, [selectedQueueItem]);

  const saveQuestion = async () => {
    if (!selectedQueueItem) return;
    setMutatingQuestion(true);
    try {
      const response = await saveQuestionTranslation({
        questionVersionId: selectedQueueItem.questionVersionId,
        languageCode: selectedQueueItem.languageCode,
        stem: questionStem,
        explanation: questionExplanation,
        options: questionOptions,
        reason: questionReason,
      });
      setQuestionDetail(response.detail);
      setQuestionReason('');
      showToast.success('Translation saved', 'Quality checks and immutable history were updated.');
      await refresh(true);
    } catch (caught) {
      showToast.error('Save failed', caught instanceof Error ? caught.message : 'Unable to save translation.');
    } finally {
      setMutatingQuestion(false);
    }
  };

  const assignQuestion = async () => {
    const translationId = questionDetail?.target?.id;
    if (!translationId) {
      showToast.error('Save first', 'Create the translation before assigning owners.');
      return;
    }
    setMutatingQuestion(true);
    try {
      await assignQuestionTranslation({
        translationId,
        translatorUserId: translatorUserId || null,
        reviewerUserId: reviewerUserId || null,
        reason: questionReason,
      });
      setQuestionReason('');
      await reloadQuestionDetail();
      await refresh(true);
      showToast.success('Assignment updated', 'Translator and reviewer ownership is canonical.');
    } catch (caught) {
      showToast.error('Assignment failed', caught instanceof Error ? caught.message : 'Unable to update assignment.');
    } finally {
      setMutatingQuestion(false);
    }
  };

  const transitionQuestion = async (status: Exclude<TranslationStatus, 'missing'>) => {
    const translationId = questionDetail?.target?.id;
    if (!translationId) return;
    setMutatingQuestion(true);
    try {
      const response = await transitionQuestionTranslation({ translationId, status, reason: questionReason });
      setQuestionDetail(response.detail);
      setQuestionReason('');
      await refresh(true);
      showToast.success('Review state updated', `Translation moved to ${formatStatus(status)}.`);
    } catch (caught) {
      showToast.error('Review action blocked', caught instanceof Error ? caught.message : 'Unable to update translation status.');
    } finally {
      setMutatingQuestion(false);
    }
  };

  const addComment = async () => {
    const translationId = questionDetail?.target?.id;
    if (!translationId || !questionComment.trim()) return;
    setMutatingQuestion(true);
    try {
      await addTranslationComment({ translationId, body: questionComment.trim() });
      setQuestionComment('');
      await reloadQuestionDetail();
      showToast.success('Comment added', 'The discussion is stored in immutable review history.');
    } catch (caught) {
      showToast.error('Comment failed', caught instanceof Error ? caught.message : 'Unable to add comment.');
    } finally {
      setMutatingQuestion(false);
    }
  };

  const openTest = useCallback(async (test: TestLocalizationSummary, languageCode?: string) => {
    const targetLanguage = languageCode || test.languageCodes.find((code) => code !== 'en') || nonEnglishLanguages[0]?.code || '';
    if (!targetLanguage) {
      showToast.error('No target language', 'Configure a non-English language for this test first.');
      return;
    }
    setSelectedTest(test);
    setSelectedTestLanguage(targetLanguage);
    setTestDetail(null);
    setTestDetailLoading(true);
    setTestReason('');
    try {
      const detail = await getTestTranslation(test.testVersionId, targetLanguage);
      setTestDetail(detail);
      setTestTitle(detail.target?.title ?? '');
      setTestDescription(detail.target?.description ?? '');
      setTestInstructions(JSON.stringify(detail.target?.instructions ?? {}, null, 2));
      setTestSections(detail.source.sections.map((sourceSection) => {
        const translated = detail.target?.sections.find((section) => section.testSectionId === sourceSection.id);
        return { testSectionId: sourceSection.id, name: translated?.name ?? '' };
      }));
      setTestTranslatorUserId(detail.target?.translatorUserId ?? '');
      setTestReviewerUserId(detail.target?.reviewerUserId ?? '');
    } catch (caught) {
      showToast.error('Test localization unavailable', caught instanceof Error ? caught.message : 'Unable to load test translation.');
    } finally {
      setTestDetailLoading(false);
    }
  }, [nonEnglishLanguages]);

  const reloadTest = useCallback(async () => {
    if (!selectedTest || !selectedTestLanguage) return;
    const detail = await getTestTranslation(selectedTest.testVersionId, selectedTestLanguage);
    setTestDetail(detail);
    setTestTitle(detail.target?.title ?? '');
    setTestDescription(detail.target?.description ?? '');
    setTestInstructions(JSON.stringify(detail.target?.instructions ?? {}, null, 2));
    setTestSections(detail.source.sections.map((sourceSection) => {
      const translated = detail.target?.sections.find((section) => section.testSectionId === sourceSection.id);
      return { testSectionId: sourceSection.id, name: translated?.name ?? '' };
    }));
    setTestTranslatorUserId(detail.target?.translatorUserId ?? '');
    setTestReviewerUserId(detail.target?.reviewerUserId ?? '');
  }, [selectedTest, selectedTestLanguage]);

  const saveTest = async () => {
    if (!selectedTest || !selectedTestLanguage) return;
    setMutatingTest(true);
    try {
      await saveTestTranslation({
        testVersionId: selectedTest.testVersionId,
        languageCode: selectedTestLanguage,
        title: testTitle,
        description: testDescription,
        instructions: parseJsonObject(testInstructions),
        sections: testSections,
        reason: testReason,
      });
      setTestReason('');
      await reloadTest();
      await refresh(true);
      showToast.success('Test translation saved', 'Translated metadata and every section label were updated.');
    } catch (caught) {
      showToast.error('Test save failed', caught instanceof Error ? caught.message : 'Unable to save test translation.');
    } finally {
      setMutatingTest(false);
    }
  };

  const assignTest = async () => {
    const translationId = testDetail?.target?.id;
    if (!translationId) {
      showToast.error('Save first', 'Create the test translation before assigning owners.');
      return;
    }
    setMutatingTest(true);
    try {
      await assignTestTranslation({
        translationId,
        translatorUserId: testTranslatorUserId || null,
        reviewerUserId: testReviewerUserId || null,
        reason: testReason,
      });
      setTestReason('');
      await reloadTest();
      showToast.success('Test assignment updated', 'Translator and reviewer ownership is canonical.');
    } catch (caught) {
      showToast.error('Assignment failed', caught instanceof Error ? caught.message : 'Unable to update test assignment.');
    } finally {
      setMutatingTest(false);
    }
  };

  const transitionTest = async (status: Exclude<TranslationStatus, 'missing'>) => {
    const translationId = testDetail?.target?.id;
    if (!translationId) return;
    setMutatingTest(true);
    try {
      const response = await transitionTestTranslation({ translationId, status, reason: testReason });
      setTestDetail(response.detail);
      setTestReason('');
      await refresh(true);
      showToast.success('Test review state updated', `Test translation moved to ${formatStatus(status)}.`);
    } catch (caught) {
      showToast.error('Test review blocked', caught instanceof Error ? caught.message : 'Unable to update test translation status.');
    } finally {
      setMutatingTest(false);
    }
  };

  const createTerm = async () => {
    try {
      await createTranslationTerm({
        languageCode: termLanguage,
        sourceText: termSource,
        preferredText: termPreferred,
        forbiddenVariants: termForbidden.split(',').map((value) => value.trim()).filter(Boolean),
        contextNote: termContext,
        scopeTaxonomyNodeId: null,
        reason: termReason,
      });
      setTermSource('');
      setTermPreferred('');
      setTermForbidden('');
      setTermContext('');
      setTermReason('');
      await refresh(true);
      showToast.success('Terminology standard created', 'Future quality checks will enforce this rule.');
    } catch (caught) {
      showToast.error('Terminology save failed', caught instanceof Error ? caught.message : 'Unable to create terminology.');
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
        reason: `${term.isActive ? 'Deactivate' : 'Reactivate'} terminology standard`,
      });
      await refresh(true);
      showToast.success('Terminology updated', `Rule is now ${term.isActive ? 'inactive' : 'active'}.`);
    } catch (caught) {
      showToast.error('Terminology update failed', caught instanceof Error ? caught.message : 'Unable to update terminology.');
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
        reason: `${language.isActive ? 'Deactivate' : 'Activate'} language from canonical settings`,
      });
      await refresh(true);
      showToast.success('Language updated', `${language.name} is now ${language.isActive ? 'inactive' : 'active'}.`);
    } catch (caught) {
      showToast.error('Language update failed', caught instanceof Error ? caught.message : 'Unable to update language.');
    }
  };

  const addLanguage = async () => {
    try {
      await createLanguage({
        code: newLanguageCode,
        name: newLanguageName,
        nativeName: newLanguageNativeName,
        direction: 'ltr',
        scriptCode: newLanguageScript || null,
        fallbackLanguageId: overview?.languages.find((language) => language.code === 'en')?.id ?? null,
        isActive: true,
        reason: newLanguageReason,
      });
      setNewLanguageCode('');
      setNewLanguageName('');
      setNewLanguageNativeName('');
      setNewLanguageScript('');
      setNewLanguageReason('');
      await refresh(true);
      showToast.success('Language created', 'Map it to exam versions before content becomes eligible.');
    } catch (caught) {
      showToast.error('Language creation failed', caught instanceof Error ? caught.message : 'Unable to create language.');
    }
  };

  const selectedMapping = useMemo(
    () => overview?.examMappings.find((mapping) => mapping.examVersionId === mappingExamVersionId) ?? null,
    [mappingExamVersionId, overview?.examMappings],
  );

  useEffect(() => {
    if (!selectedMapping) return;
    setMappingLanguageIds(selectedMapping.languages.map((language) => language.id));
    setMappingPrimaryLanguageId(selectedMapping.languages.find((language) => language.isPrimary)?.id ?? '');
  }, [selectedMapping]);

  const saveMapping = async () => {
    if (!mappingExamVersionId) return;
    try {
      await updateExamVersionLanguages({
        examVersionId: mappingExamVersionId,
        languages: mappingLanguageIds.map((languageId) => ({ languageId, isPrimary: languageId === mappingPrimaryLanguageId })),
        reason: mappingReason,
      });
      setMappingReason('');
      await refresh(true);
      showToast.success('Exam languages updated', 'Translation eligibility and publication gates now use this mapping.');
    } catch (caught) {
      showToast.error('Exam mapping failed', caught instanceof Error ? caught.message : 'Unable to update exam languages.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Languages & Translation Operations"
        description="Canonical multilingual content production, terminology governance, reviewer workflow, test readiness and language-specific publication gates."
        icon={<Languages className="h-5 w-5" />}
        actions={(
          <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
          </Button>
        )}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {loading && !overview ? (
        <Card><CardContent className="flex min-h-72 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading canonical language operations…</CardContent></Card>
      ) : overview ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="dashboard"><Globe2 className="mr-1.5 h-4 w-4" />Coverage</TabsTrigger>
            <TabsTrigger value="questions"><FileQuestion className="mr-1.5 h-4 w-4" />Question Queue ({overview.queue.length})</TabsTrigger>
            <TabsTrigger value="tests"><TestTube2 className="mr-1.5 h-4 w-4" />Test Localization ({overview.tests.length})</TabsTrigger>
            <TabsTrigger value="terms"><BookOpenCheck className="mr-1.5 h-4 w-4" />Terminology ({overview.terms.length})</TabsTrigger>
            <TabsTrigger value="configuration"><Settings2 className="mr-1.5 h-4 w-4" />Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <MetricCard label="Eligible pairs" value={overview.metrics.eligiblePairs} detail="Question × target language" />
              <MetricCard label="Missing" value={overview.metrics.missing} detail="No translation started" tone={overview.metrics.missing ? 'warning' : 'success'} />
              <MetricCard label="In review" value={overview.metrics.inReview} detail="Awaiting reviewer decision" />
              <MetricCard label="Needs fix" value={overview.metrics.needsFix} detail="Returned by reviewers" tone={overview.metrics.needsFix ? 'danger' : 'success'} />
              <MetricCard label="Approved" value={overview.metrics.approved} detail="Publication-eligible questions" tone="success" />
              <MetricCard label="Blocked tests" value={overview.metrics.testsBlocked} detail="Incomplete localization" tone={overview.metrics.testsBlocked ? 'danger' : 'success'} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {overview.languages.map((language) => (
                <LanguageCard key={language.id} language={language} canManage={canManageLanguages} onToggle={(entry) => void toggleLanguage(entry)} />
              ))}
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" />Release contract</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="rounded-xl border p-4"><p className="font-medium">Question gate</p><p className="mt-1 text-muted-foreground">Stem, explanation, protected values, every option and terminology rules must pass before approval.</p></div>
                <div className="rounded-xl border p-4"><p className="font-medium">Test gate</p><p className="mt-1 text-muted-foreground">Translated test metadata, every section label and every included question must be approved.</p></div>
                <div className="rounded-xl border p-4"><p className="font-medium">Candidate delivery</p><p className="mt-1 text-muted-foreground">Only configured languages are selectable; incomplete non-English content cannot silently fall back to English.</p></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={queueSearch} onChange={(event) => setQueueSearch(event.target.value)} placeholder="Search code, stem, topic or owner…" /></div>
                <select className="h-10 rounded-md border bg-background px-3 text-sm" value={queueStatus} onChange={(event) => setQueueStatus(event.target.value)}><option value="all">All statuses</option>{STATUS_ORDER.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}</select>
                <select className="h-10 rounded-md border bg-background px-3 text-sm" value={queueLanguage} onChange={(event) => setQueueLanguage(event.target.value)}><option value="all">All languages</option>{nonEnglishLanguages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}</select>
                <select className="h-10 rounded-md border bg-background px-3 text-sm" value={queueExam} onChange={(event) => setQueueExam(event.target.value)}><option value="all">All exams</option>{examCodes.map((code) => <option key={code} value={code}>{code}</option>)}</select>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full min-w-[1080px] text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Question</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Options</th><th className="px-4 py-3">Owners</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3" /></tr></thead>
                  <tbody>
                    {filteredQueue.map((item) => (
                      <tr key={`${item.questionVersionId}:${item.languageCode}`} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="max-w-md px-4 py-3"><p className="font-medium">{item.publicCode} · {item.examCode}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.sourceStem}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.taxonomyName || 'Unclassified'} · {item.difficulty}</p></td>
                        <td className="px-4 py-3"><p className="font-medium">{item.languageName}</p><p className="text-xs text-muted-foreground">{item.languageNativeName}</p></td>
                        <td className="px-4 py-3"><Badge variant="outline" className={statusTone(item.status)}>{formatStatus(item.status)}</Badge></td>
                        <td className="px-4 py-3"><span className={cn(item.sourceOptionCount !== item.translatedOptionCount && item.status !== 'missing' && 'text-destructive')}>{item.translatedOptionCount} / {item.sourceOptionCount}</span></td>
                        <td className="px-4 py-3 text-xs"><p>{item.translatorName || 'Translator unassigned'}</p><p className="text-muted-foreground">{item.reviewerName || 'Reviewer unassigned'}</p></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatTime(item.updatedAt)}</td>
                        <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => void openQuestion(item)}>Open <ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></td>
                      </tr>
                    ))}
                    {filteredQueue.length === 0 && <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">No translation work matches these filters.</td></tr>}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {overview.tests.map((test) => (
                <Card key={test.testVersionId} className={cn(!test.localizationReady && 'border-warning/30')}>
                  <CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{test.title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · {test.examCode} · v{test.versionNumber}</p></div><Badge variant="outline" className={statusTone(test.localizationReady ? 'approved' : 'missing')}>{test.localizationReady ? 'Ready' : 'Blocked'}</Badge></div></CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{test.questionCount} questions · {test.sectionCount} sections · {test.languageCodes.join(', ').toUpperCase()}</p>
                    <div className="space-y-2">
                      {test.languages.map((language) => (
                        <div key={language.languageCode} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <div><p className="font-medium uppercase">{language.languageCode}</p><p className="text-xs text-muted-foreground">{language.translatedSectionCount}/{language.sectionCount} sections</p></div>
                          <div className="flex items-center gap-2"><Badge variant="outline" className={statusTone(language.status)}>{formatStatus(language.status)}</Badge>{language.languageCode !== 'en' && <Button size="sm" variant="outline" onClick={() => void openTest(test, language.languageCode)}>Manage</Button>}</div>
                        </div>
                      ))}
                    </div>
                    {!test.languageCodes.some((code) => code !== 'en') && nonEnglishLanguages[0] && (
                      <Button variant="outline" className="w-full" onClick={() => void openTest(test, nonEnglishLanguages[0].code)}><Plus className="mr-1.5 h-4 w-4" />Start localization</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {overview.tests.length === 0 && <Card className="lg:col-span-2"><CardContent className="py-16 text-center text-sm text-muted-foreground">No canonical test versions are available.</CardContent></Card>}
            </div>
          </TabsContent>

          <TabsContent value="terms" className="space-y-4">
            {canManageLanguages && (
              <Card>
                <CardHeader><CardTitle className="text-base">Add terminology standard</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <select className="h-10 rounded-md border bg-background px-3 text-sm" value={termLanguage} onChange={(event) => setTermLanguage(event.target.value)}>{nonEnglishLanguages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}</select>
                  <Input value={termSource} onChange={(event) => setTermSource(event.target.value)} placeholder="English source term" />
                  <Input value={termPreferred} onChange={(event) => setTermPreferred(event.target.value)} placeholder="Preferred translation" />
                  <Input value={termForbidden} onChange={(event) => setTermForbidden(event.target.value)} placeholder="Forbidden variants, comma separated" />
                  <Input value={termContext} onChange={(event) => setTermContext(event.target.value)} placeholder="Context note" />
                  <Input value={termReason} onChange={(event) => setTermReason(event.target.value)} placeholder="Audit reason" />
                  <div className="md:col-span-2 xl:col-span-3"><Button onClick={() => void createTerm()}><Plus className="mr-1.5 h-4 w-4" />Create terminology rule</Button></div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Language</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Preferred</th><th className="px-4 py-3">Forbidden</th><th className="px-4 py-3">Scope</th><th className="px-4 py-3">State</th><th className="px-4 py-3" /></tr></thead><tbody>{overview.terms.map((term) => <tr key={term.id} className="border-b last:border-0"><td className="px-4 py-3">{term.languageName}</td><td className="px-4 py-3 font-medium">{term.sourceText}</td><td className="px-4 py-3">{term.preferredText}</td><td className="px-4 py-3 text-xs text-muted-foreground">{term.forbiddenVariants.join(', ') || '—'}</td><td className="px-4 py-3 text-xs">{term.scopeTaxonomyName || 'Global'}</td><td className="px-4 py-3"><Badge variant="outline" className={statusTone(term.isActive ? 'approved' : 'archived')}>{term.isActive ? 'Active' : 'Inactive'}</Badge></td><td className="px-4 py-3 text-right">{canManageLanguages && <Button size="sm" variant="outline" onClick={() => void toggleTerm(term)}>{term.isActive ? 'Deactivate' : 'Reactivate'}</Button>}</td></tr>)}{overview.terms.length === 0 && <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">No terminology standards have been created.</td></tr>}</tbody></table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-5">
            {canManageLanguages ? (
              <>
                <Card>
                  <CardHeader><CardTitle className="text-base">Add supported language</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <Input value={newLanguageCode} onChange={(event) => setNewLanguageCode(event.target.value)} placeholder="Code, e.g. ur" />
                    <Input value={newLanguageName} onChange={(event) => setNewLanguageName(event.target.value)} placeholder="Language name" />
                    <Input value={newLanguageNativeName} onChange={(event) => setNewLanguageNativeName(event.target.value)} placeholder="Native name" />
                    <Input value={newLanguageScript} onChange={(event) => setNewLanguageScript(event.target.value)} placeholder="Script, e.g. Arab" />
                    <Input value={newLanguageReason} onChange={(event) => setNewLanguageReason(event.target.value)} placeholder="Audit reason" />
                    <div className="md:col-span-2 xl:col-span-5"><Button onClick={() => void addLanguage()}><Plus className="mr-1.5 h-4 w-4" />Add language</Button></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Exam language availability</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={mappingExamVersionId} onChange={(event) => setMappingExamVersionId(event.target.value)}>{overview.examMappings.map((mapping) => <option key={mapping.examVersionId} value={mapping.examVersionId}>{mapping.examCode} · {mapping.examVersionName}</option>)}</select>
                    <div className="grid gap-3 md:grid-cols-3">
                      {overview.languages.filter((language) => language.isActive).map((language) => {
                        const checked = mappingLanguageIds.includes(language.id);
                        return (
                          <label key={language.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                            <span><span className="font-medium">{language.name}</span><span className="ml-2 text-muted-foreground">{language.nativeName}</span></span>
                            <input type="checkbox" checked={checked} onChange={(event) => {
                              if (event.target.checked) setMappingLanguageIds((current) => [...current, language.id]);
                              else {
                                setMappingLanguageIds((current) => current.filter((id) => id !== language.id));
                                if (mappingPrimaryLanguageId === language.id) setMappingPrimaryLanguageId('');
                              }
                            }} />
                          </label>
                        );
                      })}
                    </div>
                    <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
                      <select className="h-10 rounded-md border bg-background px-3 text-sm" value={mappingPrimaryLanguageId} onChange={(event) => setMappingPrimaryLanguageId(event.target.value)}><option value="">Choose primary language</option>{overview.languages.filter((language) => mappingLanguageIds.includes(language.id)).map((language) => <option key={language.id} value={language.id}>{language.name}</option>)}</select>
                      <Input value={mappingReason} onChange={(event) => setMappingReason(event.target.value)} placeholder="Audit reason for mapping change" />
                      <Button onClick={() => void saveMapping()}><Save className="mr-1.5 h-4 w-4" />Save mapping</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">You can view language configuration but do not have permission to change it.</CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
      ) : null}

      <Sheet open={Boolean(selectedQueueItem)} onOpenChange={(open) => { if (!open) { setSelectedQueueItem(null); setQuestionDetail(null); } }}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
          <SheetHeader><SheetTitle>{selectedQueueItem?.publicCode} · {selectedQueueItem?.languageName}</SheetTitle><SheetDescription>Source/target comparison, deterministic quality checks, ownership, discussion and review lifecycle.</SheetDescription></SheetHeader>
          {questionDetailLoading ? <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading translation workspace…</div> : questionDetail ? (
            <div className="mt-6 space-y-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card><CardHeader><CardTitle className="text-sm">English source</CardTitle></CardHeader><CardContent className="space-y-4"><div><p className="text-xs uppercase text-muted-foreground">Stem</p><p className="mt-2 whitespace-pre-wrap text-sm">{questionDetail.source.stem}</p></div><div><p className="text-xs uppercase text-muted-foreground">Explanation</p><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{questionDetail.source.explanation}</p></div>{questionDetail.source.options.map((option) => <div key={option.key} className="rounded-lg border p-3 text-sm"><span className="font-semibold">{option.key}.</span> {option.text}</div>)}</CardContent></Card>
                <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">{questionDetail.language.name} target</CardTitle><Badge variant="outline" className={statusTone(questionDetail.target?.status ?? 'missing')}>{formatStatus(questionDetail.target?.status ?? 'missing')}</Badge></div></CardHeader><CardContent className="space-y-4" dir={questionDetail.language.direction}><div><p className="text-xs uppercase text-muted-foreground">Stem</p><Textarea value={questionStem} onChange={(event) => setQuestionStem(event.target.value)} rows={6} disabled={!canEdit} /></div><div><p className="text-xs uppercase text-muted-foreground">Explanation</p><Textarea value={questionExplanation} onChange={(event) => setQuestionExplanation(event.target.value)} rows={8} disabled={!canEdit} /></div>{questionOptions.map((option, index) => <div key={option.key} className="grid grid-cols-[42px_minmax(0,1fr)] items-center gap-2"><span className="rounded border p-2 text-center font-semibold">{option.key}</span><Input value={option.text} disabled={!canEdit} onChange={(event) => setQuestionOptions((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, text: event.target.value } : entry))} /></div>)}</CardContent></Card>
              </div>

              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">Quality gate</CardTitle>{questionDetail.quality ? <Badge variant="outline" className={statusTone(questionDetail.quality.approvable ? 'approved' : 'needs_fix')}>{questionDetail.quality.score}/100</Badge> : <Badge variant="outline">Not evaluated</Badge>}</div></CardHeader><CardContent className="space-y-2">{questionDetail.quality?.issues.map((issue) => <div key={`${issue.code}:${issue.message}`} className={cn('flex items-start gap-2 rounded-lg border p-3 text-sm', issue.severity === 'error' ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5')}>{issue.severity === 'error' ? <XCircle className="mt-0.5 h-4 w-4 text-destructive" /> : <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />}<div><p className="font-medium">{issue.code}</p><p className="text-muted-foreground">{issue.message}</p></div></div>)}{questionDetail.quality?.issues.length === 0 && <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success"><CheckCircle2 className="h-4 w-4" />No blocking quality issues.</div>}{!questionDetail.quality && <p className="text-sm text-muted-foreground">Save a draft to calculate quality evidence.</p>}</CardContent></Card>

              <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Users className="h-4 w-4" />Ownership and review</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 md:grid-cols-2"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={translatorUserId} onChange={(event) => setTranslatorUserId(event.target.value)} disabled={!canReview}><option value="">Translator unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.update')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName} · {reviewer.email}</option>)}</select><select className="h-10 rounded-md border bg-background px-3 text-sm" value={reviewerUserId} onChange={(event) => setReviewerUserId(event.target.value)} disabled={!canReview}><option value="">Reviewer unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.review')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName} · {reviewer.email}</option>)}</select></div><Input value={questionReason} onChange={(event) => setQuestionReason(event.target.value)} placeholder="Required audit reason for save, assignment or review action" /><div className="flex flex-wrap gap-2">{canEdit && <Button disabled={mutatingQuestion} onClick={() => void saveQuestion()}><Save className="mr-1.5 h-4 w-4" />Save draft</Button>}{canReview && <Button variant="outline" disabled={mutatingQuestion || !questionDetail.target} onClick={() => void assignQuestion()}>Save assignment</Button>}{canReview && questionDetail.target && <><Button variant="outline" disabled={mutatingQuestion} onClick={() => void transitionQuestion('in_review')}>Submit review</Button><Button variant="outline" disabled={mutatingQuestion} onClick={() => void transitionQuestion('needs_fix')}>Needs fix</Button><Button disabled={mutatingQuestion || !questionDetail.quality?.approvable} onClick={() => void transitionQuestion('approved')}><ShieldCheck className="mr-1.5 h-4 w-4" />Approve</Button></>}</div></CardContent></Card>

              <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><MessageSquare className="h-4 w-4" />Discussion and history</CardTitle></CardHeader><CardContent className="space-y-4">{questionDetail.target && <div className="flex gap-2"><Input value={questionComment} onChange={(event) => setQuestionComment(event.target.value)} placeholder="Add a focused editorial comment" /><Button variant="outline" onClick={() => void addComment()} disabled={mutatingQuestion}>Comment</Button></div>}<div className="space-y-2">{questionDetail.history.map((event) => <div key={event.id} className="rounded-lg border p-3 text-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{event.summary}</p><p className="mt-1 text-xs text-muted-foreground">{event.actorName || event.actorEmail || 'System'} · {event.actionKey}</p>{event.reason && <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{event.reason}</p>}</div><span className="shrink-0 text-xs text-muted-foreground">{formatTime(event.occurredAt)}</span></div></div>)}{questionDetail.history.length === 0 && <p className="text-sm text-muted-foreground">No translation history yet.</p>}</div></CardContent></Card>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(selectedTest)} onOpenChange={(open) => { if (!open) { setSelectedTest(null); setTestDetail(null); } }}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
          <SheetHeader><SheetTitle>{selectedTest?.publicCode} · {selectedTestLanguage.toUpperCase()}</SheetTitle><SheetDescription>Translate test metadata and section labels, then verify every question-language dependency before approval.</SheetDescription></SheetHeader>
          {testDetailLoading ? <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading test localization…</div> : testDetail ? (
            <div className="mt-6 space-y-5">
              <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="text-sm">English source</CardTitle></CardHeader><CardContent className="space-y-3"><p className="font-semibold">{testDetail.source.title}</p><p className="text-sm text-muted-foreground">{testDetail.source.description}</p>{testDetail.source.sections.map((section) => <div key={section.id} className="rounded-lg border p-3 text-sm">{section.sortOrder}. {section.name}</div>)}</CardContent></Card><Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">Translated test</CardTitle><Badge variant="outline" className={statusTone(testDetail.target?.status ?? 'missing')}>{formatStatus(testDetail.target?.status ?? 'missing')}</Badge></div></CardHeader><CardContent className="space-y-3" dir={testDetail.language.direction}><Input value={testTitle} onChange={(event) => setTestTitle(event.target.value)} placeholder="Translated title" disabled={!canEdit} /><Textarea value={testDescription} onChange={(event) => setTestDescription(event.target.value)} placeholder="Translated description" rows={4} disabled={!canEdit} /><Textarea value={testInstructions} onChange={(event) => setTestInstructions(event.target.value)} rows={6} disabled={!canEdit} className="font-mono text-xs" />{testSections.map((section, index) => <div key={section.testSectionId} className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-2"><span className="text-sm text-muted-foreground">{index + 1}</span><Input value={section.name} onChange={(event) => setTestSections((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: event.target.value } : entry))} disabled={!canEdit} placeholder="Translated section name" /></div>)}</CardContent></Card></div>
              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">Localization readiness</CardTitle><Badge variant="outline" className={statusTone(testDetail.readiness.ready ? 'approved' : 'needs_fix')}>{testDetail.readiness.ready ? 'Ready' : `${testDetail.readiness.issues.length} blockers`}</Badge></div></CardHeader><CardContent className="space-y-2">{testDetail.readiness.issues.map((issue) => <div key={`${issue.code}:${issue.questionVersionId ?? issue.message}`} className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm"><p className="font-medium">{issue.code}</p><p className="text-muted-foreground">{issue.message}</p></div>)}{testDetail.readiness.issues.length === 0 && <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success"><CheckCircle2 className="h-4 w-4" />Every configured language dependency is complete.</div>}</CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm">Ownership and review</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 md:grid-cols-2"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={testTranslatorUserId} onChange={(event) => setTestTranslatorUserId(event.target.value)} disabled={!canReview}><option value="">Translator unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.update')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName}</option>)}</select><select className="h-10 rounded-md border bg-background px-3 text-sm" value={testReviewerUserId} onChange={(event) => setTestReviewerUserId(event.target.value)} disabled={!canReview}><option value="">Reviewer unassigned</option>{overview?.reviewers.filter((reviewer) => reviewer.permissions.includes('content.translations.review')).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName}</option>)}</select></div><Input value={testReason} onChange={(event) => setTestReason(event.target.value)} placeholder="Required audit reason" /><div className="flex flex-wrap gap-2">{canEdit && <Button onClick={() => void saveTest()} disabled={mutatingTest}><Save className="mr-1.5 h-4 w-4" />Save translation</Button>}{canReview && <Button variant="outline" onClick={() => void assignTest()} disabled={mutatingTest || !testDetail.target}>Save assignment</Button>}{canReview && testDetail.target && <><Button variant="outline" onClick={() => void transitionTest('in_review')} disabled={mutatingTest}>Submit review</Button><Button variant="outline" onClick={() => void transitionTest('needs_fix')} disabled={mutatingTest}>Needs fix</Button><Button onClick={() => void transitionTest('approved')} disabled={mutatingTest || !testDetail.readiness.ready}><ClipboardCheck className="mr-1.5 h-4 w-4" />Approve</Button></>}</div></CardContent></Card>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
