import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase=((import.meta.env.VITE_API_URL as string|undefined)?.trim()||'/api').replace(/\/$/,'');

export const MEDIA_TYPES=[
  'Question Image','DI Chart','Passage Image','Package Banner','Exam Icon',
  'Notification Image','Home Banner','Home Icon','Promotion Image',
] as const;

export type MediaAssetType=typeof MEDIA_TYPES[number];
export type MediaAssetStatus='active'|'archived';

export type LiveMediaAsset={
  id:string;
  name:string;
  type:MediaAssetType;
  mimeType:string;
  byteSize:number;
  width:number|null;
  height:number|null;
  storagePath:string;
  url:string;
  status:MediaAssetStatus;
  createdAt:string;
  updatedAt:string;
  uploadedBy:string;
};

async function api<T>(path:string,init?:RequestInit):Promise<T>{
  const user=getFirebaseAuth()?.currentUser;
  if(!user)throw new Error('Your administrator session has expired.');
  const response=await fetch(apiBase+path,{
    ...init,
    headers:{
      'Content-Type':'application/json',
      Authorization:'Bearer '+await user.getIdToken(),
      ...init?.headers,
    },
  });
  const body=await response.json().catch(()=>null) as (T&{error?:string})|null;
  if(!response.ok)throw new Error(body?.error||'Media request failed ('+response.status+').');
  if(!body)throw new Error('Media API returned an empty response.');
  return body;
}

export async function listMediaAssets(filters?:{status?:MediaAssetStatus|'all';type?:MediaAssetType|'all';search?:string}){
  const params=new URLSearchParams();
  if(filters?.status)params.set('status',filters.status);
  if(filters?.type)params.set('type',filters.type);
  if(filters?.search)params.set('search',filters.search);
  const result=await api<{assets:LiveMediaAsset[]}>('/admin/media'+(params.size?'?'+params.toString():''));
  return result.assets;
}

async function imageDimensions(file:File):Promise<{width:number|null;height:number|null}>{
  return new Promise(resolve=>{
    const url=URL.createObjectURL(file);
    const image=new Image();
    const finish=(width:number|null,height:number|null)=>{URL.revokeObjectURL(url);resolve({width,height});};
    image.onload=()=>finish(image.naturalWidth||null,image.naturalHeight||null);
    image.onerror=()=>finish(null,null);
    image.src=url;
  });
}

export async function uploadMediaAsset(file:File,type:MediaAssetType){
  const allowed=new Set(['image/png','image/jpeg','image/webp','image/svg+xml']);
  if(!allowed.has(file.type))throw new Error('Use PNG, JPG, WebP or SVG images.');
  if(file.size<=0||file.size>10*1024*1024)throw new Error('Images must be smaller than 10 MB.');

  const intent=await api<{objectPath:string;uploadUrl:string}>('/admin/media/upload-intent',{
    method:'POST',
    body:JSON.stringify({name:file.name,type,mimeType:file.type,byteSize:file.size}),
  });

  const uploaded=await fetch(intent.uploadUrl,{
    method:'PUT',
    headers:{'Content-Type':file.type},
    body:file,
  });
  if(!uploaded.ok)throw new Error('Firebase Storage upload failed ('+uploaded.status+').');

  const dimensions=await imageDimensions(file);
  const finalized=await api<{asset:LiveMediaAsset}>('/admin/media/finalize',{
    method:'POST',
    body:JSON.stringify({
      objectPath:intent.objectPath,
      name:file.name,
      type,
      mimeType:file.type,
      byteSize:file.size,
      width:dimensions.width,
      height:dimensions.height,
    }),
  });
  return finalized.asset;
}

export async function setMediaAssetStatus(id:string,status:MediaAssetStatus){
  await api<{id:string;status:MediaAssetStatus}>('/admin/media/'+encodeURIComponent(id),{
    method:'PATCH',
    body:JSON.stringify({status}),
  });
}

export function formatMediaBytes(value:number){
  if(value<1024)return value+' B';
  if(value<1024*1024)return (value/1024).toFixed(value<100*1024?1:0)+' KB';
  return (value/(1024*1024)).toFixed(1)+' MB';
}
