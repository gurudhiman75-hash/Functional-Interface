import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "./question-studio-standard-integration";

export const BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "BLR-001" as const;

const SOURCE_PACKAGES = listBlr001StandardQuestionStudioPackages();
const ALL_QL_IDS = SOURCE_PACKAGES.flatMap((entry: any) => entry.qlIds ?? []);
const ALL_CP_IDS = SOURCE_PACKAGES.map((entry: any) => String(entry.checkpointId));

export const BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Blood Relations",
  subtopic: "Blood Relations",
  label: "Reasoning · Blood Relations · BLR-001",
  enabled: true,
  cpIds: [...ALL_CP_IDS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
  lifecycleStage: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.stage,
  metadata: {
    sourcePackageCount: SOURCE_PACKAGES.length,
    qlCount: ALL_QL_IDS.length,
    qlIds: [...ALL_QL_IDS],
    sourceAuthority: "BLR_001_FROZEN_CP_PACKAGE_AGGREGATION",
    deterministicGeneration: true,
    multilingualFreeze: true,
  },
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function explicitSelector(request: QuestionStudioGenerationRequest): string {
  return String(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId
    ?? "",
  ).trim().toUpperCase();
}

function packageForSelector(selector: string): any | undefined {
  if (!selector || selector === BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID) return undefined;
  return SOURCE_PACKAGES.find((entry: any) =>
    String(entry.packageId).toUpperCase() === selector
    || String(entry.checkpointId).toUpperCase() === selector
    || (entry.qlIds as readonly string[]).includes(selector),
  );
}

export function isBlr001ChapterQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID;
  const selector = explicitSelector(request);
  if (selector.startsWith("BLR-QL-") || selector.startsWith("BLR-CP-")) return true;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return topic === "blood relations"
    || subtopic === "blood relations"
    || (topic === "reasoning" && subtopic.includes("blood"));
}

function normalizeQuestion(source: Record<string, any>, sourcePackageId: string) {
  const questionId = String(
    source.questionId
    ?? source.id
    ?? `BLR-001:${source.qlId ?? source.patternId ?? "source"}:${source.seed ?? "0"}`,
  );
  return {
    ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
    ...source,
    id: questionId,
    questionId,
    packageId: BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
    patternId: source.qlId ?? source.patternId ?? source.checkpointId,
    cpId: source.checkpointId ?? source.cpId,
    subject: "Reasoning",
    topic: "Blood Relations",
    subtopic: "Blood Relations",
    text: source.text ?? source.stem,
    stem: source.stem ?? source.text,
    correctIndex: source.correctIndex ?? source.correct,
    correct: source.correctIndex ?? source.correct,
    answer: source.answer ?? source.canonicalAnswer,
    canonicalAnswer: source.canonicalAnswer ?? source.answer,
    reviewOnly: true,
    readOnly: true,
    productionReleased: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    manualApprovalRequired: true,
    traceability: {
      ...(typeof source.traceability === "object" && source.traceability
        ? source.traceability
        : {}),
      chapterPackageId: BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      sourceQuestionStudioPackageId: sourcePackageId,
      sourceCheckpointId: source.checkpointId ?? source.cpId ?? null,
      sourceQlId: source.qlId ?? null,
    },
  };
}

export async function generateBlr001ChapterQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
) {
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const seed = String(request.seed ?? "blr001-question-studio-v1");
  const selector = explicitSelector(request);
  const selected = packageForSelector(selector);

  if (selector && selector !== BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID && !selected) {
    throw new Error("Unknown BLR-001 selector " + selector);
  }

  const questions: Record<string, any>[] = [];
  let attempts = 0;

  while (questions.length < count && attempts < count * Math.max(12, SOURCE_PACKAGES.length * 3)) {
    const sourcePackage = selected
      ?? SOURCE_PACKAGES[
        hashSeed(seed + ":package:" + attempts) % SOURCE_PACKAGES.length
      ]!;
    const qlSelector = selector.startsWith("BLR-QL-") ? selector : undefined;

    try {
      const source = generateBlr001StandardQuestionStudioBatch({
        packageId: sourcePackage.packageId,
        canonicalProblemId: qlSelector,
        language: request.language,
        difficulty: request.difficulty,
        seed: seed + ":" + attempts,
        count: 1,
      } as any);
      const sourceQuestion = source.questions[0];
      if (sourceQuestion) {
        questions.push(normalizeQuestion(sourceQuestion as any, String(sourcePackage.packageId)));
      }
    } catch (error) {
      if (selected) throw error;
    }
    attempts += 1;
  }

  if (questions.length !== count) {
    throw new Error(
      `BLR-001 produced ${questions.length}/${count} questions for the selected filters.`,
    );
  }

  return {
    questions,
    generationContext: {
      engineId: "reasoning-v1",
      packageId: BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      language: request.language ?? "en",
      requestedDifficulty: request.difficulty ?? "Mixed",
      seed,
      count,
      runtimeMode: "review-only",
      reviewOnly: true,
      sourcePackageCount: SOURCE_PACKAGES.length,
      sourcePackages: SOURCE_PACKAGES.map((entry: any) => String(entry.packageId)),
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
