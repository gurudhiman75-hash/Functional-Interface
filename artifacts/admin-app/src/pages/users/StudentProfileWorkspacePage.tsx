import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Activity, ArrowLeft, Calendar, CheckCircle2, Clock3, KeyRound, Languages,
  Loader2, Lock, LogOut, Mail, Phone, RefreshCw, RotateCcw, ShieldAlert,
  ShieldCheck, Smartphone, UserRound,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  type StudentAccountAction,
  type StudentAccountOperation,
  type StudentStatus,
} from '@/features/students/api';
import { useStudentProfile } from '@/features/students/useStudentAdministration';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

function dateLabel(value: string | null | undefined) {
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

function titleCase(value: string) {
  return value.replace(/[._]/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function secondsLabel(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}m ${seconds}s`;
}

function Detail({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Mail }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
      <p className="mt-1 break-words text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function actionCopy(action: StudentAccountAction) {
  if (action === 'suspend') {
    return {
      title: 'Suspend this student account?',
      description: 'The account status will become Suspended and every active canonical session will be revoked in the same transaction.',
      confirm: 'Suspend account',
      success: 'Student account suspended',
      icon: Lock,
    };
  }
  if (action === 'reactivate') {
    return {
      title: 'Reactivate this student account?',
      description: 'The account status will become Active. Previously revoked sessions will not be recreated.',
      confirm: 'Reactivate account',
      success: 'Student account reactivated',
      icon: RotateCcw,
    };
  }
  return {
    title: 'Revoke all active sessions?',
    description: 'Every active canonical session will be revoked. The student account status will not change.',
    confirm: 'Revoke sessions',
    success: 'Student sessions revoked',
    icon: LogOut,
  };
}

function operationDetail(operation: StudentAccountOperation) {
  const sessionText = `${operation.sessionsRevoked} session${operation.sessionsRevoked === 1 ? '' : 's'} revoked`;
  if (!operation.changed) return `No state change was required. Audit event ${operation.auditEventId} recorded the idempotent request.`;
  if (operation.action === 'reactivate') return `Account status is now Active. Audit event ${operation.auditEventId} was recorded.`;
  return `${sessionText}. Audit event ${operation.auditEventId} was recorded.`;
}

export function StudentProfileWorkspacePage() {
  const { id } = useParams();
  const profile = useStudentProfile(id);
  const { hasPermission } = useAdminPermissions();
  const canManage = hasPermission('users.students.manage');
  const [pendingAction, setPendingAction] = useState<StudentAccountAction | null>(null);
  const [reason, setReason] = useState('');

  if (profile.loading) {
    return <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading canonical student profile…</div>;
  }

  if (profile.error && !profile.data) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
          <ShieldAlert className="h-9 w-9 text-destructive" />
          <h1 className="mt-4 text-lg font-semibold">Student profile unavailable</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{profile.error}</p>
          <Button asChild variant="outline" className="mt-5"><Link to="/users/students"><ArrowLeft className="mr-2 h-4 w-4" />Back to Students</Link></Button>
        </CardContent>
      </Card>
    );
  }

  if (!profile.data) return null;

  const { student, attempts, sessions, timeline } = profile.data;
  const pendingCopy = pendingAction ? actionCopy(pendingAction) : null;
  const normalizedReason = reason.trim().replace(/\s+/g, ' ');

  const openAction = (action: StudentAccountAction) => {
    setReason('');
    setPendingAction(action);
  };

  const submitAction = async () => {
    if (!pendingAction || normalizedReason.length < 12) return;
    try {
      const operation = await profile.runAction(
        pendingAction,
        normalizedReason,
        pendingAction === 'revoke-sessions' ? undefined : student.status,
      );
      showToast.success(actionCopy(pendingAction).success, operationDetail(operation));
      setPendingAction(null);
      setReason('');
    } catch (error) {
      showToast.error(
        'Student operation failed',
        error instanceof Error ? error.message : 'The canonical student account operation failed.',
      );
    }
  };

  return (
    <div>
      <PageHeader
        title={student.displayName}
        description={`Canonical student profile · ${student.registrationCode}`}
        icon={<UserRound className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void profile.refresh()} disabled={profile.mutating}><RefreshCw className="mr-1.5 h-4 w-4" />Refresh</Button>
            <Button asChild variant="outline" size="sm"><Link to="/users/students"><ArrowLeft className="mr-1.5 h-4 w-4" />Students</Link></Button>
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attempts" value={student.attemptCount.toLocaleString()} icon={Activity} sublabel={`${student.evaluatedAttemptCount} evaluated`} tone="primary" />
        <StatCard label="Average score" value={student.averageScore == null ? '—' : student.averageScore.toLocaleString()} icon={CheckCircle2} sublabel="evaluated attempts" tone="success" />
        <StatCard label="Active sessions" value={student.activeSessionCount.toLocaleString()} icon={KeyRound} sublabel="unrevoked and unexpired" tone="warning" />
        <StatCard label="Preferred language" value={student.preferredLanguageCode.toUpperCase()} icon={Languages} sublabel="canonical profile setting" tone="info" />
      </div>

      {profile.error && (
        <Card className="mb-4 border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-destructive">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{profile.error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile">
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="attempts">Attempts ({attempts.length})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline ({timeline.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-base">Identity and account state</CardTitle>
              <StatusBadge tone={statusTone(student.status)} dot>{titleCase(student.status)}</StatusBadge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Detail label="Email" value={student.email} icon={Mail} />
              <Detail label="Phone" value={student.phone || 'Not provided'} icon={Phone} />
              <Detail label="Registration code" value={student.registrationCode} icon={UserRound} />
              <Detail label="Created" value={dateLabel(student.createdAt)} icon={Calendar} />
              <Detail label="Last login" value={dateLabel(student.lastLoginAt)} icon={Clock3} />
              <Detail label="Latest attempt" value={dateLabel(student.latestAttemptAt)} icon={Activity} />
              <Detail label="Authentication providers" value={student.authProviders.length ? student.authProviders.join(', ') : 'None linked'} icon={KeyRound} />
              <Detail label="Profile updated" value={dateLabel(student.profileUpdatedAt)} icon={RefreshCw} />
              <Detail label="Canonical user ID" value={student.id} icon={UserRound} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Account operations</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Status changes and session revocation require a reason and create immutable audit evidence.</p>
              </div>
              <StatusBadge tone={canManage ? 'success' : 'neutral'}>{canManage ? 'Manage access' : 'Read only'}</StatusBadge>
            </CardHeader>
            <CardContent>
              {!canManage ? (
                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Your administrator role can inspect this profile but does not include <code>users.students.manage</code>.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(student.status === 'active' || student.status === 'invited') && (
                    <Button variant="destructive" onClick={() => openAction('suspend')} disabled={profile.mutating}>
                      <Lock className="mr-2 h-4 w-4" />Suspend account
                    </Button>
                  )}
                  {student.status === 'suspended' && (
                    <Button onClick={() => openAction('reactivate')} disabled={profile.mutating}>
                      <RotateCcw className="mr-2 h-4 w-4" />Reactivate account
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => openAction('revoke-sessions')} disabled={profile.mutating || student.activeSessionCount === 0}>
                    <LogOut className="mr-2 h-4 w-4" />Revoke active sessions
                  </Button>
                  {student.status === 'disabled' && (
                    <p className="w-full rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-muted-foreground">Disabled accounts cannot be suspended or reactivated through this focused workflow.</p>
                  )}
                  {student.activeSessionCount === 0 && (
                    <p className="w-full text-xs text-muted-foreground">There are no active sessions to revoke.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent canonical attempts</CardTitle></CardHeader>
            <CardContent>
              {attempts.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">No learning.attempts records exist for this student.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Test</TableHead><TableHead>Status</TableHead><TableHead>Score</TableHead><TableHead>Correct / Wrong / Skipped</TableHead><TableHead>Time</TableHead><TableHead>Submitted</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {attempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell><p className="font-medium">{attempt.testTitle || 'Unknown publication'}</p><p className="font-mono text-[10px] text-muted-foreground">{attempt.testPublicCode || attempt.testPublicationId || attempt.id}</p></TableCell>
                          <TableCell><StatusBadge tone={attempt.status === 'evaluated' ? 'success' : attempt.status === 'in_progress' ? 'info' : 'neutral'}>{titleCase(attempt.status)}</StatusBadge></TableCell>
                          <TableCell>{attempt.finalScore ?? attempt.rawScore ?? '—'}</TableCell>
                          <TableCell>{attempt.correctCount ?? '—'} / {attempt.incorrectCount ?? '—'} / {attempt.unattemptedCount ?? '—'}</TableCell>
                          <TableCell>{secondsLabel(attempt.timeSpentSeconds)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{dateLabel(attempt.submittedAt || attempt.startedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader><CardTitle className="text-base">Session visibility</CardTitle></CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">No canonical sessions are recorded for this student.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Device</TableHead><TableHead>State</TableHead><TableHead>Masked IP</TableHead><TableHead>Created</TableHead><TableHead>Expires</TableHead><TableHead>User agent</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {sessions.map((sessionRow) => (
                        <TableRow key={sessionRow.id}>
                          <TableCell><div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-muted-foreground" />{sessionRow.deviceName || 'Unknown device'}</div></TableCell>
                          <TableCell><StatusBadge tone={sessionRow.state === 'active' ? 'success' : sessionRow.state === 'revoked' ? 'destructive' : 'neutral'}>{titleCase(sessionRow.state)}</StatusBadge></TableCell>
                          <TableCell className="font-mono text-xs">{sessionRow.maskedIpAddress || '—'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{dateLabel(sessionRow.createdAt)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{dateLabel(sessionRow.expiresAt)}</TableCell>
                          <TableCell className="max-w-[320px] truncate text-xs text-muted-foreground" title={sessionRow.userAgent || undefined}>{sessionRow.userAgent || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">IP addresses are masked server-side. Refresh tokens are never returned by this API.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader><CardTitle className="text-base">Account timeline</CardTitle></CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">No canonical timeline events are available.</p>
              ) : (
                <div className="space-y-0">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4 pb-5 last:pb-0">
                      {index < timeline.length - 1 && <div className="absolute left-[7px] top-4 h-full w-px bg-border" />}
                      <div className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-background bg-primary" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{titleCase(event.type)} · {dateLabel(event.occurredAt)}</p>
                        {event.detail && <p className="mt-1 text-xs text-muted-foreground">{event.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={Boolean(pendingAction)} onOpenChange={(open) => {
        if (!open && !profile.mutating) {
          setPendingAction(null);
          setReason('');
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {pendingCopy && <pendingCopy.icon className="h-5 w-5" />}
              {pendingCopy?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>{pendingCopy?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="student-operation-reason">Operational reason</Label>
            <Textarea
              id="student-operation-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this account operation is required…"
              rows={4}
              maxLength={500}
              disabled={profile.mutating}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>At least 12 characters. This reason is stored in the audit event.</span>
              <span>{normalizedReason.length}/500</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={profile.mutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={profile.mutating || normalizedReason.length < 12}
              className={cn(
                pendingAction !== 'reactivate' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              )}
              onClick={(event) => {
                event.preventDefault();
                void submitAction();
              }}
            >
              {profile.mutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pendingCopy?.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
