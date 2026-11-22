import { ExplanationDiagrams } from '@/features/question-studio/ExplanationDiagrams';
import { promoteQuestionStudioNativeEditorial } from '@/features/question-studio/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  EyeOff,
  FileQuestion,
  History,
  Loader2,
  PencilLine,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Send,
  ShieldAlert,
  Tags,
  Trash2,
  Undo2,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  createQuestionVersion,
  getQuestionDetail,
  getQuestionBankNativeLanguages,
  type QuestionBankNativeLanguages,
  getQuestionTaxonomyOptions,
  syncQuestionStudioTaxonomy,
  transitionQuestion,
  updateQuestionTaxonomy,
  type QuestionDetailResponse,
  type QuestionLifecycleAction,
  type QuestionStatus,
  type QuestionVersion,
  type TaxonomyOptionsResponse,
} from '@/features/question-bank/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

interface EditorState {
  stem: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  changeReason: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

interface TaxonomyState {
  familyId: string;
  examId: string;
  examVersionId: string;
  subjectId: string;
  sectionId: string;
  topicId: string;
}

const EMPTY_TAXONOMY: TaxonomyState = {
  familyId: '',
  examId: '',
  examVersionId: '',
  subjectId: '',
  sectionId: '',
  topicId: '',
};

// Reader-only formatting for common LaTeX inline notation used by native
// Quant questions; the immutable source in the editor/DB remains unchanged.
function readableMath(value:string):string {
  return value
    .replace(/\\text\{([^{}]*)\}/g,'$1')
    .replace(/\\(?:mathrm|operatorname)\{([^{}]*)\}/g,'$1')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'($1 / $2)')
    .replace(/\\(?:left|right)\b/g,'')
    .replace(/\\(?:times|cdot)\b/g,'×')
    .replace(/\\div\b/g,'÷')
    .replace(/\\,/g,' ')
    .replace(/\\(?:\(|\)|\[|\])/g,'');
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function statusClass(status: QuestionStatus) {
  if (status === 'published') return 'bg-primary/10 text-primary hover:bg-primary/10';
  if (status === 'approved') return 'bg-success/10 text-success hover:bg-success/10';
  if (status === 'under_review' || status === 'needs_fix') return 'bg-warning/10 text-warning hover:bg-warning/10';
  if (status === 'archived' || status === 'rejected') return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
  return 'bg-muted text-muted-foreground hover:bg-muted';
}

function generationValue(version: QuestionVersion | undefined, key: string) {
  const generation = version?.answerModel?.generation;
  if (!generation || typeof generation !== 'object' || Array.isArray(generation)) return '';
  const value = (generation as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

function editorFromVersion(version: QuestionVersion): EditorState {
  return {
    stem: version.stem,
    explanation: version.explanation,
    difficulty: version.difficulty,
    questionType: version.questionType,
    changeReason: '',
    options: version.options.map((option) => ({
      text: option.text,
      isCorrect: option.isCorrect,
    })),
  };
}

function normalizeTaxonomyLabel(value: string): string {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9\u0a00-\u0a7f\u0900-\u097f]+/g, ' ').trim().replace(/\s+/g, ' ');
}

// Only exact, unique catalog matches are suggested. Never silently guess a chapter.
function prefillGenerationTaxonomy(state: TaxonomyState, version: QuestionVersion, nodes: TaxonomyOptionsResponse['nodes']): TaxonomyState {
  if (state.topicId) return state;
  const candidates = [generationValue(version, 'subtopic'), generationValue(version, 'topic')]
    .map(normalizeTaxonomyLabel).filter(Boolean);
  for (const name of candidates) {
    const matching = nodes.filter((node) => node.nodeType === 'topic' &&
      [node.name, node.code].some((value) => normalizeTaxonomyLabel(value) === name));
    if (matching.length !== 1) continue;
    const topic = matching[0];
    const sections = nodes.filter((node) => node.nodeType === 'section' && topic.parentIds.includes(node.id));
    const possibleSubjects = nodes.filter((node) => node.nodeType === 'subject' &&
      (topic.parentIds.includes(node.id) || sections.some((section) => section.parentIds.includes(node.id))));
    if (possibleSubjects.length !== 1 || (state.subjectId && state.subjectId !== possibleSubjects[0].id)) continue;
    return { ...state, subjectId: possibleSubjects[0].id,
      sectionId: sections.length === 1 ? sections[0].id : '',
      topicId: topic.id };
  }
  return state;
}

function taxonomyFromVersion(version: QuestionVersion): TaxonomyState {
  const primary = version.taxonomy.find((node) => node.isPrimary);
  const topic = primary ?? version.taxonomy.find((node) => node.nodeType === 'topic');
  return {
    familyId: version.examFamilyId ?? '',
    examId: version.examId ?? '',
    examVersionId: version.examVersionId ?? '',
    subjectId: version.taxonomy.find((node) => node.nodeType === 'subject')?.id ?? '',
    sectionId: version.taxonomy.find((node) => node.nodeType === 'section')?.id ?? '',
    topicId: topic?.id ?? '',
  };
}

export function QuestionDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canManageTaxonomy = hasPermission('content.taxonomy.manage');
  const canTranslate = hasPermission('content.translations.update') ||
    hasPermission('content.translations.review');
  const canApprove = hasPermission('content.questions.approve');
  const canArchive = hasPermission('content.questions.delete');

