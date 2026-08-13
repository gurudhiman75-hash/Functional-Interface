import {
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v14';
import {
  buildRnkCp004ReviewPackV7Final,
  renderRnkCp004QuestionsAndExplanationsMarkdownV7,
  structuralShapeFingerprint,
} from './cp004-review-pack-v7-final';

export { renderRnkCp004QuestionsAndExplanationsMarkdownV7, structuralShapeFingerprint };

export function buildRnkCp004ReviewPackV7Release(): readonly RnkCp004ExamReadyQuestion[] {
  return buildRnkCp004ReviewPackV7Final().map((question) => {
    const regenerated = generateRnkCp004ExamReadyQuestion(
      question.prototypeId,
      question.seed,
      question.correctIndex,
    );
    const optionLayout = regenerated.options.map((item) => item.misconceptionId).join('>');
    const shape = structuralShapeFingerprint(regenerated);
    return {
      ...regenerated,
      reviewMetadata: {
        ...regenerated.reviewMetadata,
        normalizedSemanticFingerprint: `${regenerated.reviewMetadata.normalizedSemanticFingerprint}|OPTION_LAYOUT:${optionLayout}|STRUCTURE:${shape}|V7_RELEASE_HELP_ALIGNED`,
      },
    };
  });
}
