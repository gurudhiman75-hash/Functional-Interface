import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Download, RefreshCw, Search, ShieldAlert, UserCheck, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentDirectory } from '@/features/students/useStudentAdministration';

const formatDate = (value: string | null) => value ? new Date(value).toLocaleString() : '—';
const title = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function StudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [language, setLanguage] = useState('all');
  const filters = useMemo(() => ({ search, status: status as 'all', language, page: 1, pageSize: 50 }), [search, status, language]);
  const { students, stats, facets, total, loading, error, refresh } = useStudentDirectory(filters);

  const exportCsv = () => {
    const rows = [['Registration Code', 'Name', 'Email', 'Phone', 'Status', 'Language', 'Attempts', 'Average Score', 'Active Sessions', 'Last Login'], ...students.map((student) => [student.registrationCode, student.displayName, student.email, student.phone ?? '', student.status, student.preferredLanguageCode, String(student.attemptCount), student.averageScore == null ? '' : String(student.averageScore), String(student.activeSessionCount), student.lastLoginAt ?? ''])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `students-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Students" description="Canonical student accounts, activity and session control." icon={<Users className="h-5 w-5" />} actions={<div className="flex gap-2"><Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button><Button variant="outline" onClick={exportCsv} disabled={!students.length}><Download className="mr-1.5 h-4 w-4" />Export current view</Button></div>} />

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total students" value={stats.total} icon={<Users className="h-4 w-4" />} />
        <Metric label="Active" value={stats.active} icon={<UserCheck className="h-4 w-4" />} />
        <Metric label="Suspended / disabled" value={stats.suspended + stats.disabled} icon={<ShieldAlert className="h-4 w-4" />} />
        <Metric label="Active sessions" value={stats.activeSessions} icon={<Activity className="h-4 w-4" />} />
      </div>

      <Card><CardContent className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_190px_190px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, registration code or UUID" className="pl-9" /></div>
          <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{facets.statuses.map((entry) => <SelectItem key={entry} value={entry}>{title(entry)}</SelectItem>)}</SelectContent></Select>
          <Select value={language} onValueChange={setLanguage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All languages</SelectItem>{facets.languages.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.code.toUpperCase()} · {entry.count}</SelectItem>)}</SelectContent></Select>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead>Language</TableHead><TableHead className="text-right">Attempts</TableHead><TableHead className="text-right">Avg score</TableHead><TableHead className="text-right">Sessions</TableHead><TableHead>Last activity</TableHead></TableRow></TableHeader>
          <TableBody>{loading ? <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Loading canonical students…</TableCell></TableRow> : students.length === 0 ? <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No students match this view.</TableCell></TableRow> : students.map((student) => <TableRow key={student.id} className="cursor-pointer" onClick={() => navigate(`/users/students/${student.id}`)}><TableCell><div className="font-medium">{student.displayName}</div><div className="text-xs text-muted-foreground">{student.registrationCode} · {student.email}</div>{student.phone && <div className="text-xs text-muted-foreground">{student.phone}</div>}</TableCell><TableCell><StatusBadge tone={student.status === 'active' ? 'success' : student.status === 'suspended' || student.status === 'disabled' ? 'destructive' : 'neutral'} dot>{title(student.status)}</StatusBadge></TableCell><TableCell>{student.preferredLanguageCode.toUpperCase()}</TableCell><TableCell className="text-right">{student.attemptCount}</TableCell><TableCell className="text-right">{student.averageScore == null ? '—' : student.averageScore}</TableCell><TableCell className="text-right">{student.activeSessionCount}</TableCell><TableCell className="text-xs text-muted-foreground">{formatDate(student.latestAttemptAt ?? student.lastLoginAt ?? student.createdAt)}</TableCell></TableRow>)}</TableBody></Table>
        </div>
        <div className="text-xs text-muted-foreground">Showing {students.length} of {total} matching students.</div>
      </CardContent></Card>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</p></div><div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div></CardContent></Card>;
}
