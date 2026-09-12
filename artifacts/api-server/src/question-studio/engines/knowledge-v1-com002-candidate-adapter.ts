import { deterministicPick } from "../../knowledge-v1/deterministic";
import {
  classifyCom002DifficultyV1,
  COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
  type Com002DifficultyV1,
} from "../../knowledge-v1/computer-awareness/com002-difficulty-routing-v1";
import {
  COM002_LOCALIZATION_VERSION_V2,
  localizeCom002QuestionV2,
} from "../../knowledge-v1/computer-awareness/com002-localization-v2";
import { COM002_PERMANENT_QLS } from "../../knowledge-v1/computer-awareness/com002-permanent-ql-allocation";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V3,
  generateCom002ReviewQuestionV3,
} from "../../knowledge-v1/computer-awareness/com002-review-synthesis-v3";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 } from "./com002-question-studio-activation-gate-v1";

export const COM002_QUESTION_STUDIO_PACKAGE_ID = "COM-002" as const;
export const COM002_REVIEW_CANDIDATE_RUNTIME_MODE = "review-only-candidate" as const;
export const COM002_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;
export const COM002_REVIEW_CANDIDATE_CONTENT_VERSION =
  "ENGLISH_V3_LOCALIZATION_V2" as const;

const qlIds: string[] = COM002_PERMANENT_QLS.map((ql) => ql.qlId);
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties: Com002DifficultyV1[] = ["Easy", "Medium", "Hard"];

