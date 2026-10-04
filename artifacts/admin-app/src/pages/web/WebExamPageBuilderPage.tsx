import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, LayoutTemplate, Plus, Save, Trash2 } from 'lucide-react';

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

type SectionType='hero'|'test_catalog'|'exam_information'|'syllabus'|'preparation'|'topic_practice'|'custom';
type Layout='tabs'|'list'|'grid'|'horizontal'|'cards';
type CardStyle='default'|'compact'|'bordered'|'minimal'|'featured';
type TabStyle='pills'|'underline'|'segmented';

type CustomCard={
  id:string;
  title:string;
  text:string;
  badge:string;
  ctaLabel:string;
  href:string;
  isVisible:boolean;
  sortOrder:number;
};

type Section={
  id:string;
  type:SectionType;
  isVisible:boolean;
  sortOrder:number;
  eyebrow:string;
  title:string;
  description:string;
  body:string;
  layout:Layout;
  columns:number;
  cardStyle:CardStyle;
  tabStyle:TabStyle;
  showCounts:boolean;
  ctaLabel:string;
  ctaHref:string;
  cards:CustomCard[];
};

type Configuration={
  pageEyebrow:string;
  pageTitle:string;
  pageDescription:string;
  sections:Section[];
};

type PageRecord={
  id?:string;
  examSlug:string;
  title:string;
  isActive:boolean;
  configuration:Configuration;
  updatedAt?:string|null;
};

type CatalogExam={id:string;code:string;name:string;familyName:string};

const SECTION_LABELS:Record<SectionType,string>={
  hero:'Hero / exam summary',
  test_catalog:'Test catalogue',
  exam_information:'Exam information',
  syllabus:'Syllabus & pattern',
  preparation:'Preparation',
  topic_practice:'Topic practice',
  custom:'Custom content',
};

const KNOWN_PAGES=[
  ['ssc-cgl','SSC CGL'],
  ['ssc-chsl','SSC CHSL'],
  ['ssc-mts','SSC MTS'],
  ['ssc-cpo','SSC CPO'],
  ['ssc-stenographer','SSC Stenographer'],
  ['ssc-gd','SSC GD'],
  ['ibps-po','IBPS PO'],
  ['ibps-clerk','IBPS Clerk / CSA'],
  ['ibps-rrb-po','IBPS RRB PO'],
  ['ibps-rrb-office-assistant','IBPS RRB Office Assistant'],
] as const;

async function call<T>(path:string,init?:RequestInit):Promise<T>{
  const user=getFirebaseAuth()?.currentUser;
  if(!user)throw new Error('Your administrator session has expired.');
  const response=await fetch(${apiBase}${path},{...init,headers:{'Content-Type':'application/json',Authorization:`Bearer ${await user.getIdToken()}`,...init?.headers}});
  const body=await response.json().catch(()=>null) as (T&{error?:string})|null;
  if(!response.ok)throw new Error(body?.error||`Request failed (${response.status}).`);
  return body as T;
}

const move=<T,>(items:T[],index:number,direction:-1|1)=>{
  const target=index+direction;
  if(target<0||target>=items.length)return items;
  const next=[...items];
  [next[index],next[target]]=[next[target]!,next[index]!];
  return next;
};

const newCard=():CustomCard=>({
  id:crypto.randomUUID(),title:'New card',text:'',badge:'',ctaLabel:'Open',href:'',isVisible:true,sortOrder:1,
});

const newSection=(type:SectionType):Section=>({
  id:crypto.randomUUID(),
  type,
  isVisible:true,
  sortOrder:1,
  eyebrow:'',
  title:'',
  description:'',
  body:'',
  layout:type==='test_catalog'?'tabs':'grid',
  columns:type==='syllabus'?2:3,
  cardStyle:'default',
  tabStyle:'pills',
  showCounts:true,
  ctaLabel:'',
  ctaHref:'',
  cards:[],
});

