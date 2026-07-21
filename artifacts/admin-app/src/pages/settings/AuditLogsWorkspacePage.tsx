import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Download, ExternalLink, FileDiff, Loader2, Lock, RefreshCw, ScrollText, Search, Server, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { DataTable, type Column } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuditEvents } from '@/features/access-control/useAuditEvents';
import type { AuditEventSummary } from '@/features/access-control/api';

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function actionTone(action: string): 'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'accent' | 'neutral' {
  if (/created|assigned|restored|approved|published/.test(action)) return 'success';
  if (/revoked|suspended|disabled|deleted|rejected/.test(action)) return 'destructive';
  if (/updated|versioned|regenerated/.test(action)) return 'info';
  if (/archived|needs_fix/.test(action)) return 'warning';
  if (/generation|test/.test(action)) return 'primary';
  if (/role|permission/.test(action)) return 'accent';
  return 'neutral';
}

function entityLink(event: AuditEventSummary) {
  const type = event.entityType;
  if (type === 'admin_profile') return `/users/team`;
  if (type === 'admin_role') return `/settings/roles`;
  if (type.includes('question')) return `/content/questions/${event.entityId}`;
  if (type === 'test' || type.includes('test_version')) return `/tests/${event.entityId}`;
  if (type.includes('test_series')) return '/tests/series';
  if (type.includes('taxonomy')) return '/content/taxonomy';
  if (type.includes('blueprint')) return '/tests/blueprints';
  return null;
}

function jsonLabel(value: unknown) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); } catch { return String(value); }
}

