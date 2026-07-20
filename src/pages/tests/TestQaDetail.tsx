import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  GitCompareArrows,
  MessageSquare,
  Reply,
  Rocket,
  RotateCcw,
  Send,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';

import { StatusBadge } from '@/components/shared/StatusBadge';
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
import type { LiveTestDetail, TestLifecycleAction } from '@/features/test-builder/api';
import type {
  TestQaCollaboration,
  TestQaComment,
  TestQaComparisonResponse,
  TestQaReviewer,
} from '@/features/test-qa/api';
import {
  buildTestQaChecks,
  formatTestQaAge,
  isTestQaReady,
  type TestQaQueueItem,
} from '@/features/test-qa/model';
import { cn } from '@/lib/utils';

interface Props {
  summary: TestQaQueueItem;
  detail: LiveTestDetail;
  collaboration: TestQaCollaboration | null;
  reviewers: TestQaReviewer[];
  comparison: TestQaComparisonResponse | null;
  comparisonLoading: boolean;
  mutating: boolean;
  canUpdate: boolean;
  canApprove: boolean;
  canPublish: boolean;
  onLoadComparison: () => Promise<unknown>;
  onAssign: (reviewerUserId: string | null, reason: string) => Promise<unknown>;
  onComment: (message: string, parentCommentId: string | null) => Promise<unknown>;
  onResolveComment: (commentId: string, resolved: boolean, reason?: string) => Promise<unknown>;
  onTransition: (
    action: TestLifecycleAction,
    input: { reason?: string; scheduledAt?: string; closesAt?: string },
  ) => Promise<unknown>;
}

function statusTone(status: string) {
  if (status === 'live' || status === 'qa_approved') return 'success' as const;
  if (status === 'needs_fix') return 'warning' as const;
  if (status === 'under_qa' || status === 'scheduled') return 'info' as const;
  return 'neutral' as const;
}

