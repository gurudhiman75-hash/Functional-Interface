import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  Loader2,
  RefreshCw,
  Save,
  Search,
  Target,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
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
import type { TaxonomyCoverageRow, TaxonomyNode } from '@/features/taxonomy/api';
import {
  TAXONOMY_TYPE_LABELS,
  coveragePercent,
  coverageReadiness,
  nodeDepth,
  sortTaxonomyNodes,
  type CoverageReadiness,
} from '@/features/taxonomy/model';
import { useTaxonomyWorkspace } from '@/features/taxonomy/useTaxonomyWorkspace';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const ALL = 'all';

type PlannerRow = {
  node: TaxonomyNode;
  coverage: TaxonomyCoverageRow;
  depth: number;
  isLeaf: boolean;
};

function zeroCoverage(nodeId: string, examVersionId: string): TaxonomyCoverageRow {
  return {
    examVersionId,
    taxonomyNodeId: nodeId,
    targetCoverage: null,
    isActive: true,
    totalQuestions: 0,
    publishedQuestions: 0,
    approvedQuestions: 0,
    reviewQuestions: 0,
    draftQuestions: 0,
  };
}

function readinessClass(readiness: CoverageReadiness) {
  if (readiness === 'ready' || readiness === 'exceeded') return 'border-success/30 bg-success/5 text-success';
  if (readiness === 'behind') return 'border-warning/30 bg-warning/5 text-warning';
  if (readiness === 'empty') return 'border-destructive/30 bg-destructive/5 text-destructive';
  return 'border-border bg-muted/30 text-muted-foreground';
}

function readinessLabel(readiness: CoverageReadiness) {
  if (readiness === 'unplanned') return 'No target';
  if (readiness === 'empty') return 'Empty';
  if (readiness === 'behind') return 'Behind';
  if (readiness === 'ready') return 'Ready';
  return 'Above target';
}

