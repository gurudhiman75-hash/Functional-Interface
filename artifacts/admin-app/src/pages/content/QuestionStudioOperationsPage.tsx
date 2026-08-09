import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioDifficultyMixControls } from './QuestionStudioDifficultyMixControls';
import { QuestionStudioExamProfileSummary } from './QuestionStudioExamProfileSummary';
import { QuestionStudioProfileCalibration } from './QuestionStudioProfileCalibration';
import { QuestionStudioReasoningReviewPanel } from './QuestionStudioReasoningReviewPanel';
import { QuestionStudioRecoveryDock } from './QuestionStudioRecoveryDock';

export function QuestionStudioOperationsPage() {
  return (
    <>
      <QuestionStudioReasoningReviewPanel />
      <QuestionStudioExamProfileSummary />
      <QuestionStudioProfileCalibration />
      <QuestionStudioDifficultyMixControls />
      <QuestionStudioCockpitPage />
      <QuestionStudioRecoveryDock />
    </>
  );
}
