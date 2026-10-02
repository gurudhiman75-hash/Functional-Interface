import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../question-studio/standard-lifecycle";

import {
  ALP_001_QUESTION_STUDIO_REGISTRY,
  type AlpExamProfile,
} from "../topics/Alphabet-Test/ALP-001/question-studio-registry";
import type {
  AlpCheckpointId,
  AlpDifficulty,
  AlpLocale,
} from "../topics/Alphabet-Test/ALP-001/types";

import {
  CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewCae001QuestionStudioReview,
} from "../topics/Cause-and-Effect/CAE-001/question-studio-review";
import type {
  CaeDifficulty,
  CaeLocale,
  CaeQlId,
} from "../topics/Cause-and-Effect/CAE-001/types";

import {
  CAL_001_PACKAGE_ID,
  CAL_001_QUESTION_STUDIO_LANGUAGES,
  generateCal001QuestionStudioBatch,
  isCal001GenerationRequest,
} from "../topics/Calendar/CAL-001/question-studio-runtime";

import {
  generateBlr001StandardQuestionStudioBatch,
  isBlr001StandardQuestionStudioRequest,
  listBlr001StandardQuestionStudioPackages,
} from "../topics/Blood-Relations/BLR-001/question-studio-standard-integration";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

export const ALP_001_SHARED_PACKAGE_ID = "ALP-001" as const;
export const CAE_001_SHARED_PACKAGE_ID = "CAE-001" as const;
export const BLR_001_SHARED_PACKAGE_ID = "BLR-001" as const;

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

function count(value: number | undefined): number {
  const resolved = value ?? 5;
  if (!Number.isInteger(resolved) || resolved < 1 || resolved > 50) {
    throw new Error("Reasoning Question Studio batches require count between 1 and 50.");
  }
  return resolved;
}

function publicDifficulty(value: string): "Easy" | "Medium" | "Hard" {
  const normalized = value.toUpperCase();
  return normalized.includes("EASY")
    ? "Easy"
    : normalized.includes("HARD")
      ? "Hard"
      : "Medium";
}

function alpDifficulty(value: unknown): AlpDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error("ALP-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function alpLocale(language: QuestionStudioGenerationRequest["language"]): AlpLocale {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function alpProfile(exam: unknown): AlpExamProfile {
  const normalized = text(exam).toLowerCase();
  return /punjab|psssb|ppsc|patwari|pspcl/u.test(normalized)
    ? "PUNJAB_STATE_4_OPTION"
    : "SSC_CGL_TIER_I";
}

function alpCheckpoint(value: unknown): AlpCheckpointId | undefined {
  const normalized = text(value).toUpperCase();
  if (/^ALP-CP-\d{3}$/u.test(normalized)) return normalized as AlpCheckpointId;
  return undefined;
}

function alpQl(value: unknown): string | undefined {
  const normalized = text(value).toUpperCase();
  return /^ALP-QL-\d{3}$/u.test(normalized) ? normalized : undefined;
}

export function isAlp001SharedQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const pkg = text(request.packageId).toUpperCase();
  if (pkg) return pkg === ALP_001_SHARED_PACKAGE_ID;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((value) => value.startsWith("ALP-QL-") || value.startsWith("ALP-CP-"))) {
    return true;
  }
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "alphabet test" || subtopic === "alphabet test";
}

export const ALP_001_SHARED_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: ALP_001_SHARED_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Alphabet Test",
  subtopic: "Alphabet Test",
  label: "Reasoning · Alphabet Test · ALP-001",
  enabled: true,
  cpIds: ALP_001_QUESTION_STUDIO_REGISTRY.checkpoints.map((checkpoint) => checkpoint.checkpointId),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    sourceRuntimeVersion: ALP_001_QUESTION_STUDIO_REGISTRY.runtimeVersion,
    qlCount: ALP_001_QUESTION_STUDIO_REGISTRY.qlCount,
    sourceRegistryStatus: ALP_001_QUESTION_STUDIO_REGISTRY.status,
    sharedAdapterLifecycle: "REVIEW_ONLY",
  },
};

