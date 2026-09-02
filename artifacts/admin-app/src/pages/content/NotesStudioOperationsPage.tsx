import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Loader2, RefreshCw, ServerCog, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminRequest } from '@/lib/admin-request';

type Readiness = {
  generatedAt: string;
  schema: {
    ready: boolean;
    presentRelations: string[];
    missingRelations: string[];
    presentTriggers: string[];
    missingTriggers: string[];
  };
  migrations: {
    orderedFiles: string[];
    operatorCommand: string;
    automaticProductionMigration: boolean;
  };
  modelConfiguration: {
    provider: string;
    sectionModelConfigured: boolean;
    sectionModel: string | null;
    localizationModelConfigured: boolean;
    localizationModel: string | null;
    modelApiKeyConfigured: boolean;
    sourceDiscoveryProvider: string;
    sourceDiscoveryConfigured: boolean;
    sourceDiscoveryModel: string | null;
  };
  assessment: {
    readyForEditorTraffic: boolean;
    blockers: string[];
    warnings: string[];
  };
  stateCounts: Array<{ state: string; count: number }>;
  sourceFailures: Array<{ id: string; title: string; sourceType: string; sourceUri: string; failureReason: string | null; updatedAt: string }>;
  generationFailures: Array<{ id: string; jobId: string; jobTitle: string; errorCode: string | null; errorMessage: string | null; model: string; createdAt: string }>;
  failedQualityRuns: Array<{ id: string; jobId: string; jobTitle: string; sectionTitle: string; failCount: number; warningCount: number; createdAt: string }>;
  releaseCounts: { approvedVersions: number; sourceMaterializations: number; localizedMaterializations: number; publishHandoffs: number };
  safety: {
    rawSourceBodiesSentToSectionWriter: boolean;
    rawResearchSourcesSentToLocalization: boolean;
    handoffPublishesResource: boolean;
    automaticPublicationEnabled: boolean;
  };
};

function configBadge(ok: boolean, label: string, detail?: string | null) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
    <div><div className="text-sm font-medium">{label}</div>{detail && <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>}</div>
    <Badge variant={ok ? 'default' : 'destructive'}>{ok ? 'Ready' : 'Missing'}</Badge>
  </div>;
}

