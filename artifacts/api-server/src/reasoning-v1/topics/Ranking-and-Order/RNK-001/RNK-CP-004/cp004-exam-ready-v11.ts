import type { RnkCp004Difficulty } from './cp004-foundation';
import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateFinalLanguageV6,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV6PrototypeId,
} from './cp004-exam-ready-v10';

export {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
};
export type { RnkCp004ExamReadyQuestion, RnkCp004RemodelV6PrototypeId };

function difficultyLabel(score: number): RnkCp004Difficulty {
  return score <= 6.5 ? 'EASY' : score <= 11.5 ? 'MEDIUM' : 'HARD';
}

function roundedComponentTotal(components: Record<string, number>): number {
  return Number(Object.values(components).reduce((total, value) => total + value, 0).toFixed(2));
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV6PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateFinalLanguageV6(prototypeId, seed, correctIndexOverride);
  const expectedReversedLoad = Number(
    (base.reviewMetadata.languageProfile.reversedClueCount * 1.15).toFixed(2),
  );
  const currentComponents = base.reviewMetadata.difficultyModel.components;
  if (currentComponents.reversedClueLoad === expectedReversedLoad) return base;

  const components = {
    ...currentComponents,
    reversedClueLoad: expectedReversedLoad,
  };
  const score = roundedComponentTotal(components);
  const label = difficultyLabel(score);
  const reasons = base.reviewMetadata.difficultyModel.reasons.map((reason) =>
    /reversed-wording clue/.test(reason)
      ? `${base.reviewMetadata.languageProfile.reversedClueCount} reversed-wording clue(s)`
      : reason,
  );

  return {
    ...base,
    difficulty: label,
    mathematicalFingerprint: `${base.mathematicalFingerprint}:V6_DIFFICULTY_RECONCILIATION_V1`,
    reviewMetadata: {
      ...base.reviewMetadata,
      difficultyModel: {
        ...base.reviewMetadata.difficultyModel,
        score,
        label,
        components,
        reasons,
      },
      difficultyProfile: {
        ...base.reviewMetadata.difficultyProfile,
        featureScore: score,
      },
      reasoningFeatures: {
        ...base.reviewMetadata.reasoningFeatures,
        featureScore: score,
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V6_DIFFICULTY_RECONCILIATION_V1`,
    },
  };
}
