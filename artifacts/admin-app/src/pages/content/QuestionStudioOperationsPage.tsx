import { QuestionStudioCalendarReviewPanel } from './QuestionStudioCalendarReviewPanel';
import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioDifficultyMixControls } from './QuestionStudioDifficultyMixControls';
import { QuestionStudioExamProfileSummary } from './QuestionStudioExamProfileSummary';
import { QuestionStudioInterestReviewPanel } from './QuestionStudioInterestReviewPanel';
import { QuestionStudioMensurationReviewPanel } from './QuestionStudioMensurationReviewPanel';
import { QuestionStudioProbabilityReviewPanel } from './QuestionStudioProbabilityReviewPanel';
import { QuestionStudioProfileCalibration } from './QuestionStudioProfileCalibration';
import { QuestionStudioReasoningReviewPanel } from './QuestionStudioReasoningReviewPanel';
import { QuestionStudioRecoveryDock } from './QuestionStudioRecoveryDock';
import { QuestionStudioSeriesReviewPanel } from './QuestionStudioSeriesReviewPanel';

export function QuestionStudioOperationsPage() {
  return (
    <>
      <QuestionStudioMensurationReviewPanel />
      <QuestionStudioProbabilityReviewPanel />
      <QuestionStudioInterestReviewPanel />
      <QuestionStudioSeriesReviewPanel />
      <QuestionStudioCalendarReviewPanel />
      <QuestionStudioReasoningReviewPanel />
      <QuestionStudioExamProfileSummary />
      <QuestionStudioProfileCalibration />
      <QuestionStudioDifficultyMixControls />
      <QuestionStudioCockpitPage />
      <QuestionStudioRecoveryDock />
    </>
  );
}
