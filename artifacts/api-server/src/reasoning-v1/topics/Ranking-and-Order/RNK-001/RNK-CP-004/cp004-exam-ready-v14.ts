import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V3_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV7,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV7PrototypeId,
} from './cp004-exam-ready-v13';

export {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V3_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  countTopologicalOrders,
};
export type { RnkCp004ExamReadyQuestion, RnkCp004RemodelV7PrototypeId };

function naturalExplanation(text: string): string {
  return text
    .replace(/\bpersons lie\b/g, 'people lie')
    .replace(/\b1 people lie\b/g, '1 person lies')
    .replace(/[.]+$/g, '');
}

function optionSpecificHelp(
  question: RnkCp004ExamReadyQuestion,
): readonly string[] | null {
  const query = question.displayedEvidence.query;
  const remappedPair = query.kind === 'RELATIVE_ORDER_OF_PAIR';
  if (!remappedPair) return null;
  return question.options
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.answerKey !== question.answerKey)
    .map(({ item, index }) =>
      `Option ${String.fromCharCode(65 + index)}: ${naturalExplanation(item.explanation)}.`,
    );
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV7PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV7(prototypeId, seed, correctIndexOverride);
  const help = optionSpecificHelp(base);
  if (!help) return base;

  return {
    ...base,
    visibleExplanation: {
      ...base.visibleExplanation,
      optionAnalysis: help,
    },
    mathematicalFingerprint: `${base.mathematicalFingerprint}:V7_OPTION_HELP_ALIGNMENT_V1`,
    reviewMetadata: {
      ...base.reviewMetadata,
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V7_OPTION_HELP_ALIGNMENT_V1`,
    },
  };
}
