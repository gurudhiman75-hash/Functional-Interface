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
import {
  COM001_CP006_ENGLISH_FROZEN,
  COM001_CP006_HINDI_FROZEN,
  COM001_CP006_PUNJABI_FROZEN,
  COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1,
  COM001_CP006_LOCALIZATION_FREEZE_AUTHORITY_V1,
  auditCom001Cp006FreezeV1,
} from "../../knowledge-v1/computer-awareness/com001-cp006-freeze-v1";
import {
  COM001_CP002_CP005_ENGLISH_FROZEN,
  COM001_CP002_CP005_HINDI_FROZEN,
  COM001_CP002_CP005_PUNJABI_FROZEN,
  COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1,
  COM001_CP002_CP005_LOCALIZATION_FREEZE_AUTHORITY_V1,
  auditCom001Cp002Cp005FreezeV1,
} from "../../knowledge-v1/computer-awareness/com001-cp002-cp005-freeze-v1";
import type { Com001DifficultyDecisionV2 } from "../../knowledge-v1/computer-awareness/com001-difficulty-routing-v2";
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
export const COM001_CP006_CONTENT_AUTHORITY_VERSION = "COM-001-CP-006-FREEZE-V1" as const;
export const COM001_COMPLETION_CONTENT_AUTHORITY_VERSION = "COM-001-CP-002-CP-005-FREEZE-V1" as const;

const qlIds = listCom001ReviewV2QlIds();
const cp006QlIds = [...COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds];
const completionQlIds = [...COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds];
const allQlIds = [...qlIds, ...completionQlIds, ...cp006QlIds];
const cpIds = ["COM-001-CP-001", "COM-001-CP-002", "COM-001-CP-003", "COM-001-CP-004", "COM-001-CP-005", "COM-001-CP-006"] as const;
const completionAudit = auditCom001Cp002Cp005FreezeV1();
if (!completionAudit.valid) throw new Error(`COM-001 completion freeze invalid: ${completionAudit.issues.join(", ")}`);
const cp006Audit = auditCom001Cp006FreezeV1();
if (!cp006Audit.valid) throw new Error(`COM-001 CP-006 freeze invalid: ${cp006Audit.issues.join(", ")}`);
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties: Com001DifficultyV2[] = ["Easy", "Medium"];
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

const qlDifficultySupport: Record<string, readonly Com001DifficultyV2[]> = {
  "COM-001-QL-001": ["Easy", "Medium"],
  "COM-001-QL-002": ["Easy", "Medium"],
  "COM-001-QL-003": ["Easy", "Medium"],
  "COM-001-QL-004": ["Easy", "Medium"],
  "COM-001-QL-005": ["Easy", "Medium"],
  "COM-001-QL-006": ["Medium"],
  "COM-001-QL-007": ["Medium"],
  "COM-001-QL-008": ["Medium"],
  "COM-001-QL-009": ["Easy", "Medium"],
  "COM-001-CP-002": ["Easy", "Medium"],
  "COM-001-CP-003": ["Easy", "Medium"],
  "COM-001-CP-004": ["Easy", "Medium"],
  "COM-001-CP-005": ["Easy", "Medium"],
  "COM-001-CP-002-QL-001": ["Easy", "Medium"],
  "COM-001-CP-002-QL-002": ["Easy", "Medium"],
  "COM-001-CP-002-QL-003": ["Easy", "Medium"],
  "COM-001-CP-002-QL-004": ["Easy", "Medium"],
  "COM-001-CP-003-QL-001": ["Easy", "Medium"],
  "COM-001-CP-003-QL-002": ["Easy", "Medium"],
  "COM-001-CP-003-QL-003": ["Easy", "Medium"],
  "COM-001-CP-003-QL-004": ["Easy", "Medium"],
  "COM-001-CP-004-QL-001": ["Easy", "Medium"],
  "COM-001-CP-004-QL-002": ["Easy", "Medium"],
  "COM-001-CP-004-QL-003": ["Easy", "Medium"],
  "COM-001-CP-004-QL-004": ["Easy", "Medium"],
  "COM-001-CP-005-QL-001": ["Easy", "Medium"],
  "COM-001-CP-005-QL-002": ["Easy", "Medium"],
  "COM-001-CP-005-QL-003": ["Easy", "Medium"],
  "COM-001-CP-005-QL-004": ["Easy", "Medium"],
  "COM-001-CP-006-QL-001": ["Easy", "Medium"],
  "COM-001-CP-006-QL-002": ["Easy", "Medium"],
  "COM-001-CP-006-QL-003": ["Easy", "Medium"],
  "COM-001-CP-006-QL-004": ["Easy", "Medium"],
  "COM-001-CP-006-QL-005": ["Easy", "Medium"],
  "COM-001-CP-006-QL-006": ["Easy", "Medium"],
  "COM-001-CP-006-QL-007": ["Easy", "Medium"],
  "COM-001-CP-006": ["Easy", "Medium"],
};

