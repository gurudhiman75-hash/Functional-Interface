import { deterministicPick } from "../../knowledge-v1/deterministic";
import {
  classifyCom001DifficultyV2,
  COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
  type Com001DifficultyV2,
} from "../../knowledge-v1/computer-awareness/com001-difficulty-routing-v2";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import { generateCom001LocalizedReviewQuestionV2 } from "../../knowledge-v1/computer-awareness/com001-localization-v2";
import { listCom001ReviewV2QlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis-v2";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const COM001_QUESTION_STUDIO_PACKAGE_ID = "COM-001" as const;
export const COM001_QUESTION_STUDIO_RUNTIME_MODE = "review-only" as const;
export const COM001_QUESTION_BANK_STATUS =
  QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankStatus;
export const COM001_REVISION_POLICY = "SOURCE_GENERATOR_ONLY" as const;
export const COM001_REVIEW_CONTENT_AUTHORITY_VERSION = "V2" as const;

const qlIds = listCom001ReviewV2QlIds();
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties: Com001DifficultyV2[] = ["Easy", "Medium", "Hard"];
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

const qlDifficultySupport: Record<string, readonly Com001DifficultyV2[]> = {
  "COM-001-QL-001": ["Easy", "Medium"],
  "COM-001-QL-002": ["Easy", "Medium"],
  "COM-001-QL-003": ["Easy", "Medium"],
  "COM-001-QL-004": ["Easy", "Medium"],
  "COM-001-QL-005": ["Easy", "Medium"],
  "COM-001-QL-006": ["Medium"],
  "COM-001-QL-007": ["Hard"],
  "COM-001-QL-008": ["Hard"],
  "COM-001-QL-009": ["Easy", "Medium"],
};

export const COM001_STANDARD_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Memory & Storage",
  label: "Computer Awareness · Memory & Storage · V2",
  enabled: true,
  cpIds: ["COM-001-CP-001"],
  supportedLanguages,
  runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: [COM001_QUESTION_STUDIO_RUNTIME_MODE],
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
    reviewOnly: false,
    ...lifecycle,
    contentAuthorityVersion: COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
    humanReviewApproved: true,
    permanentQlIds: qlIds,
    revisionPolicy: COM001_REVISION_POLICY,
    difficultyFilterSupported: true,
    supportedDifficulties,
    difficultySelectionStatus: "REVIEW_TOPOLOGY_FILTER_ACTIVE",
    difficultyClassifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
    productionDifficultyClaimsAuthorized: false,
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    englishCombinedFingerprint:
      COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
    localizationFreezeAuthorityId:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
    localizationCombinedFingerprint:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
  },
};

/** Historical export names retained so older authority/audit imports remain readable. */
export const COM001_BANK_ONLY_PACKAGE = COM001_STANDARD_QUESTION_STUDIO_PACKAGE;
export const COM001_REVIEW_ONLY_PACKAGE = COM001_STANDARD_QUESTION_STUDIO_PACKAGE;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-001 does not support language ${String(language)}`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(
  difficulty: QuestionStudioGenerationRequest["difficulty"],
): Com001DifficultyV2 | null {
  if (!difficulty || difficulty === "Mixed") return null;
  if (supportedDifficulties.includes(difficulty as Com001DifficultyV2)) {
    return difficulty as Com001DifficultyV2;
  }
  throw new Error(`COM-001 review difficulty must be Easy, Medium, Hard, or Mixed`);
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

  const difficulty = normalizeDifficulty(request.difficulty);
  if (request.patternId && difficulty) {
    const supported = qlDifficultySupport[request.patternId] ?? [];
    if (!supported.includes(difficulty)) {
      throw new Error(
        `${request.patternId} does not produce ${difficulty} questions under COM-001 difficulty routing V2; supported: ${supported.join(", ")}`,
      );
    }
  }
}

function generateCandidate(input: {
  baseSeed: string;
  candidateIndex: number;
  patternId?: string;
  language: QuestionStudioLanguage;
}) {
  const qlId = input.patternId ?? deterministicPick(
    qlIds,
    `${input.baseSeed}:ql:${input.candidateIndex}`,
  );
  const seed = `${input.baseSeed}:item:${input.candidateIndex}`;
  const question = generateCom001LocalizedReviewQuestionV2({
    qlId,
    seed,
    language: input.language,
  });
  const difficultyDecision = classifyCom001DifficultyV2(question);
  return { question, difficultyDecision };
}

export const knowledgeV1Com001QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM001_STANDARD_QUESTION_STUDIO_PACKAGE];
  },

  async generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult> {
    validateRequest(request);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const difficultyFilterApplied = requestedDifficulty !== null;
    const baseSeed = request.seed?.trim() || "com001-question-studio-review-v2";
    const questions: Record<string, unknown>[] = [];
    const maxCandidateCount = Math.max(500, count * 100);

    for (let candidateIndex = 0; candidateIndex < maxCandidateCount && questions.length < count; candidateIndex += 1) {
      const { question, difficultyDecision } = generateCandidate({
        baseSeed,
        candidateIndex,
        patternId: request.patternId,
        language,
      });
      if (requestedDifficulty && difficultyDecision.difficulty !== requestedDifficulty) continue;

      questions.push({
        ...question,
        ...lifecycle,
        packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
        patternId: question.qlId,
        text: question.stem,
        correct: question.correctIndex,
        difficulty: difficultyDecision.difficulty,
        difficultyLabel: difficultyDecision.difficulty,
        difficultyDecisionV2: difficultyDecision,
        revisionPolicy: COM001_REVISION_POLICY,
        questionStudioReview: {
          ...lifecycle,
          registrationStatus: "STANDARD_QUESTION_STUDIO_REGISTERED",
          runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
          contentAuthorityVersion: COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
          humanReviewApproved: true,
          revisionPolicy: COM001_REVISION_POLICY,
          difficultyFilterApplied,
          requestedDifficulty: requestedDifficulty ?? "Mixed",
          classifiedDifficulty: difficultyDecision.difficulty,
          difficultyClassifierVersion: difficultyDecision.classifierVersion,
          difficultyTopology: difficultyDecision.topology,
          difficultyRationale: difficultyDecision.rationale,
          productionDifficultyClaimAuthorized: false,
          englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
          englishCombinedFingerprint:
            COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
          localizationFreezeAuthorityId:
            COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
          localizationCombinedFingerprint:
            COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
        },
      });
    }

    if (questions.length !== count) {
      throw new Error(
        `COM-001 could not deterministically fill ${count} ${requestedDifficulty ?? "Mixed"} review questions within ${maxCandidateCount} candidates`,
      );
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
        runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
        contentAuthorityVersion: COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
        humanReviewApproved: true,
        reviewOnly: false,
        revisionPolicy: COM001_REVISION_POLICY,
        language,
        requestedDifficulty: requestedDifficulty ?? "Mixed",
        difficultyFilterApplied,
        difficultyClassifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
        productionDifficultyClaimAuthorized: false,
        qlSelection: request.patternId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        permanentQlIds: qlIds,
        englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
        englishCombinedFingerprint:
          COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
        localizationFreezeAuthorityId:
          COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
        localizationCombinedFingerprint:
          COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
      },
    };
  },
};