export async function generateAlp001SharedQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const total = count(request.count);
  const locale = alpLocale(request.language);
  const difficulty = alpDifficulty(request.difficulty);
  const qlId =
    alpQl(request.questionLanguageId)
    ?? alpQl(request.canonicalProblemId)
    ?? alpQl(request.patternId);
  const checkpointId =
    alpCheckpoint(request.canonicalProblemId)
    ?? alpCheckpoint(request.patternId);
  const baseSeed = text(request.seed) || "alp001-shared-question-studio-v1";
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < total; index += 1) {
    const numericSeed = hash(baseSeed + ":" + index);
    const generated = ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled({
      seed: numericSeed,
      locale,
      examProfile: alpProfile(request.exam),
      difficulty,
      checkpointId,
      qlId,
    });
    const options = generated.options.map((option) => option.value);
    const explanation = [
      generated.explanation.coreConcept,
      ...generated.explanation.steps,
      ...generated.explanation.visualWorking,
      generated.explanation.conclusion,
    ].filter(Boolean).join("\n\n");
    const difficultyLabel = publicDifficulty(generated.difficulty);
    const questionId = "ALP-001:" + generated.qlId + ":" + numericSeed + ":" + locale;

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: ALP_001_SHARED_PACKAGE_ID,
      patternId: generated.qlId,
      qlId: generated.qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      subject: "Reasoning",
      topic: "Alphabet Test",
      subtopic: "Alphabet Test",
      language: locale === "hi-IN" ? "hi" : locale === "pa-IN" ? "pa" : "en",
      locale,
      stem: generated.stem,
      text: generated.stem,
      options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer: generated.answer,
      canonicalAnswer: options[generated.correctIndex],
      explanation,
      packageExplanation: generated.explanation,
      difficulty: difficultyLabel,
      difficultyLabel,
      generationSeed: baseSeed + ":" + index,
      numericSeed,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      traceability: {
        packageId: ALP_001_SHARED_PACKAGE_ID,
        qlId: generated.qlId,
        checkpointId: generated.checkpointId,
        ruleId: generated.ruleId,
        runtimeVersion: generated.metadata.runtimeVersion,
      },
      validation: {
        independentSolverVerified: generated.metadata.independentSolverVerified === true,
        fourUniqueOptions: options.length === 4 && new Set(options).size === 4,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: ALP_001_SHARED_PACKAGE_ID,
      runtimeMode: "review-only",
      language: request.language ?? "en",
      requestedDifficulty: difficulty ? publicDifficulty(difficulty) : "Mixed",
      seed: baseSeed,
      count: total,
      sourceRuntimeVersion: ALP_001_QUESTION_STUDIO_REGISTRY.runtimeVersion,
    },
  };
}

function caeLocale(language: QuestionStudioGenerationRequest["language"]): CaeLocale {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function caeDifficulty(value: unknown): CaeDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error("CAE-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function caeQl(value: unknown): CaeQlId | undefined {
  const normalized = text(value).toUpperCase();
  return /^CAE-QL-00[1-9]$/u.test(normalized) ? normalized as CaeQlId : undefined;
}

export function isCae001SharedQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const pkg = text(request.packageId).toUpperCase();
  if (pkg) return pkg === CAE_001_SHARED_PACKAGE_ID;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((value) => value.startsWith("CAE-QL-") || value.startsWith("CAE-CP-"))) return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "cause and effect" || subtopic === "cause and effect" || subtopic === "cause & effect";
}

export const CAE_001_SHARED_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: CAE_001_SHARED_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Cause and Effect",
  subtopic: "Cause & Effect",
  label: "Reasoning · Cause & Effect · CAE-001",
  enabled: true,
  cpIds: Array.from({ length: 9 }, (_, index) => "CAE-CP-" + String(index + 1).padStart(3, "0")),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    sourcePackageId: CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId,
    sourceReviewStatus: CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
    qlAllocationStatus: CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlAllocationStatus,
    provisionalQlCount: CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.provisionalQlCount,
  },
};

