import type { RnkCp004Option } from './cp004-foundation';
import {
  RNK_CP004_REMODEL_V5_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v7';

function optionAnalysis(options: readonly RnkCp004Option[]): readonly string[] {
  return options.map(
    (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
  );
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
  const wrongAnalysis = options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.answerKey !== question.answerKey)
    .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`);
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
      optionAnalysis: wrongAnalysis,
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

  RNK_CP004_REMODEL_V5_PROTOTYPE_IDS.forEach((prototypeId, prototypeIndex) => {
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

function clueProfileLine(question: RnkCp004ExamReadyQuestion): string {
  const profile = question.reviewMetadata.clueRoleProfile;
  const essentialLabel = profile.essentialForFullOrder === null
    ? `${profile.essentialForBlockOrder ?? 0} essential for block order`
    : `${profile.essentialForFullOrder} essential for full order`;
  return `**Clue profile:** ${profile.statementCount} statements · ${essentialLabel} · ${profile.confirmatory} confirmatory · ${profile.redundantOther} other redundant · accounted ${profile.accountedStatementCount}/${profile.statementCount}  `;
}

function proofContractLines(question: RnkCp004ExamReadyQuestion): readonly string[] {
  const contract = question.reviewMetadata.proofCountingContract;
  if (contract.mode === 'OPTION_AUGMENTATION') {
    return [
      `**Shortest base-clue proof:** ${contract.shortestBaseClueProof} clue(s)  `,
      `**Selected bridge relations:** ${contract.selectedOptionRelations}  `,
      `**Completed unique-order proof:** ${contract.completedProofRelations} relation(s)  `,
    ];
  }
  return [metadataLine('Shortest answer proof', contract.shortestBaseClueProof)];
}

function adminNoteLines(question: RnkCp004ExamReadyQuestion): readonly string[] {
  const notes = question.reviewMetadata.adminClueRoleNotes;
  if (notes.length === 0) return [];
  return [
    `**Admin-only clue-role note:** ${notes.join(' ')}`,
    '',
  ];
}

function optionRoleLine(question: RnkCp004ExamReadyQuestion): readonly string[] {
  if (question.displayedEvidence.query.kind !== 'VALID_RANK_STATEMENT') return [];
  return [
    `**Option-role contract:** ${question.reviewMetadata.optionRoleMetadata.map((role) => role.role).join(' · ')}  `,
  ];
}

export function renderRnkCp004QuestionsAndExplanationsMarkdown(
  questions: readonly RnkCp004ExamReadyQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Questions and Explanations — English Remodel V5',
    '',
    '> Status: manual English review pending. Permanent QL allocation remains open.',
    '',
    '> Remodel V5 separates learner explanations from admin proof metadata, gives missing-comparison proof counts an explicit option-augmentation contract, and makes the two-or-more-statements condition testable.',
    '',
    '> Product renderer contract: optional distractor help uses a native collapsed disclosure. Raw Markdown HTML is not used.',
    '',
  ];

  questions.forEach((question, index) => {
    const proof = question.reviewMetadata.proofMetrics;
    const topology = question.reviewMetadata.coreTopologyProfile;
    const edge = question.reviewMetadata.edgeContract;
    const difficulty = question.reviewMetadata.difficultyModel;
    const renderer = question.reviewMetadata.learnerRendererContract;
    lines.push(
      `## Question ${index + 1}`,
      '',
      `**Stable ID:** \`${question.reviewMetadata.stableQuestionId}\`  `,
      `**Prototype:** \`${question.prototypeId}\`  `,
      `**Seed:** \`${question.seed}\`  `,
      `**Difficulty:** ${question.difficulty} · score ${difficulty.score} · model \`${difficulty.modelId}\`  `,
      `**Competency:** ${question.reviewMetadata.competency}  `,
      `**Explanation mode:** \`${question.reviewMetadata.explanationMode}\`  `,
      `**Core topology:** \`${topology.transitiveReductionFamily}\` · ${edge.coreReductionEdges} reduction edge(s)  `,
      `**Displayed edge breakdown:** ${edge.displayedAdjacentEdges} adjacent · ${edge.displayedNonAdjacentEdges} non-adjacent  `,
      `**Added confirmatory edges:** ${edge.addedConfirmatoryNonAdjacentEdges} non-adjacent  `,
      clueProfileLine(question),
      ...proofContractLines(question),
      metadataLine('Shortest directional path', proof.shortestDirectionalPathClues),
      metadataLine('Shortest exact-position proof', proof.shortestExactPositionProofClues),
      metadataLine('Full-order proof', proof.fullOrderProofClues),
      ...optionRoleLine(question),
      `**Learner disclosure:** \`${renderer.disclosureComponent}\` · default closed · raw HTML false  `,
      `**Review state:** ${question.reviewMetadata.reviewStatus}  `,
      '**Lifecycle:** Question Studio disabled · Question Bank NOT_STORED · Tests INELIGIBLE · Public false',
      '',
      ...adminNoteLines(question),
      question.stem,
      '',
    );

    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });

    lines.push('', '### Explanation', '');
    question.visibleExplanation.lines.forEach((line) => lines.push(line, ''));

    if (question.visibleExplanation.optionAnalysis?.length) {
      lines.push(
        `**Optional learner help — ${renderer.learnerLabel} (collapsed by default in product):**`,
        '',
      );
      question.visibleExplanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
      lines.push('');
    }

    lines.push(`**Answer: ${question.visibleExplanation.answer}**`, '', '---', '');
  });

  return `${lines.join('\n').trim()}\n`;
}
