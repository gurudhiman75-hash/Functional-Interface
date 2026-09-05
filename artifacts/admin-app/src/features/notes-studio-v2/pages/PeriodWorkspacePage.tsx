import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileSearch,
  GitCompareArrows,
  Languages,
  Network,
  RefreshCw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvisoryMetadataPanel } from '../components/AdvisoryMetadataPanel';
import { FigureReviewQueue } from '../components/FigureReviewQueue';
import { StyleBootstrapPanel } from '../components/StyleBootstrapPanel';
import { buildFactGraph } from '../domain/generationBoundary';
import { buildGenerateNoteCommand } from '../services/commands';
import type { QualityResponse } from '../services/api';
import { httpNotesStudioV2Repository } from '../services/repository';
import { useNotesStudioV2Workspace } from '../services/useNotesStudioV2Data';

function confidenceVariant(confidence: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (confidence === 'confirmed') return 'default';
  if (confidence === 'disputed') return 'destructive';
  return 'secondary';
}

export function PeriodWorkspacePage() {
  const { periodId } = useParams<{ periodId: string }>();
  const workspace = useNotesStudioV2Workspace(periodId);
  const [action, setAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [qualityByVersion, setQualityByVersion] = useState<Record<string, QualityResponse>>({});

  if (!periodId) return <Navigate to="/content/notes-studio-v2" replace />;

  const run = async (label: string, task: () => Promise<unknown>, success: string) => {
    if (workspace.source !== 'http') {
      setMessage('This action requires HTTP data-source mode. Mock mode is read-only for Notes Studio v2.');
      return;
    }
    setAction(label);
    setMessage(null);
    try {
      await task();
      setMessage(success);
      workspace.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Notes Studio v2 action failed.');
    } finally {
      setAction(null);
    }
  };

  if (workspace.loading) {
    return <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Loading period workspace…</CardContent></Card>;
  }

  if (workspace.error || !workspace.data) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild><Link to="/content/notes-studio-v2"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        <Card className="border-destructive/40">
          <CardHeader><CardTitle>Unable to load period workspace</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{workspace.error ?? 'Period not found.'}</p>
            <Button size="sm" variant="outline" onClick={workspace.reload}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { period, corpus, facts, contradictions, styleSpec, noteVersions } = workspace.data;
  const graph = buildFactGraph(period.id, facts);
  const openContradictions = contradictions.filter((group) => group.status === 'open');
  const generationBlocked = graph.facts.length === 0 || openContradictions.length > 0 || !styleSpec?.isActive;

  const uploadPdf = async (file?: File) => {
    if (!file) return;
    await run(
      'upload',
      () => httpNotesStudioV2Repository.uploadCorpusSource(period.id, file),
      `Ingested ${file.name}; extracted facts are now available for reconciliation.`,
    );
  };

  const generate = async (subCategoryId?: string) => {
    await run(
      subCategoryId ? `generate-${subCategoryId}` : 'generate-topic',
      () => httpNotesStudioV2Repository.generateNote(buildGenerateNoteCommand({
        periodId: period.id,
        noteLevel: subCategoryId ? 'subcategory' : 'topic',
        subCategoryId,
      })),
      subCategoryId ? 'Generated a new three-language sub-category draft.' : 'Generated a new three-language period draft.',
    );
  };

  const runQuality = async (versionId: string) => {
    if (workspace.source !== 'http') return;
    setAction(`quality-${versionId}`);
    setMessage(null);
    try {
      const quality = await httpNotesStudioV2Repository.runQualityGates(versionId);
      setQualityByVersion((items) => ({ ...items, [versionId]: quality }));
      setMessage(quality.reviewReady ? 'Quality gates passed; this version is review-ready.' : 'Quality gates found blocking issues.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to run quality gates.');
    } finally {
      setAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="icon" asChild><Link to="/content/notes-studio-v2"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight">{period.name}</h1>
              <Badge variant="outline">Notes Studio v2</Badge>
              <Badge variant={workspace.source === 'http' ? 'default' : 'secondary'}>{workspace.source === 'http' ? 'Live API' : 'Mock data'}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Configure taxonomy, ingest sources, reconcile atomic facts, bootstrap style and publish versioned multilingual notes.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{corpus.length} sources</Badge>
          <Badge variant="secondary">{facts.length} facts</Badge>
          <Badge variant={openContradictions.length ? 'destructive' : 'default'}>{openContradictions.length} open contradiction(s)</Badge>
          <Button size="sm" variant="outline" onClick={workspace.reload}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
        </div>
      </div>

      {message && <div className="rounded-lg border bg-muted/30 p-3 text-sm">{message}</div>}

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="setup">0 Setup</TabsTrigger>
          <TabsTrigger value="corpus">1 Corpus</TabsTrigger>
          <TabsTrigger value="facts">2 Facts</TabsTrigger>
          <TabsTrigger value="reconcile">3 Reconcile</TabsTrigger>
          <TabsTrigger value="graph">4 Fact graph</TabsTrigger>
          <TabsTrigger value="style">Style bootstrap</TabsTrigger>
          <TabsTrigger value="generate">5 + 7 Generate</TabsTrigger>
          <TabsTrigger value="quality">6 Quality</TabsTrigger>
          <TabsTrigger value="review">8–9 Review & publish</TabsTrigger>
        </TabsList>

        <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
          Architecture mapping: Style Bootstrap calibrates the active StyleSpec before generation. The current generation endpoint combines source stages 5 and 7 by applying that approved style while independently generating English, Hindi and Punjabi from the same fact graph. Stage 6 refinement runs on the persisted generated version before review.
        </div>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5" />Period taxonomy</CardTitle>
              <CardDescription>No fixed template across periods. Admins define what matters for this era before corpus intake.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">{period.subCategories.map((item) => <Badge key={item.id} variant="outline">{item.orderIndex}. {item.name}</Badge>)}</div>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">Taxonomy routes extraction; optional hints never suppress otherwise valid facts.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corpus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Corpus intake</CardTitle>
              <CardDescription>PDF text is extracted in memory. Raw uploaded files are not persisted by the v2 ingestion route.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed p-4">
                <span className="text-sm"><Upload className="mr-2 inline h-4 w-4" />Upload PDF and extract atomic facts</span>
                <input
                  className="hidden"
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={workspace.source !== 'http' || action === 'upload'}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    void uploadPdf(file);
                    event.currentTarget.value = '';
                  }}
                />
              </label>
              {corpus.map((doc) => (
                <div key={doc.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div><p className="font-medium">{doc.title}</p><p className="text-xs text-muted-foreground">{doc.file}</p></div>
                    <Badge variant="secondary">{doc.sourceType}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(doc.subCategoryHints ?? []).map((hint) => <Badge key={hint} variant="outline">{hint}</Badge>)}
                    {!doc.subCategoryHints?.length && <span className="text-xs text-muted-foreground">No routing hints — extract across taxonomy.</span>}
                  </div>
                </div>
              ))}
              {!corpus.length && <p className="text-sm text-muted-foreground">No corpus sources have been ingested yet.</p>}
            </CardContent>
          </Card>
          <AdvisoryMetadataPanel periodId={period.id} source={workspace.source} section="corpus" />
        </TabsContent>

        <TabsContent value="facts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5" />Atomic fact extraction</CardTitle>
              <CardDescription>Normal fact review shows distilled claims and traceability counts, not raw source prose.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {facts.map((fact) => (
                <div key={fact.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="text-xs text-muted-foreground">{fact.id}</code>
                    <Badge variant="outline">{fact.subCategory}</Badge>
                    <Badge variant={confidenceVariant(fact.confidence)}>{fact.confidence}</Badge>
                    {fact.examFrequency && <Badge variant="secondary">PYQ {fact.examFrequency}</Badge>}
                  </div>
                  <p className="mt-3 text-sm font-medium">{fact.claim}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Entities: {fact.entities.join(', ') || '—'} · {fact.sourceRefs.length} source reference(s)</p>
                </div>
              ))}
              {!facts.length && <p className="text-sm text-muted-foreground">Upload corpus sources to extract facts.</p>}
            </CardContent>
          </Card>
          <AdvisoryMetadataPanel periodId={period.id} source={workspace.source} section="facts" />
        </TabsContent>

        <TabsContent value="reconcile">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2"><GitCompareArrows className="h-5 w-5" />Contradiction resolution</CardTitle>
                  <CardDescription>Raw verification spans are allowed here for administrator judgment.</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => void run('reconcile', () => httpNotesStudioV2Repository.reconcilePeriod(period.id), 'Reconciliation completed.')}
                  disabled={workspace.source !== 'http' || action === 'reconcile' || facts.length === 0}
                >
                  Run reconciliation
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {openContradictions.map((group) => (
                <div key={group.id} className="rounded-lg border border-destructive/30 p-4">
                  <div className="mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /><p className="font-medium">{group.id}</p><Badge variant="destructive">open</Badge></div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    {group.factIds.map((factId) => {
                      const fact = facts.find((item) => item.id === factId);
                      if (!fact) return null;
                      return (
                        <div key={fact.id} className="rounded-md border bg-muted/20 p-3">
                          <p className="text-sm font-medium">{fact.claim}</p>
                          {fact.sourceRefs.map((ref) => (
                            <div key={`${ref.corpusDocId}-${ref.locator}`} className="mt-3 rounded border bg-background p-3">
                              <p className="text-xs font-medium">{ref.corpusDocId} · {ref.locator}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{ref.extractedText ?? 'No verification span stored.'}</p>
                            </div>
                          ))}
                          <Button
                            className="mt-3"
                            size="sm"
                            variant="outline"
                            onClick={() => void run(`resolve-${group.id}`, () => httpNotesStudioV2Repository.resolveContradiction(group.id, { resolution: 'select', selectedFactId: fact.id }), 'Contradiction resolved by selecting the approved claim.')}
                          >
                            Select this claim
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void run(`alternate-${group.id}`, () => httpNotesStudioV2Repository.resolveContradiction(group.id, { resolution: 'alternate-positions', resolutionNote: 'Administrator retained both claims as valid alternate positions.' }), 'Alternate scholarly positions retained.')}
                    >
                      Keep alternate positions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const qualifiedClaim = window.prompt('Enter the qualified merged claim:')?.trim();
                        if (!qualifiedClaim) return;
                        void run(`merge-${group.id}`, () => httpNotesStudioV2Repository.resolveContradiction(group.id, { resolution: 'qualified-merge', qualifiedClaim }), 'Qualified merged claim created.');
                      }}
                    >
                      Qualified merge…
                    </Button>
                  </div>
                </div>
              ))}
              {!openContradictions.length && <p className="text-sm text-muted-foreground">No unresolved contradictions are currently blocking the fact graph.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5" />Source-agnostic fact graph</CardTitle>
              <CardDescription>Only distilled generation fields cross this boundary. sourceRefs and extractedText do not exist on this shape.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {graph.facts.map((fact) => (
                <div key={fact.id} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2"><Badge variant="outline">{fact.subCategory}</Badge><code className="text-xs text-muted-foreground">{fact.id}</code>{fact.examFrequency && <Badge variant="secondary">PYQ {fact.examFrequency}</Badge>}</div>
                  <p className="mt-2 text-sm font-medium">{fact.claim}</p>
                </div>
              ))}
              {!graph.facts.length && <p className="text-sm text-muted-foreground">No facts are currently eligible.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style">
          <StyleBootstrapPanel
            period={period}
            activeStyleSpec={styleSpec}
            eligibleFactCount={graph.facts.length}
            source={workspace.source}
            onActivated={workspace.reload}
          />
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5" />Stages 5 + 7 · style-conditioned multilingual generation</CardTitle>
              <CardDescription>The browser sends only target IDs. The server rebuilds the fact graph, applies the approved StyleSpec/exemplars, then makes separate en, hi and pa model calls from that same graph.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2"><Badge>en</Badge><Badge>hi</Badge><Badge>pa</Badge></div>
              <div className="rounded-lg border p-4"><p className="font-medium">Generation eligibility</p><p className="mt-1 text-sm text-muted-foreground">{graph.facts.length} eligible facts · {openContradictions.length} unresolved contradictions · StyleSpec {styleSpec?.isActive ? 'active' : 'not active'}</p></div>
              <Button onClick={() => void generate()} disabled={workspace.source !== 'http' || generationBlocked || action === 'generate-topic'}>Generate full period note</Button>
              <div className="flex flex-wrap gap-2">
                {period.subCategories.map((sub) => (
                  <Button key={sub.id} size="sm" variant="outline" onClick={() => void generate(sub.id)} disabled={workspace.source !== 'http' || generationBlocked || action === `generate-${sub.id}`}>Generate {sub.name} deep dive</Button>
                ))}
              </div>
              {generationBlocked && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">Generation remains blocked until eligible facts exist, all contradictions are resolved, and an active StyleSpec exists.</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Stage 6 · refinement gates</CardTitle>
              <CardDescription>Run after generation. Factual accuracy and source-overlap review may use verification evidence; exam frequency stays advisory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {noteVersions.map((version) => {
                const quality = qualityByVersion[version.id];
                return (
                  <div key={version.id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div><p className="font-medium">Version {version.versionNumber}</p><p className="text-xs text-muted-foreground">{version.generatedFromFactIds.length} source-agnostic fact IDs</p></div>
                      <Button size="sm" variant="outline" onClick={() => void runQuality(version.id)} disabled={workspace.source !== 'http' || action === `quality-${version.id}`}>Run quality gates</Button>
                    </div>
                    {quality && (
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {quality.gates.map((gate) => (
                          <div key={gate.key} className="rounded border p-3">
                            <div className="flex items-center justify-between"><span className="text-sm font-medium">{gate.key}</span><Badge variant={gate.passed ? 'default' : 'destructive'}>{gate.passed ? 'pass' : 'blocked'}</Badge></div>
                            {gate.findings.map((finding) => <p key={`${finding.code}-${finding.message}`} className="mt-2 text-xs text-muted-foreground">{finding.message}</p>)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {!noteVersions.length && <p className="text-sm text-muted-foreground">Generate a draft before running quality gates.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" />Stages 8–9 · review queue and publish</CardTitle>
              <CardDescription>Published versions are immutable. Further edits begin as a new draft revision.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {noteVersions.map((version) => (
                <div key={version.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div><p className="font-medium">Version {version.versionNumber}</p><p className="text-xs text-muted-foreground">Created {new Date(version.createdAt).toLocaleString()}</p></div>
                    <Badge variant={version.status === 'published' ? 'default' : 'outline'}>{version.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {version.status === 'draft' && <Button size="sm" variant="outline" onClick={() => void run(`review-${version.id}`, () => httpNotesStudioV2Repository.submitNoteForReview(version.id), 'Version submitted for review.')}>Submit for review</Button>}
                    {version.status === 'in-review' && <Button size="sm" onClick={() => void run(`publish-${version.id}`, () => httpNotesStudioV2Repository.publishNoteVersion(version.id), 'Version published.')}>Publish</Button>}
                    {version.status === 'published' && <Button size="sm" variant="outline" onClick={() => void run(`revision-${version.noteId}`, () => httpNotesStudioV2Repository.createRevision(version.noteId), 'New draft revision created from the published version.')}>Create revision</Button>}
                  </div>
                </div>
              ))}
              {!noteVersions.length && <p className="text-sm text-muted-foreground">No note versions exist yet.</p>}
            </CardContent>
          </Card>

          <FigureReviewQueue periodId={period.id} source={workspace.source} versionCount={noteVersions.length} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
