import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Plus, RefreshCw, Save } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase=((import.meta.env.VITE_API_URL as string|undefined)?.trim()||'/api').replace(/\/$/,'');
type Item={id:string;slotKey:string;entityType:string;entityId:string;labelOverride:string;badgeText:string;languageCode:string;sortOrder:number;isActive:boolean;startAt:string|null;endAt:string|null;createdAt:string;updatedAt:string};
type RefItem={id:string;code:string;name?:string;title?:string;examName?:string;category?:string;languageCode?:string;examFamilyKey?:string;periodType?:string};
type Data={items:Item[];catalog:{examFamilies:RefItem[];testSeries:RefItem[];learningResources:RefItem[];currentAffairs:RefItem[]}};
type Draft=Omit<Item,'id'|'createdAt'|'updatedAt'|'startAt'|'endAt'>&{id?:string;startAt:string;endAt:string};
const SLOTS=[['home_learn','Home · Learn'],['learn_featured','Learn · Featured'],['home_current_affairs','Home · Current Affairs'],['tests_featured','Tests · Featured'],['resources_featured','Resources · Featured']] as const;
function blank():Draft{return{slotKey:'home_learn',entityType:'learning_resource',entityId:'',labelOverride:'',badgeText:'',languageCode:'',sortOrder:1,isActive:true,startAt:'',endAt:''};}
function local(value:string|null){if(!value)return '';const d=new Date(value);if(Number.isNaN(d.getTime()))return '';const p=(n:number)=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;}
async function call<T>(path:string,init?:RequestInit):Promise<T>{const user=getFirebaseAuth()?.currentUser;if(!user)throw new Error('Your administrator session has expired.');const response=await fetch(`${apiBase}${path}`,{...init,headers:{'Content-Type':'application/json',Authorization:`Bearer ${await user.getIdToken()}`,...init?.headers}});const body=await response.json().catch(()=>null) as (T&{error?:string})|null;if(!response.ok)throw new Error(body?.error||`Request failed (${response.status}).`);if(!body)throw new Error('Content Planning API returned an empty response.');return body;}
export function MobileContentPlanningPage(){
 const[data,setData]=useState<Data|null>(null);const[loading,setLoading]=useState(true);const[editing,setEditing]=useState<Draft|null>(null);const[saving,setSaving]=useState(false);
 const refresh=async()=>{setLoading(true);try{setData(await call<Data>('/admin/mobile/content-planning'));}catch(error){showToast.error('Unable to load Content Planning',error instanceof Error?error.message:'Request failed.');}finally{setLoading(false);}};
 useEffect(()=>{void refresh();},[]);
 const refs=useMemo(()=>{if(!data||!editing)return[];if(editing.entityType==='exam_family')return data.catalog.examFamilies;if(editing.entityType==='test_series')return data.catalog.testSeries;if(editing.entityType==='current_affairs_release')return data.catalog.currentAffairs;return data.catalog.learningResources;},[data,editing]);
 const refLabel=(ref:RefItem)=>ref.name||ref.title||ref.code;
 const edit=(item:Item)=>setEditing({...item,startAt:local(item.startAt),endAt:local(item.endAt)});
 const save=async()=>{if(!editing)return;setSaving(true);try{const payload={...editing,startAt:editing.startAt?new Date(editing.startAt).toISOString():null,endAt:editing.endAt?new Date(editing.endAt).toISOString():null};await call(editing.id?`/admin/mobile/content-planning/${editing.id}`:'/admin/mobile/content-planning',{method:editing.id?'PUT':'POST',body:JSON.stringify(payload)});showToast.success('Content plan saved','The selected shared content can now be surfaced in the mobile app according to its schedule.');setEditing(null);await refresh();}catch(error){showToast.error('Unable to save Content Planning',error instanceof Error?error.message:'Request failed.');}finally{setSaving(false);}};
 return <div className="space-y-5">
  <PageHeader title="Mobile App · Content Planning" description="Curate existing exams, test series, Learn resources and Current Affairs for mobile discovery. This workspace never duplicates or re-authors the shared content." icon={<CalendarClock className="h-5 w-5"/>} actions={<div className="flex gap-2"><Button variant="outline" onClick={()=>void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading?'animate-spin':''}`}/>Refresh</Button><Button onClick={()=>setEditing(blank())}><Plus className="mr-1.5 h-4 w-4"/>Add planned content</Button></div>}/>
  <Card className="border-primary/20 bg-primary/5"><CardContent className="p-4 text-sm">Question Studio and all content authoring remain shared. Content Planning only controls <strong>where and when existing content is promoted inside the mobile app</strong>.</CardContent></Card>
  <Card><CardHeader><CardTitle className="text-base">Planned mobile placements</CardTitle></CardHeader><CardContent className="space-y-3">{data?.items.length===0&&<div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No planned mobile content yet.</div>}{data?.items.map(item=><button key={item.id} onClick={()=>edit(item)} className="flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left hover:bg-muted/30"><div><div className="flex items-center gap-2"><span className="font-medium">{item.labelOverride||item.entityType.replaceAll('_',' ')}</span>{item.badgeText&&<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{item.badgeText}</span>}<span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.isActive?'bg-success/10 text-success':'bg-muted text-muted-foreground'}`}>{item.isActive?'Active':'Off'}</span></div><p className="mt-1 text-xs text-muted-foreground">{item.slotKey} · {item.entityType} · order {item.sortOrder}{item.languageCode?` · ${item.languageCode}`:''}</p></div><span className="text-xs text-muted-foreground">Edit</span></button>)}</CardContent></Card>
  {editing&&<Card><CardHeader><CardTitle className="text-base">{editing.id?'Edit planned content':'Add planned content'}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
    <Field label="Mobile slot"><Select value={editing.slotKey} onValueChange={value=>setEditing({...editing,slotKey:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{SLOTS.map(([value,label])=><SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></Field>
    <Field label="Shared content type"><Select value={editing.entityType} onValueChange={value=>setEditing({...editing,entityType:value,entityId:''})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="exam_family">Exam category</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="learning_resource">Learning resource</SelectItem><SelectItem value="current_affairs_release">Current Affairs release</SelectItem></SelectContent></Select></Field>
    <div className="md:col-span-2"><Field label="Shared content item"><Select value={editing.entityId} onValueChange={value=>setEditing({...editing,entityId:value})}><SelectTrigger><SelectValue placeholder="Select existing content"/></SelectTrigger><SelectContent>{refs.map(ref=><SelectItem key={ref.id} value={ref.id}>{refLabel(ref)}{ref.examName?` · ${ref.examName}`:''}{ref.languageCode?` · ${ref.languageCode}`:''}</SelectItem>)}</SelectContent></Select></Field></div>
    <Field label="Display label override (optional)"><Input value={editing.labelOverride} onChange={e=>setEditing({...editing,labelOverride:e.target.value})} placeholder="Leave blank to use canonical title"/></Field>
    <Field label="Badge (optional)"><Input value={editing.badgeText} onChange={e=>setEditing({...editing,badgeText:e.target.value})} placeholder="New, Trending, Updated"/></Field>
    <Field label="Language filter (optional)"><Input value={editing.languageCode} onChange={e=>setEditing({...editing,languageCode:e.target.value})} placeholder="en, hi, pa"/></Field>
    <Field label="Order"><Input type="number" min="0" max="999" value={editing.sortOrder} onChange={e=>setEditing({...editing,sortOrder:Number(e.target.value)})}/></Field>
    <Field label="Start"><Input type="datetime-local" value={editing.startAt} onChange={e=>setEditing({...editing,startAt:e.target.value})}/></Field>
    <Field label="End"><Input type="datetime-local" value={editing.endAt} onChange={e=>setEditing({...editing,endAt:e.target.value})}/></Field>
    <div className="flex items-center justify-between rounded-lg border px-3 py-2 md:col-span-2"><div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">The item is eligible when its schedule and language filters also match.</p></div><Switch checked={editing.isActive} onCheckedChange={checked=>setEditing({...editing,isActive:checked})}/></div>
    <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button><Button onClick={()=>void save()} disabled={saving||!editing.entityId}><Save className="mr-1.5 h-4 w-4"/>{saving?'Saving…':'Save placement'}</Button></div>
  </CardContent></Card>}
 </div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>}
export default MobileContentPlanningPage;