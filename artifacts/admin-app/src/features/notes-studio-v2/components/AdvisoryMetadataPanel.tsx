import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CorpusDoc, ExamFrequency, Fact } from '../domain/types';
import type { ExamFrequencySummary, NotesStudioV2Workspace } from '../services/api';
import { httpNotesStudioV2Repository } from '../services/repository';

interface AdvisoryMetadataPanelProps {
  periodId: string;
  source: 'http' | 'mock';
  section: 'corpus' | 'facts';
}

const SOURCE_TYPES: CorpusDoc['sourceType'][] = ['textbook', 'reference', 'academic', 'other'];
const FREQUENCIES: ExamFrequency[] = ['high', 'medium', 'low'];

export function AdvisoryMetadataPanel({ periodId, source, section }: AdvisoryMetadataPanelProps) {
  const [workspace, setWorkspace] = useState<NotesStudioV2Workspace | null>(null);
  const [summary, setSummary] = useState<ExamFrequencySummary | null>(null);
  const [loading, setLoading] = useState(source === 'http');
  const [action, setAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (source !== 'http') {
      setWorkspace(null);
      setSummary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const nextWorkspace = await httpNotesStudioV2Repository.getWorkspace(periodId);
      setWorkspace(nextWorkspace);
      if (section === 'facts') {
        setSummary(await httpNotesStudioV2Repository.getExamFrequencySummary(periodId));
      } else {
        setSummary(null);
      }
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to load advisory metadata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodId, source, section]);

  const taxonomyNames = useMemo(
    () => workspace?.period.subCategories.map((item) => item.name) ?? [],
    [workspace],
  );

  const setSourceType = async (doc: CorpusDoc, sourceType: CorpusDoc['sourceType']) => {
    if (source !== 'http') return;
    setAction(`source-${doc.id}`);
    setMessage(null);
    try {
      await httpNotesStudioV2Repository.updateCorpusMetadata(doc.id, { sourceType });
      setMessage('Corpus source class updated. This is extraction/review metadata, not a generation filter.');
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to update corpus metadata.');
    } finally {
      setAction(null);
    }
  };

  const toggleHint = async (doc: CorpusDoc, hint: string) => {
    if (source !== 'http') return;
    const current = new Set(doc.subCategoryHints ?? []);
    if (current.has(hint)) current.delete(hint);
    else current.add(hint);
    setAction(`hint-${doc.id}`);
    setMessage(null);
    try {
      await httpNotesStudioV2Repository.updateCorpusMetadata(doc.id, {
        subCategoryHints: [...current],
      });
      setMessage('Corpus routing hints updated. Facts outside these hints remain eligible and must not be suppressed.');
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to update routing hints.');
    } finally {
      setAction(null);
    }
  };

  const setFrequency = async (fact: Fact, examFrequency: ExamFrequency | null) => {
    if (source !== 'http') return;
    setAction(`frequency-${fact.id}`);
    setMessage(null);
    try {
      const result = await httpNotesStudioV2Repository.updateFactExamFrequency(fact.id, examFrequency);
      setMessage(
        result.generationEligibilityChanged
          ? 'Unexpected eligibility change detected.'
          : 'PYQ frequency updated as advisory metadata only; fact eligibility did not change.',
      );
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to update PYQ frequency metadata.');
    } finally {
      setAction(null);
    }
  };

  const isCorpus = section === 'corpus';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{isCorpus ? 'Corpus routing metadata' : 'PYQ / exam-frequency metadata'}</CardTitle>
            <CardDescription>
              {isCorpus
                ? 'Source class and taxonomy hints help route extraction. Hints are optional and never hard constraints or generation filters.'
                : 'High/medium/low exam-frequency tags guide emphasis only. Low-frequency and untagged facts remain eligible for exhaustive coverage.'}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading || source !== 'http'}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh metadata
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {source === 'mock' && <p className="text-sm text-muted-foreground">Advisory metadata persistence requires HTTP mode.</p>}
        {loading && <p className="text-sm text-muted-foreground">Loading advisory metadata…</p>}

        {!isCorpus && summary && (
          <div className="grid gap-2 sm:grid-cols-5">
            {[
              ['High', summary.high],
              ['Medium', summary.medium],
              ['Low', summary.low],
              ['Untagged', summary.untagged],
              ['Total', summary.total],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-md border bg-muted/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}

        {workspace && isCorpus && (
          <div className="space-y-3">
            {workspace.corpus.map((doc) => (
              <div key={doc.id} className="rounded-lg border p-4">
                <p className="font-medium">{doc.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SOURCE_TYPES.map((sourceType) => (
                    <Button
                      key={sourceType}
                      type="button"
                      size="sm"
                      variant={doc.sourceType === sourceType ? 'default' : 'outline'}
                      disabled={action === `source-${doc.id}`}
                      onClick={() => void setSourceType(doc, sourceType)}
                    >
                      {sourceType}
                    </Button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {taxonomyNames.map((hint) => {
                    const active = doc.subCategoryHints?.includes(hint) ?? false;
                    return (
                      <Button
                        key={hint}
                        type="button"
                        size="sm"
                        variant={active ? 'secondary' : 'outline'}
                        disabled={action === `hint-${doc.id}`}
                        onClick={() => void toggleHint(doc, hint)}
                      >
                        {active ? '✓ ' : ''}{hint}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
            {workspace.corpus.length === 0 && <p className="text-sm text-muted-foreground">No corpus sources are available yet.</p>}
          </div>
        )}

        {workspace && !isCorpus && (
          <div className="space-y-3">
            {workspace.facts.map((fact) => (
              <div key={fact.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{fact.subCategory}</Badge>
                      <Badge variant="secondary">{fact.confidence}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium">{fact.claim}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {FREQUENCIES.map((frequency) => (
                      <Button
                        key={frequency}
                        type="button"
                        size="sm"
                        variant={fact.examFrequency === frequency ? 'default' : 'outline'}
                        disabled={action === `frequency-${fact.id}`}
                        onClick={() => void setFrequency(fact, frequency)}
                      >
                        {frequency}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant={!fact.examFrequency ? 'secondary' : 'ghost'}
                      disabled={action === `frequency-${fact.id}`}
                      onClick={() => void setFrequency(fact, null)}
                    >
                      clear
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {workspace.facts.length === 0 && <p className="text-sm text-muted-foreground">No facts are available to tag.</p>}
          </div>
        )}

        {message && <div className="rounded-md border bg-muted/30 p-3 text-sm">{message}</div>}
      </CardContent>
    </Card>
  );
}
