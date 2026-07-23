import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clipboard, ExternalLink, Loader2, RefreshCw, RotateCcw, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  getAdminRequestFailures,
  performRequestFailureAction,
  type AdminRequestFailure,
} from '@/features/system-health/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function statusTone(statusCode: number): string {
  if (statusCode >= 500) return 'border-destructive/40 bg-destructive/10 text-destructive';
  if (statusCode === 409 || statusCode === 422) return 'border-warning/40 bg-warning/10 text-warning';
  return 'border-border bg-muted text-muted-foreground';
}

function workspaceForPath(path: string): string | null {
  if (path.includes('/admin/question-studio')) return '/content/questions/generate';
  if (path.includes('/admin/questions')) return '/content/questions';
  if (path.includes('/admin/tests')) return '/tests';
  if (path.includes('/admin/test-qa')) return '/tests/qa';
  if (path.includes('/admin/test-series')) return '/tests/series';
  if (path.includes('/admin/test-blueprints')) return '/tests/blueprints';
  if (path.includes('/admin/taxonomy')) return '/content/taxonomy';
  if (path.includes('/admin/content-review')) return '/content/review';
  if (path.includes('/admin/students')) return '/users/students';
  if (path.includes('/admin/access-control')) return '/users/team';
  if (path.includes('/admin/translations')) return '/settings/languages';
  return null;
}

function copyText(label: string, value: string) {
  void navigator.clipboard.writeText(value).then(
    () => showToast.success(`${label} copied`, value),
    () => showToast.error('Copy failed', 'Your browser blocked clipboard access.'),
  );
}

