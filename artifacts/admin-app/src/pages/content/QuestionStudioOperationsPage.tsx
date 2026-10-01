import { useState, type ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { QuestionStudioAlgebraReviewPanel } from './QuestionStudioAlgebraReviewPanel';
import { QuestionStudioCalendarReviewPanel } from './QuestionStudioCalendarReviewPanel';
import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioCom003PreviewPanel } from './QuestionStudioCom003PreviewPanel';
import { QuestionStudioCom003ReviewPanel } from './QuestionStudioCom003ReviewPanel';
import { QuestionStudioComputerAwarenessReviewPanel } from './QuestionStudioComputerAwarenessReviewPanel';
import { QuestionStudioCubesDiceReviewPanel } from './QuestionStudioCubesDiceReviewPanel';
import { QuestionStudioDataSufficiencyReviewPanel } from './QuestionStudioDataSufficiencyReviewPanel';
import { QuestionStudioDifficultyMixControls } from './QuestionStudioDifficultyMixControls';
import { QuestionStudioEnglishReviewPanel } from './QuestionStudioEnglishReviewPanel';
import { QuestionStudioExamProfileSummary } from './QuestionStudioExamProfileSummary';
import { QuestionStudioInputOutputReviewPanel } from './QuestionStudioInputOutputReviewPanel';
import { QuestionStudioInterestReviewPanel } from './QuestionStudioInterestReviewPanel';
import { QuestionStudioProfileCalibration } from './QuestionStudioProfileCalibration';
import { QuestionStudioRecoveryDock } from './QuestionStudioRecoveryDock';
import { QuestionStudioSeriesReviewPanel } from './QuestionStudioSeriesReviewPanel';
import { QuestionStudioSpatialReviewPanel } from './QuestionStudioSpatialReviewPanel';
import { QuestionStudioStatementAssumptionReviewPanel } from './QuestionStudioStatementAssumptionReviewPanel';

type AdvancedWorkspace =
  | 'english'
  | 'computer-awareness'
  | 'com003'
  | 'data-sufficiency'
  | 'algebra'
  | 'spatial'
  | 'cubes-dice'
  | 'interest'
  | 'series'
  | 'calendar'
  | 'input-output'
  | 'statement-assumption';

const ADVANCED_WORKSPACES: Array<{
  value: AdvancedWorkspace;
  label: string;
  group: string;
}> = [
  { value: 'algebra', label: 'Algebra', group: 'Quantitative Aptitude' },
  { value: 'interest', label: 'Interest', group: 'Quantitative Aptitude' },
  { value: 'data-sufficiency', label: 'Data Sufficiency', group: 'Reasoning' },
  { value: 'spatial', label: 'Spatial Reasoning', group: 'Reasoning' },
  { value: 'cubes-dice', label: 'Cubes & Dice', group: 'Reasoning' },
  { value: 'series', label: 'Series', group: 'Reasoning' },
  { value: 'calendar', label: 'Calendar', group: 'Reasoning' },
  { value: 'input-output', label: 'Input / Output', group: 'Reasoning' },
  { value: 'statement-assumption', label: 'Statement & Assumption', group: 'Reasoning' },
  { value: 'english', label: 'English', group: 'English' },
  { value: 'computer-awareness', label: 'Computer Awareness', group: 'Computer' },
  { value: 'com003', label: 'COM-003', group: 'Computer' },
];

export function QuestionStudioOperationsPage() {
  const [advancedWorkspace, setAdvancedWorkspace] = useState<AdvancedWorkspace>('algebra');

  return (
    <Tabs defaultValue="workspace" className="space-y-4">
      <div className="sticky top-0 z-20 -mx-1 overflow-x-auto bg-background/95 px-1 pb-1 pt-1 backdrop-blur">
        <TabsList className="h-auto w-max min-w-full justify-start gap-1 p-1 sm:min-w-0">
          <TabsTrigger value="workspace">Generate & review</TabsTrigger>
          <TabsTrigger value="advanced">Advanced controls</TabsTrigger>
          <TabsTrigger value="calibration">Profiles & calibration</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="workspace" className="mt-0">
        <QuestionStudioCockpitPage />
      </TabsContent>

      <TabsContent value="advanced" className="mt-0 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Engine-specific advanced controls</CardTitle>
            <p className="text-xs text-muted-foreground">
              Normal generation and review for registered Quant, Reasoning, English and Static GK content belongs in Generate & review.
              Use this area only for bespoke previews, diagnostics or chapter-specific controls that are not represented by the standard workflow.
            </p>
          </CardHeader>
          <CardContent>
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Advanced workspace</p>
              <Select
                value={advancedWorkspace}
                onValueChange={(value) => setAdvancedWorkspace(value as AdvancedWorkspace)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADVANCED_WORKSPACES.map((entry) => (
                    <SelectItem key={entry.value} value={entry.value}>
                      {entry.group} · {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <AdvancedPanel workspace={advancedWorkspace} />
      </TabsContent>

      <TabsContent value="calibration" className="mt-0 space-y-4">
        <SectionIntro
          title="Profiles & calibration"
          description="Tune exam profiles and difficulty behaviour here. These controls are configuration tools, not part of the normal generation-review loop."
        />
        <QuestionStudioExamProfileSummary />
        <QuestionStudioProfileCalibration />
        <QuestionStudioDifficultyMixControls />
      </TabsContent>

      <TabsContent value="recovery" className="mt-0">
        <QuestionStudioRecoveryDock embedded />
      </TabsContent>
    </Tabs>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
    </Card>
  );
}

function AdvancedPanel({ workspace }: { workspace: AdvancedWorkspace }) {
  const panels: Record<AdvancedWorkspace, ReactNode> = {
    english: <QuestionStudioEnglishReviewPanel />,
    'computer-awareness': <QuestionStudioComputerAwarenessReviewPanel />,
    com003: (
      <div className="space-y-4">
        <QuestionStudioCom003PreviewPanel />
        <QuestionStudioCom003ReviewPanel />
      </div>
    ),
    'data-sufficiency': <QuestionStudioDataSufficiencyReviewPanel />,
    algebra: <QuestionStudioAlgebraReviewPanel />,
    spatial: <QuestionStudioSpatialReviewPanel />,
    'cubes-dice': <QuestionStudioCubesDiceReviewPanel />,
    interest: <QuestionStudioInterestReviewPanel />,
    series: <QuestionStudioSeriesReviewPanel />,
    calendar: <QuestionStudioCalendarReviewPanel />,
    'input-output': <QuestionStudioInputOutputReviewPanel />,
    'statement-assumption': <QuestionStudioStatementAssumptionReviewPanel />,
  };

  return <>{panels[workspace]}</>;
}
