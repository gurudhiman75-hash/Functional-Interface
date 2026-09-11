import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import {
  GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1,
} from "../../knowledge-v1/indian-geography/rivers-drainage/geo-riv-001-cp001-freeze-v1";
import {
  GEO_RIV_001_CP002_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP002_FROZEN_QUESTIONS_V1,
} from "../../knowledge-v1/indian-geography/rivers-drainage/geo-riv-001-cp002-freeze-v1";
import {
  GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1,
} from "../../knowledge-v1/indian-geography/rivers-drainage/geo-riv-001-cp003-freeze-v1";
import {
  GEO_RIV_001_CP004_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP004_FROZEN_QUESTIONS_V1,
} from "../../knowledge-v1/indian-geography/rivers-drainage/geo-riv-001-cp004-freeze-v1";
import {
  GEO_RIV_001_CP005_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP005_FROZEN_QUESTIONS_V1,
} from "../../knowledge-v1/indian-geography/rivers-drainage/geo-riv-001-cp005-freeze-v1";
import {
  GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1,
} from "../../knowledge-v1/indian-geography/rivers-drainage/geo-riv-001-cp008-freeze-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "GEO-RIV-001" as const;
export const GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const GEO_RIV_001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;
export const GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1 =
  `${GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1.authorityId}+${GEO_RIV_001_CP002_FREEZE_AUTHORITY_V1.authorityId}+${GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1.authorityId}+${GEO_RIV_001_CP004_FREEZE_AUTHORITY_V1.authorityId}+${GEO_RIV_001_CP005_FREEZE_AUTHORITY_V1.authorityId}+${GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1.authorityId}` as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;
const cpIds = [
  "GEO-RIV-001-CP001",
  "GEO-RIV-001-CP002",
  "GEO-RIV-001-CP003",
  "GEO-RIV-001-CP004",
  "GEO-RIV-001-CP005",
  "GEO-RIV-001-CP008",
] as const;
const frozenQuestions = [
  ...GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP002_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP004_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP005_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1,
];
const qlIds = [...new Set(frozenQuestions.map((question) => question.qlId))];

function freezeAuthorityForCp(cpId: string) {
  if (cpId === "GEO-RIV-001-CP001") return GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1.authorityId;
  if (cpId === "GEO-RIV-001-CP002") return GEO_RIV_001_CP002_FREEZE_AUTHORITY_V1.authorityId;
  if (cpId === "GEO-RIV-001-CP003") return GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1.authorityId;
  if (cpId === "GEO-RIV-001-CP004") return GEO_RIV_001_CP004_FREEZE_AUTHORITY_V1.authorityId;
  if (cpId === "GEO-RIV-001-CP005") return GEO_RIV_001_CP005_FREEZE_AUTHORITY_V1.authorityId;
  if (cpId === "GEO-RIV-001-CP008") return GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1.authorityId;
  throw new Error(`Unknown GEO-RIV-001 frozen CP ${cpId}`);
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (language === "en") return language;
  throw new Error(`GEO-RIV-001 currently supports English only; ${String(language)} is not frozen`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("GEO-RIV-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("GEO-RIV-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function selectors(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectors(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value as (typeof cpIds)[number]));
  const unknown = values.filter(
    (value) =>
      value !== GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value as (typeof cpIds)[number]),
  );
  if (unknown.length) throw new Error(`Unknown GEO-RIV-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting GEO-RIV-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting GEO-RIV-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? frozenQuestions.find((question) => question.qlId === qlId)?.cpId : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting GEO-RIV-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const GEO_RIV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Geography",
  subtopic: "Indian Rivers & Drainage System",
  label: "Static GK · Indian Geography · Rivers & Drainage · CP001–CP005 + CP008 Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    ...lifecycle,
    registrationAuthorityId: GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1,
    registrationAuthorityIds: [
      GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1.authorityId,
      GEO_RIV_001_CP002_FREEZE_AUTHORITY_V1.authorityId,
      GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1.authorityId,
      GEO_RIV_001_CP004_FREEZE_AUTHORITY_V1.authorityId,
      GEO_RIV_001_CP005_FREEZE_AUTHORITY_V1.authorityId,
      GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1.authorityId,
    ],
    authoringReviewApproved: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    contentAuthorityVersion: GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: frozenQuestions.length,
    revisionPolicy: GEO_RIV_001_REVISION_POLICY_V1,
    difficultyFilterSupported: true,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
    explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
  },
};

export function isGeoRiv001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectors(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) => value.startsWith("GEO-RIV-001")) ||
    (subject === "static gk" && topic === "indian geography" && subtopic === "indian rivers & drainage system") ||
    (topic === "indian geography" && subtopic === "indian rivers & drainage system")
  );
}

export const knowledgeV1GeoRiv001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [GEO_RIV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 GEO-RIV-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`GEO-RIV-001 only supports ${GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "geo-riv-001-question-studio-freeze-v1";

    const candidates = frozenQuestions.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`GEO-RIV-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(`GEO-RIV-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`);
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((question) => {
      const registrationAuthorityId = freezeAuthorityForCp(question.cpId);
      return {
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.qlId,
        qlId: question.qlId,
        cpId: question.cpId,
        subject: "Static GK",
        topic: "Indian Geography",
        subtopic: "Indian Rivers & Drainage System",
        language,
        locale: "en-IN",
        stem: question.stem,
        text: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        correct: question.correctIndex,
        canonicalAnswer: question.canonicalAnswer,
        answer: question.canonicalAnswer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        difficultyLabel: question.difficulty,
        sourceIds: [...question.sourceIds],
        sourceFactIds: [...question.sourceFactIds],
        solverAuthority: question.solverAuthority,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId,
        authoringReviewApproved: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: GEO_RIV_001_REVISION_POLICY_V1,
        productionReleased: false,
        questionStudioReview: {
          ...lifecycle,
          registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
          registrationAuthorityId,
          runtimeMode: GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
          authoringReviewApproved: true,
          frozenCorpusOnly: true,
          immutableCorpus: true,
          contentAuthorityVersion: registrationAuthorityId,
          revisionPolicy: GEO_RIV_001_REVISION_POLICY_V1,
          productionDifficultyClaimAuthorized: false,
          explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
        },
      };
    });

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: GEO_RIV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: GEO_RIV_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: cpId ? freezeAuthorityForCp(cpId) : GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1,
        authoringReviewApproved: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1,
        revisionPolicy: GEO_RIV_001_REVISION_POLICY_V1,
        language,
        requestedDifficulty: difficulty,
        difficultyFilterApplied: difficulty !== "Mixed",
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        cpSelection: cpId ?? "DETERMINISTIC_ACROSS_FROZEN_CPS",
        permanentQlIds: qlIds,
        cpIds: [...cpIds],
        candidatePoolSize: candidates.length,
        selectionMode: "FROZEN_GEO_RIV_001_CP001_CP002_CP003_CP004_CP005_CP008_DETERMINISTIC_WITHOUT_REPLACEMENT",
        explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
        seed,
        count,
      },
    };
  },
};
