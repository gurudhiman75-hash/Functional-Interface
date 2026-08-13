import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateReconciledV6,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV6PrototypeId,
} from './cp004-exam-ready-v11';

export {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
};
export type { RnkCp004ExamReadyQuestion, RnkCp004RemodelV6PrototypeId };

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV6PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateReconciledV6(prototypeId, seed, correctIndexOverride);
  if (base.displayedEvidence.query.kind !== 'LOWEST_ENTITY') return base;

  return {
    ...base,
    visibleExplanation: {
      ...base.visibleExplanation,
      optionAnalysis: [
        'The other options occupy higher positions in the completed order, so none is lowest.',
      ],
    },
    mathematicalFingerprint: `${base.mathematicalFingerprint}:V6_LOWEST_WORDING_FIX_V1`,
    reviewMetadata: {
      ...base.reviewMetadata,
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V6_LOWEST_WORDING_FIX_V1`,
    },
  };
}
