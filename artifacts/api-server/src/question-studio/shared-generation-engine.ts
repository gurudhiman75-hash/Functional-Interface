import {
  generateQuestion as generateQuantQuestionStudioQuestion,
  listQuantV4Packages,
} from "../quant-v4/question-studio-review-engine";
import {
  buildWor001QuestionStudioPayload,
  WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-payload";
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
): string[] {
  const prototypes = WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.prototypes.filter((prototype) =>
    !difficulty || prototype.supportedDifficulties.includes(difficulty),
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
    cpIds: pkg.checkpoints.map((entry) => entry.checkpointId),
    canonicalProblems: pkg.checkpoints.map((entry) => ({
      id: entry.checkpointId,
      label: entry.title,
    })),
    supportedDifficulties: [...pkg.supportedDifficulties],
    supportedLanguages: [...pkg.supportedLanguages],
    enabled: pkg.questionStudioVisible,
    runtimeMode: pkg.runtimeMode,
    supportedRuntimeModes: [pkg.runtimeMode],
    reviewStatus: pkg.reviewStatus,
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
  if (!packages.some((entry) => String(entry.packageId) === "WOR-001")) {
    packages.push(worPackageCapability());
  }
  return packages.sort((left, right) =>
    String(left.packageId).localeCompare(String(right.packageId)),
  );
}

async function generateWor001QuestionStudioQuestions(request: SharedQuestionStudioGenerationRequest) {
  const language = normalizeWorLanguage(request.language);
  const difficulty = normalizeWorDifficulty(request.difficulty);
  const requestedPrototypeId = String(request.patternId ?? "").startsWith("WOR-PROT-")
    ? String(request.patternId)
    : String(request.canonicalProblemId ?? "").startsWith("WOR-PROT-")
      ? String(request.canonicalProblemId)
      : undefined;
  const checkpointId = String(request.cpId ?? request.canonicalProblemId ?? "").startsWith("WOR-CP-")
    ? String(request.cpId ?? request.canonicalProblemId)
    : undefined;
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed?.trim()
    || `question-studio:WOR-001:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  let questionPackages: readonly WorQuestionStudioReviewQuestion[];
  if (requestedPrototypeId || checkpointId) {
    questionPackages = previewWor001QuestionStudioReview({
      language,
      checkpointId: checkpointId as any,
      prototypeId: requestedPrototypeId,
      difficulty,
      seed: batchSeed,
      count,
    }).questions;
  } else {
    const prototypeIds = orderedWorPrototypeIds(batchSeed, difficulty);
    if (prototypeIds.length === 0) {
      throw new Error("No WOR-001 prototypes support the requested difficulty.");
    }
    questionPackages = Array.from({ length: count }, (_, index) => {
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

  const questions = questionPackages.map((question) => buildWor001QuestionStudioPayload(question));

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "WOR-001",
      chapterId: "WOR-001",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
      lifecycleStatus: "REVIEW_ONLY",
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
  if (isWor001QuestionStudioRequest(request)) {
    return generateWor001QuestionStudioQuestions(request);
  }
  return generateQuantQuestionStudioQuestion(request as any);
}
