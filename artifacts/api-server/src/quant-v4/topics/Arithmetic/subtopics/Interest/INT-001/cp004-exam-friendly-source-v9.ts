import {
  deepFreeze,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import { generateIntCp004QuestionFromState } from "./cp004-frequency-runtime";
import {
  generateIntCp004EnglishFrozenQuestion,
  type IntCp004EnglishFrozenQuestion,
} from "./cp004-english-frozen-runtime";
import { generateIntCp004ExamFriendlyStateV9 } from "./cp004-exam-friendly-state-v9";

export const INT_CP004_EXAM_FRIENDLY_SOURCE_V9_VERSION =
  "INT-CP-004-EXAM-FRIENDLY-SOURCE-v9" as const;

function reviewFrame(seed: string): number | null {
  const match = seed.match(/:frame-(\d+):candidate-/u);
  if (!match) return null;
  const frame = Number(match[1]);
  return Number.isInteger(frame) && frame >= 1 && frame <= 4 ? frame : null;
}

function alignReviewAnswerPosition(
  question: IntCp004EnglishFrozenQuestion,
  frame: number,
): IntCp004EnglishFrozenQuestion {
  const desiredCorrectIndex = frame % 4;
  if (question.correctIndex === desiredCorrectIndex) return question;
  const options = [...question.options];
  const [correct] = options.splice(question.correctIndex, 1);
  if (!correct) throw new Error(`${question.qlId}/${question.seed}: missing correct option during v9 review alignment.`);
  options.splice(desiredCorrectIndex, 0, correct);
  return deepFreeze({
    ...question,
    options: Object.freeze(options),
    correctIndex: desiredCorrectIndex,
    correctAnswer: correct.text,
  });
}

function buildCandidateEnvelope(
  qlId: IntCp004QlId,
  seed: string,
): IntCp004EnglishFrozenQuestion {
  // The approved frozen question is used only as the immutable authority/lifecycle
  // envelope. V9 replaces learner mathematics with an unfrozen remediation state;
  // the branch/PR remains explicitly under review and is not a new English freeze.
  const authorityEnvelope = generateIntCp004EnglishFrozenQuestion(qlId, seed);
  const mathematicalState = generateIntCp004ExamFriendlyStateV9(qlId, seed);
  const candidate = generateIntCp004QuestionFromState(qlId, seed, mathematicalState);

  const wrapped: IntCp004EnglishFrozenQuestion = {
    ...authorityEnvelope,
    ...candidate,
    freezeId: authorityEnvelope.freezeId,
    sourceGeneratorVersion: authorityEnvelope.sourceGeneratorVersion,
    editorialStatus: authorityEnvelope.editorialStatus,
    approvalStatus: authorityEnvelope.approvalStatus,
    allocationStatus: authorityEnvelope.allocationStatus,
    permanentIdentityFrozen: authorityEnvelope.permanentIdentityFrozen,
    learnerContentFrozen: authorityEnvelope.learnerContentFrozen,
    approval: authorityEnvelope.approval,
    frozenRegistry: authorityEnvelope.frozenRegistry,
    lifecycle: authorityEnvelope.lifecycle,
  };
  return deepFreeze(wrapped);
}

export function isIntCp004ExamFriendlyFrozenSourceV9(
  question: IntCp004EnglishFrozenQuestion,
): boolean {
  // Decimal-freedom is enforced against the actual Hindi/Punjabi learner surface
  // after native-stem rendering, option adaptation and v9 explanation rendering.
  // The legacy English authority wording may legitimately contain phrases such as
  // "two decimal places" and is not itself the learner output under review.
  return question.answerSemantic === "DURATION"
    || question.answerSemantic === "FREQUENCY"
    || question.solution.denominator === 1n;
}

export function selectIntCp004ExamFriendlyFrozenSourceV9(
  qlId: IntCp004QlId,
  seed: string,
): IntCp004EnglishFrozenQuestion {
  let question = buildCandidateEnvelope(qlId, seed);
  if (!isIntCp004ExamFriendlyFrozenSourceV9(question)) {
    throw new Error(`${qlId}/${seed}: v9 state construction produced a non-integer verified answer.`);
  }
  const frame = reviewFrame(seed);
  if (frame !== null) question = alignReviewAnswerPosition(question, frame);
  return question;
}
