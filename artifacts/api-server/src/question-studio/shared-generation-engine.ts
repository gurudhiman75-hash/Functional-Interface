import {
  generateQuestion as generateQuantQuestionStudioQuestion,
  listQuantV4Packages,
} from "../quant-v4/question-studio-review-engine";
import {
  generateNumCp008QuestionStudioBatch,
  isNumCp008QuestionStudioRequest,
  listNumCp008QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-008/question-studio-integration";
import {
  generateNumCp009QuestionStudioBatch,
  isNumCp009QuestionStudioRequest,
  listNumCp009QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-009/question-studio-integration";
import {
  generateNumCp010QuestionStudioBatch,
  isNumCp010QuestionStudioRequest,
  listNumCp010QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-010/question-studio-integration";
import {
  buildSta001QuestionStudioPayload,
  STA_001_QUESTION_STUDIO_REVISION_POLICY,
} from "../reasoning-v1/topics/Statement-and-Assumption/STA-001/question-studio-payload";
import {
  STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  STA_001_QUESTION_STUDIO_REVIEW_STATUS,
  previewSta001QuestionStudioReview,
  type StaQuestionStudioCheckpointId,
  type StaQuestionStudioDifficulty,
  type StaQuestionStudioLanguage,
  type StaQuestionStudioProfileId,
  type StaQuestionStudioQlId,
} from "../reasoning-v1/topics/Statement-and-Assumption/STA-001/question-studio-review";
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
};

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export { isNumCp008QuestionStudioRequest, isNumCp009QuestionStudioRequest, isNumCp010QuestionStudioRequest };

export function isSta001QuestionStudioRequest(request: SharedQuestionStudioGenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const canonicalProblemId = normalizeSelector(request.canonicalProblemId);
  const checkpointId = normalizeSelector(request.cpId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "sta 001"
    || canonicalProblemId.startsWith("sta ql")
    || checkpointId.startsWith("sta cp")
    || subtopic === "statement assumption"
    || subtopic === "statement and assumption"
    || (topic === "reasoning" && subtopic === "assumption")
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

function normalizeStaDifficulty(value: unknown): StaQuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  return undefined;
}

function normalizeStaLanguage(value: unknown): StaQuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`STA-001 does not support Question Studio language ${language}.`);
}

function normalizeStaProfile(value: unknown): StaQuestionStudioProfileId | undefined {
  const requested = String(value ?? "").trim().toUpperCase();
  if (!requested) return undefined;
  const match = STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.find((entry) => entry.profileId === requested);
  return match?.profileId;
}

function normalizeStaQl(value: unknown): StaQuestionStudioQlId | undefined {
  const requested = String(value ?? "").trim().toUpperCase();
  if (!requested.startsWith("STA-QL-")) return undefined;
  if (!(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds as readonly string[]).includes(requested)) {
    throw new Error(`Unsupported STA V4 QL '${requested}'.`);
  }
  return requested as StaQuestionStudioQlId;
}

function normalizeStaCheckpoint(value: unknown): StaQuestionStudioCheckpointId | undefined {
  const requested = String(value ?? "").trim().toUpperCase();
  if (!requested.startsWith("STA-CP-")) return undefined;
  if (!STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpoints.some((entry) => entry.checkpointId === requested)) {
    throw new Error(`Unsupported STA V4 checkpoint '${requested}'.`);
  }
  return requested as StaQuestionStudioCheckpointId;
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

function staPackageCapability() {
  const pkg = STA_001_QUESTION_STUDIO_REVIEW_PACKAGE;
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
    cpIds: pkg.checkpoints.map((entry) => entry.checkpointId),
    canonicalProblems: pkg.qls.map((entry) => ({
      id: entry.qlId,
      label: `${entry.qlId} — ${entry.semanticAuthority}`,
      checkpointId: entry.checkpointId,
    })),
    presentationProfiles: pkg.presentationProfiles.map((entry) => ({ ...entry })),
    patternIds: pkg.presentationProfiles.map((entry) => entry.profileId),
    permanentQlCount: pkg.permanentQlCount,
    permanentQlIds: [...pkg.permanentQlIds],
    permanentQlAllocationStatus: pkg.permanentQlAllocationStatus,
    supportedDifficulties: [...pkg.supportedDifficulties],
    supportedLanguages: [...pkg.supportedLanguages],
    enabled: pkg.questionStudioVisible,
    runtimeMode: pkg.runtimeMode,
    supportedRuntimeModes: [pkg.runtimeMode],
    reviewStatus: pkg.reviewStatus,
    releaseFreezeStatus: pkg.releaseFreezeStatus,
    reviewOnly: pkg.reviewOnly,
    revisionPolicy: STA_001_QUESTION_STUDIO_REVISION_POLICY,
    multilingualChapterFrozen: pkg.multilingualChapterFrozen,
    sourceRuntimeQuestionStudioDiscoverable: pkg.sourceRuntimeQuestionStudioDiscoverable,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    testEligible: pkg.testEligible,
    mockTestEligible: pkg.mockTestEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    automaticStudentPublication: pkg.automaticStudentPublication,
  };
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

function num002PackageCapability() {
  const cp008 = listNumCp008QuestionStudioPackages()[0]!;
  const cp009 = listNumCp009QuestionStudioPackages()[0]!;
  const cp010 = listNumCp010QuestionStudioPackages()[0]!;
  return Object.freeze({
    ...cp008,
    name: "NUM-002 Number System — Remainders, Cyclicity & Digit Structure",
    label: "Number System — Remainders, Cyclicity & Digit Structure",
    cpIds: Object.freeze([...cp008.cpIds, ...cp009.cpIds, ...cp010.cpIds]),
    canonicalProblems: Object.freeze([
      ...cp008.canonicalProblems,
      ...cp009.canonicalProblems,
      ...cp010.canonicalProblems,
    ]),
    permanentQlCount: cp008.permanentQlCount + cp009.permanentQlCount + cp010.permanentQlCount,
    permanentQlIds: Object.freeze([
      ...cp008.permanentQlIds,
      ...cp009.permanentQlIds,
      ...cp010.permanentQlIds,
    ]),
    supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"]),
    supportedLanguages: Object.freeze(["en", "hi", "pa"]),
    releaseId: "NUM-002-QS-CP008-CP010-MULTILINGUAL-FROZEN-V1",
    checkpointReleaseIds: Object.freeze([cp008.releaseId, cp009.releaseId, cp010.releaseId]),
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  });
}

export function listQuestionStudioPackages() {
  const packages = [...listQuantV4Packages()] as any[];
  const num002Package = num002PackageCapability();
  const existingIndex = packages.findIndex((entry) => String(entry.packageId) === num002Package.packageId);
  if (existingIndex >= 0) packages.splice(existingIndex, 1, num002Package);
  else packages.push(num002Package);

  if (!packages.some((entry) => String(entry.packageId) === "STA-001")) {
    packages.push(staPackageCapability());
  }
  if (!packages.some((entry) => String(entry.packageId) === "WOR-001")) {
    packages.push(worPackageCapability());
  }
  return packages.sort((left, right) =>
    String(left.packageId).localeCompare(String(right.packageId)),
  );
}

async function generateSta001QuestionStudioQuestions(request: SharedQuestionStudioGenerationRequest) {
  const language = normalizeStaLanguage(request.language);
  const difficulty = normalizeStaDifficulty(request.difficulty);
  const profileId = normalizeStaProfile(request.patternId);
  if (request.patternId && !profileId && !String(request.patternId).toUpperCase().startsWith("STA-QL-")) {
    throw new Error(`Unsupported STA presentation profile '${request.patternId}'.`);
  }
  const qlId = normalizeStaQl(
    String(request.canonicalProblemId ?? "").toUpperCase().startsWith("STA-QL-")
      ? request.canonicalProblemId
      : request.patternId,
  );
  const checkpointId = normalizeStaCheckpoint(request.cpId);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed?.trim()
    || `question-studio:STA-001:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const preview = previewSta001QuestionStudioReview({
    language,
    qlId,
    checkpointId,
    profileId,
    difficulty,
    seed: batchSeed,
    count,
  });
  const questionPackages = preview.questions;
  const questions = questionPackages.map((question) => buildSta001QuestionStudioPayload(question));
  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "STA-001",
      chapterId: "REAS-STA",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: STA_001_QUESTION_STUDIO_REVIEW_STATUS,
      lifecycleStatus: "REVIEW_ONLY",
      multilingualChapterFrozen: STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen,
      permanentQlCount: STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount,
      permanentQlIds: [...STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds],
      permanentQlAllocationStatus: STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlAllocationStatus,
      revisionPolicy: STA_001_QUESTION_STUDIO_REVISION_POLICY,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      releaseFreezeStatus: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
      language,
      checkpointId: checkpointId ?? null,
      qlId: qlId ?? null,
      profileId: profileId ?? null,
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
  if (isNumCp010QuestionStudioRequest(request)) {
    return generateNumCp010QuestionStudioBatch(request);
  }
  if (isNumCp009QuestionStudioRequest(request)) {
    return generateNumCp009QuestionStudioBatch(request);
  }
  if (isNumCp008QuestionStudioRequest(request)) {
    return generateNumCp008QuestionStudioBatch(request);
  }
  if (isSta001QuestionStudioRequest(request)) {
    return generateSta001QuestionStudioQuestions(request);
  }
  if (isWor001QuestionStudioRequest(request)) {
    return generateWor001QuestionStudioQuestions(request);
  }
  return generateQuantQuestionStudioQuestion(request as any);
}
