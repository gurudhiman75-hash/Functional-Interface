import { deterministicPick } from "../../knowledge-v1/deterministic";
import {
  classifyCom002DifficultyV1,
  COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
  type Com002DifficultyV1,
} from "../../knowledge-v1/computer-awareness/com002-difficulty-routing-v1";
import {
  COM002_LOCALIZATION_VERSION_V5,
  localizeCom002QuestionV5,
} from "../../knowledge-v1/computer-awareness/com002-localization-v5";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
  listCom002ReviewV6QlIds,
} from "../../knowledge-v1/computer-awareness/com002-review-synthesis-v6";
import { COM002_V6_V5_OPERATIONAL_FREEZE } from "../../knowledge-v1/computer-awareness/com002-v6-v5-operational-freeze";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const COM002_QUESTION_STUDIO_PACKAGE_ID_V3 = "COM-002" as const;
export const COM002_QUESTION_STUDIO_RUNTIME_MODE_V3 = "review-only" as const;
export const COM002_REVIEW_CONTENT_AUTHORITY_VERSION_V3 = "V6_V5_FROZEN" as const;
export const COM002_REVISION_POLICY_V3 = "SOURCE_GENERATOR_ONLY" as const;

const qlIds = listCom002ReviewV6QlIds();
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties: Com002DifficultyV1[] = ["Easy", "Medium", "Hard"];
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

