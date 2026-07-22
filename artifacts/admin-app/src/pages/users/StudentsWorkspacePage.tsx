import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, KeyRound, Loader2, RefreshCw, Search, ShieldAlert, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentDirectory } from '@/features/students/useStudentAdministration';
import type { StudentStatus, StudentSummary } from '@/features/students/api';

function dateLabel(value: string | null) {
  if (!value) return 'Never';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
}

function statusTone(status: StudentStatus): 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  if (status === 'active') return 'success';
  if (status === 'invited') return 'info';
  if (status === 'suspended') return 'warning';
  if (status === 'disabled') return 'destructive';
  return 'neutral';
}

function statusLabel(status: StudentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function activityLabel(student: StudentSummary) {
  return student.latestAttemptAt || student.lastLoginAt || student.createdAt;
}

export function StudentsWorkspacePage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StudentStatus | 'all'>('all');
  const [language, setLanguage] = useState('all');
  const [page, setPage] = useState(1);

  const filters = useMemo(() => ({ search, status, language, page, pageSize: 25 }), [search, status, language, page]);
  const directory = useStudentDirectory(filters);
  const pageCount = Math.max(1, Math.ceil(directory.total / directory.pageSize));

  const applySearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div>
      <PageHeader
        title="Students"
        description="Canonical student identities, account state, learning activity and sessions. This foundation is read-only."
        icon={<Users className="h-5 w-5" />}
        actions={
          <Button variant="outline" size="sm" onClick={() => void directory.refresh()} disabled={directory.loading}>
            <RefreshCw className="mr-1.5 h-4 w-4" />Refresh
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={directory.stats.total.toLocaleString()} icon={Users} sublabel="canonical profiles" tone="primary" />
        <StatCard label="Active" value={directory.stats.active.toLocaleString()} icon={CheckCircle2} sublabel="account access enabled" tone="success" />
        <StatCard label="With attempts" value={directory.stats.withAttempts.toLocaleString()} icon={Activity} sublabel="learning history present" tone="info" />
        <StatCard label="Active sessions" value={directory.stats.activeSessions.toLocaleString()} icon={KeyRound} sublabel="unrevoked and unexpired" tone="warning" />
      </div>

      {directory.error && (
        <Card className="mb-4 border-destructive/40">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-destructive">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{directory.error}</span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 grid gap-3 md:grid-cols-[minmax(260px,1fr)_190px_190px_auto]">
            <div className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') applySearch(); }}
                placeholder="Search name, email, phone, registration code or ID"
                aria-label="Search students"
              />
              <Button variant="outline" onClick={applySearch}><Search className="h-4 w-4" /></Button>
            </div>
            <Select value={status} onValueChange={(value) => { setStatus(value as StudentStatus | 'all'); setPage(1); }}>
              <SelectTrigger aria-label="Student status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={(value) => { setLanguage(value); setPage(1); }}>
              <SelectTrigger aria-label="Preferred language"><SelectValue placeholder="All languages" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {directory.facets.languages.map((item) => (
                  <SelectItem key={item.code} value={item.code}>{item.code.toUpperCase()} ({item.count})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              onClick={() => { setSearchInput(''); setSearch(''); setStatus('all'); setLanguage('all'); setPage(1); }}
            >
              Clear
            </Button>
          </div>

          {directory.loading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading canonical students…
            </div>
          ) : directory.students.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <Users className="h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 text-base font-semibold">No canonical students found</h2>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                {directory.stats.total === 0
                  ? 'No identity.student_profiles records exist yet. Prototype students are intentionally excluded.'
                  : 'No students match the current search and filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Average score</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Latest activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directory.students.map((student) => (
                    <TableRow key={student.id} className="cursor-pointer">
                      <TableCell>
                        <Link to={`/users/students/${student.id}`} className="block">
                          <p className="font-medium text-foreground hover:underline">{student.displayName}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{student.registrationCode}</p>
                        </Link>
                      </TableCell>
                      <TableCell><StatusBadge tone={statusTone(student.status)} dot>{statusLabel(student.status)}</StatusBadge></TableCell>
                      <TableCell className="uppercase text-muted-foreground">{student.preferredLanguageCode}</TableCell>
                      <TableCell>{student.evaluatedAttemptCount} / {student.attemptCount}</TableCell>
                      <TableCell>{student.averageScore == null ? '—' : student.averageScore.toLocaleString()}</TableCell>
                      <TableCell>{student.activeSessionCount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{dateLabel(activityLabel(student))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{directory.total.toLocaleString()} student{directory.total === 1 ? '' : 's'} · Page {directory.page} of {pageCount}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={directory.page <= 1 || directory.loading} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
              <Button variant="outline" size="sm" disabled={directory.page >= pageCount || directory.loading} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
