import {
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v10';

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
    const key = [...answerSequence.slice(-3), candidate].join('');
    if (!usedFourGrams.has(key)) return candidate;
  }
  return candidates[0];
}

export function buildRnkCp004ReviewPackV6(): readonly RnkCp004ExamReadyQuestion[] {
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

function clueProfileLine(question: RnkCp004ExamReadyQuestion): string {
  const profile = question.reviewMetadata.clueRoleProfile;
  const essential = profile.essentialForFullOrder === null
    ? `${profile.essentialForBlockOrder ?? 0} essential for block order`
    : `${profile.essentialForFullOrder} essential for full order`;
  return `**Clue profile:** ${profile.statementCount} statements · ${essential} · ${profile.confirmatory} confirmatory · ${profile.redundantOther} other redundant · accounted ${profile.accountedStatementCount}/${profile.statementCount}  `;
}

function metadataLine(label: string, value: number | null, unit = 'clue(s)'): string {
  return `**${label}:** ${value === null ? 'not applicable' : `${value} ${unit}`}  `;
}

export function renderRnkCp004QuestionsAndExplanationsMarkdownV6(
  questions: readonly RnkCp004ExamReadyQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Questions and Explanations — SSC/Banking Exam-Authentic English Remodel V6',
    '',
    '> Status: manual English review pending. Permanent QL allocation remains open.',
    '',
    '> V6 preserves the validated ranking graphs while remodelling contexts, clue language, explanations, difficulty and distractors for SSC and banking exam authenticity.',
    '',
    '> Student payload contains only the context, clues, question, options, learner explanation and answer. The proof metadata below is review/admin evidence.',
    '',
  ];

  questions.forEach((question, index) => {
    const metadata = question.reviewMetadata;
    const proof = metadata.proofMetrics;
    const edge = metadata.edgeContract;
    const proofCounting = metadata.proofCountingContract;
    const difficulty = metadata.difficultyModel;
    const language = metadata.languageProfile;

    lines.push(
      `## Question ${index + 1}`,
      '',
      `**Stable ID:** \`${metadata.stableQuestionId}\`  `,
      `**Prototype:** \`${question.prototypeId}\`  `,
      `**Proposed authority:** \`${metadata.authorityCandidateId}\`  `,
      `**Seed:** \`${question.seed}\`  `,
      `**Difficulty:** ${question.difficulty} · score ${difficulty.score} · model \`${difficulty.modelId}\`  `,
      `**Difficulty reasons:** ${difficulty.reasons.join(' · ')}  `,
      `**Competency:** ${metadata.competency}  `,
      `**Context family:** \`${language.contextFamily}\`  `,
      `**Clue-language profile:** ${language.reversedClueCount} reversed clue(s) · maximum phrase repeat ${language.maximumPhraseRepeat} · mixed context false  `,
      `**Explanation depth:** \`${metadata.explanationDepth}\`  `,
      `**Explanation mode:** \`${metadata.explanationMode}\`  `,
      `**Core topology:** \`${metadata.coreTopologyProfile.transitiveReductionFamily}\` · ${edge.coreReductionEdges} reduction edge(s)  `,
      `**Displayed edge breakdown:** ${edge.displayedAdjacentEdges} adjacent · ${edge.displayedNonAdjacentEdges} non-adjacent  `,
      `**Added confirmatory edges:** ${edge.addedConfirmatoryNonAdjacentEdges} non-adjacent  `,
      clueProfileLine(question),
    );

    if (proofCounting.mode === 'OPTION_AUGMENTATION') {
      lines.push(
        metadataLine('Shortest base-clue proof', proofCounting.shortestBaseClueProof),
        `**Selected option relations:** ${proofCounting.selectedOptionRelations}  `,
        metadataLine('Completed unique-order proof', proofCounting.completedProofRelations, 'relation(s)'),
      );
    } else {
      lines.push(metadataLine('Shortest answer proof', proofCounting.shortestBaseClueProof));
    }

    lines.push(
      metadataLine('Shortest directional path', proof.shortestDirectionalPathClues),
      metadataLine('Shortest exact-position proof', proof.shortestExactPositionProofClues),
      metadataLine('Full-order proof', proof.fullOrderProofClues),
      `**Learner disclosure:** \`${metadata.learnerRendererContract.disclosureComponent}\` · default closed · raw HTML ${metadata.learnerRendererContract.rawHtmlAllowed}  `,
      `**Review state:** ${metadata.reviewStatus}  `,
      '**Lifecycle:** Question Studio disabled · Question Bank NOT_STORED · Tests INELIGIBLE · Public false',
      '',
    );

    metadata.adminClueRoleNotes.forEach((note) => lines.push(`**Admin-only clue-role note:** ${note}`, ''));

    lines.push(question.stem, '');
    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });

    lines.push('', '### Explanation', '');
    question.visibleExplanation.lines.forEach((line) => lines.push(line, ''));

    if (question.visibleExplanation.optionAnalysis?.length) {
      lines.push('**Optional learner help — Why are the other options wrong? (native collapsed component in product):**', '');
      question.visibleExplanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
      lines.push('');
    }

    lines.push(`**Answer: ${question.visibleExplanation.answer}**`, '', '---', '');
  });

  return `${lines.join('\n').trim()}\n`;
}
