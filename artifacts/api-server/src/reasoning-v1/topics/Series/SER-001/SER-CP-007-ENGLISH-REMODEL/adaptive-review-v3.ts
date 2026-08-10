import {
  buildAdaptiveSerCp007Review,
  type SerCp007AdaptiveReview,
  type SerCp007EditorialQuestion,
} from "./adaptive-review";
import {
  buildSerCp007DistractorCandidateV1,
  type SerCp007DistractorCandidateOption,
  type SerCp007DistractorCandidateV1,
} from "../SER-CP-007-DISTRACTOR-AUDIT/distractor-candidate-v1";

export interface SerCp007AdaptiveReviewV3 extends SerCp007AdaptiveReview {
  readonly options: readonly string[];
  readonly distractors: readonly SerCp007DistractorCandidateOption[];
  readonly visibleCheckRole: SerCp007DistractorCandidateOption["role"] | null;
}

function replaceCheck(
  review: string,
  role: SerCp007DistractorCandidateOption | null,
): string {
  if (!role) return review;
  const replacement = `**Check:** ${role.learnerCheck}`;
  if (/^\*\*Check:\*\* .+$/m.test(review)) {
    return review.replace(/^\*\*Check:\*\* .+$/m, replacement);
  }
  return `${review}\n\n${replacement}`;
}

function checkRoleFor(
  candidate: SerCp007DistractorCandidateV1,
  renderedCheck: boolean,
): SerCp007DistractorCandidateOption | null {
  if (!renderedCheck) return null;
  return (
    candidate.distractors.find(
      (entry) =>
        entry.role === "REPLACEMENT_SINGLE_POSITION_MUTATION" ||
        entry.role === "SECOND_COMPONENT_MUTATED",
    ) ?? candidate.distractors[0]!
  );
}

export function buildAdaptiveSerCp007ReviewV3(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV3 {
  const distractorCandidate = buildSerCp007DistractorCandidateV1({
    temporaryTemplateId: question.temporaryTemplateId,
    canonicalAuthorityId: question.canonicalAuthorityId,
    taskKind: question.taskKind,
    seed: question.seed,
    correctAnswer: question.correctAnswer,
    correctIndex: question.correctIndex,
  });

  const questionWithCandidateOptions: SerCp007EditorialQuestion = {
    ...question,
    options: distractorCandidate.options,
  };
  const base = buildAdaptiveSerCp007Review(questionWithCandidateOptions);
  const visibleCheck = checkRoleFor(
    distractorCandidate,
    base.renderedCheck,
  );

  return {
    ...base,
    review: replaceCheck(base.review, visibleCheck),
    options: distractorCandidate.options,
    distractors: distractorCandidate.distractors,
    visibleCheckRole: visibleCheck?.role ?? null,
  };
}
