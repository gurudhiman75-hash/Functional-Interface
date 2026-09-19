import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import * as cp001 from "../../knowledge-v1/indian-polity/constitutional-history/pol-cp001-review-generator-v1";
import * as cp002 from "../../knowledge-v1/indian-polity/constituent-assembly/pol-cp002-review-generator-v2";
import * as cp003 from "../../knowledge-v1/indian-polity/preamble-union-citizenship/pol-cp003-review-generator-v3";
import * as cp004 from "../../knowledge-v1/indian-polity/fundamental-rights/pol-cp004-review-generator-v3";
import * as cp005 from "../../knowledge-v1/indian-polity/directive-principles-duties/pol-cp005-review-generator-v3";
import * as cp006 from "../../knowledge-v1/indian-polity/amendments-basic-structure-schedules/pol-cp006-review-generator-v3";
import * as cp007 from "../../knowledge-v1/indian-polity/president/pol-cp007-review-generator-v6";
import * as cp008 from "../../knowledge-v1/indian-polity/vice-president/pol-cp008-review-generator-v6";
import * as cp009 from "../../knowledge-v1/indian-polity/prime-minister-union-council/pol-cp009-review-generator-v1";
import * as cp010 from "../../knowledge-v1/indian-polity/parliament-structure-officers/pol-cp010-review-generator-v1";
import * as cp011 from "../../knowledge-v1/indian-polity/parliament-procedure-finance/pol-cp011-review-generator-v2";
import * as cp012 from "../../knowledge-v1/indian-polity/supreme-court/pol-cp012-review-generator-v2";
import * as cp013 from "../../knowledge-v1/indian-polity/high-courts-subordinate-judiciary-writs/pol-cp013-review-generator-v1";
import * as cp014 from "../../knowledge-v1/indian-polity/governor/pol-cp014-review-generator-v1";
import * as cp015 from "../../knowledge-v1/indian-polity/chief-minister-state-council/pol-cp015-review-generator-v1";
import * as cp016 from "../../knowledge-v1/indian-polity/state-legislature/pol-cp016-review-generator-v1";
import * as cp017 from "../../knowledge-v1/indian-polity/centre-state-relations/pol-cp017-review-generator-v2";
import * as cp018 from "../../knowledge-v1/indian-polity/emergency-provisions/pol-cp018-review-generator-v1";
import * as cp019 from "../../knowledge-v1/indian-polity/panchayati-raj/pol-cp019-review-generator-v1";
import * as cp020 from "../../knowledge-v1/indian-polity/municipalities/pol-cp020-review-generator-v1";
import * as cp021 from "../../knowledge-v1/indian-polity/elections-representation-anti-defection/pol-cp021-review-candidate-v1";
import * as cp022 from "../../knowledge-v1/indian-polity/constitutional-bodies/pol-cp022-review-candidate-v2";
import * as cp023 from "../../knowledge-v1/indian-polity/statutory-executive-bodies/pol-cp023-review-candidate-v1";
import * as cp024 from "../../knowledge-v1/indian-polity/official-language-scheduled-tribal-areas/pol-cp024-review-candidate-v1";
import * as cp025 from "../../knowledge-v1/indian-polity/union-territories-special-state-provisions/pol-cp025-review-candidate-v1";
import * as cp026 from "../../knowledge-v1/indian-polity/public-services-administrative-tribunals/pol-cp026-review-candidate-v1";
import * as cp027 from "../../knowledge-v1/indian-polity/trade-commerce-cooperative-societies/pol-cp027-review-candidate-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const POL_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "POL-001" as const;
export const POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "POL-001-ENGLISH-27CP-FREEZE-2026-09-19" as const;
export const POL_001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

type FrozenPolityQuestion = {
  questionId: string;
  cpId: string;
  qlId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function materializeGeneratorModule(
  module: Record<string, unknown>,
  expectedCpId: string,
): FrozenPolityQuestion[] {
  const batchFunctions = Object.entries(module).filter(
    ([name, value]) => /^generatePolCp\d+ReviewBatchV\d+$/.test(name) && typeof value === "function",
  );
  if (!batchFunctions.length) {
    throw new Error(`${expectedCpId} has no Polity review-batch generator export`);
  }

  const highest = batchFunctions.sort(([a], [b]) => b.localeCompare(a))[0]![1] as () => unknown;
  const raw = highest();
  if (!Array.isArray(raw)) throw new Error(`${expectedCpId} review generator did not return an array`);

  return raw.map((value, index) => {
    if (!value || typeof value !== "object") {
      throw new Error(`${expectedCpId} question ${index + 1} is not an object`);
    }
    const q = value as Record<string, unknown>;
    const questionId = String(q.questionId ?? "").trim();
    const qlId = String(q.qlId ?? "").trim();
    const cpId = String(q.cpId ?? expectedCpId).trim();
    const difficulty = String(q.difficulty ?? "").trim();
    const stem = String(q.stem ?? q.text ?? "").trim();
    const explanation = String(q.explanation ?? "").trim();
    const options = Array.isArray(q.options) ? q.options.map((item) => String(item)) : [];
    const correctIndex = Number(q.correctIndex);

    if (!questionId || !qlId || !stem || !explanation) {
      throw new Error(`${expectedCpId} question ${index + 1} is missing required review fields`);
    }
    if (cpId !== expectedCpId) {
      throw new Error(`${expectedCpId} generator emitted mismatched cpId ${cpId}`);
    }
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      throw new Error(`${expectedCpId} question ${questionId} has invalid difficulty ${difficulty}`);
    }
    if (options.length !== 4 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      throw new Error(`${expectedCpId} question ${questionId} has invalid options/correctIndex`);
    }

    const canonicalAnswer = String(q.canonicalAnswer ?? options[correctIndex] ?? "").trim();
    if (!canonicalAnswer || canonicalAnswer !== options[correctIndex]) {
      throw new Error(`${expectedCpId} question ${questionId} has an invalid canonical answer`);
    }

    return {
      questionId,
      cpId,
      qlId,
      difficulty: difficulty as FrozenPolityQuestion["difficulty"],
      stem,
      options,
      correctIndex,
      canonicalAnswer,
      explanation,
      sourceIds: asStringArray(q.sourceIds),
      sourceFactIds: asStringArray(q.sourceFactIds),
    };
  });
}

