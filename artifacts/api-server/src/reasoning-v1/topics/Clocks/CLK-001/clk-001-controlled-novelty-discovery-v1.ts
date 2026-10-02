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
  readonly solverVerified: true;
  readonly uniqueCorrectAnswer: true;
  readonly plausibleDistractors: true;
  readonly examNatural: true;
  readonly falseHistoricalAttribution: false;
  readonly permanentQlAllocated: false;
  readonly questionStudioActivated: false;
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
}

function examNaturalClockStem(source: string): string {
  const match = source.match(/^At actual time (.+?), a clock that was (.+?) at actual 8:00 and runs at rate (\d+):(\d+) shows some reading\. What smaller angle do its displayed hands form\?$/);
  if (!match) return source;
  const target = match[1]!.replace(" (1 day later)", " the next day");
  const offset = match[2]!;
  const rateNumerator = match[3]!;
  const rateDenominator = match[4]!;
  return `At 8:00 a.m., a clock was ${offset}. Thereafter, it ran at ${rateNumerator}/${rateDenominator} of the correct rate. When the correct time is ${target}, what is the smaller angle between the hands of the clock?`;
}

function learnerClockExplanation(question: ReturnType<typeof generateClockQuestion>): string {
  const displayedLine = question.explanation.working.find((line) => line.startsWith("Displayed reading ="));
  const displayed = displayedLine?.replace(/^Displayed reading =\s*/, "").replace(/\.$/, "") ?? String(question.scenario.displayed ?? "the derived displayed time");
  const timeMatch = displayed.match(/^(\d+):(\d+):(\d+)/);
  if (!timeMatch) {
    return `First find the time shown by the faulty clock at the stated correct time. It shows ${displayed}. Applying the standard clock-hand angle rule to that displayed time gives ${question.answer.display}. Hence the smaller angle is ${question.answer.display}.`;
  }
  const hour = Number(timeMatch[1]) % 12;
  const minute = Number(timeMatch[2]);
  const second = Number(timeMatch[3]);
  const hourAngle = 30 * hour + 0.5 * minute + second / 120;
  const minuteAngle = 6 * minute + second / 10;
  const rawDifference = Math.abs(hourAngle - minuteAngle);
  const smaller = Math.min(rawDifference, 360 - rawDifference);
  const tidy = (value: number) => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  return `First find the time shown by the faulty clock at the stated correct time: ${displayed}. At this reading, the hour hand is at ${tidy(hourAngle)}° and the minute hand is at ${tidy(minuteAngle)}°. Their smaller difference is ${tidy(smaller)}°, i.e. ${question.answer.display}.`;
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
    stem: examNaturalClockStem(question.stem),
    options,
    correctIndex: question.correctOptionIndex,
    answer: question.answer.display,
    explanation: learnerClockExplanation(question),
    semanticFingerprint: question.fingerprint,
    solverAgreement: true,
    candidateDisposition: question.discoveryAudit.candidateDisposition,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    permanentQlAllocated: false,
    questionStudioActivated: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
  };
}
