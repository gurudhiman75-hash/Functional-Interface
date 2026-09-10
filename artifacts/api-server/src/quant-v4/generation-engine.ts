import {
  generateQuestion as generateLegacyQuestion,
  listQuantV4Packages as listLegacyPackages,
  toQuestionStudioPreview,
  QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
} from "./generation-engine-legacy";
import type { QuantV4GenerationRequest as LegacyQuantV4GenerationRequest } from "./generation-engine-legacy";
import {
  getQuantV4ExamProfileContract,
  type QuantV4ExamProfileId,
} from "./common/exam-profile";
import {
  generateProbabilityQuestionStudioBatch,
  isProbabilityStandardQuestionStudioRequest,
  listProbabilityStandardQuestionStudioPackages,
  type ProbabilityStandardQuestionStudioRequest,
} from "./topics/Probability/question-studio-integration";
import {
  generateBlr001StandardQuestionStudioBatch,
  isBlr001StandardQuestionStudioRequest,
  listBlr001StandardQuestionStudioPackages,
  type Blr001StandardQuestionStudioRequest,
} from "../reasoning-v1/topics/Blood-Relations/BLR-001/question-studio-standard-integration";
import {
  generateIop001StandardQuestionStudioBatch,
  isIop001StandardQuestionStudioRequest,
  listIop001StandardQuestionStudioPackages,
  type Iop001QuestionStudioRequest,
} from "../reasoning-v1/topics/InputOutput/IOP-001/question-studio-standard-integration";
import {
  generateMal001StandardQuestionStudioBatch,
  isMal001StandardQuestionStudioRequest,
  listMal001StandardQuestionStudioPackages,
  type Mal001StandardQuestionStudioRequest,
} from "./topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-standard-integration";
import {
  generateGeo001StandardQuestionStudioBatch,
  isGeo001StandardQuestionStudioRequest,
  listGeo001StandardQuestionStudioPackages,
  type Geo001StandardQuestionStudioRequest,
} from "./topics/AdvancedMathematics/subtopics/Geometry/question-studio-standard-integration";

export const QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY =
  "QUANT-V4-EXAM-PROFILE-INGRESS-P2" as const;

export type QuantV4GenerationRequest = Omit<
  LegacyQuantV4GenerationRequest,
  "examProfile"
> & {
  examProfile?: QuantV4ExamProfileId;
};

export type {
  QuantV4Difficulty,
  QuantV4Language,
  QuantV4PackageDefinition,
  QuantV4PackageId,
} from "./generation-engine-legacy";
export { QUANT_V4_PERCENTAGE_ALL_PATTERN_ID, toQuestionStudioPreview };

export type QuantV4ExamProfileTransportStatus =
  | "NOT_REQUESTED"
  | "APPLIED_DOWNSTREAM"
  | "INGRESS_ACCEPTED_DOWNSTREAM_PENDING";

function observedExamProfile(value: any): string | undefined {
  const candidates = [
    value?.examProfile,
    value?.parameters?.examProfile,
    value?.traceability?.examProfile,
    value?.metadata?.examProfile,
    value?.debugMetadata?.examProfile,
  ];
  return candidates.find((candidate) => typeof candidate === "string") as
    | string
    | undefined;
}

function annotateProfileTransport(value: any, profileId: QuantV4ExamProfileId) {
  if (!value || typeof value !== "object") return value;
  const contract = getQuantV4ExamProfileContract(profileId);
  const applied = observedExamProfile(value) === profileId;
  return {
    ...value,
    requestedExamProfile: profileId,
    expectedOptionCount: contract.optionCount,
    examProfileTransportStatus: applied
      ? ("APPLIED_DOWNSTREAM" as const)
      : ("INGRESS_ACCEPTED_DOWNSTREAM_PENDING" as const),
    profileTransportAuthority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
  };
}

