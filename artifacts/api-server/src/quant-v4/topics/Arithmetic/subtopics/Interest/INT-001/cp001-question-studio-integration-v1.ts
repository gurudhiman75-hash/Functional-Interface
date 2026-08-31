import { randomUUID } from "node:crypto";
import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY,
  runIntCp001QuestionStudioPreRegistration,
  type IntCp001QuestionStudioDifficulty,
} from "./int-001-cp001-question-studio-pre-registration-adapter";
import { retrofitInterestPreviewExplanation } from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-001-QS-v1" as const;
export const INT_CP001_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP001_QUESTION_STUDIO_CP_ID = "INT-CP-001" as const;
export const INT_CP001_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp001QuestionStudioLanguage = (typeof INT_CP001_QUESTION_STUDIO_LANGUAGES)[number];

export interface IntCp001QuestionStudioRequest {
  language?: string;
  questionLanguageId?: string;
  qlId?: string;
  difficulty?: IntCp001QuestionStudioDifficulty | string | number;
  seed?: string;
  count?: number;
}

function normalizeLanguage(value: unknown): IntCp001QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`INT-CP-001 does not support language '${language}'.`);
}

function normalizeQl(value: unknown): IntCp001FinalQlId | undefined {
  const qlId = String(value ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  if ((INT_CP001_FINAL_QL_IDS as readonly string[]).includes(qlId)) return qlId as IntCp001FinalQlId;
  throw new Error(`${qlId} is not owned by INT-CP-001.`);
}

function activatePackage<T extends Record<string, any>>(pkg: T) {
  return Object.freeze({
    ...pkg,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    preRegistrationOnly: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  });
}

function activatePreview<T extends Record<string, any>>(
  question: T,
  language: IntCp001QuestionStudioLanguage,
) {
  const active = Object.freeze({
    ...question,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    preRegistrationOnly: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    manualApprovalRequired: true as const,
    integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  });
  const qlId = String(question.qlId ?? question.questionLanguageId ?? "");
  return retrofitInterestPreviewExplanation(active, qlId, language);
}

export function listIntCp001QuestionStudioPackages() {
  return [Object.freeze({
    ...INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY,
    supportedLanguages: INT_CP001_QUESTION_STUDIO_LANGUAGES,
    permanentQlCount: INT_CP001_FINAL_QL_IDS.length,
    permanentQlIds: INT_CP001_FINAL_QL_IDS,
    registrationStatus: "REGISTERED_REVIEW_ONLY",
    stagingStatus: "REVIEW_QUEUE_ENABLED",
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    questionStudioDiscoverable: true,
    preRegistrationOnly: false,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    integrationVersion: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  })];
}

export async function generateIntCp001QuestionStudioBatch(request: IntCp001QuestionStudioRequest = {}) {
  const language = normalizeLanguage(request.language);
  const qlId = normalizeQl(request.questionLanguageId ?? request.qlId);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed ?? "").trim() || `question-studio:INT-CP-001:${language}:${randomUUID()}`;

  const source = runIntCp001QuestionStudioPreRegistration({
    packageId: INT_CP001_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP001_QUESTION_STUDIO_CP_ID,
    patternId: qlId,
    language,
    difficulty: request.difficulty,
    seed,
    count,
  });

  const questionPackages = Object.freeze(source.questionPackages.map((pkg: any) => activatePackage(pkg)));
  const questions = Object.freeze(source.questions.map((question: any) => activatePreview(question, language)));
  const result = Object.freeze({
    ok: true as const,
    packageId: INT_CP001_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP001_QUESTION_STUDIO_CP_ID,
    language,
    count,
    seed,
    integrationVersion: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
    generationContext: Object.freeze({
      ...source.generationContext,
      runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
      stagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioDiscoverable: true as const,
      preRegistrationOnly: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
    }),
    questionPackages,
    questions,
  });
  JSON.stringify(result);
  return result;
}