const modules = [
  ["POL-CP-001", cp001], ["POL-CP-002", cp002], ["POL-CP-003", cp003],
  ["POL-CP-004", cp004], ["POL-CP-005", cp005], ["POL-CP-006", cp006],
  ["POL-CP-007", cp007], ["POL-CP-008", cp008], ["POL-CP-009", cp009],
  ["POL-CP-010", cp010], ["POL-CP-011", cp011], ["POL-CP-012", cp012],
  ["POL-CP-013", cp013], ["POL-CP-014", cp014], ["POL-CP-015", cp015],
  ["POL-CP-016", cp016], ["POL-CP-017", cp017], ["POL-CP-018", cp018],
  ["POL-CP-019", cp019], ["POL-CP-020", cp020], ["POL-CP-021", cp021],
  ["POL-CP-022", cp022], ["POL-CP-023", cp023], ["POL-CP-024", cp024],
  ["POL-CP-025", cp025], ["POL-CP-026", cp026], ["POL-CP-027", cp027],
] as const;

const frozenQuestions = modules.flatMap(([cpId, module]) =>
  materializeGeneratorModule(module as unknown as Record<string, unknown>, cpId),
);

const cpIds = [...new Set(frozenQuestions.map((question) => question.cpId))].sort();
const qlIds = [...new Set(frozenQuestions.map((question) => question.qlId))].sort();

if (cpIds.length !== 27) {
  throw new Error(`POL-001 Question Studio registration requires 27 frozen CPs; found ${cpIds.length}`);
}
for (const [cpId] of modules) {
  if (!frozenQuestions.some((question) => question.cpId === cpId)) {
    throw new Error(`POL-001 frozen corpus has no questions for ${cpId}`);
  }
}
if (new Set(frozenQuestions.map((question) => question.questionId)).size !== frozenQuestions.length) {
  throw new Error("POL-001 frozen runtime corpus contains duplicate question IDs");
}

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`POL-001 currently supports English only; ${String(language)} is not frozen`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("POL-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("POL-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value));
  const unknown = values.filter(
    (value) =>
      value !== POL_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value),
  );
  if (unknown.length) throw new Error(`Unknown POL-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting POL-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting POL-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId
    ? frozenQuestions.find((question) => question.qlId === qlId)?.cpId
    : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting POL-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Polity",
  subtopic: "Complete Chapter",
  label: "Static GK · Indian Polity · POL-CP-001–027 Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    englishEditorialComplete: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    revisionPolicy: POL_001_REVISION_POLICY_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: frozenQuestions.length,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isPol001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === POL_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) => value.startsWith("POL-CP-") || qlIds.includes(value)) ||
    (subject === "static gk" && topic === "indian polity" && (!subtopic || subtopic === "complete chapter")) ||
    (topic === "indian polity" && (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1Pol001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== POL_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 POL-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`POL-001 only supports ${POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "pol-001-question-studio-freeze-v1";

    const candidates = frozenQuestions.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`POL-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(`POL-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`);
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((question) => ({
      ...lifecycle,
      id: question.questionId,
      questionId: question.questionId,
      packageId: POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: question.qlId,
      qlId: question.qlId,
      cpId: question.cpId,
      subject: "Static GK",
      topic: "Indian Polity",
      subtopic: "Complete Chapter",
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
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      reviewOnly: true,
      runtimeRegistered: true,
    }));

    return {
      questions,
      generationContext: {
        engineId: "knowledge-v1",
        packageId: POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        lifecycleStage: lifecycle.stage,
        registrationAuthorityId: POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        language,
        difficulty,
        cpId: cpId ?? null,
        qlId: qlId ?? null,
        seed,
        requestedCount: count,
        candidateCount: candidates.length,
        corpusQuestionCount: frozenQuestions.length,
        cpCount: cpIds.length,
        qlCount: qlIds.length,
      },
    };
  },
};
