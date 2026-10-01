import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, MousePointerClick, RefreshCw, Smartphone, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase=((import.meta.env.VITE_API_URL as string|undefined)?.trim()||'/api').replace(/\/$/,'');
type Daily={day:string;events:number;sessions:number;opens:number};
type EventRow={eventName:string;count:number};
type EntityRow={entityType:string;entityId:string;placement:string;impressions:number;clicks:number};
type Data={days:number;summary:{eventCount:number;sessions:number;knownUsers:number;appOpens:number;homeViews:number;discoveryClicks:number};daily:Daily[];events:EventRow[];topEntities:EntityRow[];notificationSummary:{deliveryCount:number;sentCount:number;failedCount:number;openedCount:number};promotionSummary:{impressions:number;clicks:number};generatedAt:string};
async function call<T>(path:string):Promise<T>{const user=getFirebaseAuth()?.currentUser;if(!user)throw new Error('Your administrator session has expired.');const response=await fetch(apiBase+path,{headers:{Authorization:'Bearer '+await user.getIdToken()}});const body=await response.json().catch(()=>null) as (T&{error?:string})|null;if(!response.ok)throw new Error(body?.error||('Request failed ('+response.status+').'));if(!body)throw new Error('Mobile Analytics API returned an empty response.');return body;}
function rate(a:number,b:number){return b>0?((a/b)*100).toFixed(1)+'%':'—';}
export function MobileAnalyticsPage(){
 const[days,setDays]=useState('30');const[data,setData]=useState<Data|null>(null);const[loading,setLoading]=useState(true);
 const refresh=async()=>{setLoading(true);try{setData(await call<Data>('/admin/mobile/analytics?days='+days));}catch(error){showToast.error('Unable to load Mobile Analytics',error instanceof Error?error.message:'Request failed.');}finally{setLoading(false);}};
 useEffect(()=>{void refresh();},[days]);
 const maxEvents=useMemo(()=>Math.max(1,...(data?.daily.map(d=>d.events)||[1])),[data?.daily]);
 return <div className="space-y-5">
  <PageHeader title="Mobile App · Analytics" description="Mobile presentation and engagement only. Test performance, question quality and business analytics remain in their existing shared analytics modules." icon={<BarChart3 className="h-5 w-5"/>} actions={<div className="flex gap-2"><Select value={days} onValueChange={setDays}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem></SelectContent></Select><Button variant="outline" onClick={()=>void refresh()} disabled={loading}><RefreshCw className={'mr-1.5 h-4 w-4 '+(loading?'animate-spin':'')}/>Refresh</Button></div>}/>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <Metric icon={Activity} label="Mobile events" value={data?.summary.eventCount??0}/>
    <Metric icon={Smartphone} label="Sessions" value={data?.summary.sessions??0}/>
    <Metric icon={Users} label="Known users" value={data?.summary.knownUsers??0}/>
    <Metric icon={MousePointerClick} label="Discovery clicks" value={data?.summary.discoveryClicks??0}/>
  </div>
  <div className="grid gap-4 xl:grid-cols-2">
    <Card><CardHeader><CardTitle className="text-base">Engagement trend</CardTitle></CardHeader><CardContent><div className="space-y-2">{data?.daily.map(row=><div key={row.day} className="grid grid-cols-[90px_1fr_72px] items-center gap-3 text-xs"><span className="text-muted-foreground">{row.day.slice(5)}</span><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:Math.max(2,(row.events/maxEvents)*100)+'%'}}/></div><span className="text-right">{row.events} events</span></div>)}</div></CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Push notification performance</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3"><Stat label="Deliveries" value={data?.notificationSummary.deliveryCount??0}/><Stat label="Sent" value={data?.notificationSummary.sentCount??0}/><Stat label="Failed" value={data?.notificationSummary.failedCount??0}/><Stat label="Open rate" value={rate(data?.notificationSummary.openedCount??0,data?.notificationSummary.sentCount??0)}/></CardContent></Card>
  </div>
  <div className="grid gap-4 xl:grid-cols-2">
    <Card><CardHeader><CardTitle className="text-base">Event mix</CardTitle></CardHeader><CardContent className="space-y-2">{data?.events.length===0&&<p className="text-sm text-muted-foreground">No mobile analytics events recorded yet.</p>}{data?.events.map(row=><div key={row.eventName} className="flex items-center justify-between rounded-lg border px-3 py-2"><span className="font-mono text-xs">{row.eventName}</span><span className="text-sm font-semibold">{row.count}</span></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Promotion engagement</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-3"><Stat label="Impressions" value={data?.promotionSummary.impressions??0}/><Stat label="Clicks" value={data?.promotionSummary.clicks??0}/><Stat label="CTR" value={rate(data?.promotionSummary.clicks??0,data?.promotionSummary.impressions??0)}/></CardContent></Card>
  </div>
  <Card><CardHeader><CardTitle className="text-base">Top mobile discovery items</CardTitle></CardHeader><CardContent className="space-y-2">{data?.topEntities.length===0&&<p className="text-sm text-muted-foreground">No item-level mobile engagement has been recorded yet.</p>}{data?.topEntities.map((row,index)=><div key={row.entityType+'-'+row.entityId+'-'+row.placement+'-'+index} className="grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_180px_100px_100px] md:items-center"><div><p className="text-sm font-medium">{row.entityType||'item'}</p><p className="truncate font-mono text-xs text-muted-foreground">{row.entityId}</p></div><span className="text-xs text-muted-foreground">{row.placement||'—'}</span><span className="text-sm">{row.impressions} views</span><span className="text-sm font-semibold">{row.clicks} clicks</span></div>)}</CardContent></Card>
 </div>;
}
function Metric({icon:Icon,label,value}:{icon:React.ComponentType<{className?:string}>;label:string;value:number}){return <Card><CardContent className="flex items-center gap-3 p-5"><Icon className="h-5 w-5 text-primary"/><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></CardContent></Card>;}
function Stat({label,value}:{label:string;value:number|string}){return <div className="rounded-lg border p-3"><p className="text-xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;}
export default MobileAnalyticsPage;