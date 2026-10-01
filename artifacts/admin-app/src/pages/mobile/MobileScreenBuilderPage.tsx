import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Layers3, Plus, Save, Smartphone, Trash2 } from 'lucide-react';

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

type CatalogItem={id:string;code:string;name:string;description?:string|null;examName?:string;familyName?:string};
type Catalog={examFamilies:CatalogItem[];testSeries:CatalogItem[];exams:CatalogItem[]};
type Hero={enabled:boolean;title:string;subtitle:string;badge:string;imageUrl:string;iconUrl:string;ctaLabel:string;destinationType:string;destinationValue:string;style:string};
type Block={id:string;title:string;subtitle:string;badge:string;iconName:string;iconUrl:string;imageUrl:string;ctaLabel:string;destinationType:string;destinationValue:string;span:number;style:string;isActive:boolean;sortOrder:number};
type Section={id:string;title:string;subtitle:string;iconName:string;iconUrl:string;layout:string;columns:number;gap:string;style:string;dataSource:string;dataLimit:number;sourceParentSlug:string;isVisible:boolean;sortOrder:number;cards:Block[]};
type Configuration={parentSlug:string;entityType:string;entityId:string;hero:Hero;sections:Section[]};
type MobilePage={id:string;slug:string;title:string;description:string;nativeRoute:string|null;renderMode:'native'|'managed';iconName:string;isActive:boolean;showAppBar:boolean;configuration:Configuration;sortOrder:number;updatedAt?:string|null};

