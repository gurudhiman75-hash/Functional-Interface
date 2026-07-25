import { useEffect, useState } from 'react';
import { Download, FileJson, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const fmt = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';

type ExportHistoryRow = {
  id: string;
  attemptId: string;
  reason: string;
  occurredAt: string;
  actorName: string | null;
  registrationCode: string | null;
  testPublicCode: string | null;
  testTitle: string | null;
  fileName: string | null;
};

async function token(): Promise<string> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  return user.getIdToken();
}

export function AttemptExportsPage() {
  const [attemptId, setAttemptId] = useState('');
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState<ExportHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/admin/attempts/exports`, {
        headers: { Authorization: `Bearer ${await token()}` },
      });
      const body = await response.json().catch(() => null) as { exports?: ExportHistoryRow[]; error?: string } | null;
      if (!response.ok) throw new Error(body?.error || `Export history request failed (${response.status}).`);
      setHistory(body?.exports ?? []);
    } catch (error) {
      showToast.error('Unable to load export history', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadHistory(); }, []);

  const exportEvidence = async () => {
    const normalizedAttemptId = attemptId.trim();
    const normalizedReason = reason.trim();
    if (!normalizedAttemptId) return showToast.warning('Attempt ID required', 'Enter the canonical attempt UUID.');
    if (normalizedReason.length < 20) return showToast.warning('Detailed reason required', 'Enter at least 20 characters explaining the support or compliance purpose.');

    setExporting(true);
    try {
      const response = await fetch(`${apiBase}/admin/attempts/${encodeURIComponent(normalizedAttemptId)}/exports`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await token()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: normalizedReason }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error || `Attempt export failed (${response.status}).`);
      }
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') || '';
      const name = disposition.match(/filename="([^"]+)"/)?.[1] || `examtree-attempt-${normalizedAttemptId}.json`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showToast.success('Evidence package exported', 'The privacy-scoped JSON package was downloaded and the action was recorded in the immutable audit log.');
      setReason('');
      await loadHistory();
    } catch (error) {
      showToast.error('Unable to export attempt evidence', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setExporting(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Attempt Evidence Exports"
      description="Create audited, privacy-scoped support and compliance packages without changing scores, responses or result snapshots."
      icon={<FileJson className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void loadHistory()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>}
    />

    <Card><CardContent className="space-y-4 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><p className="mb-1.5 text-sm font-medium">Canonical attempt UUID</p><Input value={attemptId} onChange={(event) => setAttemptId(event.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" /></div>
        <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">The package includes canonical attempt, student, publication, integrity, investigation and audit evidence. Authentication identities, sessions, tokens, payments and entitlements are excluded.</div>
      </div>
      <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required support, investigation or compliance purpose (minimum 20 characters)." />
      <Button onClick={() => void exportEvidence()} disabled={exporting || !attemptId.trim() || reason.trim().length < 20}><Download className="mr-1.5 h-4 w-4" />{exporting ? 'Preparing export…' : 'Export JSON evidence package'}</Button>
      <p className="text-xs text-muted-foreground">Every export is recorded as an immutable audit event. Exporting does not authorize score correction or attempt mutation.</p>
    </CardContent></Card>

    <Card><CardContent className="p-0">
      <Table><TableHeader><TableRow><TableHead>Attempt</TableHead><TableHead>Student / test</TableHead><TableHead>Exported by</TableHead><TableHead>Purpose</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
        <TableBody>{history.length ? history.map((entry) => <TableRow key={entry.id}>
          <TableCell className="font-mono text-xs">{entry.attemptId}</TableCell>
          <TableCell><div className="font-medium">{entry.registrationCode || 'Unknown student'}</div><div className="text-xs text-muted-foreground">{entry.testTitle || entry.testPublicCode || 'Unknown test'}</div></TableCell>
          <TableCell>{entry.actorName || 'System'}</TableCell>
          <TableCell className="max-w-md text-sm text-muted-foreground">{entry.reason}</TableCell>
          <TableCell className="text-xs text-muted-foreground">{fmt(entry.occurredAt)}</TableCell>
        </TableRow>) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">{loading ? 'Loading export history…' : 'No attempt evidence exports have been recorded.'}</TableCell></TableRow>}</TableBody>
      </Table>
    </CardContent></Card>
  </div>;
}

export default AttemptExportsPage;