export function WebExamPageBuilderPage(){
  const[pages,setPages]=useState<PageRecord[]>([]);
  const[defaultConfiguration,setDefaultConfiguration]=useState<Configuration|null>(null);
  const[catalog,setCatalog]=useState<CatalogExam[]>([]);
  const[selectedSlug,setSelectedSlug]=useState('');
  const[draft,setDraft]=useState<PageRecord|null>(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[newSlug,setNewSlug]=useState('ibps-po');
  const[newTitle,setNewTitle]=useState('IBPS PO');

  const load=async(preferredSlug?:string)=>{
    setLoading(true);
    try{
      const result=await call<{pages:PageRecord[];exams:CatalogExam[];defaultConfiguration:Configuration}>('/admin/web/exam-pages');
      setPages(result.pages);
      setCatalog(result.exams);
      setDefaultConfiguration(result.defaultConfiguration);
      const slug=preferredSlug||selectedSlug||result.pages[0]?.examSlug||'';
      const selected=result.pages.find(page=>page.examSlug===slug)||null;
      setSelectedSlug(selected?.examSlug||'');
      setDraft(selected?structuredClone(selected):null);
    }catch(error){
      showToast.error('Unable to load web page builder',error instanceof Error?error.message:'Request failed.');
    }finally{setLoading(false);}
  };

  useEffect(()=>{void load();},[]);
  useEffect(()=>{
    const selected=pages.find(page=>page.examSlug===selectedSlug);
    if(selected)setDraft(structuredClone(selected));
  },[selectedSlug,pages]);

  const orderedSections=useMemo(
    ()=>[...(draft?.configuration.sections||[])].sort((a,b)=>a.sortOrder-b.sortOrder),
    [draft?.configuration.sections],
  );

  const patchPage=(value:Partial<PageRecord>)=>setDraft(previous=>previous?({...previous,...value}):previous);
  const patchConfiguration=(value:Partial<Configuration>)=>setDraft(previous=>previous?({...previous,configuration:{...previous.configuration,...value}}):previous);
  const setSections=(sections:Section[])=>patchConfiguration({sections:sections.map((section,index)=>({...section,sortOrder:index+1}))});
  const updateSection=(id:string,value:Partial<Section>)=>setSections(orderedSections.map(section=>section.id===id?{...section,...value}:section));
  const removeSection=(id:string)=>setSections(orderedSections.filter(section=>section.id!==id));
  const duplicateSection=(id:string)=>setSections(orderedSections.flatMap(section=>section.id===id?[section,{...structuredClone(section),id:crypto.randomUUID(),title:section.title?`${section.title} copy`:'',cards:section.cards.map(card=>({...card,id:crypto.randomUUID()}))}]:[section]));
  const updateCard=(sectionId:string,cardId:string,value:Partial<CustomCard>)=>setSections(orderedSections.map(section=>section.id===sectionId?{...section,cards:section.cards.map(card=>card.id===cardId?{...card,...value}:card)}:section));
  const addCard=(sectionId:string)=>setSections(orderedSections.map(section=>section.id===sectionId?{...section,cards:[...section.cards,{...newCard(),sortOrder:section.cards.length+1}]}:section));
  const removeCard=(sectionId:string,cardId:string)=>setSections(orderedSections.map(section=>section.id===sectionId?{...section,cards:section.cards.filter(card=>card.id!==cardId).map((card,index)=>({...card,sortOrder:index+1}))}:section));

  const createPage=()=>{
    const slug=newSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'');
    if(!slug||!defaultConfiguration)return;
    const existing=pages.find(page=>page.examSlug===slug);
    if(existing){setSelectedSlug(slug);setDraft(structuredClone(existing));return;}
    const page:PageRecord={examSlug:slug,title:newTitle.trim()||slug,isActive:true,configuration:structuredClone(defaultConfiguration)};
    setDraft(page);setSelectedSlug(slug);
  };

  const save=async()=>{
    if(!draft)return;
    setSaving(true);
    try{
      const result=await call<{page:PageRecord}>(`/admin/web/exam-pages/${encodeURIComponent(draft.examSlug)}`,{method:'PUT',body:JSON.stringify(draft)});
      setPages(previous=>[...previous.filter(page=>page.examSlug!==result.page.examSlug),result.page].sort((a,b)=>a.examSlug.localeCompare(b.examSlug)));
      setDraft(structuredClone(result.page));setSelectedSlug(result.page.examSlug);
      showToast.success('Exam page published','Learner web pages will use this structure and copy.');
    }catch(error){
      showToast.error('Unable to publish exam page',error instanceof Error?error.message:'Request failed.');
    }finally{setSaving(false);}
  };

  const deleteConfiguration=async()=>{
    if(!draft?.id)return;
    try{
      await call<void>(`/admin/web/exam-pages/${encodeURIComponent(draft.examSlug)}`,{method:'DELETE'});
      showToast.success('Custom layout removed','The exam page will fall back to the default structure.');
      await load();
    }catch(error){
      showToast.error('Unable to remove configuration',error instanceof Error?error.message:'Request failed.');
    }
  };

  if(loading)return <div className="py-16 text-center text-sm text-muted-foreground">Loading web exam page builder…</div>;

  return <div className="space-y-5">
    <PageHeader
      title="Web App · Exam Page Builder"
      description="Control the complete exam landing page: section placement, visibility, copy, layouts, columns, card styles, tabs, CTAs and custom content."
      icon={<LayoutTemplate className="h-5 w-5"/>}
      actions={<Button onClick={()=>void save()} disabled={!draft||saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Publishing…':'Publish page'}</Button>}
    />

    <div className="grid gap-4 2xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <Card className="h-fit">
        <CardHeader><CardTitle className="text-base">Exam pages</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            {pages.map(page=><button key={page.examSlug} type="button" onClick={()=>setSelectedSlug(page.examSlug)} className={`w-full rounded-lg border px-3 py-2 text-left transition ${page.examSlug===draft?.examSlug?'border-primary bg-primary/5':'hover:bg-muted'}`}>
              <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{page.title||page.examSlug}</span><span className="text-[9px] uppercase text-muted-foreground">{page.isActive?'live':'off'}</span></div>
              <p className="truncate text-xs text-muted-foreground">/{page.examSlug}</p>
            </button>)}
            {pages.length===0&&<p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">No custom web exam pages yet. Create one below; existing learner pages continue using defaults.</p>}
          </div>

          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-semibold">Configure another exam</p>
            <Select value={KNOWN_PAGES.some(([slug])=>slug===newSlug)?newSlug:'custom'} onValueChange={value=>{
              if(value==='custom'){setNewSlug('');setNewTitle('');return;}
              const item=KNOWN_PAGES.find(([slug])=>slug===value);
              if(item){setNewSlug(item[0]);setNewTitle(item[1]);}
            }}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{KNOWN_PAGES.map(([slug,label])=><SelectItem key={slug} value={slug}>{label}</SelectItem>)}<SelectItem value="custom">Custom / future exam</SelectItem></SelectContent>
            </Select>
            <Input value={newSlug} onChange={event=>setNewSlug(event.target.value)} placeholder="exam-page-slug"/>
            <Input value={newTitle} onChange={event=>setNewTitle(event.target.value)} placeholder="Admin page name"/>
            <Button variant="outline" className="w-full" onClick={createPage} disabled={!newSlug.trim()||!defaultConfiguration}><Plus className="mr-1.5 h-4 w-4"/>Open builder</Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Canonical exams available: {catalog.length}. Page slug controls the public destination and can also be used for future exams before tests are published.</p>
          </div>
        </CardContent>
      </Card>

      <div className="min-w-0 space-y-4">
        {!draft?<Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Choose or create an exam page to edit its structure.</CardContent></Card>:<>
          <Card>
            <CardHeader><CardTitle className="text-base">Page-level content</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Admin name</Label><Input value={draft.title} onChange={event=>patchPage({title:event.target.value})}/></div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2"><div><Label>Custom page active</Label><p className="text-xs text-muted-foreground">Turn off to use default rendering.</p></div><Switch checked={draft.isActive} onCheckedChange={value=>patchPage({isActive:value})}/></div>
              <div className="space-y-2 md:col-span-2"><Label>Public eyebrow</Label><Input value={draft.configuration.pageEyebrow} onChange={event=>patchConfiguration({pageEyebrow:event.target.value})} placeholder="IBPS PO · 2026"/></div>
              <div className="space-y-2 md:col-span-2"><Label>Public page title</Label><Input value={draft.configuration.pageTitle} onChange={event=>patchConfiguration({pageTitle:event.target.value})} placeholder="Blank keeps canonical exam title"/></div>
              <div className="space-y-2 md:col-span-2"><Label>Public page description</Label><Textarea rows={3} value={draft.configuration.pageDescription} onChange={event=>patchConfiguration({pageDescription:event.target.value})} placeholder="Blank keeps canonical exam description"/></div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {orderedSections.map((section,index)=><Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold">{index+1}</span>
                    <div><CardTitle className="text-base">{SECTION_LABELS[section.type]}</CardTitle><p className="text-xs text-muted-foreground">{section.isVisible?'Visible':'Hidden'} · {section.layout} · {section.columns} column{section.columns===1?'':'s'}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button size="icon" variant="ghost" onClick={()=>setSections(move(orderedSections,index,-1))} disabled={index===0}><ArrowUp className="h-4 w-4"/></Button>
                    <Button size="icon" variant="ghost" onClick={()=>setSections(move(orderedSections,index,1))} disabled={index===orderedSections.length-1}><ArrowDown className="h-4 w-4"/></Button>
                    <Button size="icon" variant="ghost" onClick={()=>updateSection(section.id,{isVisible:!section.isVisible})}>{section.isVisible?<Eye className="h-4 w-4"/>:<EyeOff className="h-4 w-4"/>}</Button>
                    <Button size="icon" variant="ghost" onClick={()=>duplicateSection(section.id)}><Copy className="h-4 w-4"/></Button>
                    <Button size="icon" variant="ghost" onClick={()=>removeSection(section.id)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Section type</Label><Select value={section.type} onValueChange={value=>updateSection(section.id,{type:value as SectionType})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.entries(SECTION_LABELS).map(([value,label])=><SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Eyebrow / small label</Label><Input value={section.eyebrow} onChange={event=>updateSection(section.id,{eyebrow:event.target.value})} placeholder="Blank keeps default"/></div>
                <div className="space-y-2 md:col-span-2"><Label>Heading</Label><Input value={section.title} onChange={event=>updateSection(section.id,{title:event.target.value})} placeholder="Blank keeps default"/></div>
                <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={2} value={section.description} onChange={event=>updateSection(section.id,{description:event.target.value})} placeholder="Blank keeps default"/></div>
                {section.type==='custom'&&<div className="space-y-2 md:col-span-2"><Label>Custom body</Label><Textarea rows={4} value={section.body} onChange={event=>updateSection(section.id,{body:event.target.value})}/></div>}
                <div className="space-y-2"><Label>Layout</Label><Select value={section.layout} onValueChange={value=>updateSection(section.id,{layout:value as Layout})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="tabs">Tabs</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="grid">Grid</SelectItem><SelectItem value="horizontal">Horizontal scroll</SelectItem><SelectItem value="cards">Cards</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Columns</Label><Select value={String(section.columns)} onValueChange={value=>updateSection(section.id,{columns:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{[1,2,3,4].map(value=><SelectItem key={value} value={String(value)}>{value}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Card style</Label><Select value={section.cardStyle} onValueChange={value=>updateSection(section.id,{cardStyle:value as CardStyle})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="default">Default</SelectItem><SelectItem value="compact">Compact</SelectItem><SelectItem value="bordered">Bordered</SelectItem><SelectItem value="minimal">Minimal</SelectItem><SelectItem value="featured">Featured</SelectItem></SelectContent></Select></div>
                {section.type==='test_catalog'&&<><div className="space-y-2"><Label>Tab style</Label><Select value={section.tabStyle} onValueChange={value=>updateSection(section.id,{tabStyle:value as TabStyle})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="pills">Pills</SelectItem><SelectItem value="underline">Underline</SelectItem><SelectItem value="segmented">Segmented</SelectItem></SelectContent></Select></div><div className="flex items-center justify-between rounded-lg border px-3 py-2"><div><Label>Show tab counts</Label><p className="text-xs text-muted-foreground">Number of tests next to each tab.</p></div><Switch checked={section.showCounts} onCheckedChange={value=>updateSection(section.id,{showCounts:value})}/></div></>}
                <div className="space-y-2"><Label>CTA label</Label><Input value={section.ctaLabel} onChange={event=>updateSection(section.id,{ctaLabel:event.target.value})} placeholder="Blank keeps default"/></div>
                <div className="space-y-2"><Label>CTA href</Label><Input value={section.ctaHref} onChange={event=>updateSection(section.id,{ctaHref:event.target.value})} placeholder="/path or https://…"/></div>

                {section.type==='custom'&&<div className="space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between"><Label>Custom cards</Label><Button size="sm" variant="outline" onClick={()=>addCard(section.id)}><Plus className="mr-1 h-4 w-4"/>Card</Button></div>
                  {section.cards.map(card=><div key={card.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-2">
                    <Input value={card.title} onChange={event=>updateCard(section.id,card.id,{title:event.target.value})} placeholder="Card title"/>
                    <Input value={card.badge} onChange={event=>updateCard(section.id,card.id,{badge:event.target.value})} placeholder="Badge"/>
                    <Textarea className="md:col-span-2" rows={2} value={card.text} onChange={event=>updateCard(section.id,card.id,{text:event.target.value})} placeholder="Card text"/>
                    <Input value={card.ctaLabel} onChange={event=>updateCard(section.id,card.id,{ctaLabel:event.target.value})} placeholder="CTA label"/>
                    <Input value={card.href} onChange={event=>updateCard(section.id,card.id,{href:event.target.value})} placeholder="CTA href"/>
                    <div className="md:col-span-2 flex items-center justify-between"><div className="flex items-center gap-2"><Switch checked={card.isVisible} onCheckedChange={value=>updateCard(section.id,card.id,{isVisible:value})}/><span className="text-xs text-muted-foreground">Visible</span></div><Button size="sm" variant="ghost" onClick={()=>removeCard(section.id,card.id)}><Trash2 className="mr-1 h-4 w-4"/>Remove</Button></div>
                  </div>)}
                </div>}
              </CardContent>
            </Card>)}
          </div>

          <Card>
            <CardContent className="flex flex-wrap gap-2 p-4">
              {(Object.keys(SECTION_LABELS) as SectionType[]).map(type=><Button key={type} variant="outline" size="sm" onClick={()=>setSections([...orderedSections,{...newSection(type),sortOrder:orderedSections.length+1}])}><Plus className="mr-1 h-4 w-4"/>{SECTION_LABELS[type]}</Button>)}
            </CardContent>
          </Card>

          {draft.id&&<Button variant="destructive" onClick={()=>void deleteConfiguration()}><Trash2 className="mr-1.5 h-4 w-4"/>Remove custom configuration</Button>}
        </>}
      </div>

      <Card className="h-fit 2xl:sticky 2xl:top-4">
        <CardHeader><CardTitle className="text-base">Structure preview</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {!draft?<p className="text-sm text-muted-foreground">No page selected.</p>:<>
            <div className="rounded-xl border bg-muted/20 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{draft.configuration.pageEyebrow||'Canonical eyebrow'}</p>
              <p className="mt-1 font-semibold">{draft.configuration.pageTitle||draft.title||'Canonical title'}</p>
              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{draft.configuration.pageDescription||'Canonical page description remains in use.'}</p>
            </div>
            {orderedSections.map((section,index)=><div key={section.id} className={`rounded-xl border p-3 ${section.isVisible?'bg-background':'bg-muted/50 opacity-60'}`}>
              <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold">{index+1}. {section.title||SECTION_LABELS[section.type]}</span><span className="text-[10px] uppercase text-muted-foreground">{section.layout}</span></div>
              <p className="mt-1 text-[11px] text-muted-foreground">{section.isVisible?'Visible':'Hidden'} · {section.columns} col · {section.cardStyle}</p>
            </div>)}
            <p className="text-[11px] leading-5 text-muted-foreground">Blank copy fields deliberately fall back to the canonical exam content. This lets you rearrange presentation without duplicating syllabus/preparation data.</p>
          </>}
        </CardContent>
      </Card>
    </div>
  </div>;
}
