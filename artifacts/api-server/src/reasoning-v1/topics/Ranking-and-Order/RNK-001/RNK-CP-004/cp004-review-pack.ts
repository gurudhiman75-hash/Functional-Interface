import type { RnkCp004Option } from './cp004-foundation';
import {
  RNK_CP004_REMODEL_V3_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v5';

function optionAnalysis(options: readonly RnkCp004Option[]): readonly string[] {
  return options.map(
    (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
  );
}

function visibleWrongAnalysis(
  question: RnkCp004ExamReadyQuestion,
  options: readonly RnkCp004Option[],
): readonly string[] | undefined {
  if (!question.visibleExplanation.optionAnalysis) return undefined;
  if (question.visibleExplanation.optionAnalysis.length === 1) {
    return question.visibleExplanation.optionAnalysis;
  }
  return options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.answerKey !== question.answerKey)
    .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`);
}

function moveCorrectOption(
  question: RnkCp004ExamReadyQuestion,
  targetIndex: number,
): RnkCp004ExamReadyQuestion {
  if (question.options[targetIndex]?.answerKey === question.answerKey) return question;
  const correct = question.options.find((option) => option.answerKey === question.answerKey);
  if (!correct) throw new Error(`Correct option missing for ${question.reviewMetadata.stableQuestionId}`);
  const wrong = question.options.filter((option) => option.answerKey !== question.answerKey);
  const options: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === targetIndex ? correct : wrong[wrongIndex++]);
  }
  const answer = options[targetIndex].label;
  return {
    ...question,
    answer,
    options,
    correctIndex: targetIndex,
    explanation: {
      ...question.explanation,
      optionAnalysis: optionAnalysis(options),
      conclusion: `Answer: ${answer}.`,
    },
    visibleExplanation: {
      ...question.visibleExplanation,
      answer,
      optionAnalysis: visibleWrongAnalysis(question, options),
    },
  };
}

function addOptionLayoutFingerprint(question: RnkCp004ExamReadyQuestion): RnkCp004ExamReadyQuestion {
  const layout = question.options.map((option) => option.misconceptionId).join('>');
  return {
    ...question,
    reviewMetadata: {
      ...question.reviewMetadata,
      normalizedSemanticFingerprint: `${question.reviewMetadata.normalizedSemanticFingerprint}|OPTION_LAYOUT:${layout}`,
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
    const fourGram = [...answerSequence.slice(-3), candidate].join('');
    if (!usedFourGrams.has(fourGram)) return candidate;
  }
  return candidates[0];
}

export function buildRnkCp004ReviewPack(): readonly RnkCp004ExamReadyQuestion[] {
  const questions: RnkCp004ExamReadyQuestion[] = [];
  const fingerprints = new Set<string>();
  const usedSeeds = new Set<number>();
  const answerSequence: number[] = [];
  const answerCounts = [0, 0, 0, 0];
  const usedFourGrams = new Set<string>();

  RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.forEach((prototypeId, prototypeIndex) => {
    let accepted = 0;
    let candidateSeed = prototypeIndex * 1000;
    while (accepted < 6) {
      const targetIndex = chooseCorrectIndex(
        answerSequence,
        answerCounts,
        usedFourGrams,
        prototypeIndex + accepted + candidateSeed,
      );
      const generated = generateRnkCp004ExamReadyQuestion(prototypeId, candidateSeed, targetIndex);
      const question = addOptionLayoutFingerprint(moveCorrectOption(generated, targetIndex));
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

function metadataLine(label: string, value: number | null): string {
  return `**${label}:** ${value === null ? 'not applicable' : `${value} clue(s)`}  `;
}

export function renderRnkCp004QuestionsAndExplanationsMarkdown(
  questions: readonly RnkCp004ExamReadyQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Questions and Explanations — English Remodel V3',
    '',
    '> Status: manual English review pending. Permanent QL allocation remains open.',
    '',
    '> Remodel V3 separates direction-only pair order from exact rank difference and distinguishes directional-path proof from exact-position proof.',
    '',
  ];

  questions.forEach((question, index) => {
    const features = question.reviewMetadata.reasoningFeatures;
    const proof = question.reviewMetadata.proofMetrics;
    const topology = question.reviewMetadata.topologyProfile;
    lines.push(
      `## Question ${index + 1}`,
      '',
      `**Stable ID:** \`${question.reviewMetadata.stableQuestionId}\`  `,
      `**Prototype:** \`${question.prototypeId}\`  `,
      `**Seed:** \`${question.seed}\`  `,
      `**Difficulty:** ${question.difficulty}  `,
      `**Competency:** ${question.reviewMetadata.competency}  `,
      `**Explanation mode:** \`${question.reviewMetadata.explanationMode}\`  `,
      `**Topology:** \`${topology.family}\` · ${topology.adjacentClueCount} adjacent · ${topology.nonAdjacentClueCount} non-adjacent clue(s)  `,
      `**Clue profile:** ${features.essentialClueCount} essential · ${features.redundantClueCount} redundant  `,
      metadataLine('Shortest directional path', proof.shortestDirectionalPathClues),
      metadataLine('Shortest exact-position proof', proof.shortestExactPositionProofClues),
      metadataLine('Full-order proof', proof.fullOrderProofClues),
      `**Review state:** ${question.reviewMetadata.reviewStatus}  `,
      '**Lifecycle:** Question Studio disabled · Question Bank NOT_STORED · Tests INELIGIBLE · Public false',
      '',
      question.stem,
      '',
    );

    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });

    lines.push('', '### Explanation', '');
    question.visibleExplanation.lines.forEach((line) => lines.push(line, ''));

    if (question.visibleExplanation.optionAnalysis?.length) {
      lines.push('**Why the other options fail:**', '');
      question.visibleExplanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
      lines.push('');
    }

    lines.push(`**Answer: ${question.visibleExplanation.answer}**`, '', '---', '');
  });

  return `${lines.join('\n').trim()}\n`;
}
