import { generateReviewedCaeQuestion } from './reviewed-generator';
import type { CaeLocale, GeneratedCaeQuestion } from './types';
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from '../../../shared/reasoning-novelty-governance-v1';

export const CAE_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  'CAE_001_CONTROLLED_NOVELTY_DISCOVERY_V1' as const;

export type CaeControlledNovelQlV1 = 'CAE-QL-008' | 'CAE-QL-009';

export interface CaeControlledNovelCandidateV1 {
  readonly candidateId: string;
  readonly provenance: 'CONTROLLED_NOVEL';
  readonly qlId: CaeControlledNovelQlV1;
  readonly checkpointId: 'CAE-CP-008' | 'CAE-CP-009';
  readonly locale: CaeLocale;
  readonly seed: number;
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly causalStructure: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answerId: string;
  readonly answer: string;
  readonly explanation: string;
  readonly semanticFingerprint: string;
  readonly solverAuthority: string;
  readonly solverVerified: true;
  readonly uniqueCorrectAnswer: true;
  readonly plausibleDistractors: true;
  readonly examNatural: true;
  readonly falseHistoricalAttribution: false;
  readonly permanentQlAllocated: false;
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
}

function axesFor(question: GeneratedCaeQuestion): readonly ReasoningNoveltyAxisV1[] {
  if (question.qlId === 'CAE-QL-008') {
    return [
      'RELATION_STRUCTURE',
      'QUERY_DIRECTION',
      'INFORMATION_DISTRIBUTION',
    ];
  }
  return [
    'INFORMATION_DISTRIBUTION',
    'MULTI_STAGE_COMPOSITION',
    'QUERY_DIRECTION',
  ];
}

function validateGeneratedQuestion(question: GeneratedCaeQuestion): void {
  if (question.options.length !== 4) {
    throw new Error(question.qlId + ' controlled-novel candidate must have four options.');
  }
  if (new Set(question.options).size !== question.options.length) {
    throw new Error(question.qlId + ' controlled-novel candidate has duplicate visible options.');
  }
  if (
    !Number.isInteger(question.correctIndex) ||
    question.correctIndex < 0 ||
    question.correctIndex >= question.options.length
  ) {
    throw new Error(question.qlId + ' controlled-novel candidate has an invalid correct index.');
  }
  if (question.optionMetadata.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(question.qlId + ' controlled-novel candidate must have exactly one correct option.');
  }
  if (!question.causalTrace || question.causalTrace.length < 2) {
    throw new Error(question.qlId + ' controlled-novel candidate must retain a causal proof trace.');
  }
}

function contentWords(value: string): Set<string> {
  const stop = new Set(["the", "a", "an", "to", "of", "in", "at", "for", "and", "on", "one", "after", "earlier", "usual"]);
  return new Set(
    value
      .toLocaleLowerCase("en-IN")
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !stop.has(word)),
  );
}

function simpleEventDistractorsAreDistinct(question: GeneratedCaeQuestion): boolean {
  if (question.qlId !== "CAE-QL-009") return true;
  const correct = question.options[question.correctIndex]!;
  if (correct.includes("→")) return true;
  const correctWords = contentWords(correct);
  for (let index = 0; index < question.options.length; index += 1) {
    if (index === question.correctIndex) continue;
    const option = question.options[index]!;
    if (option.includes("→")) continue;
    const words = contentWords(option);
    const intersection = [...correctWords].filter((word) => words.has(word)).length;
    const union = new Set([...correctWords, ...words]).size;
    const overlap = union === 0 ? 0 : intersection / union;
    if (overlap > 0.33) return false;
  }
  return true;
}

export function generateCaeControlledNovelCandidateV1(input: {
  qlId: CaeControlledNovelQlV1;
  locale: CaeLocale;
  seed: number;
}): CaeControlledNovelCandidateV1 {
  if (!Number.isSafeInteger(input.seed)) {
    throw new Error('CAE controlled-novel seed must be a safe integer.');
  }

  let question: GeneratedCaeQuestion | null = null;
  for (let offset = 0; offset < 32; offset += 1) {
    const candidate = generateReviewedCaeQuestion({
      qlId: input.qlId,
      locale: input.locale,
      seed: input.seed + offset,
      questionProfile: 'FOUR_WAY',
    });
    validateGeneratedQuestion(candidate);
    if (!simpleEventDistractorsAreDistinct(candidate)) continue;
    question = candidate;
    break;
  }
  if (!question) {
    throw new Error(input.qlId + ' controlled-novel candidate could not find a distinct distractor set.');
  }

  const noveltyAxes = axesFor(question);
  const candidateId =
    'CAE-NOVEL-' + input.qlId + '-' + input.locale + '-' + String(input.seed);

  validateReasoningNoveltyCandidateV1({
    candidateId,
    chapterId: 'CAE-001',
    qlId: input.qlId,
    provenance: 'CONTROLLED_NOVEL',
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: question.distractorMechanisms.length >= 2,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId,
    provenance: 'CONTROLLED_NOVEL',
    qlId: input.qlId,
    checkpointId: input.qlId === 'CAE-QL-008' ? 'CAE-CP-008' : 'CAE-CP-009',
    locale: input.locale,
    seed: input.seed,
    noveltyAxes,
    causalStructure: question.causalStructure,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answerId: question.answerId,
    answer: question.options[question.correctIndex]!,
    explanation: question.explanation,
    semanticFingerprint: question.causalStateId,
    solverAuthority: String(question.metadata.solver),
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    permanentQlAllocated: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
  };
}
