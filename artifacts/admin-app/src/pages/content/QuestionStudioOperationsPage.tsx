import { QuestionStudioAlgebraReviewPanel } from './QuestionStudioAlgebraReviewPanel';
import { QuestionStudioCalendarReviewPanel } from './QuestionStudioCalendarReviewPanel';
import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioCom003PreviewPanel } from './QuestionStudioCom003PreviewPanel';
import { QuestionStudioCom003ReviewPanel } from './QuestionStudioCom003ReviewPanel';
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
      <QuestionStudioCom003PreviewPanel />
      <QuestionStudioCom003ReviewPanel />
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
