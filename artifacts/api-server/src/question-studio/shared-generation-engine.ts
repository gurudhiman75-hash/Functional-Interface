import {
  generateQuestion as generateQuantQuestionStudioQuestion,
  listQuantV4Packages,
} from "../quant-v4/question-studio-review-engine";
import {
  buildRnk001QuestionStudioPayload,
  RNK_001_QUESTION_STUDIO_REVISION_POLICY,
} from "../reasoning-v1/topics/Ranking-and-Order/RNK-001/question-studio-payload";
import {
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview,
  RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
  type RnkQuestionStudioDifficulty,
  type RnkQuestionStudioExamProfileId,
  type RnkQuestionStudioReviewQuestion,
} from "../reasoning-v1/topics/Ranking-and-Order/RNK-001/question-studio-review";
import type { WorCheckpointId } from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/foundation/types";
import {
  buildWor001QuestionStudioPayload,
  WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-payload";
import {
  assertWor001ProductionQuestionStudioCheckpoint,
  assertWor001ProductionQuestionStudioPrototype,
  isWor001ProductionQuestionStudioPrototype,
  WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS,
  WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS,
  WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS,
  WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES,
  WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS,
  WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-production-authority";
import {
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWor001QuestionStudioReview,
  type WorQuestionStudioDifficulty,
  type WorQuestionStudioLanguage,
  type WorQuestionStudioReviewQuestion,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-review";

export type SharedQuestionStudioGenerationRequest = {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: unknown;
  language?: string;
  seed?: string;
  count?: number;
  runtimeMode?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  examProfileId?: string;
};

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isRnk001QuestionStudioRequest(request: SharedQuestionStudioGenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId ?? request.canonicalProblemId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "rnk 001"
    || patternId.startsWith("rnk ql")
    || subtopic === "ranking order"
    || subtopic === "ranking and order"
    || subtopic === "order and ranking"
    || (topic === "reasoning" && (subtopic === "ranking" || subtopic === "order ranking"))
  );
}

export function isWor001QuestionStudioRequest(request: SharedQuestionStudioGenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "wor 001"
    || patternId.startsWith("wor prot")
    || subtopic === "word dictionary order"
    || subtopic === "word and dictionary order"
    || (topic === "reasoning" && (subtopic === "word order" || subtopic === "dictionary order"))
  );
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

function normalizeRnkLanguage(value: unknown): "en" {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en") return "en";
  throw new Error("RNK-001 Hindi/Punjabi Question Studio delivery remains locked until multilingual lineage consolidation.");
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

function normalizeWorDifficulty(value: unknown): WorQuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  return undefined;
}

function normalizeWorLanguage(value: unknown): WorQuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`WOR-001 does not support Question Studio language ${language}.`);
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

const RNK_CP_QLS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "RNK-CP-001": listRnk001QuestionStudioQlIds().slice(0, 9),
  "RNK-CP-002": listRnk001QuestionStudioQlIds().slice(9, 17),
  "RNK-CP-003": listRnk001QuestionStudioQlIds().slice(17, 26),
  "RNK-CP-004": listRnk001QuestionStudioQlIds().slice(26, 35),
  "RNK-CP-005": listRnk001QuestionStudioQlIds().slice(35, 38),
  "RNK-CP-006": listRnk001QuestionStudioQlIds().slice(38, 41),
  "RNK-CP-007": listRnk001QuestionStudioQlIds().slice(41, 42),
});

