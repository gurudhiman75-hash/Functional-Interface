import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Braces, Languages, LockKeyhole, ShieldCheck } from 'lucide-react';

export function QuestionStudioOpsStatus() {
  return (
    <Card className="border-primary/20 bg-primary/[0.025]">
      <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">OPS-001 Reasoning integration active</p>
            <Badge variant="outline" className="border-success/30 bg-success/5 text-success">
              <ShieldCheck className="mr-1 h-3 w-3" /> Frozen runtime
            </Badge>
            <Badge variant="outline" className="border-warning/30 bg-warning/5 text-warning">
              <LockKeyhole className="mr-1 h-3 w-3" /> Internal only
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Mathematical Operations and Symbol Substitution is available for generation, review,
            revision, regeneration and Question Bank conversion. Public publication remains disabled.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary"><Braces className="mr-1 h-3 w-3" /> 31 permanent QLs · 9 checkpoints</Badge>
          <Badge variant="secondary"><Languages className="mr-1 h-3 w-3" /> English · Hindi · Punjabi</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
