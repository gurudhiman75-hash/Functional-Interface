import {
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v11';
import { renderRnkCp004QuestionsAndExplanationsMarkdownV6 } from './cp004-review-pack-v6';

export { renderRnkCp004QuestionsAndExplanationsMarkdownV6 };

function addOptionLayoutFingerprint(question: RnkCp004ExamReadyQuestion): RnkCp004ExamReadyQuestion {
  const layout = question.options.map((option) => option.misconceptionId).join('>');
  return {
    ...question,
    reviewMetadata: {
      ...question.reviewMetadata,
      normalizedSemanticFingerprint: `${question.reviewMetadata.normalizedSemanticFingerprint}|FINAL_OPTION_LAYOUT:${layout}`,
    },
  };
}

function chooseCorrectIndex(
  answerSequence: readonly number[],
  counts: readonly number[],
  usedFourGrams: ReadonlySet<string>,
  salt: number,
): number {
  const candidates = [0, 1, 2, 3].sort((left, right) => {
    const countDifference = counts[left] - counts[right];
    if (countDifference !== 0) return countDifference;
    return ((left + salt) % 4) - ((right + salt) % 4);
  });
  for (const candidate of candidates) {
    if (answerSequence.length < 3) return candidate;
    const key = [...answerSequence.slice(-3), candidate].join('');
    if (!usedFourGrams.has(key)) return candidate;
  }
  return candidates[0];
}

export function buildRnkCp004ReviewPackV6Final(): readonly RnkCp004ExamReadyQuestion[] {
  const questions: RnkCp004ExamReadyQuestion[] = [];
  const fingerprints = new Set<string>();
  const usedSeeds = new Set<number>();
  const answerSequence: number[] = [];
  const answerCounts = [0, 0, 0, 0];
  const usedFourGrams = new Set<string>();

  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS.forEach((prototypeId, prototypeIndex) => {
    let accepted = 0;
    let candidateSeed = prototypeIndex * 1000;
    while (accepted < 6) {
      const targetIndex = chooseCorrectIndex(
        answerSequence,
        answerCounts,
        usedFourGrams,
        prototypeIndex + accepted + candidateSeed,
      );
      const question = addOptionLayoutFingerprint(
        generateRnkCp004ExamReadyQuestion(prototypeId, candidateSeed, targetIndex),
      );
      candidateSeed += 1;
      if (usedSeeds.has(question.seed)) continue;
      if (fingerprints.has(question.reviewMetadata.normalizedSemanticFingerprint)) continue;

      if (answerSequence.length >= 3) {
        const fourGram = [...answerSequence.slice(-3), targetIndex].join('');
        if (usedFourGrams.has(fourGram)) continue;
        usedFourGrams.add(fourGram);
      }

      fingerprints.add(question.reviewMetadata.normalizedSemanticFingerprint);
      usedSeeds.add(question.seed);
      answerSequence.push(targetIndex);
      answerCounts[targetIndex] += 1;
      questions.push(question);
      accepted += 1;
    }
  });

  return questions;
}
