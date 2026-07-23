import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, ExternalLink, List, Loader2, RefreshCw, Rocket, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AdminErrorAlert } from '@/components/shared/AdminErrorAlert';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLiveTests, transitionLiveTest, type LiveTestSummary } from '@/features/test-builder/api';
import { toAdminApiError, type AdminApiError } from '@/lib/admin-api-error';

function dayKey(value: Date | string) { const date = typeof value === 'string' ? new Date(value) : value; return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function addDays(value: Date, days: number) { const next = new Date(value); next.setDate(next.getDate() + days); return next; }
function setting(test: LiveTestSummary, key: string, fallback: string) { const value = test.settings?.[key]; return typeof value === 'string' && value ? value : fallback; }
function warning(test: LiveTestSummary) { if (!test.scheduledAt) return test.status === 'qa_approved' ? 'Ready but unscheduled' : null; return test.status === 'scheduled' && new Date(test.scheduledAt).getTime() < Date.now() ? 'Missed publication time' : null; }

export function PublishingCalendarPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<LiveTestSummary[]>([]);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [exam, setExam] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<AdminApiError | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setTests((await getLiveTests()).tests); }
    catch (caught) { setError(toAdminApiError(caught, { fallbackMessage: 'Unable to load the Publishing Calendar.' })); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => tests.filter((test) => {
    if (exam !== 'all' && test.examVersionId !== exam) return false;
    if (status !== 'all' && test.status !== status) return false;
    const term = search.trim().toLowerCase();
    return !term || `${test.title ?? ''} ${test.publicCode} ${test.examName}`.toLowerCase().includes(term);
  }), [exam, search, status, tests]);
  const scheduled = filtered.filter((test) => Boolean(test.scheduledAt));
  const unscheduled = filtered.filter((test) => !test.scheduledAt && ['qa_approved', 'draft', 'content_ready', 'under_qa', 'needs_fix'].includes(test.status));
  const exams = Array.from(new Map(tests.map((test) => [test.examVersionId, test.examName])).entries());
  const first = addDays(month, -month.getDay());
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const last = addDays(end, 6 - end.getDay());
  const days: Date[] = []; for (let cursor = first; cursor <= last; cursor = addDays(cursor, 1)) days.push(cursor);

  const mutate = async (test: LiveTestSummary, action: 'schedule' | 'publish' | 'restore-draft', scheduledAt?: string) => {
    if (!test.currentDraftVersionId) return showToast.error('Draft version missing', 'Save the test in Test Builder first.');
    setBusyId(test.id); setError(null);
    try {
      await transitionLiveTest(test.id, action, { expectedCurrentDraftVersionId: test.currentDraftVersionId, scheduledAt, reason: action === 'restore-draft' ? 'Unscheduled from Publishing Calendar' : undefined });
      showToast.success(action === 'publish' ? 'Test published' : action === 'schedule' ? 'Schedule updated' : 'Test unscheduled', test.publicCode);
      await load();
    } catch (caught) { setError(toAdminApiError(caught, { fallbackMessage: 'Unable to update the publication schedule.', affectedRecord: test.id })); }
    finally { setBusyId(null); }
  };

  const scheduleOnDay = (test: LiveTestSummary, day: Date) => {
    if (!['qa_approved', 'scheduled'].includes(test.status)) return showToast.warning('QA approval required', 'Only QA-approved tests can be scheduled.');
    const next = new Date(day); next.setHours(9, 0, 0, 0); void mutate(test, 'schedule', next.toISOString());
  };

  return <div className="space-y-5">
    <PageHeader title="Publishing Calendar" description="Plan, postpone and publish QA-approved tests from one release workspace." icon={<CalendarClock className="h-5 w-5" />} actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button><Button variant={view === 'calendar' ? 'default' : 'outline'} onClick={() => setView('calendar')}><CalendarClock className="mr-1.5 h-4 w-4" /> Calendar</Button><Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}><List className="mr-1.5 h-4 w-4" /> List</Button></div>} />
    {error && <AdminErrorAlert error={error} title="Publishing Calendar operation failed" onRetry={load} />}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Scheduled" value={scheduled.length} /><Metric label="Unscheduled queue" value={unscheduled.length} /><Metric label="Missed releases" value={tests.filter((test) => warning(test) === 'Missed publication time').length} danger /><Metric label="Live" value={tests.filter((test) => test.status === 'live').length} /></div>
    <Card><CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_240px_220px]"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, code, or exam" /><Select value={exam} onValueChange={setExam}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All exams</SelectItem>{exams.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{Array.from(new Set(tests.map((test) => test.status))).sort().map((value) => <SelectItem key={value} value={value}>{value.replace(/_/g, ' ')}</SelectItem>)}</SelectContent></Select></CardContent></Card>
    {loading ? <Card><CardContent className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading publishing schedule…</CardContent></Card> : <>
      <Card><CardHeader><CardTitle className="text-base">Unscheduled tests</CardTitle></CardHeader><CardContent>{unscheduled.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No tests are waiting for a release date.</p> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{unscheduled.map((test) => <div key={test.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/test-id', test.id)} className="rounded-lg border p-3"><div className="flex justify-between gap-2"><div><p className="font-medium">{test.title || 'Untitled test'}</p><p className="text-xs text-muted-foreground">{test.publicCode} · {test.examName}</p></div><Badge variant="outline">{test.status.replace(/_/g, ' ')}</Badge></div>{warning(test) && <p className="mt-2 text-xs text-warning">{warning(test)}</p>}<div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => navigate(`/tests/builder?edit=${test.id}`)}>Builder</Button><Button size="sm" variant="outline" onClick={() => navigate('/tests/qa')}>Test QA</Button></div></div>)}</div>}</CardContent></Card>
      {view === 'calendar' ? <Card><CardHeader><div className="flex items-center justify-between"><Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button><CardTitle>{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</CardTitle><Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button></div></CardHeader><CardContent><div className="grid grid-cols-7 border-l border-t text-xs">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((label) => <div key={label} className="border-b border-r p-2 text-center font-medium text-muted-foreground">{label}</div>)}{days.map((day) => { const items = scheduled.filter((test) => test.scheduledAt && dayKey(test.scheduledAt) === dayKey(day)); return <div key={day.toISOString()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const test = tests.find((item) => item.id === event.dataTransfer.getData('text/test-id')); if (test) scheduleOnDay(test, day); }} className={`min-h-32 border-b border-r p-2 ${day.getMonth() === month.getMonth() ? '' : 'bg-muted/20'}`}><div className="flex justify-between"><span>{day.getDate()}</span>{items.length > 3 && <Badge variant="destructive" className="text-[10px]">Crowded</Badge>}</div><div className="mt-2 space-y-1">{items.map((test) => <button key={test.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/test-id', test.id)} onClick={() => navigate(`/tests/${test.id}`)} className="w-full rounded border bg-background p-1.5 text-left"><p className="truncate font-medium">{test.title || test.publicCode}</p><p className="text-[10px] text-muted-foreground">{new Date(test.scheduledAt!).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {test.examCode}</p>{warning(test) && <p className="text-[10px] text-destructive">{warning(test)}</p>}</button>)}</div></div>; })}</div></CardContent></Card> : <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[900px] text-sm"><thead className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground"><tr><th className="p-4">Test</th><th className="p-4">Release</th><th className="p-4">Access</th><th className="p-4">Language</th><th className="p-4">Warning</th><th className="p-4" /></tr></thead><tbody>{scheduled.sort((a,b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()).map((test) => <tr key={test.id} className="border-b"><td className="p-4"><p className="font-medium">{test.title || 'Untitled test'}</p><p className="text-xs text-muted-foreground">{test.publicCode} · {test.examName}</p></td><td className="p-4">{new Date(test.scheduledAt!).toLocaleString('en-IN')}</td><td className="p-4">{setting(test, 'access', 'free')}</td><td className="p-4">{setting(test, 'languageCode', 'en').toUpperCase()}</td><td className="p-4">{warning(test) || '—'}</td><td className="p-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => navigate(`/tests/builder?edit=${test.id}`)}><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Builder</Button><Button size="sm" onClick={() => void mutate(test, 'publish')} disabled={busyId === test.id}><Rocket className="mr-1.5 h-3.5 w-3.5" /> Publish now</Button><Button size="sm" variant="outline" onClick={() => void mutate(test, 'restore-draft')} disabled={busyId === test.id}><Undo2 className="mr-1.5 h-3.5 w-3.5" /> Unschedule</Button></div></td></tr>)}</tbody></table></CardContent></Card>}
    </>}
  </div>;
}

function Metric({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) { return <Card><CardContent className="p-4"><p className="text-xs uppercase text-muted-foreground">{label}</p><p className={`mt-1 text-2xl font-semibold ${danger ? 'text-destructive' : ''}`}>{value}</p></CardContent></Card>; }