  const [detail, setDetail] = useState<QuestionDetailResponse | null>(null);
  const [nativeLanguages,setNativeLanguages]=useState<QuestionBankNativeLanguages|null>(null);
  const [nativeLoading,setNativeLoading]=useState(true);
  const [nativeError,setNativeError]=useState('');

  const [taxonomyOptions, setTaxonomyOptions] = useState<TaxonomyOptionsResponse | null>(null);
  const [syncingTaxonomy, setSyncingTaxonomy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [taxonomy, setTaxonomy] = useState<TaxonomyState>(EMPTY_TAXONOMY);
  const [actionReason, setActionReason] = useState('');

  const applyDetail = useCallback((next: QuestionDetailResponse) => {
    setDetail(next);
    setSelectedVersionId(next.question.displayVersionId);
    const current = next.versions.find((version) => version.id === next.question.displayVersionId)
      ?? next.versions[0];
    if (current) setTaxonomy(taxonomyFromVersion(current));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [next, options] = await Promise.all([
        getQuestionDetail(id),
        getQuestionTaxonomyOptions(),
      ]);
      applyDetail(next);
      setTaxonomyOptions(options);
      const version = next.versions.find((entry) => entry.id === next.question.displayVersionId) ?? next.versions[0];
      if (version) setTaxonomy(prefillGenerationTaxonomy(taxonomyFromVersion(version), version, options.nodes));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load question.');
    } finally {
      setLoading(false);
    }
  }, [applyDetail, id]);

  useEffect(() => {
    void load();
  }, [load]);

  // Do not delay English Question Bank details while loading native versions.
  useEffect(()=>{
    let active=true;
    setNativeLoading(true);
    setNativeLanguages(null);
    setNativeError('');
    void getQuestionBankNativeLanguages(id)
      .then(data=>{if(active)setNativeLanguages(data);})
      .catch(error=>{if(active)setNativeError(error instanceof Error?error.message:'Language versions unavailable');})
      .finally(()=>{if(active)setNativeLoading(false);});
    return ()=>{active=false;};
  },[id,detail?.question.approvedVersionId]);


  const currentVersion = useMemo(() => {
    if (!detail) return undefined;
    return detail.versions.find((version) => version.id === detail.question.displayVersionId)
      ?? detail.versions[0];
  }, [detail]);

  const viewedVersion = useMemo(() => {
    if (!detail) return undefined;
    return detail.versions.find((version) => version.id === selectedVersionId)
      ?? currentVersion;
  }, [currentVersion, detail, selectedVersionId]);

  const exams = useMemo(
    () => taxonomyOptions?.exams.filter((exam) => exam.familyId === taxonomy.familyId) ?? [],
    [taxonomy.familyId, taxonomyOptions],
  );

  // Academic subjects/sections/topics are shared across exams.
  const allowedNodes = useMemo(() => taxonomyOptions?.nodes ?? [], [taxonomyOptions]);

  const subjects = useMemo(
    () => allowedNodes.filter((node) => node.nodeType === 'subject'),
    [allowedNodes],
  );