export const COM002_REVIEW_CANDIDATE_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM002_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Operating Systems, Files & Windows",
  label: "Computer Awareness · Operating Systems, Files & Windows · V3/V2 Candidate",
  enabled: false,
  cpIds: ["COM-002-CP-001", "COM-002-CP-002"],
  supportedLanguages,
  runtimeMode: COM002_REVIEW_CANDIDATE_RUNTIME_MODE,
  supportedRuntimeModes: [COM002_REVIEW_CANDIDATE_RUNTIME_MODE],
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "BLOCKED_PENDING_V3_AUTHORITY_CHAIN",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    candidateOnly: true,
    contentCandidateVersion: COM002_REVIEW_CANDIDATE_CONTENT_VERSION,
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
    localizationVersion: COM002_LOCALIZATION_VERSION_V2,
    discoverable: false,
    registrationAllowed: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    humanReviewApproved: false,
    permanentQlIds: qlIds,
    supportedDifficulties,
    difficultyClassifierVersion: COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
    productionDifficultyClaimsAuthorized: false,
    revisionPolicy: COM002_REVISION_POLICY_V1,
    activationGateAuthorityId: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.authorityId,
    activationGateStatus: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.status,
  },
};

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-002 does not support language ${String(language)}`);
}

function normalizeDifficulty(
  difficulty: QuestionStudioGenerationRequest["difficulty"],
): Com002DifficultyV1 | null {
  if (!difficulty || difficulty === "Mixed") return null;
  if (supportedDifficulties.includes(difficulty as Com002DifficultyV1)) {
    return difficulty as Com002DifficultyV1;
  }
  throw new Error("COM-002 candidate difficulty must be Easy, Medium, Hard, or Mixed");
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-002 candidate audit batches require count between 1 and 50");
  }
  return count;
}

function validatePattern(patternId: string | undefined) {
  if (patternId && !qlIds.includes(patternId)) {
    throw new Error(`Unknown COM-002 QL ${patternId}`);
  }
}

export function generateCom002CandidateQuestionForAuditV1(input: {
  qlId: string;
  seed: string;
  language: QuestionStudioLanguage;
}) {
  validatePattern(input.qlId);
  const english = generateCom002ReviewQuestionV3({ qlId: input.qlId, seed: input.seed });
  const question = input.language === "en"
    ? { ...english, language: "en" as const, locale: "en-IN" as const }
    : localizeCom002QuestionV2({
        qlId: input.qlId,
        seed: input.seed,
        language: input.language,
      });
  const difficultyDecision = classifyCom002DifficultyV1(english);

  return {
    ...question,
    packageId: COM002_QUESTION_STUDIO_PACKAGE_ID,
    patternId: english.qlId,
    text: question.stem,
    correct: question.correctIndex,
    difficulty: difficultyDecision.difficulty,
    difficultyLabel: difficultyDecision.difficulty,
    difficultyDecisionV1: difficultyDecision,
    revisionPolicy: COM002_REVISION_POLICY_V1,
    questionStudioCandidate: {
      candidateOnly: true,
      contentCandidateVersion: COM002_REVIEW_CANDIDATE_CONTENT_VERSION,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
      localizationVersion: COM002_LOCALIZATION_VERSION_V2,
      registrationStatus: "BLOCKED_NOT_REGISTERED" as const,
      runtimeMode: COM002_REVIEW_CANDIDATE_RUNTIME_MODE,
      activationGateAuthorityId: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.authorityId,
      activationGateStatus: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.status,
      humanReviewApproved: false,
      reviewRunPersistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      productionReleaseAuthorized: false,
      difficultyClassifierVersion: difficultyDecision.classifierVersion,
      difficultyTopology: difficultyDecision.topology,
      difficultyRationale: difficultyDecision.rationale,
      productionDifficultyClaimAuthorized: false,
    },
  };
}

export async function generateCom002CandidateBatchForAuditV1(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.packageId && request.packageId !== COM002_QUESTION_STUDIO_PACKAGE_ID) {
    throw new Error(`knowledge-v1 COM-002 candidate cannot generate package ${request.packageId}`);
  }
  if (
    request.runtimeMode &&
    request.runtimeMode !== COM002_REVIEW_CANDIDATE_RUNTIME_MODE
  ) {
    throw new Error(`COM-002 candidate only supports ${COM002_REVIEW_CANDIDATE_RUNTIME_MODE}`);
  }
  validatePattern(request.patternId);
  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const baseSeed = request.seed?.trim() || "com002-question-studio-v3-v2-candidate";
  const questions: Record<string, unknown>[] = [];
  const maxCandidateCount = Math.max(500, count * 100);

  for (let candidateIndex = 0; candidateIndex < maxCandidateCount && questions.length < count; candidateIndex += 1) {
    const qlId = request.patternId ?? deterministicPick(
      qlIds,
      `${baseSeed}:ql:${candidateIndex}`,
    );
    const question = generateCom002CandidateQuestionForAuditV1({
      qlId,
      seed: `${baseSeed}:item:${candidateIndex}`,
      language,
    });
    if (requestedDifficulty && question.difficulty !== requestedDifficulty) continue;
    questions.push(question);
  }

  if (questions.length !== count) {
    throw new Error(
      `COM-002 candidate could not deterministically fill ${count} ${requestedDifficulty ?? "Mixed"} questions within ${maxCandidateCount} candidates`,
    );
  }

  return {
    questions,
    generationContext: {
      candidateOnly: true,
      contentCandidateVersion: COM002_REVIEW_CANDIDATE_CONTENT_VERSION,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
      localizationVersion: COM002_LOCALIZATION_VERSION_V2,
      discoverable: false,
      registrationAllowed: false,
      engineId: "knowledge-v1",
      packageId: COM002_QUESTION_STUDIO_PACKAGE_ID,
      runtimeMode: COM002_REVIEW_CANDIDATE_RUNTIME_MODE,
      activationGateAuthorityId: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.authorityId,
      activationGateStatus: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.status,
      language,
      requestedDifficulty: requestedDifficulty ?? "Mixed",
      difficultyClassifierVersion: COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
      humanReviewApproved: false,
      reviewRunPersistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      productionReleaseAuthorized: false,
      permanentQlIds: qlIds,
    },
  };
}

/**
 * Deliberately non-discoverable adapter. Promotion must replace this fail-closed
 * surface only after the approved English V3 + V3-bound localization authority
 * chain supersedes COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.
 */
export const knowledgeV1Com002CandidateAdapter: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [];
  },

  async generate(): Promise<QuestionStudioGenerationResult> {
    throw new Error(
      `COM-002 Question Studio activation blocked by ${COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.authorityId}: ${COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.status}`,
    );
  },
};
