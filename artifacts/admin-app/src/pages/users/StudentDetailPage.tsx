import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, Clock, Laptop, RefreshCw, Shield, UserRound } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentProfile } from '@/features/students/useStudentAdministration';
import type { StudentAccountAction } from '@/features/students/api';

const fmt = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';
const title = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function StudentDetailPage() {
  const { id } = useParams();
  const { data, loading, mutating, error, refresh, runAction } = useStudentProfile(id);
  const [reason, setReason] = useState('');

  const execute = async (action: StudentAccountAction) => {
    if (!data?.student) return;
    if (!reason.trim()) { showToast.warning('Reason required', 'Enter an operational reason before changing a student account.'); return; }
    try {
      const operation = await runAction(action, reason.trim(), data.student.status);
      showToast.success('Student operation completed', operation.sessionsRevoked ? `${operation.sessionsRevoked} active session(s) revoked.` : `Account status is now ${title(operation.status)}.`);
      setReason('');
    } catch (caught) {
      showToast.error('Student operation failed', caught instanceof Error ? caught.message : 'Unable to complete the operation.');
    }
  };

  if (loading && !data) return <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground"><RefreshCw className="h-4 w-4 animate-spin" />Loading canonical student profile…</div>;
  if (!data) return <div className="space-y-4"><div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error ?? 'Student not found.'}</div><Button asChild variant="outline"><Link to="/users/students"><ArrowLeft className="mr-1.5 h-4 w-4" />Back to students</Link></Button></div>;

  const { student, attempts, sessions, timeline } = data;
  return (
    <div className="space-y-5">
      <PageHeader title={student.displayName} description={`${student.registrationCode} · Canonical student profile`} icon={<UserRound className="h-5 w-5" />} actions={<div className="flex gap-2"><Button variant="outline" onClick={() => void refresh()} disabled={loading || mutating}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button><Button asChild variant="outline"><Link to="/users/students"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Link></Button></div>} />
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Status" value={<StatusBadge tone={student.status === 'active' ? 'success' : student.status === 'suspended' || student.status === 'disabled' ? 'destructive' : 'neutral'} dot>{title(student.status)}</StatusBadge>} />
        <Metric label="Attempts" value={student.attemptCount} />
        <Metric label="Average score" value={student.averageScore == null ? '—' : student.averageScore} />
        <Metric label="Active sessions" value={student.activeSessionCount} />
      </div>

      <Card className="border-warning/30"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4" />Account operations</CardTitle></CardHeader><CardContent className="space-y-3"><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required: support, security or policy reason. This is written to the audit log." /><div className="flex flex-wrap gap-2">{student.status === 'suspended' || student.status === 'disabled' ? <Button onClick={() => void execute('reactivate')} disabled={mutating}>Reactivate account</Button> : <Button variant="destructive" onClick={() => void execute('suspend')} disabled={mutating}>Suspend and revoke sessions</Button>}<Button variant="outline" onClick={() => void execute('revoke-sessions')} disabled={mutating || student.activeSessionCount === 0}>Revoke active sessions</Button></div><p className="text-xs text-muted-foreground">Operations use optimistic status checks and create immutable audit evidence. Suspending a student also revokes every active session.</p></CardContent></Card>

      <Tabs defaultValue="profile"><TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="attempts">Attempts ({attempts.length})</TabsTrigger><TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger><TabsTrigger value="timeline">Timeline ({timeline.length})</TabsTrigger></TabsList>
        <TabsContent value="profile" className="mt-4"><Card><CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3"><Detail label="Email" value={student.email} /><Detail label="Phone" value={student.phone ?? '—'} /><Detail label="Language" value={student.preferredLanguageCode.toUpperCase()} /><Detail label="Auth providers" value={student.authProviders.join(', ') || '—'} /><Detail label="Registered" value={fmt(student.createdAt)} /><Detail label="Last login" value={fmt(student.lastLoginAt)} /><Detail label="Latest attempt" value={fmt(student.latestAttemptAt)} /><Detail label="Student UUID" value={student.id} /><Detail label="Profile updated" value={fmt(student.profileUpdatedAt)} /></CardContent></Card></TabsContent>
        <TabsContent value="attempts" className="mt-4"><Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Test</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Score</TableHead><TableHead className="text-right">Correct</TableHead><TableHead className="text-right">Incorrect</TableHead><TableHead>Activity</TableHead></TableRow></TableHeader><TableBody>{attempts.length ? attempts.map((attempt) => <TableRow key={attempt.id}><TableCell><div className="font-medium">{attempt.testTitle || attempt.testPublicCode || 'Test attempt'}</div><div className="text-xs text-muted-foreground">Attempt {attempt.attemptNumber}</div></TableCell><TableCell>{title(attempt.status)}</TableCell><TableCell className="text-right">{attempt.finalScore ?? attempt.rawScore ?? '—'}</TableCell><TableCell className="text-right">{attempt.correctCount ?? '—'}</TableCell><TableCell className="text-right">{attempt.incorrectCount ?? '—'}</TableCell><TableCell className="text-xs text-muted-foreground">{fmt(attempt.submittedAt || attempt.startedAt)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No attempts recorded.</TableCell></TableRow>}</TableBody></Table></CardContent></Card></TabsContent>
        <TabsContent value="sessions" className="mt-4"><div className="grid gap-3">{sessions.length ? sessions.map((session) => <Card key={session.id}><CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"><div className="flex gap-3"><Laptop className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="font-medium">{session.deviceName || 'Unknown device'}</p><p className="text-xs text-muted-foreground">{session.maskedIpAddress || 'IP unavailable'} · {session.userAgent || 'User agent unavailable'}</p><p className="mt-1 text-xs text-muted-foreground">Created {fmt(session.createdAt)} · Expires {fmt(session.expiresAt)}</p></div></div><StatusBadge tone={session.state === 'active' ? 'success' : 'neutral'} dot>{title(session.state)}</StatusBadge></CardContent></Card>) : <Card><CardContent className="py-10 text-center text-muted-foreground">No sessions recorded.</CardContent></Card>}</div></TabsContent>
        <TabsContent value="timeline" className="mt-4"><Card><CardContent className="divide-y p-0">{timeline.length ? timeline.map((event) => <div key={event.id} className="flex gap-3 p-4"><Activity className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{event.title}</p><p className="text-xs text-muted-foreground">{title(event.type)} · {fmt(event.occurredAt)}</p>{event.detail && <p className="mt-1 text-xs text-muted-foreground">{event.detail}</p>}</div></div>) : <div className="py-10 text-center text-muted-foreground">No timeline events recorded.</div>}</CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: ReactNode }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-2 text-xl font-semibold">{value}</div></CardContent></Card>; }
function Detail({ label, value }: { label: string; value: ReactNode }) { return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 break-words text-sm font-medium">{value}</div></div>; }