export const COM001_STANDARD_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Computer Fundamentals, Devices, Memory, Ports, History & Generations",
  label: "Computer Awareness · Complete Fundamentals · V3",
  enabled: true,
  cpIds: [...cpIds],
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
    permanentQlIds: allQlIds,
    cpIds: [...cpIds],
    completionQuestionCountPerLanguage: 32,
    completionEnglishFreezeAuthorityId: COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    completionLocalizationFreezeAuthorityId: COM001_CP002_CP005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    cp006QuestionCountPerLanguage: 28,
    cp006EnglishFreezeAuthorityId: COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    cp006LocalizationFreezeAuthorityId: COM001_CP006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    revisionPolicy: COM001_REVISION_POLICY,
    difficultyFilterSupported: true,
    supportedDifficulties,
    hardDifficultyAuthorized: false,
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
  throw new Error(`COM-001 review difficulty must be Easy, Medium, or Mixed`);
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
  if (request.patternId && !allQlIds.includes(request.patternId) && !cpIds.includes(request.patternId as (typeof cpIds)[number])) {
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

function completionPool(language: QuestionStudioLanguage, patternId?: string) {
  const corpus = language === "en"
    ? COM001_CP002_CP005_ENGLISH_FROZEN
    : language === "hi"
      ? COM001_CP002_CP005_HINDI_FROZEN
      : COM001_CP002_CP005_PUNJABI_FROZEN;
  if (!patternId || ["COM-001-CP-002", "COM-001-CP-003", "COM-001-CP-004", "COM-001-CP-005"].includes(patternId)) {
    return patternId ? corpus.filter((question) => question.cpId === patternId) : corpus;
  }
  return corpus.filter((question) => question.qlId === patternId);
}

function frozenDifficultyDecision(difficulty: "EASY" | "MEDIUM", rationale: string): Com001DifficultyDecisionV2 {
  return {
    difficulty: difficulty === "EASY" ? "Easy" : "Medium",
    topology: difficulty === "EASY" ? "DIRECT_SINGLE_FACT" : "MATCHED_PAIR",
    rationale,
    classifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
    productionClaimAuthorized: false,
  };
}

function cp006Pool(language: QuestionStudioLanguage, patternId?: string) {
  const corpus = language === "en"
    ? COM001_CP006_ENGLISH_FROZEN
    : language === "hi"
      ? COM001_CP006_HINDI_FROZEN
      : COM001_CP006_PUNJABI_FROZEN;
  if (!patternId || patternId === "COM-001-CP-006") return corpus;
  return corpus.filter((question) => question.qlId === patternId);
}

function cp006DifficultyDecision(difficulty: "EASY" | "MEDIUM"): Com001DifficultyDecisionV2 {
  if (difficulty === "EASY") {
    return {
      difficulty: "Easy",
      topology: "DIRECT_SINGLE_FACT",
      rationale: "Directly recognizes one basic computer-history fact.",
      classifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
      productionClaimAuthorized: false,
    };
  }
  return {
    difficulty: "Medium",
    topology: "MATCHED_PAIR",
    rationale: "Requires checking a historical person, machine, technology or sequence against the correct match.",
    classifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
    productionClaimAuthorized: false,
  };
}

function generateCandidate(input: {
  baseSeed: string;
  candidateIndex: number;
  patternId?: string;
  language: QuestionStudioLanguage;
}) {
  const selectedPatternId = input.patternId ?? deterministicPick(
    allQlIds,
    `${input.baseSeed}:ql:${input.candidateIndex}`,
  );
  const completionRequest = ["COM-001-CP-002", "COM-001-CP-003", "COM-001-CP-004", "COM-001-CP-005"].includes(selectedPatternId) || completionQlIds.includes(selectedPatternId);
  if (completionRequest) {
    const pool = completionPool(input.language, selectedPatternId);
    const frozen = pool[input.candidateIndex % pool.length]!;
    const question = {
      ...frozen,
      sourceCandidateIds: [frozen.sourceQuestionId],
      sourceFactIds: [...frozen.sourceFactIds],
      contentAuthorityVersion: COM001_COMPLETION_CONTENT_AUTHORITY_VERSION,
    };
    return { question, difficultyDecision: frozenDifficultyDecision(frozen.difficulty, "Tests one computer-fundamentals fact or correct device-purpose match.") };
  }

  const cp006Request = selectedPatternId === "COM-001-CP-006" || cp006QlIds.includes(selectedPatternId);
  if (cp006Request) {
    const pool = cp006Pool(input.language, selectedPatternId);
    const frozen = pool[input.candidateIndex % pool.length]!;
    const question = {
      ...frozen,
      cpId: "COM-001-CP-006",
      sourceCandidateIds: [frozen.sourceQuestionId],
      sourceFactIds: [...frozen.sourceFactIds],
      contentAuthorityVersion: COM001_CP006_CONTENT_AUTHORITY_VERSION,
    };
    return { question, difficultyDecision: cp006DifficultyDecision(frozen.difficulty) };
  }

  const qlId = selectedPatternId;
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
    const isCompletionRequest = ["COM-001-CP-002", "COM-001-CP-003", "COM-001-CP-004", "COM-001-CP-005"].includes(request.patternId ?? "") || completionQlIds.includes(request.patternId ?? "");
    const isCp006Request = request.patternId === "COM-001-CP-006" || cp006QlIds.includes(request.patternId ?? "");
    const completionAvailable = isCompletionRequest
      ? completionPool(language, request.patternId).filter((question) => !requestedDifficulty || question.difficulty === requestedDifficulty.toUpperCase()).length
      : 0;
    if (isCompletionRequest && count > completionAvailable) {
      throw new Error(`COM-001 completion packs cannot fill ${count} questions from a ${completionAvailable}-question frozen pool without repeats`);
    }
    const cp006Available = isCp006Request
      ? cp006Pool(language, request.patternId).filter((question) => !requestedDifficulty || question.difficulty === requestedDifficulty.toUpperCase()).length
      : 0;
    if (isCp006Request && count > cp006Available) {
      throw new Error(`COM-001 CP-006 cannot fill ${count} questions from a ${cp006Available}-question frozen pool without repeats`);
    }
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
          contentAuthorityVersion: isCompletionRequest ? COM001_COMPLETION_CONTENT_AUTHORITY_VERSION : isCp006Request ? COM001_CP006_CONTENT_AUTHORITY_VERSION : COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
          humanReviewApproved: true,
          revisionPolicy: COM001_REVISION_POLICY,
          difficultyFilterApplied,
          requestedDifficulty: requestedDifficulty ?? "Mixed",
          classifiedDifficulty: difficultyDecision.difficulty,
          difficultyClassifierVersion: difficultyDecision.classifierVersion,
          hardDifficultyAuthorized: false,
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
        contentAuthorityVersion: isCompletionRequest ? COM001_COMPLETION_CONTENT_AUTHORITY_VERSION : isCp006Request ? COM001_CP006_CONTENT_AUTHORITY_VERSION : COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
        humanReviewApproved: true,
        reviewOnly: false,
        revisionPolicy: COM001_REVISION_POLICY,
        language,
        requestedDifficulty: requestedDifficulty ?? "Mixed",
        difficultyFilterApplied,
        difficultyClassifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
        hardDifficultyAuthorized: false,
        productionDifficultyClaimAuthorized: false,
        qlSelection: request.patternId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        permanentQlIds: allQlIds,
        cpIds: [...cpIds],
        completionEnglishFreezeAuthorityId: COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
        completionLocalizationFreezeAuthorityId: COM001_CP002_CP005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
        cp006EnglishFreezeAuthorityId: COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
        cp006LocalizationFreezeAuthorityId: COM001_CP006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
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
