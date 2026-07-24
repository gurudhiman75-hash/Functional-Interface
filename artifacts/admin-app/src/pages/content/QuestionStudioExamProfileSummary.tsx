import { useEffect, useMemo, useState } from 'react';
import { Clock3, Gauge, ListTree, Target } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EXAMS } from '@/data/exams';

type Profile = {
  examCode: string;
  targetTimeSeconds: number;
  calculationComplexity: 'friendly' | 'moderate' | 'intensive';
  maxReasoningSteps: number;
  defaultMix: string;
  preferredContexts: string[];
};

const PROFILES: Record<string, Profile> = {
  SSC_CGL_T1: { examCode: 'SSC_CGL_T1', targetTimeSeconds: 45, calculationComplexity: 'moderate', maxReasoningSteps: 3, defaultMix: '20% Easy · 55% Medium · 25% Hard', preferredContexts: ['marks', 'population', 'salary', 'income', 'votes'] },
  SSC_CHSL_T1: { examCode: 'SSC_CHSL_T1', targetTimeSeconds: 50, calculationComplexity: 'friendly', maxReasoningSteps: 3, defaultMix: '30% Easy · 50% Medium · 20% Hard', preferredContexts: ['marks', 'salary', 'population', 'students', 'discount'] },
  SSC_MTS: { examCode: 'SSC_MTS', targetTimeSeconds: 55, calculationComplexity: 'friendly', maxReasoningSteps: 2, defaultMix: '50% Easy · 40% Medium · 10% Hard', preferredContexts: ['students', 'population', 'price', 'marks'] },
  IBPS_PO_PRE: { examCode: 'IBPS_PO_PRE', targetTimeSeconds: 38, calculationComplexity: 'intensive', maxReasoningSteps: 4, defaultMix: '10% Easy · 45% Medium · 45% Hard', preferredContexts: ['income', 'expenditure', 'investment', 'accounts', 'profit'] },
  IBPS_CLERK_PRE: { examCode: 'IBPS_CLERK_PRE', targetTimeSeconds: 42, calculationComplexity: 'moderate', maxReasoningSteps: 3, defaultMix: '20% Easy · 55% Medium · 25% Hard', preferredContexts: ['accounts', 'salary', 'income', 'profit', 'sales'] },
  RRB_NTPC_CBT1: { examCode: 'RRB_NTPC_CBT1', targetTimeSeconds: 50, calculationComplexity: 'friendly', maxReasoningSteps: 3, defaultMix: '30% Easy · 50% Medium · 20% Hard', preferredContexts: ['passengers', 'population', 'employees', 'production', 'marks'] },
  RRB_GROUP_D: { examCode: 'RRB_GROUP_D', targetTimeSeconds: 55, calculationComplexity: 'friendly', maxReasoningSteps: 2, defaultMix: '50% Easy · 40% Medium · 10% Hard', preferredContexts: ['workers', 'passengers', 'population', 'items'] },
  PUNJAB_PSSSB_CLERK: { examCode: 'PUNJAB_PSSSB_CLERK', targetTimeSeconds: 50, calculationComplexity: 'moderate', maxReasoningSteps: 3, defaultMix: '30% Easy · 50% Medium · 20% Hard', preferredContexts: ['population', 'salary', 'agriculture', 'students', 'employees'] },
  PUNJAB_EXCISE_INSP: { examCode: 'PUNJAB_EXCISE_INSP', targetTimeSeconds: 45, calculationComplexity: 'moderate', maxReasoningSteps: 3, defaultMix: '20% Easy · 55% Medium · 25% Hard', preferredContexts: ['revenue', 'population', 'salary', 'sales', 'employees'] },
};

function detectSelectedExamCode() {
  const buttons = Array.from(document.querySelectorAll('button'));
  const exam = EXAMS.find((entry) => buttons.some((button) => button.textContent?.trim() === entry.name));
  return exam?.code ?? EXAMS[0]?.code ?? 'SSC_CGL_T1';
}

export function QuestionStudioExamProfileSummary() {
  const [examCode, setExamCode] = useState(() => EXAMS[0]?.code ?? 'SSC_CGL_T1');

  useEffect(() => {
    const update = () => setExamCode(detectSelectedExamCode());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  const exam = useMemo(() => EXAMS.find((entry) => entry.code === examCode) ?? EXAMS[0], [examCode]);
  const profile = PROFILES[examCode] ?? PROFILES.SSC_CGL_T1;

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Target exam generation profile</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">This profile now changes candidate selection, numeric style and context preference during generation.</p>
          </div>
          <Badge variant="outline">{exam?.name ?? profile.examCode} · Profile v1</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border bg-muted/20 p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="h-4 w-4" /> Target solving time</div><p className="mt-2 font-semibold">{profile.targetTimeSeconds} seconds</p></div>
          <div className="rounded-lg border bg-muted/20 p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Gauge className="h-4 w-4" /> Calculation style</div><p className="mt-2 font-semibold capitalize">{profile.calculationComplexity}</p></div>
          <div className="rounded-lg border bg-muted/20 p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><ListTree className="h-4 w-4" /> Reasoning depth</div><p className="mt-2 font-semibold">Up to {profile.maxReasoningSteps} steps</p></div>
          <div className="rounded-lg border bg-muted/20 p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="h-4 w-4" /> Default mixed profile</div><p className="mt-2 text-sm font-semibold">{profile.defaultMix}</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Preferred contexts:</span>
          {profile.preferredContexts.map((context) => <Badge key={context} variant="secondary" className="capitalize">{context}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}