  const sections = useMemo(
    () => allowedNodes.filter((node) => node.nodeType === 'section' && node.parentIds.includes(taxonomy.subjectId)),
    [allowedNodes, taxonomy.subjectId],
  );
  const topics = useMemo(
    () => allowedNodes.filter((node) => node.nodeType === 'topic' &&
      (node.parentIds.includes(taxonomy.subjectId) ||
        sections.some((section) => (!taxonomy.sectionId || section.id === taxonomy.sectionId) && node.parentIds.includes(section.id))) &&
      (!taxonomy.sectionId || node.parentIds.includes(taxonomy.sectionId))),
    [allowedNodes, taxonomy.subjectId, taxonomy.sectionId, sections],
  );

  const beginEdit = () => {
    if (!currentVersion) return;
    setSelectedVersionId(currentVersion.id);
    setEditor(editorFromVersion(currentVersion));
  };

  const saveVersion = async () => {
    if (!detail || !editor) return;
    setSaving(true);
    try {
      const next = await createQuestionVersion(detail.question.id, {
        expectedLockVersion: detail.question.lockVersion,
        stem: editor.stem,
        explanation: editor.explanation,
        difficulty: editor.difficulty,
        questionType: editor.questionType,
        changeReason: editor.changeReason,
        options: editor.options,
      });
      applyDetail(next);
      setEditor(null);
      showToast.success(
        'New version created',
        `Version ${next.versions[0]?.versionNumber ?? ''} is now the editable draft.`,
      );
    } catch (caught) {
      showToast.error(
        'Unable to save version',
        caught instanceof Error ? caught.message : 'Question update failed.',
      );
    } finally {
      setSaving(false);
    }
  };

  const syncStudioTaxonomy = async () => {
    if (!window.confirm('Import active Question Studio sections and topics into the shared taxonomy catalog? Existing classifications will be preserved.')) return;
    setSyncingTaxonomy(true);
    try {
      const result = await syncQuestionStudioTaxonomy();
      const options = await getQuestionTaxonomyOptions();
      setTaxonomyOptions(options);
      if (currentVersion) setTaxonomy((current) => prefillGenerationTaxonomy(current, currentVersion, options.nodes));
      showToast.success('Studio taxonomy synchronized',
        `${result.sections} sections and ${result.topics} topics added; ${result.packages} registered packages examined.`);
    } catch (caught) {
      showToast.error('Unable to sync Studio taxonomy',
        caught instanceof Error ? caught.message : 'Taxonomy sync failed.');
    } finally {
      setSyncingTaxonomy(false);
    }
  };

