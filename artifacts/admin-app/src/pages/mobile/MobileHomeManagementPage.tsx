import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowUp, Bell, BookOpen, Brain, Copy, GraduationCap, GripVertical,
  ImagePlus, Landmark, Layers3, Newspaper, Pencil, Plus, RotateCcw,
  Save, Shield, Smartphone, Sparkles, Star, Train, Trash2, Trophy, Grid3X3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { MediaAssetPicker } from '@/components/shared/MediaAssetPicker';
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
  id:string;title:string;subtitle:string;imageUrl:string;iconName:string;iconUrl:string;ctaLabel:string;
  destinationType:string;destinationValue:string;isActive:boolean;
  startAt:string|null;endAt:string|null;sortOrder:number;
};
type HomeCard={id:string;title:string;subtitle:string;badge:string;iconName:string;iconUrl:string;imageUrl:string;ctaLabel:string;destinationType:string;destinationValue:string;span:number;style:string;isActive:boolean;sortOrder:number};
type CustomSection={id:string;title:string;subtitle:string;iconName:string;iconUrl:string;layout:string;columns:number;gap:string;style:string;isVisible:boolean;sortOrder:number;cards:HomeCard[]};
type ItemOverride={title?:string;subtitle?:string;badge?:string;iconName?:string;iconUrl?:string;imageUrl?:string;hidden?:boolean};
type SectionSetting={title?:string;subtitle?:string;iconName?:string;iconUrl?:string;layout?:string;columns?:number;isVisible?:boolean};
type Configuration={
  heroSlides:HeroSlide[];
  featuredExamFamilyIds:string[];
  featuredTestSeriesIds:string[];
  customSections:CustomSection[];
  itemOverrides:Record<string,ItemOverride>;
  sectionSettings:Record<string,SectionSetting>;
  sectionOrder:string[];
};
type ExamFamily={id:string;code:string;name:string;description:string|null};
type TestSeries={id:string;code:string;name:string;currentVersionNumber:number;examName:string};
type Exam={id:string;code:string;name:string;familyName:string};
type ManagedPage={id:string;slug:string;title:string;renderMode:string;isActive:boolean};
type Data={configuration:Configuration;catalog:{examFamilies:ExamFamily[];testSeries:TestSeries[];exams:Exam[]};updatedAt:string|null;updatedBy:string|null};

const SECTION_LABELS:Record<string,string>={
  hero:'Hero banner',
  exam_categories:'Exam Categories',
  featured_test_series:'Featured Test Series',
  continue_learning:'Continue Learning',
  recommended_learning:'Recommended Learning',
  current_affairs:'Current Affairs',
  today_goal:"Today's Goal",
};

