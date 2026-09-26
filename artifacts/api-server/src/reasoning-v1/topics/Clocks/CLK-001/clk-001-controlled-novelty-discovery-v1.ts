import { generateClockQuestion } from './runtime/generator';
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from '../../../shared/reasoning-novelty-governance-v1';

export const CLK_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  'CLK_001_CONTROLLED_NOVELTY_DISCOVERY_V1' as const;

export interface ClockControlledNovelAngleCandidateV1 {
  readonly candidateId: string;
  readonly provenance: 'CONTROLLED_NOVEL';
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly ['CLK-QL-003', 'CLK-QL-010'];
  readonly taskId: 'ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME';
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: string;
  readonly semanticFingerprint: string;
  readonly solverAgreement: true;
  readonly candidateDisposition: string;
  readonly permanentQlAllocated: false;
  readonly questionStudioActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
}

export function generateClockControlledNovelAngleCandidateV1(
  seed: number,
): ClockControlledNovelAngleCandidateV1 {
  if (!Number.isSafeInteger(seed)) {
    throw new Error('Clock controlled-novel seed must be a safe integer.');
  }

  const question = generateClockQuestion({
    taskId: 'ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME',
    seed: 'clk-controlled-novel-angle-' + seed,
    locale: 'en-IN',
    correctOptionIndex: (Math.abs(seed) % 4) as 0 | 1 | 2 | 3,
  });

  const options = question.options.map((option) => option.display);
  if (question.solveTrace.agreement !== true) {
    throw new Error('Clock controlled-novel angle candidate failed independent solver agreement.');
  }
  if (new Set(options).size !== 4) {
    throw new Error('Clock controlled-novel angle candidate requires four distinct options.');
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error('Clock controlled-novel angle candidate requires exactly one correct option.');
  }

  const noveltyAxes = [
    'MULTI_STAGE_COMPOSITION',
    'VALID_CROSS_FAMILY_COMPOSITION',
    'INFORMATION_DISTRIBUTION',
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: 'CLK-NOVEL-ANGLE-' + seed,
    chapterId: 'CLK-001',
    qlId: 'CLK-QL-003+CLK-QL-010',
    provenance: 'CONTROLLED_NOVEL',
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId: 'CLK-NOVEL-ANGLE-' + seed,
    provenance: 'CONTROLLED_NOVEL',
    noveltyAxes,
    parentQlIds: ['CLK-QL-003', 'CLK-QL-010'],
    taskId: 'ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME',
    seed,
    stem: question.stem,
    options,
    correctIndex: question.correctOptionIndex,
    answer: question.answer.display,
    explanation: [
      question.explanation.given,
      question.explanation.rule,
      ...question.explanation.working,
      question.explanation.answer,
    ].join('\n\n'),
    semanticFingerprint: question.fingerprint,
    solverAgreement: true,
    candidateDisposition: question.discoveryAudit.candidateDisposition,
    permanentQlAllocated: false,
    questionStudioActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
  };
}
