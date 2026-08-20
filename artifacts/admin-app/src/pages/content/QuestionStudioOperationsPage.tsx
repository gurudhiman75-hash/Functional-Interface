import { QuestionStudioCalendarReviewPanel } from './QuestionStudioCalendarReviewPanel';
import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioDifficultyMixControls } from './QuestionStudioDifficultyMixControls';
import { QuestionStudioExamProfileSummary } from './QuestionStudioExamProfileSummary';
import { QuestionStudioInputOutputReviewPanel } from './QuestionStudioInputOutputReviewPanel';
import { QuestionStudioInterestCp007ReviewPanel } from './QuestionStudioInterestCp007ReviewPanel';
import { QuestionStudioInterestReviewPanel } from './QuestionStudioInterestReviewPanel';
import { QuestionStudioProfileCalibration } from './QuestionStudioProfileCalibration';
import { QuestionStudioRecoveryDock } from './QuestionStudioRecoveryDock';
import { QuestionStudioSeriesReviewPanel } from './QuestionStudioSeriesReviewPanel';
import { QuestionStudioSpatialReviewPanel } from './QuestionStudioSpatialReviewPanel';

export function QuestionStudioOperationsPage() {
  return (
    <>
      <QuestionStudioSpatialReviewPanel />
      <QuestionStudioInterestReviewPanel />
      <QuestionStudioInterestCp007ReviewPanel />
      <QuestionStudioSeriesReviewPanel />
      <QuestionStudioCalendarReviewPanel />
      <QuestionStudioInputOutputReviewPanel />
      <QuestionStudioExamProfileSummary />
      <QuestionStudioProfileCalibration />
      <QuestionStudioDifficultyMixControls />
      <QuestionStudioCockpitPage />
      <QuestionStudioRecoveryDock />
    </>
  );
}
