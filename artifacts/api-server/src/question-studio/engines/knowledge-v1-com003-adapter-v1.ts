import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-english-freeze-v1";
import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-localization-chapter-freeze-v1";
import {
  COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1,
  runCom003QuestionStudioPreRegistration,
} from "../../knowledge-v1/computer-awareness/com003-question-studio-pre-registration-adapter-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-review-only-activation-authority-v1";

export const COM003_QUESTION_STUDIO_PACKAGE_ID_V1 = "COM-003" as const;
export const COM003_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const COM003_REVISION_POLICY_V1 = "FROZEN_CORPUS_REPLACEMENT_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const capability = COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const qlIds = [...capability.qlIds];
const cpIds = [...capability.cpIds];

export const COM003_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Office & Productivity Software",
  label: "Computer Awareness · Office & Productivity Software · Frozen V1",
  enabled: true,
  cpIds,
  supportedLanguages,
  runtimeMode: COM003_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [COM003_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: undefined,
  questionBankAcceptanceAuthority: null,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    ...lifecycle,
    registrationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds,
    cpCount: cpIds.length,
    englishQuestionCount: capability.corpus.englishQuestionCount,
    hindiQuestionCount: capability.corpus.hindiQuestionCount,
    punjabiQuestionCount: capability.corpus.punjabiQuestionCount,
    corpusAuthorityId: capability.corpus.authorityId,
    englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    localizationFreezeAuthorityId: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    revisionPolicy: COM003_REVISION_POLICY_V1,
    difficultyFilterSupported: false,
    supportedDifficulties: [],
    difficultyClassifierVersion: null,
    productionDifficultyClaimsAuthorized: false,
  },
};

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-003 does not support language ${String(language)}`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-003 review batches require count between 1 and 50");
  }
  return count;
}

function assertNoDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (difficulty && difficulty !== "Mixed") {
    throw new Error(
      "COM-003 difficulty filtering is not authorized because the frozen corpus has no audited difficulty classification.",
    );
  }
}

function normalizeQlSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const candidates = [
    request.questionLanguageId,
    request.canonicalProblemId,
    request.patternId,
  ]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);

  const qlSelectors = candidates.filter((value) => qlIds.includes(value));
  const cpSelectors = candidates.filter((value) => cpIds.includes(value as (typeof cpIds)[number]));
  const unknown = candidates.filter(
    (value) => value !== COM003_QUESTION_STUDIO_PACKAGE_ID_V1 && !qlIds.includes(value) && !cpIds.includes(value as (typeof cpIds)[number]),
  );
  if (unknown.length) throw new Error(`Unknown COM-003 selector ${unknown[0]}`);
  if (new Set(qlSelectors).size > 1) throw new Error(`Conflicting COM-003 QL selectors ${qlSelectors.join(", ")}`);
  if (new Set(cpSelectors).size > 1) throw new Error(`Conflicting COM-003 CP selectors ${cpSelectors.join(", ")}`);
  return qlSelectors[0];
}

function normalizeCpSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const candidates = [request.canonicalProblemId, request.patternId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter((value) => cpIds.includes(value as (typeof cpIds)[number]));
  return candidates[0];
}

export function isCom003QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === COM003_QUESTION_STUDIO_PACKAGE_ID_V1;
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase());
  return selectors.some((value) => value.startsWith("COM-003")) ||
    (subject === "computer awareness" && subtopic === "office & productivity software") ||
    topic === "office & productivity software";
}

export const knowledgeV1Com003QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM003_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (request.packageId && request.packageId !== COM003_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 COM-003 adapter cannot generate package ${request.packageId}`);
    }
    if (request.runtimeMode && request.runtimeMode !== COM003_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`COM-003 only supports ${COM003_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }
    assertNoDifficulty(request.difficulty);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const qlId = normalizeQlSelector(request);
    const cpId = normalizeCpSelector(request);
    const baseSeed = request.seed?.trim() || "com003-question-studio-review-only-v1";

    const frozen = runCom003QuestionStudioPreRegistration({
      packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V1,
      qlId,
      cpId,
      language,
      seed: baseSeed,
      count,
    });

    const questions = frozen.questions.map((question) => ({
      ...question,
      ...lifecycle,
      id: question.id,
      questionId: question.id,
      text: question.stem,
      correct: question.correctIndex,
      packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: question.qlId,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      preRegistrationOnly: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      readOnly: false,
      revisionPolicy: COM003_REVISION_POLICY_V1,
      productionReleased: false,
      questionStudioReview: {
        ...lifecycle,
        registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
        registrationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
        runtimeMode: COM003_QUESTION_STUDIO_RUNTIME_MODE_V1,
        frozenCorpusOnly: true,
        corpusAuthorityId: capability.corpus.authorityId,
        englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
        localizationFreezeAuthorityId: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
        revisionPolicy: COM003_REVISION_POLICY_V1,
        difficultyClassifierVersion: null,
        productionDifficultyClaimAuthorized: false,
      },
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: COM003_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        revisionPolicy: COM003_REVISION_POLICY_V1,
        language,
        requestedDifficulty: null,
        difficultyFilterApplied: false,
        difficultyClassifierVersion: null,
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        cpSelection: cpId ?? "ALL_CANONICAL_PROBLEMS",
        permanentQlIds: qlIds,
        cpIds,
        corpusAuthorityId: capability.corpus.authorityId,
        englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
        localizationFreezeAuthorityId: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
      },
    };
  },
};
