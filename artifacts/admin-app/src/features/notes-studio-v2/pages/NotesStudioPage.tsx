import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GitCompareArrows,
  Languages,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePeriodDialog } from '../components/CreatePeriodDialog';
import { NOTES_STUDIO_PIPELINE } from '../domain/pipeline';
import { useNotesStudioV2Periods } from '../services/useNotesStudioV2Data';

const iconByStage = {
  config: Network,
  corpus: BookOpen,
  facts: Sparkles,
  reconcile: GitCompareArrows,
  'fact-graph': Network,
  style: Sparkles,
  quality: ShieldCheck,
  generate: Languages,
  review: AlertTriangle,
  publish: CheckCircle2,
} as const;

export function NotesStudioPage() {
  const periods = useNotesStudioV2Periods();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">notes-gen-v1</Badge>
            <Badge variant="outline">Notes Studio v2</Badge>
            <Badge>Live API</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Notes Studio v2</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Source-corpus to study-notes pipeline. Generation is structurally limited to the distilled fact graph and never receives raw source prose.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreatePeriodDialog
            source={periods.source}
            suggestedOrderIndex={(periods.data?.length ?? 0) + 1}
            onCreated={(period) => {
              periods.reload();
              navigate(`/content/notes-studio-v2/periods/${period.id}`);
            }}
          />
          <Button variant="outline" onClick={periods.reload} disabled={periods.loading}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {periods.loading && (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading Notes Studio v2 periods…</CardContent></Card>
      )}

      {periods.error && (
        <Card className="border-destructive/40">
          <CardHeader><CardTitle className="text-base">Unable to load Notes Studio v2</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{periods.error}</p>
            <Button size="sm" variant="outline" onClick={periods.reload}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {!periods.loading && !periods.error && periods.data && (
        <div className="grid gap-4 lg:grid-cols-2">
          {periods.data.map((period) => (
            <Card key={period.id}>
              <CardHeader>
                <CardTitle>{period.name}</CardTitle>
                <CardDescription>{period.subCategories.length} admin-defined sub-categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {period.subCategories.map((item) => (
                    <Badge key={item.id} variant="outline">{item.orderIndex}. {item.name}</Badge>
                  ))}
                </div>
                <Button asChild size="sm">
                  <Link to={`/content/notes-studio-v2/periods/${period.id}`}>
                    Open period workspace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          {periods.data.length === 0 && (
            <Card className="lg:col-span-2">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No v2 periods exist yet. Use Create period to define the first era and its own taxonomy.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardDescription>Generation languages</CardDescription><CardTitle className="text-2xl">3 independent</CardTitle></CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">English, Hindi and Punjabi each receive the same fact graph in separate model calls.</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Generation source</CardDescription><CardTitle className="text-2xl">Fact graph only</CardTitle></CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">Source spans are restricted to extraction, reconciliation and accuracy review.</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Coverage rule</CardDescription><CardTitle className="text-2xl">Exhaustive</CardTitle></CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">PYQ frequency changes emphasis metadata, never fact eligibility.</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Architecture pipeline</CardTitle>
          <CardDescription>The uploaded notes-gen-v1 architecture, implemented as the isolated Notes Studio v2 product path.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {NOTES_STUDIO_PIPELINE.map((stage) => {
            const Icon = iconByStage[stage.id];
            return (
              <div key={stage.id} className="flex gap-3 rounded-lg border p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted"><Icon className="h-4 w-4" /></div>
                <div>
                  <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">[{stage.number}]</span><p className="font-medium">{stage.label}</p></div>
                  <p className="mt-1 text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