export const COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM002_QUESTION_STUDIO_PACKAGE_ID_V3,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Operating Systems, Files & Windows",
  label: "Computer Awareness · Operating Systems, Files & Windows · V6/V5",
  enabled: true,
  cpIds: ["COM-002-CP-001", "COM-002-CP-002"],
  supportedLanguages,
  runtimeMode: COM002_QUESTION_STUDIO_RUNTIME_MODE_V3,
  supportedRuntimeModes: [COM002_QUESTION_STUDIO_RUNTIME_MODE_V3],
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
    reviewOnly: true,
    contentAuthorityVersion: COM002_REVIEW_CONTENT_AUTHORITY_VERSION_V3,
    humanReviewApproved: true,
    permanentQlIds: qlIds,
    revisionPolicy: COM002_REVISION_POLICY_V3,
    difficultyFilterSupported: true,
    supportedDifficulties,
    difficultyClassifierVersion: COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
    productionDifficultyClaimsAuthorized: false,
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
    localizationVersion: COM002_LOCALIZATION_VERSION_V5,
    operationalFreezeAuthorityId: COM002_V6_V5_OPERATIONAL_FREEZE.authorityId,
    englishCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.englishV6CombinedFingerprint,
    localizationCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.localizationV5CombinedFingerprint,
  },
};

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-002 does not support language ${String(language)}`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-002 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]): Com002DifficultyV1 | null {
  if (!difficulty || difficulty === "Mixed") return null;
  if (supportedDifficulties.includes(difficulty as Com002DifficultyV1)) return difficulty as Com002DifficultyV1;
  throw new Error("COM-002 review difficulty must be Easy, Medium, Hard, or Mixed");
}

function validatePattern(patternId: string | undefined) {
  if (patternId && !qlIds.includes(patternId)) throw new Error(`Unknown COM-002 QL ${patternId}`);
}

export function generateCom002QuestionStudioQuestionV3(input: {
  qlId: string;
  seed: string;
  language: QuestionStudioLanguage;
}) {
  validatePattern(input.qlId);
  const english = generateCom002ReviewQuestionV6({ qlId: input.qlId, seed: input.seed });
  const localized = input.language === "en"
    ? { ...english, language: "en" as const, locale: "en-IN" as const }
    : localizeCom002QuestionV5({ qlId: input.qlId, seed: input.seed, language: input.language });
  const { lifecycleV5: _candidateLifecycle, ...question } = localized as typeof localized & { lifecycleV5?: unknown };
  const difficultyDecision = classifyCom002DifficultyV1(english);

  return {
    ...question,
    ...lifecycle,
    packageId: COM002_QUESTION_STUDIO_PACKAGE_ID_V3,
    patternId: english.qlId,
    text: question.stem,
    correct: question.correctIndex,
    difficulty: difficultyDecision.difficulty,
    difficultyLabel: difficultyDecision.difficulty,
    difficultyDecisionV1: difficultyDecision,
    revisionPolicy: COM002_REVISION_POLICY_V3,
    questionStudioReview: {
      ...lifecycle,
      registrationStatus: "STANDARD_REVIEW_ONLY_ADAPTER_AUDITED_NOT_YET_REGISTRY_BOUND" as const,
      runtimeMode: COM002_QUESTION_STUDIO_RUNTIME_MODE_V3,
      contentAuthorityVersion: COM002_REVIEW_CONTENT_AUTHORITY_VERSION_V3,
      humanReviewApproved: true,
      revisionPolicy: COM002_REVISION_POLICY_V3,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
      localizationVersion: COM002_LOCALIZATION_VERSION_V5,
      operationalFreezeAuthorityId: COM002_V6_V5_OPERATIONAL_FREEZE.authorityId,
      englishCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.englishV6CombinedFingerprint,
      localizationCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.localizationV5CombinedFingerprint,
      difficultyClassifierVersion: difficultyDecision.classifierVersion,
      difficultyTopology: difficultyDecision.topology,
      difficultyRationale: difficultyDecision.rationale,
      productionDifficultyClaimAuthorized: false,
    },
  };
}

export const knowledgeV1Com002QuestionStudioAdapterV3: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (request.packageId && request.packageId !== COM002_QUESTION_STUDIO_PACKAGE_ID_V3) {
      throw new Error(`knowledge-v1 COM-002 adapter cannot generate package ${request.packageId}`);
    }
    if (request.runtimeMode && request.runtimeMode !== COM002_QUESTION_STUDIO_RUNTIME_MODE_V3) {
      throw new Error(`COM-002 only supports ${COM002_QUESTION_STUDIO_RUNTIME_MODE_V3} runtime`);
    }
    validatePattern(request.patternId);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const difficultyFilterApplied = requestedDifficulty !== null;
    const baseSeed = request.seed?.trim() || "com002-question-studio-v6-v5-review";
    const questions: Record<string, unknown>[] = [];
    const maxCandidateCount = Math.max(1000, count * 200);

    for (let candidateIndex = 0; candidateIndex < maxCandidateCount && questions.length < count; candidateIndex += 1) {
      const qlId = request.patternId ?? deterministicPick(qlIds, `${baseSeed}:ql:${candidateIndex}`);
      const question = generateCom002QuestionStudioQuestionV3({
        qlId,
        seed: `${baseSeed}:item:${candidateIndex}`,
        language,
      });
      if (requestedDifficulty && question.difficulty !== requestedDifficulty) continue;
      questions.push(question);
    }

    if (questions.length !== count) {
      throw new Error(
        `COM-002 could not deterministically fill ${count} ${requestedDifficulty ?? "Mixed"} review questions within ${maxCandidateCount} candidates`,
      );
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM002_QUESTION_STUDIO_PACKAGE_ID_V3,
        runtimeMode: COM002_QUESTION_STUDIO_RUNTIME_MODE_V3,
        contentAuthorityVersion: COM002_REVIEW_CONTENT_AUTHORITY_VERSION_V3,
        humanReviewApproved: true,
        reviewOnly: true,
        revisionPolicy: COM002_REVISION_POLICY_V3,
        language,
        requestedDifficulty: requestedDifficulty ?? "Mixed",
        difficultyFilterApplied,
        difficultyClassifierVersion: COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
        productionDifficultyClaimAuthorized: false,
        qlSelection: request.patternId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        permanentQlIds: qlIds,
        englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
        localizationVersion: COM002_LOCALIZATION_VERSION_V5,
        operationalFreezeAuthorityId: COM002_V6_V5_OPERATIONAL_FREEZE.authorityId,
        englishCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.englishV6CombinedFingerprint,
        localizationCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.localizationV5CombinedFingerprint,
      },
    };
  },
};