function rnkPackageCapability() {
  const pkg = RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE;
  return {
    id: pkg.packageId,
    packageId: pkg.packageId,
    type: "reasoning-v1",
    section: "Reasoning",
    domain: "reasoning",
    subject: pkg.subject,
    topic: pkg.topic,
    subtopic: pkg.subtopic,
    name: `${pkg.packageId} ${pkg.label}`,
    label: pkg.label,
    generationDomain: "reasoning-v1",
    cpIds: Object.keys(RNK_CP_QLS),
    canonicalProblems: listRnk001QuestionStudioQlIds().map((qlId) => ({ id: qlId, label: qlId })),
    prototypeCount: 42,
    supportedDifficulties: [...pkg.supportedDifficulties],
    supportedLanguages: [...pkg.supportedLanguages],
    supportedExamProfiles: [...pkg.supportedExamProfiles],
    enabled: pkg.questionStudioVisible,
    runtimeMode: pkg.runtimeMode,
    supportedRuntimeModes: [pkg.runtimeMode],
    reviewStatus: pkg.reviewStatus,
    releaseFreezeStatus: pkg.releaseFreezeStatus,
    reviewOnly: pkg.reviewOnly,
    permanentQlCount: pkg.permanentQlCount,
    permanentQlRange: pkg.permanentQlRange,
    permanentQlAllocationStatus: pkg.permanentQlAllocationStatus,
    revisionPolicy: RNK_001_QUESTION_STUDIO_REVISION_POLICY,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    publiclyPublishable: pkg.publiclyPublishable,
    englishOnlyUntilMultilingualConsolidation: pkg.englishOnlyUntilMultilingualConsolidation,
    percentageAdapterStatus: pkg.percentageAdapterStatus,
  };
}

function orderedWorPrototypeIds(
  batchSeed: string,
  difficulty: WorQuestionStudioDifficulty | undefined,
  checkpointId?: WorCheckpointId,
): string[] {
  const prototypes = WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.prototypes.filter((prototype) =>
    isWor001ProductionQuestionStudioPrototype(prototype.prototypeId)
    && (!checkpointId || prototype.checkpointId === checkpointId)
    && (!difficulty || prototype.supportedDifficulties.includes(difficulty)),
  );
  return [...prototypes]
    .sort((left, right) => {
      const leftRank = stableHash(`${batchSeed}:prototype:${left.prototypeId}`);
      const rightRank = stableHash(`${batchSeed}:prototype:${right.prototypeId}`);
      return leftRank - rightRank || left.prototypeId.localeCompare(right.prototypeId);
    })
    .map((prototype) => prototype.prototypeId);
}

function worPackageCapability() {
  const pkg = WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE;
  return {
    id: pkg.packageId,
    packageId: pkg.packageId,
    type: "reasoning-v1",
    section: "Reasoning",
    domain: "reasoning",
    subject: pkg.subject,
    topic: pkg.topic,
    subtopic: pkg.subtopic,
    name: `${pkg.packageId} ${pkg.label}`,
    label: pkg.label,
    generationDomain: "reasoning-v1",
    cpIds: WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS.map((entry) => entry.checkpointId),
    canonicalProblems: WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS.map((entry) => ({
      id: entry.checkpointId,
      label: entry.title,
    })),
    prototypeCount: WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.length,
    sourceDeferredPrototypeCount: WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS.length,
    supportedDifficulties: [...pkg.supportedDifficulties],
    supportedLanguages: [...pkg.supportedLanguages],
    enabled: pkg.questionStudioVisible,
    runtimeMode: pkg.runtimeMode,
    supportedRuntimeModes: [pkg.runtimeMode],
    reviewStatus: WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS,
    examReadinessStatus: WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS,
    englishContentReviewStatus: WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS,
    releaseFreezeStatus: WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
    reviewOnly: pkg.reviewOnly,
    permanentQlCount: pkg.permanentQlCount,
    permanentQlAllocationStatus: pkg.permanentQlAllocationStatus,
    revisionPolicy: "SOURCE_GENERATOR_ONLY",
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    publiclyPublishable: pkg.publiclyPublishable,
  };
}

export function listQuestionStudioPackages() {
  const packages = [...listQuantV4Packages()] as any[];
  if (!packages.some((entry) => String(entry.packageId) === "RNK-001")) {
    packages.push(rnkPackageCapability());
  }
  if (!packages.some((entry) => String(entry.packageId) === "WOR-001")) {
    packages.push(worPackageCapability());
  }
  return packages.sort((left, right) =>
    String(left.packageId).localeCompare(String(right.packageId)),
  );
}

