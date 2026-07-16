import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Database, Loader2, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getLiveApprovedQuestions,
  reconcileApprovedQuestions,
  type LiveApprovedQuestion,
} from '@/features/question-bank/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

export function LiveApprovedQuestions() {
  const { hasPermission } = useAdminPermissions();
  const canReconcile = hasPermission('content.generation.review');
  const [questions, setQuestions] = useState<LiveApprovedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (canReconcile) await reconcileApprovedQuestions();
      const result = await getLiveApprovedQuestions();
      setQuestions(result.questions);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load approved questions.');
    } finally {
      setLoading(false);
    }
  }, [canReconcile]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Card className="mb-5 border-success/30">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4 text-success" /> Live approved questions
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Canonical Question Bank records created from approved generation items.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>
        ) : loading ? (
          <div className="flex min-h-24 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading live Question Bank…
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
            No approved Question Bank records yet. Approve a generated question and refresh this page.
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question) => {
              const correctKey = typeof question.answerModel?.correctOptionKey === 'string'
                ? question.answerModel.correctOptionKey
                : '';
              return (
                <div key={question.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{question.publicCode}</Badge>
                    <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
                      <CheckCircle2 className="h-3 w-3" /> Approved
                    </Badge>
                    <Badge variant="secondary">{question.difficulty}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-foreground">{question.stem}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={option.isCorrect
                          ? 'rounded-md border border-success/40 bg-success/5 px-3 py-2 text-sm'
                          : 'rounded-md border px-3 py-2 text-sm'}
                      >
                        <span className="mr-2 font-semibold">{option.key}.</span>{option.text}
                        {(option.isCorrect || option.key === correctKey) && (
                          <span className="ml-2 text-xs font-medium text-success">Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
