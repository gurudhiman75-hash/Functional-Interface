import {
  COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
  COM003_HARD_DIFFICULTY_STATUS_V1,
} from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com003-english-freeze-v2";
import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-localization-v2-chapter-freeze-v1";
import {
  COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2,
  runCom003QuestionStudioPreRegistrationV2,
  type Com003QuestionStudioDifficultyV2,
} from "../../knowledge-v1/computer-awareness/com003-question-studio-pre-registration-adapter-v2";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-review-only-activation-authority-v1";

export const COM003_QUESTION_STUDIO_PACKAGE_ID_V2 = "COM-003" as const;
export const COM003_QUESTION_STUDIO_RUNTIME_MODE_V2 = "review-only" as const;
export const COM003_REVISION_POLICY_V2 = "SOURCE_GENERATOR_ONLY" as const;
export const COM003_REVIEW_CONTENT_AUTHORITY_VERSION_V2 = "V16_2_LOCALIZATION_V2_FROZEN" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const capability = COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties: Com003QuestionStudioDifficultyV2[] = ["Easy", "Medium"];
const qlIds: string[] = [...capability.qlIds];
const cpIds: string[] = [...capability.cpIds];

export const COM003_STANDARD_REVIEW_ONLY_PACKAGE_V2: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V2,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Office & Productivity Software",
  label: "Computer Awareness · Office & Productivity Software · V16.2 / Localization V2",
  enabled: true,
  cpIds,
  supportedLanguages,
  supportedDifficulties,
  difficultyFilterSupported: true,
  runtimeMode: COM003_QUESTION_STUDIO_RUNTIME_MODE_V2,
  supportedRuntimeModes: [COM003_QUESTION_STUDIO_RUNTIME_MODE_V2],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
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
    contentAuthorityVersion: COM003_REVIEW_CONTENT_AUTHORITY_VERSION_V2,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds,
    cpCount: cpIds.length,
    englishQuestionCount: capability.corpus.englishQuestionCount,
    hindiQuestionCount: capability.corpus.hindiQuestionCount,
    punjabiQuestionCount: capability.corpus.punjabiQuestionCount,
    corpusAuthorityId: capability.corpus.authorityId,
    englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    localizationFreezeAuthorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    revisionPolicy: COM003_REVISION_POLICY_V2,
    difficultyFilterSupported: true,
    supportedDifficulties,
    hardDifficultyAuthorized: COM003_HARD_DIFFICULTY_STATUS_V1.authorized,
    difficultyClassifierVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
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

function normalizeDifficulty(
  difficulty: QuestionStudioGenerationRequest["difficulty"],
): Com003QuestionStudioDifficultyV2 | "Mixed" {
  if (!difficulty || difficulty === "Mixed") return "Mixed";
  if (difficulty === "Easy" || difficulty === "Medium") return difficulty;
  if (difficulty === "Hard") {
    throw new Error(`COM-003 Hard difficulty is not authorized: ${COM003_HARD_DIFFICULTY_STATUS_V1.reason}`);
  }
  throw new Error("COM-003 review difficulty must be Easy, Medium, or Mixed");
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
  const cpSelectors = candidates.filter((value) => cpIds.includes(value));
  const unknown = candidates.filter(
    (value) =>
      value !== COM003_QUESTION_STUDIO_PACKAGE_ID_V2 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value),
  );
  if (unknown.length) throw new Error(`Unknown COM-003 selector ${unknown[0]}`);
  if (new Set(qlSelectors).size > 1) {
    throw new Error(`Conflicting COM-003 QL selectors ${qlSelectors.join(", ")}`);
  }
  if (new Set(cpSelectors).size > 1) {
    throw new Error(`Conflicting COM-003 CP selectors ${cpSelectors.join(", ")}`);
  }
  return qlSelectors[0];
}

function normalizeCpSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const candidates = [request.canonicalProblemId, request.patternId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter((value) => cpIds.includes(value));
  return candidates[0];
}

export function isCom003QuestionStudioRequestV2(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === COM003_QUESTION_STUDIO_PACKAGE_ID_V2;
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase());
  return (
    selectors.some((value) => value.startsWith("COM-003")) ||
    (subject === "computer awareness" && subtopic === "office & productivity software") ||
    topic === "office & productivity software"
  );
}

export const knowledgeV1Com003QuestionStudioAdapterV2: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM003_STANDARD_REVIEW_ONLY_PACKAGE_V2];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (request.packageId && request.packageId !== COM003_QUESTION_STUDIO_PACKAGE_ID_V2) {
      throw new Error(`knowledge-v1 COM-003 adapter cannot generate package ${request.packageId}`);
    }
    if (request.runtimeMode && request.runtimeMode !== COM003_QUESTION_STUDIO_RUNTIME_MODE_V2) {
      throw new Error(`COM-003 only supports ${COM003_QUESTION_STUDIO_RUNTIME_MODE_V2} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const qlId = normalizeQlSelector(request);
    const cpId = normalizeCpSelector(request);
    const baseSeed = request.seed?.trim() || "com003-question-studio-v16-2-localization-v2-review";

    const frozen = runCom003QuestionStudioPreRegistrationV2({
      packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V2,
      qlId,
      cpId,
      language,
      difficulty: requestedDifficulty,
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
      packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V2,
      patternId: question.qlId,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      preRegistrationOnly: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      readOnly: true,
      revisionPolicy: COM003_REVISION_POLICY_V2,
      productionReleased: false,
      questionStudioReview: {
        ...lifecycle,
        registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
        registrationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
        runtimeMode: COM003_QUESTION_STUDIO_RUNTIME_MODE_V2,
        frozenCorpusOnly: true,
        contentAuthorityVersion: COM003_REVIEW_CONTENT_AUTHORITY_VERSION_V2,
        corpusAuthorityId: capability.corpus.authorityId,
        englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
        localizationFreezeAuthorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
        revisionPolicy: COM003_REVISION_POLICY_V2,
        difficultyClassifierVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
        difficultyTopology: question.difficultyDecisionV1.topology,
        difficultyRationale: question.difficultyDecisionV1.rationale,
        productionDifficultyClaimAuthorized: false,
      },
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM003_QUESTION_STUDIO_PACKAGE_ID_V2,
        runtimeMode: COM003_QUESTION_STUDIO_RUNTIME_MODE_V2,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: COM003_REVIEW_CONTENT_AUTHORITY_VERSION_V2,
        revisionPolicy: COM003_REVISION_POLICY_V2,
        language,
        requestedDifficulty,
        difficultyFilterApplied: requestedDifficulty !== "Mixed",
        difficultyClassifierVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
        productionDifficultyClaimAuthorized: false,
        hardDifficultyAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        cpSelection: cpId ?? "ALL_CANONICAL_PROBLEMS",
        permanentQlIds: qlIds,
        cpIds,
        corpusAuthorityId: capability.corpus.authorityId,
        englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
        localizationFreezeAuthorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
      },
    };
  },
};
