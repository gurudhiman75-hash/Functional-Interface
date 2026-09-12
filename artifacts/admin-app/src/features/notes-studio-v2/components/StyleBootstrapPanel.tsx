import { useEffect, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Period, StyleSpec } from '../domain/types';
import type { StyleBootstrapState } from '../services/reviewStateApi';
import { httpNotesStudioV2Repository } from '../services/repository';

interface StyleBootstrapPanelProps {
  period: Period;
  activeStyleSpec: StyleSpec | null;
  eligibleFactCount: number;
  source: 'http' | 'mock';
  onActivated: () => void;
}

export function StyleBootstrapPanel({
  period,
  activeStyleSpec,
  eligibleFactCount,
  source,
  onActivated,
}: StyleBootstrapPanelProps) {
  const [state, setState] = useState<StyleBootstrapState | null>(null);
  const [loading, setLoading] = useState(source === 'http' && !activeStyleSpec?.isActive);
  const [action, setAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingChoice, setPendingChoice] = useState<Record<string, string>>({});
  const [editedOutput, setEditedOutput] = useState<Record<string, string>>({});

  const load = async () => {
    if (source !== 'http' || activeStyleSpec?.isActive) {
      setState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setState(await httpNotesStudioV2Repository.getStyleBootstrapState());
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to load Style Bootstrap state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // The active style id is the lifecycle boundary that invalidates resumable draft state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, activeStyleSpec?.id, activeStyleSpec?.isActive]);

  const firstSubCategory = period.subCategories[0];

  const start = async () => {
    if (source !== 'http' || !firstSubCategory) return;
    setAction('start');
    setMessage(null);
    try {
      const styleSpec = state?.styleSpec ?? await httpNotesStudioV2Repository.createStyleSpec({
        name: `${period.name} house style`,
        tone: 'clear, concise, exam-friendly',
        sentenceLength: 'mixed',
        exampleStructure: 'Compact structured revision notes.',
        avoid: ['source-like wording', 'unsupported additions'],
      });
      await httpNotesStudioV2Repository.createStyleBootstrapRound({
        styleSpecId: styleSpec.id,
        periodId: period.id,
        subCategoryId: firstSubCategory.id,
        roughTone: 'clear, concise, exam-friendly',
      });
      setMessage('Style Bootstrap round generated. Pick a variant, then edit or merge it before approval.');
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to start Style Bootstrap.');
    } finally {
      setAction(null);
    }
  };

  const chooseVariant = (roundId: string, label: string, content: string) => {
    setPendingChoice((items) => ({ ...items, [roundId]: label }));
    setEditedOutput((items) => ({ ...items, [roundId]: content }));
  };

  const approveRound = async (roundId: string) => {
    const label = pendingChoice[roundId];
    if (!state || !label) return;
    setAction(`approve-${roundId}`);
    setMessage(null);
    try {
      await httpNotesStudioV2Repository.reviewStyleBootstrapRound(state.styleSpec.id, roundId, {
        selectedVariantLabel: label,
        adminEdits: editedOutput[roundId]?.trim() || undefined,
      });
      setPendingChoice((items) => {
        const next = { ...items };
        delete next[roundId];
        return next;
      });
      setMessage('Reviewed output saved. This decision will survive a page reload.');
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to save the reviewed style output.');
    } finally {
      setAction(null);
    }
  };

  const nextRound = async () => {
    if (!state || !firstSubCategory) return;
    setAction('next');
    setMessage(null);
    try {
      await httpNotesStudioV2Repository.createStyleBootstrapRound({
        styleSpecId: state.styleSpec.id,
        periodId: period.id,
        subCategoryId: firstSubCategory.id,
        roughTone: 'Refine toward the administrator-approved prior outputs without copying source prose.',
      });
      setMessage('Next refinement round generated from the reviewed Style Bootstrap history.');
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to generate the next Style Bootstrap round.');
    } finally {
      setAction(null);
    }
  };

  const activate = async () => {
    if (!state) return;
    setAction('activate');
    setMessage(null);
    try {
      await httpNotesStudioV2Repository.activateStyleSpec(state.styleSpec.id);
      setMessage('StyleSpec derived and activated. Generation may now use it.');
      setState(null);
      onActivated();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to activate the StyleSpec.');
    } finally {
      setAction(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />AI-assisted Style Bootstrap</CardTitle>
            <CardDescription>
              Generate four variants, pick/edit/merge the best output, repeat for 2–3 reviewed rounds, then derive the reusable StyleSpec.
            </CardDescription>
          </div>
          {source === 'http' && !activeStyleSpec?.isActive && (
            <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Resume state
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeStyleSpec?.isActive ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2"><Badge>active</Badge><p className="font-medium">{activeStyleSpec.name}</p></div>
            <p className="mt-2 text-sm text-muted-foreground">Tone: {activeStyleSpec.tone} · sentence length: {activeStyleSpec.sentenceLength}</p>
            <p className="mt-1 text-xs text-muted-foreground">This StyleSpec is derived from reviewed bootstrap outputs and is reusable across future notes.</p>
          </div>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading persisted Style Bootstrap state…</p>
        ) : (
          <>
            {!state && (
              <Button
                onClick={() => void start()}
                disabled={source !== 'http' || action === 'start' || eligibleFactCount === 0 || !firstSubCategory}
              >
                Start Style Bootstrap
              </Button>
            )}

            {state && (
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">resumable draft</Badge>
                  <p className="font-medium">{state.styleSpec.name}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {state.rounds.length} round(s) persisted · {state.reviewedCount} reviewed · activation {state.canActivate ? 'eligible' : 'needs more review'}
                </p>
              </div>
            )}

            {state?.rounds.map((round) => {
              const choice = pendingChoice[round.id];
              return (
                <div key={round.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">Round {round.roundNumber}</p>
                    {round.selectedVariantLabel && <Badge variant="secondary">reviewed: {round.selectedVariantLabel}</Badge>}
                  </div>

                  {round.selectedVariantLabel ? (
                    <div className="rounded-md border bg-muted/20 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Approved output</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {round.adminEdits || round.variants.find((variant) => variant.label === round.selectedVariantLabel)?.content || 'Reviewed output saved.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3 lg:grid-cols-2">
                        {round.variants.map((variant) => (
                          <button
                            key={variant.label}
                            type="button"
                            className={`rounded-md border p-3 text-left hover:bg-muted/40 ${choice === variant.label ? 'ring-2 ring-ring' : ''}`}
                            onClick={() => chooseVariant(round.id, variant.label, variant.content)}
                          >
                            <p className="text-sm font-medium">{variant.label}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{variant.content}</p>
                          </button>
                        ))}
                      </div>
                      {choice && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <p className="text-sm font-medium">Edit or merge the selected output</p>
                            <p className="text-xs text-muted-foreground">You may combine wording from other variants here. The saved reviewed output becomes bootstrap evidence for the next round.</p>
                          </div>
                          <Textarea
                            rows={8}
                            value={editedOutput[round.id] ?? ''}
                            onChange={(event) => setEditedOutput((items) => ({ ...items, [round.id]: event.target.value }))}
                          />
                          <Button size="sm" onClick={() => void approveRound(round.id)} disabled={action === `approve-${round.id}`}>
                            Approve reviewed output
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            {state && state.rounds.length === 0 && (
              <Button onClick={() => void start()} disabled={action === 'start' || eligibleFactCount === 0}>Generate round 1</Button>
            )}
            {state?.canGenerateAnotherRound && state.rounds.length > 0 && (
              <Button variant="outline" onClick={() => void nextRound()} disabled={action === 'next'}>Generate next refinement round</Button>
            )}
            {state?.canActivate && (
              <Button onClick={() => void activate()} disabled={action === 'activate'}>Derive & activate StyleSpec</Button>
            )}
          </>
        )}

        {eligibleFactCount === 0 && !activeStyleSpec?.isActive && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">Extract and reconcile eligible facts before bootstrapping style.</div>
        )}
        {source === 'mock' && <p className="text-sm text-muted-foreground">Mock mode is read-only; Style Bootstrap persistence requires HTTP mode.</p>}
        {message && <div className="rounded-md border bg-muted/30 p-3 text-sm">{message}</div>}
      </CardContent>
    </Card>
  );
}
