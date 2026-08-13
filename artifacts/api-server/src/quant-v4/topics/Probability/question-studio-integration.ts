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

function resolveRequest(request: ProbabilityStandardQuestionStudioRequest) {
  const mode = String((request as any).runtimeMode ?? "").trim().toUpperCase();
  if (mode === "SSC_CGL_CHSL" || mode === "SSC_CGL_JSO" || mode === "BANKING_PRELIMS" || mode === "BANKING_MAINS" || mode === "GENERIC_PRACTICE") {
    return { ...request, examProfile: mode as any };
  }
  return request;
}

export function generateProbabilityQuestionStudioBatch(
  request: ProbabilityStandardQuestionStudioRequest = {},
) {
  const resolved = resolveRequest(request);
  const result = generateProbabilityStandardQuestionStudioBatch(resolved);
  if ((resolved.language ?? "en") !== "en") return result;

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
