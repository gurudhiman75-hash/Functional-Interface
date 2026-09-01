import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, LockKeyhole, RotateCcw, ShieldCheck } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  approveDailyMasterPack,
  getDailyMasterPackApprovalState,
  revokeDailyMasterPackApproval,
  type DailyMasterPackApprovalState,
} from '@/features/current-affairs/production-ops-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

function fmt(value: string | null | undefined) {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function CurrentAffairsMasterPackApprovalCard({ targetDate }: { targetDate: string }) {
  const { hasPermission } = useAdminPermissions();
  const canApprove = hasPermission('content.questions.update');
  const [state, setState] = useState<DailyMasterPackApprovalState | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<'approve' | 'revoke' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await getDailyMasterPackApprovalState(targetDate);
      setState(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load master-pack approval state.');
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => { void refresh(); }, [refresh]);

  const approve = async () => {
    if (reason.trim().length < 8) {
      showToast.error('Editorial reason required', 'Enter at least 8 characters explaining this approval decision.');
      return;
    }
    setActing('approve');
    try {
      const result = await approveDailyMasterPack(targetDate, reason.trim());
      showToast.success('Canonical master pack approved', `${result.publicCode} locked EN/HI/PA artifacts. Learner publication remains off.`);
      setReason('');
      await refresh();
    } catch (caught) {
      showToast.error('Master-pack approval failed', caught instanceof Error ? caught.message : 'Unable to approve canonical master pack.');
    } finally {
      setActing(null);
    }
  };

  const revoke = async () => {
    const active = state?.candidate.activeApproval;
    if (!active) return;
    if (reason.trim().length < 8) {
      showToast.error('Revocation reason required', 'Enter at least 8 characters explaining why the approval is being returned to review.');
      return;
    }
    setActing('revoke');
    try {
      await revokeDailyMasterPackApproval(active.id, reason.trim());
      showToast.success('Approval revoked', 'The three canonical language packs were returned to review. No learner publication was changed.');
      setReason('');
      await refresh();
    } catch (caught) {
      showToast.error('Approval revocation failed', caught instanceof Error ? caught.message : 'Unable to revoke master-pack approval.');
    } finally {
      setActing(null);
    }
  };

  if (loading && !state) {
    return <Card><CardContent className="flex items-center gap-2 p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Checking canonical master-pack editorial authority…</CardContent></Card>;
  }

  if (!state) {
    return <Card className="border-destructive/25"><CardContent className="p-5 text-sm text-destructive">{error ?? 'Canonical master-pack approval state is unavailable.'}</CardContent></Card>;
  }

  const { candidate } = state;
  const active = candidate.activeApproval;
  const ready = candidate.readiness.ready;
  const packCount = candidate.packs.length;

  return (
    <Card className={active ? 'border-success/30' : ready ? 'border-primary/30' : 'border-warning/30'}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Canonical master-pack editorial approval</span>
          {active
            ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success"><LockKeyhole className="mr-1 h-3 w-3" />approved · V{active.approvalVersion}</Badge>
            : <Badge variant="outline" className={ready ? 'border-primary/30 text-primary' : 'border-warning/30 text-warning'}>{ready ? 'ready for approval' : 'blocked'}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {(['en', 'hi', 'pa'] as const).map((language) => {
            const pack = candidate.packs.find((item) => item.language === language);
            return <div key={language} className="rounded-lg border p-3 text-sm"><div className="flex items-center justify-between"><span className="font-medium">{language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}</span>{pack ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}</div><p className="mt-1 text-xs text-muted-foreground">{pack ? `${pack.eventCount} events · ${pack.status}` : 'not materialized'}</p></div>;
          })}
        </div>

        {active ? <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-sm"><p className="font-medium text-success">{active.publicCode}</p><p className="mt-1 text-muted-foreground">Approved {fmt(active.approvedAt)}. The three canonical artifacts are immutable while this approval is active.</p><p className="mt-1 text-xs text-muted-foreground">Approval does not publish the linked learning resources; they remain draft until a separate learner-publication authority exists.</p></div> : <div className="rounded-lg border p-3 text-sm"><p className="font-medium">Approval gate</p><p className="mt-1 text-muted-foreground">{packCount}/3 language packs · {candidate.currentEligibleEventIds.length} current eligible events · census {candidate.census?.status ?? 'missing'} ({candidate.census?.coverageConfidenceScore ?? 0}%).</p><p className="mt-1 text-xs text-muted-foreground">The server re-checks exact event-ID parity, current eligibility, verification, accepted authoring/localizations, factual conflicts and payload integrity at the instant of approval.</p></div>}

        {!active && candidate.readiness.blockers.length > 0 ? <div className="space-y-2">{candidate.readiness.blockers.slice(0, 6).map((blocker) => <p key={blocker} className="rounded-md border border-warning/20 bg-warning/5 p-2 text-sm text-warning">{blocker}</p>)}</div> : null}
        {candidate.readiness.warnings.map((warning) => <p key={warning} className="text-xs text-warning">{warning}</p>)}

        {canApprove ? <div className="space-y-2 border-t pt-4"><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder={active ? 'Reason for returning this approved master pack to editorial review…' : 'Editorial approval reason…'} rows={3} disabled={acting !== null} /><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">Manual editorial authority only · minimum 8 characters · learner publication remains disabled.</p>{active ? <Button variant="outline" onClick={() => void revoke()} disabled={acting !== null}>{acting === 'revoke' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}Return to review</Button> : <Button onClick={() => void approve()} disabled={!ready || acting !== null}>{acting === 'approve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}Approve & lock EN/HI/PA</Button>}</div></div> : <p className="border-t pt-3 text-xs text-muted-foreground">You have read access. `content.questions.update` is required for editorial approval or revocation.</p>}

        {state.history.length > 0 ? <div className="border-t pt-3"><p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Approval history</p>{state.history.slice(0, 3).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs"><span>{item.publicCode} · {fmt(item.approvedAt)}</span><Badge variant="outline">{item.status}</Badge></div>)}</div> : null}
      </CardContent>
    </Card>
  );
}
