import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { LocalizedNotes, NoteBlock, NoteLanguage, NoteVersion } from '../domain/types';
import { httpNotesStudioV2Repository } from '../services/repository';

const LANGUAGES: Array<{ code: NoteLanguage; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'pa', label: 'Punjabi' },
];

interface NoteVersionContentReviewProps {
  periodId: string;
  source: 'http' | 'mock';
  versionCount: number;
}

function cloneLocalizedNotes(value: LocalizedNotes): LocalizedNotes {
  return {
    en: value.en.map((block) => ({ ...block })),
    hi: value.hi.map((block) => ({ ...block })),
    pa: value.pa.map((block) => ({ ...block })),
  };
}

export function NoteVersionContentReview({ periodId, source, versionCount }: NoteVersionContentReviewProps) {
  const [versions, setVersions] = useState<NoteVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [draft, setDraft] = useState<LocalizedNotes | null>(null);
  const [loading, setLoading] = useState(source === 'http');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (source !== 'http') {
      setVersions([]);
      setDraft(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const workspace = await httpNotesStudioV2Repository.getWorkspace(periodId);
      setVersions(workspace.noteVersions);
      const nextId = workspace.noteVersions.some((version) => version.id === selectedVersionId)
        ? selectedVersionId
        : workspace.noteVersions[0]?.id ?? '';
      setSelectedVersionId(nextId);
      const selected = workspace.noteVersions.find((version) => version.id === nextId);
      setDraft(selected ? cloneLocalizedNotes(selected.blocksByLanguage) : null);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to load note versions for content review.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // versionCount is an explicit invalidation signal from generation/revision in the parent workspace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodId, source, versionCount]);

  const selectedVersion = useMemo(
    () => versions.find((version) => version.id === selectedVersionId) ?? null,
    [selectedVersionId, versions],
  );

  const selectVersion = (versionId: string) => {
    setSelectedVersionId(versionId);
    const version = versions.find((item) => item.id === versionId);
    setDraft(version ? cloneLocalizedNotes(version.blocksByLanguage) : null);
    setMessage(null);
  };

  const replaceBlock = (language: NoteLanguage, index: number, block: NoteBlock) => {
    setDraft((current) => {
      if (!current) return current;
      const next = cloneLocalizedNotes(current);
      next[language][index] = block;
      return next;
    });
  };

  const save = async () => {
    if (!selectedVersion || !draft || selectedVersion.status === 'published' || source !== 'http') return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await httpNotesStudioV2Repository.updateDraftBlocks(selectedVersion.id, draft);
      setVersions((items) => items.map((item) => item.id === updated.id ? updated : item));
      setDraft(cloneLocalizedNotes(updated.blocksByLanguage));
      setMessage('Note edits saved. Previous quality evidence was invalidated; rerun quality before review/publication.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to save note edits.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multilingual note content review</CardTitle>
        <CardDescription>
          Spot-check and edit the three independently generated language versions. Published versions are read-only; editing a draft or in-review version requires a fresh quality run.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {source === 'mock' && <p className="text-sm text-muted-foreground">Content review persistence requires HTTP mode.</p>}
        {loading && <p className="text-sm text-muted-foreground">Loading generated note versions…</p>}

        {versions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {versions.map((version) => (
              <Button
                key={version.id}
                size="sm"
                variant={selectedVersionId === version.id ? 'default' : 'outline'}
                onClick={() => selectVersion(version.id)}
              >
                v{version.versionNumber} · {version.status}
              </Button>
            ))}
          </div>
        )}

        {selectedVersion && draft && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={selectedVersion.status === 'published' ? 'default' : 'outline'}>{selectedVersion.status}</Badge>
                <span className="text-sm font-medium">Version {selectedVersion.versionNumber}</span>
                <span className="text-xs text-muted-foreground">{selectedVersion.generatedFromFactIds.length} traced fact IDs</span>
              </div>
              {selectedVersion.status !== 'published' && (
                <Button size="sm" onClick={() => void save()} disabled={saving || source !== 'http'}>
                  <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving…' : 'Save note edits'}
                </Button>
              )}
            </div>

            <Tabs defaultValue="en" className="space-y-3">
              <TabsList>
                {LANGUAGES.map(({ code, label }) => <TabsTrigger key={code} value={code}>{label}</TabsTrigger>)}
              </TabsList>
              {LANGUAGES.map(({ code, label }) => (
                <TabsContent key={code} value={code} className="space-y-3">
                  <div className="rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
                    {label} was generated independently from the same fact graph. Editing here does not alter the other language versions.
                  </div>
                  {draft[code].map((block, index) => (
                    <div key={`${code}-${index}`} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <Badge variant="secondary">{block.type}</Badge>
                      </div>

                      {block.type === 'text' && (
                        <Textarea
                          rows={7}
                          value={block.content}
                          readOnly={selectedVersion.status === 'published'}
                          onChange={(event) => replaceBlock(code, index, { ...block, content: event.target.value })}
                        />
                      )}

                      {block.type === 'formula' && (
                        <Input
                          value={block.latex}
                          readOnly={selectedVersion.status === 'published'}
                          onChange={(event) => replaceBlock(code, index, { ...block, latex: event.target.value })}
                        />
                      )}

                      {block.type === 'example' && (
                        <div className="space-y-3">
                          <Textarea
                            rows={3}
                            value={block.problem}
                            readOnly={selectedVersion.status === 'published'}
                            onChange={(event) => replaceBlock(code, index, { ...block, problem: event.target.value })}
                            placeholder="Example/problem"
                          />
                          <Textarea
                            rows={5}
                            value={block.solution}
                            readOnly={selectedVersion.status === 'published'}
                            onChange={(event) => replaceBlock(code, index, { ...block, solution: event.target.value })}
                            placeholder="Solution/explanation"
                          />
                        </div>
                      )}

                      {block.type === 'figure' && (
                        <div className="rounded-md border border-dashed bg-muted/20 p-3 text-sm">
                          <p className="font-medium">{block.placeholder ?? 'Figure placeholder'}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Figure content is reviewed through the separate figure queue so the SVG reference and publication blocker remain synchronized.
                          </p>
                          {block.svgRef && <p className="mt-2 text-xs">SVG: {block.svgRef}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                  {draft[code].length === 0 && <p className="text-sm text-muted-foreground">No {label} blocks are present.</p>}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}

        {!loading && versions.length === 0 && <p className="text-sm text-muted-foreground">Generate a note version before content review.</p>}
        {message && <div className="rounded-md border bg-muted/30 p-3 text-sm">{message}</div>}
      </CardContent>
    </Card>
  );
}
