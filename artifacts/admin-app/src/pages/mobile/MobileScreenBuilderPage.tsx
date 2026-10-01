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

type Block={
  id:string;title:string;subtitle:string;badge:string;iconName:string;iconUrl:string;imageUrl:string;
  ctaLabel:string;destinationType:string;destinationValue:string;isActive:boolean;sortOrder:number;
};
type Section={id:string;title:string;subtitle:string;iconName:string;iconUrl:string;layout:string;isVisible:boolean;sortOrder:number;cards:Block[]};
type MobilePage={
  id:string;slug:string;title:string;description:string;nativeRoute:string|null;renderMode:'native'|'managed';
  iconName:string;isActive:boolean;showAppBar:boolean;configuration:{sections:Section[]};sortOrder:number;updatedAt?:string|null;
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
  return body as T;
}

const move=<T,>(items:T[],index:number,direction:-1|1)=>{
  const target=index+direction;if(target<0||target>=items.length)return items;
  const next=[...items];[next[index],next[target]]=[next[target]!,next[index]!];return next;
};
const newSection=(layout='horizontal'):Section=>({
  id:crypto.randomUUID(),title:layout==='banner'?'New banner':'New section',subtitle:'',iconName:'',iconUrl:'',
  layout,isVisible:true,sortOrder:1,cards:[],
});
const newBlock=():Block=>({
  id:crypto.randomUUID(),title:'New card',subtitle:'',badge:'',iconName:'',iconUrl:'',imageUrl:'',
  ctaLabel:'Open',destinationType:'none',destinationValue:'',isActive:true,sortOrder:1,
});

