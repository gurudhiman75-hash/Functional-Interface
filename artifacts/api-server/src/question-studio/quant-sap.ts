import {
  generateQuestion as generateQuantQuestionStudioQuestion,
} from "../quant-v4/question-studio-generation-engine";
import {
  generateSapBankingQuestionStudioBatch,
  isSapBankingQuestionStudioRequest,
  SAP_BANKING_QUESTION_STUDIO_CAPABILITY,
} from "../quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/question-studio-banking-integration";
import {
  SAP_QUESTION_STUDIO_CP_IDS,
  SAP_QUESTION_STUDIO_QLS,
} from "../quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/question-studio-adapter";
import {
  SAP_LOCALIZED_LANGUAGES,
} from "../quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/localization/types";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "./engine-types";

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isSapEngineRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = normalizeSelector(request.packageId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set([
    "simplification approximation",
    "simplification and approximation",
    "simplification",
    "approximation",
  ]);

  return (
    packageId === "sap"
    || patternId === "sap"
    || patternId.includes("sap ql")
    || (selectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && selectors.has(subtopic))
  );
}

export function sapEnginePackage(): QuestionStudioPackageDefinition {
  return {
    engineId: "quant-v4",
    packageId: "SAP",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    label: "Simplification & Approximation",
    enabled: true,
    cpIds: [...SAP_QUESTION_STUDIO_CP_IDS],
    supportedLanguages: [...SAP_LOCALIZED_LANGUAGES],
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE", "SAP_BANKING_SPEED_PROFILE_V1"],
    questionBankStatus: "WRITABLE",
    questionBankWritable: true,
    testEligibility: "ELIGIBLE",
    testEligible: true,
    publiclyPublishable: true,
    metadata: {
      qlCount: SAP_QUESTION_STUDIO_QLS.length,
      localizationLanguages: [...SAP_LOCALIZED_LANGUAGES],
      supportedExamProfiles: [
        "GENERIC_PRACTICE",
        ...SAP_BANKING_QUESTION_STUDIO_CAPABILITY.supportedExamProfiles,
      ],
      optionCountByExamProfile: {
        GENERIC_PRACTICE: 4,
        ...SAP_BANKING_QUESTION_STUDIO_CAPABILITY.optionCountByExamProfile,
      },
      bankingSpeedProfiles: SAP_BANKING_QUESTION_STUDIO_CAPABILITY.bankingSpeedProfiles,
      bankingSpeedEnglishOnly: true,
      bankingSpeedLifecycle: {
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        reviewOnly: true,
        manualApprovalRequired: true,
      },
    },
  };
}

export async function generateSapEngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (!isSapEngineRequest(request)) return null;

  const sapRequest = {
    ...request,
    packageId: "SAP",
  };

  if (isSapBankingQuestionStudioRequest(sapRequest as any)) {
    return generateSapBankingQuestionStudioBatch(
      sapRequest as any,
    ) as unknown as QuestionStudioGenerationResult;
  }

  return generateQuantQuestionStudioQuestion(
    sapRequest as any,
  ) as unknown as QuestionStudioGenerationResult;
}
