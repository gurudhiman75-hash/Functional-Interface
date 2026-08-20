export * from "./shared-generation-engine-base-v1";

import {
  generateQuestion as generateBaseQuestion,
  isRnk001QuestionStudioRequest,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-base-v1";
import {
  RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview,
  type RnkQuestionStudioDifficulty,
  type RnkQuestionStudioExamProfileId,
  type RnkQuestionStudioLanguage,
  type RnkQuestionStudioReviewQuestion,
} from "../reasoning-v1/topics/Ranking-and-Order/RNK-001/question-studio-review";
import {
  buildRnk001QuestionStudioPayload,
  RNK_001_QUESTION_STUDIO_REVISION_POLICY,
} from "../reasoning-v1/topics/Ranking-and-Order/RNK-001/question-studio-payload";

function normalizeRnkLanguage(value: unknown): RnkQuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`RNK-001 does not support Question Studio language '${language}'.`);
}

function normalizeRnkDifficulty(value: unknown): RnkQuestionStudioDifficulty | "Mixed" | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  if (text === "mixed") return "Mixed";
  throw new Error(`RNK-001 does not support Question Studio difficulty ${String(value)}.`);
}

function normalizeRnkExamProfile(value: unknown): RnkQuestionStudioExamProfileId {
  const profile = String(value ?? "CHAPTER_COVERAGE").trim().toUpperCase();
  const allowed = new Set<string>([
    "CHAPTER_COVERAGE",
    ...RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedExamProfiles,
  ]);
  if (!allowed.has(profile)) throw new Error(`Unsupported RNK-001 exam profile '${String(value)}'.`);
  return profile as RnkQuestionStudioExamProfileId;
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

const qls = listRnk001QuestionStudioQlIds();
const RNK_CP_QLS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "RNK-CP-001": qls.slice(0, 9),
  "RNK-CP-002": qls.slice(9, 17),
  "RNK-CP-003": qls.slice(17, 26),
  "RNK-CP-004": qls.slice(26, 35),
  "RNK-CP-005": qls.slice(35, 38),
  "RNK-CP-006": qls.slice(38, 41),
  "RNK-CP-007": qls.slice(41, 42),
});

function generateRnkCheckpointBatch(
  checkpointId: string,
  language: RnkQuestionStudioLanguage,
  difficulty: RnkQuestionStudioDifficulty | "Mixed" | undefined,
  examProfileId: RnkQuestionStudioExamProfileId,
  batchSeed: string,
  count: number,
): readonly RnkQuestionStudioReviewQuestion[] {
  const checkpointQls = RNK_CP_QLS[checkpointId];
  if (!checkpointQls) throw new Error(`Unsupported RNK-001 checkpoint '${checkpointId}'.`);
  return Array.from({ length: count }, (_, index) => {
    const qlId = checkpointQls[stableHash(`${batchSeed}:${checkpointId}:${index}`) % checkpointQls.length]!;
    return previewRnk001QuestionStudioReview({
      language,
      qlId,
      difficulty,
      examProfileId,
      seed: `${batchSeed}:${checkpointId}:${index}`,
      count: 1,
    }).questions[0]!;
  });
}

function patchRnkPayload(payload: any) {
  return {
    ...payload,
    generationContext: {
      ...payload.generationContext,
      englishOnlyUntilMultilingualConsolidation: false,
    },
  };
}

function patchRnkResult(result: any, language: RnkQuestionStudioLanguage) {
  return {
    ...result,
    generationContext: {
      ...result.generationContext,
      language,
      runtimeMode: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
      releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
      englishOnlyUntilMultilingualConsolidation: false,
      percentageAdapterStatus: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.percentageAdapterStatus,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
    questions: Array.isArray(result.questions) ? result.questions.map(patchRnkPayload) : result.questions,
  };
}

async function generateRnkMultilingualQuestionStudioQuestions(
  request: SharedQuestionStudioGenerationRequest,
  language: Exclude<RnkQuestionStudioLanguage, "en">,
) {
  const difficulty = normalizeRnkDifficulty(request.difficulty);
  const examProfileId = normalizeRnkExamProfile(request.examProfileId);
  const requestedQlId = String(request.patternId ?? request.canonicalProblemId ?? "").startsWith("RNK-QL-")
    ? String(request.patternId ?? request.canonicalProblemId)
    : undefined;
  const checkpointId = String(request.cpId ?? "").startsWith("RNK-CP-")
    ? String(request.cpId)
    : undefined;
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed?.trim()
    || `question-studio:RNK-001:${language}:${examProfileId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  let questionPackages: readonly RnkQuestionStudioReviewQuestion[];
  if (requestedQlId) {
    questionPackages = previewRnk001QuestionStudioReview({
      language,
      qlId: requestedQlId,
      difficulty,
      examProfileId,
      seed: batchSeed,
      count,
    }).questions;
  } else if (checkpointId) {
    questionPackages = generateRnkCheckpointBatch(
      checkpointId,
      language,
      difficulty,
      examProfileId,
      batchSeed,
      count,
    );
  } else {
    questionPackages = previewRnk001QuestionStudioReview({
      language,
      difficulty,
      examProfileId,
      seed: batchSeed,
      count,
    }).questions;
  }

  const questions = questionPackages.map((question) => patchRnkPayload(buildRnk001QuestionStudioPayload(question)));
  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "RNK-001",
      chapterId: "RNK-001",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
      lifecycleStatus: "REVIEW_ONLY",
      permanentQlCount: 42,
      permanentQlRange: "RNK-QL-001..042",
      permanentQlAllocationStatus: "ALLOCATED_FROZEN",
      examProfileId,
      difficulty: difficulty ?? "Mixed",
      language,
      checkpointId: checkpointId ?? null,
      qlId: requestedQlId ?? null,
      revisionPolicy: RNK_001_QUESTION_STUDIO_REVISION_POLICY,
      englishOnlyUntilMultilingualConsolidation: false,
      percentageAdapterStatus: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.percentageAdapterStatus,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
    },
    questionPackages,
    questions,
  };
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  if (!isRnk001QuestionStudioRequest(request)) return generateBaseQuestion(request);
  const language = normalizeRnkLanguage(request.language);
  if (language === "en") {
    return patchRnkResult(await generateBaseQuestion({ ...request, language: "en" }), language);
  }
  return generateRnkMultilingualQuestionStudioQuestions(request, language);
}
