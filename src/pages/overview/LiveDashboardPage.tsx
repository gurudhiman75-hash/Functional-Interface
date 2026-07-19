import { ArrowRight, Database, FileQuestion, ListChecks, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const liveWorkspaces = [
  {
    title: 'Question Studio',
    description: 'Generate, review, approve, reject, and reconcile canonical question batches.',
    path: '/content/questions/generate',
    icon: Sparkles,
  },
  {
    title: 'Question Bank',
    description: 'Manage canonical question versions, taxonomy, lifecycle states, and publishing readiness.',
    path: '/content/questions',
    icon: FileQuestion,
  },
  {
    title: 'Tests',
    description: 'Review canonical test drafts, QA states, schedules, and published versions.',
    path: '/tests',
    icon: Database,
  },
  {
    title: 'Test Builder',
    description: 'Assemble approved questions into canonical test drafts and publish them for students.',
    path: '/tests/builder',
    icon: ListChecks,
  },
];

const pendingGroups = [
  'Content review, coverage, taxonomy, DI sets, and media',
  'Test QA, series, blueprints, and publishing calendar',
  'Students, support, notifications, and admin team management',
  'Commerce, payments, coupons, packages, and entitlements',
  'Business, test, question, content-quality, and system analytics',
  'Branding, languages, roles, audit logs, and integrations',
];

export function LiveDashboardPage() {
  const { session } = useAdminPermissions();

  return (
    <div>
      <PageHeader
        title="Admin launchpad"
        description="Only workspaces connected to ExamTree's canonical APIs are active here."
        icon={<ShieldCheck className="h-5 w-5" />}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge className="bg-success/10 text-success hover:bg-success/10">Canonical database</Badge>
        <Badge className="bg-success/10 text-success hover:bg-success/10">Firebase admin session</Badge>
        <Badge className="bg-success/10 text-success hover:bg-success/10">RBAC enforced</Badge>
        {session?.user.email && <Badge variant="outline">{session.user.email}</Badge>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {liveWorkspaces.map((workspace) => (
          <Link key={workspace.path} to={workspace.path} className="group">
            <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <workspace.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <CardTitle className="pt-3 text-lg">{workspace.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {workspace.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Pending canonical integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            {pendingGroups.map((item) => (
              <li key={item} className="rounded-md border bg-muted/20 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