const ICON_OPTIONS=[
  {value:'government',label:'Government',icon:Landmark},
  {value:'school',label:'Education',icon:GraduationCap},
  {value:'book',label:'Learning',icon:BookOpen},
  {value:'test',label:'Tests',icon:Trophy},
  {value:'banking',label:'Banking',icon:Landmark},
  {value:'railway',label:'Railway',icon:Train},
  {value:'defence',label:'Defence',icon:Shield},
  {value:'news',label:'News',icon:Newspaper},
  {value:'brain',label:'Practice',icon:Brain},
  {value:'bell',label:'Alerts',icon:Bell},
  {value:'star',label:'Featured',icon:Star},
  {value:'sparkles',label:'Special',icon:Sparkles},
  {value:'grid',label:'General',icon:Grid3X3},
] as const;

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
  return {id:crypto.randomUUID(),title:'',subtitle:'',imageUrl:'',iconName:'',iconUrl:'',ctaLabel:'Explore',destinationType:'none',destinationValue:'',isActive:true,startAt:null,endAt:null,sortOrder:1};
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
  const[editingCustomSectionId,setEditingCustomSectionId]=useState<string|null>(null);
  const[editingBuilderSectionId,setEditingBuilderSectionId]=useState<string|null>(null);
  const[draggedSectionId,setDraggedSectionId]=useState<string|null>(null);
  const[managedPages,setManagedPages]=useState<ManagedPage[]>([]);

  const refresh=async()=>{
    setLoading(true);
    try{
      const [result,pagesResult]=await Promise.all([
        call<Data>('/admin/mobile/home'),
        call<{pages:ManagedPage[]}>('/admin/mobile/pages'),
      ]);
      setData(result);
      setConfig(result.configuration);
      setManagedPages(pagesResult.pages.filter(page=>page.isActive));
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
  const setItemOverride=(id:string,patch:Partial<ItemOverride>)=>setConfig(previous=>previous?({...previous,itemOverrides:{...previous.itemOverrides,[id]:{...(previous.itemOverrides[id]||{}),...patch}}}):previous);
  const setSectionSetting=(id:string,patch:Partial<SectionSetting>)=>setConfig(previous=>previous?({...previous,sectionSettings:{...previous.sectionSettings,[id]:{...(previous.sectionSettings[id]||{}),...patch}}}):previous);
  const addCustomSection=(layout='horizontal')=>{
    const id=`custom_${crypto.randomUUID()}`;
    const titleByLayout:Record<string,string>={horizontal:'New card row',grid:'New grid',list:'New list',banner:'New banner'};
    const section:CustomSection={id,title:titleByLayout[layout]||'New section',subtitle:'',iconName:'',iconUrl:'',layout,columns:2,gap:'normal',style:'default',isVisible:true,sortOrder:(config?.customSections.length||0)+1,cards:[]};
    setConfig(previous=>previous?({...previous,customSections:[...previous.customSections,section],sectionOrder:[...previous.sectionOrder,id]}):previous);
    setEditingCustomSectionId(id);
    setEditingBuilderSectionId(id);
  };
  const updateCustomSection=(id:string,patch:Partial<CustomSection>)=>setConfig(previous=>previous?({...previous,customSections:previous.customSections.map(section=>section.id===id?{...section,...patch}:section)}):previous);
  const removeCustomSection=(id:string)=>setConfig(previous=>previous?({...previous,customSections:previous.customSections.filter(section=>section.id!==id),sectionOrder:previous.sectionOrder.filter(value=>value!==id)}):previous);
  const duplicateCustomSection=(id:string)=>setConfig(previous=>{
    if(!previous)return previous;
    const source=previous.customSections.find(section=>section.id===id);
    if(!source)return previous;
    const nextId=`custom_${crypto.randomUUID()}`;
    const duplicate:CustomSection={
      ...source,
      id:nextId,
      title:`${source.title} copy`,
      sortOrder:previous.customSections.length+1,
      cards:source.cards.map((card,index)=>({...card,id:crypto.randomUUID(),sortOrder:index+1})),
    };
    const sourceOrderIndex=previous.sectionOrder.indexOf(id);
    const order=[...previous.sectionOrder];
    order.splice(sourceOrderIndex>=0?sourceOrderIndex+1:order.length,0,nextId);
    return {...previous,customSections:[...previous.customSections,duplicate],sectionOrder:order};
  });
  const addCustomCard=(sectionId:string)=>setConfig(previous=>{
    if(!previous)return previous;
    const section=previous.customSections.find(item=>item.id===sectionId); if(!section)return previous;
    const card:HomeCard={id:crypto.randomUUID(),title:'New card',subtitle:'',badge:'',iconName:'',iconUrl:'',imageUrl:'',ctaLabel:'Open',destinationType:'none',destinationValue:'',span:1,style:'default',isActive:true,sortOrder:section.cards.length+1};
    return {...previous,customSections:previous.customSections.map(item=>item.id===sectionId?{...item,cards:[...item.cards,card]}:item)};
  });
  const updateCustomCard=(sectionId:string,cardId:string,patch:Partial<HomeCard>)=>setConfig(previous=>previous?({...previous,customSections:previous.customSections.map(section=>section.id===sectionId?{...section,cards:section.cards.map(card=>card.id===cardId?{...card,...patch}:card)}:section)}):previous);
  const removeCustomCard=(sectionId:string,cardId:string)=>setConfig(previous=>previous?({...previous,customSections:previous.customSections.map(section=>section.id===sectionId?{...section,cards:section.cards.filter(card=>card.id!==cardId).map((card,index)=>({...card,sortOrder:index+1}))}:section)}):previous);
  const duplicateCustomCard=(sectionId:string,cardId:string)=>setConfig(previous=>{
    if(!previous)return previous;
    return {...previous,customSections:previous.customSections.map(section=>{
      if(section.id!==sectionId)return section;
      const index=section.cards.findIndex(card=>card.id===cardId);
      if(index<0)return section;
      const source=section.cards[index]!;
      const cards=[...section.cards];
      cards.splice(index+1,0,{...source,id:crypto.randomUUID(),title:`${source.title} copy`});
      return {...section,cards:cards.map((card,cardIndex)=>({...card,sortOrder:cardIndex+1}))};
    })};
  });
  const moveCustomCard=(sectionId:string,cardId:string,direction:-1|1)=>setConfig(previous=>{
    if(!previous)return previous;
    return {...previous,customSections:previous.customSections.map(section=>{
      if(section.id!==sectionId)return section;
      const index=section.cards.findIndex(card=>card.id===cardId);
      const target=index+direction;
      if(index<0||target<0||target>=section.cards.length)return section;
      const cards=[...section.cards];
      [cards[index],cards[target]]=[cards[target]!,cards[index]!];
      return {...section,cards:cards.map((card,cardIndex)=>({...card,sortOrder:cardIndex+1}))};
    })};
  });
  const moveSection=(index:number,direction:-1|1)=>setConfig(previous=>{
    if(!previous)return previous;
    const next=[...previous.sectionOrder];const target=index+direction;
    if(target<0||target>=next.length)return previous;
    [next[index],next[target]]=[next[target]!,next[index]!];
    return {...previous,sectionOrder:next};
  });
  const moveSectionTo=(sourceId:string,targetId:string)=>setConfig(previous=>{
    if(!previous||sourceId===targetId)return previous;
    const next=[...previous.sectionOrder];
    const source=next.indexOf(sourceId);const target=next.indexOf(targetId);
    if(source<0||target<0)return previous;
    const [value]=next.splice(source,1);
    next.splice(target,0,value!);
    return {...previous,sectionOrder:next};
  });

  const save=async()=>{
    if(!config)return;
    const invalid=config.heroSlides.find(slide=>slide.title.trim().length<2);
    if(invalid){showToast.error('Hero slide needs a title','Every retained hero slide must have a title.');setEditingHeroId(invalid.id);return;}
    const badSchedule=config.heroSlides.find(slide=>slide.startAt&&slide.endAt&&new Date(slide.startAt)>=new Date(slide.endAt));
    if(badSchedule){showToast.error('Hero schedule is invalid',`"${badSchedule.title}" must end after it starts.`);setEditingHeroId(badSchedule.id);return;}
    const badSection=config.customSections.find(section=>!section.title.trim()||section.cards.some(card=>!card.title.trim()));
    if(badSection){showToast.error('Custom content needs titles','Every custom section and retained card needs a title.');setEditingCustomSectionId(badSection.id);return;}
    const destinations=[...config.heroSlides.map(item=>({title:item.title,type:item.destinationType,value:item.destinationValue})),...config.customSections.flatMap(section=>section.cards.map(item=>({title:item.title,type:item.destinationType,value:item.destinationValue})))];
    const missingDestination=destinations.find(item=>['exam','test_series','page'].includes(item.type)&&!item.value.trim());
    if(missingDestination){showToast.error('Destination is required',`Choose where "${missingDestination.title||'Home item'}" should open.`);return;}
    const invalidUrl=destinations.find(item=>item.type==='url'&&!isHttpUrl(item.value));
    if(invalidUrl){showToast.error('URL is invalid',`"${invalidUrl.title||'Home item'}" needs a valid http/https URL.`);return;}
    setSaving(true);
    try{
      const result=await call<{configuration:Configuration;updatedAt:string}>('/admin/mobile/home',{method:'PUT',body:JSON.stringify({configuration:config})});
      setConfig(result.configuration);
      setData(previous=>previous?({...previous,configuration:result.configuration,updatedAt:result.updatedAt}):previous);
      showToast.success('Mobile homepage published','The latest layout is now available to the mobile app.');
    }catch(error){
      showToast.error('Unable to save Mobile Home',error instanceof Error?error.message:'Request failed.');
    }finally{setSaving(false);}
  };

  return <div className="space-y-5">
    <PageHeader
      title="Mobile App · Home Management"
      description="Manage each mobile-home item independently while keeping exams, test series and Learn content canonical and shared."
      icon={<Smartphone className="h-5 w-5"/>}
      actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={()=>void refresh()} disabled={loading}><RotateCcw className="mr-1.5 h-4 w-4"/>Discard draft</Button><Button onClick={()=>void save()} disabled={!config||saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Publishing…':'Publish homepage'}</Button></div>}
    />

    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 text-sm leading-6">
        Changes remain a draft in this screen until you publish. Drag sections in the builder, preview the phone layout, then publish when ready. Canonical exam, test-series and Learn content remains shared.
        {data?.updatedAt&&<span className="ml-1 text-muted-foreground"> Last published {new Date(data.updatedAt).toLocaleString('en-IN')}.</span>}
      </CardContent>
    </Card>

    {config&&<div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_390px]">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div><CardTitle className="text-base">Visual layout builder</CardTitle><p className="mt-1 text-sm text-muted-foreground">Reorder, rename, hide or add Home content directly here.</p></div>
          <Select onValueChange={value=>addCustomSection(value)}>
            <SelectTrigger className="w-[170px]"><Plus className="mr-2 h-4 w-4"/><SelectValue placeholder="Add content"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal cards</SelectItem>
              <SelectItem value="grid">Grid section</SelectItem>
              <SelectItem value="list">List section</SelectItem>
              <SelectItem value="banner">Banner section</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-2">
          {config.sectionOrder.map((section,index)=>{
            const custom=config.customSections.find(item=>item.id===section);
            const setting=config.sectionSettings[section]||{};
            const isVisible=custom?custom.isVisible:setting.isVisible!==false;
            const displayTitle=custom?.title||setting.title||SECTION_LABELS[section]||section;
            const editing=editingBuilderSectionId===section;
            return <div
              key={section}
              draggable
              onDragStart={()=>setDraggedSectionId(section)}
              onDragEnd={()=>setDraggedSectionId(null)}
              onDragOver={event=>event.preventDefault()}
              onDrop={()=>{if(draggedSectionId)moveSectionTo(draggedSectionId,section);setDraggedSectionId(null);}}
              className={`rounded-xl border bg-background transition ${draggedSectionId===section?'opacity-50':''}`}
            >
              <div className="flex items-center gap-2 px-3 py-3">
                <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground"/>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{displayTitle}</p><p className="text-xs text-muted-foreground">{custom?`${custom.layout} content`:'Built-in content'} · position {index+1}</p></div>
                <Switch checked={isVisible} onCheckedChange={checked=>custom?updateCustomSection(section,{isVisible:checked}):setSectionSetting(section,{isVisible:checked})} aria-label={`Toggle ${displayTitle}`}/>
                <Button size="icon" variant={editing?'secondary':'ghost'} onClick={()=>setEditingBuilderSectionId(editing?null:section)} aria-label={`Edit ${displayTitle}`}><Pencil className="h-4 w-4"/></Button>
                {custom&&<Button size="icon" variant="ghost" onClick={()=>duplicateCustomSection(section)} aria-label={`Duplicate ${displayTitle}`}><Copy className="h-4 w-4"/></Button>}
                {custom&&<Button size="icon" variant="ghost" onClick={()=>removeCustomSection(section)} aria-label={`Remove ${displayTitle}`}><Trash2 className="h-4 w-4"/></Button>}
                <Button size="icon" variant="ghost" onClick={()=>moveSection(index,-1)} disabled={index===0} aria-label="Move section up"><ArrowUp className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>moveSection(index,1)} disabled={index===config.sectionOrder.length-1} aria-label="Move section down"><ArrowDown className="h-4 w-4"/></Button>
              </div>
              {editing&&<div className="grid gap-3 border-t bg-muted/20 p-3 md:grid-cols-2">
                {section==='hero'&&!custom
                  ?<div className="md:col-span-2 rounded-lg border border-dashed bg-background p-3 text-xs text-muted-foreground">Hero visibility and position are controlled here. Hero title, subtitle, imagery, icons, actions and schedule are managed in <strong>Hero slides</strong> below.</div>
                  :<>
                    <Field label="Display title"><Input value={custom?custom.title:(setting.title||'')} onChange={e=>custom?updateCustomSection(section,{title:e.target.value}):setSectionSetting(section,{title:e.target.value})} placeholder={SECTION_LABELS[section]||'Section title'}/></Field>
                    {custom?<Field label="Content layout"><Select value={custom.layout} onValueChange={value=>updateCustomSection(section,{layout:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="horizontal">Horizontal cards</SelectItem><SelectItem value="grid">Grid</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="banner">Banner</SelectItem></SelectContent></Select></Field>:<div className="flex items-end"><p className="pb-2 text-xs text-muted-foreground">{section==='exam_categories'||section==='featured_test_series'?'Use Standard section appearance below for layout options.':'This data-driven section keeps its native mobile layout.'}</p></div>}
                    {custom&&<Field label="Card style"><StyleSelect value={custom.style} onChange={value=>updateCustomSection(section,{style:value})}/></Field>}
                    {custom&&custom.layout==='grid'&&<><Field label="Grid columns"><Select value={String(custom.columns)} onValueChange={value=>updateCustomSection(section,{columns:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="1">1 column</SelectItem><SelectItem value="2">2 columns</SelectItem><SelectItem value="3">3 columns</SelectItem><SelectItem value="4">4 columns</SelectItem></SelectContent></Select></Field><Field label="Spacing"><Select value={custom.gap} onValueChange={value=>updateCustomSection(section,{gap:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="compact">Compact</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="relaxed">Relaxed</SelectItem></SelectContent></Select></Field></>}
                    <Field label="Built-in icon"><IconPicker value={custom?custom.iconName:(setting.iconName||'')} onChange={value=>custom?updateCustomSection(section,{iconName:value}):setSectionSetting(section,{iconName:value})}/></Field>
                    <Field label="Custom icon"><MediaAssetPicker value={custom?custom.iconUrl:(setting.iconUrl||'')} onChange={url=>custom?updateCustomSection(section,{iconUrl:url}):setSectionSetting(section,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
                    {custom&&<div className="md:col-span-2"><Button size="sm" variant="outline" onClick={()=>{setEditingCustomSectionId(section);setEditingBuilderSectionId(null);}}><Layers3 className="mr-1.5 h-4 w-4"/>Edit cards & destinations</Button></div>}
                  </>}
              </div>}
            </div>;
          })}
        </CardContent>
      </Card>
      <PhonePreview config={config} familyById={familyById} seriesById={seriesById}/>
    </div>}

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
                <div className="md:col-span-2"><Field label="Banner image"><MediaAssetPicker value={slide.imageUrl} onChange={url=>updateSlide(slide.id,{imageUrl:url})} preferredType="Home Banner" label="Choose / Upload"/></Field></div>
                <Field label="Built-in icon"><IconPicker value={slide.iconName} onChange={value=>updateSlide(slide.id,{iconName:value})}/></Field>
                <Field label="Custom icon"><MediaAssetPicker value={slide.iconUrl} onChange={url=>updateSlide(slide.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
                <DestinationEditor
                  type={slide.destinationType}
                  value={slide.destinationValue}
                  pages={managedPages}
                  exams={data?.catalog.exams||[]}
                  testSeries={data?.catalog.testSeries||[]}
                  onChange={(destinationType,destinationValue)=>updateSlide(slide.id,{destinationType,destinationValue})}
                />
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
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div><CardTitle className="flex items-center gap-2 text-base"><Layers3 className="h-4 w-4"/>Custom content sections</CardTitle><p className="mt-1 text-sm text-muted-foreground">Add homepage content areas and cards without an APK change. Each card can have its own icon, image, badge and destination.</p></div>
        <Button variant="outline" onClick={()=>addCustomSection()}><Plus className="mr-1.5 h-4 w-4"/>Add section</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {config?.customSections.length===0&&<div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No custom sections yet.</div>}
        {config?.customSections.map(section=><div key={section.id} className="overflow-hidden rounded-xl border">
          <div className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1"><p className="font-semibold">{section.title}</p><p className="text-xs text-muted-foreground">{section.layout} · {section.cards.length} card{section.cards.length===1?'':'s'}</p></div>
            <Switch checked={section.isVisible} onCheckedChange={checked=>updateCustomSection(section.id,{isVisible:checked})}/>
            <Button size="sm" variant="outline" onClick={()=>setEditingCustomSectionId(editingCustomSectionId===section.id?null:section.id)}><Pencil className="mr-1.5 h-4 w-4"/>{editingCustomSectionId===section.id?'Close':'Edit'}</Button>
            <Button size="icon" variant="ghost" onClick={()=>duplicateCustomSection(section.id)} aria-label="Duplicate section"><Copy className="h-4 w-4"/></Button>
            <Button size="icon" variant="ghost" onClick={()=>removeCustomSection(section.id)}><Trash2 className="h-4 w-4"/></Button>
          </div>
          {editingCustomSectionId===section.id&&<div className="space-y-4 border-t bg-muted/20 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Section title"><Input value={section.title} onChange={e=>updateCustomSection(section.id,{title:e.target.value})}/></Field>
              <Field label="Layout"><Select value={section.layout} onValueChange={value=>updateCustomSection(section.id,{layout:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="horizontal">Horizontal cards</SelectItem><SelectItem value="grid">Grid</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="banner">Banner</SelectItem></SelectContent></Select></Field>
              <Field label="Card style"><StyleSelect value={section.style} onChange={value=>updateCustomSection(section.id,{style:value})}/></Field>
              {section.layout==='grid'&&<><Field label="Grid columns"><Select value={String(section.columns)} onValueChange={value=>updateCustomSection(section.id,{columns:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="1">1 column</SelectItem><SelectItem value="2">2 columns</SelectItem><SelectItem value="3">3 columns</SelectItem><SelectItem value="4">4 columns</SelectItem></SelectContent></Select></Field><Field label="Spacing"><Select value={section.gap} onValueChange={value=>updateCustomSection(section.id,{gap:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="compact">Compact</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="relaxed">Relaxed</SelectItem></SelectContent></Select></Field></>}
              <div className="md:col-span-2"><Field label="Subtitle"><Input value={section.subtitle} onChange={e=>updateCustomSection(section.id,{subtitle:e.target.value})}/></Field></div>
              <Field label="Section icon"><IconPicker value={section.iconName} onChange={value=>updateCustomSection(section.id,{iconName:value})}/></Field>
              <Field label="Section icon"><MediaAssetPicker value={section.iconUrl} onChange={url=>updateCustomSection(section.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
            </div>
            <div className="flex items-center justify-between"><p className="text-sm font-semibold">Cards</p><Button size="sm" variant="outline" onClick={()=>addCustomCard(section.id)}><Plus className="mr-1 h-4 w-4"/>Add card</Button></div>
            <div className="space-y-3">{section.cards.map((card,cardIndex)=><div key={card.id} className="grid gap-3 rounded-lg border bg-background p-3 md:grid-cols-2">
              <Field label="Title"><Input value={card.title} onChange={e=>updateCustomCard(section.id,card.id,{title:e.target.value})}/></Field>
              <Field label="Badge"><Input value={card.badge} onChange={e=>updateCustomCard(section.id,card.id,{badge:e.target.value})} placeholder="New / Free / Popular"/></Field>
              <Field label="Subtitle"><Input value={card.subtitle} onChange={e=>updateCustomCard(section.id,card.id,{subtitle:e.target.value})}/></Field>
              <Field label="CTA label"><Input value={card.ctaLabel} onChange={e=>updateCustomCard(section.id,card.id,{ctaLabel:e.target.value})}/></Field>
              <Field label="Built-in icon"><IconPicker value={card.iconName} onChange={value=>updateCustomCard(section.id,card.id,{iconName:value})}/></Field>
              <Field label="Custom icon"><MediaAssetPicker value={card.iconUrl} onChange={url=>updateCustomCard(section.id,card.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
              <Field label="Card image"><MediaAssetPicker value={card.imageUrl} onChange={url=>updateCustomCard(section.id,card.id,{imageUrl:url})} preferredType="Home Banner" label="Choose / Upload"/></Field>
              <Field label="Card style"><StyleSelect value={card.style} onChange={value=>updateCustomCard(section.id,card.id,{style:value})}/></Field>
              {section.layout==='grid'&&<Field label="Grid width"><SpanSelect value={card.span} columns={section.columns} onChange={span=>updateCustomCard(section.id,card.id,{span})}/></Field>}
              <div className="md:col-span-2 grid gap-3 md:grid-cols-2"><DestinationEditor
                type={card.destinationType}
                value={card.destinationValue}
                pages={managedPages}
                exams={data?.catalog.exams||[]}
                testSeries={data?.catalog.testSeries||[]}
                onChange={(destinationType,destinationValue)=>updateCustomCard(section.id,card.id,{destinationType,destinationValue})}
              /></div>
              <div className="md:col-span-2 flex items-end justify-end gap-2"><Switch checked={card.isActive} onCheckedChange={isActive=>updateCustomCard(section.id,card.id,{isActive})} aria-label="Show card"/><span className="mr-auto text-xs text-muted-foreground">{card.isActive?'Shown':'Hidden'}</span><Button size="icon" variant="ghost" onClick={()=>moveCustomCard(section.id,card.id,-1)} disabled={cardIndex===0} aria-label="Move card up"><ArrowUp className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>moveCustomCard(section.id,card.id,1)} disabled={cardIndex===section.cards.length-1} aria-label="Move card down"><ArrowDown className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>duplicateCustomCard(section.id,card.id)} aria-label="Duplicate card"><Copy className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>removeCustomCard(section.id,card.id)}><Trash2 className="h-4 w-4"/></Button></div>
            </div>)}</div>
          </div>}
        </div>)}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base">Standard section appearance</CardTitle><p className="text-sm text-muted-foreground">Override labels, icons, visibility and supported native layouts without changing shared exam or learner data.</p></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {Object.entries(SECTION_LABELS).map(([id,label])=>{const setting=config?.sectionSettings[id]||{};return <div key={id} className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center justify-between"><p className="font-semibold">{label}</p><Switch checked={setting.isVisible!==false} onCheckedChange={checked=>setSectionSetting(id,{isVisible:checked})}/></div>
          {id==='hero'
            ?<p className="rounded-lg border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">Hero content is managed in Hero slides. This control only shows or hides the hero module.</p>
            :<>
              <Field label="Display title"><Input value={setting.title||''} onChange={e=>setSectionSetting(id,{title:e.target.value})} placeholder={label}/></Field>
              <Field label="Subtitle"><Input value={setting.subtitle||''} onChange={e=>setSectionSetting(id,{subtitle:e.target.value})}/></Field>
              {id==='exam_categories'&&<div className="grid gap-3 sm:grid-cols-2"><Field label="Layout"><Select value={setting.layout||'grid'} onValueChange={layout=>setSectionSetting(id,{layout})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="grid">Grid</SelectItem><SelectItem value="horizontal">Horizontal</SelectItem></SelectContent></Select></Field>{(setting.layout||'grid')==='grid'&&<Field label="Columns"><Select value={String(setting.columns||4)} onValueChange={value=>setSectionSetting(id,{columns:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="2">2 columns</SelectItem><SelectItem value="3">3 columns</SelectItem><SelectItem value="4">4 columns</SelectItem></SelectContent></Select></Field>}</div>}
              {id==='featured_test_series'&&<div className="grid gap-3 sm:grid-cols-2"><Field label="Layout"><Select value={setting.layout||'horizontal'} onValueChange={layout=>setSectionSetting(id,{layout})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="horizontal">Horizontal rail</SelectItem><SelectItem value="grid">Grid</SelectItem><SelectItem value="list">List</SelectItem></SelectContent></Select></Field>{setting.layout==='grid'&&<Field label="Columns"><Select value={String(setting.columns||2)} onValueChange={value=>setSectionSetting(id,{columns:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="1">1 column</SelectItem><SelectItem value="2">2 columns</SelectItem></SelectContent></Select></Field>}</div>}
              <div className="grid gap-3 sm:grid-cols-2"><Field label="Built-in icon"><IconPicker value={setting.iconName||''} onChange={value=>setSectionSetting(id,{iconName:value})}/></Field><Field label="Custom icon"><MediaAssetPicker value={setting.iconUrl||''} onChange={url=>setSectionSetting(id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field></div>
            </>}
        </div>})}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base">Item icon & display overrides</CardTitle><p className="text-sm text-muted-foreground">Edit how selected exam categories and featured test series appear on Home while preserving their canonical names and data.</p></CardHeader>
      <CardContent className="space-y-3">
        {[...selectedFamilyItems.map(item=>({id:item.id,label:item.name,type:'Exam category'})),...selectedSeriesItems.map(item=>({id:item.id,label:item.name,type:'Test series'}))].map(item=>{const override=config?.itemOverrides[item.id]||{};return <div key={item.id} className="grid gap-3 rounded-xl border p-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-4 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">{item.label}</p><p className="text-xs text-muted-foreground">{item.type}</p></div><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{override.hidden?'Hidden':'Shown'}</span><Switch checked={!override.hidden} onCheckedChange={shown=>setItemOverride(item.id,{hidden:!shown})}/></div></div>
          <Field label="Display title"><Input value={override.title||''} onChange={e=>setItemOverride(item.id,{title:e.target.value})} placeholder="Use canonical title"/></Field>
          <Field label="Subtitle"><Input value={override.subtitle||''} onChange={e=>setItemOverride(item.id,{subtitle:e.target.value})} placeholder="Use canonical subtitle"/></Field>
          <Field label="Badge"><Input value={override.badge||''} onChange={e=>setItemOverride(item.id,{badge:e.target.value})} placeholder="Popular / New / Free"/></Field>
          <Field label="Built-in icon"><IconPicker value={override.iconName||''} onChange={value=>setItemOverride(item.id,{iconName:value})}/></Field>
          <Field label="Custom icon"><MediaAssetPicker value={override.iconUrl||''} onChange={url=>setItemOverride(item.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
          <Field label="Card image"><MediaAssetPicker value={override.imageUrl||''} onChange={url=>setItemOverride(item.id,{imageUrl:url})} preferredType="Home Banner" label="Choose / Upload"/></Field>
        </div>})}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base">Publishing notes</CardTitle><p className="text-sm text-muted-foreground">The visual builder above is the authoritative section order. Recommended Learning, Current Affairs and Today’s Goal remain data-driven; Home Management controls their position, label, icon and visibility.</p></CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">Use “Discard draft” to reload the last published configuration.</span><Button onClick={()=>void save()} disabled={!config||saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Publishing…':'Publish homepage'}</Button></CardContent>
    </Card>
  </div>;
}



function IconPicker({value,onChange}:{value:string;onChange:(value:string)=>void}){
  return <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
    <button type="button" onClick={()=>onChange('')} className={`rounded-lg border px-2 py-2 text-[10px] ${!value?'border-primary bg-primary/5':'hover:bg-muted'}`}>
      <span className="mx-auto mb-1 block h-4 w-4 rounded border border-dashed"/>
      None
    </button>
    {ICON_OPTIONS.map(option=>{const Icon=option.icon;const selected=value===option.value;return <button key={option.value} type="button" title={option.label} onClick={()=>onChange(option.value)} className={`rounded-lg border px-2 py-2 text-[10px] transition ${selected?'border-primary bg-primary/10 text-primary':'hover:bg-muted'}`}><Icon className="mx-auto mb-1 h-4 w-4"/><span className="block truncate">{option.label}</span></button>})}
  </div>;
}

function PhonePreview({config,familyById,seriesById}:{config:Configuration;familyById:Map<string,ExamFamily>;seriesById:Map<string,TestSeries>}){
  const customById=new Map(config.customSections.map(section=>[section.id,section]));
  const visibleSections=config.sectionOrder.filter(id=>id.startsWith('custom_')?customById.get(id)?.isVisible!==false:config.sectionSettings[id]?.isVisible!==false);
  const title=(id:string)=>config.sectionSettings[id]?.title?.trim()||SECTION_LABELS[id]||customById.get(id)?.title||id;
  return <Card className="overflow-hidden">
    <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Smartphone className="h-4 w-4"/>Live phone preview</CardTitle><p className="text-sm text-muted-foreground">Structure preview. The app keeps its final native styling.</p></CardHeader>
    <CardContent>
      <div className="mx-auto w-[300px] overflow-hidden rounded-[34px] border-[7px] border-slate-900 bg-white shadow-xl">
        <div className="mx-auto mt-2 h-4 w-24 rounded-full bg-slate-900"/>
        <div className="max-h-[650px] space-y-3 overflow-y-auto p-3">
          <div className="flex items-center justify-between"><div><p className="text-[10px] text-slate-500">Good day</p><p className="text-sm font-black text-slate-900">Examtree</p></div><div className="h-8 w-8 rounded-full bg-slate-100"/></div>
          {visibleSections.map(id=>{
            if(id==='hero'){
              const slide=config.heroSlides.find(item=>item.isActive);
              return <div key={id} className="relative min-h-28 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-3 text-white">{slide?.imageUrl&&<img src={slide.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35"/>}<div className="relative"><p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">Featured</p><p className="mt-1 text-sm font-black leading-tight">{slide?.title||'Hero banner'}</p><p className="mt-1 line-clamp-2 text-[9px] text-white/80">{slide?.subtitle||'Add a hero slide to preview it here.'}</p></div></div>;
            }
            if(id==='exam_categories'){
              const setting=config.sectionSettings[id]||{};const columns=setting.layout==='horizontal'?0:(setting.columns||4);
              const cards=config.featuredExamFamilyIds.slice(0,8).filter(familyId=>!config.itemOverrides[familyId]?.hidden).map(familyId=>{const family=familyById.get(familyId);const override=config.itemOverrides[familyId];return <div key={familyId} className="min-w-[58px] rounded-lg bg-slate-50 p-1.5 text-center"><div className="mx-auto mb-1 h-5 w-5 rounded-md bg-blue-100"/><p className="line-clamp-2 text-[7px] font-bold">{override?.title||family?.name||'Exam'}</p>{override?.badge&&<span className="mt-1 inline-block rounded bg-blue-50 px-1 text-[6px] text-blue-700">{override.badge}</span>}</div>});
              return <PreviewSection key={id} title={title(id)}><div className={setting.layout==='horizontal'?'flex gap-1 overflow-hidden':'grid gap-1'} style={setting.layout==='horizontal'?undefined:{gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`}}>{cards}</div></PreviewSection>;
            }
            if(id==='featured_test_series'){
              const setting=config.sectionSettings[id]||{};const items=config.featuredTestSeriesIds.filter(seriesId=>!config.itemOverrides[seriesId]?.hidden).slice(0,4).map(seriesId=>{const series=seriesById.get(seriesId);const override=config.itemOverrides[seriesId];return <div key={seriesId} className="min-w-32 rounded-xl bg-blue-950 p-2 text-white"><p className="text-[7px] font-bold text-amber-300">{override?.badge||'TEST SERIES'}</p><p className="mt-1 line-clamp-2 text-[9px] font-black">{override?.title||series?.name||'Test Series'}</p></div>});
              return <PreviewSection key={id} title={title(id)}><div className={setting.layout==='grid'?'grid gap-1':setting.layout==='list'?'space-y-1':'flex gap-2 overflow-hidden'} style={setting.layout==='grid'?{gridTemplateColumns:`repeat(${setting.columns||2},minmax(0,1fr))`}:undefined}>{items}</div></PreviewSection>;
            }
            if(id==='continue_learning')return <PreviewSection key={id} title={title(id)}><div className="rounded-xl border bg-slate-50 p-2"><div className="mb-1 h-2 w-1/2 rounded bg-slate-300"/><div className="h-1.5 rounded bg-blue-100"><div className="h-full w-2/3 rounded bg-blue-600"/></div></div></PreviewSection>;
            if(id==='recommended_learning'||id==='current_affairs'||id==='today_goal')return <PreviewSection key={id} title={title(id)}><div className="rounded-xl border bg-slate-50 p-2"><div className="h-2 w-2/3 rounded bg-slate-300"/><div className="mt-2 h-2 w-1/3 rounded bg-slate-200"/></div></PreviewSection>;
            const section=customById.get(id);
            if(!section)return null;
            const cards=section.cards.filter(card=>card.isActive).slice(0,6);
            return <PreviewSection key={id} title={section.title}><div className={section.layout==='grid'?'grid gap-1':section.layout==='list'?'space-y-1':'flex gap-1 overflow-hidden'} style={section.layout==='grid'?{gridTemplateColumns:`repeat(${Math.max(1,section.columns)},minmax(0,1fr))`}:undefined}>{cards.map(card=><div key={card.id} className="min-w-24 rounded-lg border bg-white p-2" style={section.layout==='grid'?{gridColumn:`span ${Math.min(Math.max(1,card.span),Math.max(1,section.columns))}`}:undefined}><p className="line-clamp-2 text-[8px] font-bold">{card.title}</p>{card.badge&&<span className="mt-1 inline-block rounded bg-blue-50 px-1 text-[6px] text-blue-700">{card.badge}</span>}</div>)}</div></PreviewSection>;
          })}
        </div>
      </div>
    </CardContent>
  </Card>;
}

function PreviewSection({title,children}:{title:string;children:React.ReactNode}){return <div><p className="mb-1.5 text-[10px] font-black text-slate-800">{title}</p>{children}</div>}

function isHttpUrl(value:string){try{const url=new URL(value);return url.protocol==='https:'||url.protocol==='http:';}catch{return false;}}
function DestinationEditor({type,value,pages,exams,testSeries,onChange}:{type:string;value:string;pages:ManagedPage[];exams:Exam[];testSeries:TestSeries[];onChange:(type:string,value:string)=>void}){
  return <><Field label="Destination"><Select value={type||'none'} onValueChange={next=>onChange(next,next==='none'?'':value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No action</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="learn">Learn</SelectItem><SelectItem value="page">Managed page</SelectItem><SelectItem value="url">External URL</SelectItem></SelectContent></Select></Field><Field label="Open">{type==='page'?<Select value={value} onValueChange={next=>onChange(type,next)}><SelectTrigger><SelectValue placeholder="Choose page"/></SelectTrigger><SelectContent>{pages.map(page=><SelectItem key={page.id} value={page.slug}>{page.title} · /{page.slug}</SelectItem>)}</SelectContent></Select>:type==='exam'?<CatalogSelect items={exams} value={value} onChange={next=>onChange(type,next)}/>:type==='test_series'?<CatalogSelect items={testSeries} value={value} onChange={next=>onChange(type,next)}/>:type==='learn'?<Input value={value} onChange={e=>onChange(type,e.target.value)} placeholder="/learn"/>:type==='url'?<Input value={value} onChange={e=>onChange(type,e.target.value)} placeholder="https://…"/>:<Input value="" disabled placeholder="No destination"/>}</Field></>;
}
function CatalogSelect({items,value,onChange}:{items:Array<{id:string;name:string;examName?:string;familyName?:string}>;value:string;onChange:(value:string)=>void}){return <Select value={value} onValueChange={onChange}><SelectTrigger><SelectValue placeholder="Choose item"/></SelectTrigger><SelectContent>{items.map(item=><SelectItem key={item.id} value={item.id}>{item.name}{item.examName?` · ${item.examName}`:item.familyName?` · ${item.familyName}`:''}</SelectItem>)}</SelectContent></Select>;}
function StyleSelect({value,onChange}:{value:string;onChange:(value:string)=>void}){return <Select value={value||'default'} onValueChange={onChange}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="default">Default</SelectItem><SelectItem value="compact">Compact</SelectItem><SelectItem value="image">Image-led</SelectItem><SelectItem value="minimal">Minimal</SelectItem><SelectItem value="featured">Featured</SelectItem></SelectContent></Select>;}
function SpanSelect({value,columns,onChange}:{value:number;columns:number;onChange:(value:number)=>void}){const max=Math.max(1,Math.min(4,columns||1));return <Select value={String(Math.min(Math.max(1,value||1),max))} onValueChange={next=>onChange(Number(next))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Array.from({length:max},(_,index)=>index+1).map(span=><SelectItem key={span} value={String(span)}>{span===max?'Full row':`${span} column${span===1?'':'s'}`}</SelectItem>)}</SelectContent></Select>;}

function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>}
export default MobileHomeManagementPage;
