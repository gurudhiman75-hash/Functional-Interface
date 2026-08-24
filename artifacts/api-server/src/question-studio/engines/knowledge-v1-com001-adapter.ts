import { deterministicPick } from "../../knowledge-v1/deterministic";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v1";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v1";
import { generateCom001LocalizedReviewQuestionV1 } from "../../knowledge-v1/computer-awareness/com001-localization-v1";
import { listCom001ReviewQlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";

export const COM001_QUESTION_STUDIO_PACKAGE_ID = "COM-001" as const;
export const COM001_QUESTION_STUDIO_RUNTIME_MODE = "review-only" as const;
export const COM001_QUESTION_BANK_STATUS = "NOT_STORED" as const;
export const COM001_REVISION_POLICY = "SOURCE_GENERATOR_ONLY" as const;

const qlIds = listCom001ReviewQlIds();
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];

export const COM001_REVIEW_ONLY_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Memory & Storage",
  label: "Computer Awareness · Memory & Storage (Review Only)",
  enabled: true,
  cpIds: ["COM-001-CP-001"],
  supportedLanguages,
  runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: [COM001_QUESTION_STUDIO_RUNTIME_MODE],
  questionBankStatus: COM001_QUESTION_BANK_STATUS,
  testEligibility: "INELIGIBLE_REVIEW_ONLY",
  publiclyPublishable: false,
  metadata: {
    reviewOnly: true,
    permanentQlIds: qlIds,
    revisionPolicy: COM001_REVISION_POLICY,
    difficultyFilterSupported: false,
    difficultySelectionStatus: "NOT_APPLIED_IN_REVIEW_ONLY_PILOT",
    reviewRunPersistenceAllowed: true,
    canonicalQuestionPersistenceAllowed: false,
    questionBankStatus: COM001_QUESTION_BANK_STATUS,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    englishCombinedFingerprint:
      COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    localizationFreezeAuthorityId:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    localizationCombinedFingerprint:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
  },
};

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-001 does not support language ${String(language)}`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-001 review-only batches require count between 1 and 50");
  }
  return count;
}

function validateRequest(request: QuestionStudioGenerationRequest) {
  if (request.packageId && request.packageId !== COM001_QUESTION_STUDIO_PACKAGE_ID) {
    throw new Error(`knowledge-v1 COM-001 adapter cannot generate package ${request.packageId}`);
  }
  if (
    request.runtimeMode &&
    request.runtimeMode !== COM001_QUESTION_STUDIO_RUNTIME_MODE
  ) {
    throw new Error(
      `COM-001 only supports ${COM001_QUESTION_STUDIO_RUNTIME_MODE} runtime`,
    );
  }
  if (request.patternId && !qlIds.includes(request.patternId)) {
    throw new Error(`Unknown COM-001 QL ${request.patternId}`);
  }
}

export const knowledgeV1Com001QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM001_REVIEW_ONLY_PACKAGE];
  },

  async generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult> {
    validateRequest(request);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const baseSeed = request.seed?.trim() || "com001-question-studio-review";

    const questions = Array.from({ length: count }, (_, index) => {
      const qlId = request.patternId ?? deterministicPick(
        qlIds,
        `${baseSeed}:ql:${index}`,
      );
      const seed = `${baseSeed}:item:${index}`;
      const question = generateCom001LocalizedReviewQuestionV1({
        qlId,
        seed,
        language,
      });

      return {
        ...question,
        packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
        patternId: question.qlId,
        text: question.stem,
        correct: question.correctIndex,
        revisionPolicy: COM001_REVISION_POLICY,
        questionBankStatus: COM001_QUESTION_BANK_STATUS,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        questionStudioReview: {
          registrationStatus: "REVIEW_ONLY_REGISTERED",
          runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
          revisionPolicy: COM001_REVISION_POLICY,
          reviewRunPersistenceAllowed: true,
          canonicalQuestionPersistenceAllowed: false,
          questionBankStatus: COM001_QUESTION_BANK_STATUS,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
          difficultyFilterApplied: false,
          requestedDifficulty: request.difficulty ?? null,
          englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
          localizationFreezeAuthorityId:
            COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
          localizationCombinedFingerprint:
            COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
        },
      };
    });

    return {
      questions,
      generationContext: {
        engineId: "knowledge-v1",
        packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
        runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
        reviewOnly: true,
        revisionPolicy: COM001_REVISION_POLICY,
        language,
        requestedDifficulty: request.difficulty ?? null,
        difficultyFilterApplied: false,
        qlSelection: request.patternId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        permanentQlIds: qlIds,
        reviewRunPersistenceAllowed: true,
        canonicalQuestionPersistenceAllowed: false,
        questionBankStatus: COM001_QUESTION_BANK_STATUS,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
        englishCombinedFingerprint:
          COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
        localizationFreezeAuthorityId:
          COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
        localizationCombinedFingerprint:
          COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
      },
    };
  },
};