export async function generateCae001SharedQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const total = count(request.count);
  const locale = caeLocale(request.language);
  const requestedDifficulty = caeDifficulty(request.difficulty);
  const explicitQl =
    caeQl(request.questionLanguageId)
    ?? caeQl(request.canonicalProblemId)
    ?? caeQl(request.patternId);
  const qls = explicitQl
    ? [explicitQl]
    : Array.from({ length: 9 }, (_, index) => ("CAE-QL-" + String(index + 1).padStart(3, "0")) as CaeQlId);
  const baseSeed = text(request.seed) || "cae001-shared-question-studio-v1";
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < total; index += 1) {
    let selected: ReturnType<typeof previewCae001QuestionStudioReview> | null = null;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const qlId = qls[(index + attempt) % qls.length]!;
      const numericSeed = hash(baseSeed + ":" + index + ":" + attempt);
      const preview = previewCae001QuestionStudioReview({
        qlId,
        locale,
        seed: numericSeed,
        questionProfile: "FOUR_WAY",
      });
      if (!requestedDifficulty || preview.question.difficulty === requestedDifficulty) {
        selected = preview;
        break;
      }
    }
    if (!selected) {
      throw new Error("CAE-001 could not satisfy the requested generated difficulty.");
    }
    const q = selected.question;
    const options = [...q.options];
    const difficultyLabel = publicDifficulty(q.difficulty);
    const questionId = "CAE-001:" + q.qlId + ":" + q.seed + ":" + locale;
    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: CAE_001_SHARED_PACKAGE_ID,
      patternId: q.qlId,
      qlId: q.qlId,
      cpId: q.checkpointId,
      checkpointId: q.checkpointId,
      subject: "Reasoning",
      topic: "Cause and Effect",
      subtopic: "Cause & Effect",
      language: locale === "hi-IN" ? "hi" : locale === "pa-IN" ? "pa" : "en",
      locale,
      stem: q.stem,
      text: q.stem,
      options,
      correctIndex: q.correctIndex,
      correct: q.correctIndex,
      answer: options[q.correctIndex],
      canonicalAnswer: options[q.correctIndex],
      explanation: q.explanation,
      difficulty: difficultyLabel,
      difficultyLabel,
      generationSeed: String(q.seed),
      numericSeed: q.seed,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      traceability: {
        packageId: CAE_001_SHARED_PACKAGE_ID,
        qlId: q.qlId,
        checkpointId: q.checkpointId,
        scenarioFamilyId: q.scenarioFamilyId,
        causalStateId: q.causalStateId,
        solver: q.metadata.solver,
      },
      validation: {
        fourUniqueOptions: options.length === 4 && new Set(options).size === 4,
        exactlyOneCorrect: q.optionMetadata.filter((option) => option.isCorrect).length === 1,
        causalProofRetained: q.causalTrace.length >= 2,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: CAE_001_SHARED_PACKAGE_ID,
      runtimeMode: "review-only",
      language: request.language ?? "en",
      requestedDifficulty: requestedDifficulty ? publicDifficulty(requestedDifficulty) : "Mixed",
      seed: baseSeed,
      count: total,
      sourcePackageId: CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId,
      qlAllocationStatus: CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlAllocationStatus,
    },
  };
}

export const CAL_001_SHARED_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: CAL_001_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Calendar",
  subtopic: "Calendar",
  label: "Reasoning · Calendar · CAL-001",
  enabled: true,
  cpIds: [...(CAL_001_QUESTION_STUDIO_PACKAGE.cpIds ?? [])],
  supportedLanguages: [...CAL_001_QUESTION_STUDIO_LANGUAGES],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    sourceRuntime: "CAL_001_QUESTION_STUDIO_V1",
    sourceReleaseLifecyclePreservedBehindReviewWrapper: true,
  },
};

