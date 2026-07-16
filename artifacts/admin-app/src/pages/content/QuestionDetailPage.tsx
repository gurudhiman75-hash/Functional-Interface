import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  FileQuestion,
  History,
  Loader2,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldAlert,
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
  transitionQuestion,
  type QuestionDetailResponse,
  type QuestionLifecycleAction,
  type QuestionStatus,
  type QuestionVersion,
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

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

function statusClass(status: QuestionStatus) {
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
    options: version.options.map((option) => ({ text: option.text, isCorrect: option.isCorrect })),
  };
}

export function QuestionDetailPage() {
  const { id = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canApprove = hasPermission('content.questions.approve');
  const canArchive = hasPermission('content.questions.delete');

  const [detail, setDetail] = useState<QuestionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [actionReason, setActionReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await getQuestionDetail(id);
      setDetail(next);
      setSelectedVersionId(next.question.displayVersionId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load question.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const currentVersion = useMemo(() => {
    if (!detail) return undefined;
    return detail.versions.find((version) => version.id === detail.question.displayVersionId) ?? detail.versions[0];
  }, [detail]);

  const viewedVersion = useMemo(() => {
    if (!detail) return undefined;
    return detail.versions.find((version) => version.id === selectedVersionId) ?? currentVersion;
  }, [detail, selectedVersionId, currentVersion]);

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
      setDetail(next);
      setSelectedVersionId(next.question.displayVersionId);
      setEditor(null);
      showToast.success('New version created', `Version ${next.versions[0]?.versionNumber ?? ''} is now the editable draft.`);
    } catch (caught) {
      showToast.error('Unable to save version', caught instanceof Error ? caught.message : 'Question update failed.');
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
      setDetail(next);
      setSelectedVersionId(next.question.displayVersionId);
      setActionReason('');
      setEditor(null);
      showToast.success(successMessage, `${next.question.publicCode} is now ${formatStatus(next.question.status)}.`);
    } catch (caught) {
      showToast.error('Question action failed', caught instanceof Error ? caught.message : 'Unable to update question.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading question detail…</div>;
  }

  if (error || !detail || !viewedVersion || !currentVersion) {
    return (
      <Card><CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><ShieldAlert className="h-8 w-8 text-destructive" /><h1 className="mt-3 text-lg font-semibold">Question unavailable</h1><p className="mt-1 text-sm text-muted-foreground">{error || 'The requested question could not be loaded.'}</p><div className="mt-4 flex gap-2"><Button asChild variant="outline"><Link to="/content/questions"><ArrowLeft className="mr-1.5 h-4 w-4" /> Question Bank</Link></Button><Button onClick={() => void load()}><RefreshCw className="mr-1.5 h-4 w-4" /> Retry</Button></div></CardContent></Card>
    );
  }

  const question = detail.question;
  const isHistorical = viewedVersion.id !== question.displayVersionId;

  return (
    <div>
      <PageHeader
        title={question.publicCode}
        description={`Canonical Question Bank record • lock ${question.lockVersion}`}
        icon={<FileQuestion className="h-5 w-5" />}
        actions={<div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link to="/content/questions"><ArrowLeft className="mr-1.5 h-4 w-4" /> Question Bank</Link></Button><Button variant="outline" size="sm" onClick={() => void load()} disabled={saving}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button></div>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge className={statusClass(question.status)}>{formatStatus(question.status)}</Badge>
        <Badge variant="outline">Current draft v{currentVersion.versionNumber}</Badge>
        {question.approvedVersionId && <Badge variant="outline">Approved version retained</Badge>}
        {isHistorical && <Badge className="bg-warning/10 text-warning hover:bg-warning/10">Viewing historical v{viewedVersion.versionNumber}</Badge>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          {editor ? (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><PencilLine className="h-4 w-4" /> Create immutable version</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2"><Label>Question stem</Label><Textarea value={editor.stem} onChange={(event) => setEditor({ ...editor, stem: event.target.value })} rows={5} /></div>
                <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Difficulty</Label><Select value={editor.difficulty} onValueChange={(value) => setEditor({ ...editor, difficulty: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Question type</Label><Input value={editor.questionType} onChange={(event) => setEditor({ ...editor, questionType: event.target.value })} /></div></div>
                <div className="space-y-2"><div className="flex items-center justify-between"><Label>Options</Label><Button type="button" variant="outline" size="sm" disabled={editor.options.length >= 8} onClick={() => setEditor({ ...editor, options: [...editor.options, { text: '', isCorrect: false }] })}><Plus className="mr-1 h-4 w-4" /> Add option</Button></div><div className="space-y-2">{editor.options.map((option, index) => (<div key={index} className="flex items-center gap-2 rounded-lg border p-2"><input type="radio" name="correct-option" checked={option.isCorrect} onChange={() => setEditor({ ...editor, options: editor.options.map((entry, optionIndex) => ({ ...entry, isCorrect: optionIndex === index })) })} aria-label={`Mark option ${index + 1} correct`} /><span className="w-5 text-sm font-semibold">{String.fromCharCode(65 + index)}.</span><Input value={option.text} onChange={(event) => setEditor({ ...editor, options: editor.options.map((entry, optionIndex) => optionIndex === index ? { ...entry, text: event.target.value } : entry) })} /><Button type="button" variant="ghost" size="icon" disabled={editor.options.length <= 2} onClick={() => setEditor({ ...editor, options: editor.options.filter((_, optionIndex) => optionIndex !== index) })}><Trash2 className="h-4 w-4" /></Button></div>))}</div></div>
                <div className="space-y-2"><Label>Explanation</Label><Textarea value={editor.explanation} onChange={(event) => setEditor({ ...editor, explanation: event.target.value })} rows={7} /></div>
                <div className="space-y-2"><Label>Change reason</Label><Input value={editor.changeReason} onChange={(event) => setEditor({ ...editor, changeReason: event.target.value })} placeholder="Required editorial reason for this new version" /></div>
                <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setEditor(null)} disabled={saving}>Cancel</Button><Button onClick={() => void saveVersion()} disabled={saving}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save as new version</Button></div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card><CardHeader><CardTitle className="text-base">Question stem</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm font-medium leading-7">{viewedVersion.stem}</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">Options</CardTitle></CardHeader><CardContent className="space-y-2">{viewedVersion.options.map((option) => (<div key={option.id} className={option.isCorrect ? 'flex items-start gap-3 rounded-lg border border-success/40 bg-success/5 p-3' : 'flex items-start gap-3 rounded-lg border p-3'}>{option.isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}<p className="text-sm"><span className="font-semibold">{option.key}.</span> {option.text}</p>{option.isCorrect && <Badge className="ml-auto bg-success/10 text-success hover:bg-success/10">Correct</Badge>}</div>))}</CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">Explanation</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{viewedVersion.explanation}</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">Metadata</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Meta label="Difficulty" value={viewedVersion.difficulty} /><Meta label="Question type" value={viewedVersion.questionType} /><Meta label="Topic" value={generationValue(viewedVersion, 'topic') || '—'} /><Meta label="Subtopic" value={generationValue(viewedVersion, 'subtopic') || '—'} /><Meta label="Generation run" value={generationValue(viewedVersion, 'generationRunCode') || '—'} /><Meta label="Package" value={generationValue(viewedVersion, 'packageId') || '—'} /><Meta label="Change reason" value={viewedVersion.changeReason} /><Meta label="Created" value={formatDate(viewedVersion.createdAt)} /></CardContent></Card>
            </>
          )}
        </div>

        <div className="space-y-6">
          <Card><CardHeader><CardTitle className="text-base">Editorial actions</CardTitle></CardHeader><CardContent className="space-y-3"><div className="space-y-2"><Label>Action reason</Label><Textarea value={actionReason} onChange={(event) => setActionReason(event.target.value)} rows={3} placeholder="Required for needs-fix, restore and archive" /></div>{canEdit && !editor && question.status !== 'archived' && <Button variant="outline" className="w-full justify-start" onClick={beginEdit}><PencilLine className="mr-1.5 h-4 w-4" /> Edit as new version</Button>}{canEdit && ['draft', 'needs_fix', 'generated'].includes(question.status) && <Button className="w-full justify-start" onClick={() => void runAction('submit-review', 'Submitted for review')} disabled={saving}><Send className="mr-1.5 h-4 w-4" /> Submit for review</Button>}{canApprove && question.status !== 'approved' && question.status !== 'archived' && <Button className="w-full justify-start" onClick={() => void runAction('approve', 'Question approved')} disabled={saving}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve current version</Button>}{canApprove && question.status !== 'needs_fix' && question.status !== 'archived' && <Button variant="outline" className="w-full justify-start" onClick={() => void runAction('needs-fix', 'Question sent for fixes')} disabled={saving}><XCircle className="mr-1.5 h-4 w-4" /> Mark needs fix</Button>}{canEdit && question.status === 'archived' && <Button variant="outline" className="w-full justify-start" onClick={() => void runAction('restore-draft', 'Question restored')} disabled={saving}><Undo2 className="mr-1.5 h-4 w-4" /> Restore as draft</Button>}{canArchive && question.status !== 'archived' && <Button variant="destructive" className="w-full justify-start" onClick={() => void runAction('archive', 'Question archived')} disabled={saving}><Archive className="mr-1.5 h-4 w-4" /> Archive question</Button>}</CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" /> Version history</CardTitle></CardHeader><CardContent className="space-y-2">{detail.versions.map((version) => (<button key={version.id} type="button" onClick={() => { setSelectedVersionId(version.id); setEditor(null); }} className={version.id === viewedVersion.id ? 'w-full rounded-lg border border-primary/40 bg-primary/5 p-3 text-left' : 'w-full rounded-lg border p-3 text-left hover:bg-muted/30'}><div className="flex items-center justify-between"><span className="font-medium">Version {version.versionNumber}</span><span className="text-xs text-muted-foreground">{formatDate(version.createdAt)}</span></div><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{version.changeReason}</p><div className="mt-2 flex gap-1">{version.id === question.currentDraftVersionId && <Badge variant="outline">Current draft</Badge>}{version.id === question.approvedVersionId && <Badge className="bg-success/10 text-success hover:bg-success/10">Approved</Badge>}</div></button>))}</CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-4 w-4" /> Audit history</CardTitle></CardHeader><CardContent>{detail.auditEvents.length === 0 ? <p className="text-sm text-muted-foreground">No audit events recorded.</p> : <div className="space-y-3">{detail.auditEvents.map((event) => (<div key={event.id} className="border-l-2 pl-3"><p className="text-sm font-medium">{event.summary}</p><p className="mt-0.5 text-xs text-muted-foreground">{formatDate(event.occurredAt)} • {event.actionKey}</p>{event.reason && <p className="mt-1 text-xs text-muted-foreground">{event.reason}</p>}</div>))}</div>}</CardContent></Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>;
}