function generateRnkCheckpointBatch(
  checkpointId: string,
  language: "en",
  difficulty: RnkQuestionStudioDifficulty | "Mixed" | undefined,
  examProfileId: RnkQuestionStudioExamProfileId,
  batchSeed: string,
  count: number,
): readonly RnkQuestionStudioReviewQuestion[] {
  const qls = RNK_CP_QLS[checkpointId];
  if (!qls) throw new Error(`Unsupported RNK-001 checkpoint '${checkpointId}'.`);
  return Array.from({ length: count }, (_, index) => {
    const qlId = qls[stableHash(`${batchSeed}:${checkpointId}:${index}`) % qls.length]!;
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

async function generateRnk001QuestionStudioQuestions(request: SharedQuestionStudioGenerationRequest) {
  const language = normalizeRnkLanguage(request.language);
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
    || `question-studio:RNK-001:${examProfileId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

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

  const questions = questionPackages.map((question) => buildRnk001QuestionStudioPayload(question));
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
      englishOnlyUntilMultilingualConsolidation: true,
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

function generateWorProductionBatch(
  prototypeIds: readonly string[],
  language: WorQuestionStudioLanguage,
  difficulty: WorQuestionStudioDifficulty | undefined,
  batchSeed: string,
  count: number,
): readonly WorQuestionStudioReviewQuestion[] {
  if (prototypeIds.length === 0) {
    throw new Error("No frozen WOR-001 production prototypes support the requested Question Studio filters.");
  }
  return Array.from({ length: count }, (_, index) => {
    const prototypeId = prototypeIds[index % prototypeIds.length]!;
    const preview = previewWor001QuestionStudioReview({
      language,
      prototypeId,
      difficulty,
      seed: `${batchSeed}:item:${index}`,
      count: 1,
    });
    return preview.questions[0]!;
  });
}

async function generateWor001QuestionStudioQuestions(request: SharedQuestionStudioGenerationRequest) {
  const language = normalizeWorLanguage(request.language);
  const difficulty = normalizeWorDifficulty(request.difficulty);
  const requestedPrototypeId = String(request.patternId ?? "").startsWith("WOR-PROT-")
    ? String(request.patternId)
    : String(request.canonicalProblemId ?? "").startsWith("WOR-PROT-")
      ? String(request.canonicalProblemId)
      : undefined;
  const checkpointSelector = String(request.cpId ?? request.canonicalProblemId ?? "");
  const checkpointId: WorCheckpointId | undefined = checkpointSelector.startsWith("WOR-CP-")
    ? checkpointSelector as WorCheckpointId
    : undefined;
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed?.trim()
    || `question-studio:WOR-001:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  let questionPackages: readonly WorQuestionStudioReviewQuestion[];
  if (requestedPrototypeId) {
    assertWor001ProductionQuestionStudioPrototype(requestedPrototypeId);
    questionPackages = previewWor001QuestionStudioReview({
      language,
      prototypeId: requestedPrototypeId,
      difficulty,
      seed: batchSeed,
      count,
    }).questions;
  } else {
    if (checkpointId) assertWor001ProductionQuestionStudioCheckpoint(checkpointId);
    const prototypeIds = orderedWorPrototypeIds(batchSeed, difficulty, checkpointId);
    questionPackages = generateWorProductionBatch(
      prototypeIds,
      language,
      difficulty,
      batchSeed,
      count,
    );
  }

  const questions = questionPackages.map((question) => buildWor001QuestionStudioPayload(question));

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "WOR-001",
      chapterId: "WOR-001",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS,
      examReadinessStatus: WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS,
      englishContentReviewStatus: WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS,
      lifecycleStatus: "REVIEW_ONLY",
      productionPrototypeCount: WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.length,
      sourceDeferredPrototypeCount: WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS.length,
      permanentQlCount: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount,
      permanentQlAllocationStatus: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlAllocationStatus,
      revisionPolicy: "SOURCE_GENERATOR_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      releaseFreezeStatus: WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
      language,
      checkpointId: checkpointId ?? null,
      prototypeId: requestedPrototypeId ?? null,
    },
    questionPackages,
    questions,
  };
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  if (isRnk001QuestionStudioRequest(request)) {
    return generateRnk001QuestionStudioQuestions(request);
  }
  if (isWor001QuestionStudioRequest(request)) {
    return generateWor001QuestionStudioQuestions(request);
  }
  return generateQuantQuestionStudioQuestion(request as any);
}