export function CoveragePlannerPage() {
  const { hasPermission } = useAdminPermissions();
  const canManage = hasPermission('content.taxonomy.manage');
  const { workspace, loading, saving, error, refresh, saveCoverage } = useTaxonomyWorkspace();
  const currentExams = useMemo(
    () => workspace.exams.filter((exam) => exam.currentVersionId && exam.isActive),
    [workspace.exams],
  );
  const [examVersionId, setExamVersionId] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [readinessFilter, setReadinessFilter] = useState<CoverageReadiness | 'all'>('all');
  const [targetDrafts, setTargetDrafts] = useState<Record<string, string>>({});
  const [reason, setReason] = useState('Update canonical content coverage targets.');

  useEffect(() => {
    if (!examVersionId && currentExams[0]?.currentVersionId) setExamVersionId(currentExams[0].currentVersionId);
  }, [currentExams, examVersionId]);

  useEffect(() => {
    setTargetDrafts({});
  }, [examVersionId]);

  const coverageByNode = useMemo(() => {
    const map = new Map<string, TaxonomyCoverageRow>();
    for (const row of workspace.coverage) {
      if (row.examVersionId === examVersionId) map.set(row.taxonomyNodeId, row);
    }
    return map;
  }, [examVersionId, workspace.coverage]);

  const rows = useMemo<PlannerRow[]>(() => {
    if (!examVersionId) return [];
    return sortTaxonomyNodes(workspace.nodes)
      .filter((node) => node.isActive)
      .map((node) => ({
        node,
        coverage: coverageByNode.get(node.id) ?? zeroCoverage(node.id, examVersionId),
        depth: Math.min(5, nodeDepth(node, workspace.nodes)),
        isLeaf: node.children.filter((child) => workspace.nodes.some((candidate) => candidate.id === child.id && candidate.isActive)).length === 0,
      }));
  }, [coverageByNode, examVersionId, workspace.nodes]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (typeFilter !== ALL && row.node.nodeType !== typeFilter) return false;
      const readiness = coverageReadiness(row.coverage);
      if (readinessFilter !== 'all' && readiness !== readinessFilter) return false;
      if (!term) return true;
      return [row.node.code, row.node.name, row.node.description ?? '', ...row.node.parents.map((parent) => parent.name)]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [readinessFilter, rows, search, typeFilter]);

  const changedRows = useMemo(() => rows.filter((row) => {
    const draft = targetDrafts[row.node.id];
    if (draft === undefined) return false;
    const current = row.coverage.targetCoverage === null ? '' : String(row.coverage.targetCoverage);
    return draft !== current;
  }), [rows, targetDrafts]);

  const leafRows = rows.filter((row) => row.isLeaf);
  const totals = leafRows.reduce(
    (summary, row) => ({
      target: summary.target + (row.coverage.targetCoverage ?? 0),
      questions: summary.questions + row.coverage.totalQuestions,
      published: summary.published + row.coverage.publishedQuestions,
      ready: summary.ready + (['ready', 'exceeded'].includes(coverageReadiness(row.coverage)) ? 1 : 0),
      planned: summary.planned + ((row.coverage.targetCoverage ?? 0) > 0 ? 1 : 0),
    }),
    { target: 0, questions: 0, published: 0, ready: 0, planned: 0 },
  );
  const overallPercent = totals.target > 0 ? Math.round((totals.questions / totals.target) * 100) : null;
  const selectedExam = currentExams.find((exam) => exam.currentVersionId === examVersionId);

  const handleSave = async () => {
    if (changedRows.length === 0) {
      showToast.info('No target changes', 'Edit one or more target values first.');
      return;
    }
    try {
      const result = await saveCoverage({
        reason,
        changes: changedRows.map((row) => {
          const value = targetDrafts[row.node.id] ?? '';
          return {
            taxonomyNodeId: row.node.id,
            examVersionId,
            targetCoverage: value.trim() === '' ? null : Number(value),
            isActive: true,
          };
        }),
      });
      setTargetDrafts({});
      showToast.success('Coverage targets saved', `${result.updatedCount} canonical target(s) updated.`);
    } catch (caught) {
      showToast.error('Coverage save failed', caught instanceof Error ? caught.message : 'Unable to save targets.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coverage Planner"
        description="Plan and measure canonical question coverage for each current exam version."
        icon={<Target className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/5 text-success">
              <Database className="h-3.5 w-3.5" /> Canonical Question Bank
            </Badge>
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || saving}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button onClick={() => void handleSave()} disabled={!canManage || saving || changedRows.length === 0 || reason.trim().length < 4}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              Save {changedRows.length || ''} target{changedRows.length === 1 ? '' : 's'}
            </Button>
          </>
        )}
      />

      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[280px_1fr] lg:items-end">
          <Field label="Current exam version">
            <Select value={examVersionId} onValueChange={setExamVersionId}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{currentExams.map((exam) => <SelectItem key={exam.currentVersionId!} value={exam.currentVersionId!}>{exam.name} · {exam.currentVersionName}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Audit reason for target changes">
            <Input value={reason} onChange={(event) => setReason(event.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Leaf nodes" value={leafRows.length} icon={<Target className="h-4 w-4" />} />
        <Metric label="Planned leaf nodes" value={totals.planned} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Metric label="Question target" value={totals.target || '—'} icon={<BarChart3 className="h-4 w-4" />} />
        <Metric label="Canonical questions" value={totals.questions} icon={<Database className="h-4 w-4" />} />
        <Metric label="Overall readiness" value={overallPercent === null ? 'Unplanned' : `${overallPercent}%`} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-base">{selectedExam?.name ?? 'Exam'} coverage matrix</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Parent rows roll up all descendant question links. Summary totals use leaf nodes to avoid double counting.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code, node, parent or description" className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value={ALL}>All node types</SelectItem>{workspace.supportedNodeTypes.map((type) => <SelectItem key={type} value={type}>{TAXONOMY_TYPE_LABELS[type]}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={readinessFilter} onValueChange={(value) => setReadinessFilter(value as CoverageReadiness | 'all')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All readiness states</SelectItem>
                <SelectItem value="unplanned">No target</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
                <SelectItem value="behind">Behind</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="exceeded">Above target</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading coverage…</div>
          ) : !examVersionId ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Select a current exam version.</div>
          ) : filteredRows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No taxonomy rows match this view.</div>
          ) : (
            <div className="divide-y">
              {filteredRows.map((row) => {
                const readiness = coverageReadiness(row.coverage);
                const percent = coveragePercent(row.coverage.totalQuestions, row.coverage.targetCoverage);
                const draftValue = targetDrafts[row.node.id] ?? (row.coverage.targetCoverage === null ? '' : String(row.coverage.targetCoverage));
                const dirty = targetDrafts[row.node.id] !== undefined && draftValue !== (row.coverage.targetCoverage === null ? '' : String(row.coverage.targetCoverage));
                return (
                  <div key={row.node.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(260px,1fr)_120px_120px_120px_130px_150px] lg:items-center">
                    <div style={{ paddingLeft: `${row.depth * 18}px` }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{row.node.name}</span>
                        <Badge variant="outline" className="text-[10px]">{TAXONOMY_TYPE_LABELS[row.node.nodeType]}</Badge>
                        {row.isLeaf && <Badge variant="secondary" className="text-[10px]">Leaf</Badge>}
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{row.node.code}</p>
                    </div>
                    <Count label="Questions" value={row.coverage.totalQuestions} />
                    <Count label="Published" value={row.coverage.publishedQuestions} />
                    <Count label="Review" value={row.coverage.reviewQuestions} />
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Readiness</p>
                      <Badge variant="outline" className={cn('text-[10px]', readinessClass(readiness))}>{readinessLabel(readiness)}{percent !== null ? ` · ${percent}%` : ''}</Badge>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Target {dirty && <span className="text-warning">· changed</span>}</p>
                      <Input
                        type="number"
                        min={0}
                        max={100000}
                        value={draftValue}
                        onChange={(event) => setTargetDrafts((current) => ({ ...current, [row.node.id]: event.target.value }))}
                        placeholder="Not planned"
                        disabled={!canManage}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}

function Metric({ label, value, icon }: { label: string; value: number | string; icon: ReactNode }) {
  return <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div><p className="mt-2 text-xl font-bold">{value}</p></CardContent></Card>;
}

function Count({ label, value }: { label: string; value: number }) {
  return <div className="rounded-md border bg-muted/10 px-3 py-2 text-center"><p className="font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>;
}
