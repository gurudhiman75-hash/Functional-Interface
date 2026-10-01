import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, RefreshCw, Save, Smartphone, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase=((import.meta.env.VITE_API_URL as string|undefined)?.trim()||'/api').replace(/\/$/,'');

type HeroSlide={
  id:string;title:string;subtitle:string;imageUrl:string;ctaLabel:string;
  destinationType:string;destinationValue:string;isActive:boolean;
  startAt:string|null;endAt:string|null;sortOrder:number;
};
type Configuration={
  heroSlides:HeroSlide[];
  featuredExamFamilyIds:string[];
  featuredTestSeriesIds:string[];
  sectionOrder:string[];
};
type ExamFamily={id:string;code:string;name:string;description:string|null};
type TestSeries={id:string;code:string;name:string;currentVersionNumber:number;examName:string};
type Data={configuration:Configuration;catalog:{examFamilies:ExamFamily[];testSeries:TestSeries[]};updatedAt:string|null;updatedBy:string|null};

const SECTION_LABELS:Record<string,string>={
  hero:'Hero banner',
  exam_categories:'Exam Categories',
  featured_test_series:'Featured Test Series',
  continue_learning:'Continue Learning',
};

async function call<T>(path:string,init?:RequestInit):Promise<T>{
  const user=getFirebaseAuth()?.currentUser;
  if(!user)throw new Error('Your administrator session has expired.');
  const response=await fetch(`${apiBase}${path}`,{
    ...init,
    headers:{'Content-Type':'application/json',Authorization:`Bearer ${await user.getIdToken()}`,...init?.headers},
  });
  const body=await response.json().catch(()=>null) as (T&{error?:string})|null;
  if(!response.ok)throw new Error(body?.error||`Request failed (${response.status}).`);
  if(!body)throw new Error('Mobile Home API returned an empty response.');
  return body;
}

