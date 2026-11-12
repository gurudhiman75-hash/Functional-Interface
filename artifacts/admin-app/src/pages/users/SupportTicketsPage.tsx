import { useCallback, useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/integrations/firebase';

type Ticket = { id:string; name:string; email:string; category:string; message:string; status:string; adminNote:string; publicReply:string; createdAt:string };
const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
async function request<T>(path:string, init?:RequestInit):Promise<T> {
  const user=getFirebaseAuth()?.currentUser;
  if(!user)throw new Error('Sign in as administrator.');
  const headers=new Headers(init?.headers);
  headers.set('Authorization', 'Bearer ' + await user.getIdToken());
  if(init?.body)headers.set('Content-Type','application/json');
  const response=await fetch(apiBase+path,{...init,headers});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error||'Support request failed');
  return data as T;
}
export function SupportTicketsPage(){
  const [tickets,setTickets]=useState<Ticket[]>([]);
  const [filter,setFilter]=useState('open');
  const [page,setPage]=useState(1);
  const [selected,setSelected]=useState<string|null>(null);
  const [note,setNote]=useState('');
  const [publicReply,setPublicReply]=useState('');
  const [status,setStatus]=useState('open');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const load=useCallback(async()=>{
    try {
      const result=await request<{tickets:Ticket[]}>(`/admin/support/tickets?status=${encodeURIComponent(filter)}&page=${page}`);
      setTickets(result.tickets);setError('');
    } catch(err){setError(err instanceof Error?err.message:'Unable to load tickets');}
  },[filter,page]);
  useEffect(()=>{void load();},[load]);
  const current=tickets.find(t=>t.id===selected);
  const save=async()=>{
    if(!current)return;
    setBusy(true);setNotice('');
    try{
      await request(`/admin/support/tickets/${current.id}`,{method:'PATCH',body:JSON.stringify({status,note,publicReply})});
      setNotice('Request updated.');await load();setSelected(null);
    }catch(err){setError(err instanceof Error?err.message:'Update failed');}
    finally{setBusy(false);}
  };
  return <section className="mx-auto max-w-6xl space-y-5 p-6">
    <header><h1 className="text-2xl font-bold">Support requests</h1><p className="text-sm text-slate-600">Private student enquiries. Do not share these details outside the authorized support team.</p></header>
    <div className="flex flex-wrap gap-3">
      <select aria-label="Filter status" className="rounded border p-2" value={filter} onChange={e=>{setFilter(e.target.value);setPage(1);setSelected(null);}}>
        <option value="">All statuses</option><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
      </select>
      <button className="rounded border px-3 py-2" onClick={()=>void load()}>Refresh</button>
    </div>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    {notice&&<p role="status" className="text-green-700">{notice}</p>}
    <div className="divide-y rounded border">
      {tickets.map(t=><button key={t.id} className="block w-full p-4 text-left hover:bg-slate-50" onClick={()=>{setSelected(t.id);setStatus(t.status);setNote(t.adminNote||'');setPublicReply(t.publicReply||'');}}>
        <div className="flex justify-between gap-2"><strong>{t.category}</strong><span className="text-xs">{t.status}</span></div>
        <div className="text-sm">{t.name} · {t.email} · {new Date(t.createdAt).toLocaleString()}</div>
        <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-slate-600">{t.message}</p>
      </button>)}
      {!tickets.length&&!error&&<p className="p-4 text-slate-500">No tickets in this view.</p>}
    </div>
    <div className="flex items-center gap-3"><button className="rounded border px-3 py-2" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page}</span><button className="rounded border px-3 py-2" disabled={tickets.length<25} onClick={()=>setPage(p=>p+1)}>Next</button></div>
    {current&&<div className="rounded border p-4 space-y-3">
      <h2 className="font-bold">Review {current.id}</h2>
      <p className="whitespace-pre-wrap">{current.message}</p>
      <a className="underline" href={`mailto:${current.email}?subject=${encodeURIComponent('Re: ExamTree support request '+current.id)}`}>Reply via email</a>
      <label className="block">Status <select className="ml-2 rounded border p-2" value={status} onChange={e=>setStatus(e.target.value)}><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></label>
      <label className="block">Internal note<textarea className="mt-1 block w-full rounded border p-2" maxLength={2000} rows={3} value={note} onChange={e=>setNote(e.target.value)}/></label>
      <label className="block">Reply visible to student<textarea className="mt-1 block w-full rounded border p-2" maxLength={2000} rows={3} value={publicReply} onChange={e=>setPublicReply(e.target.value)}/></label>
      <button className="rounded bg-indigo-950 px-4 py-2 text-white disabled:opacity-50" disabled={busy} onClick={()=>void save()}>Save review</button>
    </div>}
  </section>;
}
