import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, RefreshCw, Search } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const fmt = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';
const title = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  if (init?.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${apiBase}${path}`, { ...init, headers });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Attempt investigation request failed (${response.status}).`);
  if (!body) throw new Error('Attempt investigation service returned an empty response.');
  return body;
}

type Investigation = {
  caseId: string; attemptId: string; category: string; openingReason: string; openedAt: string; state: string;
  assignedToUserId: string | null; assignedToName: string | null; latestReason: string | null; updatedAt: string;
  attemptStatus: string; finalScore: number | null; studentId: string; studentName: string; studentEmail: string;
  registrationCode: string; testPublicCode: string; testTitle: string;
};

type Counts = { open: number; under_review: number; resolved: number; rejected: number };

export function AttemptInvestigationsPage() {
  const [items, setItems] = useState<Investigation[]>([]);
  const [counts, setCounts] = useState<Counts>({ open: 0, under_review: 0, resolved: 0, rejected: 0 });
  const [state, setState] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [attemptId, setAttemptId] = useState('');
  const [newCategory, setNewCategory] = useState('technical_issue');
  const [reason, setReason] = useState('');
  const [actionReason, setActionReason] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ state, category });
      if (appliedSearch) params.set('search', appliedSearch);
      const result = await request<{ investigations: Investigation[]; counts: Counts }>(`/admin/attempts/investigations?${params}`);
      setItems(result.investigations); setCounts(result.counts);
    } catch (error) { showToast.error('Unable to load investigations', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [state, category, appliedSearch]);

  const openCase = async () => {
    if (!attemptId.trim()) return showToast.warning('Attempt ID required', 'Enter the canonical attempt UUID.');
    if (reason.trim().length < 20) return showToast.warning('Detailed reason required', 'Enter at least 20 characters describing the investigation.');
    setWorking('create');
    try {
      await request(`/admin/attempts/${encodeURIComponent(attemptId.trim())}/investigations`, { method: 'POST', body: JSON.stringify({ category: newCategory, reason: reason.trim() }) });
      showToast.success('Investigation opened', 'The case was recorded without changing the attempt result.');
      setAttemptId(''); setReason(''); await load();
    } catch (error) { showToast.error('Unable to open investigation', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setWorking(null); }
  };

  const transition = async (item: Investigation, nextState: string) => {
    const note = (actionReason[item.caseId] || '').trim();
    if (note.length < 20) return showToast.warning('Detailed review note required', 'Enter at least 20 characters before changing case state.');
    setWorking(item.caseId);
    try {
      await request(`/admin/attempts/investigations/${item.caseId}`, { method: 'PATCH', body: JSON.stringify({ state: nextState, reason: note }) });
      showToast.success('Investigation updated', `Case marked ${title(nextState)}.`);
      setActionReason((current) => ({ ...current, [item.caseId]: '' })); await load();
    } catch (error) { showToast.error('Unable to update investigation', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setWorking(null); }
  };

  return <div className="space-y-5">
    <PageHeader title="Attempt Investigations" description="Investigate technical complaints, score disputes and suspicious attempt evidence without editing canonical results." icon={<ClipboardCheck className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Open" value={counts.open} /><Metric label="Under review" value={counts.under_review} /><Metric label="Resolved" value={counts.resolved} /><Metric label="Rejected" value={counts.rejected} /></div>
    <Card><CardContent className="space-y-3 p-4"><p className="font-semibold">Open investigation</p><div className="grid gap-3 md:grid-cols-2"><Input value={attemptId} onChange={(event) => setAttemptId(event.target.value)} placeholder="Canonical attempt UUID" /><Select value={newCategory} onValueChange={setNewCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="technical_issue">Technical issue</SelectItem><SelectItem value="score_dispute">Score dispute</SelectItem><SelectItem value="duplicate_submission">Duplicate submission</SelectItem><SelectItem value="suspicious_timing">Suspicious timing</SelectItem><SelectItem value="support_request">Support request</SelectItem></SelectContent></Select></div><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Describe the complaint, evidence or anomaly. This becomes immutable case evidence." /><Button onClick={() => void openCase()} disabled={working === 'create' || reason.trim().length < 20}>{working === 'create' ? 'Opening…' : 'Open investigation'}</Button><p className="text-xs text-muted-foreground">Investigations never change stored scores, responses or result snapshots.</p></CardContent></Card>
    <Card><CardContent className="flex flex-col gap-3 p-4 lg:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Student, test, attempt or case ID" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={state} onValueChange={setState}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All states</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="under_review">Under review</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select><Select value={category} onValueChange={setCategory}><SelectTrigger className="lg:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem><SelectItem value="technical_issue">Technical issue</SelectItem><SelectItem value="score_dispute">Score dispute</SelectItem><SelectItem value="duplicate_submission">Duplicate submission</SelectItem><SelectItem value="suspicious_timing">Suspicious timing</SelectItem><SelectItem value="support_request">Support request</SelectItem></SelectContent></Select></CardContent></Card>
    <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Student / attempt</TableHead><TableHead>Category</TableHead><TableHead>State</TableHead><TableHead>Assigned</TableHead><TableHead>Review</TableHead></TableRow></TableHeader><TableBody>{items.length ? items.map((item) => <TableRow key={item.caseId}><TableCell><Link className="font-medium hover:underline" to={`/users/attempts/${item.attemptId}`}>{item.studentName} · {item.testTitle}</Link><div className="text-xs text-muted-foreground">{item.registrationCode} · {item.testPublicCode} · {fmt(item.openedAt)}</div><p className="mt-1 max-w-xl text-xs text-muted-foreground">{item.openingReason}</p></TableCell><TableCell>{title(item.category)}</TableCell><TableCell><StatusBadge tone={item.state === 'resolved' ? 'success' : item.state === 'rejected' ? 'destructive' : item.state === 'under_review' ? 'warning' : 'neutral'} dot>{title(item.state)}</StatusBadge></TableCell><TableCell className="text-sm">{item.assignedToName || 'Unassigned'}</TableCell><TableCell className="min-w-[260px]">{item.state === 'resolved' || item.state === 'rejected' ? <div className="text-xs text-muted-foreground">{item.latestReason || 'Closed'}<br />{fmt(item.updatedAt)}</div> : <div className="space-y-2"><Textarea value={actionReason[item.caseId] || ''} onChange={(event) => setActionReason((current) => ({ ...current, [item.caseId]: event.target.value }))} placeholder="Required review note" className="min-h-20" /><div className="flex flex-wrap gap-1.5">{item.state === 'open' && <Button size="sm" onClick={() => void transition(item, 'under_review')} disabled={working === item.caseId}>Start review</Button>}{item.state === 'under_review' && <><Button size="sm" onClick={() => void transition(item, 'resolved')} disabled={working === item.caseId}>Resolve</Button><Button size="sm" variant="destructive" onClick={() => void transition(item, 'rejected')} disabled={working === item.caseId}>Reject</Button></>}</div></div>}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">{loading ? 'Loading investigations…' : 'No investigations match these filters.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>; }

export default AttemptInvestigationsPage;