function localDateTime(value:string|null){
  if(!value)return '';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '';
  const pad=(n:number)=>String(n).padStart(2,'0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function isoOrNull(value:string){return value?new Date(value).toISOString():null;}
function newSlide():HeroSlide{
  return {id:crypto.randomUUID(),title:'',subtitle:'',imageUrl:'',ctaLabel:'Explore',destinationType:'none',destinationValue:'',isActive:true,startAt:null,endAt:null,sortOrder:1};
}
function moveValue(values:string[],id:string,direction:-1|1){
  const index=values.indexOf(id);
  const target=index+direction;
  if(index<0||target<0||target>=values.length)return values;
  const next=[...values];
  [next[index],next[target]]=[next[target]!,next[index]!];
  return next;
}

export function MobileHomeManagementPage(){
  const[data,setData]=useState<Data|null>(null);
  const[config,setConfig]=useState<Configuration|null>(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[editingHeroId,setEditingHeroId]=useState<string|null>(null);
  const[seriesQuery,setSeriesQuery]=useState('');

  const refresh=async()=>{
    setLoading(true);
    try{
      const result=await call<Data>('/admin/mobile/home');
      setData(result);
      setConfig(result.configuration);
      setEditingHeroId(null);
    }catch(error){
      showToast.error('Unable to load Mobile Home',error instanceof Error?error.message:'Request failed.');
    }finally{setLoading(false);}
  };
  useEffect(()=>{void refresh();},[]);

  const familyById=useMemo(()=>new Map((data?.catalog.examFamilies||[]).map(item=>[item.id,item])),[data?.catalog.examFamilies]);
  const seriesById=useMemo(()=>new Map((data?.catalog.testSeries||[]).map(item=>[item.id,item])),[data?.catalog.testSeries]);
  const selectedFamilyItems=useMemo(()=>config?.featuredExamFamilyIds.map(id=>familyById.get(id)).filter((item):item is ExamFamily=>Boolean(item))||[],[config?.featuredExamFamilyIds,familyById]);
  const selectedSeriesItems=useMemo(()=>config?.featuredTestSeriesIds.map(id=>seriesById.get(id)).filter((item):item is TestSeries=>Boolean(item))||[],[config?.featuredTestSeriesIds,seriesById]);
  const availableFamilies=useMemo(()=>new Set(config?.featuredExamFamilyIds||[]),[config?.featuredExamFamilyIds]);
  const availableSeries=useMemo(()=>new Set(config?.featuredTestSeriesIds||[]),[config?.featuredTestSeriesIds]);
  const filteredSeries=useMemo(()=>{
    const query=seriesQuery.trim().toLowerCase();
    return (data?.catalog.testSeries||[]).filter(item=>!availableSeries.has(item.id)&&(!query||item.name.toLowerCase().includes(query)||item.examName.toLowerCase().includes(query)||item.code.toLowerCase().includes(query)));
  },[data?.catalog.testSeries,availableSeries,seriesQuery]);

  const updateSlide=(id:string,patch:Partial<HeroSlide>)=>setConfig(previous=>previous?({
    ...previous,
    heroSlides:previous.heroSlides.map(slide=>slide.id===id?{...slide,...patch}:slide),
  }):previous);
  const addSlide=()=>{
    const slide={...newSlide()};
    setEditingHeroId(slide.id);
    setConfig(previous=>previous?({...previous,heroSlides:[...previous.heroSlides,{...slide,sortOrder:previous.heroSlides.length+1}]}):previous);
  };
  const removeSlide=(id:string)=>{
    if(editingHeroId===id)setEditingHeroId(null);
    setConfig(previous=>previous?({...previous,heroSlides:previous.heroSlides.filter(slide=>slide.id!==id).map((slide,index)=>({...slide,sortOrder:index+1}))}):previous);
  };
  const moveSlide=(index:number,direction:-1|1)=>setConfig(previous=>{
    if(!previous)return previous;
    const next=[...previous.heroSlides];const target=index+direction;
    if(target<0||target>=next.length)return previous;
    [next[index],next[target]]=[next[target]!,next[index]!];
    return {...previous,heroSlides:next.map((slide,i)=>({...slide,sortOrder:i+1}))};
  });
  const addFamily=(id:string)=>setConfig(previous=>previous&&!previous.featuredExamFamilyIds.includes(id)?({...previous,featuredExamFamilyIds:[...previous.featuredExamFamilyIds,id]}):previous);
  const removeFamily=(id:string)=>setConfig(previous=>previous?({...previous,featuredExamFamilyIds:previous.featuredExamFamilyIds.filter(value=>value!==id)}):previous);
  const moveFamily=(id:string,direction:-1|1)=>setConfig(previous=>previous?({...previous,featuredExamFamilyIds:moveValue(previous.featuredExamFamilyIds,id,direction)}):previous);
  const addSeries=(id:string)=>setConfig(previous=>previous&&!previous.featuredTestSeriesIds.includes(id)?({...previous,featuredTestSeriesIds:[...previous.featuredTestSeriesIds,id]}):previous);
  const removeSeries=(id:string)=>setConfig(previous=>previous?({...previous,featuredTestSeriesIds:previous.featuredTestSeriesIds.filter(value=>value!==id)}):previous);
  const moveSeries=(id:string,direction:-1|1)=>setConfig(previous=>previous?({...previous,featuredTestSeriesIds:moveValue(previous.featuredTestSeriesIds,id,direction)}):previous);
  const moveSection=(index:number,direction:-1|1)=>setConfig(previous=>{
    if(!previous)return previous;
    const next=[...previous.sectionOrder];const target=index+direction;
    if(target<0||target>=next.length)return previous;
    [next[index],next[target]]=[next[target]!,next[index]!];
    return {...previous,sectionOrder:next};
  });

  const save=async()=>{
    if(!config)return;
    const invalid=config.heroSlides.find(slide=>slide.title.trim().length<2);
    if(invalid){showToast.error('Hero slide needs a title','Every retained hero slide must have a title.');setEditingHeroId(invalid.id);return;}
    setSaving(true);
    try{
      const result=await call<{configuration:Configuration;updatedAt:string}>('/admin/mobile/home',{method:'PUT',body:JSON.stringify({configuration:config})});
      setConfig(result.configuration);
      setData(previous=>previous?({...previous,configuration:result.configuration,updatedAt:result.updatedAt}):previous);
      showToast.success('Mobile homepage saved','The configuration is now available through the mobile home endpoint.');
    }catch(error){
      showToast.error('Unable to save Mobile Home',error instanceof Error?error.message:'Request failed.');
    }finally{setSaving(false);}
  };

  return <div className="space-y-5">
    <PageHeader
      title="Mobile App · Home Management"
      description="Manage each mobile-home item independently while keeping exams, test series and Learn content canonical and shared."
      icon={<Smartphone className="h-5 w-5"/>}
      actions={<div className="flex gap-2"><Button variant="outline" onClick={()=>void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading?'animate-spin':''}`}/>Refresh</Button><Button onClick={()=>void save()} disabled={!config||saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Saving…':'Save homepage'}</Button></div>}
    />

    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 text-sm leading-6">
        Use the controls below to edit, order, show or remove individual items. Editing the underlying exam or test-series content still happens in its canonical workspace.
        {data?.updatedAt&&<span className="ml-1 text-muted-foreground">Last saved {new Date(data.updatedAt).toLocaleString('en-IN')}.</span>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div><CardTitle className="text-base">Hero slides</CardTitle><p className="mt-1 text-sm text-muted-foreground">Each slide can be edited, enabled, ordered or removed independently.</p></div>
        <Button variant="outline" onClick={addSlide}><Plus className="mr-1.5 h-4 w-4"/>Add slide</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {config?.heroSlides.length===0&&<div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"><ImagePlus className="mx-auto mb-2 h-6 w-6"/>No hero slides configured.</div>}
        {config?.heroSlides.map((slide,index)=>{
          const editing=editingHeroId===slide.id;
          return <div key={slide.id} className="overflow-hidden rounded-xl border">
            <div className="flex flex-wrap items-center gap-3 p-4">
              {slide.imageUrl?<img src={slide.imageUrl} alt="" className="h-14 w-24 rounded-lg border object-cover" onError={event=>{event.currentTarget.style.display='none';}}/>:<div className="flex h-14 w-24 items-center justify-center rounded-lg border bg-muted"><ImagePlus className="h-5 w-5 text-muted-foreground"/></div>}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="truncate font-semibold">{slide.title||`Untitled slide ${index+1}`}</p><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${slide.isActive?'bg-emerald-100 text-emerald-700':'bg-muted text-muted-foreground'}`}>{slide.isActive?'Active':'Off'}</span></div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{slide.subtitle||'No subtitle'} · {slide.destinationType==='none'?'No action':slide.destinationType}</p>
              </div>
              <div className="flex items-center gap-1">
                <Switch checked={slide.isActive} onCheckedChange={checked=>updateSlide(slide.id,{isActive:checked})} aria-label={`Toggle ${slide.title||`slide ${index+1}`}`}/>
                <Button size="sm" variant={editing?'secondary':'outline'} onClick={()=>setEditingHeroId(editing?null:slide.id)}><Pencil className="mr-1.5 h-4 w-4"/>{editing?'Close':'Edit'}</Button>
                <Button size="icon" variant="ghost" onClick={()=>moveSlide(index,-1)} disabled={index===0} aria-label="Move slide up"><ArrowUp className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>moveSlide(index,1)} disabled={index===config.heroSlides.length-1} aria-label="Move slide down"><ArrowDown className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>removeSlide(slide.id)} aria-label="Remove slide"><Trash2 className="h-4 w-4"/></Button>
              </div>
            </div>
            {editing&&<div className="border-t bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title"><Input value={slide.title} onChange={e=>updateSlide(slide.id,{title:e.target.value})} placeholder="Punjab Govt. Exams"/></Field>
                <Field label="CTA label"><Input value={slide.ctaLabel} onChange={e=>updateSlide(slide.id,{ctaLabel:e.target.value})} placeholder="Explore Tests"/></Field>
                <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={slide.subtitle} onChange={e=>updateSlide(slide.id,{subtitle:e.target.value})} placeholder="Prepare with exam-focused mock tests and learning resources."/></Field></div>
                <div className="md:col-span-2"><Field label="Banner image URL"><Input value={slide.imageUrl} onChange={e=>updateSlide(slide.id,{imageUrl:e.target.value})} placeholder="https://…"/></Field></div>
                <Field label="Destination type"><Select value={slide.destinationType} onValueChange={value=>updateSlide(slide.id,{destinationType:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No action</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="learn">Learn</SelectItem><SelectItem value="url">External URL</SelectItem></SelectContent></Select></Field>
                <Field label="Destination / deep link"><Input value={slide.destinationValue} onChange={e=>updateSlide(slide.id,{destinationValue:e.target.value})} placeholder="Exam ID, series ID, Learn route or URL"/></Field>
                <Field label="Start"><Input type="datetime-local" value={localDateTime(slide.startAt)} onChange={e=>updateSlide(slide.id,{startAt:isoOrNull(e.target.value)})}/></Field>
                <Field label="End"><Input type="datetime-local" value={localDateTime(slide.endAt)} onChange={e=>updateSlide(slide.id,{endAt:isoOrNull(e.target.value)})}/></Field>
              </div>
            </div>}
          </div>;
        })}
      </CardContent>
    </Card>

    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Exam Categories</CardTitle><p className="text-sm text-muted-foreground">Manage the category grid one item at a time. Order here is the mobile order.</p></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold">Shown on Home</p><Button asChild size="sm" variant="ghost"><Link to="/content/taxonomy">Edit source data</Link></Button></div>
            <div className="space-y-2">
              {selectedFamilyItems.length===0&&<p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No categories selected.</p>}
              {selectedFamilyItems.map((family,index)=><div key={family.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{family.name}</p><p className="text-xs text-muted-foreground">{family.code}</p></div>
                <Button size="icon" variant="ghost" onClick={()=>moveFamily(family.id,-1)} disabled={index===0} aria-label="Move category up"><ArrowUp className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>moveFamily(family.id,1)} disabled={index===selectedFamilyItems.length-1} aria-label="Move category down"><ArrowDown className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>removeFamily(family.id)} aria-label="Remove category"><Trash2 className="h-4 w-4"/></Button>
              </div>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Add category</p>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {(data?.catalog.examFamilies||[]).filter(family=>!availableFamilies.has(family.id)).map(family=><div key={family.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{family.name}</p><p className="truncate text-xs text-muted-foreground">{family.code}{family.description?` · ${family.description}`:''}</p></div>
                <Button size="sm" variant="outline" onClick={()=>addFamily(family.id)}><Plus className="mr-1 h-4 w-4"/>Add</Button>
              </div>)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Featured Test Series</CardTitle><p className="text-sm text-muted-foreground">Manage every featured series independently; order here is the mobile order.</p></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold">Shown on Home</p><Button asChild size="sm" variant="ghost"><Link to="/tests/series">Edit source data</Link></Button></div>
            <div className="space-y-2">
              {selectedSeriesItems.length===0&&<p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No featured series selected.</p>}
              {selectedSeriesItems.map((series,index)=><div key={series.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{series.name}</p><p className="truncate text-xs text-muted-foreground">{series.examName} · {series.code} · v{series.currentVersionNumber}</p></div>
                <Button size="icon" variant="ghost" onClick={()=>moveSeries(series.id,-1)} disabled={index===0} aria-label="Move series up"><ArrowUp className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>moveSeries(series.id,1)} disabled={index===selectedSeriesItems.length-1} aria-label="Move series down"><ArrowDown className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>removeSeries(series.id)} aria-label="Remove series"><Trash2 className="h-4 w-4"/></Button>
              </div>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Add test series</p>
            <Input value={seriesQuery} onChange={event=>setSeriesQuery(event.target.value)} placeholder="Search test series…" className="mb-2"/>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {filteredSeries.map(series=><div key={series.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{series.name}</p><p className="truncate text-xs text-muted-foreground">{series.examName} · {series.code}</p></div>
                <Button size="sm" variant="outline" onClick={()=>addSeries(series.id)}><Plus className="mr-1 h-4 w-4"/>Add</Button>
              </div>)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Homepage section order</CardTitle><p className="text-sm text-muted-foreground">Continue Learning remains learner-data driven; this only changes where the section appears.</p></CardHeader>
      <CardContent className="space-y-2">{config?.sectionOrder.map((section,index)=><div key={section} className="flex items-center justify-between rounded-lg border px-4 py-3"><div><p className="text-sm font-medium">{SECTION_LABELS[section]||section}</p><p className="text-xs text-muted-foreground">{section==='continue_learning'?'Personalized from learner progress; not manually populated.':'Controlled by this mobile presentation configuration.'}</p></div><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={()=>moveSection(index,-1)} disabled={index===0}><ArrowUp className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>moveSection(index,1)} disabled={index===config.sectionOrder.length-1}><ArrowDown className="h-4 w-4"/></Button></div></div>)}</CardContent>
    </Card>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>}
export default MobileHomeManagementPage;