export function NotesStudioOperationsPage() {
  const [data, setData] = useState<Readiness | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setData(await adminRequest<Readiness>('/admin/notes-studio/operations/readiness'));
    } catch (error) {
      showToast.error('Unable to load Notes Studio readiness', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return <div className="space-y-5">
    <PageHeader
      title="Production Readiness"
      description="Operational view of the Notes Studio V1 schema, authoring/search configuration, failure signals and publication boundaries."
      icon={<ServerCog className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading}>{loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh</Button>}
    />

    {data && <>
      <Card className={data.assessment.readyForEditorTraffic ? 'border-emerald-200' : 'border-destructive/40'}>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            {data.assessment.readyForEditorTraffic ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <XCircle className="mt-0.5 h-5 w-5 text-destructive" />}
            <div>
              <div className="font-semibold">{data.assessment.readyForEditorTraffic ? 'Authoring stack is operationally ready' : 'Authoring stack has blocking production gaps'}</div>
              <div className="mt-1 text-sm text-muted-foreground">Checked {new Date(data.generatedAt).toLocaleString()}.</div>
            </div>
          </div>
          <Badge variant={data.assessment.readyForEditorTraffic ? 'default' : 'destructive'}>{data.assessment.readyForEditorTraffic ? 'READY' : 'BLOCKED'}</Badge>
        </CardContent>
      </Card>

      {(data.assessment.blockers.length > 0 || data.assessment.warnings.length > 0) && <Card>
        <CardHeader><CardTitle className="text-base">Attention required</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.assessment.blockers.map((item) => <div key={item} className="flex gap-2 rounded-lg border border-destructive/30 p-3 text-sm"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{item}</div>)}
          {data.assessment.warnings.map((item) => <div key={item} className="flex gap-2 rounded-lg border border-amber-200 p-3 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</div>)}
        </CardContent>
      </Card>}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Database className="h-4 w-4" />Schema & migrations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Relations</div><div className="mt-1 text-lg font-bold">{data.schema.presentRelations.length}</div></div>
              <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Triggers</div><div className="mt-1 text-lg font-bold">{data.schema.presentTriggers.length}</div></div>
              <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Migrations</div><div className="mt-1 text-lg font-bold">{data.migrations.orderedFiles.length}</div></div>
            </div>
            {!data.schema.ready && <div className="rounded-lg bg-muted p-3 text-xs">
              {data.schema.missingRelations.length > 0 && <div><strong>Missing relations:</strong> {data.schema.missingRelations.join(', ')}</div>}
              {data.schema.missingTriggers.length > 0 && <div className="mt-1"><strong>Missing triggers:</strong> {data.schema.missingTriggers.join(', ')}</div>}
            </div>}
            <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">Production migrations are intentionally explicit, not run automatically at API boot. The NS-008 transactional runner uses one canonical DATABASE_URL and verifies the required schema after applying the ordered V1 chain.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Model & discovery configuration</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {configBadge(data.modelConfiguration.sectionModelConfigured, 'Section synthesis model', `${data.modelConfiguration.provider} · ${data.modelConfiguration.sectionModel || 'not configured'}`)}
            {configBadge(data.modelConfiguration.localizationModelConfigured, 'Localization model', `${data.modelConfiguration.provider} · ${data.modelConfiguration.localizationModel || 'not configured'}`)}
            {configBadge(data.modelConfiguration.modelApiKeyConfigured, 'Authoring model API credential')}
            {configBadge(
              data.modelConfiguration.sourceDiscoveryConfigured,
              'Web Source Discovery',
              `${data.modelConfiguration.sourceDiscoveryProvider} · ${data.modelConfiguration.sourceDiscoveryModel || 'not configured'}`,
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lifecycle inventory</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {data.stateCounts.map((item) => <div key={item.state} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{item.state.replaceAll('_', ' ')}</div><div className="mt-1 text-xl font-bold">{item.count}</div></div>)}
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Approved versions</div><div className="mt-1 text-xl font-bold">{data.releaseCounts.approvedVersions}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Publish handoffs</div><div className="mt-1 text-xl font-bold">{data.releaseCounts.publishHandoffs}</div></div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Source failures</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.sourceFailures.length === 0 ? <div className="text-sm text-muted-foreground">No extraction failures.</div> : data.sourceFailures.map((item) => <div key={item.id} className="rounded-lg border p-3 text-sm"><div className="font-medium">{item.title}</div><div className="mt-1 text-xs text-muted-foreground">{item.failureReason || 'No failure reason recorded.'}</div></div>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Generation failures</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.generationFailures.length === 0 ? <div className="text-sm text-muted-foreground">No failed section generations.</div> : data.generationFailures.map((item) => <div key={item.id} className="rounded-lg border p-3 text-sm"><div className="font-medium">{item.jobTitle}</div><div className="mt-1 text-xs text-muted-foreground">{item.errorCode || 'GENERATION_FAILED'} · {item.errorMessage || 'No message recorded.'}</div></div>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Failed QA runs</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.failedQualityRuns.length === 0 ? <div className="text-sm text-muted-foreground">No failed QA runs.</div> : data.failedQualityRuns.map((item) => <div key={item.id} className="rounded-lg border p-3 text-sm"><div className="font-medium">{item.sectionTitle}</div><div className="mt-1 text-xs text-muted-foreground">{item.jobTitle} · {item.failCount} fail · {item.warningCount} warning</div></div>)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Safety boundary</CardTitle></CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Section writer gets raw source bodies', data.safety.rawSourceBodiesSentToSectionWriter],
            ['Localization gets research sources', data.safety.rawResearchSourcesSentToLocalization],
            ['Release handoff publishes content', data.safety.handoffPublishesResource],
            ['Automatic learner publication', data.safety.automaticPublicationEnabled],
          ].map(([label, enabled]) => <div key={String(label)} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{String(label)}</span><Badge variant={enabled ? 'destructive' : 'outline'}>{enabled ? 'ON' : 'OFF'}</Badge></div>)}
        </CardContent>
      </Card>
    </>}
  </div>;
}

export default NotesStudioOperationsPage;