async function call<T>(path:string,init?:RequestInit):Promise<T>{
  const user=getFirebaseAuth()?.currentUser;
  if(!user)throw new Error('Your administrator session has expired.');
  const response=await fetch(\`\${apiBase}\${path}\`,{...init,headers:{'Content-Type':'application/json',Authorization:\`Bearer \${await user.getIdToken()}\`,...init?.headers}});
  const body=await response.json().catch(()=>null) as (T&{error?:string})|null;
  if(!response.ok)throw new Error(body?.error||\`Request failed (\${response.status}).\`);
  return body as T;
}
const move=<T,>(items:T[],index:number,direction:-1|1)=>{const target=index+direction;if(target<0||target>=items.length)return items;const next=[...items];[next[index],next[target]]=[next[target]!,next[index]!];return next;};
const heroBlank=():Hero=>({enabled:false,title:'',subtitle:'',badge:'',imageUrl:'',iconUrl:'',ctaLabel:'Explore',destinationType:'none',destinationValue:'',style:'featured'});
const newSection=(layout='grid'):Section=>({id:crypto.randomUUID(),title:'New section',subtitle:'',iconName:'',iconUrl:'',layout,columns:2,gap:'normal',style:'default',dataSource:'manual',dataLimit:24,sourceParentSlug:'',isVisible:true,sortOrder:1,cards:[]});
const newBlock=():Block=>({id:crypto.randomUUID(),title:'New card',subtitle:'',badge:'',iconName:'',iconUrl:'',imageUrl:'',ctaLabel:'Open',destinationType:'none',destinationValue:'',span:1,style:'default',isActive:true,sortOrder:1});

export function MobileScreenBuilderPage(){
  const[pages,setPages]=useState<MobilePage[]>([]);
  const[catalog,setCatalog]=useState<Catalog>({examFamilies:[],testSeries:[],exams:[]});
  const[selectedId,setSelectedId]=useState('');
  const[draft,setDraft]=useState<MobilePage|null>(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[newTitle,setNewTitle]=useState('');
  const[newSlug,setNewSlug]=useState('');
  const[newParent,setNewParent]=useState('');

  const refresh=async()=>{
    setLoading(true);
    try{
      const result=await call<{pages:MobilePage[];catalog:Catalog}>('/admin/mobile/pages');
      setPages(result.pages);setCatalog(result.catalog);
      const next=result.pages.find(page=>page.id===selectedId)||result.pages[0]||null;
      setSelectedId(next?.id||'');setDraft(next?structuredClone(next):null);
    }catch(error){showToast.error('Unable to load Screen Builder',error instanceof Error?error.message:'Request failed.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{void refresh();},[]);
  useEffect(()=>{const selected=pages.find(page=>page.id===selectedId);if(selected)setDraft(structuredClone(selected));},[selectedId]);

  const orderedPages=useMemo(()=>{
    const children=new Map<string,MobilePage[]>();
    for(const page of pages){const parent=page.configuration?.parentSlug||'';children.set(parent,[...(children.get(parent)||[]),page]);}
    const result:Array<{page:MobilePage;depth:number}>=[];
    const visit=(parent:string,depth:number)=>{for(const page of (children.get(parent)||[]).sort((a,b)=>a.sortOrder-b.sortOrder||a.title.localeCompare(b.title))){result.push({page,depth});visit(page.slug,depth+1);}};
    visit('',0);
    for(const page of pages)if(!result.some(item=>item.page.id===page.id))result.push({page,depth:0});
    return result;
  },[pages]);

  const patch=(value:Partial<MobilePage>)=>setDraft(previous=>previous?({...previous,...value}):previous);
  const patchConfig=(value:Partial<Configuration>)=>setDraft(previous=>previous?({...previous,configuration:{...previous.configuration,...value}}):previous);
  const setSections=(sections:Section[])=>patchConfig({sections:sections.map((section,index)=>({...section,sortOrder:index+1}))});
  const updateSection=(id:string,value:Partial<Section>)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===id?{...section,...value}:section));
  const addSection=(layout:string)=>draft&&setSections([...draft.configuration.sections,{...newSection(layout),sortOrder:draft.configuration.sections.length+1}]);
  const removeSection=(id:string)=>draft&&setSections(draft.configuration.sections.filter(section=>section.id!==id));
  const duplicateSection=(id:string)=>draft&&setSections(draft.configuration.sections.flatMap(section=>section.id===id?[section,{...section,id:crypto.randomUUID(),title:\`\${section.title} copy\`,cards:section.cards.map(card=>({...card,id:crypto.randomUUID()}))}]:[section]));
  const updateCard=(sectionId:string,cardId:string,value:Partial<Block>)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===sectionId?{...section,cards:section.cards.map(card=>card.id===cardId?{...card,...value}:card)}:section));
  const addCard=(sectionId:string)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===sectionId?{...section,cards:[...section.cards,{...newBlock(),sortOrder:section.cards.length+1}]}:section));
  const removeCard=(sectionId:string,cardId:string)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===sectionId?{...section,cards:section.cards.filter(card=>card.id!==cardId).map((card,index)=>({...card,sortOrder:index+1}))}:section));

  const createPage=async()=>{
    if(!newTitle.trim()||!newSlug.trim())return;
    try{
      const result=await call<{page:MobilePage}>('/admin/mobile/pages',{method:'POST',body:JSON.stringify({title:newTitle,slug:newSlug,parentSlug:newParent})});
      setPages(previous=>[...previous,result.page]);setSelectedId(result.page.id);setDraft(structuredClone(result.page));setNewTitle('');setNewSlug('');setNewParent('');
      showToast.success('Page created','Now compose its hero, sections, hierarchy and destinations.');
    }catch(error){showToast.error('Unable to create page',error instanceof Error?error.message:'Request failed.');}
  };
  const save=async()=>{if(!draft)return;setSaving(true);try{const result=await call<{page:MobilePage}>(\`/admin/mobile/pages/\${draft.id}\`,{method:'PUT',body:JSON.stringify(draft)});setPages(previous=>previous.map(page=>page.id===result.page.id?result.page:page));setDraft(structuredClone(result.page));showToast.success('Page published','The app can now render this page configuration.');}catch(error){showToast.error('Unable to publish page',error instanceof Error?error.message:'Request failed.');}finally{setSaving(false);}};
  const deletePage=async()=>{if(!draft||draft.nativeRoute)return;try{await call<void>(\`/admin/mobile/pages/\${draft.id}\`,{method:'DELETE'});setPages(previous=>previous.filter(page=>page.id!==draft.id));setSelectedId('');setDraft(null);showToast.success('Page deleted','The managed page was removed.');}catch(error){showToast.error('Unable to delete page',error instanceof Error?error.message:'Request failed.');}};

  return <div className="space-y-5">
    <PageHeader title="Mobile App · Layout Composer" description="Edit the app page-by-page: hierarchy, hero, sections, data source, grid columns, card spans, appearance and destinations." icon={<Smartphone className="h-5 w-5"/>} actions={<Button onClick={()=>void save()} disabled={!draft||saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Publishing…':'Publish page'}</Button>}/>
    <div className="grid gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_340px]">
      <Card className="h-fit"><CardHeader><CardTitle className="text-base">Page tree</CardTitle></CardHeader><CardContent className="space-y-3">
        <div className="space-y-1">{orderedPages.map(({page,depth})=><button key={page.id} type="button" onClick={()=>setSelectedId(page.id)} style={{paddingLeft:12+depth*18}} className={\`w-full rounded-lg border py-2 pr-3 text-left transition \${page.id===draft?.id?'border-primary bg-primary/5':'hover:bg-muted'}\`}><div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{page.title}</span><span className="text-[9px] uppercase text-muted-foreground">{page.renderMode}</span></div><p className="truncate text-xs text-muted-foreground">/{page.slug}</p></button>)}</div>
        <div className="space-y-2 border-t pt-3"><p className="text-sm font-semibold">Add page</p><Input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Page name"/><Input value={newSlug} onChange={e=>setNewSlug(e.target.value)} placeholder="slug"/><Select value={newParent||'root'} onValueChange={value=>setNewParent(value==='root'?'':value)}><SelectTrigger><SelectValue placeholder="Parent page"/></SelectTrigger><SelectContent><SelectItem value="root">Top level</SelectItem>{pages.map(page=><SelectItem key={page.id} value={page.slug}>{page.title}</SelectItem>)}</SelectContent></Select><Button className="w-full" variant="outline" onClick={()=>void createPage()}><Plus className="mr-1.5 h-4 w-4"/>Create page</Button></div>
      </CardContent></Card>

      {loading?<Card><CardContent className="p-8 text-sm text-muted-foreground">Loading composer…</CardContent></Card>:!draft?<Card><CardContent className="p-8 text-sm text-muted-foreground">Select or create a page.</CardContent></Card>:<div className="space-y-4">
        <Card><CardHeader><CardTitle className="text-base">Page settings & hierarchy</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Page title"><Input value={draft.title} onChange={e=>patch({title:e.target.value})}/></Field><Field label="Slug"><Input value={draft.slug} disabled/></Field>
          <div className="md:col-span-2"><Field label="Description"><Textarea rows={2} value={draft.description} onChange={e=>patch({description:e.target.value})}/></Field></div>
          <Field label="Parent page"><Select value={draft.configuration.parentSlug||'root'} onValueChange={value=>patchConfig({parentSlug:value==='root'?'':value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="root">Top level</SelectItem>{pages.filter(page=>page.id!==draft.id).map(page=><SelectItem key={page.id} value={page.slug}>{page.title}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Rendering"><Select value={draft.renderMode} onValueChange={value=>patch({renderMode:value as 'native'|'managed'})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="native" disabled={!draft.nativeRoute}>Native functional screen</SelectItem><SelectItem value="managed">Layout Composer</SelectItem></SelectContent></Select></Field>
          <Field label="Bind page to canonical content"><Select value={draft.configuration.entityType||'none'} onValueChange={value=>patchConfig({entityType:value,entityId:''})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No binding</SelectItem><SelectItem value="exam_family">Exam category</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem></SelectContent></Select></Field>
          <Field label="Canonical item">{draft.configuration.entityType==='exam_family'?<CatalogSelect items={catalog.examFamilies} value={draft.configuration.entityId} onChange={value=>patchConfig({entityId:value})}/>:draft.configuration.entityType==='exam'?<CatalogSelect items={catalog.exams} value={draft.configuration.entityId} onChange={value=>patchConfig({entityId:value})}/>:draft.configuration.entityType==='test_series'?<CatalogSelect items={catalog.testSeries} value={draft.configuration.entityId} onChange={value=>patchConfig({entityId:value})}/>:<Input disabled value=""/>}</Field>
          <div className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-semibold">Active</p><p className="text-xs text-muted-foreground">Available in app</p></div><Switch checked={draft.isActive} onCheckedChange={checked=>patch({isActive:checked})}/></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-semibold">App bar</p><p className="text-xs text-muted-foreground">Show title bar</p></div><Switch checked={draft.showAppBar} onCheckedChange={checked=>patch({showAppBar:checked})}/></div>
        </CardContent></Card>

        <Card><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Hero</CardTitle><p className="mt-1 text-sm text-muted-foreground">Optional top area for this page.</p></div><Switch checked={draft.configuration.hero?.enabled??false} onCheckedChange={checked=>patchConfig({hero:{...(draft.configuration.hero||heroBlank()),enabled:checked}})}/></CardHeader>{draft.configuration.hero?.enabled&&<CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Hero title"><Input value={draft.configuration.hero.title} onChange={e=>patchConfig({hero:{...draft.configuration.hero,title:e.target.value}})}/></Field><Field label="Badge"><Input value={draft.configuration.hero.badge} onChange={e=>patchConfig({hero:{...draft.configuration.hero,badge:e.target.value}})}/></Field>
          <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={draft.configuration.hero.subtitle} onChange={e=>patchConfig({hero:{...draft.configuration.hero,subtitle:e.target.value}})}/></Field></div>
          <Field label="Hero image"><MediaAssetPicker value={draft.configuration.hero.imageUrl} onChange={url=>patchConfig({hero:{...draft.configuration.hero,imageUrl:url}})} preferredType="Home Banner" label="Choose / Upload"/></Field>
          <Field label="Style"><StyleSelect value={draft.configuration.hero.style} onChange={value=>patchConfig({hero:{...draft.configuration.hero,style:value}})}/></Field>
          <Field label="CTA text"><Input value={draft.configuration.hero.ctaLabel} onChange={e=>patchConfig({hero:{...draft.configuration.hero,ctaLabel:e.target.value}})}/></Field>
          <DestinationEditor type={draft.configuration.hero.destinationType} value={draft.configuration.hero.destinationValue} pages={pages} catalog={catalog} onChange={(destinationType,destinationValue)=>patchConfig({hero:{...draft.configuration.hero,destinationType,destinationValue}})}/>
        </CardContent>}</Card>

        <Card><CardHeader className="flex-row items-center justify-between gap-3 space-y-0"><div><CardTitle className="flex items-center gap-2 text-base"><Layers3 className="h-4 w-4"/>Sections</CardTitle><p className="mt-1 text-sm text-muted-foreground">Build manual content or bind a section to canonical app data.</p></div><Select onValueChange={addSection}><SelectTrigger className="w-[170px]"><Plus className="mr-2 h-4 w-4"/><SelectValue placeholder="Add section"/></SelectTrigger><SelectContent><SelectItem value="grid">Grid</SelectItem><SelectItem value="horizontal">Horizontal</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="banner">Banner</SelectItem></SelectContent></Select></CardHeader>
        <CardContent className="space-y-3">
          {draft.configuration.sections.length===0&&<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Add a section to start composing this page.</div>}
          {draft.configuration.sections.map((section,index)=><div key={section.id} className="rounded-xl border">
            <div className="flex flex-wrap items-center gap-2 p-3"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{section.title}</p><p className="text-xs text-muted-foreground">{section.layout} · {section.dataSource==='manual'?section.cards.length+' cards':section.dataSource}</p></div><Switch checked={section.isVisible} onCheckedChange={checked=>updateSection(section.id,{isVisible:checked})}/><Button size="icon" variant="ghost" onClick={()=>setSections(move(draft.configuration.sections,index,-1))} disabled={index===0}><ArrowUp className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>setSections(move(draft.configuration.sections,index,1))} disabled={index===draft.configuration.sections.length-1}><ArrowDown className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>duplicateSection(section.id)}><Copy className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>removeSection(section.id)}><Trash2 className="h-4 w-4"/></Button></div>
            <div className="grid gap-3 border-t bg-muted/20 p-3 md:grid-cols-2">
              <Field label="Section title"><Input value={section.title} onChange={e=>updateSection(section.id,{title:e.target.value})}/></Field><Field label="Subtitle"><Input value={section.subtitle} onChange={e=>updateSection(section.id,{subtitle:e.target.value})}/></Field>
              <Field label="Layout"><Select value={section.layout} onValueChange={value=>updateSection(section.id,{layout:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="grid">Grid</SelectItem><SelectItem value="horizontal">Horizontal</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="banner">Banner</SelectItem></SelectContent></Select></Field>
              <Field label="Card style"><StyleSelect value={section.style} onChange={value=>updateSection(section.id,{style:value})}/></Field>
              {section.layout==='grid'&&<><Field label="Grid columns"><Select value={String(section.columns)} onValueChange={value=>updateSection(section.id,{columns:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="1">1 column</SelectItem><SelectItem value="2">2 columns</SelectItem><SelectItem value="3">3 columns</SelectItem><SelectItem value="4">4 columns</SelectItem></SelectContent></Select></Field><Field label="Spacing"><Select value={section.gap} onValueChange={value=>updateSection(section.id,{gap:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="compact">Compact</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="relaxed">Relaxed</SelectItem></SelectContent></Select></Field></>}
              <Field label="Content source"><Select value={section.dataSource} onValueChange={value=>updateSection(section.id,{dataSource:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="manual">Manual cards</SelectItem><SelectItem value="exam_families">Exam Categories</SelectItem><SelectItem value="test_series">Test Series</SelectItem><SelectItem value="managed_pages">Child pages</SelectItem></SelectContent></Select></Field>
              {section.dataSource!=='manual'&&<Field label="Maximum items"><Input type="number" min="1" max="100" value={section.dataLimit} onChange={e=>updateSection(section.id,{dataLimit:Number(e.target.value)})}/></Field>}
              {section.dataSource==='managed_pages'&&<Field label="Parent page source"><Select value={section.sourceParentSlug||draft.slug} onValueChange={value=>updateSection(section.id,{sourceParentSlug:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{pages.map(page=><SelectItem key={page.id} value={page.slug}>{page.title}</SelectItem>)}</SelectContent></Select></Field>}
              {section.dataSource==='manual'&&<div className="md:col-span-2 space-y-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Cards</p><Button size="sm" variant="outline" onClick={()=>addCard(section.id)}><Plus className="mr-1 h-4 w-4"/>Add card</Button></div>
                {section.cards.map(card=><div key={card.id} className="grid gap-3 rounded-lg border bg-background p-3 md:grid-cols-2">
                  <Field label="Title"><Input value={card.title} onChange={e=>updateCard(section.id,card.id,{title:e.target.value})}/></Field><Field label="Badge"><Input value={card.badge} onChange={e=>updateCard(section.id,card.id,{badge:e.target.value})}/></Field>
                  <Field label="Subtitle"><Input value={card.subtitle} onChange={e=>updateCard(section.id,card.id,{subtitle:e.target.value})}/></Field><Field label="CTA"><Input value={card.ctaLabel} onChange={e=>updateCard(section.id,card.id,{ctaLabel:e.target.value})}/></Field>
                  <Field label="Image"><MediaAssetPicker value={card.imageUrl} onChange={url=>updateCard(section.id,card.id,{imageUrl:url})} preferredType="Home Banner" label="Choose / Upload"/></Field><Field label="Icon"><MediaAssetPicker value={card.iconUrl} onChange={url=>updateCard(section.id,card.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
                  <Field label="Card width"><Select value={String(card.span)} onValueChange={value=>updateCard(section.id,card.id,{span:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{[1,2,3,4].map(value=><SelectItem key={value} value={String(value)}>{value} column{value>1?'s':''}</SelectItem>)}</SelectContent></Select></Field><Field label="Style override"><StyleSelect value={card.style} onChange={value=>updateCard(section.id,card.id,{style:value})}/></Field>
                  <DestinationEditor type={card.destinationType} value={card.destinationValue} pages={pages} catalog={catalog} onChange={(destinationType,destinationValue)=>updateCard(section.id,card.id,{destinationType,destinationValue})}/>
                  <div className="flex items-end justify-end"><Button size="sm" variant="ghost" onClick={()=>removeCard(section.id,card.id)}><Trash2 className="mr-1 h-4 w-4"/>Remove card</Button></div>
                </div>)}
              </div>}
            </div>
          </div>)}
        </CardContent></Card>
        {!draft.nativeRoute&&<div className="flex justify-end"><Button variant="destructive" onClick={()=>void deletePage()}><Trash2 className="mr-1.5 h-4 w-4"/>Delete page</Button></div>}
      </div>}

      <Card className="h-fit 2xl:sticky 2xl:top-4"><CardHeader><CardTitle className="text-base">Phone preview</CardTitle></CardHeader><CardContent>{draft?<PhonePreview page={draft}/>:<p className="text-sm text-muted-foreground">Select a page.</p>}</CardContent></Card>
    </div>
  </div>;
}

function DestinationEditor({type,value,pages,catalog,onChange}:{type:string;value:string;pages:MobilePage[];catalog:Catalog;onChange:(type:string,value:string)=>void}){
  return <><Field label="Action"><Select value={type||'none'} onValueChange={next=>onChange(next,next==='none'?'':value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No action</SelectItem><SelectItem value="page">Managed page</SelectItem><SelectItem value="exam_family">Exam category</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="native">Native app route</SelectItem><SelectItem value="url">External URL</SelectItem></SelectContent></Select></Field><Field label="Destination">{type==='page'?<Select value={value} onValueChange={next=>onChange(type,next)}><SelectTrigger><SelectValue placeholder="Choose page"/></SelectTrigger><SelectContent>{pages.filter(page=>page.isActive).map(page=><SelectItem key={page.id} value={page.slug}>{page.title}</SelectItem>)}</SelectContent></Select>:type==='exam_family'?<CatalogSelect items={catalog.examFamilies} value={value} onChange={next=>onChange(type,next)}/>:type==='exam'?<CatalogSelect items={catalog.exams} value={value} onChange={next=>onChange(type,next)}/>:type==='test_series'?<CatalogSelect items={catalog.testSeries} value={value} onChange={next=>onChange(type,next)}/>:<Input value={value} onChange={e=>onChange(type,e.target.value)} placeholder={type==='native'?'/learn':'https://…'}/>}</Field></>;
}
function CatalogSelect({items,value,onChange}:{items:CatalogItem[];value:string;onChange:(value:string)=>void}){return <Select value={value} onValueChange={onChange}><SelectTrigger><SelectValue placeholder="Choose item"/></SelectTrigger><SelectContent>{items.map(item=><SelectItem key={item.id} value={item.id}>{item.name}{item.examName?\` · \${item.examName}\`:item.familyName?\` · \${item.familyName}\`:''}</SelectItem>)}</SelectContent></Select>;}
function StyleSelect({value,onChange}:{value:string;onChange:(value:string)=>void}){return <Select value={value||'default'} onValueChange={onChange}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="default">Default</SelectItem><SelectItem value="compact">Compact</SelectItem><SelectItem value="image">Image-led</SelectItem><SelectItem value="minimal">Minimal</SelectItem><SelectItem value="featured">Featured</SelectItem></SelectContent></Select>;}
function PhonePreview({page}:{page:MobilePage}){const hero=page.configuration.hero;return <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[28px] border-[6px] border-slate-900 bg-slate-50 shadow-xl"><div className="bg-white px-4 py-3 text-sm font-bold text-slate-800">{page.showAppBar?page.title:'Examtree'}</div><div className="max-h-[620px] space-y-3 overflow-y-auto p-3">{hero?.enabled&&<div className="rounded-2xl bg-slate-900 p-4 text-white">{hero.badge&&<p className="text-[10px] font-bold uppercase text-amber-300">{hero.badge}</p>}<p className="mt-1 font-black">{hero.title||page.title}</p>{hero.subtitle&&<p className="mt-1 text-xs text-white/75">{hero.subtitle}</p>}{hero.imageUrl&&<img src={hero.imageUrl} className="mt-3 h-24 w-full rounded-xl object-cover"/>}</div>}{page.configuration.sections.filter(section=>section.isVisible).map(section=><div key={section.id}><p className="text-sm font-black text-slate-800">{section.title}</p>{section.subtitle&&<p className="mb-2 text-[10px] text-slate-500">{section.subtitle}</p>}<div className={section.layout==='grid'?'grid gap-2':'space-y-2'} style={section.layout==='grid'?{gridTemplateColumns:\`repeat(\${Math.max(1,section.columns)},minmax(0,1fr))\`}:undefined}>{(section.dataSource==='manual'?section.cards:Array.from({length:Math.min(section.dataLimit,6)},(_,i)=>({...newBlock(),id:String(i),title:section.dataSource==='exam_families'?\`Category \${i+1}\`:section.dataSource==='test_series'?\`Test Series \${i+1}\`:\`Child Page \${i+1}\`}))).filter(card=>card.isActive).map(card=><div key={card.id} className="rounded-xl border bg-white p-2" style={section.layout==='grid'?{gridColumn:\`span \${Math.min(card.span||1,Math.max(1,section.columns))}\`}:undefined}>{card.imageUrl&&<img src={card.imageUrl} className="mb-2 h-14 w-full rounded-lg object-cover"/>}<p className="text-[11px] font-bold text-slate-800">{card.title}</p>{card.subtitle&&<p className="mt-0.5 text-[9px] text-slate-500">{card.subtitle}</p>}</div>)}</div></div>)}</div></div>;}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;}
export default MobileScreenBuilderPage;
