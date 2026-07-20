import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  GitCompareArrows,
  MessageSquare,
  Reply,
  RotateCcw,
  Send,
  UserCheck,
  XCircle,
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
import type {
  ContentReviewItem,
  ReviewComment,
  ReviewReviewer,
} from '@/features/content-review/api';
import {
  changedReviewFields,
  hasVersionComparison,
  reviewItemDifficulty,
  reviewItemExam,
  reviewItemExplanation,
  reviewItemOptions,
  reviewItemStem,
  reviewItemTopic,
} from '@/features/content-review/item-model';
import { formatReviewAge, reviewItemAgeBand } from '@/features/content-review/queue-model';
import { cn } from '@/lib/utils';

export type ReviewDecision = 'approve' | 'needs_fix' | 'reject' | 'submit_review';

interface Props {
  item: ContentReviewItem;
  reviewers: ReviewReviewer[];
  mutating: boolean;
  canReview: boolean;
  actionReason: string;
  onActionReasonChange: (value: string) => void;
  onDecision: (decision: ReviewDecision) => Promise<void>;
  onAssign: (reviewerUserId: string | null, reason: string) => Promise<void>;
  onComment: (message: string, parentCommentId: string | null) => Promise<void>;
  onResolveComment: (commentId: string, resolved: boolean) => Promise<void>;
}

function statusTone(status: string) {
  if (status === 'approved') return 'success' as const;
  if (status === 'needs_fix') return 'warning' as const;
  if (status === 'rejected') return 'destructive' as const;
  return 'info' as const;
}

function ageClass(item: ContentReviewItem) {
  const band = reviewItemAgeBand(item);
  if (band === 'overdue') return 'border-destructive/30 bg-destructive/5 text-destructive';
  if (band === 'warning') return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-success/30 bg-success/5 text-success';
}

