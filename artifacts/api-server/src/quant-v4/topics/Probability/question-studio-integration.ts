import {
  generateProbabilityStandardQuestionStudioBatch,
  isProbabilityStandardQuestionStudioRequest,
  listProbabilityStandardQuestionStudioPackages,
  type ProbabilityStandardQuestionStudioRequest,
} from "./question-studio-runtime";

export {
  isProbabilityStandardQuestionStudioRequest,
  listProbabilityStandardQuestionStudioPackages,
};
export type { ProbabilityStandardQuestionStudioRequest };

export function generateProbabilityQuestionStudioBatch(
  request: ProbabilityStandardQuestionStudioRequest = {},
) {
  const result = generateProbabilityStandardQuestionStudioBatch(request);
  if ((request.language ?? "en") !== "en") return result;

  const { publiclyPublishable: _publicRelease, ...generationContext } = result.generationContext as Record<string, unknown>;
  const questions = result.questions.map((question) => {
    const { publiclyPublishable: _questionPublicRelease, ...payload } = question as Record<string, unknown>;
    return {
      ...payload,
      automaticStudentPublication: false,
      publicReleaseStatus: "LOCKED",
    };
  });

  return {
    ...result,
    generationContext: {
      ...generationContext,
      automaticStudentPublication: false,
      publicReleaseStatus: "LOCKED",
    },
    questions,
  };
}
