import { useEffect, useMemo, useState } from 'react';
import { FolderPlus, Pencil, Plus, RefreshCw, Settings2 } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const codePattern = /^[A-Z][A-Z0-9_-]{1,79}$/;

type Family = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  examCount: number;
};
type Exam = {
  id: string;
  familyId: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  versionCount: number;
  latestVersionNumber: number | null;
  currentVersionId: string | null;
};
type Language = { id: string; code: string; name: string; nativeName: string | null; isActive: boolean };
type Rule = {
  durationMinutes: number;
  totalQuestions: number;
  marksPerCorrect: number;
  negativeMarksPerWrong: number;
  unattemptedMarks: number;
};
type Version = {
  id: string;
  examId: string;
  versionNumber: number;
  name: string;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  isCurrent: boolean;
  createdAt: string;
  languages: Array<Language & { isPrimary: boolean }>;
  ruleProfile: Rule | null;
  changeReason: string | null;
};
type Data = { families: Family[]; exams: Exam[]; versions: Version[]; languages: Language[] };

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as (T & { error?: string }) | null;
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status}).`);
  if (!body) throw new Error('Exam Configuration returned an empty response.');
  return body;
}

export function ExamConfigurationPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');

  const [familyDialogOpen, setFamilyDialogOpen] = useState(false);
  const [familyCode, setFamilyCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyDescription, setFamilyDescription] = useState('');
  const [savingFamily, setSavingFamily] = useState(false);

  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [examFamilyId, setExamFamilyId] = useState('');
  const [examCode, setExamCode] = useState('');
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [savingNewExam, setSavingNewExam] = useState(false);

  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [duration, setDuration] = useState('60');
  const [questions, setQuestions] = useState('100');
  const [positive, setPositive] = useState('1');
  const [negative, setNegative] = useState('0.25');

  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editReason, setEditReason] = useState('');
  const [savingExam, setSavingExam] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await call<Data>('/admin/exam-configuration');
      setData(result);
      if (!selectedExam && result.exams[0]) setSelectedExam(result.exams[0].id);
      if (!languageId && result.languages[0]) setLanguageId(result.languages[0].id);
      if (!examFamilyId && result.families[0]) setExamFamilyId(result.families[0].id);
    } catch (error) {
      showToast.error(
        'Unable to load Exam Configuration',
        error instanceof Error ? error.message : 'Request failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const familyById = useMemo(
    () => new Map((data?.families ?? []).map((family) => [family.id, family])),
    [data?.families],
  );
  const versions = useMemo(
    () => data?.versions.filter((version) => version.examId === selectedExam) || [],
    [data, selectedExam],
  );
  const selectedExamRecord = useMemo(
    () => data?.exams.find((exam) => exam.id === selectedExam) ?? null,
    [data?.exams, selectedExam],
  );

  const createFamily = async () => {
    const code = familyCode.trim().toUpperCase();
    const nameValue = familyName.trim();
    if (!codePattern.test(code) || nameValue.length < 2) return;
    setSavingFamily(true);
    try {
      const result = await call<{ id: string }>('/admin/exam-configuration/families', {
        method: 'POST',
        body: JSON.stringify({
          code,
          name: nameValue,
          description: familyDescription.trim(),
        }),
      });
      setFamilyCode('');
      setFamilyName('');
      setFamilyDescription('');
      setFamilyDialogOpen(false);
      setExamFamilyId(result.id);
      await refresh();
      showToast.success('Exam category created', 'You can now add exams under this category before creating any questions.');
      setExamDialogOpen(true);
    } catch (error) {
      showToast.error('Unable to create exam category', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setSavingFamily(false);
    }
  };

  const createExam = async () => {
    const code = examCode.trim().toUpperCase();
    const nameValue = examName.trim();
    if (!examFamilyId || !codePattern.test(code) || nameValue.length < 2) return;
    setSavingNewExam(true);
    try {
      const result = await call<{ id: string }>('/admin/exam-configuration/exams', {
        method: 'POST',
        body: JSON.stringify({
          familyId: examFamilyId,
          code,
          name: nameValue,
          description: examDescription.trim(),
        }),
      });
      setExamCode('');
      setExamName('');
      setExamDescription('');
      setExamDialogOpen(false);
      setSelectedExam(result.id);
      await refresh();
      showToast.success(
        'Exam created',
        'The exam exists independently of Question Studio. Create its first version when you are ready to map syllabus nodes.',
      );
    } catch (error) {
      showToast.error('Unable to create exam', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setSavingNewExam(false);
    }
  };

  const createVersion = async () => {
    try {
      await call(`/admin/exam-configuration/exams/${selectedExam}/versions`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          changeReason: reason,
          languageIds: [languageId],
          primaryLanguageId: languageId,
          durationMinutes: Number(duration),
          totalQuestions: Number(questions),
          marksPerCorrect: Number(positive),
          negativeMarksPerWrong: Number(negative),
          unattemptedMarks: 0,
        }),
      });
      showToast.success('Version created', 'The immutable exam version is ready for activation.');
      setName('');
      setReason('');
      await refresh();
    } catch (error) {
      showToast.error('Unable to create version', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  const activate = async (id: string) => {
    const why = window.prompt('Activation reason');
    if (!why) return;
    try {
      await call(`/admin/exam-configuration/versions/${id}/activate`, {
        method: 'POST',
        body: JSON.stringify({ reason: why }),
      });
      showToast.success('Version activated', 'This is now the current exam version and can be mapped in Sections & Topics.');
      await refresh();
    } catch (error) {
      showToast.error('Unable to activate', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  const openExamEdit = (exam: Exam) => {
    setEditingExam(exam);
    setEditName(exam.name);
    setEditDescription(exam.description || '');
    setEditReason('');
  };

  const saveExamEdit = async () => {
    if (!editingExam) return;
    setSavingExam(true);
    try {
      await call(`/admin/exam-configuration/exams/${editingExam.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          reason: editReason,
        }),
      });
      showToast.success('Exam updated', 'The catalogue name and description were updated without changing the exam identity or versions.');
      setEditingExam(null);
      await refresh();
    } catch (error) {
      showToast.error('Unable to update exam', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setSavingExam(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Exam Configuration"
        description="Create exam categories and exams first, define immutable versions and syllabus mappings next, and add questions whenever content is ready."
        icon={<Settings2 className="h-5 w-5" />}
        actions={(
          <>
            <Button variant="outline" onClick={() => setFamilyDialogOpen(true)}>
              <FolderPlus className="mr-1.5 h-4 w-4" /> New category
            </Button>
            <Button variant="outline" onClick={() => setExamDialogOpen(true)} disabled={!data?.families.length}>
              <Plus className="mr-1.5 h-4 w-4" /> New exam
            </Button>
            <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </>
        )}
      />

      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Question generation is not required.</strong>{' '}
          Recommended setup: Exam category → Exam → create and activate its first exam version → map Subjects/Topics/Chapters/CPs in Sections & Topics → generate or import questions later.
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exam catalogue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>
                {data?.exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name} ({exam.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Versions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <p className="font-medium">{exam.name}</p>
                      <p className="text-xs text-muted-foreground">{exam.code}</p>
                    </TableCell>
                    <TableCell>{familyById.get(exam.familyId)?.name || '—'}</TableCell>
                    <TableCell>
                      <StatusBadge tone={exam.isActive ? 'success' : 'warning'}>
                        {exam.isActive ? 'active' : 'retired'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      {exam.versionCount === 0 ? (
                        <span className="text-muted-foreground">0 · not configured</span>
                      ) : exam.versionCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => openExamEdit(exam)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {data?.exams.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No exams yet. Create an exam category first, then add an exam. No questions are required.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Create immutable version</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {selectedExamRecord?.versionCount === 0 && (
              <div className="sm:col-span-2 rounded-lg border border-dashed bg-muted/20 p-3 text-sm text-muted-foreground">
                <strong className="text-foreground">{selectedExamRecord.name}</strong> currently has no exam version.
                Create its first version here, then activate it before mapping syllabus nodes to this exam.
              </div>
            )}
            <Field label="Version name">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="2026 recruitment pattern" />
            </Field>
            <Field label="Primary language">
              <Select value={languageId} onValueChange={setLanguageId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {data?.languages.filter((language) => language.isActive).map((language) => (
                    <SelectItem key={language.id} value={language.id}>{language.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Duration (minutes)"><Input type="number" value={duration} onChange={(event) => setDuration(event.target.value)} /></Field>
            <Field label="Total questions"><Input type="number" value={questions} onChange={(event) => setQuestions(event.target.value)} /></Field>
            <Field label="Marks per correct"><Input type="number" step="0.01" value={positive} onChange={(event) => setPositive(event.target.value)} /></Field>
            <Field label="Negative marks per wrong"><Input type="number" step="0.01" value={negative} onChange={(event) => setNegative(event.target.value)} /></Field>
            <div className="sm:col-span-2">
              <Field label="Change reason">
                <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Initial official pattern / describe the pattern change" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button onClick={() => void createVersion()} disabled={!selectedExam || !name || reason.length < 8 || !languageId}>
                Create immutable version
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Version history</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Rule profile</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>
                    <p className="font-medium">v{version.versionNumber} · {version.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString('en-US')} · {version.changeReason || 'No reason recorded'}
                    </p>
                  </TableCell>
                  <TableCell>
                    {version.ruleProfile
                      ? `${version.ruleProfile.totalQuestions} Q · ${version.ruleProfile.durationMinutes} min · +${version.ruleProfile.marksPerCorrect} / −${version.ruleProfile.negativeMarksPerWrong}`
                      : 'Legacy version — rules unavailable'}
                  </TableCell>
                  <TableCell>{version.languages.map((language) => `${language.name}${language.isPrimary ? ' (primary)' : ''}`).join(', ') || 'None'}</TableCell>
                  <TableCell>
                    <StatusBadge tone={version.isCurrent ? 'success' : 'info'}>
                      {version.isCurrent ? 'current' : 'historical'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {!version.isCurrent && (
                      <Button size="sm" variant="outline" onClick={() => void activate(version.id)}>Activate</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {selectedExam && versions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No version yet. This is valid: the exam can exist before its syllabus and question bank are created.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Exam versions are immutable. Rule profiles are preserved with the version-creation audit event; activating a version never edits prior versions or rewrites tests already linked to an older version.
        </CardContent>
      </Card>

      <Dialog open={familyDialogOpen} onOpenChange={(open) => { if (!savingFamily) setFamilyDialogOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create exam category</DialogTitle>
            <DialogDescription>
              Create a top-level family such as SSC, Banking or Punjab Govt Exams. No exam version, syllabus or questions are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Category code">
              <Input value={familyCode} onChange={(event) => setFamilyCode(event.target.value.toUpperCase())} placeholder="SSC" maxLength={80} />
            </Field>
            <Field label="Category name">
              <Input value={familyName} onChange={(event) => setFamilyName(event.target.value)} placeholder="Staff Selection Commission" maxLength={200} />
            </Field>
            <Field label="Description">
              <Textarea value={familyDescription} onChange={(event) => setFamilyDescription(event.target.value)} placeholder="Optional category description" maxLength={2000} rows={3} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFamilyDialogOpen(false)} disabled={savingFamily}>Cancel</Button>
            <Button
              onClick={() => void createFamily()}
              disabled={savingFamily || !codePattern.test(familyCode.trim().toUpperCase()) || familyName.trim().length < 2}
            >
              {savingFamily ? 'Creating…' : 'Create category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={examDialogOpen} onOpenChange={(open) => { if (!savingNewExam) setExamDialogOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create exam</DialogTitle>
            <DialogDescription>
              Add an exam under an existing category. It can remain at zero versions and zero questions until you are ready to configure it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Exam category">
              <Select value={examFamilyId} onValueChange={setExamFamilyId}>
                <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                <SelectContent>
                  {data?.families.filter((family) => family.isActive).map((family) => (
                    <SelectItem key={family.id} value={family.id}>{family.name} ({family.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Exam code">
              <Input value={examCode} onChange={(event) => setExamCode(event.target.value.toUpperCase())} placeholder="SSC_CGL" maxLength={80} />
            </Field>
            <Field label="Exam name">
              <Input value={examName} onChange={(event) => setExamName(event.target.value)} placeholder="SSC CGL" maxLength={200} />
            </Field>
            <Field label="Description">
              <Textarea value={examDescription} onChange={(event) => setExamDescription(event.target.value)} placeholder="Optional exam description" maxLength={2000} rows={3} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExamDialogOpen(false)} disabled={savingNewExam}>Cancel</Button>
            <Button
              onClick={() => void createExam()}
              disabled={savingNewExam || !examFamilyId || !codePattern.test(examCode.trim().toUpperCase()) || examName.trim().length < 2}
            >
              {savingNewExam ? 'Creating…' : 'Create exam'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingExam)} onOpenChange={(open) => { if (!open && !savingExam) setEditingExam(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit exam</DialogTitle>
            <DialogDescription>Update catalogue metadata only. The exam code, family, identity and existing versions stay unchanged.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Exam name"><Input value={editName} onChange={(event) => setEditName(event.target.value)} maxLength={200} /></Field>
            <Field label="Description"><Textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} maxLength={2000} rows={4} placeholder="Optional exam description" /></Field>
            <Field label="Change reason"><Textarea value={editReason} onChange={(event) => setEditReason(event.target.value)} maxLength={1000} rows={3} placeholder="Why is this catalogue metadata being changed?" /></Field>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">Code: {editingExam?.code} · locked</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExam(null)} disabled={savingExam}>Cancel</Button>
            <Button onClick={() => void saveExamEdit()} disabled={savingExam || editName.trim().length < 2 || editReason.trim().length < 8}>
              {savingExam ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

export default ExamConfigurationPage;