export function ContentReviewDetail(props: Props) {
  const { item, reviewers, mutating, canReview } = props;
  const [compare, setCompare] = useState(false);
  const [reviewerUserId, setReviewerUserId] = useState(item.collaboration.assignment.reviewerUserId ?? 'unassigned');
  const [assignmentReason, setAssignmentReason] = useState('Assign editorial ownership');
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<ReviewComment | null>(null);

  useEffect(() => {
    setReviewerUserId(item.collaboration.assignment.reviewerUserId ?? 'unassigned');
    setCommentText('');
    setReplyTo(null);
    setCompare(false);
  }, [item.key, item.collaboration.assignment.reviewerUserId]);

  const comments = useMemo(
    () => [...item.collaboration.comments].sort(
      (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    ),
    [item.collaboration.comments],
  );
  const changedFields = changedReviewFields(item);

  const saveAssignment = async () => {
    try {
      await props.onAssign(reviewerUserId === 'unassigned' ? null : reviewerUserId, assignmentReason);
      showToast.success('Review ownership updated', reviewerUserId === 'unassigned' ? 'Assignment cleared.' : 'Reviewer assigned.');
    } catch (caught) {
      showToast.error('Assignment failed', caught instanceof Error ? caught.message : 'Unable to update ownership.');
    }
  };

  const addComment = async () => {
    if (commentText.trim().length < 2) return;
    try {
      await props.onComment(commentText.trim(), replyTo?.id ?? null);
      setCommentText('');
      setReplyTo(null);
      showToast.success('Comment added', 'The discussion is recorded in immutable review history.');
    } catch (caught) {
      showToast.error('Comment failed', caught instanceof Error ? caught.message : 'Unable to add comment.');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.publicCode}</span>
                <StatusBadge tone={statusTone(item.status)} dot>{item.status.replace(/_/g, ' ')}</StatusBadge>
                <Badge variant="outline">{item.source}</Badge>
                <Badge variant="outline" className={ageClass(item)}>{formatReviewAge(item)}</Badge>
                {item.collaboration.openCommentCount > 0 && (
                  <Badge variant="outline" className="border-warning/30 text-warning">
                    {item.collaboration.openCommentCount} open comment(s)
                  </Badge>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-7">{reviewItemStem(item) || 'Question stem unavailable'}</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                {reviewItemExam(item)} · {reviewItemTopic(item)} · {reviewItemDifficulty(item)} · version {item.versionNumber}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasVersionComparison(item) && (
                <Button variant={compare ? 'default' : 'outline'} size="sm" onClick={() => setCompare((value) => !value)}>
                  <GitCompareArrows className="mr-1.5 h-4 w-4" /> Compare versions
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link to={item.entityType === 'question' ? `/content/questions/${item.entityId}` : '/content/questions/generate'}>
                  <ExternalLink className="mr-1.5 h-4 w-4" /> Open source workspace
                </Link>
              </Button>
            </div>
          </div>
          {changedFields.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Changed from previous version:</span>
              {changedFields.map((field) => <Badge key={field} variant="secondary">{field}</Badge>)}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {compare && hasVersionComparison(item)
            ? <VersionComparison item={item} />
            : <VersionContent item={item} />}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserCheck className="h-4 w-4" /> Ownership and decision</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="Assigned reviewer">
                <Select value={reviewerUserId} onValueChange={setReviewerUserId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {reviewers.map((reviewer) => (
                      <SelectItem key={reviewer.id} value={reviewer.id}>{reviewer.displayName || reviewer.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Button variant="outline" disabled={mutating || !canReview || assignmentReason.trim().length < 4} onClick={() => void saveAssignment()}>
                Save owner
              </Button>
            </div>
            <Field label="Assignment reason"><Input value={assignmentReason} onChange={(event) => setAssignmentReason(event.target.value)} /></Field>
            <div className="border-t pt-4">
              <Field label="Decision reason">
                <Textarea value={props.actionReason} onChange={(event) => props.onActionReasonChange(event.target.value)} placeholder="Required for needs-fix or rejection. Describe the exact editorial issue." className="min-h-24" />
              </Field>
              <DecisionButtons item={item} disabled={mutating || !canReview} reason={props.actionReason} onDecision={props.onDecision} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4" /> Review discussion</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {comments.length === 0
                ? <div className="rounded-lg border border-dashed p-5 text-center text-xs text-muted-foreground">No review comments yet.</div>
                : comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} disabled={mutating || !canReview} onReply={() => setReplyTo(comment)} onResolve={() => void props.onResolveComment(comment.id, !comment.resolved)} />
                ))}
            </div>
            {replyTo && (
              <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs">
                <span>Replying to {replyTo.actorName}: {replyTo.message.slice(0, 70)}</span>
                <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>Cancel</Button>
              </div>
            )}
            <Field label={replyTo ? 'Reply' : 'New comment'}>
              <Textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Record a precise editorial issue, verification note or resolution context." className="min-h-24" />
            </Field>
            <Button disabled={mutating || !canReview || commentText.trim().length < 2} onClick={() => void addComment()}>
              <Send className="mr-1.5 h-4 w-4" /> Add comment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DecisionButtons({ item, disabled, reason, onDecision }: {
  item: ContentReviewItem;
  disabled: boolean;
  reason: string;
  onDecision: (decision: ReviewDecision) => Promise<void>;
}) {
  if (item.entityType === 'question' && (item.status === 'draft' || item.status === 'generated')) {
    return <Button className="mt-3" disabled={disabled} onClick={() => void onDecision('submit_review')}><ChevronRight className="mr-1.5 h-4 w-4" /> Submit review <kbd className="ml-2 text-[10px] opacity-70">S</kbd></Button>;
  }
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button disabled={disabled} onClick={() => void onDecision('approve')}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve <kbd className="ml-2 text-[10px] opacity-70">A</kbd></Button>
      <Button variant="outline" disabled={disabled || !reason.trim()} onClick={() => void onDecision('needs_fix')}><RotateCcw className="mr-1.5 h-4 w-4" /> Needs fix <kbd className="ml-2 text-[10px] opacity-70">F</kbd></Button>
      {item.entityType === 'generation_item' && <Button variant="destructive" disabled={disabled || !reason.trim()} onClick={() => void onDecision('reject')}><XCircle className="mr-1.5 h-4 w-4" /> Reject <kbd className="ml-2 text-[10px] opacity-70">X</kbd></Button>}
    </div>
  );
}

function VersionContent({ item, previous = false }: { item: ContentReviewItem; previous?: boolean }) {
  const options = reviewItemOptions(item, previous);
  return (
    <div className="space-y-5">
      <Section label="Stem"><p className="whitespace-pre-wrap text-sm leading-7">{reviewItemStem(item, previous) || 'Unavailable'}</p></Section>
      <Section label="Options"><div className="grid gap-2 sm:grid-cols-2">{options.map((option, index) => <div key={`${previous}-${index}`} className={cn('rounded-md border px-3 py-2 text-xs', option.isCorrect && 'border-success/40 bg-success/5 text-success')}><span className="mr-2 font-mono font-bold">{option.key ?? String.fromCharCode(65 + index)}.</span>{option.text}</div>)}</div></Section>
      <Section label="Explanation"><p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{reviewItemExplanation(item, previous) || 'Unavailable'}</p></Section>
    </div>
  );
}

function VersionComparison({ item }: { item: ContentReviewItem }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl border bg-muted/20 p-4"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold">Previous version</p><Badge variant="outline">v{item.previousVersionNumber}</Badge></div><VersionContent item={item} previous /></div>
      <div className="rounded-xl border border-primary/25 bg-primary/[0.03] p-4"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold">Current version</p><Badge>v{item.versionNumber}</Badge></div><VersionContent item={item} /></div>
    </div>
  );
}

function CommentCard({ comment, onReply, onResolve, disabled }: { comment: ReviewComment; onReply: () => void; onResolve: () => void; disabled: boolean }) {
  return (
    <div className={cn('rounded-lg border p-3 text-xs', comment.parentCommentId && 'ml-6', comment.resolved && 'bg-muted/30 opacity-75')}>
      <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{comment.actorName}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p></div><Badge variant="outline" className={comment.resolved ? 'border-success/30 text-success' : 'border-warning/30 text-warning'}>{comment.resolved ? 'Resolved' : 'Open'}</Badge></div>
      <p className="mt-2 whitespace-pre-wrap leading-5">{comment.message}</p>
      <div className="mt-2 flex gap-1"><Button size="sm" variant="ghost" disabled={disabled} onClick={onReply}><Reply className="mr-1 h-3.5 w-3.5" /> Reply</Button><Button size="sm" variant="ghost" disabled={disabled} onClick={onResolve}>{comment.resolved ? 'Reopen' : 'Resolve'}</Button></div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>{children}</div>;
}
