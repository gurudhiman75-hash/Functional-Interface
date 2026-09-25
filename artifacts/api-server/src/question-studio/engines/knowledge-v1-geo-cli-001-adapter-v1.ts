import {
  GEO_CLI_001_OWNING_AUTHORITY_V3,
  auditGeoCli001OwningAuthorityV3,
} from "../../knowledge-v1/indian-geography/climate/geo-cli-001-owning-authority-v3";
import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "GEO-CLI-001" as const;
export const GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const GEO_CLI_001_REVISION_POLICY_V1 = "CLOSED_OWNING_POOLS_ONLY" as const;
export const GEO_CLI_001_CONTENT_AUTHORITY_VERSION_V1 = "GEO-CLI-001-OWNING-AUTHORITY-V3" as const;
export const GEO_CLI_001_CHAPTER_CLOSE_AUTHORITY_ID_V1 = "GEO-CLI-001-CONTENT-CLOSED-V1" as const;
export const GEO_CLI_001_MASTERY_AUTHORITY_ID_V1 = "GEO-CLI-001-CP013-V6-CLOSURE-AUTHORITY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

const closure = auditGeoCli001OwningAuthorityV3();
if (!closure.valid) {
  throw new Error(`GEO-CLI-001 Question Studio registration blocked: ${closure.issues.join(" | ")}`);
}

const SOURCE_ROWS = Object.freeze(
  GEO_CLI_001_OWNING_AUTHORITY_V3.map((question) => {
    const match = question.questionId.match(/GEO-CLI-001-(CP\d{3})-/);
    if (!match) throw new Error(`Cannot derive GEO-CLI-001 CP from ${question.questionId}`);
    return Object.freeze({ cpId: `GEO-CLI-001-${match[1]}`, question });
  }),
);

const cpIds = Object.freeze(
  Array.from({ length: 12 }, (_, index) => `GEO-CLI-001-CP${String(index + 1).padStart(3, "0")}`),
);
const authorityByCp = Object.freeze(
  Object.fromEntries(cpIds.map((cpId) => [cpId, `${cpId}-CLOSED-OWNING-V3`])) as Record<string, string>,
);

export const GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1 = Object.freeze(
  SOURCE_ROWS.map(({ cpId, question }) => {
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      throw new Error(`GEO-CLI-001 options are not unique for ${question.questionId}`);
    }
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      throw new Error(`GEO-CLI-001 answer mismatch for ${question.questionId}`);
    }
    if (!question.sourceIds.length || !question.sourceFactIds.length) {
      throw new Error(`GEO-CLI-001 provenance missing for ${question.questionId}`);
    }
    return Object.freeze({
      questionId: question.questionId,
      cpId,
      qlId: question.qlId,
      qlName: question.qlName,
      difficulty: question.difficulty,
      stem: question.stem,
      options: Object.freeze([...question.options]),
      correctIndex: question.correctIndex,
      canonicalAnswer: question.canonicalAnswer,
      explanation: question.explanation,
      sourceIds: Object.freeze([...question.sourceIds]),
      sourceFactIds: Object.freeze([...question.sourceFactIds]),
    });
  }),
);

if (GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1.length !== 648) {
  throw new Error(`GEO-CLI-001 Question Studio corpus must contain 648 owning questions`);
}

const qlIds = Object.freeze([
  ...new Set(GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1.map((question) => question.qlId)),
]);
if (qlIds.length !== 108) {
  throw new Error(`GEO-CLI-001 Question Studio corpus must contain 108 permanent QLs`);
}

