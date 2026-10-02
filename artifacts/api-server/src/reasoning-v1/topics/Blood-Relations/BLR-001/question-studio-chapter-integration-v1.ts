import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "./question-studio-standard-integration";

export const BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID = "BLR-001" as const;

const sourcePackages = listBlr001StandardQuestionStudioPackages();
const sourcePackageIds = sourcePackages.map((entry) => entry.packageId);
const sourceCheckpointIds = sourcePackages.map((entry) => entry.checkpointId);
const sourceQlIds = sourcePackages.flatMap((entry) => entry.qlIds);

export const BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Blood Relations",
  subtopic: "Blood Relations",
  label: "Reasoning · Blood Relations · BLR-001",
  enabled: true,
  cpIds: [...sourceCheckpointIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleId: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
  lifecycleStage: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.stage,
  reviewSurfaceRequired: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.reviewSurfaceRequired,
  manualApprovalRequired: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.manualApprovalRequired,
  questionBankStatus: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.questionBankStatus,
  questionBankWritable: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.questionBankWritable,
  testEligibility: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.testEligibility,
  testEligible: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.testEligible,
  mockTestEligible: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.mockTestEligible,
  publiclyPublishable: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.publiclyPublishable,
  automaticStudentPublication: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.automaticStudentPublication,
  productionReleaseAuthorized: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.productionReleaseAuthorized,
  metadata: {
    chapterId: "BLR-001",
    sourcePackageIds,
    sourceCheckpointIds,
    permanentQlCount: sourceQlIds.length,
    deterministicChapterAggregation: true,
    cpSpecificRequestsPreserved: true,
  },
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeDifficulty(value: unknown): "Easy" | "Medium" | "Hard" | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error("BLR-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function qlOwner(qlId: string) {
  return sourcePackages.find((entry) => entry.qlIds.includes(qlId as never));
}

function checkpointOwner(checkpointId: string) {
  return sourcePackages.find((entry) => entry.checkpointId === checkpointId);
}

function explicitScope(request: QuestionStudioGenerationRequest) {
  const selector = text(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId,
  ).toUpperCase();
  if (!selector || selector === BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID) {
    return { qlId: undefined, checkpointId: undefined };
  }
  if (selector.startsWith("BLR-QL-")) {
    const owner = qlOwner(selector);
    if (!owner) throw new Error("Unknown BLR-001 QL selector " + selector);
    return { qlId: selector, checkpointId: owner.checkpointId };
  }
  if (selector.startsWith("BLR-CP-")) {
    const owner = checkpointOwner(selector);
    if (!owner) throw new Error("Unknown BLR-001 checkpoint selector " + selector);
    return { qlId: undefined, checkpointId: selector };
  }
  throw new Error("Unknown BLR-001 selector " + selector);
}

export function isBlr001ChapterQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID;

  const selector = text(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId,
  ).toUpperCase();
  if (selector.startsWith("BLR-QL-") || selector === BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return (
    topic === "blood relations"
    || subtopic === "blood relations"
    || (topic === "reasoning" && subtopic.includes("blood"))
  );
}

function stableSourceOrder(seed: string) {
  return [...sourcePackages]
    .map((entry, index) => ({
      entry,
      score: hash(seed + ":" + entry.packageId + ":" + index),
    }))
    .sort((left, right) => left.score - right.score)
    .map(({ entry }) => entry);
}

export async function generateBlr001ChapterQuestionStudioBatch(
  request: QuestionStudioGenerationRequest = {},
) {
  const language = request.language ?? "en";
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const baseSeed = text(request.seed) || "blr001-chapter-question-studio-v1";
  const scope = explicitScope(request);

  const eligiblePackages = scope.checkpointId
    ? sourcePackages.filter((entry) => entry.checkpointId === scope.checkpointId)
    : stableSourceOrder(baseSeed);

  if (!eligiblePackages.length) {
    throw new Error("BLR-001 chapter route has no source package for the requested scope.");
  }

  const questions: Record<string, unknown>[] = [];
  const sourcePackageUsage: string[] = [];

  for (let index = 0; index < count; index += 1) {
    let generated: Awaited<ReturnType<typeof generateBlr001StandardQuestionStudioBatch>> | null = null;
    let sourcePackageId = "";
    let lastError: unknown = null;

    for (let offset = 0; offset < eligiblePackages.length; offset += 1) {
      const source = eligiblePackages[(index + offset) % eligiblePackages.length]!;
      try {
        generated = await generateBlr001StandardQuestionStudioBatch({
          packageId: source.packageId,
          canonicalProblemId: scope.qlId,
          language,
          difficulty,
          seed: baseSeed + ":" + source.packageId + ":" + index,
          count: 1,
        });
        sourcePackageId = source.packageId;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!generated || generated.questions.length !== 1) {
      if (lastError instanceof Error) throw lastError;
      throw new Error("BLR-001 could not generate a source-backed question for the requested filters.");
    }

    const sourceQuestion = generated.questions[0]!;
    const sourcePackage = sourcePackageId;
    const sourceCheckpoint = String(sourceQuestion.checkpointId ?? "");
    const sourceQl = String(sourceQuestion.qlId ?? "");
    const questionId = "BLR-001:" + sourcePackage + ":" + String(sourceQuestion.questionId ?? index);

    questions.push({
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      ...sourceQuestion,
      id: questionId,
      questionId,
      packageId: BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID,
      patternId: sourceQl || sourcePackage,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      traceability: {
        ...(typeof sourceQuestion.traceability === "object" && sourceQuestion.traceability
          ? sourceQuestion.traceability as Record<string, unknown>
          : {}),
        chapterPackageId: BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID,
        sourcePackageId: sourcePackage,
        sourceCheckpointId: sourceCheckpoint,
        sourceQlId: sourceQl,
      },
    });
    sourcePackageUsage.push(sourcePackage);
  }

  return {
    questions,
    generationContext: {
      engineId: "reasoning-v1",
      packageId: BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "BLR-001",
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      seed: baseSeed,
      count,
      runtimeMode: "review-only",
      lifecycleId: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
      lifecycleStage: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.stage,
      reviewOnly: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      sourcePackageUsage,
      explicitScopePreserved: Boolean(scope.qlId || scope.checkpointId),
    },
  };
}
