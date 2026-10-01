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

function readBase64(file:File):Promise<string>{
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const value=String(reader.result||'');
      const comma=value.indexOf(',');
      resolve(comma>=0?value.slice(comma+1):value);
    };
    reader.onerror=()=>reject(reader.error||new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaAsset(file:File,type:MediaAssetType){
  const allowed=new Set(['image/png','image/jpeg','image/webp','image/svg+xml']);
  if(!allowed.has(file.type))throw new Error('Use PNG, JPG, WebP or SVG images.');
  if(file.size<=0||file.size>10*1024*1024)throw new Error('Images must be smaller than 10 MB.');

  const [dimensions,dataBase64]=await Promise.all([imageDimensions(file),readBase64(file)]);
  const result=await api<{asset:LiveMediaAsset}>('/admin/media/upload',{
    method:'POST',
    body:JSON.stringify({
      name:file.name,
      type,
      mimeType:file.type,
      byteSize:file.size,
      width:dimensions.width,
      height:dimensions.height,
      dataBase64,
    }),
  });
  return result.asset;
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
