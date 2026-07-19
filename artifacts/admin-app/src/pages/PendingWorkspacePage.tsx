import type { ReactNode } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Construction,
  Database,
  ExternalLink,
  MapPinned,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import {
  NAV_LOOKUP,
  WORKSPACE_STATUS_LABELS,
  type AdminWorkspaceStatus,
} from '@/app/nav/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function fallbackTitle(pathname: string) {
  if (pathname.startsWith('/commerce')) return 'Commerce workspace';
  if (pathname.startsWith('/users')) return 'Users and support workspace';
  if (pathname.startsWith('/analytics')) return 'Analytics workspace';
  if (pathname.startsWith('/settings')) return 'Settings workspace';
  if (pathname.startsWith('/content')) return 'Content workspace';
  if (pathname.startsWith('/tests')) return 'Test operations workspace';
  return 'Admin workspace';
}

function statusClass(status: AdminWorkspaceStatus) {
  if (status === 'live') return 'border-success/30 bg-success/10 text-success';
  if (status === 'in_progress') return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-muted-foreground/20 bg-muted text-muted-foreground';
}

function recommendedLiveWorkspace(pathname: string) {
  if (pathname.startsWith('/tests')) {
    return { label: 'Open Tests', path: '/tests' };
  }
  if (pathname.startsWith('/content')) {
    return { label: 'Open Question Studio', path: '/content/questions/generate' };
  }
  return { label: 'Open admin launchpad', path: '/dashboard' };
}

export function PendingWorkspacePage() {
  const location = useLocation();
  const workspace = NAV_LOOKUP[location.pathname];
  const title = workspace?.label ?? fallbackTitle(location.pathname);
  const status = workspace?.status ?? 'planned';
  const liveWorkspace = recommendedLiveWorkspace(location.pathname);

  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden border-dashed">
        <div className="border-b bg-gradient-to-r from-warning/10 via-background to-background px-6 py-6 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                <Construction className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Admin roadmap workspace</p>
                  <Badge variant="outline" className={cn('text-[10px]', statusClass(status))}>
                    {WORKSPACE_STATUS_LABELS[status]}
                  </Badge>
                </div>
                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {workspace?.summary ?? 'This workspace is part of the complete ExamTree admin architecture but is not connected to canonical production APIs yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <RoadmapCard
              icon={<Database className="h-4 w-4" />}
              title="Canonical data only"
              description="No prototype or browser-local records are displayed. This page will go live only with canonical APIs and permissions."
            />
            <RoadmapCard
              icon={<MapPinned className="h-4 w-4" />}
              title="Activation milestone"
              description={workspace?.milestone ?? 'Define the canonical data contract, API operations, permissions and production tests.'}
            />
            <RoadmapCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              title="Release standard"
              description="Loading, empty, error, audit, permission and responsive states must pass CI before the status becomes Live."
            />
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Why the tab is visible</p>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              The full admin information architecture remains visible so the product does not appear smaller than its intended scope. Status badges distinguish working operations from the implementation roadmap without reintroducing fake data.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Admin launchpad</Link>
            </Button>
            <Button asChild>
              <Link to={liveWorkspace.path}><ExternalLink className="mr-2 h-4 w-4" /> {liveWorkspace.label}</Link>
            </Button>
          </div>

          <p className="rounded-md bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
            Requested route: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function RoadmapCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">{icon}{title}</div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
