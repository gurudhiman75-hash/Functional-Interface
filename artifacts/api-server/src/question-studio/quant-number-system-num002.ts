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
  generateNumCp011QuestionStudioBatch,
  isNumCp011QuestionStudioRequest,
  listNumCp011QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-011/question-studio-integration";
import {
  generateNumCp012QuestionStudioBatch,
  isNumCp012QuestionStudioRequest,
  listNumCp012QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-012/question-studio-integration";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "./engine-types";

type PackageCard = Record<string, any>;

const CP013_014_QL_RANGE = /^NUM-QL-(?:23[7-9]|24[0-9]|25[0-3])$/u;

function selectedCp(request: QuestionStudioGenerationRequest): string {
  return String(request.canonicalProblemId ?? "").trim().toUpperCase();
}

export function isNum002Cp008To012EngineRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const cp = selectedCp(request);
  const ql = String(request.questionLanguageId ?? "").trim().toUpperCase();

  // CP013/014 retain their dedicated compatibility routers.
  if (cp === "NUM-CP-013" || cp === "NUM-CP-014") return false;
  if (CP013_014_QL_RANGE.test(ql)) return false;

  return (
    isNumCp012QuestionStudioRequest(request as any)
    || isNumCp011QuestionStudioRequest(request as any)
    || isNumCp010QuestionStudioRequest(request as any)
    || isNumCp009QuestionStudioRequest(request as any)
    || isNumCp008QuestionStudioRequest(request as any)
  );
}

function packageCards(): PackageCard[] {
  return [
    listNumCp008QuestionStudioPackages()[0] as PackageCard,
    listNumCp009QuestionStudioPackages()[0] as PackageCard,
    listNumCp010QuestionStudioPackages()[0] as PackageCard,
    listNumCp011QuestionStudioPackages()[0] as PackageCard,
    listNumCp012QuestionStudioPackages()[0] as PackageCard,
  ];
}

export function num002Cp008To012EnginePackageCard(): Record<string, unknown> {
  const cards = packageCards();
  const [cp008, cp009, cp010, cp011, cp012] = cards;
  if (!cp008 || !cp009 || !cp010 || !cp011 || !cp012) {
    throw new Error("NUM-002 CP008-CP012 frozen Question Studio packages are incomplete.");
  }

  return {
    ...cp008,
    id: "NUM-002",
    packageId: "NUM-002",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Number System",
    name: "NUM-002 Number System — Remainders, Cyclicity, Digit Structure, Factorial Valuations & Perfect Powers",
    label: "Number System — Remainders, Cyclicity, Digit Structure, Factorial Valuations & Perfect Powers",
    cpIds: cards.flatMap((card) => Array.isArray(card.cpIds) ? card.cpIds : []),
    canonicalProblems: cards.flatMap((card) =>
      Array.isArray(card.canonicalProblems) ? card.canonicalProblems : [],
    ),
    permanentQlCount: cards.reduce(
      (sum, card) => sum + Number(card.permanentQlCount ?? 0),
      0,
    ),
    permanentQlIds: cards.flatMap((card) =>
      Array.isArray(card.permanentQlIds) ? card.permanentQlIds : [],
    ),
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    difficultyFilterSupported: true,
    supportedLanguages: ["en", "hi", "pa"],
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
    lifecycleStage: "REVIEW_ONLY",
    reviewSurfaceRequired: true,
    manualApprovalRequired: true,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    releaseId: "NUM-002-QS-CP008-CP012-MULTILINGUAL-FROZEN-V1",
    checkpointReleaseIds: cards.map((card) => card.releaseId).filter(Boolean),
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    metadata: {
      ownership: "NUM-CP-008..NUM-CP-012",
      cp013Cp014CompatibilityDeferred: true,
      permanentQlRanges: {
        "NUM-CP-008": "NUM-QL-166..184",
        "NUM-CP-009": "NUM-QL-185..196",
        "NUM-CP-010": "NUM-QL-197..212",
        "NUM-CP-011": "NUM-QL-213..225",
        "NUM-CP-012": "NUM-QL-226..236",
      },
    },
  };
}

function asClientError(error: unknown): never {
  if (error && typeof error === "object" && "statusCode" in error) throw error;
  const message = error instanceof Error
    ? error.message
    : String(error ?? "NUM-002 CP008-CP012 generation failed");
  throw Object.assign(new Error(message), {
    statusCode: 400,
    code: "NUM002_CP008_012_REQUEST_INVALID",
  });
}

export async function generateNum002Cp008To012EngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (!isNum002Cp008To012EngineRequest(request)) return null;

  try {
    if (isNumCp012QuestionStudioRequest(request as any)) {
      return await generateNumCp012QuestionStudioBatch(request as any) as unknown as QuestionStudioGenerationResult;
    }
    if (isNumCp011QuestionStudioRequest(request as any)) {
      return await generateNumCp011QuestionStudioBatch(request as any) as unknown as QuestionStudioGenerationResult;
    }
    if (isNumCp010QuestionStudioRequest(request as any)) {
      return await generateNumCp010QuestionStudioBatch(request as any) as unknown as QuestionStudioGenerationResult;
    }
    if (isNumCp009QuestionStudioRequest(request as any)) {
      return await generateNumCp009QuestionStudioBatch(request as any) as unknown as QuestionStudioGenerationResult;
    }
    return await generateNumCp008QuestionStudioBatch(request as any) as unknown as QuestionStudioGenerationResult;
  } catch (error) {
    return asClientError(error);
  }
}
