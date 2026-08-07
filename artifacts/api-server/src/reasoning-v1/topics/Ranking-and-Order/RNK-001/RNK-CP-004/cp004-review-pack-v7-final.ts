import {
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV7PrototypeId,
} from './cp004-exam-ready-v13';
import {
  renderRnkCp004QuestionsAndExplanationsMarkdownV7,
  structuralShapeFingerprint,
} from './cp004-review-pack-v7';

export { renderRnkCp004QuestionsAndExplanationsMarkdownV7, structuralShapeFingerprint };

const CONTEXTS = [
  'SELECTION_TEST',
  'MERIT_LIST',
  'COMPETITION_STANDINGS',
  'PERFORMANCE_REVIEW',
  'INTERVIEW_SHORTLIST',
  'NEUTRAL_RANKING',
] as const;

interface Candidate {
  readonly seed: number;
  readonly question: RnkCp004ExamReadyQuestion;
  readonly shape: string;
}

function candidateScore(candidate: Candidate, selected: readonly Candidate[]): number {
  const question = candidate.question;
  const metadata = question.reviewMetadata;
  const entities = new Set(selected.map((item) => item.question.displayedEvidence.entities.length));
  const proofs = new Set(selected.map((item) => item.question.reviewMetadata.reasoningFeatures.shortestProofClueCount));
  const confirmatory = new Set(selected.map((item) => item.question.reviewMetadata.clueRoleProfile.confirmatory));
  const difficulties = new Set(selected.map((item) => item.question.difficulty));
  const stems = new Set(selected.map((item) => item.question.reviewMetadata.editorialDiversityProfile.stemVariantId));
  const explanations = new Set(selected.map((item) => item.question.reviewMetadata.editorialDiversityProfile.explanationVariantId));
  return (entities.has(question.displayedEvidence.entities.length) ? 0 : 5)
    + (proofs.has(metadata.reasoningFeatures.shortestProofClueCount) ? 0 : 5)
    + (confirmatory.has(metadata.clueRoleProfile.confirmatory) ? 0 : 5)
    + (difficulties.has(question.difficulty) ? 0 : 4)
    + (stems.has(metadata.editorialDiversityProfile.stemVariantId) ? 0 : 3)
    + (explanations.has(metadata.editorialDiversityProfile.explanationVariantId) ? 0 : 2)
    + Math.min(3, metadata.languageProfile.reversedClueCount);
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
        const difference = candidateScore(right, selected) - candidateScore(left, selected);
        return difference !== 0 ? difference : left.seed - right.seed;
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

function deBruijn(alphabetSize: number, order: number): readonly number[] {
  const working = Array(alphabetSize * order).fill(0);
  const sequence: number[] = [];
  const visit = (position: number, period: number): void => {
    if (position > order) {
      if (order % period === 0) {
        for (let index = 1; index <= period; index += 1) sequence.push(working[index]);
      }
      return;
    }
    working[position] = working[position - period];
    visit(position + 1, period);
    for (let value = working[position - period] + 1; value < alphabetSize; value += 1) {
      working[position] = value;
      visit(position + 1, position);
    }
  };
  visit(1, 1);
  return sequence;
}

function balancedAnswerSequence(length: number): readonly number[] {
  const cycle = deBruijn(4, 4);
  if (cycle.length !== 256) throw new Error(`Unexpected de Bruijn cycle length ${cycle.length}`);
  let best: number[] | null = null;
  let bestSpread = Number.POSITIVE_INFINITY;
  for (let rotation = 0; rotation < cycle.length; rotation += 1) {
    const candidate = Array.from({ length }, (_, index) => cycle[(rotation + index) % cycle.length]);
    const counts = [0, 0, 0, 0];
    for (const value of candidate) counts[value] += 1;
    const spread = Math.max(...counts) - Math.min(...counts);
    if (spread < bestSpread) {
      bestSpread = spread;
      best = candidate;
    }
  }
  if (!best || bestSpread > 1) throw new Error(`Unable to balance answer sequence; spread ${bestSpread}`);
  return best;
}

function addReviewFingerprint(question: RnkCp004ExamReadyQuestion): RnkCp004ExamReadyQuestion {
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

export function buildRnkCp004ReviewPackV7Final(): readonly RnkCp004ExamReadyQuestion[] {
  const usedSeeds = new Set<number>();
  const byPrototype = new Map<RnkCp004RemodelV7PrototypeId, readonly Candidate[]>();
  for (const prototypeId of RNK_CP004_REMODEL_V7_PROTOTYPE_IDS) {
    byPrototype.set(prototypeId, selectPrototypeEvidence(prototypeId, usedSeeds));
  }

  const ordered: { readonly prototypeId: RnkCp004RemodelV7PrototypeId; readonly seed: number }[] = [];
  for (let round = 0; round < 12; round += 1) {
    const rotation = round % RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length;
    for (let offset = 0; offset < RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length; offset += 1) {
      const prototypeId = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS[
        (offset + rotation) % RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length
      ];
      const candidate = byPrototype.get(prototypeId)?.[round];
      if (!candidate) throw new Error(`Missing candidate for ${prototypeId} round ${round + 1}`);
      ordered.push({ prototypeId, seed: candidate.seed });
    }
  }

  const answerSequence = balancedAnswerSequence(ordered.length);
  const fingerprints = new Set<string>();
  return ordered.map(({ prototypeId, seed }, index) => {
    const question = addReviewFingerprint(
      generateRnkCp004ExamReadyQuestion(prototypeId, seed, answerSequence[index]),
    );
    if (fingerprints.has(question.reviewMetadata.normalizedSemanticFingerprint)) {
      throw new Error(`Duplicate review fingerprint at ${question.reviewMetadata.stableQuestionId}`);
    }
    fingerprints.add(question.reviewMetadata.normalizedSemanticFingerprint);
    return question;
  });
}
