import {
  generateQuestion as generateQuantReviewQuestion,
  listQuantV4Packages as listQuantReviewPackages,
} from "../quant-v4/question-studio-review-engine";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "./engine-types";

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function inferNum001CpFromQl(
  value: unknown,
): "NUM-CP-001" | "NUM-CP-003" | "NUM-CP-004" | undefined {
  const match = /^NUM-QL-(\d{3})$/u.exec(String(value ?? "").trim().toUpperCase());
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 17) return "NUM-CP-003";
  if (number >= 18 && number <= 45) return "NUM-CP-004";
  if (number >= 124 && number <= 144) return "NUM-CP-001";
  return undefined;
}

export function isNum001EngineRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = normalizeSelector(request.packageId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const cpId = String(request.canonicalProblemId ?? "").trim().toUpperCase();
  const qlCp = inferNum001CpFromQl(request.questionLanguageId);
  const numberSelectors = new Set(["number system", "numbers", "number theory"]);

  if (packageId === "num 002") return false;
  if (/^NUM-CP-0(?:08|09|10|11|12|13|14)$/u.test(cpId)) return false;
  if (String(request.questionLanguageId ?? "").toUpperCase().startsWith("NUM-QL-")) {
    const qlMatch = /^NUM-QL-(\d{3})$/u.exec(String(request.questionLanguageId ?? "").toUpperCase());
    if (qlMatch && Number(qlMatch[1]) >= 166) return false;
  }

  return (
    packageId === "num 001"
    || patternId.includes("num 001")
    || cpId === "NUM-CP-001"
    || cpId === "NUM-CP-003"
    || cpId === "NUM-CP-004"
    || Boolean(qlCp)
    || (numberSelectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && numberSelectors.has(subtopic))
  );
}

export function num001EnginePackageCard(): Record<string, unknown> {
  const pkg = listQuantReviewPackages()
    .find((entry: any) => entry.packageId === "NUM-001");
  if (!pkg) {
    throw new Error("NUM-001 guarded review package is missing.");
  }

  return {
    ...(pkg as Record<string, unknown>),
    packageId: "NUM-001",
    enabled: true,
    cpIds: ["NUM-CP-001", "NUM-CP-003", "NUM-CP-004"],
    canonicalProblems: [
      { id: "NUM-CP-001", label: "NUM-CP-001" },
      { id: "NUM-CP-003", label: "NUM-CP-003" },
      { id: "NUM-CP-004", label: "NUM-CP-004" },
    ],
    supportedLanguages: ["en", "hi", "pa"],
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
    lifecycleStage: "REVIEW_ONLY",
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
      cpLanguagePolicy: {
        "NUM-CP-001": ["en", "hi", "pa"],
        "NUM-CP-003": ["en"],
        "NUM-CP-004": ["en"],
      },
      sourceFacade: "quant-v4/question-studio-review-engine",
    },
  };
}

function asClientError(error: unknown): never {
  if (error && typeof error === "object" && "statusCode" in error) throw error;
  const message = error instanceof Error
    ? error.message
    : String(error ?? "NUM-001 generation failed");
  throw Object.assign(new Error(message), {
    statusCode: 400,
    code: "NUM001_REQUEST_INVALID",
  });
}

export async function generateNum001EngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (!isNum001EngineRequest(request)) return null;

  try {
    const result = await generateQuantReviewQuestion({
      packageId: request.packageId as any,
      patternId: request.patternId,
      topic: request.topic,
      subtopic: request.subtopic,
      difficulty: request.difficulty as any,
      language: request.language as any,
      seed: request.seed,
      count: request.count,
      runtimeMode: request.runtimeMode as any,
      canonicalProblemId: request.canonicalProblemId,
      questionLanguageId: request.questionLanguageId,
      examProfile: request.examProfile as any,
    }) as any;

    const lifecycle = {
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    } as const;

    return {
      ...result,
      generationContext: {
        ...(result.generationContext ?? {}),
        ...lifecycle,
        engineId: "quant-v4",
      },
      questionPackages: Array.isArray(result.questionPackages)
        ? result.questionPackages.map((entry: Record<string, unknown>) => ({
            ...entry,
            ...lifecycle,
          }))
        : result.questionPackages,
      questions: Array.isArray(result.questions)
        ? result.questions.map((entry: Record<string, unknown>) => ({
            ...entry,
            ...lifecycle,
          }))
        : [],
    } as QuestionStudioGenerationResult;
  } catch (error) {
    return asClientError(error);
  }
}