export async function generateCal001SharedQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const source = await generateCal001QuestionStudioBatch(request);
  const questions = source.questions.map((question) => ({
    ...question,
    ...lifecycle,
    packageId: CAL_001_PACKAGE_ID,
    reviewOnly: true,
    readOnly: true,
    productionReleased: false,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }));
  return {
    questions,
    generationContext: {
      ...source.generationContext,
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: CAL_001_PACKAGE_ID,
      runtimeMode: "review-only",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
      sourceReleaseLifecyclePreservedBehindReviewWrapper: true,
    },
  };
}

const BLR_STANDARD_PACKAGES = listBlr001StandardQuestionStudioPackages();

export const BLR_001_SHARED_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: BLR_001_SHARED_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Blood Relations",
  subtopic: "Blood Relations",
  label: "Reasoning · Blood Relations · BLR-001",
  enabled: true,
  cpIds: BLR_STANDARD_PACKAGES.map((entry) => String(entry.checkpointId)),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    sourcePackageCount: BLR_STANDARD_PACKAGES.length,
    sourcePackages: BLR_STANDARD_PACKAGES.map((entry) => entry.packageId),
    umbrellaRoute: true,
  },
};

export function isBlr001SharedQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const pkg = text(request.packageId).toUpperCase();
  if (pkg) return pkg === BLR_001_SHARED_PACKAGE_ID;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((value) => value.startsWith("BLR-QL-") || value.startsWith("BLR-CP-"))) return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "blood relations" || subtopic === "blood relations";
}

export async function generateBlr001SharedQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const total = count(request.count);
  const explicitQl = [request.questionLanguageId, request.canonicalProblemId, request.patternId]
    .map((value) => text(value).toUpperCase())
    .find((value) => /^BLR-QL-\d{3}$/u.test(value));
  const explicitCp = [request.canonicalProblemId, request.patternId]
    .map((value) => text(value).toUpperCase())
    .find((value) => /^BLR-CP-\d{3}$/u.test(value));
  const relevant = explicitQl
    ? BLR_STANDARD_PACKAGES.filter((pkg) => (pkg.qlIds as readonly string[]).includes(explicitQl))
    : explicitCp
      ? BLR_STANDARD_PACKAGES.filter((pkg) => pkg.checkpointId === explicitCp)
      : BLR_STANDARD_PACKAGES;
  if (!relevant.length) throw new Error("BLR-001 could not resolve the requested QL/checkpoint scope.");

  const baseSeed = text(request.seed) || "blr001-shared-question-studio-v1";
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < total; index += 1) {
    const pkg = relevant[(hash(baseSeed + ":" + index) + index) % relevant.length]!;
    const source = generateBlr001StandardQuestionStudioBatch({
      packageId: pkg.packageId,
      language: request.language,
      canonicalProblemId: explicitQl,
      difficulty: request.difficulty,
      seed: baseSeed + ":" + pkg.packageId + ":" + index,
      count: 1,
    });
    const raw = source.questions[0] as Record<string, unknown>;
    questions.push({
      ...raw,
      ...lifecycle,
      packageId: BLR_001_SHARED_PACKAGE_ID,
      sourcePackageId: pkg.packageId,
      patternId: raw.qlId ?? pkg.packageId,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: BLR_001_SHARED_PACKAGE_ID,
      runtimeMode: "review-only",
      language: request.language ?? "en",
      requestedDifficulty: request.difficulty ?? "Mixed",
      seed: baseSeed,
      count: total,
      sourcePackageCount: relevant.length,
      sourcePackages: relevant.map((entry) => entry.packageId),
    },
  };
}

export function isCal001SharedQuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  return isCal001GenerationRequest(request);
}

export function isAnyAdditionalReasoningSharedRequest(request: QuestionStudioGenerationRequest): boolean {
  return isAlp001SharedQuestionStudioRequest(request)
    || isCae001SharedQuestionStudioRequest(request)
    || isCal001SharedQuestionStudioRequest(request)
    || isBlr001SharedQuestionStudioRequest(request)
    || isBlr001StandardQuestionStudioRequest(request as any);
}
