import { QuestionStudioAlgebraReviewPanel } from './QuestionStudioAlgebraReviewPanel';
import { QuestionStudioCalendarReviewPanel } from './QuestionStudioCalendarReviewPanel';
import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioComputerAwarenessReviewPanel } from './QuestionStudioComputerAwarenessReviewPanel';
import { QuestionStudioDataSufficiencyReviewPanel } from './QuestionStudioDataSufficiencyReviewPanel';
import { QuestionStudioDifficultyMixControls } from './QuestionStudioDifficultyMixControls';
import { QuestionStudioExamProfileSummary } from './QuestionStudioExamProfileSummary';
import { QuestionStudioInputOutputReviewPanel } from './QuestionStudioInputOutputReviewPanel';
import { QuestionStudioInterestReviewPanel } from './QuestionStudioInterestReviewPanel';
import { QuestionStudioProfileCalibration } from './QuestionStudioProfileCalibration';
import { QuestionStudioRecoveryDock } from './QuestionStudioRecoveryDock';
import { QuestionStudioSeriesReviewPanel } from './QuestionStudioSeriesReviewPanel';
import { QuestionStudioSpatialReviewPanel } from './QuestionStudioSpatialReviewPanel';
import { QuestionStudioStatementAssumptionReviewPanel } from './QuestionStudioStatementAssumptionReviewPanel';

export function QuestionStudioOperationsPage() {
  return (
    <>
      <QuestionStudioComputerAwarenessReviewPanel />
      <QuestionStudioDataSufficiencyReviewPanel />
      <QuestionStudioAlgebraReviewPanel />
      <QuestionStudioSpatialReviewPanel />
      <QuestionStudioInterestReviewPanel />
      <QuestionStudioSeriesReviewPanel />
      <QuestionStudioCalendarReviewPanel />
      <QuestionStudioInputOutputReviewPanel />
      <QuestionStudioStatementAssumptionReviewPanel />
      <QuestionStudioExamProfileSummary />
      <QuestionStudioProfileCalibration />
      <QuestionStudioDifficultyMixControls />
      <QuestionStudioCockpitPage />
      <QuestionStudioRecoveryDock />
    </>
  );
}
