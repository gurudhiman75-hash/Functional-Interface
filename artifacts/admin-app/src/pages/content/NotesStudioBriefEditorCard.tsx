import { useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Save, X } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminRequest } from '@/lib/admin-request';

type EditorLanguage = { id: string; code: string; name: string; nativeName: string | null };
type EditorExam = { id: string; code: string; name: string; familyId: string; familyCode: string; familyName: string };
export type NotesStudioBriefEditorOptions = { languages: EditorLanguage[]; exams: EditorExam[]; maxExamTargets: number };

export type NotesStudioBriefEditorJob = {
  id: string;
  title: string;
  sourceLanguage: string;
  state: string;
  brief: {
    topicLabel?: string;
    depth?: string;
    learnerLevel?: string;
    syllabusEmphasis?: string;
    examIds?: string[];
  };
};

type BriefDraft = {
  title: string;
  topicLabel: string;
  sourceLanguage: string;
  depth: string;
  learnerLevel: string;
  syllabusEmphasis: string;
  examIds: string[];
};

type Props = {
  job: NotesStudioBriefEditorJob;
  options: NotesStudioBriefEditorOptions;
  canEdit: boolean;
  onSaved: () => void | Promise<void>;
};

const editableStates = new Set(['brief', 'sources_ready']);
const nativeSelectClassName = 'h-10 w-full touch-manipulation rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