function freezeAuthorityForCp(cpId: string) {
  const authorityId = authorityByCp[cpId];
  if (!authorityId) throw new Error(`Unknown GEO-CLI-001 closed CP ${cpId}`);
  return authorityId;
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (language === "en") return language;
  throw new Error(`GEO-CLI-001 currently supports English only; ${String(language)} is not closed`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("GEO-CLI-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("GEO-CLI-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function selectors(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectors(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value));
  const unknown = values.filter(
    (value) =>
      value !== GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value),
  );
  if (unknown.length) throw new Error(`Unknown GEO-CLI-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting GEO-CLI-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting GEO-CLI-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId
    ? String(GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1.find((question) => question.qlId === qlId)?.cpId ?? "")
    : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting GEO-CLI-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const GEO_CLI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Geography",
  subtopic: "Climate of India & Monsoon System",
  label: "Static GK · Indian Geography · Climate of India & Monsoon System · CP001–CP012 Closed",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: GEO_CLI_001_CONTENT_AUTHORITY_VERSION_V1,
    registrationAuthorityIds: cpIds.map((cpId) => freezeAuthorityForCp(cpId)),
    chapterCloseAuthorityId: GEO_CLI_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
    masteryAuthorityId: GEO_CLI_001_MASTERY_AUTHORITY_ID_V1,
    masteryPermanentQlOwner: false,
    authoringReviewApproved: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    contentAuthorityVersion: GEO_CLI_001_CONTENT_AUTHORITY_VERSION_V1,
    permanentQlIds: [...qlIds],
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1.length,
    payloadsPerPermanentQl: 6,
    exhaustiveMasterQuestionCount: 108,
    revisionPolicy: GEO_CLI_001_REVISION_POLICY_V1,
    difficultyFilterSupported: true,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
    explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
  },
};

export function isGeoCli001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectors(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) => value.startsWith("GEO-CLI-001")) ||
    (subject === "static gk" && topic === "indian geography" && subtopic === "climate of india & monsoon system") ||
    (topic === "indian geography" && subtopic === "climate of india & monsoon system")
  );
}

export const knowledgeV1GeoCli001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [GEO_CLI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 GEO-CLI-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`GEO-CLI-001 only supports ${GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "geo-cli-001-question-studio-closed-v1";

    const candidates = GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`GEO-CLI-001 selectors produced no ${difficulty} closed questions`);
    if (count > candidates.length) {
      throw new Error(`GEO-CLI-001 cannot fill ${count} questions from a ${candidates.length}-question closed pool without repeats`);
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
        packageId: GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.qlId,
        qlId: question.qlId,
        cpId: question.cpId,
        subject: "Static GK",
        topic: "Indian Geography",
        subtopic: "Climate of India & Monsoon System",
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
        solverAuthority: "GEO_CLI_001_OWNING_AUTHORITY_V3",
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId,
        authoringReviewApproved: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: GEO_CLI_001_REVISION_POLICY_V1,
        productionReleased: false,
        questionStudioReview: {
          ...lifecycle,
          registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
          registrationAuthorityId,
          runtimeMode: GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
          authoringReviewApproved: true,
          frozenCorpusOnly: true,
          immutableCorpus: true,
          contentAuthorityVersion: registrationAuthorityId,
          revisionPolicy: GEO_CLI_001_REVISION_POLICY_V1,
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
        packageId: GEO_CLI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: GEO_CLI_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: cpId ? freezeAuthorityForCp(cpId) : GEO_CLI_001_CONTENT_AUTHORITY_VERSION_V1,
        authoringReviewApproved: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: GEO_CLI_001_CONTENT_AUTHORITY_VERSION_V1,
        chapterCloseAuthorityId: GEO_CLI_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
        masteryAuthorityId: GEO_CLI_001_MASTERY_AUTHORITY_ID_V1,
        revisionPolicy: GEO_CLI_001_REVISION_POLICY_V1,
        language,
        requestedDifficulty: difficulty,
        difficultyFilterApplied: difficulty !== "Mixed",
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        cpSelection: cpId ?? "DETERMINISTIC_ACROSS_CLOSED_CPS",
        permanentQlIds: [...qlIds],
        cpIds: [...cpIds],
        candidatePoolSize: candidates.length,
        selectionMode: "CLOSED_GEO_CLI_001_CP001_CP012_DETERMINISTIC_WITHOUT_REPLACEMENT",
        explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
        seed,
        count,
      },
    };
  },
};
