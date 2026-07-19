import { ArrowLeft, Construction, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function workspaceTitle(pathname: string) {
  if (pathname.startsWith('/commerce')) return 'Commerce';
  if (pathname.startsWith('/users')) return 'Users and support';
  if (pathname.startsWith('/analytics')) return 'Analytics';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/content')) return 'Content workspace';
  if (pathname.startsWith('/tests')) return 'Test operations';
  return 'Admin workspace';
}

export function PendingWorkspacePage() {
  const location = useLocation();
  const title = workspaceTitle(location.pathname);

  return (
    <div className="mx-auto max-w-2xl py-10">
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
            <Construction className="h-7 w-7" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-warning">Pending canonical integration</p>
          <h1 className="mt-2 text-2xl font-bold">{title} is not live yet</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            This route existed in the visual prototype, but it is not connected to ExamTree's canonical database and APIs. Mock browser data has been removed from the production navigation so administrators cannot mistake it for real platform state.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Admin launchpad</Link>
            </Button>
            <Button asChild>
              <Link to="/content/questions"><ExternalLink className="mr-2 h-4 w-4" /> Open Question Bank</Link>
            </Button>
          </div>
          <p className="mt-6 rounded-md bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
            Requested route: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
