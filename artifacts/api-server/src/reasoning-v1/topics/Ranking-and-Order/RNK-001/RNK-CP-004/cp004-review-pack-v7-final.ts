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

const BALANCED_UNIQUE_FOUR_GRAM_SEQUENCE =
  '002312310233121002133210123020131302120323110032230101320121323002213103023031201123233012021130301301102232203132110320303212112003';

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

function balancedAnswerSequence(length: number): readonly number[] {
  if (length !== 132 || BALANCED_UNIQUE_FOUR_GRAM_SEQUENCE.length !== length) {
    throw new Error(`Balanced answer authority expects 132 records, found ${length}`);
  }
  const sequence = [...BALANCED_UNIQUE_FOUR_GRAM_SEQUENCE].map((value) => Number(value));
  const counts = [0, 0, 0, 0];
  for (const value of sequence) {
    if (!Number.isInteger(value) || value < 0 || value > 3) throw new Error(`Invalid answer position ${value}`);
    counts[value] += 1;
  }
  if (counts.some((count) => count !== 33)) {
    throw new Error(`Answer sequence is not exactly balanced: ${counts.join('/')}`);
  }
  const fourGrams = new Set<string>();
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const key = sequence.slice(index, index + 4).join('');
    if (fourGrams.has(key)) throw new Error(`Balanced authority repeats four-gram ${key}`);
    fourGrams.add(key);
  }
  if (fourGrams.size !== 129) throw new Error(`Expected 129 unique four-grams, found ${fourGrams.size}`);
  return sequence;
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
