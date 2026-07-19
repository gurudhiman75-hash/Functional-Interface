import { ArrowRight, Map, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  ADMIN_WORKSPACE_COUNTS,
  NAV_GROUPS,
  type NavItem,
} from '@/app/nav/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const workspaceEntries = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupLabel: group.label })),
);
const liveWorkspaces = workspaceEntries.filter((item) => item.status === 'live' && item.path !== '/dashboard');
const inProgressWorkspaces = workspaceEntries.filter((item) => item.status === 'in_progress');
const plannedWorkspaces = workspaceEntries.filter((item) => item.status === 'planned');

export function LiveDashboardPage() {
  const { session } = useAdminPermissions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin launchpad"
        description="Operate canonical ExamTree workflows and track the complete admin implementation roadmap from one truthful command centre."
        icon={<ShieldCheck className="h-5 w-5" />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-success/10 text-success hover:bg-success/10">Canonical database</Badge>
        <Badge className="bg-success/10 text-success hover:bg-success/10">Firebase admin session</Badge>
        <Badge className="bg-success/10 text-success hover:bg-success/10">RBAC enforced</Badge>
        {session?.user.email && <Badge variant="outline">{session.user.email}</Badge>}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <RoadmapMetric label="Live workspaces" value={ADMIN_WORKSPACE_COUNTS.live} tone="live" />
        <RoadmapMetric label="In implementation queue" value={ADMIN_WORKSPACE_COUNTS.in_progress} tone="next" />
        <RoadmapMetric label="Planned workspaces" value={ADMIN_WORKSPACE_COUNTS.planned} tone="planned" />
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Live canonical operations</p>
            <p className="mt-1 text-xs text-muted-foreground">These workspaces read and write production canonical data.</p>
          </div>
          <Badge variant="outline" className="border-success/30 bg-success/5 text-success">Live</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {liveWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.path} workspace={workspace} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Active implementation queue</p>
            <p className="mt-1 text-xs text-muted-foreground">Visible product scope prioritised for canonical integration.</p>
          </div>
          <Badge variant="outline" className="border-warning/30 bg-warning/5 text-warning">Next</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {inProgressWorkspaces.map((workspace) => (
            <Link key={workspace.path} to={workspace.path} className="group rounded-xl border bg-card p-4 transition hover:border-warning/40 hover:shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <workspace.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{workspace.label}</p>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-warning" />
                  </div>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{workspace.groupLabel}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{workspace.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base"><Map className="h-4 w-4 text-muted-foreground" /> Planned product scope</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Visible for product completeness, but not represented as operational data.</p>
            </div>
            <Badge variant="secondary">{plannedWorkspaces.length} planned</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {plannedWorkspaces.map((workspace) => (
              <Link key={workspace.path} to={workspace.path} className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground">
                <workspace.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{workspace.label}</span>
                <span className="text-[9px] uppercase tracking-wide opacity-60">{workspace.groupLabel}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: NavItem & { groupLabel: string } }) {
  return (
    <Link to={workspace.path} className="group">
      <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <workspace.icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <CardTitle className="pt-3 text-lg">{workspace.label}</CardTitle>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{workspace.groupLabel}</p>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {workspace.summary}
        </CardContent>
      </Card>
    </Link>
  );
}

function RoadmapMetric({ label, value, tone }: { label: string; value: number; tone: 'live' | 'next' | 'planned' }) {
  const toneClass = tone === 'live'
    ? 'border-success/25 bg-success/5 text-success'
    : tone === 'next'
      ? 'border-warning/25 bg-warning/5 text-warning'
      : 'border-muted-foreground/20 bg-muted/20 text-muted-foreground';

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