function withExamProfileIngress<T>(
  result: T,
  request: QuantV4GenerationRequest,
): T {
  if (!request.examProfile || !result || typeof result !== "object") return result;

  const contract = getQuantV4ExamProfileContract(request.examProfile);
  const source = result as any;
  const questions = Array.isArray(source.questions)
    ? source.questions.map((question: any) =>
        annotateProfileTransport(question, request.examProfile!),
      )
    : source.questions;
  const questionPackages = Array.isArray(source.questionPackages)
    ? source.questionPackages.map((questionPackage: any) =>
        annotateProfileTransport(questionPackage, request.examProfile!),
      )
    : source.questionPackages;

  const observations = [
    ...(Array.isArray(questions) ? questions : []),
    ...(Array.isArray(questionPackages) ? questionPackages : []),
  ];
  const downstreamAppliedCount = observations.filter(
    (item: any) => item?.examProfileTransportStatus === "APPLIED_DOWNSTREAM",
  ).length;
  const downstreamPendingCount = observations.filter(
    (item: any) =>
      item?.examProfileTransportStatus ===
      "INGRESS_ACCEPTED_DOWNSTREAM_PENDING",
  ).length;

  return {
    ...source,
    generationContext: {
      ...(source.generationContext ?? {}),
      requestedExamProfile: request.examProfile,
      requestedExamFamily: contract.family,
      requestedDeliveryStyle: contract.deliveryStyle,
      expectedOptionCount: contract.optionCount,
      profileTransportAuthority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
      downstreamAppliedCount,
      downstreamPendingCount,
      profileTransportStatus:
        downstreamPendingCount === 0 && downstreamAppliedCount > 0
          ? "APPLIED_DOWNSTREAM"
          : "INGRESS_ACCEPTED_DOWNSTREAM_PENDING",
    },
    questions,
    questionPackages,
  } as T;
}

export function listQuantV4Packages() {
  const packages = listLegacyPackages().filter(
    (entry) =>
      entry.packageId !== "PRB-001" &&
      entry.packageId !== "PRB-002" &&
      entry.packageId !== "MAL-001",
  );
  return [
    ...packages,
    ...listMal001StandardQuestionStudioPackages(),
    ...listProbabilityStandardQuestionStudioPackages(),
    ...listBlr001StandardQuestionStudioPackages(),
    ...listIop001StandardQuestionStudioPackages(),
    ...listGeo001StandardQuestionStudioPackages(),
  ].sort((left, right) => left.packageId.localeCompare(right.packageId));
}

export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
  if (request.examProfile) {
    getQuantV4ExamProfileContract(request.examProfile);
  }

  if (isIop001StandardQuestionStudioRequest(request as Iop001QuestionStudioRequest)) {
    return withExamProfileIngress(
      generateIop001StandardQuestionStudioBatch(request as Iop001QuestionStudioRequest),
      request,
    );
  }
  if (
    isGeo001StandardQuestionStudioRequest(
      request as Geo001StandardQuestionStudioRequest,
    )
  ) {
    return withExamProfileIngress(
      generateGeo001StandardQuestionStudioBatch(
        request as Geo001StandardQuestionStudioRequest,
      ),
      request,
    );
  }
  if (
    isMal001StandardQuestionStudioRequest(
      request as Mal001StandardQuestionStudioRequest,
    )
  ) {
    return withExamProfileIngress(
      generateMal001StandardQuestionStudioBatch(
        request as Mal001StandardQuestionStudioRequest,
      ),
      request,
    );
  }
  if (
    isBlr001StandardQuestionStudioRequest(
      request as Blr001StandardQuestionStudioRequest,
    )
  ) {
    return withExamProfileIngress(
      generateBlr001StandardQuestionStudioBatch(
        request as Blr001StandardQuestionStudioRequest,
      ),
      request,
    );
  }
  if (
    isProbabilityStandardQuestionStudioRequest(
      request as ProbabilityStandardQuestionStudioRequest,
    )
  ) {
    return withExamProfileIngress(
      generateProbabilityQuestionStudioBatch(
        request as ProbabilityStandardQuestionStudioRequest,
      ),
      request,
    );
  }
  return withExamProfileIngress(
    await generateLegacyQuestion(request as LegacyQuantV4GenerationRequest),
    request,
  );
}
