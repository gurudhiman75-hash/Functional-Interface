import { useEffect, useMemo, useRef, useState } from 'react';
import { Archive, Clipboard, CloudDownload, FileImage, Image as ImageIcon, RefreshCw, Search, Upload } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { FirebaseStorageImportDialog } from '@/components/shared/FirebaseStorageImportDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  MEDIA_TYPES, formatMediaBytes, type LiveMediaAsset, type MediaAssetStatus,
  type MediaAssetType, listMediaAssets, setMediaAssetStatus, uploadMediaAsset,
} from '@/lib/media-assets';

export function MediaLibraryPage(){
  const[assets,setAssets]=useState<LiveMediaAsset[]>([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState('');
  const[type,setType]=useState<MediaAssetType|'all'>('all');
  const[status,setStatus]=useState<MediaAssetStatus|'all'>('active');
  const[preview,setPreview]=useState<LiveMediaAsset|null>(null);
  const[uploadOpen,setUploadOpen]=useState(false);
  const[storageOpen,setStorageOpen]=useState(false);
  const[uploadType,setUploadType]=useState<MediaAssetType>('Home Banner');
  const[uploading,setUploading]=useState(false);
  const inputRef=useRef<HTMLInputElement|null>(null);

  const refresh=async()=>{
    setLoading(true);
    try{setAssets(await listMediaAssets({status:'all'}));}
    catch(error){showToast.error('Unable to load Media Library',error instanceof Error?error.message:'Request failed.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{void refresh();},[]);

  const filtered=useMemo(()=>{
    const q=search.trim().toLowerCase();
    return assets.filter(asset=>
      (status==='all'||asset.status===status)&&
      (type==='all'||asset.type===type)&&
      (!q||asset.name.toLowerCase().includes(q)||asset.type.toLowerCase().includes(q)||asset.uploadedBy.toLowerCase().includes(q))
    );
  },[assets,search,type,status]);

  const upload=async(file:File)=>{
    setUploading(true);
    try{
      const asset=await uploadMediaAsset(file,uploadType);
      setAssets(previous=>[asset,...previous]);
      setUploadOpen(false);
      showToast.success('Media uploaded','The image is now available to Home Management and other admin surfaces.');
    }catch(error){showToast.error('Upload failed',error instanceof Error?error.message:'Unable to upload image.');}
    finally{setUploading(false);}
  };

  const changeStatus=async(asset:LiveMediaAsset,next:MediaAssetStatus)=>{
    try{
      await setMediaAssetStatus(asset.id,next);
      setAssets(previous=>previous.map(item=>item.id===asset.id?{...item,status:next}:item));
      setPreview(current=>current?.id===asset.id?{...current,status:next}:current);
      showToast.success(next==='archived'?'Asset archived':'Asset restored',asset.name);
    }catch(error){showToast.error('Unable to update asset',error instanceof Error?error.message:'Request failed.');}
  };

  return <div>
    <PageHeader
      title="Media Library"
      description="Persistent Firebase-backed image library shared across Mobile Home, promotions, notifications and content surfaces."
      icon={<ImageIcon className="h-5 w-5"/>}
      actions={<div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={()=>void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading?'animate-spin':''}`}/>Refresh</Button><Button size="sm" variant="outline" onClick={()=>setStorageOpen(true)}><CloudDownload className="mr-1.5 h-4 w-4"/>Sync Firebase Storage</Button><Button size="sm" onClick={()=>setUploadOpen(true)}><Upload className="mr-1.5 h-4 w-4"/>Upload</Button></div>}
    />

    <div className="mb-4 flex flex-col gap-2 lg:flex-row">
      <div className="relative flex-1 lg:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search media…" className="pl-9"/></div>
      <Select value={type} onValueChange={value=>setType(value as MediaAssetType|'all')}><SelectTrigger className="lg:w-52"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem>{MEDIA_TYPES.map(item=><SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
      <Select value={status} onValueChange={value=>setStatus(value as MediaAssetStatus|'all')}><SelectTrigger className="lg:w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
    </div>

    {loading?<div className="rounded-xl border py-16 text-center text-sm text-muted-foreground">Loading media assets…</div>:filtered.length===0?<EmptyState icon={<ImageIcon className="h-7 w-7"/>} title="No media found" description="Upload an image or adjust the filters."/>:<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {filtered.map(asset=><Card key={asset.id} className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md" onClick={()=>setPreview(asset)}>
        <div className="relative aspect-video bg-muted"><img src={asset.url} alt={asset.name} className="h-full w-full object-cover" loading="lazy"/>{asset.status==='archived'&&<div className="absolute inset-0 flex items-center justify-center bg-background/65"><Badge variant="outline">Archived</Badge></div>}</div>
        <CardContent className="p-3"><p className="truncate text-sm font-medium">{asset.name}</p><div className="mt-1.5 flex items-center justify-between gap-2"><Badge variant="outline" className="truncate text-[10px]">{asset.type}</Badge><span className="shrink-0 text-[10px] text-muted-foreground">{formatMediaBytes(asset.byteSize)}</span></div></CardContent>
      </Card>)}
    </div>}

    <Sheet open={Boolean(preview)} onOpenChange={open=>{if(!open)setPreview(null);}}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {preview&&<><SheetHeader><SheetTitle>{preview.name}</SheetTitle><SheetDescription>Stored in Firebase Storage and indexed in the canonical media library.</SheetDescription></SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="overflow-hidden rounded-xl border bg-muted"><img src={preview.url} alt={preview.name} className="max-h-80 w-full object-contain"/></div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Meta label="Type" value={preview.type}/><Meta label="Size" value={formatMediaBytes(preview.byteSize)}/>
            <Meta label="Dimensions" value={preview.width&&preview.height?`${preview.width}×${preview.height}`:'—'}/><Meta label="Status" value={preview.status}/>
            <Meta label="Uploaded by" value={preview.uploadedBy}/><Meta label="Uploaded" value={new Date(preview.createdAt).toLocaleString('en-IN')}/>
          </div>
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Storage path</p><code className="block break-all rounded-lg bg-muted p-2 text-xs">{preview.storagePath}</code></div>
        </div>
        <SheetFooter className="mt-6 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={async()=>{await navigator.clipboard.writeText(preview.url);showToast.success('URL copied','Asset URL copied to clipboard.');}}><Clipboard className="mr-1.5 h-4 w-4"/>Copy URL</Button>
          <Button variant="outline" size="sm" onClick={()=>void changeStatus(preview,preview.status==='active'?'archived':'active')}><Archive className="mr-1.5 h-4 w-4"/>{preview.status==='active'?'Archive':'Restore'}</Button>
        </SheetFooter></>}
      </SheetContent>
    </Sheet>

    <FirebaseStorageImportDialog
      open={storageOpen}
      onOpenChange={setStorageOpen}
      preferredType="Exam Icon"
      onImported={(imported)=>{
        setAssets(previous=>[
          ...imported,
          ...previous.filter(asset=>!imported.some(next=>next.id===asset.id)),
        ]);
      }}
    />

    <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="h-4 w-4"/>Upload media</DialogTitle><DialogDescription>PNG, JPG, WebP or SVG, up to 10 MB. The file is uploaded directly to Firebase Storage.</DialogDescription></DialogHeader>
        <div className="space-y-4 py-2">
          <div><p className="mb-1.5 text-sm font-medium">Asset type</p><Select value={uploadType} onValueChange={value=>setUploadType(value as MediaAssetType)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{MEDIA_TYPES.map(item=><SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file);e.currentTarget.value='';}}/>
          <button type="button" onClick={()=>inputRef.current?.click()} disabled={uploading} className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 px-6 py-12 text-center transition hover:bg-muted/40 disabled:opacity-50"><FileImage className="mb-3 h-8 w-8 text-muted-foreground"/><span className="text-sm font-semibold">{uploading?'Uploading…':'Choose image'}</span><span className="mt-1 text-xs text-muted-foreground">The original file is preserved.</span></button>
        </div>
        <DialogFooter><Button variant="outline" onClick={()=>setUploadOpen(false)} disabled={uploading}>Cancel</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

function Meta({label,value}:{label:string;value:string}){return <div className="rounded-lg border p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>}

export default MediaLibraryPage;
