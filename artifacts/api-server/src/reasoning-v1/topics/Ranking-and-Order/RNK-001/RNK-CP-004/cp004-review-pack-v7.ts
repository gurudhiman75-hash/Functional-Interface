import { reconstructUniqueOrder, type RnkCp004Comparison } from './cp004-foundation';
import {
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV7PrototypeId,
} from './cp004-exam-ready-v13';

const CONTEXTS = [
  'SELECTION_TEST',
  'MERIT_LIST',
  'COMPETITION_STANDINGS',
  'PERFORMANCE_REVIEW',
  'INTERVIEW_SHORTLIST',
  'NEUTRAL_RANKING',
] as const;

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function solvedOrder(question: RnkCp004ExamReadyQuestion): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === question.answerKey);
  if (!bridge) throw new Error(`Missing bridge at ${question.reviewMetadata.stableQuestionId}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function queryShape(question: RnkCp004ExamReadyQuestion, order: readonly string[]): string {
  const query = question.displayedEvidence.query;
  const index = new Map(order.map((entity, position) => [entity, position]));
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'HIGHEST';
    case 'LOWEST_ENTITY': return 'LOWEST';
    case 'ENTITY_AT_EXACT_RANK': return `ENTITY_AT:${query.rankFromTop}`;
    case 'RANK_OF_NAMED_ENTITY': return `RANK_OF:${index.get(query.target)}`;
    case 'MIDDLE_ENTITY': return 'MIDDLE';
    case 'COMPLETE_ORDER': return 'COMPLETE';
    case 'RELATIVE_ORDER_OF_PAIR':
      return `PAIR:${index.get(query.first)}:${index.get(query.second)}`;
    case 'IMMEDIATE_NEIGHBOUR':
      return `NEIGHBOUR:${index.get(query.target)}:${query.direction}`;
    case 'VALID_RANK_STATEMENT': {
      const [higher, lower] = question.answerKey.split('>');
      return `TRUE:${index.get(higher)}:${index.get(lower)}`;
    }
    case 'MISSING_COMPARISON': {
      const [higher, lower] = question.answerKey.split('>');
      return `BRIDGE:${index.get(higher)}:${index.get(lower)}`;
    }
  }
}

export function structuralShapeFingerprint(question: RnkCp004ExamReadyQuestion): string {
  const order = solvedOrder(question);
  const index = new Map(order.map((entity, position) => [entity, position]));
  const clueShape = question.displayedEvidence.clues
    .map((clue) => `${index.get(clue.higher)}>${index.get(clue.lower)}`)
    .sort()
    .join(',');
  const roles = question.reviewMetadata.optionRoleMetadata
    .map((role) => role.role)
    .sort()
    .join(',');
  return [
    question.prototypeId,
    `N${order.length}`,
    clueShape,
    queryShape(question, order),
    `R${question.reviewMetadata.clueRoleProfile.confirmatory}`,
    roles,
  ].join('|');
}

function addReviewFingerprint(
  question: RnkCp004ExamReadyQuestion,
): RnkCp004ExamReadyQuestion {
  const optionLayout = question.options.map((item) => item.misconceptionId).join('>');
  const shape = structuralShapeFingerprint(question);
  return {
    ...question,
    reviewMetadata: {
      ...question.reviewMetadata,
      normalizedSemanticFingerprint: `${question.reviewMetadata.normalizedSemanticFingerprint}|OPTION_LAYOUT:${optionLayout}|STRUCTURE:${shape}`,
    },
  };
}

interface Candidate {
  readonly seed: number;
  readonly question: RnkCp004ExamReadyQuestion;
  readonly shape: string;
}

function candidateScore(
  candidate: Candidate,
  selected: readonly Candidate[],
): number {
  const question = candidate.question;
  const metadata = question.reviewMetadata;
  const selectedEntities = new Set(selected.map((item) => item.question.displayedEvidence.entities.length));
  const selectedProofs = new Set(selected.map((item) => item.question.reviewMetadata.reasoningFeatures.shortestProofClueCount));
  const selectedConfirmatory = new Set(selected.map((item) => item.question.reviewMetadata.clueRoleProfile.confirmatory));
  const selectedDifficulties = new Set(selected.map((item) => item.question.difficulty));
  const selectedStems = new Set(selected.map((item) => item.question.reviewMetadata.editorialDiversityProfile.stemVariantId));
  const selectedExplanations = new Set(selected.map((item) => item.question.reviewMetadata.editorialDiversityProfile.explanationVariantId));
  let score = 0;
  if (!selectedEntities.has(question.displayedEvidence.entities.length)) score += 5;
  if (!selectedProofs.has(metadata.reasoningFeatures.shortestProofClueCount)) score += 5;
  if (!selectedConfirmatory.has(metadata.clueRoleProfile.confirmatory)) score += 5;
  if (!selectedDifficulties.has(question.difficulty)) score += 4;
  if (!selectedStems.has(metadata.editorialDiversityProfile.stemVariantId)) score += 3;
  if (!selectedExplanations.has(metadata.editorialDiversityProfile.explanationVariantId)) score += 2;
  score += Math.min(3, metadata.languageProfile.reversedClueCount);
  return score;
}

function selectPrototypeEvidence(
  prototypeId: RnkCp004RemodelV7PrototypeId,
  usedSeeds: Set<number>,
): readonly Candidate[] {
  const selected: Candidate[] = [];
  const shapes = new Set<string>();

  for (const context of CONTEXTS) {
    for (let occurrence = 0; occurrence < 2; occurrence += 1) {
      const candidates: Candidate[] = [];
      for (let seed = 0; seed < 240; seed += 1) {
        if (usedSeeds.has(seed)) continue;
        const question = generateRnkCp004ExamReadyQuestion(prototypeId, seed, 0);
        if (question.reviewMetadata.languageProfile.contextFamily !== context) continue;
        const shape = structuralShapeFingerprint(question);
        if (shapes.has(shape)) continue;
        candidates.push({ seed, question, shape });
      }
      candidates.sort((left, right) => {
        const scoreDifference = candidateScore(right, selected) - candidateScore(left, selected);
        if (scoreDifference !== 0) return scoreDifference;
        return left.seed - right.seed;
      });
      const chosen = candidates[0];
      if (!chosen) throw new Error(`Unable to select ${context} evidence for ${prototypeId}`);
      selected.push(chosen);
      shapes.add(chosen.shape);
      usedSeeds.add(chosen.seed);
    }
  }

  if (selected.length !== 12) throw new Error(`Expected 12 records for ${prototypeId}`);
  return selected;
}

function chooseCorrectIndex(
  sequence: readonly number[],
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
    if (sequence.length < 3) return candidate;
    const key = [...sequence.slice(-3), candidate].join('');
    if (!usedFourGrams.has(key)) return candidate;
  }
  return candidates[0];
}

export function buildRnkCp004ReviewPackV7(): readonly RnkCp004ExamReadyQuestion[] {
  const usedSeeds = new Set<number>();
  const byPrototype = new Map<RnkCp004RemodelV7PrototypeId, readonly Candidate[]>();
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.forEach((prototypeId) => {
    byPrototype.set(prototypeId, selectPrototypeEvidence(prototypeId, usedSeeds));
  });

  const ordered: { readonly prototypeId: RnkCp004RemodelV7PrototypeId; readonly seed: number }[] = [];
  for (let round = 0; round < 12; round += 1) {
    const rotation = round % RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length;
    for (let offset = 0; offset < RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length; offset += 1) {
      const prototypeId = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS[
        (offset + rotation) % RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length
      ];
      const candidate = byPrototype.get(prototypeId)?.[round];
      if (!candidate) throw new Error(`Missing review candidate for ${prototypeId} round ${round + 1}`);
      ordered.push({ prototypeId, seed: candidate.seed });
    }
  }

  const answerSequence: number[] = [];
  const answerCounts = [0, 0, 0, 0];
  const usedFourGrams = new Set<string>();
  const fingerprints = new Set<string>();
  const questions: RnkCp004ExamReadyQuestion[] = [];

  ordered.forEach(({ prototypeId, seed }, index) => {
    const correctIndex = chooseCorrectIndex(
      answerSequence,
      answerCounts,
      usedFourGrams,
      index + seed,
    );
    const question = addReviewFingerprint(
      generateRnkCp004ExamReadyQuestion(prototypeId, seed, correctIndex),
    );
    if (fingerprints.has(question.reviewMetadata.normalizedSemanticFingerprint)) {
      throw new Error(`Duplicate V7 review fingerprint at ${question.reviewMetadata.stableQuestionId}`);
    }
    if (answerSequence.length >= 3) {
      const fourGram = [...answerSequence.slice(-3), correctIndex].join('');
      if (usedFourGrams.has(fourGram)) throw new Error(`Repeated four-answer sequence ${fourGram}`);
      usedFourGrams.add(fourGram);
    }
    fingerprints.add(question.reviewMetadata.normalizedSemanticFingerprint);
    answerSequence.push(correctIndex);
    answerCounts[correctIndex] += 1;
    questions.push(question);
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

export function renderRnkCp004QuestionsAndExplanationsMarkdownV7(
  questions: readonly RnkCp004ExamReadyQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Questions and Explanations — Targeted SSC/Banking English Remodel V7',
    '',
    '> Status: targeted manual English review pending. Permanent QL allocation remains open.',
    '',
    '> Evidence design: 12 independently structured records per provisional authority, presented in 12 mixed-authority review batches.',
    '',
    '> Student payload contains only context, clues, question, options, explanation and answer. Review metadata remains admin-only.',
    '',
  ];

  questions.forEach((question, index) => {
    if (index % RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length === 0) {
      lines.push(`## Mixed review batch ${Math.floor(index / RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length) + 1}`, '', '---', '');
    }
    const metadata = question.reviewMetadata;
    const difficulty = metadata.difficultyModel;
    const editorial = metadata.editorialDiversityProfile;
    const shape = structuralShapeFingerprint(question);
    lines.push(
      `### Question ${index + 1}`,
      '',
      `**Stable ID:** \`${metadata.stableQuestionId}\`  `,
      `**Prototype:** \`${question.prototypeId}\`  `,
      `**Proposed authority:** \`${metadata.authorityCandidateId}\`  `,
      `**Seed:** \`${question.seed}\`  `,
      `**Difficulty:** ${question.difficulty} · score ${difficulty.score} · model \`${difficulty.modelId}\`  `,
      `**Difficulty reasons:** ${difficulty.reasons.join(' · ')}  `,
      `**Calibration rules:** ${difficulty.calibrationRules.join(' · ') || 'base thresholds'}  `,
      `**Context:** \`${metadata.languageProfile.contextFamily}\` · ${metadata.languageProfile.reversedClueCount} reversed clue(s)  `,
      `**Editorial variants:** \`${editorial.stemVariantId}\` · \`${editorial.explanationVariantId}\`  `,
      `**Option semantics:** \`${editorial.optionSemanticMode}\` · ${editorial.distractorCount} distractors / ${question.options.length} options  `,
      `**Explanation depth:** \`${metadata.explanationDepth}\`  `,
      `**Structural fingerprint:** \`${shape}\`  `,
      clueProfileLine(question),
      `**Review state:** ${metadata.reviewStatus}  `,
      '**Lifecycle:** Question Studio disabled · Question Bank NOT_STORED · Tests INELIGIBLE · Public false',
      '',
      question.stem,
      '',
    );
    question.options.forEach((item, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${item.label}`);
    });
    lines.push('', '#### Explanation', '');
    question.visibleExplanation.lines.forEach((line) => lines.push(line, ''));
    if (question.visibleExplanation.optionAnalysis?.length) {
      lines.push('**Optional help — Why are the other options wrong?**', '');
      question.visibleExplanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
      lines.push('');
    }
    lines.push(`**Answer: ${question.visibleExplanation.answer}**`, '', '---', '');
  });

  return `${lines.join('\n').trim()}\n`;
}
