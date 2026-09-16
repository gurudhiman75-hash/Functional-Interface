import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import * as cp001 from "../../knowledge-v1/indian-economy/basic-economic-concepts/eco-cp001-review-generator-v2";
import * as cp002 from "../../knowledge-v1/indian-economy/economic-systems-sectors/eco-cp002-review-generator-v2";
import * as cp003 from "../../knowledge-v1/indian-economy/national-income-aggregates/eco-cp003-review-generator-v2";
import * as cp004 from "../../knowledge-v1/indian-economy/national-income-measurement-india/eco-cp004-review-generator-v2";
import * as cp005 from "../../knowledge-v1/indian-economy/inflation-price-concepts/eco-cp005-review-generator-v1";
import * as cp006 from "../../knowledge-v1/indian-economy/employment-unemployment-poverty/eco-cp006-review-generator-v1";
import * as cp007 from "../../knowledge-v1/indian-economy/money-monetary-system/eco-cp007-review-generator-v1";
import * as cp008 from "../../knowledge-v1/indian-economy/reserve-bank-of-india/eco-cp008-review-generator-v1";
import * as cp009 from "../../knowledge-v1/indian-economy/monetary-policy/eco-cp009-review-generator-v1";
import * as cp010 from "../../knowledge-v1/indian-economy/banking-system/eco-cp010-review-generator-v1";
import * as cp011 from "../../knowledge-v1/indian-economy/financial-institutions/eco-cp011-review-generator-v1";
import * as cp012 from "../../knowledge-v1/indian-economy/public-finance-fiscal-policy/eco-cp012-review-generator-v2";
import * as cp013 from "../../knowledge-v1/indian-economy/government-budget/eco-cp013-review-generator-v1";
import * as cp014 from "../../knowledge-v1/indian-economy/taxation/eco-cp014-review-generator-v1";
import * as cp015 from "../../knowledge-v1/indian-economy/economic-planning/eco-cp015-review-generator-v2";
import * as cp016 from "../../knowledge-v1/indian-economy/economic-reforms-1991/eco-cp016-review-generator-v1";
import * as cp017 from "../../knowledge-v1/indian-economy/agriculture-indian-economy/eco-cp017-review-generator-v1";
import * as cp018 from "../../knowledge-v1/indian-economy/industrial-development/eco-cp018-review-generator-v1";
import * as cp019 from "../../knowledge-v1/indian-economy/financial-markets/eco-cp019-review-generator-v1";
import * as cp020 from "../../knowledge-v1/indian-economy/external-sector-bop/eco-cp020-review-generator-v1";
import * as cp021 from "../../knowledge-v1/indian-economy/international-economic-institutions/eco-cp021-review-generator-v2";
import * as cp022 from "../../knowledge-v1/indian-economy/human-development-development-economics/eco-cp022-review-generator-v1";
import * as cp023 from "../../knowledge-v1/indian-economy/important-economic-events-milestones/eco-cp023-review-generator-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "ECO-001" as const;
export const ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "ECO-001-ENGLISH-23CP-FREEZE-2026-09-16" as const;
export const ECO_001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

type FrozenEconomyQuestion = {
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
  reviewOnly: true;
  runtimeRegistered: false;
};

function materializeGeneratorModule(module: Record<string, unknown>): FrozenEconomyQuestion[] {
  const batchFunctions = Object.entries(module).filter(
    ([name, value]) => /^generateEcoCp\d+ReviewBatchV\d+$/.test(name) && typeof value === "function",
  );
  if (batchFunctions.length) {
    const highest = batchFunctions.sort(([a], [b]) => b.localeCompare(a))[0]![1] as () => unknown;
    const questions = highest();
    if (!Array.isArray(questions)) throw new Error("Economy review generator did not return an array");
    return questions as FrozenEconomyQuestion[];
  }

  const arrays = Object.entries(module).filter(
    ([name, value]) => /^ECO_CP\d+_REVIEW_V\d+$/.test(name) && Array.isArray(value),
  );
  if (!arrays.length) throw new Error("Economy generator module has no review batch export");
  const highest = arrays.sort(([a], [b]) => b.localeCompare(a))[0]![1];
  return highest as FrozenEconomyQuestion[];
}

const modules = [
  cp001, cp002, cp003, cp004, cp005, cp006, cp007, cp008, cp009, cp010, cp011, cp012,
  cp013, cp014, cp015, cp016, cp017, cp018, cp019, cp020, cp021, cp022, cp023,
] as const;

const frozenQuestions = modules.flatMap((module) =>
  materializeGeneratorModule(module as unknown as Record<string, unknown>),
);

const cpIds = [...new Set(frozenQuestions.map((question) => question.cpId))].sort();
const qlIds = [...new Set(frozenQuestions.map((question) => question.qlId))].sort();

if (cpIds.length !== 23) {
  throw new Error(`ECO-001 Question Studio registration requires 23 frozen CPs; found ${cpIds.length}`);
}
if (new Set(frozenQuestions.map((question) => question.questionId)).size !== frozenQuestions.length) {
  throw new Error("ECO-001 frozen runtime corpus contains duplicate question IDs");
}

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ECO-001 currently supports English only; ${String(language)} is not frozen`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("ECO-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("ECO-001 difficulty must be Easy, Medium, Hard, or Mixed");
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
      value !== ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value),
  );
  if (unknown.length) throw new Error(`Unknown ECO-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting ECO-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting ECO-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId
    ? String(frozenQuestions.find((question) => question.qlId === qlId)?.cpId ?? "")
    : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting ECO-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Economy",
  subtopic: "Complete Chapter",
  label: "Static GK · Indian Economy · ECO-CP-001–023 Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    englishEditorialComplete: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    revisionPolicy: ECO_001_REVISION_POLICY_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: frozenQuestions.length,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEco001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) => value.startsWith("ECO-CP-") || qlIds.includes(value)) ||
    (subject === "static gk" && topic === "indian economy" && (!subtopic || subtopic === "complete chapter")) ||
    (topic === "indian economy" && (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1Eco001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 ECO-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`ECO-001 only supports ${ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "eco-001-question-studio-freeze-v1";

    const candidates = frozenQuestions.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`ECO-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(`ECO-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`);
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((question) => ({
      ...lifecycle,
      id: question.questionId,
      questionId: question.questionId,
      packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: question.qlId,
      qlId: question.qlId,
      cpId: question.cpId,
      subject: "Static GK",
      topic: "Indian Economy",
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
      registrationAuthorityId: ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      reviewOnly: true,
      runtimeRegistered: true,
    }));

    return {
      questions,
      generationContext: {
        engineId: "knowledge-v1",
        packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        lifecycleStage: lifecycle.stage,
        registrationAuthorityId: ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
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
