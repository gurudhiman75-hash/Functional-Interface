import * as Frozen from "./question-studio-freeze-v4-1.ts";
import {
  assertStaV41RenderedQuestionIndependentProof,
  STA_001_V41_INDEPENDENT_PROOF_AUTHORITY,
} from "./exam-realness-v4-1-independent-proof.ts";

export const STA_001_POST_CLOSURE_PROOF_AUTHORITY =
  STA_001_V41_INDEPENDENT_PROOF_AUTHORITY;

export function previewSta001QuestionStudioReviewPostClosure(
  input: Frozen.PreviewSta001QuestionStudioInput = {},
) {
  const preview = Frozen.previewSta001QuestionStudioReview(input);
  for (const question of preview.questions) {
    assertStaV41RenderedQuestionIndependentProof({
      questionId: question.questionId,
      queryPolarity: question.queryPolarity,
      candidates: question.candidates,
      answerSet: question.answerSet,
      options: question.options,
      correctIndex: question.correctIndex,
    });
  }
  return Object.freeze({
    ...preview,
    independentProofAuthority: STA_001_POST_CLOSURE_PROOF_AUTHORITY,
    independentProofVerified: true as const,
  });
}
