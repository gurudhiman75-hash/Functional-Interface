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
import { withQuantV4ExamProfileContext } from "./common/exam-profile-context";
import { buildQuantV4AnswerOptions } from "./shared/answers/option-generation";
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
export const QUANT_V4_PROFILE_DELIVERY_AUTHORITY =
  "QUANT-V4-PROFILE-DELIVERY-P2" as const;

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
export {
  getCurrentQuantV4ExamProfileContract,
  getCurrentQuantV4ExamProfileId,
  withQuantV4ExamProfileContext,
} from "./common/exam-profile-context";

export type QuantV4ExamProfileTransportStatus =
  | "NOT_REQUESTED"
  | "APPLIED_DOWNSTREAM"
  | "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING"
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

function isQuantQuestion(value: any) {
  return (
    value?.section === "Quant" ||
    value?.generationBackend === "quant-v4" ||
    value?.debugSource === "quant-v4-package-runtime"
  );
}

function extendExistingOptionsForDelivery(input: {
  options: readonly string[];
  correctIndex: number | undefined;
  desiredCount: number;
  seed: string;
}) {
  if (
    !Number.isInteger(input.correctIndex) ||
    (input.correctIndex as number) < 0 ||
    (input.correctIndex as number) >= input.options.length ||
    input.options.length >= input.desiredCount ||
    new Set(input.options).size !== input.options.length
  ) {
    return null;
  }

  const options = [...input.options];
  const correctOption = options[input.correctIndex as number]!.trim();
  const ratio = correctOption.match(/^(-?\d+(?:\.\d+)?)\s*:\s*(-?\d+(?:\.\d+)?)$/u);
  const candidates: string[] = [];
  if (ratio) {
    const left = Number(ratio[1]);
    const right = Number(ratio[2]);
    if (Number.isFinite(left) && Number.isFinite(right)) {
      candidates.push(`${left + 1}:${right}`, `${left}:${right + 1}`, `${Math.max(1, left - 1)}:${right}`);
    }
  }
  candidates.push("None of these", "Cannot be determined", "Insufficient information");

  let hash = 2166136261;
  for (const character of input.seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const start = (hash >>> 0) % candidates.length;
  for (let offset = 0; offset < candidates.length && options.length < input.desiredCount; offset += 1) {
    const candidate = candidates[(start + offset) % candidates.length]!;
    if (!options.includes(candidate)) options.push(candidate);
  }

  return options.length === input.desiredCount
    ? { options, correctIndex: input.correctIndex as number }
    : null;
}

function enforceProfileDelivery(value: any, profileId: QuantV4ExamProfileId) {
  if (!isQuantQuestion(value) || !Array.isArray(value?.options)) return null;
  const contract = getQuantV4ExamProfileContract(profileId);
  const existingOptions = value.options.map((option: unknown) => String(option ?? ""));
  const hasExpectedOptionShape =
    existingOptions.length === contract.optionCount &&
    new Set(existingOptions).size === contract.optionCount;

  let options = existingOptions;
  let correctIndex = Number.isInteger(value.correctIndex)
    ? value.correctIndex
    : Number.isInteger(value.correct)
      ? value.correct
      : undefined;
  let canonicalAnswer = value.canonicalAnswer;

  if (!hasExpectedOptionShape) {
    const deliverySeed = String(
      value.seed ?? value.questionId ?? value.text ?? `${profileId}:delivery`,
    );
    const extension = extendExistingOptionsForDelivery({
      options: existingOptions,
      correctIndex,
      desiredCount: contract.optionCount,
      seed: deliverySeed,
    });

    if (extension) {
      options = extension.options;
      correctIndex = extension.correctIndex;
    } else {
      const answer = value.answer ?? value.canonicalAnswer?.display ?? value.canonicalAnswer?.value;
      if (answer === undefined || answer === null || answer === "") return null;
      const rebuilt = buildQuantV4AnswerOptions(answer, {
        existingOptions,
        optionCount: contract.optionCount,
        seed: deliverySeed,
        context: {
          packageId: value.packageId,
          archetypeId: value.patternId ?? value.packageId,
          canonicalProblemId: value.canonicalProblemId,
          questionLanguageId: value.questionLanguageId,
          taskKind: value.taskKind,
          difficulty: value.difficulty ?? value.difficultyLabel,
          stem: value.text,
          variables: value.proceduralLogic ?? value.logic,
          traceability: value.traceability,
        },
      });
      options = rebuilt.options;
      correctIndex = rebuilt.correct;
      canonicalAnswer = rebuilt.canonicalAnswer;
    }
  }

  if (
    options.length !== contract.optionCount ||
    new Set(options).size !== contract.optionCount ||
    !Number.isInteger(correctIndex) ||
    (correctIndex as number) < 0 ||
    (correctIndex as number) >= contract.optionCount
  ) {
    return null;
  }

  return {
    ...value,
    options,
    correct: correctIndex,
    correctIndex,
    canonicalAnswer,
    optionCount: contract.optionCount,
    requestedExamProfile: profileId,
    deliveryExamProfile: profileId,
    expectedOptionCount: contract.optionCount,
    profileSelectionCalibrated: false,
    deliveryContractApplied: true,
    examProfileTransportStatus:
      "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING" as const,
    profileTransportAuthority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
    profileDeliveryAuthority: QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
    metadata: {
      ...(value.metadata ?? {}),
      requestedExamProfile: profileId,
      deliveryExamProfile: profileId,
      optionCount: contract.optionCount,
      profileSelectionCalibrated: false,
      deliveryContractApplied: true,
      profileDeliveryAuthority: QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
    },
    debugMetadata: {
      ...(value.debugMetadata ?? {}),
      requestedExamProfile: profileId,
      deliveryExamProfile: profileId,
      optionCount: contract.optionCount,
      profileSelectionCalibrated: false,
      deliveryContractApplied: true,
      profileDeliveryAuthority: QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
    },
  };
}

function annotateProfileTransport(value: any, profileId: QuantV4ExamProfileId) {
  if (!value || typeof value !== "object") return value;
  const contract = getQuantV4ExamProfileContract(profileId);
  const applied = observedExamProfile(value) === profileId;
  if (applied) {
    return {
      ...value,
      requestedExamProfile: profileId,
      expectedOptionCount: contract.optionCount,
      profileSelectionCalibrated: true,
      examProfileTransportStatus: "APPLIED_DOWNSTREAM" as const,
      profileTransportAuthority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
    };
  }

  const deliveryApplied = enforceProfileDelivery(value, profileId);
  if (deliveryApplied) return deliveryApplied;

  return {
    ...value,
    requestedExamProfile: profileId,
    expectedOptionCount: contract.optionCount,
    profileSelectionCalibrated: false,
    examProfileTransportStatus: "INGRESS_ACCEPTED_DOWNSTREAM_PENDING" as const,
    profileTransportAuthority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
  };
}

export function applyQuantV4ExamProfileDelivery<T>(
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

  // Question Studio questions are the delivery surface. Raw package payloads are
  // retained for trace/debug and must not downgrade a proven delivery result.
  const observations = Array.isArray(questions) && questions.length > 0
    ? questions
    : Array.isArray(questionPackages)
      ? questionPackages
      : [];
  const downstreamAppliedCount = observations.filter(
    (item: any) => item?.examProfileTransportStatus === "APPLIED_DOWNSTREAM",
  ).length;
  const deliveryAppliedCount = observations.filter(
    (item: any) =>
      item?.examProfileTransportStatus ===
      "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
  ).length;
  const downstreamPendingCount = observations.filter(
    (item: any) =>
      item?.examProfileTransportStatus ===
      "INGRESS_ACCEPTED_DOWNSTREAM_PENDING",
  ).length;

  const profileTransportStatus: QuantV4ExamProfileTransportStatus =
    downstreamPendingCount > 0
      ? "INGRESS_ACCEPTED_DOWNSTREAM_PENDING"
      : downstreamAppliedCount === observations.length && observations.length > 0
        ? "APPLIED_DOWNSTREAM"
        : deliveryAppliedCount > 0
          ? "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING"
          : "INGRESS_ACCEPTED_DOWNSTREAM_PENDING";

  return {
    ...source,
    generationContext: {
      ...(source.generationContext ?? {}),
      requestedExamProfile: request.examProfile,
      requestedExamFamily: contract.family,
      requestedDeliveryStyle: contract.deliveryStyle,
      expectedOptionCount: contract.optionCount,
      profileTransportAuthority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
      profileDeliveryAuthority: QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
      downstreamContextAvailable: true,
      downstreamAppliedCount,
      deliveryAppliedCount,
      downstreamPendingCount,
      profileSelectionCalibrated: profileTransportStatus === "APPLIED_DOWNSTREAM",
      profileTransportStatus,
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

async function dispatchGeneration(request: QuantV4GenerationRequest) {
  if (isIop001StandardQuestionStudioRequest(request as Iop001QuestionStudioRequest)) {
    return generateIop001StandardQuestionStudioBatch(request as Iop001QuestionStudioRequest);
  }
  if (
    isGeo001StandardQuestionStudioRequest(
      request as Geo001StandardQuestionStudioRequest,
    )
  ) {
    return generateGeo001StandardQuestionStudioBatch(
      request as Geo001StandardQuestionStudioRequest,
    );
  }
  if (
    isMal001StandardQuestionStudioRequest(
      request as Mal001StandardQuestionStudioRequest,
    )
  ) {
    return generateMal001StandardQuestionStudioBatch(
      request as Mal001StandardQuestionStudioRequest,
    );
  }
  if (
    isBlr001StandardQuestionStudioRequest(
      request as Blr001StandardQuestionStudioRequest,
    )
  ) {
    return generateBlr001StandardQuestionStudioBatch(
      request as Blr001StandardQuestionStudioRequest,
    );
  }
  if (
    isProbabilityStandardQuestionStudioRequest(
      request as ProbabilityStandardQuestionStudioRequest,
    )
  ) {
    return generateProbabilityQuestionStudioBatch(
      request as ProbabilityStandardQuestionStudioRequest,
    );
  }
  return generateLegacyQuestion(request as LegacyQuantV4GenerationRequest);
}

export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
  if (request.examProfile) {
    getQuantV4ExamProfileContract(request.examProfile);
  }

  return withQuantV4ExamProfileContext(request.examProfile, async () => {
    const result = await dispatchGeneration(request);
    return applyQuantV4ExamProfileDelivery(result, request);
  });
}
