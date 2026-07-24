import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CloudDownload, Download, RefreshCw, Search, ShieldAlert, Trash2, UserCheck, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getDeletedStudents, runStudentBulkAction, syncFirebaseStudents, type DeletedStudent, type StudentBulkAction } from '@/features/students/api';
import { useStudentDirectory } from '@/features/students/useStudentAdministration';

const formatDate = (value: string | null) => value ? new Date(value).toLocaleString() : '—';
const title = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function StudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [language, setLanguage] = useState('all');
  const [page, setPage] = useState(1);
  const [deletedView, setDeletedView] = useState(false);
  const [deleted, setDeleted] = useState<{ students: DeletedStudent[]; total: number }>({ students: [], total: 0 });
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [bulkAction, setBulkAction] = useState<StudentBulkAction>('suspend');
  const [reason, setReason] = useState('');
  const [working, setWorking] = useState(false);
  const filters = useMemo(() => ({ search, status: status as 'all', language, page, pageSize: 25 }), [search, status, language, page]);
  const directory = useStudentDirectory(filters);

  useEffect(() => { setPage(1); setSelected(new Set()); }, [search, status, language, deletedView]);
  const loadDeleted = async () => { try { const result = await getDeletedStudents({ search, page, pageSize: 25 }); setDeleted(result); } catch (caught) { showToast.error('Unable to load deleted students', caught instanceof Error ? caught.message : 'Request failed.'); } };
  useEffect(() => { if (deletedView) void loadDeleted(); }, [deletedView, search, page]);

  const visible = deletedView ? deleted.students : directory.students;
  const total = deletedView ? deleted.total : directory.total;
  const totalPages = Math.max(1, Math.ceil(total / 25));
  const allSelected = visible.length > 0 && visible.every((student) => selected.has(student.id));

  const applyBulk = async () => {
    if (!selected.size) return showToast.warning('No students selected', 'Select one or more students first.');
    if (!reason.trim()) return showToast.warning('Reason required', 'Enter an operational reason for the audit record.');
    setWorking(true);
    try {
      const action = deletedView ? 'restore' : bulkAction;
      const result = await runStudentBulkAction([...selected], action, reason.trim());
      showToast.success('Bulk operation completed', `${result.succeeded} succeeded, ${result.failed} failed.`);
      setSelected(new Set()); setReason('');
      deletedView ? await loadDeleted() : await directory.refresh();
    } catch (caught) { showToast.error('Bulk operation failed', caught instanceof Error ? caught.message : 'Request failed.'); }
    finally { setWorking(false); }
  };

  const syncFirebase = async () => {
    if (!reason.trim()) return showToast.warning('Reason required', 'Enter a reason before reconciling Firebase students.');
    setWorking(true);
    try {
      const result = await syncFirebaseStudents(reason.trim());
      showToast.success('Firebase reconciliation completed', `${result.created} created, ${result.linked} linked, ${result.existing} already canonical, ${result.failed} failed.`);
      await directory.refresh();
    } catch (caught) {
      showToast.error('Firebase reconciliation failed', caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const exportCsv = () => {
    const rows = [['Registration Code', 'Name', 'Email', 'Phone', 'Status', 'Language'], ...visible.map((student) => [student.registrationCode, student.displayName, student.email, student.phone ?? '', student.status, student.preferredLanguageCode])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `students-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className="space-y-5">
    <PageHeader title="Students" description="Canonical student accounts, activity and session control." icon={<Users className="h-5 w-5" />} actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void syncFirebase()} disabled={working || deletedView}><CloudDownload className="mr-1.5 h-4 w-4" />Sync Firebase students</Button><Button variant={deletedView ? 'destructive' : 'outline'} onClick={() => setDeletedView((value) => !value)}><Trash2 className="mr-1.5 h-4 w-4" />{deletedView ? 'Back to active directory' : 'Deleted students'}</Button><Button variant="outline" onClick={() => deletedView ? void loadDeleted() : void directory.refresh()}><RefreshCw className="mr-1.5 h-4 w-4" />Refresh</Button><Button variant="outline" onClick={exportCsv} disabled={!visible.length}><Download className="mr-1.5 h-4 w-4" />Export page</Button></div>} />
    {directory.error && !deletedView && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{directory.error}</div>}
    {!deletedView && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Total students" value={directory.stats.total} icon={<Users className="h-4 w-4" />} /><Metric label="Active" value={directory.stats.active} icon={<UserCheck className="h-4 w-4" />} /><Metric label="Suspended / disabled" value={directory.stats.suspended + directory.stats.disabled} icon={<ShieldAlert className="h-4 w-4" />} /><Metric label="Active sessions" value={directory.stats.activeSessions} icon={<Activity className="h-4 w-4" />} /></div>}
    <Card><CardContent className="space-y-4 p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_190px_190px]"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, registration code or UUID" className="pl-9" /></div>{!deletedView && <><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{directory.facets.statuses.map((entry) => <SelectItem key={entry} value={entry}>{title(entry)}</SelectItem>)}</SelectContent></Select><Select value={language} onValueChange={setLanguage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All languages</SelectItem>{directory.facets.languages.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.code.toUpperCase()} · {entry.count}</SelectItem>)}</SelectContent></Select></>}</div>
      <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 md:grid-cols-[190px_1fr_auto]">{deletedView ? <div className="flex items-center text-sm font-medium">Restore selected accounts</div> : <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as StudentBulkAction)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="suspend">Suspend</SelectItem><SelectItem value="reactivate">Reactivate</SelectItem><SelectItem value="revoke-sessions">Revoke sessions</SelectItem><SelectItem value="soft-delete">Soft delete</SelectItem></SelectContent></Select>}<Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required operational reason (also used for Firebase sync)" className="min-h-10" /><Button onClick={() => void applyBulk()} disabled={working || !selected.size}>{deletedView ? 'Restore selected' : `Apply to ${selected.size}`}</Button></div>
      <div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={(checked) => setSelected(checked ? new Set(visible.map((student) => student.id)) : new Set())} /></TableHead><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead>Language</TableHead>{!deletedView && <><TableHead className="text-right">Attempts</TableHead><TableHead className="text-right">Avg score</TableHead><TableHead className="text-right">Sessions</TableHead></>}<TableHead>{deletedView ? 'Deleted at' : 'Last activity'}</TableHead></TableRow></TableHeader><TableBody>{visible.length === 0 ? <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No students match this view.</TableCell></TableRow> : visible.map((student) => <TableRow key={student.id} className="cursor-pointer" onClick={() => !deletedView && navigate(`/users/students/${student.id}`)}><TableCell onClick={(event) => event.stopPropagation()}><Checkbox checked={selected.has(student.id)} onCheckedChange={(checked) => setSelected((current) => { const next = new Set(current); checked ? next.add(student.id) : next.delete(student.id); return next; })} /></TableCell><TableCell><div className="font-medium">{student.displayName}</div><div className="text-xs text-muted-foreground">{student.registrationCode} · {student.email}</div></TableCell><TableCell><StatusBadge tone={student.status === 'active' ? 'success' : 'destructive'} dot>{title(student.status)}</StatusBadge></TableCell><TableCell>{student.preferredLanguageCode.toUpperCase()}</TableCell>{!deletedView && <><TableCell className="text-right">{'attemptCount' in student ? student.attemptCount : '—'}</TableCell><TableCell className="text-right">{'averageScore' in student ? student.averageScore ?? '—' : '—'}</TableCell><TableCell className="text-right">{'activeSessionCount' in student ? student.activeSessionCount : '—'}</TableCell></>}<TableCell className="text-xs text-muted-foreground">{formatDate(deletedView ? (student as DeletedStudent).deletedAt : ('latestAttemptAt' in student ? student.latestAttemptAt ?? student.lastLoginAt ?? student.createdAt : student.createdAt))}</TableCell></TableRow>)}</TableBody></Table></div>
      <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Page {page} of {totalPages} · {total} matching students</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
    </CardContent></Card>
  </div>;
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) { return <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</p></div><div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div></CardContent></Card>; }
