import { AlertTriangle, Clipboard, ExternalLink, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { adminApiErrorDetails, toAdminApiError } from '@/lib/admin-api-error';

export function AdminErrorAlert({
  error,
  title = 'Request failed',
  onRetry,
  affectedRecord,
}: {
  error: unknown;
  title?: string;
  onRetry?: () => void | Promise<void>;
  affectedRecord?: string | null;
}) {
  const navigate = useNavigate();
  const parsed = toAdminApiError(error);
  const record = affectedRecord ?? parsed.affectedRecord;
  const details = adminApiErrorDetails({ ...parsed, affectedRecord: record });

  const copy = () => {
    void navigator.clipboard.writeText(details).then(
      () => showToast.success('Technical details copied', parsed.correlationId || parsed.message),
      () => showToast.error('Copy failed', 'Your browser blocked clipboard access.'),
    );
  };

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-destructive">{title}</p>
          <p className="mt-1 text-muted-foreground">{parsed.message}</p>
          <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            {parsed.code && <p><span className="font-medium text-foreground">Code:</span> {parsed.code}</p>}
            {parsed.status !== null && <p><span className="font-medium text-foreground">HTTP:</span> {parsed.status}</p>}
            {record && <p><span className="font-medium text-foreground">Record:</span> {record}</p>}
            {parsed.correlationId && <p className="break-all"><span className="font-medium text-foreground">Correlation:</span> {parsed.correlationId}</p>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {onRetry && <Button size="sm" variant="outline" onClick={() => void onRetry()}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry</Button>}
            <Button size="sm" variant="outline" onClick={copy}><Clipboard className="mr-1.5 h-3.5 w-3.5" /> Copy details</Button>
            {parsed.correlationId && (
              <Button size="sm" onClick={() => navigate(`/analytics/request-failures?correlation=${encodeURIComponent(parsed.correlationId!)}`)}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open Request Failures
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
