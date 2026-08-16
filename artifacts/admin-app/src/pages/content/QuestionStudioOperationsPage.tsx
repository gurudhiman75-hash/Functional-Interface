import { QuestionStudioCockpitPage } from './QuestionStudioCockpitPage';
import { QuestionStudioDifficultyMixControls } from './QuestionStudioDifficultyMixControls';
import { QuestionStudioExamProfileSummary } from './QuestionStudioExamProfileSummary';
import { QuestionStudioProfileCalibration } from './QuestionStudioProfileCalibration';
import { QuestionStudioRecoveryDock } from './QuestionStudioRecoveryDock';
import { QuestionStudioSimplificationReviewPanel } from './QuestionStudioSimplificationReviewPanel';

export function QuestionStudioOperationsPage() {
  return (
    <>
      <QuestionStudioExamProfileSummary />
      <QuestionStudioProfileCalibration />
      <QuestionStudioDifficultyMixControls />
      <QuestionStudioSimplificationReviewPanel />
      <QuestionStudioCockpitPage />
      <QuestionStudioRecoveryDock />
    </>
  );
}
