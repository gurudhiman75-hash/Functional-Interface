import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Search, Upload } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MEDIA_TYPES, type LiveMediaAsset, type MediaAssetType,
  listMediaAssets, uploadMediaAsset,
} from '@/lib/media-assets';

export function MediaAssetPicker({
  value,
  onChange,
  preferredType='Home Banner',
  label='Choose image',
}:{
  value?:string;
  onChange:(url:string,asset?:LiveMediaAsset)=>void;
  preferredType?:MediaAssetType;
  label?:string;
}){
  const[open,setOpen]=useState(false);
  const[assets,setAssets]=useState<LiveMediaAsset[]>([]);
  const[loading,setLoading]=useState(false);
  const[uploading,setUploading]=useState(false);
  const[search,setSearch]=useState('');
  const[type,setType]=useState<MediaAssetType|'all'>(preferredType);
  const inputRef=useRef<HTMLInputElement|null>(null);

  const load=async()=>{
    setLoading(true);
    try{setAssets(await listMediaAssets({status:'active'}));}
    catch(error){showToast.error('Unable to load media',error instanceof Error?error.message:'Request failed.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{if(open)void load();},[open]);

  const filtered=useMemo(()=>{
    const q=search.trim().toLowerCase();
    return assets.filter(asset=>(type==='all'||asset.type===type)&&(!q||asset.name.toLowerCase().includes(q)||asset.type.toLowerCase().includes(q)));
  },[assets,search,type]);

  const upload=async(file:File)=>{
    setUploading(true);
    try{
      const asset=await uploadMediaAsset(file,type==='all'?preferredType:type);
      setAssets(previous=>[asset,...previous]);
      onChange(asset.url,asset);
      setOpen(false);
      showToast.success('Image uploaded','The new asset is saved in the Media Library.');
    }catch(error){showToast.error('Upload failed',error instanceof Error?error.message:'Unable to upload image.');}
    finally{setUploading(false);}
  };

  return <div className="space-y-2">
    <div className="flex gap-2">
      <Input value={value||''} onChange={event=>onChange(event.target.value)} placeholder="https://…"/>
      <Button type="button" variant="outline" onClick={()=>setOpen(true)}><ImagePlus className="mr-1.5 h-4 w-4"/>{label}</Button>
    </div>
    {value&&<div className="overflow-hidden rounded-lg border bg-muted/20"><img src={value} alt="" className="h-24 w-full object-contain" onError={event=>{event.currentTarget.style.display='none';}}/></div>}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>Select an existing asset or upload a new image.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search assets…" className="pl-9"/></div>
          <Select value={type} onValueChange={value=>setType(value as MediaAssetType|'all')}><SelectTrigger className="sm:w-52"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All image types</SelectItem>{MEDIA_TYPES.map(item=><SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file);e.currentTarget.value='';}}/>
          <Button type="button" onClick={()=>inputRef.current?.click()} disabled={uploading}><Upload className="mr-1.5 h-4 w-4"/>{uploading?'Uploading…':'Upload'}</Button>
        </div>
        {loading?<div className="py-12 text-center text-sm text-muted-foreground">Loading media…</div>:filtered.length===0?<div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">No matching assets.</div>:<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{filtered.map(asset=><button key={asset.id} type="button" onClick={()=>{onChange(asset.url,asset);setOpen(false);}} className="overflow-hidden rounded-xl border text-left transition hover:border-primary hover:shadow-sm"><div className="aspect-video bg-muted"><img src={asset.url} alt={asset.name} className="h-full w-full object-cover"/></div><div className="p-2"><p className="truncate text-xs font-semibold">{asset.name}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{asset.type}</p></div></button>)}</div>}
      </DialogContent>
    </Dialog>
  </div>;
}