function draftFromJob(job: NotesStudioBriefEditorJob): BriefDraft {
  return {
    title: job.title,
    topicLabel: job.brief?.topicLabel ?? '',
    sourceLanguage: job.sourceLanguage || 'en',
    depth: job.brief?.depth ?? 'standard',
    learnerLevel: job.brief?.learnerLevel ?? 'standard',
    syllabusEmphasis: job.brief?.syllabusEmphasis ?? '',
    examIds: Array.isArray(job.brief?.examIds) ? job.brief.examIds : [],
  };
}

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioBriefEditorCard({ job, options, canEdit, onSaved }: Props) {
  const [editing, setEditing] = useState(false);
  const [working, setWorking] = useState(false);
  const [draft, setDraft] = useState<BriefDraft>(() => draftFromJob(job));
  const editable = canEdit && editableStates.has(job.state);

  useEffect(() => {
    setDraft(draftFromJob(job));
    setEditing(false);
  }, [job.id, job.title, job.sourceLanguage, job.state, job.brief]);

  const examGroups = useMemo(() => {
    const groups = new Map<string, EditorExam[]>();
    for (const exam of options.exams) {
      const list = groups.get(exam.familyName) ?? [];
      list.push(exam);
      groups.set(exam.familyName, list);
    }
    return [...groups.entries()];
  }, [options.exams]);

  const selectedExamNames = useMemo(() => {
    const selected = new Set(job.brief?.examIds ?? []);
    return options.exams.filter((exam) => selected.has(exam.id)).map((exam) => exam.name);
  }, [job.brief?.examIds, options.exams]);

  const toggleExam = (examId: string, selected: boolean) => {
    setDraft((current) => {
      if (!selected) return { ...current, examIds: current.examIds.filter((id) => id !== examId) };
      if (current.examIds.includes(examId)) return current;
      if (current.examIds.length >= options.maxExamTargets) {
        showToast.warning('Exam target limit reached', `Choose up to ${options.maxExamTargets} exams.`);
        return current;
      }
      return { ...current, examIds: [...current.examIds, examId] };
    });
  };

  const cancel = () => {
    setDraft(draftFromJob(job));
    setEditing(false);
  };

  const save = async () => {
    if (draft.title.trim().length < 3) {
      showToast.warning('Job title required', 'Enter a clear internal authoring-job title.');
      return;
    }
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${job.id}/brief`, {
        method: 'PATCH',
        body: JSON.stringify(draft),
      });
      await onSaved();
      setEditing(false);
      showToast.success('Brief updated', 'The authoring brief was saved and its edit was recorded in the audit trail.');
    } catch (error) {
      showToast.error('Unable to update brief', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <Card className={editing ? 'border-primary/30' : undefined}>
    <CardHeader>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Authoring brief</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Research intent, learner depth and exam targeting for this note.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{pretty(job.state)}</Badge>
          {editable && !editing && <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="mr-1.5 h-4 w-4" />Edit brief
          </Button>}
        </div>
      </div>
    </CardHeader>

    {!editing ? <CardContent className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Topic / syllabus target</div><div className="mt-1 text-sm font-medium">{job.brief?.topicLabel || 'Not specified'}</div></div>
        <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Source language</div><div className="mt-1 text-sm font-medium">{job.sourceLanguage.toUpperCase()}</div></div>
        <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Depth</div><div className="mt-1 text-sm font-medium">{pretty(job.brief?.depth ?? 'standard')}</div></div>
        <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Learner level</div><div className="mt-1 text-sm font-medium">{pretty(job.brief?.learnerLevel ?? 'standard')}</div></div>
      </div>
      <div className="rounded-lg border p-3">
        <div className="text-xs text-muted-foreground">Syllabus / PYQ emphasis</div>
        <div className="mt-1 whitespace-pre-wrap text-sm">{job.brief?.syllabusEmphasis || 'No special emphasis recorded.'}</div>
      </div>
      <div className="rounded-lg border p-3">
        <div className="text-xs text-muted-foreground">Exam targets</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedExamNames.length > 0 ? selectedExamNames.map((name) => <Badge key={name} variant="secondary">{name}</Badge>) : <span className="text-sm text-muted-foreground">No canonical exam targets selected.</span>}
        </div>
      </div>
      {!editable && <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-sm text-muted-foreground">
        Brief editing is frozen after evidence work begins. Use the governed Research Restart flow if the research intent must change.
      </div>}
    </CardContent> : <CardContent className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5"><Label>Internal job title</Label><Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></div>
        <div className="space-y-1.5"><Label>Canonical topic / syllabus target</Label><Input value={draft.topicLabel} onChange={(event) => setDraft((current) => ({ ...current, topicLabel: event.target.value }))} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`notes-brief-language-${job.id}`}>Source language</Label>
          <select id={`notes-brief-language-${job.id}`} className={nativeSelectClassName} value={draft.sourceLanguage} onChange={(event) => setDraft((current) => ({ ...current, sourceLanguage: event.target.value }))}>
            {options.languages.length === 0 ? <option value="en">English</option> : options.languages.map((language) => <option key={language.id} value={language.code}>{language.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`notes-brief-depth-${job.id}`}>Depth</Label>
          <select id={`notes-brief-depth-${job.id}`} className={nativeSelectClassName} value={draft.depth} onChange={(event) => setDraft((current) => ({ ...current, depth: event.target.value }))}>
            <option value="quick_revision">Quick revision</option>
            <option value="standard">Standard</option>
            <option value="comprehensive">Comprehensive</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`notes-brief-level-${job.id}`}>Learner level</Label>
          <select id={`notes-brief-level-${job.id}`} className={nativeSelectClassName} value={draft.learnerLevel} onChange={(event) => setDraft((current) => ({ ...current, learnerLevel: event.target.value }))}>
            <option value="foundation">Foundation</option>
            <option value="standard">Standard</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5"><Label>Syllabus / PYQ emphasis</Label><Textarea className="min-h-[110px]" value={draft.syllabusEmphasis} onChange={(event) => setDraft((current) => ({ ...current, syllabusEmphasis: event.target.value }))} /></div>
      <div className="space-y-2">
        <Label>Exam targets <span className="text-muted-foreground">({draft.examIds.length}/{options.maxExamTargets})</span></Label>
        <div className="max-h-56 overflow-auto rounded-lg border p-3">
          {examGroups.length === 0 && <div className="text-sm text-muted-foreground">No canonical exams are currently available.</div>}
          {examGroups.map(([family, exams]) => <div key={family} className="mb-3 last:mb-0">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">{family}</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{exams.map((exam) => <label key={exam.id} className="flex items-center gap-2 text-sm"><Checkbox checked={draft.examIds.includes(exam.id)} onCheckedChange={(checked) => toggleExam(exam.id, Boolean(checked))} />{exam.name}</label>)}</div>
          </div>)}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={cancel} disabled={working}><X className="mr-1.5 h-4 w-4" />Cancel</Button>
        <Button onClick={() => void save()} disabled={working}>{working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}Save brief</Button>
      </div>
    </CardContent>}
  </Card>;
}

export default NotesStudioBriefEditorCard;