export function MobileScreenBuilderPage(){
  const[pages,setPages]=useState<MobilePage[]>([]);
  const[selectedId,setSelectedId]=useState('');
  const[draft,setDraft]=useState<MobilePage|null>(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[newTitle,setNewTitle]=useState('');
  const[newSlug,setNewSlug]=useState('');

  const selected=useMemo(()=>pages.find(page=>page.id===selectedId)||pages[0]||null,[pages,selectedId]);

  const refresh=async()=>{
    setLoading(true);
    try{
      const result=await call<{pages:MobilePage[]}>('/admin/mobile/pages');
      setPages(result.pages);
      const next=result.pages.find(page=>page.id===selectedId)||result.pages[0]||null;
      setSelectedId(next?.id||'');setDraft(next?structuredClone(next):null);
    }catch(error){showToast.error('Unable to load Screen Builder',error instanceof Error?error.message:'Request failed.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{void refresh();},[]);
  useEffect(()=>{if(selected)setDraft(structuredClone(selected));},[selected?.id]);

  const patch=(value:Partial<MobilePage>)=>setDraft(previous=>previous?({...previous,...value}):previous);
  const setSections=(sections:Section[])=>patch({configuration:{sections:sections.map((section,index)=>({...section,sortOrder:index+1}))}});
  const updateSection=(id:string,value:Partial<Section>)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===id?{...section,...value}:section));
  const addSection=(layout:string)=>draft&&setSections([...draft.configuration.sections,{...newSection(layout),sortOrder:draft.configuration.sections.length+1}]);
  const removeSection=(id:string)=>draft&&setSections(draft.configuration.sections.filter(section=>section.id!==id));
  const duplicateSection=(id:string)=>draft&&setSections(draft.configuration.sections.flatMap(section=>section.id===id?[section,{...section,id:crypto.randomUUID(),title:`${section.title} copy`,cards:section.cards.map(card=>({...card,id:crypto.randomUUID()}))}]:[section]));
  const updateCard=(sectionId:string,cardId:string,value:Partial<Block>)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===sectionId?{...section,cards:section.cards.map(card=>card.id===cardId?{...card,...value}:card)}:section));
  const addCard=(sectionId:string)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===sectionId?{...section,cards:[...section.cards,{...newBlock(),sortOrder:section.cards.length+1}]}:section));
  const removeCard=(sectionId:string,cardId:string)=>draft&&setSections(draft.configuration.sections.map(section=>section.id===sectionId?{...section,cards:section.cards.filter(card=>card.id!==cardId).map((card,index)=>({...card,sortOrder:index+1}))}:section));

  const createPage=async()=>{
    if(!newTitle.trim()||!newSlug.trim())return;
    try{
      const result=await call<{page:MobilePage}>('/admin/mobile/pages',{method:'POST',body:JSON.stringify({title:newTitle,slug:newSlug})});
      setPages(previous=>[...previous,result.page]);setSelectedId(result.page.id);setDraft(structuredClone(result.page));
      setNewTitle('');setNewSlug('');showToast.success('Page created','The page can now be built and linked from anywhere in the app.');
    }catch(error){showToast.error('Unable to create page',error instanceof Error?error.message:'Request failed.');}
  };

  const save=async()=>{
    if(!draft)return;setSaving(true);
    try{
      const result=await call<{page:MobilePage}>(`/admin/mobile/pages/${draft.id}`,{method:'PUT',body:JSON.stringify(draft)});
      setPages(previous=>previous.map(page=>page.id===result.page.id?result.page:page));setDraft(structuredClone(result.page));
      showToast.success('Screen published','The mobile runtime can now read this page configuration.');
    }catch(error){showToast.error('Unable to publish screen',error instanceof Error?error.message:'Request failed.');}
    finally{setSaving(false);}
  };

  const deletePage=async()=>{
    if(!draft||draft.nativeRoute)return;
    try{
      await call<void>(`/admin/mobile/pages/${draft.id}`,{method:'DELETE'});
      setPages(previous=>previous.filter(page=>page.id!==draft.id));setSelectedId('');setDraft(null);showToast.success('Page deleted','The managed page was removed.');
    }catch(error){showToast.error('Unable to delete page',error instanceof Error?error.message:'Request failed.');}
  };

  return <div className="space-y-5">
    <PageHeader
      title="Mobile App · Screen Builder"
      description="Manage registered app screens and create future pages from reusable sections and blocks. Native screens remain protected unless deliberately switched to managed rendering."
      icon={<Smartphone className="h-5 w-5"/>}
      actions={<Button onClick={()=>void save()} disabled={!draft||saving}><Save className="mr-1.5 h-4 w-4"/>{saving?'Publishing…':'Publish screen'}</Button>}
    />

    <div className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
      <Card>
        <CardHeader><CardTitle className="text-base">Pages</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            {pages.map(page=><button key={page.id} type="button" onClick={()=>setSelectedId(page.id)} className={`w-full rounded-lg border px-3 py-2 text-left transition ${page.id===draft?.id?'border-primary bg-primary/5':'hover:bg-muted'}`}>
              <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{page.title}</span><span className="text-[10px] uppercase text-muted-foreground">{page.renderMode}</span></div>
              <p className="truncate text-xs text-muted-foreground">/{page.slug}{page.nativeRoute?` · ${page.nativeRoute}`:''}</p>
            </button>)}
          </div>
          <div className="space-y-2 border-t pt-3">
            <p className="text-sm font-semibold">Create future page</p>
            <Input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Page name"/>
            <Input value={newSlug} onChange={e=>setNewSlug(e.target.value)} placeholder="slug, e.g. scholarships"/>
            <Button className="w-full" variant="outline" onClick={()=>void createPage()}><Plus className="mr-1.5 h-4 w-4"/>Create page</Button>
          </div>
        </CardContent>
      </Card>

      {loading?<Card><CardContent className="p-8 text-sm text-muted-foreground">Loading Screen Builder…</CardContent></Card>:!draft?<Card><CardContent className="p-8 text-sm text-muted-foreground">Create or select a page.</CardContent></Card>:<div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Page settings</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Title"><Input value={draft.title} onChange={e=>patch({title:e.target.value})}/></Field>
            <Field label="Slug"><Input value={draft.slug} disabled/></Field>
            <div className="md:col-span-2"><Field label="Description"><Textarea rows={2} value={draft.description} onChange={e=>patch({description:e.target.value})}/></Field></div>
            <Field label="Rendering"><Select value={draft.renderMode} onValueChange={value=>patch({renderMode:value as 'native'|'managed'})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="native" disabled={!draft.nativeRoute}>Native app screen</SelectItem><SelectItem value="managed">Managed Screen Builder page</SelectItem></SelectContent></Select></Field>
            <Field label="Page icon"><Input value={draft.iconName} onChange={e=>patch({iconName:e.target.value})} placeholder="star / book / grid"/></Field>
            <div className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-semibold">Active</p><p className="text-xs text-muted-foreground">Allow runtime access</p></div><Switch checked={draft.isActive} onCheckedChange={checked=>patch({isActive:checked})}/></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-semibold">App bar</p><p className="text-xs text-muted-foreground">Show native page title bar</p></div><Switch checked={draft.showAppBar} onCheckedChange={checked=>patch({showAppBar:checked})}/></div>
            {draft.nativeRoute&&draft.renderMode==='managed'&&<div className="md:col-span-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">This replaces the registered native screen at {draft.nativeRoute} when that route is connected to managed rendering. Keep Native unless you intentionally want a fully CMS-driven version.</div>}
          </CardContent>
        </Card>

        {draft.renderMode==='native'&&draft.slug==='home'&&<Card className="border-primary/20 bg-primary/5"><CardContent className="p-4 text-sm">Home currently keeps its richer existing Home Management configuration. The app-wide registry now owns page identity and future managed screens; Home can be migrated into the same block schema after parity is complete.</CardContent></Card>}

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
            <div><CardTitle className="flex items-center gap-2 text-base"><Layers3 className="h-4 w-4"/>Sections & blocks</CardTitle><p className="mt-1 text-sm text-muted-foreground">These blocks can be reused on any managed page.</p></div>
            <Select onValueChange={addSection}><SelectTrigger className="w-[170px]"><Plus className="mr-2 h-4 w-4"/><SelectValue placeholder="Add section"/></SelectTrigger><SelectContent><SelectItem value="horizontal">Horizontal cards</SelectItem><SelectItem value="grid">Grid</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="banner">Banner</SelectItem></SelectContent></Select>
          </CardHeader>
          <CardContent className="space-y-3">
            {draft.configuration.sections.length===0&&<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No managed sections yet.</div>}
            {draft.configuration.sections.map((section,index)=><div key={section.id} className="rounded-xl border">
              <div className="flex flex-wrap items-center gap-2 p-3">
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{section.title}</p><p className="text-xs text-muted-foreground">{section.layout} · {section.cards.length} block{section.cards.length===1?'':'s'}</p></div>
                <Switch checked={section.isVisible} onCheckedChange={checked=>updateSection(section.id,{isVisible:checked})}/>
                <Button size="icon" variant="ghost" onClick={()=>{if(draft)setSections(move(draft.configuration.sections,index,-1));}} disabled={index===0}><ArrowUp className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>{if(draft)setSections(move(draft.configuration.sections,index,1));}} disabled={index===draft.configuration.sections.length-1}><ArrowDown className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>duplicateSection(section.id)}><Copy className="h-4 w-4"/></Button>
                <Button size="icon" variant="ghost" onClick={()=>removeSection(section.id)}><Trash2 className="h-4 w-4"/></Button>
              </div>
              <div className="grid gap-3 border-t bg-muted/20 p-3 md:grid-cols-2">
                <Field label="Section title"><Input value={section.title} onChange={e=>updateSection(section.id,{title:e.target.value})}/></Field>
                <Field label="Layout"><Select value={section.layout} onValueChange={value=>updateSection(section.id,{layout:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="horizontal">Horizontal</SelectItem><SelectItem value="grid">Grid</SelectItem><SelectItem value="list">List</SelectItem><SelectItem value="banner">Banner</SelectItem></SelectContent></Select></Field>
                <div className="md:col-span-2"><Field label="Subtitle"><Input value={section.subtitle} onChange={e=>updateSection(section.id,{subtitle:e.target.value})}/></Field></div>
                <Field label="Built-in icon"><Input value={section.iconName} onChange={e=>updateSection(section.id,{iconName:e.target.value})}/></Field>
                <Field label="Custom icon"><MediaAssetPicker value={section.iconUrl} onChange={url=>updateSection(section.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
                <div className="md:col-span-2 flex items-center justify-between"><p className="text-sm font-semibold">Blocks</p><Button size="sm" variant="outline" onClick={()=>addCard(section.id)}><Plus className="mr-1 h-4 w-4"/>Add block</Button></div>
                <div className="md:col-span-2 space-y-3">
                  {section.cards.map(card=><div key={card.id} className="grid gap-3 rounded-lg border bg-background p-3 md:grid-cols-2">
                    <Field label="Title"><Input value={card.title} onChange={e=>updateCard(section.id,card.id,{title:e.target.value})}/></Field>
                    <Field label="Badge"><Input value={card.badge} onChange={e=>updateCard(section.id,card.id,{badge:e.target.value})}/></Field>
                    <Field label="Subtitle"><Input value={card.subtitle} onChange={e=>updateCard(section.id,card.id,{subtitle:e.target.value})}/></Field>
                    <Field label="CTA"><Input value={card.ctaLabel} onChange={e=>updateCard(section.id,card.id,{ctaLabel:e.target.value})}/></Field>
                    <Field label="Image"><MediaAssetPicker value={card.imageUrl} onChange={url=>updateCard(section.id,card.id,{imageUrl:url})} preferredType="Home Banner" label="Choose / Upload"/></Field>
                    <Field label="Icon"><MediaAssetPicker value={card.iconUrl} onChange={url=>updateCard(section.id,card.id,{iconUrl:url})} preferredType="Home Icon" label="Choose"/></Field>
                    <Field label="Action"><Select value={card.destinationType} onValueChange={value=>updateCard(section.id,card.id,{destinationType:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No action</SelectItem><SelectItem value="page">Managed page</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="test_series">Test series</SelectItem><SelectItem value="learn">Learn/native route</SelectItem><SelectItem value="url">External URL</SelectItem></SelectContent></Select></Field>
                    <Field label="Destination"><Input value={card.destinationValue} onChange={e=>updateCard(section.id,card.id,{destinationValue:e.target.value})} placeholder="page slug, entity ID, route or URL"/></Field>
                    <div className="md:col-span-2 flex justify-end"><Button size="sm" variant="ghost" onClick={()=>removeCard(section.id,card.id)}><Trash2 className="mr-1 h-4 w-4"/>Remove block</Button></div>
                  </div>)}
                </div>
              </div>
            </div>)}
          </CardContent>
        </Card>

        {!draft.nativeRoute&&<div className="flex justify-end"><Button variant="destructive" onClick={()=>void deletePage()}><Trash2 className="mr-1.5 h-4 w-4"/>Delete managed page</Button></div>}
      </div>}
    </div>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>}
export default MobileScreenBuilderPage;
