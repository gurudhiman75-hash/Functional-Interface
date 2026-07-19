import { useMemo, useState, type ReactNode } from 'react';
import {
  Archive,
  CheckCircle2,
  ChevronRight,
  Database,
  Edit3,
  Loader2,
  Network,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  TaxonomyNode,
  TaxonomyNodeMutation,
  TaxonomyNodeType,
} from '@/features/taxonomy/api';
import {
  TAXONOMY_TYPE_LABELS,
  aggregateNodeCoverage,
  nodeDepth,
  sortTaxonomyNodes,
} from '@/features/taxonomy/model';
import { useTaxonomyWorkspace } from '@/features/taxonomy/useTaxonomyWorkspace';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type DraftMapping = {
  examVersionId: string;
  selected: boolean;
  targetCoverage: string;
  displayNameOverride: string;
  sortOrder: number;
};

type NodeDraft = {
  code: string;
  nodeType: TaxonomyNodeType;
  name: string;
  description: string;
  isActive: boolean;
  parentIds: string[];
  mappings: DraftMapping[];
  reason: string;
};

const ALL = 'all';

function emptyDraft(exams: Array<{ currentVersionId: string | null }>): NodeDraft {
  return {
    code: '',
    nodeType: 'topic',
    name: '',
    description: '',
    isActive: true,
    parentIds: [],
    mappings: exams
      .filter((exam): exam is typeof exam & { currentVersionId: string } => Boolean(exam.currentVersionId))
      .map((exam, index) => ({
        examVersionId: exam.currentVersionId,
        selected: false,
        targetCoverage: '',
        displayNameOverride: '',
        sortOrder: index,
      })),
    reason: '',
  };
}

function draftFromNode(
  node: TaxonomyNode,
  exams: Array<{ currentVersionId: string | null }>,
): NodeDraft {
  const mappingByVersion = new Map(node.examMappings.map((mapping) => [mapping.examVersionId, mapping]));
  return {
    code: node.code,
    nodeType: node.nodeType,
    name: node.name,
    description: node.description ?? '',
    isActive: node.isActive,
    parentIds: node.parents.map((parent) => parent.id),
    mappings: exams
      .filter((exam): exam is typeof exam & { currentVersionId: string } => Boolean(exam.currentVersionId))
      .map((exam, index) => {
        const mapping = mappingByVersion.get(exam.currentVersionId);
        return {
          examVersionId: exam.currentVersionId,
          selected: Boolean(mapping),
          targetCoverage: mapping?.targetCoverage === null || mapping?.targetCoverage === undefined
            ? ''
            : String(mapping.targetCoverage),
          displayNameOverride: mapping?.displayNameOverride ?? '',
          sortOrder: mapping?.sortOrder ?? index,
        };
      }),
    reason: `Update ${node.code} taxonomy configuration.`,
  };
}

function mutationFromDraft(draft: NodeDraft): TaxonomyNodeMutation {
  return {
    code: draft.code,
    nodeType: draft.nodeType,
    name: draft.name,
    description: draft.description.trim() || null,
    isActive: draft.isActive,
    parentIds: draft.parentIds,
    examMappings: draft.mappings
      .filter((mapping) => mapping.selected)
      .map((mapping) => ({
        examVersionId: mapping.examVersionId,
        displayNameOverride: mapping.displayNameOverride.trim() || null,
        targetCoverage: mapping.targetCoverage.trim() === '' ? null : Number(mapping.targetCoverage),
        sortOrder: mapping.sortOrder,
        isActive: true,
      })),
    reason: draft.reason,
  };
}

function typeBadgeClass(type: TaxonomyNodeType) {
  if (type === 'subject') return 'border-primary/30 bg-primary/5 text-primary';
  if (type === 'topic') return 'border-info/30 bg-info/5 text-info';
  if (type === 'chapter') return 'border-success/30 bg-success/5 text-success';
  if (type === 'canonical_problem') return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-border bg-muted/30 text-muted-foreground';
}

