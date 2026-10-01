import {
  generateTrg001QuestionStudioBatch,
  isTrg001QuestionStudioRequest as isTrg001QuestionStudioRequestBase,
  TRG_001_QUESTION_STUDIO_PACKAGE,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/question-studio-runtime";
import { TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1 } from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/post-final5-full-internal-activation-v1";
import {
  generateTrg002V4QuestionStudioBatch,
  isTrg002V4GenerationRequest as isTrg002V4GenerationRequestBase,
  TRG_002_V4_QUESTION_STUDIO_PACKAGE,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/question-studio-v4-runtime";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "./engine-types";
import { deriveQuestionStudioCpTitles } from "./package-metadata";

const TRG_001_FULL_INTERNAL = TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1.execution;

function selector(request: QuestionStudioGenerationRequest): string {
  return String(
    request.questionLanguageId
    ?? request.canonicalProblemId
    ?? "",
  ).trim().toUpperCase();
}

export function isTrg001EngineRequest(request: QuestionStudioGenerationRequest): boolean {
  const selected = selector(request);
  return selected.startsWith("TRG-001-QL-")
    || /^TRG-CP-00[1-6]$/u.test(selected)
    || isTrg001QuestionStudioRequestBase(request as any);
}

export function isTrg002EngineRequest(request: QuestionStudioGenerationRequest): boolean {
  const selected = selector(request);
  return selected.startsWith("TRG-002-QL-")
    || /^TRG-CP-0(?:07|08|09|10)$/u.test(selected)
    || isTrg002V4GenerationRequestBase(request as any);
}

function applyTrg001FullInternalLifecycle(result: any) {
  const lifecycle = {
    questionBankStatus: TRG_001_FULL_INTERNAL.questionBankStatus,
    questionBankWritable: TRG_001_FULL_INTERNAL.questionBankWritable,
    testEligibility: TRG_001_FULL_INTERNAL.testEligibility,
    testEligible: TRG_001_FULL_INTERNAL.testEligible,
    testBuilderEligible: TRG_001_FULL_INTERNAL.testBuilderEligible,
    mockTestEligible: TRG_001_FULL_INTERNAL.mockTestEligible,
    publiclyPublishable: TRG_001_FULL_INTERNAL.publiclyPublishable,
    publicReleaseAuthorized: TRG_001_FULL_INTERNAL.publicReleaseAuthorized,
    automaticStudentPublication: TRG_001_FULL_INTERNAL.automaticStudentPublication,
  } as const;

  const questionPackages = Object.freeze((result.questionPackages ?? []).map((entry: any) => Object.freeze({
    ...entry,
    ...lifecycle,
  })));

  const questions = Object.freeze((result.questions ?? []).map((entry: any) => Object.freeze({
    ...entry,
    ...lifecycle,
    proceduralLogic: Object.freeze({
      ...(entry.proceduralLogic ?? {}),
      questionBankWritable: lifecycle.questionBankWritable,
      testBuilderEligible: lifecycle.testBuilderEligible,
      publicReleaseAuthorized: lifecycle.publicReleaseAuthorized,
    }),
    generationMetadata: Object.freeze({
      ...(entry.generationMetadata ?? {}),
      ...lifecycle,
    }),
  })));

  return Object.freeze({
    ...result,
    generationContext: Object.freeze({
      ...(result.generationContext ?? {}),
      ...lifecycle,
    }),
    questionPackages,
    questions,
  });
}

function applyTrg002InternalLifecycle(result: any) {
  const lifecycle = {
    questionBankWritable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
  } as const;

  const questionPackages = Object.freeze((result.questionPackages ?? []).map((entry: any) => Object.freeze({
    ...entry,
    ...lifecycle,
  })));

  const questions = Object.freeze((result.questions ?? []).map((entry: any) => Object.freeze({
    ...entry,
    ...lifecycle,
  })));

  return Object.freeze({
    ...result,
    generationContext: Object.freeze({
      ...(result.generationContext ?? {}),
      ...lifecycle,
    }),
    questionPackages,
    questions,
  });
}

function toSharedPackage(card: Record<string, unknown>): QuestionStudioPackageDefinition {
  const cpTitles = deriveQuestionStudioCpTitles(card);
  const metadata = Object.keys(cpTitles).length > 0 ? { cpTitles } : undefined;

  return {
    engineId: "quant-v4",
    packageId: String(card.packageId ?? ""),
    subject: typeof card.subject === "string" ? card.subject : "Quantitative Aptitude",
    topic: String(card.topic ?? "Advanced Mathematics"),
    subtopic: String(card.subtopic ?? "Trigonometry"),
    label: String(card.label ?? card.packageId ?? "Trigonometry"),
    enabled: Boolean(card.enabled),
    cpIds: Array.isArray(card.cpIds) ? card.cpIds.map(String) : [],
    supportedLanguages: Array.isArray(card.supportedLanguages)
      ? card.supportedLanguages.map(String).filter((entry): entry is "en" | "hi" | "pa" =>
          entry === "en" || entry === "hi" || entry === "pa")
      : ["en"],
    supportedDifficulties: Array.isArray(card.supportedDifficulties)
      ? card.supportedDifficulties.map(String).filter((entry): entry is "Easy" | "Medium" | "Hard" =>
          entry === "Easy" || entry === "Medium" || entry === "Hard")
      : ["Easy", "Medium", "Hard"],
    runtimeMode: typeof card.runtimeMode === "string" ? card.runtimeMode : undefined,
    questionBankStatus: typeof card.questionBankStatus === "string" ? card.questionBankStatus : undefined,
    questionBankWritable: typeof card.questionBankWritable === "boolean" ? card.questionBankWritable : undefined,
    testEligibility: typeof card.testEligibility === "string" ? card.testEligibility : undefined,
    testEligible: typeof card.testEligible === "boolean" ? card.testEligible : undefined,
    mockTestEligible: typeof card.mockTestEligible === "boolean" ? card.mockTestEligible : undefined,
    publiclyPublishable: typeof card.publiclyPublishable === "boolean" ? card.publiclyPublishable : undefined,
    automaticStudentPublication:
      typeof card.automaticStudentPublication === "boolean"
        ? card.automaticStudentPublication
        : undefined,
    productionReleaseAuthorized:
      typeof card.publicReleaseAuthorized === "boolean"
        ? card.publicReleaseAuthorized
        : undefined,
    metadata,
  };
}

export function trg001EnginePackage(): QuestionStudioPackageDefinition {
  return toSharedPackage({
    ...TRG_001_QUESTION_STUDIO_PACKAGE,
    questionBankStatus: TRG_001_FULL_INTERNAL.questionBankStatus,
    questionBankWritable: TRG_001_FULL_INTERNAL.questionBankWritable,
    testEligibility: TRG_001_FULL_INTERNAL.testEligibility,
    testEligible: TRG_001_FULL_INTERNAL.testEligible,
    mockTestEligible: TRG_001_FULL_INTERNAL.mockTestEligible,
    publiclyPublishable: TRG_001_FULL_INTERNAL.publiclyPublishable,
    publicReleaseAuthorized: TRG_001_FULL_INTERNAL.publicReleaseAuthorized,
    automaticStudentPublication: TRG_001_FULL_INTERNAL.automaticStudentPublication,
  } as unknown as Record<string, unknown>);
}

export function trg002EnginePackage(): QuestionStudioPackageDefinition {
  return toSharedPackage({
    ...TRG_002_V4_QUESTION_STUDIO_PACKAGE,
    questionBankWritable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
  } as unknown as Record<string, unknown>);
}

export async function generateTrigonometryEngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (isTrg001EngineRequest(request)) {
    return applyTrg001FullInternalLifecycle(
      generateTrg001QuestionStudioBatch(request as any),
    ) as unknown as QuestionStudioGenerationResult;
  }

  if (isTrg002EngineRequest(request)) {
    return applyTrg002InternalLifecycle(
      generateTrg002V4QuestionStudioBatch(request as any),
    ) as unknown as QuestionStudioGenerationResult;
  }

  return null;
}
