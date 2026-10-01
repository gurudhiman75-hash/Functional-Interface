import { useEffect, useMemo, useState } from 'react';
import { Megaphone, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';

import { MediaAssetPicker } from '@/components/shared/MediaAssetPicker';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase=((import.meta.env.VITE_API_URL as string|undefined)?.trim()||'/api').replace(/\/$/,'');

type Audience={languageCodes?:string[];examIds?:string[]};
type Promotion={
  id:string;title:string;subtitle:string;imageUrl:string;placement:string;destinationType:string;destinationValue:string;
  campaignKind:string;isDismissible:boolean;frequencyCapPerDay:number|null;audience:Audience;isActive:boolean;
  startAt:string|null;endAt:string|null;sortOrder:number;createdAt?:string;updatedAt?:string;
};
type Exam={id:string;code:string;name:string;familyName:string};
type Data={promotions:Promotion[];catalog?:{exams?:Exam[]}};

const LANGUAGES=[{code:'en',label:'English'},{code:'hi',label:'Hindi'},{code:'pa',label:'Punjabi'}];

function localDateTime(value:string|null){
  if(!value)return '';
  const date=new Date(value);if(Number.isNaN(date.getTime()))return '';
  const pad=(n:number)=>String(n).padStart(2,'0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function isoOrNull(value:string){return value?new Date(value).toISOString():null;}
function blank():Promotion{return{id:'',title:'',subtitle:'',imageUrl:'',placement:'home',destinationType:'none',destinationValue:'',campaignKind:'internal',isDismissible:true,frequencyCapPerDay:null,audience:{languageCodes:[],examIds:[]},isActive:true,startAt:null,endAt:null,sortOrder:1};}
function audienceOf(value:Audience|undefined):Required<Audience>{return{languageCodes:Array.isArray(value?.languageCodes)?value!.languageCodes!:[],examIds:Array.isArray(value?.examIds)?value!.examIds!:[]};}

async function call<T>(path:string,init?:RequestInit):Promise<T>{
  const user=getFirebaseAuth()?.currentUser;if(!user)throw new Error('Your administrator session has expired.');
  const response=await fetch(`${apiBase}${path}`,{...init,headers:{'Content-Type':'application/json',Authorization:`Bearer ${await user.getIdToken()}`,...init?.headers}});
  const body=await response.json().catch(()=>null) as (T&{error?:string})|null;
  if(!response.ok)throw new Error(body?.error||`Request failed (${response.status}).`);
  if(!body)throw new Error('Promotions API returned an empty response.');
  return body;
}

export function MobilePromotionsPage(){
  const[items,setItems]=useState<Promotion[]>([]);
  const[exams,setExams]=useState<Exam[]>([]);
  const[examQuery,setExamQuery]=useState('');
  const[loading,setLoading]=useState(true);
  const[editing,setEditing]=useState<Promotion|null>(null);
  const[saving,setSaving]=useState(false);

  const refresh=async()=>{setLoading(true);try{const data=await call<Data>('/admin/mobile/promotions');setItems(data.promotions.map(item=>({...item,audience:audienceOf(item.audience)})));setExams(data.catalog?.exams||[]);}catch(error){showToast.error('Unable to load promotions',error instanceof Error?error.message:'Request failed.');}finally{setLoading(false);}};
  useEffect(()=>{void refresh();},[]);

  const selectedAudience=audienceOf(editing?.audience);
  const visibleExams=useMemo(()=>{const q=examQuery.trim().toLowerCase();return exams.filter(exam=>!q||(`${exam.familyName} ${exam.name} ${exam.code}`).toLowerCase().includes(q));},[exams,examQuery]);
  const setAudience=(patch:Partial<Required<Audience>>)=>{if(!editing)return;setEditing({...editing,audience:{...audienceOf(editing.audience),...patch}});};

  const save=async()=>{
    if(!editing)return;
    if(editing.title.trim().length<2){showToast.error('Title required','Enter a campaign title.');return;}
    setSaving(true);
    try{
      const path=editing.id?`/admin/mobile/promotions/${editing.id}`:'/admin/mobile/promotions';
      await call(path,{method:editing.id?'PUT':'POST',body:JSON.stringify(editing)});
      showToast.success(editing.id?'Promotion updated':'Promotion created','The mobile campaign is ready for its configured placement and schedule.');
      setEditing(null);await refresh();
    }catch(error){showToast.error('Unable to save promotion',error instanceof Error?error.message:'Request failed.');}
    finally{setSaving(false);}
  };

  const remove=async()=>{if(!editing?.id)return;if(!window.confirm(`Delete "${editing.title}"? This removes it from all mobile placements.`))return;setSaving(true);try{await call(`/admin/mobile/promotions/${editing.id}`,{method:'DELETE'});showToast.success('Promotion deleted','The campaign has been removed.');setEditing(null);await refresh();}catch(error){showToast.error('Unable to delete promotion',error instanceof Error?error.message:'Request failed.');}finally{setSaving(false);}};

  return <div className="space-y-5">
    <PageHeader title="Mobile App · Promotions & Ads" description="Schedule mobile promotional placements without duplicating the shared exam, test-series or Learn content they point to." icon={<Megaphone className="h-5 w-5"/>} actions={<div className="flex gap-2"><Button variant="outline" onClick={()=>void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading?'animate-spin':''}`}/>Refresh</Button><Button onClick={()=>setEditing(blank())}><Plus className="mr-1.5 h-4 w-4"/>New promotion</Button></div>}/>

    <Card><CardHeader><CardTitle className="text-base">Campaigns</CardTitle></CardHeader><CardContent className="space-y-3">
      {items.length===0&&<div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No mobile promotions configured.</div>}
      {items.map(item=><button key={item.id} onClick={()=>setEditing({...item})} className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors hover:bg-muted/40">
        <div><div className="flex items-center gap-2"><span className="font-medium">{item.title}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.isActive?'bg-success/10 text-success':'bg-muted text-muted-foreground'}`}>{item.isActive?'Active':'Off'}</span></div><p className="mt-1 text-xs text-muted-foreground">{item.placement} · {item.campaignKind} · order {item.sortOrder}{item.startAt?` · starts ${new Date(item.startAt).toLocaleString('en-IN')}`:''}</p></div>
        <span className="text-xs text-muted-foreground">Edit</span>
      </button>)}
    </CardContent></Card>

    {editing&&<Card><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">{editing.id?'Edit promotion':'Create promotion'}</CardTitle><p className="mt-1 text-sm text-muted-foreground">Changes affect only this campaign.</p></div>{editing.id&&<Button variant="ghost" size="sm" onClick={()=>void remove()} disabled={saving}><Trash2 className="mr-1.5 h-4 w-4"/>Delete</Button>}</CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
      <Field label="Title"><Input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} placeholder="New Punjab test series"/></Field>
      <Field label="Placement"><Select value={editing.placement} onValueChange={value=>setEditing({...editing,placement:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="home">Home</SelectItem><SelectItem value="login_popup">Login / app-open popup</SelectItem><SelectItem value="learn">Learn</SelectItem><SelectItem value="tests">Tests</SelectItem><SelectItem value="results">Results</SelectItem></SelectContent></Select></Field>
      <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={editing.subtitle} onChange={e=>setEditing({...editing,subtitle:e.target.value})}/></Field></div>
      <div className="md:col-span-2"><Field label="Promotion image"><MediaAssetPicker value={editing.imageUrl} onChange={url=>setEditing({...editing,imageUrl:url})} preferredType="Promotion Image" label="Choose / Upload"/></Field></div>
      <Field label="Campaign type"><Select value={editing.campaignKind} onValueChange={value=>setEditing({...editing,campaignKind:value,destinationType:value==='external'?'url':editing.destinationType})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="internal">Internal promotion</SelectItem><SelectItem value="external">External ad</SelectItem></SelectContent></Select></Field>
      <Field label="Destination type"><Select value={editing.destinationType} onValueChange={value=>setEditing({...editing,destinationType:value,destinationValue:value==='none'?'':editing.destinationValue})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No action</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="learn">Learn</SelectItem><SelectItem value="page">Managed page</SelectItem><SelectItem value="url">URL</SelectItem></SelectContent></Select></Field>
      {editing.destinationType!=='none'&&<div className="md:col-span-2"><Field label={editing.destinationType==='url'?'Destination URL':'Destination / deep link'}><Input value={editing.destinationValue} onChange={e=>setEditing({...editing,destinationValue:e.target.value})} placeholder={editing.destinationType==='url'?'https://…':editing.destinationType==='learn'?'/learn (blank also opens Learn)':editing.destinationType==='page'?'Managed page slug':'Shared exam/series ID'}/></Field></div>}
      <Field label="Start"><Input type="datetime-local" value={localDateTime(editing.startAt)} onChange={e=>setEditing({...editing,startAt:isoOrNull(e.target.value)})}/></Field>
      <Field label="End"><Input type="datetime-local" value={localDateTime(editing.endAt)} onChange={e=>setEditing({...editing,endAt:isoOrNull(e.target.value)})}/></Field>
      <Field label="Order"><Input type="number" min="0" max="999" value={editing.sortOrder} onChange={e=>setEditing({...editing,sortOrder:Number(e.target.value)})}/></Field>
      <Field label="Frequency cap / day"><Input type="number" min="1" max="50" value={editing.frequencyCapPerDay??''} onChange={e=>setEditing({...editing,frequencyCapPerDay:e.target.value?Number(e.target.value):null})} placeholder="No cap"/></Field>
      <div className="md:col-span-2 rounded-xl border p-4">
        <p className="text-sm font-semibold">Audience</p>
        <p className="mt-1 text-xs text-muted-foreground">Leave language and exam targeting empty to show this campaign to all eligible learners.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div><Label className="mb-2 block">Languages</Label><div className="space-y-2">{LANGUAGES.map(language=><label key={language.code} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"><Checkbox checked={selectedAudience.languageCodes.includes(language.code)} onCheckedChange={()=>setAudience({languageCodes:selectedAudience.languageCodes.includes(language.code)?selectedAudience.languageCodes.filter(code=>code!==language.code):[...selectedAudience.languageCodes,language.code]})}/><span className="text-sm">{language.label}</span></label>)}</div></div>
          <div><Label className="mb-2 block">My Exams</Label><Input value={examQuery} onChange={e=>setExamQuery(e.target.value)} placeholder="Search exams…" className="mb-2"/><div className="max-h-56 space-y-2 overflow-y-auto pr-1">{visibleExams.map(exam=><label key={exam.id} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><Checkbox checked={selectedAudience.examIds.includes(exam.id)} onCheckedChange={()=>setAudience({examIds:selectedAudience.examIds.includes(exam.id)?selectedAudience.examIds.filter(id=>id!==exam.id):[...selectedAudience.examIds,exam.id]})}/><span><span className="block text-sm font-medium">{exam.name}</span><span className="block text-xs text-muted-foreground">{exam.familyName} · {exam.code}</span></span></label>)}</div></div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg border px-3 py-2"><div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">Eligible for delivery inside its schedule.</p></div><Switch checked={editing.isActive} onCheckedChange={checked=>setEditing({...editing,isActive:checked})}/></div>
      <div className="flex items-center justify-between rounded-lg border px-3 py-2"><div><p className="text-sm font-medium">Dismissible</p><p className="text-xs text-muted-foreground">Learner can hide this promotion.</p></div><Switch checked={editing.isDismissible} onCheckedChange={checked=>setEditing({...editing,isDismissible:checked})}/></div>
      <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={()=>setEditing(null)} disabled={saving}>Cancel</Button><Button onClick={()=>void save()} disabled={saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Saving…':'Save promotion'}</Button></div>
    </CardContent></Card>}
  </div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>}
export default MobilePromotionsPage;
