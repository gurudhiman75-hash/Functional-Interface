import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NoteVersionContentReview } from './NoteVersionContentReview';
import type { FigureQueueResponse } from '../services/reviewStateApi';
import { httpNotesStudioV2Repository } from '../services/repository';

interface FigureReviewQueueProps {
  periodId: string;
  source: 'http' | 'mock';
  versionCount: number;
}

export function FigureReviewQueue({ periodId, source, versionCount }: FigureReviewQueueProps) {
  const [queue, setQueue] = useState<FigureQueueResponse | null>(null);
  const [svgRefs, setSvgRefs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(source === 'http');
  const [action, setAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (source !== 'http') {
      setQueue({ periodId, neededCount: 0, figures: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setQueue(await httpNotesStudioV2Repository.listPeriodFigures(periodId));
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to load the figure review queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // A version-count change means generation or revision created a new persisted version.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodId, source, versionCount]);

  const attach = async (figureId: string) => {
    const svgRef = svgRefs[figureId]?.trim();
    if (!svgRef) {
      setMessage('Enter the reviewed SVG reference before attaching it.');
      return;
    }
    setAction(figureId);
    setMessage(null);
    try {
      await httpNotesStudioV2Repository.attachFigure(figureId, svgRef);
      setMessage('SVG reference attached. The figure placeholder is no longer blocking publication.');
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to attach the SVG reference.');
    } finally {
      setAction(null);
    }
  };

  return (
    <div className="space-y-4">
      <NoteVersionContentReview periodId={periodId} source={source} versionCount={versionCount} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Figure review queue</CardTitle>
              <CardDescription>
                Generated figure blocks remain placeholders until an administrator creates or reviews the visual using the existing SVG/media workflow and attaches its reference here.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/content/media">Open SVG media workflow</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading || source !== 'http'}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh queue
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {source === 'mock' && <p className="text-sm text-muted-foreground">Mock mode does not have a persisted figure queue.</p>}
          {loading && <p className="text-sm text-muted-foreground">Loading figure placeholders…</p>}

          {queue && (
            <div className="rounded-lg border bg-muted/20 p-3 text-sm">
              <span className="font-medium">{queue.neededCount}</span> figure placeholder(s) still need reviewed SVG references.
            </div>
          )}

          {queue?.figures.map((figure) => (
            <div key={figure.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={figure.status === 'needed' ? 'secondary' : 'default'}>{figure.status}</Badge>
                    <Badge variant="outline">v{figure.versionNumber}</Badge>
                    <Badge variant="outline">{figure.noteLevel === 'topic' ? 'period note' : figure.subCategory ?? 'deep dive'}</Badge>
                  </div>
                  <p className="mt-3 font-medium">{figure.placeholderDescription}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Block {figure.blockRef} · note version {figure.noteVersionId}</p>
                </div>
              </div>

              {figure.status === 'created' ? (
                <div className="mt-3 rounded-md border bg-muted/20 p-3 text-sm">
                  <span className="font-medium">SVG:</span> {figure.svgRef}
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Create or upload the reviewed SVG through the existing Media Library workflow, then paste its canonical media reference below.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={svgRefs[figure.id] ?? ''}
                      onChange={(event) => setSvgRefs((items) => ({ ...items, [figure.id]: event.target.value }))}
                      placeholder="Existing GEO/SVG media reference"
                    />
                    <Button size="sm" onClick={() => void attach(figure.id)} disabled={source !== 'http' || action === figure.id}>
                      Attach reviewed SVG
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {queue && queue.figures.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">No generated figure placeholders exist for this period yet.</p>
          )}
          {message && <div className="rounded-md border bg-muted/30 p-3 text-sm">{message}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
