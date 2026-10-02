import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarClock, Copy, Plus, RefreshCw, Save, Send, Smartphone, XCircle } from 'lucide-react';

import { MediaAssetPicker } from '@/components/shared/MediaAssetPicker';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase=((import.meta.env.VITE_API_URL as string|undefined)?.trim()||'/api').replace(/\/$/,'');
type Audience={languageCodes:string[];examIds:string[]};
type Campaign={id:string;title:string;body:string;imageUrl:string;destinationType:string;destinationValue:string;audience:Partial<Audience>;status:string;scheduledAt:string|null;sentAt:string|null;deliveryCount:number;sentCount:number;failedCount:number;openedCount:number;deliveredUsers:number;createdAt:string;updatedAt:string};
type ManagedPage={id:string;slug:string;title:string;isActive:boolean};
type Exam={id:string;code:string;name:string;familyName:string};
type TestSeries={id:string;code:string;name:string;examName:string};
type Data={campaigns:Campaign[];deviceSummary:{activeDevices:number;reachableUsers:number};catalog?:{exams?:Exam[];testSeries?:TestSeries[]}};
type Draft={id?:string;title:string;body:string;imageUrl:string;destinationType:string;destinationValue:string;status:string;scheduledAt:string;audience:Audience};
const LANGUAGES=[{code:'en',label:'English'},{code:'hi',label:'Hindi'},{code:'pa',label:'Punjabi'}];
function blank():Draft{return{title:'',body:'',imageUrl:'',destinationType:'none',destinationValue:'',status:'draft',scheduledAt:'',audience:{languageCodes:[],examIds:[]}};}
function audienceOf(value:Partial<Audience>|undefined):Audience{return{languageCodes:Array.isArray(value?.languageCodes)?value!.languageCodes!:[],examIds:Array.isArray(value?.examIds)?value!.examIds!:[]};}
function openRate(c:Campaign){return c.deliveredUsers>0?((c.openedCount/c.deliveredUsers)*100).toFixed(1)+'%':'—';}
function statusClass(status:string){if(status==='sent')return'bg-success/10 text-success';if(status==='scheduled')return'bg-blue-500/10 text-blue-700';if(status==='failed')return'bg-destructive/10 text-destructive';if(status==='sending')return'bg-amber-500/10 text-amber-700';return'bg-muted text-muted-foreground';}
function audienceLabel(audience:Partial<Audience>|undefined){const a=audienceOf(audience);const parts:string[]=[];if(a.languageCodes.length)parts.push(a.languageCodes.map(code=>code.toUpperCase()).join('/'));if(a.examIds.length)parts.push(a.examIds.length+' exam'+(a.examIds.length===1?'':'s'));return parts.length?parts.join(' · '):'All learners';}
function scheduleError(draft:Draft){if(draft.status!=='scheduled')return'';if(!draft.scheduledAt)return'Select a future date and time.';const at=new Date(draft.scheduledAt).getTime();if(!Number.isFinite(at)||at<=Date.now())return'Scheduled time must be in the future. Use Send now for immediate delivery.';return'';}
function local(value:string|null){if(!value)return '';const d=new Date(value);if(Number.isNaN(d.getTime()))return '';const p=(n:number)=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;}
async function call<T>(path:string,init?:RequestInit):Promise<T>{const user=getFirebaseAuth()?.currentUser;if(!user)throw new Error('Your administrator session has expired.');const response=await fetch(`${apiBase}${path}`,{...init,headers:{'Content-Type':'application/json',Authorization:`Bearer ${await user.getIdToken()}`,...init?.headers}});const body=await response.json().catch(()=>null) as (T&{error?:string})|null;if(!response.ok)throw new Error(body?.error||`Request failed (${response.status}).`);if(!body)throw new Error('Notifications API returned an empty response.');return body;}
export function MobileNotificationsPage(){
 const[data,setData]=useState<Data|null>(null);const[loading,setLoading]=useState(true);const[editing,setEditing]=useState<Draft|null>(null);const[saving,setSaving]=useState(false);const[managedPages,setManagedPages]=useState<ManagedPage[]>([]);const[exams,setExams]=useState<Exam[]>([]);const[testSeries,setTestSeries]=useState<TestSeries[]>([]);const[examQuery,setExamQuery]=useState('');
 const refresh=async()=>{setLoading(true);try{const[result,pagesResult]=await Promise.all([call<Data>('/admin/mobile/notifications'),call<{pages:ManagedPage[]}>('/admin/mobile/pages')]);setData({...result,campaigns:result.campaigns.map(campaign=>({...campaign,audience:audienceOf(campaign.audience)}))});setManagedPages(pagesResult.pages.filter(page=>page.isActive));setExams(result.catalog?.exams||[]);setTestSeries(result.catalog?.testSeries||[]);}catch(error){showToast.error('Unable to load notifications',error instanceof Error?error.message:'Request failed.');}finally{setLoading(false);}};
 useEffect(()=>{void refresh();},[]);
 const visibleExams=useMemo(()=>{const q=examQuery.trim().toLowerCase();return exams.filter(exam=>!q||(`${exam.familyName} ${exam.name} ${exam.code}`).toLowerCase().includes(q));},[exams,examQuery]);
 const setAudience=(patch:Partial<Audience>)=>{if(!editing)return;setEditing({...editing,audience:{...editing.audience,...patch}});};
 const edit=(c:Campaign)=>setEditing({id:c.id,title:c.title,body:c.body,imageUrl:c.imageUrl,destinationType:c.destinationType,destinationValue:c.destinationValue,status:['draft','scheduled','cancelled'].includes(c.status)?c.status:'draft',scheduledAt:local(c.scheduledAt),audience:audienceOf(c.audience)});
 const sendTest=async(id:string)=>{try{await call(`/admin/mobile/notifications/${id}/send-test-to-my-device`,{method:'POST'});showToast.success('Test notification sent','The push was sent only to the most recent active device registered to your signed-in account.');await refresh();}catch(error){showToast.error('Unable to send test notification',error instanceof Error?error.message:'Request failed.');}};
 const sendNow=async(id:string)=>{try{await call(`/admin/mobile/notifications/${id}/send-now`,{method:'POST'});showToast.success('Notification queued','The campaign is queued for immediate push delivery.');await refresh();}catch(error){showToast.error('Unable to send notification',error instanceof Error?error.message:'Request failed.');}};
 const cancelCampaign=async(id:string)=>{try{await call(`/admin/mobile/notifications/${id}/cancel`,{method:'POST'});showToast.success('Notification cancelled','The scheduled campaign will not be delivered.');if(editing?.id===id)setEditing({...editing,status:'cancelled'});await refresh();}catch(error){showToast.error('Unable to cancel notification',error instanceof Error?error.message:'Request failed.');}};
 const duplicate=(c:Campaign)=>{setEditing({title:`${c.title} (copy)`,body:c.body,imageUrl:c.imageUrl,destinationType:c.destinationType,destinationValue:c.destinationValue,status:'draft',scheduledAt:'',audience:audienceOf(c.audience)});showToast.success('Notification duplicated','The copy is a draft until you schedule or send it.');};
 const save=async()=>{if(!editing)return;const scheduleIssue=scheduleError(editing);if(scheduleIssue){showToast.error('Invalid schedule',scheduleIssue);return;}setSaving(true);try{const payload={title:editing.title,body:editing.body,imageUrl:editing.imageUrl,destinationType:editing.destinationType,destinationValue:editing.destinationValue,status:editing.status,scheduledAt:editing.scheduledAt?new Date(editing.scheduledAt).toISOString():null,audience:editing.audience};await call(editing.id?`/admin/mobile/notifications/${editing.id}`:'/admin/mobile/notifications',{method:editing.id?'PUT':'POST',body:JSON.stringify(payload)});showToast.success('Notification saved',editing.status==='scheduled'?'The campaign is scheduled for mobile push delivery.':'The campaign remains a draft.');setEditing(null);await refresh();}catch(error){showToast.error('Unable to save notification',error instanceof Error?error.message:'Request failed.');}finally{setSaving(false);}};
 return <div className="space-y-5">
  <PageHeader title="Mobile App · Notifications" description="Compose and schedule learner-facing push campaigns. Targeting uses shared student identities; device tokens are registered by the mobile app." icon={<Bell className="h-5 w-5"/>} actions={<div className="flex gap-2"><Button variant="outline" onClick={()=>void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading?'animate-spin':''}`}/>Refresh</Button><Button onClick={()=>setEditing(blank())}><Plus className="mr-1.5 h-4 w-4"/>New notification</Button></div>}/>
  <div className="grid gap-4 sm:grid-cols-2"><Card><CardContent className="flex items-center gap-3 p-5"><Smartphone className="h-5 w-5 text-primary"/><div><p className="text-2xl font-bold">{data?.deviceSummary.activeDevices??0}</p><p className="text-xs text-muted-foreground">Active registered devices</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-5"><Bell className="h-5 w-5 text-primary"/><div><p className="text-2xl font-bold">{data?.deviceSummary.reachableUsers??0}</p><p className="text-xs text-muted-foreground">Reachable students</p></div></CardContent></Card></div>
  <Card><CardHeader><CardTitle className="text-base">Campaign history</CardTitle></CardHeader><CardContent className="space-y-3">
    {data?.campaigns.length===0&&<div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No push campaigns yet.</div>}
    {data?.campaigns.map(c=><div key={c.id} className="rounded-xl border p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <button type="button" onClick={()=>['draft','scheduled','cancelled'].includes(c.status)&&edit(c)} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{c.title}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusClass(c.status)}`}>{c.status}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">{c.scheduledAt?`Scheduled ${new Date(c.scheduledAt).toLocaleString('en-IN')}`:'Not scheduled'} · {audienceLabel(c.audience)}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span><strong className="text-foreground">{c.sentCount}</strong> delivered devices</span>
            <span><strong className="text-foreground">{c.deliveredUsers}</strong> learners reached</span>
            <span><strong className="text-foreground">{c.failedCount}</strong> failed</span>
            <span><strong className="text-foreground">{c.openedCount}</strong> opened</span>
            <span><strong className="text-foreground">{openRate(c)}</strong> open rate</span>
          </div>
        </button>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={()=>void sendTest(c.id)}><Smartphone className="mr-1.5 h-3.5 w-3.5"/>Test my device</Button>
          <Button size="sm" variant="outline" onClick={()=>duplicate(c)}><Copy className="mr-1.5 h-3.5 w-3.5"/>Duplicate</Button>
          {['draft','scheduled'].includes(c.status)&&<Button size="sm" variant="outline" onClick={()=>void cancelCampaign(c.id)}><XCircle className="mr-1.5 h-3.5 w-3.5"/>Cancel</Button>}
          {['draft','scheduled','cancelled'].includes(c.status)&&<Button size="sm" variant="outline" onClick={()=>void sendNow(c.id)}><Send className="mr-1.5 h-3.5 w-3.5"/>Send now</Button>}
        </div>
      </div>
    </div>)}
  </CardContent></Card>
  {editing&&<Card><CardHeader><CardTitle className="text-base">{editing.id?'Edit campaign':'Create campaign'}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
    <Field label="Title"><Input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} placeholder="New mock test available"/></Field>
    <Field label="Status"><Select value={editing.status} onValueChange={value=>setEditing({...editing,status:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></Field>
    <div className="md:col-span-2"><Field label="Message"><Textarea rows={3} value={editing.body} onChange={e=>setEditing({...editing,body:e.target.value})} placeholder="Your Punjab Govt Exams test series has a new mock test."/></Field></div>
    <div className="md:col-span-2"><Field label="Notification image (optional)"><MediaAssetPicker value={editing.imageUrl} onChange={url=>setEditing({...editing,imageUrl:url})} preferredType="Notification Image" label="Choose / Upload"/></Field></div>
    <Field label="Destination"><Select value={editing.destinationType} onValueChange={value=>setEditing({...editing,destinationType:value,destinationValue:''})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No action</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="learn">Learn</SelectItem><SelectItem value="page">Managed page</SelectItem><SelectItem value="url">URL</SelectItem></SelectContent></Select></Field>
    {editing.destinationType==='exam'&&<Field label="Select exam"><Select value={editing.destinationValue} onValueChange={value=>setEditing({...editing,destinationValue:value})}><SelectTrigger><SelectValue placeholder="Choose exam"/></SelectTrigger><SelectContent>{exams.map(exam=><SelectItem key={exam.id} value={exam.id}>{exam.name} · {exam.familyName}</SelectItem>)}</SelectContent></Select></Field>}
    {editing.destinationType==='test_series'&&<Field label="Select test series"><Select value={editing.destinationValue} onValueChange={value=>setEditing({...editing,destinationValue:value})}><SelectTrigger><SelectValue placeholder="Choose test series"/></SelectTrigger><SelectContent>{testSeries.map(series=><SelectItem key={series.id} value={series.id}>{series.name} · {series.examName}</SelectItem>)}</SelectContent></Select></Field>}
    {editing.destinationType==='page'&&<Field label="Select managed page"><Select value={editing.destinationValue} onValueChange={value=>setEditing({...editing,destinationValue:value})}><SelectTrigger><SelectValue placeholder="Choose a Layout Composer page"/></SelectTrigger><SelectContent>{managedPages.map(page=><SelectItem key={page.id} value={page.slug}>{page.title} · /{page.slug}</SelectItem>)}</SelectContent></Select></Field>}
    {editing.destinationType==='learn'&&<Field label="Native route"><Input value={editing.destinationValue} onChange={e=>setEditing({...editing,destinationValue:e.target.value})} placeholder="/learn"/></Field>}
    {editing.destinationType==='url'&&<Field label="Destination URL"><Input value={editing.destinationValue} onChange={e=>setEditing({...editing,destinationValue:e.target.value})} placeholder="https://…"/></Field>}
    {editing.destinationType==='none'&&<div/>}
    <Field label="Schedule"><Input type="datetime-local" value={editing.scheduledAt} onChange={e=>setEditing({...editing,scheduledAt:e.target.value})}/></Field>
    {scheduleError(editing)&&<div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{scheduleError(editing)}</div>}
    <div className="md:col-span-2 rounded-xl border p-4">
      <p className="text-sm font-semibold">Audience</p>
      <p className="mt-1 text-xs text-muted-foreground">Leave both groups empty to send to every eligible learner. Language and My Exams filters are combined when both are selected.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div><Label className="mb-2 block">Languages</Label><div className="space-y-2">{LANGUAGES.map(language=><label key={language.code} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"><Checkbox checked={editing.audience.languageCodes.includes(language.code)} onCheckedChange={()=>setAudience({languageCodes:editing.audience.languageCodes.includes(language.code)?editing.audience.languageCodes.filter(code=>code!==language.code):[...editing.audience.languageCodes,language.code]})}/><span className="text-sm">{language.label}</span></label>)}</div></div>
        <div><Label className="mb-2 block">My Exams</Label><Input value={examQuery} onChange={e=>setExamQuery(e.target.value)} placeholder="Search exams…" className="mb-2"/><div className="max-h-56 space-y-2 overflow-y-auto pr-1">{visibleExams.map(exam=><label key={exam.id} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><Checkbox checked={editing.audience.examIds.includes(exam.id)} onCheckedChange={()=>setAudience({examIds:editing.audience.examIds.includes(exam.id)?editing.audience.examIds.filter(id=>id!==exam.id):[...editing.audience.examIds,exam.id]})}/><span><span className="block text-sm font-medium">{exam.name}</span><span className="block text-xs text-muted-foreground">{exam.familyName} · {exam.code}</span></span></label>)}</div></div>
      </div>
    </div>
    <div className="md:col-span-2 rounded-xl border p-4">
      <p className="text-sm font-semibold">Push preview</p>
      <div className="mx-auto mt-3 max-w-md rounded-2xl border bg-slate-50 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><Bell className="h-3.5 w-3.5"/>ExamTree · now</div>
        <div className="mt-2 flex gap-3"><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900">{editing.title||'Notification title'}</p><p className="mt-1 text-sm leading-5 text-slate-600">{editing.body||'Notification message appears here.'}</p></div>{editing.imageUrl&&<img src={editing.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover"/>}</div>
      </div>
    </div>
    <div className="md:col-span-2 rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground"><CalendarClock className="mr-1 inline h-3.5 w-3.5"/>Scheduled campaigns must use a future time. Use Send now for immediate delivery. Test pushes are isolated from learner inboxes and campaign metrics.</div>
    <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button><Button onClick={()=>void save()} disabled={saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Saving…':'Save campaign'}</Button></div>
  </CardContent></Card>}
 </div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>}
export default MobileNotificationsPage;