export function TestQaDetail(props: Props) {
  const { summary, detail, collaboration, reviewers, comparison, mutating } = props;
  const [reviewerUserId, setReviewerUserId] = useState(collaboration?.assignment.reviewerUserId ?? 'unassigned');
  const [assignmentReason, setAssignmentReason] = useState('Assign pre-publication QA ownership');
  const [decisionReason, setDecisionReason] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<TestQaComment | null>(null);
  const [resolutionReason, setResolutionReason] = useState('Issue verified in the current test version');
  const [scheduledAt, setScheduledAt] = useState('');
  const [closesAt, setClosesAt] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setReviewerUserId(collaboration?.assignment.reviewerUserId ?? 'unassigned');
    setDecisionReason('');
    setCommentText('');
    setReplyTo(null);
    setExpandedSections(new Set(detail.sections.slice(0, 1).map((section) => section.id)));
  }, [summary.id, collaboration?.assignment.reviewerUserId, detail.sections]);

  const checks = useMemo(() => buildTestQaChecks(detail, collaboration), [collaboration, detail]);
  const ready = isTestQaReady(checks);
  const blockers = checks.filter((check) => !check.passed && check.severity === 'blocker');
  const warnings = checks.filter((check) => !check.passed && check.severity === 'warning');
  const comments = [...(collaboration?.comments ?? [])].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );

  const assign = async () => {
    try {
      await props.onAssign(reviewerUserId === 'unassigned' ? null : reviewerUserId, assignmentReason);
      showToast.success('QA ownership updated', reviewerUserId === 'unassigned' ? 'Reviewer cleared.' : 'Reviewer assigned.');
    } catch (caught) {
      showToast.error('Assignment failed', caught instanceof Error ? caught.message : 'Unable to update QA ownership.');
    }
  };

  const addComment = async () => {
    if (commentText.trim().length < 2) return;
    try {
      await props.onComment(commentText.trim(), replyTo?.id ?? null);
      setCommentText('');
      setReplyTo(null);
      showToast.success('QA issue recorded', 'The comment is now part of the immutable QA history.');
    } catch (caught) {
      showToast.error('Comment failed', caught instanceof Error ? caught.message : 'Unable to add QA comment.');
    }
  };

  const resolve = async (comment: TestQaComment) => {
    try {
      await props.onResolveComment(comment.id, !comment.resolved, resolutionReason);
      showToast.success(comment.resolved ? 'Issue reopened' : 'Issue resolved', 'The QA history has been updated.');
    } catch (caught) {
      showToast.error('Resolution failed', caught instanceof Error ? caught.message : 'Unable to update the comment.');
    }
  };

  const transition = async (action: TestLifecycleAction, input: { reason?: string; scheduledAt?: string; closesAt?: string } = {}) => {
    try {
      await props.onTransition(action, input);
      setDecisionReason('');
      showToast.success('Test workflow updated', `${summary.publicCode} moved through ${action.replace(/-/g, ' ')}.`);
    } catch (caught) {
      showToast.error('Test QA action failed', caught instanceof Error ? caught.message : 'Unable to update the test.');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold">{summary.publicCode}</span>
                <StatusBadge tone={statusTone(detail.test.status)} dot>{detail.test.status.replace(/_/g, ' ')}</StatusBadge>
                <Badge variant="outline">v{detail.currentVersion?.versionNumber ?? summary.versionNumber ?? '—'}</Badge>
                <Badge variant="outline">{formatTestQaAge(summary)}</Badge>
                <Badge variant="outline" className={ready ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive'}>
                  {ready ? 'QA gate ready' : `${blockers.length} blocker(s)`}
                </Badge>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{detail.currentVersion?.title || summary.title || summary.publicCode}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {detail.test.examFamilyName} · {detail.test.examName} · {detail.sections.length} sections · {detail.currentVersion?.questionCount ?? summary.questionCount} questions · {detail.currentVersion?.totalMarks ?? summary.totalMarks} marks
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={props.comparisonLoading} onClick={() => void props.onLoadComparison()}>
                <GitCompareArrows className="mr-1.5 h-4 w-4" /> {props.comparisonLoading ? 'Loading diff…' : 'Compare versions'}
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={`/tests/${summary.id}`}><ExternalLink className="mr-1.5 h-4 w-4" /> Open test detail</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {comparison && <VersionDelta comparison={comparison} />}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" /> Automated QA gate</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Server validation, collaboration state and content checks for the current immutable test version.</p>
                </div>
                <Badge variant="outline">{checks.filter((check) => check.passed).length}/{checks.length} passed</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              {checks.map((check) => (
                <div key={`${check.code}-${check.message}`} className={cn(
                  'rounded-lg border p-3 text-xs',
                  check.passed && 'border-success/25 bg-success/5',
                  !check.passed && check.severity === 'blocker' && 'border-destructive/30 bg-destructive/5',
                  !check.passed && check.severity === 'warning' && 'border-warning/30 bg-warning/5',
                )}>
                  <div className="flex items-start gap-2">
                    {check.passed
                      ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      : <AlertTriangle className={cn('mt-0.5 h-4 w-4 shrink-0', check.severity === 'blocker' ? 'text-destructive' : 'text-warning')} />}
                    <div><p className="font-semibold">{check.label}</p><p className="mt-1 leading-5 text-muted-foreground">{check.message}</p></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4" /> Candidate-content preview</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {detail.sections.map((section) => {
                const expanded = expandedSections.has(section.id);
                return (
                  <div key={section.id} className="rounded-xl border">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 p-4 text-left"
                      onClick={() => setExpandedSections((current) => {
                        const next = new Set(current);
                        next.has(section.id) ? next.delete(section.id) : next.add(section.id);
                        return next;
                      })}
                    >
                      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{section.name}</p><p className="text-xs text-muted-foreground">{section.questions.length} questions · {section.durationSeconds ? `${Math.round(section.durationSeconds / 60)} minutes` : 'shared timer'}</p></div>
                    </button>
                    {expanded && (
                      <div className="divide-y border-t">
                        {section.questions.map((question) => (
                          <div key={question.questionVersionId} className="p-4">
                            <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-muted-foreground">{question.position}. {question.publicCode}</span><Badge variant="outline" className="text-[10px]">{question.difficulty}</Badge><Badge variant="outline" className="text-[10px]">{question.marks} / -{question.negativeMarks}</Badge></div>
                            <p className="mt-2 text-sm leading-6">{question.stem}</p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <div key={option.id} className={cn('rounded-md border px-3 py-2 text-xs', option.isCorrect && 'border-success/40 bg-success/5 text-success')}><span className="mr-2 font-bold">{option.key}.</span>{option.text}</div>)}</div>
                            <p className="mt-3 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {question.explanation || 'Missing'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserCheck className="h-4 w-4" /> Ownership and workflow</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <Field label="Assigned QA reviewer">
                  <Select value={reviewerUserId} onValueChange={setReviewerUserId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {reviewers.map((reviewer) => <SelectItem key={reviewer.id} value={reviewer.id}>{reviewer.displayName || reviewer.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Button variant="outline" disabled={mutating || !props.canApprove || assignmentReason.trim().length < 4} onClick={() => void assign()}>Save owner</Button>
              </div>
              <Field label="Assignment reason"><Input value={assignmentReason} onChange={(event) => setAssignmentReason(event.target.value)} /></Field>
              <div className="border-t pt-4">
                <Field label="Decision reason"><Textarea value={decisionReason} onChange={(event) => setDecisionReason(event.target.value)} placeholder="Required when returning the test for fixes." className="min-h-20" /></Field>
                <LifecycleActions
                  status={detail.test.status}
                  ready={ready}
                  disabled={mutating}
                  canUpdate={props.canUpdate}
                  canApprove={props.canApprove}
                  canPublish={props.canPublish}
                  reason={decisionReason}
                  scheduledAt={scheduledAt}
                  closesAt={closesAt}
                  onScheduledAtChange={setScheduledAt}
                  onClosesAtChange={setClosesAt}
                  onTransition={transition}
                />
              </div>
              {warnings.length > 0 && <p className="text-[11px] text-warning">{warnings.length} non-blocking warning(s) should still be reviewed before release.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4" /> QA issue thread</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {comments.length === 0 ? <div className="rounded-lg border border-dashed p-5 text-center text-xs text-muted-foreground">No QA comments yet.</div> : comments.map((comment) => (
                  <div key={comment.id} className={cn('rounded-lg border p-3 text-xs', comment.resolved && 'bg-muted/30 opacity-75')}>
                    <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{comment.actorName}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p></div><Badge variant="outline" className={comment.resolved ? 'border-success/30 text-success' : 'border-warning/30 text-warning'}>{comment.resolved ? 'Resolved' : 'Open'}</Badge></div>
                    <p className="mt-2 whitespace-pre-wrap leading-5">{comment.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="ghost" disabled={mutating || !props.canUpdate} onClick={() => setReplyTo(comment)}><Reply className="mr-1 h-3.5 w-3.5" /> Reply</Button><Button size="sm" variant="outline" disabled={mutating || !props.canApprove} onClick={() => void resolve(comment)}>{comment.resolved ? <RotateCcw className="mr-1 h-3.5 w-3.5" /> : <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}{comment.resolved ? 'Reopen' : 'Resolve'}</Button></div>
                  </div>
                ))}
              </div>
              {replyTo && <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs"><span className="truncate">Replying to {replyTo.actorName}: {replyTo.message}</span><Button size="icon" variant="ghost" onClick={() => setReplyTo(null)}><X className="h-4 w-4" /></Button></div>}
              <Field label={replyTo ? 'Reply' : 'New QA issue'}><Textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Record a precise issue, expected correction, or verification note." className="min-h-24" /></Field>
              <Field label="Resolution note"><Input value={resolutionReason} onChange={(event) => setResolutionReason(event.target.value)} /></Field>
              <Button disabled={mutating || !props.canUpdate || commentText.trim().length < 2} onClick={() => void addComment()}><Send className="mr-1.5 h-4 w-4" /> Add QA comment</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LifecycleActions({ status, ready, disabled, canUpdate, canApprove, canPublish, reason, scheduledAt, closesAt, onScheduledAtChange, onClosesAtChange, onTransition }: {
  status: string;
  ready: boolean;
  disabled: boolean;
  canUpdate: boolean;
  canApprove: boolean;
  canPublish: boolean;
  reason: string;
  scheduledAt: string;
  closesAt: string;
  onScheduledAtChange: (value: string) => void;
  onClosesAtChange: (value: string) => void;
  onTransition: (action: TestLifecycleAction, input?: { reason?: string; scheduledAt?: string; closesAt?: string }) => Promise<void>;
}) {
  if (status === 'draft' || status === 'content_ready' || status === 'needs_fix') {
    return <Button className="mt-3" disabled={disabled || !canUpdate} onClick={() => void onTransition('submit-qa')}><ChevronRight className="mr-1.5 h-4 w-4" /> Submit to QA</Button>;
  }
  if (status === 'under_qa') {
    return <div className="mt-3 flex flex-wrap gap-2"><Button disabled={disabled || !canApprove || !ready} onClick={() => void onTransition('approve')}><CheckCircle2 className="mr-1.5 h-4 w-4" /> QA approve</Button><Button variant="outline" disabled={disabled || !canApprove || reason.trim().length < 3} onClick={() => void onTransition('needs-fix', { reason })}><RotateCcw className="mr-1.5 h-4 w-4" /> Needs fix</Button></div>;
  }
  if (status === 'qa_approved' || status === 'scheduled') {
    return <div className="mt-3 space-y-3"><div className="grid gap-3 sm:grid-cols-2"><Field label="Schedule time"><Input type="datetime-local" value={scheduledAt} onChange={(event) => onScheduledAtChange(event.target.value)} /></Field><Field label="Optional close time"><Input type="datetime-local" value={closesAt} onChange={(event) => onClosesAtChange(event.target.value)} /></Field></div><div className="flex flex-wrap gap-2"><Button disabled={disabled || !canPublish || !ready} onClick={() => void onTransition('publish', { closesAt: closesAt ? new Date(closesAt).toISOString() : undefined })}><Rocket className="mr-1.5 h-4 w-4" /> Publish now</Button><Button variant="outline" disabled={disabled || !canPublish || !ready || !scheduledAt} onClick={() => void onTransition('schedule', { scheduledAt: new Date(scheduledAt).toISOString(), closesAt: closesAt ? new Date(closesAt).toISOString() : undefined })}><CalendarClock className="mr-1.5 h-4 w-4" /> Schedule</Button><Button variant="outline" disabled={disabled || !canApprove || reason.trim().length < 3} onClick={() => void onTransition('needs-fix', { reason })}><RotateCcw className="mr-1.5 h-4 w-4" /> Reopen QA</Button></div></div>;
  }
  return <p className="mt-3 text-xs text-muted-foreground">This test is {status.replace(/_/g, ' ')}. Use the test detail workspace for post-publication operations.</p>;
}

function VersionDelta({ comparison }: { comparison: TestQaComparisonResponse }) {
  if (!comparison.previous) return <Card><CardContent className="p-4 text-xs text-muted-foreground">This is the first immutable test version; there is no previous version to compare.</CardContent></Card>;
  const changed = Object.entries(comparison.changes).filter(([, value]) => Array.isArray(value) ? value.length > 0 : value === true);
  return <Card className="border-primary/20"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><GitCompareArrows className="h-4 w-4" /> Version {comparison.previous.versionNumber} → {comparison.current.versionNumber}</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{changed.length === 0 ? <Badge variant="outline" className="border-success/30 text-success">No structural changes detected</Badge> : changed.map(([key, value]) => <Badge key={key} variant="outline" className="border-primary/30 text-primary">{key.replace(/([A-Z])/g, ' $1')}{Array.isArray(value) ? ` (${value.length})` : ''}</Badge>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><VersionSummary label="Previous" version={comparison.previous} /><VersionSummary label="Current" version={comparison.current} /></div></CardContent></Card>;
}

function VersionSummary({ label, version }: { label: string; version: TestQaComparisonResponse['current'] }) {
  return <div className="rounded-lg border p-3 text-xs"><p className="font-semibold">{label} · v{version.versionNumber}</p><p className="mt-2 text-muted-foreground">{version.title}</p><p className="mt-1">{version.sectionCount} sections · {version.questionCount} questions · {version.totalMarks} marks · {Math.round(version.durationSeconds / 60)} minutes</p><p className="mt-2 text-[10px] text-muted-foreground">{version.changeReason}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}