  const saveTaxonomy = async () => {
    if (!detail || !taxonomy.subjectId || !taxonomy.topicId) {
      showToast.warning('Classification incomplete', 'Select a subject and topic.');
      return;
    }
    setSaving(true);
    try {
      const next = await updateQuestionTaxonomy(detail.question.id, {
        expectedLockVersion: detail.question.lockVersion,
        examVersionId: taxonomy.examVersionId || null,
        primaryTaxonomyNodeId: taxonomy.topicId,
        taxonomyNodeIds: [taxonomy.subjectId, ...(taxonomy.sectionId ? [taxonomy.sectionId] : []), taxonomy.topicId],
      });
      applyDetail(next);
      showToast.success('Classification saved', 'Subject and topic are saved in the shared Question Bank.');
    } catch (caught) {
      showToast.error(
        'Unable to save taxonomy',
        caught instanceof Error ? caught.message : 'Taxonomy update failed.',
      );
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (action: QuestionLifecycleAction, successMessage: string) => {
    if (!detail) return;
    setSaving(true);
    try {
      const next = await transitionQuestion(detail.question.id, action, {
        expectedLockVersion: detail.question.lockVersion,
        reason: actionReason.trim() || undefined,
      });
      applyDetail(next);
      setActionReason('');
      setEditor(null);
      showToast.success(
        successMessage,
        `${next.question.publicCode} is now ${formatStatus(next.question.status)}.`,
      );
    } catch (caught) {
      showToast.error(
        'Question action failed',
        caught instanceof Error ? caught.message : 'Unable to update question.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading question detail…
      </div>
    );
  }

  if (error || !detail || !viewedVersion || !currentVersion) {
    return (
      <Card>
        <CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="h-8 w-8 text-destructive" />
          <h1 className="mt-3 text-lg font-semibold">Question unavailable</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {error || 'The requested question could not be loaded.'}
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline">
              <Link to="/content/questions" onClick={(event) => {
                if (!location.state?.fromQuestionBank || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                navigate(-1);
              }}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Question Bank
              </Link>
            </Button>
            <Button onClick={() => void load()}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = detail.question;
  const isHistorical = viewedVersion.id !== question.displayVersionId;
  const publishedVersionFrozen = question.publishedVersionId === question.displayVersionId;
  const topicLabel = viewedVersion.taxonomy.find((node) => node.nodeType === 'topic')?.name
    || generationValue(viewedVersion, 'topic')
    || '—';
  const subjectLabel = viewedVersion.taxonomy.find((node) => node.nodeType === 'subject')?.name
    || '—';
  const bankOnly = generationValue(viewedVersion,'questionBankAcceptanceMode') === 'BANK_ONLY';
  const noExamAssignment = !viewedVersion.examVersionId;

  const publishedVersionNumber = detail.versions.find(
    (version) => version.id === question.publishedVersionId,
  )?.versionNumber;

  return (
    <div>
      <PageHeader
        title={question.publicCode}
        description={`Canonical Question Bank record • lock ${question.lockVersion}`}
        icon={<FileQuestion className="h-5 w-5" />}
        actions={(
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/content/questions" onClick={(event) => {
                if (!location.state?.fromQuestionBank || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                navigate(-1);
              }}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Question Bank
              </Link>
            </Button>
            {canTranslate && question.approvedVersionId &&
              ['AVG-001', 'INT-001'].includes(generationValue(
                detail.versions.find((version) => version.id === question.approvedVersionId),
                'packageId',
              )) &&
              ['en'].includes(generationValue(
                detail.versions.find((version) => version.id === question.approvedVersionId),
                'language',
              )) && (['hi', 'pa'] as const).map((language) => (
                <Button key={language} asChild variant="outline" size="sm">
                  <Link to={`/settings/languages?questionVersionId=${encodeURIComponent(question.approvedVersionId!)}&languageCode=${language}`}>
                    {language === 'hi' ? 'Hindi translation' : 'Punjabi translation'}
                  </Link>
                </Button>
              ))}
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={saving}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
          </div>
        )}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge className={statusClass(question.status)}>{formatStatus(question.status)}</Badge>
        <Badge variant="outline">Current v{currentVersion.versionNumber}</Badge>
        {question.approvedVersionId && (
          <Badge className="bg-success/10 text-success hover:bg-success/10">Approved version</Badge>
        )}
        {question.publishedVersionId && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            Published v{publishedVersionNumber ?? '—'}
          </Badge>
        )}
        {isHistorical && (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/10">
            Viewing historical v{viewedVersion.versionNumber}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          {editor ? (
            <QuestionEditor
              editor={editor}
              saving={saving}
              onChange={setEditor}
              onCancel={() => setEditor(null)}
              onSave={() => void saveVersion()}
            />
          ) : (
            <>
              <QuestionBankLanguagePreview
                version={viewedVersion} native={nativeLanguages} loading={nativeLoading} error={nativeError}
                onRefresh={async()=>{
                  try {
                    setNativeLanguages(await getQuestionBankNativeLanguages(id));
                    setNativeError('');
                  } catch(caught){
                    setNativeError(caught instanceof Error?caught.message:'Could not refresh languages');
                  }
                }}
              />
              <Card>
                <CardHeader><CardTitle className="text-base">Metadata</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Meta label="Difficulty" value={viewedVersion.difficulty} />
                  <Meta label="Question type" value={viewedVersion.questionType} />
                  <Meta label="Exam" value={viewedVersion.examName ?? '—'} />
                  <Meta label="Family" value={viewedVersion.examFamilyName ?? '—'} />
                  <Meta label="Subject" value={subjectLabel} />
                  <Meta label="Topic" value={topicLabel} />
                  <Meta
                    label="Generation run"
                    value={generationValue(viewedVersion, 'generationRunCode') || '—'}
                  />
                  <Meta
                    label="Package"
                    value={generationValue(viewedVersion, 'packageId') || '—'}
                  />
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tags className="h-4 w-4" /> Question Bank classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bankOnly && noExamAssignment && (
                <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                  <p className="font-semibold">Reusable Question Bank question</p>
                  <p className="mt-1 text-muted-foreground">
                    Classify by subject and topic without choosing an exam.
                    Approved language versions remain independently reviewed; this does not publish to students.
                  </p>
                </div>
              )}
              {!bankOnly && <p className="text-xs text-muted-foreground">
                Subject and topic are shared academic classifications. Exam family and exam are
                optional metadata for an exam-specific release, not a restriction on bank reuse.
              </p>}
              {publishedVersionFrozen && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
                  The published version is frozen. Create a new draft version before changing taxonomy.
                </div>
              )}
              {canManageTaxonomy && <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Missing a Studio chapter? Import all registered subjects, sections and topics into the shared catalog.</p>
                <Button variant="outline" size="sm" disabled={syncingTaxonomy} onClick={() => void syncStudioTaxonomy()}>
                  {syncingTaxonomy ? 'Syncing…' : 'Sync Studio topics'}
                </Button>
              </div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Exam family (optional)</Label>
                  <Select
                    value={taxonomy.familyId}
                    onValueChange={(value) => setTaxonomy({ ...EMPTY_TAXONOMY, familyId: value })}
                    disabled={!canEdit || publishedVersionFrozen}
                  >
                    <SelectTrigger><SelectValue placeholder="Select family" /></SelectTrigger>
                    <SelectContent>
                      {taxonomyOptions?.families.map((family) => (
                        <SelectItem key={family.id} value={family.id}>{family.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exam (optional)</Label>
                  <Select
                    value={taxonomy.examId}
                    onValueChange={(value) => {
                      const exam = exams.find((entry) => entry.id === value);
                      setTaxonomy((current) => ({
                        ...current,
                        examId: value,
                        examVersionId: exam?.currentVersionId ?? '',
                        subjectId: '',
                        sectionId: '',
                        topicId: '',
                      }));
                    }}
                    disabled={!canEdit || publishedVersionFrozen || !taxonomy.familyId}
                  >
                    <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={taxonomy.subjectId}
                    onValueChange={(value) => setTaxonomy((current) => ({
                      ...current,
                      subjectId: value,
                      sectionId: '',
                      topicId: '',
                    }))}
                    disabled={!canEdit || publishedVersionFrozen}
                  >
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((node) => (
                        <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sections.length > 0 && <div className="space-y-2">
                  <Label>Section (optional)</Label>
                  <Select value={taxonomy.sectionId || 'all-sections'} onValueChange={(value) =>
                    setTaxonomy((current) => ({ ...current, sectionId: value === 'all-sections' ? '' : value, topicId: '' }))}
                    disabled={!canEdit || publishedVersionFrozen || !taxonomy.subjectId}>
                    <SelectTrigger><SelectValue placeholder="All sections" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sections">All sections</SelectItem>
                      {sections.map((node) => <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>}
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select
                    value={taxonomy.topicId}
                    onValueChange={(value) => setTaxonomy((current) => ({
                      ...current,
                      topicId: value,
                      sectionId: allowedNodes.find((node) => node.id === value)?.parentIds.find((id) =>
                        sections.some((section) => section.id === id)) ?? current.sectionId,
                    }))}
                    disabled={!canEdit || publishedVersionFrozen || !taxonomy.subjectId}
                  >
                    <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                    <SelectContent>
                      {topics.map((node) => (
                        <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {!viewedVersion.taxonomy.length && taxonomy.topicId && (
                <p className="text-xs text-muted-foreground">Suggested from the generation topic/subtopic. Review the selection and save; nothing is classified automatically.</p>
              )}
              {canEdit && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => void saveTaxonomy()}
                    disabled={saving || publishedVersionFrozen}
                  >
                    <Save className="mr-1.5 h-4 w-4" /> Save classification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <PublishingReadiness detail={detail} />

          <Card>
            <CardHeader><CardTitle className="text-base">Editorial actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Action reason</Label>
                <Textarea
                  value={actionReason}
                  onChange={(event) => setActionReason(event.target.value)}
                  rows={3}
                  placeholder="Required for needs-fix, unpublish, restore and archive"
                />
              </div>

              {canEdit && !editor && question.status !== 'archived' && (
                <Button variant="outline" className="w-full justify-start" onClick={beginEdit}>
                  <PencilLine className="mr-1.5 h-4 w-4" /> Edit as new version
                </Button>
              )}
              {canEdit && ['draft', 'needs_fix', 'generated'].includes(question.status) && (
                <Button
                  className="w-full justify-start"
                  onClick={() => void runAction('submit-review', 'Submitted for review')}
                  disabled={saving}
                >
                  <Send className="mr-1.5 h-4 w-4" /> Submit for review
                </Button>
              )}
              {canApprove && !['approved', 'published', 'archived'].includes(question.status) && (
                <Button
                  className="w-full justify-start"
                  onClick={() => void runAction('approve', 'Question approved')}
                  disabled={saving}
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve current version
                </Button>
              )}
              {canApprove && question.status === 'approved' && (
                <Button
                  className="w-full justify-start"
                  onClick={() => void runAction('publish', 'Question published')}
                  disabled={saving || detail.publicationIssues.length > 0}
                >
                  <Rocket className="mr-1.5 h-4 w-4" /> Publish to Test Builder
                </Button>
              )}
              {canApprove && question.publishedVersionId && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => void runAction('unpublish', 'Question unpublished')}
                  disabled={saving}
                >
                  <EyeOff className="mr-1.5 h-4 w-4" /> Unpublish
                </Button>
              )}
              {canApprove && !['needs_fix', 'archived', 'published'].includes(question.status) && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => void runAction('needs-fix', 'Question sent for fixes')}
                  disabled={saving}
                >
                  <XCircle className="mr-1.5 h-4 w-4" /> Mark needs fix
                </Button>
              )}
              {canEdit && question.status === 'archived' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => void runAction('restore-draft', 'Question restored')}
                  disabled={saving}
                >
                  <Undo2 className="mr-1.5 h-4 w-4" /> Restore as draft
                </Button>
              )}
              {canArchive && question.status !== 'archived' && (
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => void runAction('archive', 'Question archived')}
                  disabled={saving}
                >
                  <Archive className="mr-1.5 h-4 w-4" /> Archive question
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4" /> Version history
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {detail.versions.map((version) => (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => {
                    setSelectedVersionId(version.id);
                    setEditor(null);
                  }}
                  className={version.id === viewedVersion.id
                    ? 'w-full rounded-lg border border-primary/40 bg-primary/5 p-3 text-left'
                    : 'w-full rounded-lg border p-3 text-left hover:bg-muted/30'}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Version {version.versionNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(version.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {version.changeReason}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {version.id === question.currentDraftVersionId && (
                      <Badge variant="outline">Current draft</Badge>
                    )}
                    {version.id === question.approvedVersionId && (
                      <Badge className="bg-success/10 text-success hover:bg-success/10">Approved</Badge>
                    )}
                    {version.id === question.publishedVersionId && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Published</Badge>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="h-4 w-4" /> Audit history
              </CardTitle>
            </CardHeader>
            <CardContent>
              {detail.auditEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No audit events recorded.</p>
              ) : (
                <div className="space-y-3">
                  {detail.auditEvents.map((event) => (
                    <div key={event.id} className="border-l-2 pl-3">
                      <p className="text-sm font-medium">{event.summary}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(event.occurredAt)} • {event.actionKey}
                      </p>
                      {event.reason && (
                        <p className="mt-1 text-xs text-muted-foreground">{event.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuestionBankLanguagePreview({
  version,native,loading,error,onRefresh,
}:{
  version:QuestionVersion;
  native:QuestionBankNativeLanguages|null;
  loading:boolean;
  error:string;
  onRefresh:()=>Promise<void>;
}) {
  const [language,setLanguage]=useState<'en'|'hi'|'pa'>('en');
  const [sending,setSending]=useState(false);
  const [sendError,setSendError]=useState('');
  const {hasPermission}=useAdminPermissions();
  const hi=native?.languages.find(locale=>locale.language==='hi');
  const pa=native?.languages.find(locale=>locale.language==='pa');
  const canSend=hasPermission('content.translations.review') &&
    native?.studioItemId && native.studioVersion &&
    hi?.source==='studio' && pa?.source==='studio' &&
    typeof hi.revision==='number' && typeof pa.revision==='number';
  const sendApproved=async()=>{
    if(!canSend || sending)return;
    setSending(true);setSendError('');
    try{
      await promoteQuestionStudioNativeEditorial(native!.studioItemId!,{
        expectedVersion:native!.studioVersion!,
        revisions:{hi:hi!.revision!,pa:pa!.revision!},
        reason:'Send both approved native language versions to Question Bank review.',
      });
      await onRefresh();
    }catch(caught){
      setSendError(caught instanceof Error?caught.message:'Could not hand off native languages');
    }finally{setSending(false);}
  };
  const locale=native?.languages.find(item=>item.language===language);
  const variants=[
    {code:'en' as const,label:'English'},
    {code:'hi' as const,label:'हिन्दी · Hindi'},
    {code:'pa' as const,label:'ਪੰਜਾਬੀ · Punjabi'},
  ];
  const isBank=locale?.source==='question_bank';
  const options=(locale?.options??[]).map((entry,index)=>
    typeof entry==='string'
      ?{key:String.fromCharCode(65+index),text:entry}
      :{key:entry.key,text:entry.text}
  );
  const status=language==='en'?'Canonical English':
    isBank?`Question Bank · ${locale?.status??'draft'}`:
    locale?.source==='studio'?'Approved in Studio · not yet handed off':
    'Not available in Question Bank';
  return <Card>
    <CardHeader>
      <CardTitle className="text-base">Question language versions</CardTitle>
      <p className="text-xs text-muted-foreground">
        All languages belong to the same English question. Studio approval does not automatically publish translations.
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Question language">
        {variants.map(({code,label})=><Button
          key={code} size="sm" type="button"
          variant={language===code?'default':'outline'}
          aria-pressed={language===code}
          onClick={()=>setLanguage(code)}
        >{label}</Button>)}
      </div>
      <Badge variant="outline">{status}</Badge>
      {language==='en'?<QuestionPreview version={version} />:
        loading?<p className="text-sm text-muted-foreground">Loading language versions…</p>:
        error?<p className="text-sm text-destructive">{error}</p>:
        locale?.stem && locale.explanation && options.length>0?
          <div className="space-y-4">
            <div className="rounded-lg border p-3">
              <p className="mb-2 text-xs font-semibold">Question</p>
              <p className="whitespace-pre-wrap text-sm leading-7">{readableMath(locale.stem)}</p>
            </div>
            <div className="space-y-2">
              {options.map((option,index)=><div key={index} className={
                'rounded-lg border p-3 text-sm '+(
                  locale.correctIndex===index?'border-success/50 bg-success/5':'')
              }>
                <span className="font-semibold">{option.key}.</span> {readableMath(option.text)}
                {locale.correctIndex===index&&<Badge className="ml-2">Correct</Badge>}
              </div>)}
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-semibold">Explanation</p>
              <ExplanationDiagrams explanation={readableMath(locale.explanation)} />
            </div>
          </div>:
          <p className="text-sm text-muted-foreground">
            This language has not been handed off to Question Bank review.
          </p>}
      {language!=='en'&&locale?.source==='studio'&&
        <p className="text-xs text-muted-foreground">
          Approved in Question Studio. These are not yet Question Bank translation drafts.
        </p>}
      {canSend&&<Button type="button" variant="outline" size="sm"
        disabled={sending} onClick={()=>void sendApproved()}>
        {sending?'Sending languages…':'Send Hindi & Punjabi to Question Bank review'}
      </Button>}
      {sendError&&<p role="alert" className="text-xs text-destructive">{sendError}</p>}
    </CardContent>
  </Card>;
}

function QuestionPreview({ version }: { version: QuestionVersion }) {
  return (
    <>
      <Card>
        <CardHeader><CardTitle className="text-base">Question stem</CardTitle></CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm font-medium leading-7">{readableMath(version.stem)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Options</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {version.options.map((option) => (
            <div
              key={option.id}
              className={option.isCorrect
                ? 'flex items-start gap-3 rounded-lg border border-success/40 bg-success/5 p-3'
                : 'flex items-start gap-3 rounded-lg border p-3'}
            >
              {option.isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <p className="text-sm">
                <span className="font-semibold">{option.key}.</span> {option.text}
              </p>
              {option.isCorrect && (
                <Badge className="ml-auto bg-success/10 text-success hover:bg-success/10">Correct</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Explanation</CardTitle></CardHeader>
        <CardContent>
          <ExplanationDiagrams explanation={readableMath(version.explanation)} />
        </CardContent>
      </Card>
    </>
  );
}

function QuestionEditor({
  editor,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  editor: EditorState;
  saving: boolean;
  onChange: (editor: EditorState) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PencilLine className="h-4 w-4" /> Create immutable version
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Question stem</Label>
          <Textarea
            value={editor.stem}
            onChange={(event) => onChange({ ...editor, stem: event.target.value })}
            rows={5}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={editor.difficulty}
              onValueChange={(value) => onChange({ ...editor, difficulty: value })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Question type</Label>
            <Input
              value={editor.questionType}
              onChange={(event) => onChange({ ...editor, questionType: event.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={editor.options.length >= 8}
              onClick={() => onChange({
                ...editor,
                options: [...editor.options, { text: '', isCorrect: false }],
              })}
            >
              <Plus className="mr-1 h-4 w-4" /> Add option
            </Button>
          </div>
          <div className="space-y-2">
            {editor.options.map((option, index) => (
              <div key={`${index}-${option.text}`} className="flex items-center gap-2 rounded-lg border p-2">
                <input
                  type="radio"
                  name="correct-option"
                  checked={option.isCorrect}
                  onChange={() => onChange({
                    ...editor,
                    options: editor.options.map((entry, optionIndex) => ({
                      ...entry,
                      isCorrect: optionIndex === index,
                    })),
                  })}
                  aria-label={`Mark option ${index + 1} correct`}
                />
                <span className="w-5 text-sm font-semibold">{String.fromCharCode(65 + index)}.</span>
                <Input
                  value={option.text}
                  onChange={(event) => onChange({
                    ...editor,
                    options: editor.options.map((entry, optionIndex) => (
                      optionIndex === index ? { ...entry, text: event.target.value } : entry
                    )),
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={editor.options.length <= 2}
                  onClick={() => onChange({
                    ...editor,
                    options: editor.options.filter((_, optionIndex) => optionIndex !== index),
                  })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Explanation</Label>
          <Textarea
            value={editor.explanation}
            onChange={(event) => onChange({ ...editor, explanation: event.target.value })}
            rows={7}
          />
          {editor.explanation.match(/\[\[EXAMTREE_(?:ALLIGATION|RATIO_ADJUSTMENT)_SVG_V1:/) && <div className="mt-2 rounded-md border p-2"><p className="text-xs font-semibold">Explanation preview</p><ExplanationDiagrams explanation={editor.explanation} /></div>}
        </div>
        <div className="space-y-2">
          <Label>Change reason</Label>
          <Input
            value={editor.changeReason}
            onChange={(event) => onChange({ ...editor, changeReason: event.target.value })}
            placeholder="Required editorial reason for this new version"
          />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save as new version
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PublishingReadiness({ detail }: { detail: QuestionDetailResponse }) {
  const canonical=detail.versions.find(v=>v.id===detail.question.approvedVersionId);
  const bankOnly=canonical && generationValue(canonical,'questionBankAcceptanceMode')==='BANK_ONLY';
  if (detail.question.publishedVersionId) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Publishing readiness</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm font-medium text-primary">Available to Test Builder</p>
          <p className="text-xs text-muted-foreground">
            Published {formatDate(detail.question.publishedAt)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Publishing readiness</CardTitle></CardHeader>
      <CardContent>
        {bankOnly && !canonical?.examVersionId && (
          <div className="mb-3 rounded-md border bg-muted/20 p-3 text-sm">
            <p className="font-medium">Approved for Question Bank storage</p>
            <p className="mt-1 text-muted-foreground">
              Exam taxonomy is not required for multilingual Question Bank handoff.
              The checks below apply when publishing this question to Test Builder.
            </p>
          </div>
        )}
        {detail.publicationIssues.length === 0 ? (
          <p className="text-sm font-medium text-success">Ready to publish.</p>
        ) : (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {detail.publicationIssues.map((issue) => (
              <li key={issue} className="flex gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                {issue}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}
