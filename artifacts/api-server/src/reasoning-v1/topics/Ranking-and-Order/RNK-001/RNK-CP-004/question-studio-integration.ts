import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../../question-studio/standard-lifecycle";
import {
  buildRnkCp004PermanentRuntime,
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
  type RnkCp004PermanentQuestion,
} from "./cp004-permanent-runtime-v1";

export const RNK_CP004_QUESTION_STUDIO_PACKAGE_ID = "RNK-CP-004" as const;

export const RNK_CP004_STANDARD_QUESTION_STUDIO_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: RNK_CP004_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Ranking and Order",
  subtopic: "Multi-Entity Comparison and Explicit Order Reconstruction",
  label: "Reasoning · Ranking and Order · RNK-CP-004",
  enabled: true,
  cpIds: ["RNK-CP-004"],
  supportedLanguages: ["en"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
  metadata: {
    chapterId: "RNK-001",
    permanentQlIds: RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
    permanentQuestionCount: 1728,
    sourceAuthority: "RNK_CP004_PERMANENT_RUNTIME_V1",
    englishFrozen: true,
    deterministicGeneration: true,
  },
};

let frozenRuntime: readonly RnkCp004PermanentQuestion[] | undefined;

function bank(): readonly RnkCp004PermanentQuestion[] {
  return frozenRuntime ??= buildRnkCp004PermanentRuntime();
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function difficulty(value: unknown): "Easy" | "Medium" | "Hard" | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error("RNK-CP-004 difficulty must be Easy, Medium, Hard or Mixed.");
}

function selector(request: QuestionStudioGenerationRequest): string {
  return String(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId
    ?? "",
  ).trim().toUpperCase();
}

export function isRnkCp004QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === RNK_CP004_QUESTION_STUDIO_PACKAGE_ID;
  const selected = selector(request);
  if (selected.startsWith("RNK-QL-")) {
    return RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.some((entry) => entry.qlId === selected);
  }
  return selected === RNK_CP004_QUESTION_STUDIO_PACKAGE_ID;
}

function optionText(option: any): string {
  return String(option?.label ?? option?.text ?? option?.value ?? option);
}

function explanationText(question: RnkCp004PermanentQuestion): string {
  const visible = (question as any).visibleExplanation;
  if (typeof visible === "string") return visible;
  if (Array.isArray(visible)) return visible.map(String).join("\n\n");
  const explanation = (question as any).explanation;
  if (typeof explanation === "string") return explanation;
  if (Array.isArray(explanation)) return explanation.map(String).join("\n\n");
  return String(explanation?.conclusion ?? explanation?.summary ?? "The unique reconstructed order gives the stated answer.");
}

function normalizedQuestion(question: RnkCp004PermanentQuestion, index: number) {
  const qlId = question.reviewMetadata.permanentProfile.permanentQlId;
  const options = question.options.map(optionText);
  const correctIndex = Number((question as any).correctIndex ?? question.options.findIndex((item: any) => item.answerKey === (question as any).answerKey));
  const answer = String((question as any).answer ?? options[correctIndex] ?? "");
  const difficultyLabel = String(question.difficulty) as "Easy" | "Medium" | "Hard";
  const questionId = `RNK-CP-004:${qlId}:${question.seed}:${index}`;

  return {
    ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
    id: questionId,
    questionId,
    packageId: RNK_CP004_QUESTION_STUDIO_PACKAGE_ID,
    patternId: qlId,
    qlId,
    cpId: "RNK-CP-004",
    checkpointId: "RNK-CP-004",
    subject: "Reasoning",
    topic: "Ranking and Order",
    subtopic: "Multi-Entity Comparison and Explicit Order Reconstruction",
    language: "en",
    locale: "en-IN",
    stem: question.stem,
    text: question.stem,
    options,
    correctIndex,
    correct: correctIndex,
    answer,
    canonicalAnswer: answer,
    explanation: explanationText(question),
    difficulty: difficultyLabel,
    difficultyLabel,
    generationSeed: String(question.seed),
    numericSeed: question.seed,
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
      chapterId: "RNK-001",
      checkpointId: "RNK-CP-004",
      qlId,
      prototypeId: question.prototypeId,
      mathematicalFingerprint: question.mathematicalFingerprint,
      normalizedSemanticFingerprint: question.reviewMetadata.normalizedSemanticFingerprint,
      permanentRuntimeVersion: question.reviewMetadata.permanentProfile.runtimeVersion,
    },
  };
}

export async function generateRnkCp004QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
) {
  const language = request.language ?? "en";
  if (language !== "en") {
    throw new Error("RNK-CP-004 Question Studio route is English-only until multilingual freeze.");
  }

  const requestedDifficulty = difficulty(request.difficulty);
  const selected = selector(request);
  const selectedQl = selected.startsWith("RNK-QL-") ? selected : undefined;
  const eligible = bank().filter((question) => {
    const qlId = question.reviewMetadata.permanentProfile.permanentQlId;
    return (!selectedQl || qlId === selectedQl)
      && (!requestedDifficulty || String(question.difficulty) === requestedDifficulty);
  });
  if (!eligible.length) {
    throw new Error("RNK-CP-004 has no frozen permanent questions matching the requested filters.");
  }

  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const seed = String(request.seed ?? "rnk-cp004-question-studio-v1");
  const ordered = [...eligible]
    .map((question, index) => ({ question, score: hash(seed + ":" + index) }))
    .sort((left, right) => left.score - right.score)
    .map((entry) => entry.question);

  const selectedQuestions = Array.from({ length: count }, (_, index) =>
    ordered[index % ordered.length]!,
  ).map(normalizedQuestion);

  return {
    questions: selectedQuestions,
    generationContext: {
      engineId: "reasoning-v1",
      packageId: RNK_CP004_QUESTION_STUDIO_PACKAGE_ID,
      language: "en",
      requestedDifficulty: requestedDifficulty ?? "Mixed",
      seed,
      count,
      runtimeMode: "review-only",
      reviewOnly: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      chapterId: "RNK-001",
      checkpointId: "RNK-CP-004",
    },
  };
}