export function AuditLogsWorkspacePage() {
  const audit = useAuditEvents();
  const [search, setSearch] = useState('');
  const columns = useMemo<Column<AuditEventSummary>[]>(() => [
    {
      key: 'occurredAt', header: 'Time', className: 'min-w-[170px]',
      cell: (event) => <span className="font-mono text-xs">{dateLabel(event.occurredAt)}</span>,
      sortValue: (event) => event.occurredAt,
    },
    {
      key: 'actor', header: 'Actor',
      cell: (event) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{event.actorName || event.actorType}</p>
          <p className="truncate text-xs text-muted-foreground">{event.actorEmail || event.effectiveRoleKey || 'System event'}</p>
        </div>
      ),
      sortValue: (event) => event.actorName || event.actorType,
    },
    {
      key: 'action', header: 'Action',
      cell: (event) => <StatusBadge tone={actionTone(event.actionKey)}>{event.actionKey}</StatusBadge>,
      sortValue: (event) => event.actionKey,
    },
    {
      key: 'entity', header: 'Entity', hideOnMobile: true,
      cell: (event) => (
        <div className="min-w-0"><p className="text-sm font-medium">{event.entityType}</p><p className="max-w-[160px] truncate font-mono text-[10px] text-muted-foreground">{event.entityId}</p></div>
      ),
      sortValue: (event) => `${event.entityType} ${event.entityId}`,
    },
    {
      key: 'summary', header: 'Summary', hideOnMobile: true, className: 'max-w-[320px]',
      cell: (event) => <span className="line-clamp-2 text-xs text-muted-foreground">{event.summary}</span>,
      sortValue: (event) => event.summary,
    },
    {
      key: 'changes', header: 'Changes', className: 'text-right',
      cell: (event) => <Badge variant="outline"><FileDiff className="mr-1 h-3 w-3" />{event.changeCount}</Badge>,
      sortValue: (event) => event.changeCount,
    },
  ], []);

  const applySearch = () => audit.updateFilters({ search: search.trim() || undefined });
  const exportCsv = async () => {
    try {
      await audit.exportCsv();
      showToast.success('Audit export downloaded');
    } catch (error) {
      showToast.error('Export failed', error instanceof Error ? error.message : 'Unable to export audit events.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Immutable administrative, system and integration activity across canonical ExamTree entities."
        icon={<ScrollText className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void audit.refresh()} disabled={audit.loading}><RefreshCw className="mr-1.5 h-4 w-4" />Refresh</Button>
            <Button variant="outline" size="sm" onClick={() => void exportCsv()} disabled={audit.exporting}>{audit.exporting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />}Export CSV</Button>
          </div>
        }
      />

      <Card className="mb-4 border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div><p className="text-sm font-medium">Audit records are append-only.</p><p className="mt-0.5 text-xs text-muted-foreground">The explorer exposes actor, effective role, entity, reason, metadata and field-level before/after changes. It provides no edit or delete operation.</p></div>
        </CardContent>
      </Card>

      {audit.error && <Card className="mb-4 border-destructive/40"><CardContent className="p-4 text-sm text-destructive">{audit.error}</CardContent></Card>}

      <Card className="mb-4 p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label className="text-xs">Search</Label>
            <div className="mt-1 flex gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && applySearch()} placeholder="Summary, action, entity, actor or ID" /><Button variant="outline" onClick={applySearch}><Search className="h-4 w-4" /></Button></div>
          </div>
          <div><Label className="text-xs">Actor</Label><Select value={audit.filters.actorUserId || 'all'} onValueChange={(value) => audit.updateFilters({ actorUserId: value === 'all' ? undefined : value })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All actors</SelectItem>{audit.facets.actors.map((actor) => <SelectItem key={actor.id} value={actor.id}>{actor.name || actor.email}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs">Effective role</Label><Select value={audit.filters.roleKey || 'all'} onValueChange={(value) => audit.updateFilters({ roleKey: value === 'all' ? undefined : value })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem>{audit.facets.roles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs">Action</Label><Select value={audit.filters.actionKey || 'all'} onValueChange={(value) => audit.updateFilters({ actionKey: value === 'all' ? undefined : value })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All actions</SelectItem>{audit.facets.actions.map((action) => <SelectItem key={action} value={action}>{action}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs">Entity type</Label><Select value={audit.filters.entityType || 'all'} onValueChange={(value) => audit.updateFilters({ entityType: value === 'all' ? undefined : value })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All entities</SelectItem>{audit.facets.entityTypes.map((entity) => <SelectItem key={entity} value={entity}>{entity}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs">From</Label><Input className="mt-1" type="datetime-local" value={audit.filters.from?.slice(0, 16) || ''} onChange={(event) => audit.updateFilters({ from: event.target.value ? new Date(event.target.value).toISOString() : undefined })} /></div>
          <div><Label className="text-xs">To</Label><Input className="mt-1" type="datetime-local" value={audit.filters.to?.slice(0, 16) || ''} onChange={(event) => audit.updateFilters({ to: event.target.value ? new Date(event.target.value).toISOString() : undefined })} /></div>
        </div>
        <div className="mt-3 flex justify-end"><Button variant="ghost" size="sm" onClick={() => { setSearch(''); audit.clearFilters(); }}>Clear filters</Button></div>
      </Card>

      <Card className="p-4">
        {audit.loading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading immutable events…</div>
        ) : (
          <>
            <DataTable
              data={audit.events}
              columns={columns}
              getRowId={(event) => event.id}
              searchable={false}
              selectable={false}
              rowAction={(event) => audit.setSelectedId(event.id)}
              initialSort={{ key: 'occurredAt', dir: 'desc' }}
              emptyTitle="No audit events match these filters"
              emptyDescription="Clear or broaden the filters to inspect more operational history."
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
              <span className="text-muted-foreground">Page {audit.page} · {audit.total.toLocaleString()} total events</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={audit.page <= 1} onClick={() => audit.updateFilters({ page: audit.page - 1 })}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button>
                <Button variant="outline" size="sm" disabled={audit.page * audit.pageSize >= audit.total} onClick={() => audit.updateFilters({ page: audit.page + 1 })}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Sheet open={Boolean(audit.selectedId)} onOpenChange={(open) => !open && audit.setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader><SheetTitle>Audit event</SheetTitle><SheetDescription>Complete immutable event context and recorded field changes.</SheetDescription></SheetHeader>
          {audit.detailLoading && <div className="flex items-center justify-center py-16 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading event…</div>}
          {audit.detail && (
            <div className="mt-5 space-y-5">
              <div className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge tone={actionTone(audit.detail.event.actionKey)}>{audit.detail.event.actionKey}</StatusBadge><span className="font-mono text-xs text-muted-foreground">{audit.detail.event.id}</span></div>
                <p className="mt-3 text-sm font-medium">{audit.detail.event.summary}</p>
                {audit.detail.event.reason && <p className="mt-1 text-sm text-muted-foreground">Reason: {audit.detail.event.reason}</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />Occurred</p><p className="mt-1 text-sm font-medium">{dateLabel(audit.detail.event.occurredAt)}</p></div>
                <div className="rounded-lg border p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="h-3.5 w-3.5" />Actor</p><p className="mt-1 text-sm font-medium">{audit.detail.event.actorName || audit.detail.event.actorType}</p><p className="text-xs text-muted-foreground">{audit.detail.event.actorEmail || audit.detail.event.effectiveRoleKey}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Entity</p><p className="mt-1 text-sm font-medium">{audit.detail.event.entityType}</p><p className="break-all font-mono text-[10px] text-muted-foreground">{audit.detail.event.entityId}</p></div>
                <div className="rounded-lg border p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Server className="h-3.5 w-3.5" />Correlation</p><p className="mt-1 break-all font-mono text-[10px]">{audit.detail.event.correlationId || audit.detail.event.requestId || audit.detail.event.sessionId || 'Not recorded'}</p></div>
              </div>

              {entityLink(audit.detail.event) && <Button asChild variant="outline"><Link to={entityLink(audit.detail.event)!}>Open related workspace<ExternalLink className="ml-2 h-4 w-4" /></Link></Button>}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Field changes</h3>
                {audit.detail.changes.length === 0 ? <p className="rounded-md border p-3 text-sm text-muted-foreground">No field-level change rows were recorded for this event.</p> : (
                  <div className="space-y-2">{audit.detail.changes.map((change) => <div key={change.id} className="rounded-lg border p-3"><p className="font-mono text-xs font-semibold">{change.fieldPath}</p><div className="mt-2 grid gap-2 sm:grid-cols-2"><div className="rounded bg-muted/40 p-2"><p className="mb-1 text-[10px] uppercase text-muted-foreground">Before</p><pre className="whitespace-pre-wrap break-all text-xs">{jsonLabel(change.beforeValue)}</pre></div><div className="rounded bg-muted/40 p-2"><p className="mb-1 text-[10px] uppercase text-muted-foreground">After</p><pre className="whitespace-pre-wrap break-all text-xs">{jsonLabel(change.afterValue)}</pre></div></div></div>)}</div>
                )}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Metadata</h3>
                <pre className="max-h-80 overflow-auto rounded-lg border bg-muted/30 p-3 text-xs">{JSON.stringify(audit.detail.event.metadata ?? {}, null, 2)}</pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
