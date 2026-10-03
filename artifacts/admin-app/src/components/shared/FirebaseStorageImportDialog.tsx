import { useEffect, useMemo, useState } from 'react';
import { Check, CloudDownload, FileImage, Loader2, RefreshCw, Search } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MEDIA_TYPES,
  formatMediaBytes,
  importFirebaseStorageImages,
  listFirebaseStorageImages,
  type FirebaseStorageImage,
  type LiveMediaAsset,
  type MediaAssetType,
} from '@/lib/media-assets';

export function FirebaseStorageImportDialog({
  open,
  onOpenChange,
  preferredType = 'Exam Icon',
  onImported,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferredType?: MediaAssetType;
  onImported?: (assets: LiveMediaAsset[]) => void;
}) {
  const [files, setFiles] = useState<FirebaseStorageImage[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [type, setType] = useState<MediaAssetType>(preferredType);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setFiles(await listFirebaseStorageImages());
    } catch (error) {
      showToast.error(
        'Unable to read Firebase Storage',
        error instanceof Error ? error.message : 'Request failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setType(preferredType);
    setSearch('');
    setSelected(new Set());
    void load();
  }, [open, preferredType]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return files.filter((file) =>
      !q || file.name.toLowerCase().includes(q) || file.path.toLowerCase().includes(q),
    );
  }, [files, search]);

  const selectable = visible.filter((file) => !file.imported);
  const allVisibleSelected =
    selectable.length > 0 && selectable.every((file) => selected.has(file.path));

  const toggle = (path: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const importSelected = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const result = await importFirebaseStorageImages([...selected], type);
      if (result.assets.length > 0) {
        showToast.success(
          'Firebase images imported',
          `${result.assets.length} image${result.assets.length === 1 ? '' : 's'} added to Media Library.`,
        );
        onImported?.(result.assets);
      }
      if (result.skipped.length > 0) {
        showToast.info(
          'Some files were skipped',
          'Files already imported, missing, unsupported, or larger than 10 MB were skipped.',
        );
      }
      setSelected(new Set());
      await load();
    } catch (error) {
      showToast.error(
        'Import failed',
        error instanceof Error ? error.message : 'Unable to import Firebase images.',
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !importing && onOpenChange(next)}>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CloudDownload className="h-5 w-5" />
            Import from Firebase Storage
          </DialogTitle>
          <DialogDescription>
            Existing images uploaded directly to your Firebase bucket can be registered in Examtree without uploading them again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Firebase Storage…"
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={(value) => setType(value as MediaAssetType)}>
            <SelectTrigger className="lg:w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MEDIA_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={() => void load()} disabled={loading || importing}>
            <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Storage
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {files.filter((file) => !file.imported).length} not yet in Media Library · {files.filter((file) => file.imported).length} already imported
          </span>
          {selectable.length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelected((current) => {
                  const next = new Set(current);
                  if (allVisibleSelected) selectable.forEach((file) => next.delete(file.path));
                  else selectable.forEach((file) => next.add(file.path));
                  return next;
                });
              }}
            >
              {allVisibleSelected ? 'Clear visible' : 'Select visible'}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reading Firebase Storage…
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed py-14 text-center text-sm text-muted-foreground">
            No supported PNG, JPG, WebP or SVG files found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((file) => {
              const isSelected = selected.has(file.path);
              return (
                <button
                  key={file.path}
                  type="button"
                  disabled={file.imported}
                  onClick={() => toggle(file.path)}
                  className={`overflow-hidden rounded-xl border text-left transition ${file.imported
                    ? 'cursor-default opacity-70'
                    : isSelected
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'hover:border-primary/60 hover:shadow-sm'}`}
                >
                  <div className="relative aspect-video bg-muted">
                    {file.url ? (
                      <img src={file.url} alt={file.name} className="h-full w-full object-contain" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileImage className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      {file.imported ? (
                        <Badge className="bg-background/90 text-foreground" variant="outline">In Library</Badge>
                      ) : isSelected ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-1 p-2.5">
                    <p className="truncate text-xs font-semibold">{file.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{file.path}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground">{file.mimeType}</span>
                      <span className="text-[10px] text-muted-foreground">{formatMediaBytes(file.byteSize)}</span>
                    </div>
                    {file.imported && file.assetType ? (
                      <Badge variant="outline" className="mt-1 text-[10px]">{file.assetType}</Badge>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Close
          </Button>
          <Button type="button" onClick={() => void importSelected()} disabled={selected.size === 0 || importing}>
            {importing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <CloudDownload className="mr-1.5 h-4 w-4" />}
            {importing ? 'Importing…' : `Import selected (${selected.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FirebaseStorageImportDialog;