export function RequestFailuresPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasPermission } = useAdminPermissions();
  const canManage = hasPermission('jobs.manage');
  const [failures, setFailures] = useState<AdminRequestFailure[]>([]);
  const [retention, setRetention] = useState('');
  const [storage, setStorage] = useState('');
  const [generatedAt, setGeneratedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(() => searchParams.get('correlation') ?? '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [resolutionFilter, setResolutionFilter] = useState('unresolved');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminRequestFailures(500);
      setFailures(response.failures);
      setRetention(response.retention);
      setStorage(response.storage);
      setGeneratedAt(response.generatedAt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load recent request failures.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const correlation = searchParams.get('correlation');
    if (correlation) {
      setSearch(correlation);
      setResolutionFilter('all');
    }
  }, [searchParams]);

  const methods = useMemo(() => Array.from(new Set(failures.map((failure) => failure.method))).sort(), [failures]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return failures.filter((failure) => {
      if (statusFilter === '4xx' && (failure.statusCode < 400 || failure.statusCode >= 500)) return false;
      if (statusFilter === '5xx' && failure.statusCode < 500) return false;
      if (methodFilter !== 'all' && failure.method !== methodFilter) return false;
      if (resolutionFilter === 'unresolved' && failure.resolvedAt) return false;
      if (resolutionFilter === 'resolved' && !failure.resolvedAt) return false;
      if (resolutionFilter === 'acknowledged' && (!failure.acknowledgedAt || failure.resolvedAt)) return false;
      if (!query) return true;
      return [failure.path, failure.code ?? '', failure.message, failure.correlationId, failure.actorUserId ?? '', String(failure.statusCode)]
        .join(' ').toLowerCase().includes(query);
    });
  }, [failures, methodFilter, resolutionFilter, search, statusFilter]);

  const counts = useMemo(() => ({
    total: failures.length,
    unresolved: failures.filter((entry) => !entry.resolvedAt).length,
    server: failures.filter((entry) => entry.statusCode >= 500 && !entry.resolvedAt).length,
  }), [failures]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const performAction = async (failure: AdminRequestFailure, action: 'acknowledge' | 'resolve' | 'reopen') => {
    const note = notes[failure.id]?.trim() || '';
    if (action === 'resolve' && note.length < 4) {
      showToast.error('Resolution note required', 'Enter at least four characters describing the fix or disposition.');
      return;
    }
    setMutatingId(failure.id);
    try {
      await performRequestFailureAction({ failureId: failure.id, action, note: note || undefined });
      showToast.success(
        action === 'resolve' ? 'Failure resolved' : action === 'reopen' ? 'Failure reopened' : 'Failure acknowledged',
        failure.correlationId,
      );
      setNotes((current) => ({ ...current, [failure.id]: '' }));
      await load();
    } catch (caught) {
      showToast.error('Update failed', caught instanceof Error ? caught.message : 'Unable to update the request failure.');
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Request Failures"
        description="Persistent failed admin API requests with correlation IDs, grouping signals, ownership and resolution workflow."
        icon={<AlertTriangle className="h-5 w-5" />}
        actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs uppercase text-muted-foreground">Stored</p><p className="mt-1 text-2xl font-semibold">{counts.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase text-muted-foreground">Unresolved</p><p className="mt-1 text-2xl font-semibold">{counts.unresolved}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase text-muted-foreground">Unresolved 5xx</p><p className="mt-1 text-2xl font-semibold text-destructive">{counts.server}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 xl:grid-cols-[minmax(0,1fr)_160px_160px_180px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search endpoint, error code, message, actor or correlation ID" className="pl-9" /></div>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="4xx">4xx client errors</option><option value="5xx">5xx server errors</option></select>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)}><option value="all">All methods</option>{methods.map((method) => <option key={method} value={method}>{method}</option>)}</select>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={resolutionFilter} onChange={(event) => setResolutionFilter(event.target.value)}><option value="all">All lifecycle states</option><option value="unresolved">Unresolved</option><option value="acknowledged">Acknowledged</option><option value="resolved">Resolved</option></select>
        </CardContent>
      </Card>

      {error ? (
        <Card><CardContent className="flex min-h-52 flex-col items-center justify-center text-center"><AlertTriangle className="h-8 w-8 text-destructive" /><p className="mt-3 text-sm">{error}</p><Button className="mt-4" onClick={() => void load()}>Retry</Button></CardContent></Card>
      ) : loading ? (
        <Card><CardContent className="flex min-h-52 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading persisted failures…</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">No request failures match the current filters.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((failure) => {
            const expanded = expandedIds.has(failure.id);
            const workspace = workspaceForPath(failure.path);
            const details = JSON.stringify(failure, null, 2);
            return (
              <Card key={failure.id} className={failure.resolvedAt ? 'opacity-70' : failure.statusCode >= 500 ? 'border-destructive/30' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={statusTone(failure.statusCode)}>{failure.statusCode}</Badge>
                        <Badge variant="outline">{failure.method}</Badge>
                        {failure.code && <Badge variant="secondary">{failure.code}</Badge>}
                        {failure.resolvedAt ? <Badge className="bg-success/10 text-success">Resolved</Badge> : failure.acknowledgedAt ? <Badge className="bg-warning/10 text-warning">Acknowledged</Badge> : <Badge variant="destructive">Unresolved</Badge>}
                        {failure.occurrenceCount > 1 && <Badge variant="outline">Repeated {failure.occurrenceCount}×</Badge>}
                      </div>
                      <CardTitle className="mt-3 break-all text-sm font-semibold">{failure.path}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">{failure.message}</p>
                      {failure.resolutionNote && <p className="mt-2 rounded-md bg-success/5 p-2 text-xs text-success">Resolution: {failure.resolutionNote}</p>}
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground lg:text-right"><p>{formatTime(failure.occurredAt)}</p><p className="mt-1">{failure.durationMs} ms</p><p className="mt-1">First seen {formatTime(failure.firstSeenAt)}</p></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyText('Correlation ID', failure.correlationId)}><Clipboard className="mr-1.5 h-3.5 w-3.5" /> Copy correlation ID</Button>
                    <Button size="sm" variant="outline" onClick={() => copyText('Technical details', details)}><Clipboard className="mr-1.5 h-3.5 w-3.5" /> Copy details</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleExpanded(failure.id)}>{expanded ? 'Hide details' : 'Show details'}</Button>
                    {workspace && <Button size="sm" onClick={() => navigate(workspace)}><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open workspace</Button>}
                  </div>
                  {canManage && !failure.resolvedAt && (
                    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                      <Textarea value={notes[failure.id] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [failure.id]: event.target.value }))} rows={1} placeholder="Resolution note" />
                      {!failure.acknowledgedAt && <Button variant="outline" disabled={mutatingId === failure.id} onClick={() => void performAction(failure, 'acknowledge')}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Acknowledge</Button>}
                      <Button disabled={mutatingId === failure.id} onClick={() => void performAction(failure, 'resolve')}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Resolve</Button>
                    </div>
                  )}
                  {canManage && failure.resolvedAt && <Button size="sm" variant="outline" disabled={mutatingId === failure.id} onClick={() => void performAction(failure, 'reopen')}><RotateCcw className="mr-1.5 h-4 w-4" /> Reopen</Button>}
                  <p className="font-mono text-[11px] text-muted-foreground">Correlation: {failure.correlationId}</p>
                  {expanded && <pre className="max-h-80 overflow-auto rounded-lg border bg-muted/30 p-3 text-xs">{details}</pre>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{retention || 'Persistent retention with memory fallback.'}{storage ? ` Storage: ${storage}.` : ''}{generatedAt ? ` Last refreshed ${formatTime(generatedAt)}.` : ''}</p>
    </div>
  );
}
