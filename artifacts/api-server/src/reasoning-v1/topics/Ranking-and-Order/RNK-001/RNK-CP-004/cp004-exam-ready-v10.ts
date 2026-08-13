import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generatePhraseSafeV6,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV6PrototypeId,
} from './cp004-exam-ready-v9';

export {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
};
export type { RnkCp004ExamReadyQuestion, RnkCp004RemodelV6PrototypeId };

function finalDifficultyReverse(
  family: RnkCp004ExamReadyQuestion['reviewMetadata']['languageProfile']['contextFamily'],
  higher: string,
  lower: string,
): string {
  switch (family) {
    case 'SELECTION_TEST': return `${lower} received a lower selection rank than ${higher}.`;
    case 'MERIT_LIST': return `${lower} appeared later than ${higher} in the merit order.`;
    case 'COMPETITION_STANDINGS': return `${lower} finished in a lower position than ${higher}.`;
    case 'PERFORMANCE_REVIEW': return `${lower} received a lower assessment rank than ${higher}.`;
    case 'INTERVIEW_SHORTLIST': return `${lower} appeared below ${higher} in the final shortlist.`;
    case 'NEUTRAL_RANKING': return `${lower} occupies a position below ${higher}.`;
  }
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV6PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generatePhraseSafeV6(prototypeId, seed, correctIndexOverride);
  if (base.difficulty === 'EASY' || base.reviewMetadata.languageProfile.reversedClueCount > 0) {
    return base;
  }

  const clue = base.displayedEvidence.clues[0];
  const family = base.reviewMetadata.languageProfile.contextFamily;
  const lines = base.stem.split('\n');
  const firstBulletIndex = lines.findIndex((line) => line.startsWith('- '));
  if (firstBulletIndex < 0) throw new Error(`Cannot locate first clue at ${prototypeId}:${seed}`);
  lines[firstBulletIndex] = `- ${finalDifficultyReverse(family, clue.higher, clue.lower)}`;
  const templateIds = [...base.reviewMetadata.languageProfile.clueTemplateIds];
  templateIds[0] = `${family}:FINAL_DIFFICULTY_REVERSE`;

  return {
    ...base,
    stem: lines.join('\n'),
    mathematicalFingerprint: `${base.mathematicalFingerprint}:V6_FINAL_DIFFICULTY_LANGUAGE_V1`,
    reviewMetadata: {
      ...base.reviewMetadata,
      languageProfile: {
        ...base.reviewMetadata.languageProfile,
        clueTemplateIds: templateIds,
        reversedClueCount: 1,
      },
      difficultyModel: {
        ...base.reviewMetadata.difficultyModel,
        reasons: base.reviewMetadata.difficultyModel.reasons.map((reason) =>
          /reversed-wording clue/.test(reason) ? '1 reversed-wording clue(s)' : reason),
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V6_FINAL_DIFFICULTY_LANGUAGE_V1`,
    },
  };
}