export function TaxonomyWorkspacePage() {
  const { hasPermission } = useAdminPermissions();
  const canManage = hasPermission('content.taxonomy.manage');
  const { workspace, loading, saving, error, refresh, saveNode } = useTaxonomyWorkspace();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [activityFilter, setActivityFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [examFilter, setExamFilter] = useState(ALL);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<NodeDraft>(() => emptyDraft([]));

  const currentExams = useMemo(
    () => workspace.exams.filter((exam) => exam.currentVersionId),
    [workspace.exams],
  );
  const nodeById = useMemo(() => new Map(workspace.nodes.map((node) => [node.id, node])), [workspace.nodes]);
  const examByVersion = useMemo(
    () => new Map(currentExams.map((exam) => [exam.currentVersionId!, exam])),
    [currentExams],
  );

  const filteredNodes = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sortTaxonomyNodes(workspace.nodes).filter((node) => {
      if (typeFilter !== ALL && node.nodeType !== typeFilter) return false;
      if (activityFilter === 'active' && !node.isActive) return false;
      if (activityFilter === 'inactive' && node.isActive) return false;
      if (examFilter !== ALL && !node.examMappings.some((mapping) => mapping.examVersionId === examFilter && mapping.isActive)) return false;
      if (!term) return true;
      return [node.code, node.name, node.description ?? '', ...node.parents.map((parent) => parent.name)]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [activityFilter, examFilter, search, typeFilter, workspace.nodes]);

  const activeNodes = workspace.nodes.filter((node) => node.isActive).length;
  const mappedNodes = workspace.nodes.filter((node) => node.examMappings.some((mapping) => mapping.isActive)).length;
  const plannedTargets = workspace.coverage.filter((row) => row.isActive && (row.targetCoverage ?? 0) > 0).length;

  const openCreate = () => {
    setEditingNodeId(null);
    setDraft(emptyDraft(currentExams));
    setEditorOpen(true);
  };

  const openEdit = (node: TaxonomyNode) => {
    setEditingNodeId(node.id);
    setDraft(draftFromNode(node, currentExams));
    setEditorOpen(true);
  };

  const handleSave = async () => {
    try {
      await saveNode(mutationFromDraft(draft), editingNodeId ?? undefined);
      setEditorOpen(false);
      setEditingNodeId(null);
      showToast.success(
        editingNodeId ? 'Taxonomy node updated' : 'Taxonomy node created',
        'Hierarchy, exam mappings and coverage targets are now canonical.',
      );
    } catch (caught) {
      showToast.error('Taxonomy save failed', caught instanceof Error ? caught.message : 'Unable to save taxonomy node.');
    }
  };

  const handleToggleActivity = async (node: TaxonomyNode) => {
    try {
      const input = mutationFromDraft(draftFromNode(node, currentExams));
      input.isActive = !node.isActive;
      input.reason = `${node.isActive ? 'Archive' : 'Reactivate'} ${node.code} from the taxonomy workspace.`;
      await saveNode(input, node.id);
      showToast.success(node.isActive ? 'Node archived' : 'Node reactivated', node.name);
    } catch (caught) {
      showToast.error('Status change failed', caught instanceof Error ? caught.message : 'Unable to update node status.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sections & Topics"
        description="Manage ExamTree’s canonical exam → subject → topic → subtopic → chapter → CP hierarchy."
        icon={<Network className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/5 text-success">
              <Database className="h-3.5 w-3.5" /> Canonical catalog
            </Badge>
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || saving}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button onClick={openCreate} disabled={!canManage || loading}>
              <Plus className="mr-1.5 h-4 w-4" /> New node
            </Button>
          </>
        )}
      />

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Canonical nodes" value={workspace.nodes.length} icon={<Network className="h-4 w-4" />} />
        <Metric label="Active nodes" value={activeNodes} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Metric label="Exam-mapped nodes" value={mappedNodes} icon={<Database className="h-4 w-4" />} />
        <Metric label="Coverage targets" value={plannedTargets} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      {editorOpen && (
        <NodeEditor
          draft={draft}
          setDraft={setDraft}
          editingNode={editingNodeId ? nodeById.get(editingNodeId) ?? null : null}
          nodes={workspace.nodes}
          currentExams={currentExams}
          examByVersion={examByVersion}
          supportedTypes={workspace.supportedNodeTypes}
          saving={saving}
          canManage={canManage}
          onClose={() => setEditorOpen(false)}
          onSave={() => void handleSave()}
        />
      )}

      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-base">Canonical hierarchy</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Nodes may have multiple parents, but cycle creation is rejected by the API. Archiving never deletes question links.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code, name, parent or description" className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All types</SelectItem>
                {workspace.supportedNodeTypes.map((type) => <SelectItem key={type} value={type}>{TAXONOMY_TYPE_LABELS[type]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={activityFilter} onValueChange={(value) => setActivityFilter(value as typeof activityFilter)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="inactive">Archived only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All exam versions</SelectItem>
                {currentExams.map((exam) => <SelectItem key={exam.currentVersionId!} value={exam.currentVersionId!}>{exam.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading canonical taxonomy…
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No taxonomy nodes match this view.</div>
          ) : (
            <div className="divide-y">
              {filteredNodes.map((node) => {
                const depth = Math.min(5, nodeDepth(node, workspace.nodes));
                const coverage = aggregateNodeCoverage(node.id, workspace.coverage);
                return (
                  <div key={node.id} className={cn('flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center', !node.isActive && 'bg-muted/20 opacity-70')}>
                    <div className="min-w-0 flex-1" style={{ paddingLeft: `${depth * 20}px` }}>
                      <div className="flex flex-wrap items-center gap-2">
                        {depth > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="font-semibold">{node.name}</span>
                        <Badge variant="outline" className={cn('text-[10px]', typeBadgeClass(node.nodeType))}>{TAXONOMY_TYPE_LABELS[node.nodeType]}</Badge>
                        {!node.isActive && <Badge variant="outline">Archived</Badge>}
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{node.code}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {node.parents.length > 0 ? `Parent: ${node.parents.map((parent) => parent.name).join(', ')}` : 'Root node'}
                        {' · '}{node.children.length} child node(s)
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:w-72">
                      <MiniMetric label="Exam versions" value={coverage.mappedExamVersions} />
                      <MiniMetric label="Questions" value={coverage.totalQuestions} />
                      <MiniMetric label="Target" value={coverage.targetCoverage || '—'} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(node)} disabled={!canManage}>
                        <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => void handleToggleActivity(node)} disabled={!canManage || saving} className={node.isActive ? 'text-warning' : 'text-success'}>
                        {node.isActive ? <Archive className="mr-1.5 h-3.5 w-3.5" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                        {node.isActive ? 'Archive' : 'Reactivate'}
                      </Button>
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

function NodeEditor({ draft, setDraft, editingNode, nodes, currentExams, examByVersion, supportedTypes, saving, canManage, onClose, onSave }: {
  draft: NodeDraft;
  setDraft: React.Dispatch<React.SetStateAction<NodeDraft>>;
  editingNode: TaxonomyNode | null;
  nodes: TaxonomyNode[];
  currentExams: Array<{ currentVersionId: string | null; name: string; currentVersionName: string | null }>;
  examByVersion: Map<string, { name: string; currentVersionName: string | null }>;
  supportedTypes: TaxonomyNodeType[];
  saving: boolean;
  canManage: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const parentCandidates = nodes.filter((node) => node.id !== editingNode?.id && node.isActive);
  const selectedMappings = draft.mappings.filter((mapping) => mapping.selected).length;
  const updateMapping = (examVersionId: string, patch: Partial<DraftMapping>) => {
    setDraft((current) => ({
      ...current,
      mappings: current.mappings.map((mapping) => mapping.examVersionId === examVersionId ? { ...mapping, ...patch } : mapping),
    }));
  };
  const toggleParent = (parentId: string, selected: boolean) => {
    setDraft((current) => ({
      ...current,
      parentIds: selected
        ? [...new Set([...current.parentIds, parentId])]
        : current.parentIds.filter((id) => id !== parentId),
    }));
  };

  return (
    <Card className="border-primary/30 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{editingNode ? `Edit ${editingNode.code}` : 'Create taxonomy node'}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">All changes are transactional and create an immutable audit event.</p>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Code"><Input value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))} placeholder="QUANT_PERCENTAGE" /></Field>
          <Field label="Node type">
            <Select value={draft.nodeType} onValueChange={(value) => setDraft((current) => ({ ...current, nodeType: value as TaxonomyNodeType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{supportedTypes.map((type) => <SelectItem key={type} value={type}>{TAXONOMY_TYPE_LABELS[type]}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Name" className="xl:col-span-2"><Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></Field>
        </div>
        <Field label="Description"><Textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="min-h-20" /></Field>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Parent nodes</p><p className="mt-1 text-xs text-muted-foreground">Multiple parents are allowed; cycles are rejected server-side.</p></div><Badge variant="outline">{draft.parentIds.length} selected</Badge></div>
            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
              {parentCandidates.map((node) => (
                <label key={node.id} className="flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-xs hover:bg-muted/30">
                  <Checkbox checked={draft.parentIds.includes(node.id)} onCheckedChange={(checked) => toggleParent(node.id, checked === true)} />
                  <span className="min-w-0 flex-1 truncate">{node.name}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">{node.code}</span>
                </label>
              ))}
              {parentCandidates.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No parent candidates available.</p>}
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Exam-version mappings</p><p className="mt-1 text-xs text-muted-foreground">Assign this node and set a target question count for each current exam version.</p></div><Badge variant="outline">{selectedMappings} selected</Badge></div>
            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {draft.mappings.map((mapping) => {
                const exam = examByVersion.get(mapping.examVersionId);
                return (
                  <div key={mapping.examVersionId} className={cn('rounded-lg border p-3', mapping.selected && 'border-primary/30 bg-primary/[0.03]')}>
                    <label className="flex cursor-pointer items-center gap-3 text-xs font-medium">
                      <Checkbox checked={mapping.selected} onCheckedChange={(checked) => updateMapping(mapping.examVersionId, { selected: checked === true })} />
                      <span>{exam?.name ?? mapping.examVersionId}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">{exam?.currentVersionName}</span>
                    </label>
                    {mapping.selected && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <Input type="number" min={0} max={100000} value={mapping.targetCoverage} onChange={(event) => updateMapping(mapping.examVersionId, { targetCoverage: event.target.value })} placeholder="Target questions" />
                        <Input value={mapping.displayNameOverride} onChange={(event) => updateMapping(mapping.examVersionId, { displayNameOverride: event.target.value })} placeholder="Optional display name" />
                      </div>
                    )}
                  </div>
                );
              })}
              {currentExams.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No current exam versions are configured.</p>}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-end">
          <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
            <Checkbox checked={draft.isActive} onCheckedChange={(checked) => setDraft((current) => ({ ...current, isActive: checked === true }))} /> Active
          </label>
          <Field label="Audit reason"><Input value={draft.reason} onChange={(event) => setDraft((current) => ({ ...current, reason: event.target.value }))} placeholder="Why is this taxonomy change required?" /></Field>
          <div className="flex gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onSave} disabled={!canManage || saving || !draft.code.trim() || !draft.name.trim() || draft.reason.trim().length < 4}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-1.5 h-4 w-4" />} Save canonical node</Button></div>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}

function Metric({ label, value, icon }: { label: string; value: number | string; icon: ReactNode }) {
  return <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div><p className="mt-2 text-xl font-bold">{value}</p></CardContent></Card>;
}

function MiniMetric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-md border bg-background px-2 py-1.5"><p className="font-bold text-foreground">{value}</p><p className="text-muted-foreground">{label}</p></div>;
}
