import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import { PGK_001_LATE_PROVENANCE_V2 } from "../../knowledge-v1/punjab-gk/pgk-001-late-provenance-v2";
import * as cp001 from "../../knowledge-v1/punjab-gk/pgk-001-cp001-review-batch-v1";
import * as cp002 from "../../knowledge-v1/punjab-gk/pgk-001-cp002-review-batch-v3";
import * as cp003 from "../../knowledge-v1/punjab-gk/pgk-001-cp003-review-batch-v2";
import * as cp004 from "../../knowledge-v1/punjab-gk/pgk-001-cp004-review-batch-v2";
import * as cp005 from "../../knowledge-v1/punjab-gk/pgk-001-cp005-review-batch-v1";
import * as cp006 from "../../knowledge-v1/punjab-gk/pgk-001-cp006-review-batch-v2";
import * as cp007 from "../../knowledge-v1/punjab-gk/pgk-001-cp007-review-batch-v2";
import * as cp008 from "../../knowledge-v1/punjab-gk/pgk-001-cp008-review-batch-v1";
import * as cp009 from "../../knowledge-v1/punjab-gk/pgk-001-cp009-review-batch-v1";
import * as cp010 from "../../knowledge-v1/punjab-gk/pgk-001-cp010-review-batch-v1";
import * as cp011 from "../../knowledge-v1/punjab-gk/pgk-001-cp011-review-batch-v1";
import * as cp012 from "../../knowledge-v1/punjab-gk/pgk-001-cp012-review-batch-v2";
import * as cp013 from "../../knowledge-v1/punjab-gk/pgk-001-cp013-review-batch-v1";
import * as cp014 from "../../knowledge-v1/punjab-gk/pgk-001-cp014-review-batch-v3";
import * as cp015 from "../../knowledge-v1/punjab-gk/pgk-001-cp015-review-batch-v1";
import * as cp016 from "../../knowledge-v1/punjab-gk/pgk-001-cp016-review-batch-v1";
import * as cp017 from "../../knowledge-v1/punjab-gk/pgk-001-cp017-review-batch-v1";
import * as cp018 from "../../knowledge-v1/punjab-gk/pgk-001-cp018-review-batch-v1";
import * as cp019 from "../../knowledge-v1/punjab-gk/pgk-001-cp019-review-batch-v1";
import * as cp020 from "../../knowledge-v1/punjab-gk/pgk-001-cp020-review-batch-v1";
import * as cp021 from "../../knowledge-v1/punjab-gk/pgk-001-cp021-review-batch-v1";
import * as cp022 from "../../knowledge-v1/punjab-gk/pgk-001-cp022-review-batch-v1";
import * as cp023 from "../../knowledge-v1/punjab-gk/pgk-001-cp023-review-batch-v2";
import * as cp024 from "../../knowledge-v1/punjab-gk/pgk-001-cp024-review-batch-v1";
import * as cp025 from "../../knowledge-v1/punjab-gk/pgk-001-cp025-review-batch-v1";
import * as cp026 from "../../knowledge-v1/punjab-gk/pgk-001-cp026-review-batch-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "PGK-001" as const;
export const PGK_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "PGK-001-ENGLISH-26CP-FREEZE-2026-09-18" as const;
export const PGK_001_REVISION_POLICY_V1 = "SOURCE_REVIEW_BATCH_ONLY" as const;

type FrozenPgkQuestion = Readonly<{
  questionId: string;
  cpId: string;
  qlId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
}>;

const modules = [
  ["PGK-001-CP-001", cp001],
  ["PGK-001-CP-002", cp002],
  ["PGK-001-CP-003", cp003],
  ["PGK-001-CP-004", cp004],
  ["PGK-001-CP-005", cp005],
  ["PGK-001-CP-006", cp006],
  ["PGK-001-CP-007", cp007],
  ["PGK-001-CP-008", cp008],
  ["PGK-001-CP-009", cp009],
  ["PGK-001-CP-010", cp010],
  ["PGK-001-CP-011", cp011],
  ["PGK-001-CP-012", cp012],
  ["PGK-001-CP-013", cp013],
  ["PGK-001-CP-014", cp014],
  ["PGK-001-CP-015", cp015],
  ["PGK-001-CP-016", cp016],
  ["PGK-001-CP-017", cp017],
  ["PGK-001-CP-018", cp018],
  ["PGK-001-CP-019", cp019],
  ["PGK-001-CP-020", cp020],
  ["PGK-001-CP-021", cp021],
  ["PGK-001-CP-022", cp022],
  ["PGK-001-CP-023", cp023],
  ["PGK-001-CP-024", cp024],
  ["PGK-001-CP-025", cp025],
  ["PGK-001-CP-026", cp026],
] as const;

function materializeModule(
  cpId: string,
  module: Record<string, unknown>,
): FrozenPgkQuestion[] {
  const batches = Object.entries(module)
    .filter(([name, value]) =>
      /^PGK_001_CP\d+_REVIEW_BATCH_V\d+$/.test(name) && Array.isArray(value),
    )
    .sort(([a], [b]) => b.localeCompare(a));

  if (!batches.length) {
    throw new Error(`${cpId} has no frozen Punjab GK review batch export`);
  }

  const rows = batches[0]![1] as unknown[];
  return rows.map((value, index) => {
    const row = value as Record<string, unknown>;
    if (row.reviewOnly !== true || row.runtimeRegistered !== false) {
      throw new Error(`${cpId} review row ${index + 1} violates the frozen review lifecycle`);
    }

    const qlId = String(row.qlId ?? "").trim().toUpperCase();
    const stem = String(row.stem ?? row.question ?? "").trim();
    const explanation = String(row.explanation ?? "").trim();
    const difficulty = String(row.difficulty ?? "") as FrozenPgkQuestion["difficulty"];
    const options = Array.isArray(row.options) ? row.options.map((option) => String(option)) : [];
    let correctIndex = Number.isInteger(row.correctIndex) ? Number(row.correctIndex) : -1;
    let canonicalAnswer = String(row.canonicalAnswer ?? row.answer ?? "").trim();

    if (!canonicalAnswer && correctIndex >= 0 && correctIndex < options.length) {
      canonicalAnswer = options[correctIndex]!;
    }
    if (correctIndex < 0 && canonicalAnswer) {
      correctIndex = options.indexOf(canonicalAnswer);
    }

    const questionId = String(
      row.questionId ?? row.id ?? `${cpId}-Q${String(index + 1).padStart(3, "0")}`,
    ).trim();
    const rowSourceIds = Array.isArray(row.sourceIds) ? row.sourceIds.map(String) : [];
    const rowSourceFactIds = Array.isArray(row.sourceFactIds)
      ? row.sourceFactIds.map(String)
      : Array.isArray(row.factIds)
        ? row.factIds.map(String)
        : [];
    const lateProvenance = PGK_001_LATE_PROVENANCE_V2[qlId];
    const sourceIds = rowSourceIds.length ? rowSourceIds : [...(lateProvenance?.sourceIds ?? [])];
    const sourceFactIds = rowSourceFactIds.length ? rowSourceFactIds : [...(lateProvenance?.factIds ?? [])];

    if (!/^PGK-001-QL-\d{3}$/.test(qlId)) throw new Error(`${questionId}: invalid QL ID ${qlId}`);
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) throw new Error(`${questionId}: invalid difficulty`);
    if (!stem || !explanation) throw new Error(`${questionId}: missing learner text`);
    if (options.length !== 4 || new Set(options).size !== 4) throw new Error(`${questionId}: options must be four unique values`);
    if (correctIndex < 0 || correctIndex >= options.length || options[correctIndex] !== canonicalAnswer) {
      throw new Error(`${questionId}: answer/options mismatch`);
    }

    return Object.freeze({
      questionId,
      cpId,
      qlId,
      difficulty,
      stem,
      options: Object.freeze([...options]),
      correctIndex,
      canonicalAnswer,
      explanation,
      sourceIds: Object.freeze([...sourceIds]),
      sourceFactIds: Object.freeze([...sourceFactIds]),
    });
  });
}

function normalizeOptionPosition(
  question: FrozenPgkQuestion,
  desiredCorrectIndex: number,
): FrozenPgkQuestion {
  if (question.correctIndex === desiredCorrectIndex) return question;
  const options = [...question.options];
  const [answer] = options.splice(question.correctIndex, 1);
  if (answer == null) throw new Error(`${question.questionId}: missing canonical answer option`);
  options.splice(desiredCorrectIndex, 0, answer);
  return Object.freeze({
    ...question,
    options: Object.freeze(options),
    correctIndex: desiredCorrectIndex,
  });
}

const materializedCorpus = modules.flatMap(([cpId, module]) =>
  materializeModule(cpId, module as unknown as Record<string, unknown>),
);

export const PGK_001_QUESTION_STUDIO_CORPUS_V1: readonly FrozenPgkQuestion[] = Object.freeze(
  materializedCorpus.map((question, index) => normalizeOptionPosition(question, index % 4)),
);

const cpIds = modules.map(([cpId]) => cpId);
const qlIds = [...new Set(PGK_001_QUESTION_STUDIO_CORPUS_V1.map((question) => question.qlId))].sort();

if (PGK_001_QUESTION_STUDIO_CORPUS_V1.length !== 1092) {
  throw new Error(
    `PGK-001 Question Studio registration requires 1092 frozen questions; found ${PGK_001_QUESTION_STUDIO_CORPUS_V1.length}`,
  );
}
if (cpIds.length !== 26 || new Set(cpIds).size !== 26) {
  throw new Error("PGK-001 Question Studio registration requires 26 unique CPs");
}
if (qlIds.length !== 182) {
  throw new Error(`PGK-001 Question Studio registration requires 182 permanent QLs; found ${qlIds.length}`);
}
if (new Set(PGK_001_QUESTION_STUDIO_CORPUS_V1.map((question) => question.questionId)).size !==
    PGK_001_QUESTION_STUDIO_CORPUS_V1.length) {
  throw new Error("PGK-001 frozen corpus contains duplicate question IDs");
}
for (const qlId of qlIds) {
  const count = PGK_001_QUESTION_STUDIO_CORPUS_V1.filter((question) => question.qlId === qlId).length;
  if (count !== 6) throw new Error(`${qlId} must expose exactly six frozen questions; found ${count}`);
}

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`PGK-001 currently supports English only; ${String(language)} is not frozen`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("PGK-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("PGK-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compactCp = raw.match(/^PGK-001-CP(\d{3})$/);
  return compactCp ? `PGK-001-CP-${compactCp[1]}` : raw;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map(normalizeSelector)
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value as typeof cpIds[number]));
  const unknown = values.filter(
    (value) =>
      value !== PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value as typeof cpIds[number]),
  );

  if (unknown.length) throw new Error(`Unknown PGK-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting PGK-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting PGK-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId
    ? PGK_001_QUESTION_STUDIO_CORPUS_V1.find((question) => question.qlId === qlId)?.cpId
    : undefined;

  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting PGK-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const PGK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Punjab GK",
  subtopic: "Complete Chapter",
  label: "Static GK · Punjab GK · PGK-001 CP001–CP026 Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: PGK_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [PGK_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    chapterContentComplete: true,
    englishEditorialComplete: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    balancedCorrectOptionPositions: true,
    optionOrderPolicy: "GLOBAL_A_B_C_D_ROUND_ROBIN_V2",
    lateProvenanceOverlay: "PGK-001-LATE-PROVENANCE-V2",
    revisionPolicy: PGK_001_REVISION_POLICY_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: PGK_001_QUESTION_STUDIO_CORPUS_V1.length,
    payloadsPerPermanentQl: 6,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isPgk001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) =>
      value.startsWith("PGK-001-CP-") ||
      /^PGK-001-CP\d{3}$/.test(value) ||
      qlIds.includes(value)
    ) ||
    (subject === "static gk" && (topic === "punjab gk" || topic === "punjab general knowledge") &&
      (!subtopic || subtopic === "complete chapter")) ||
    ((topic === "punjab gk" || topic === "punjab general knowledge") &&
      (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1Pgk001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [PGK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 PGK-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== PGK_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`PGK-001 only supports ${PGK_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "pgk-001-question-studio-freeze-v1";

    const candidates = PGK_001_QUESTION_STUDIO_CORPUS_V1.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`PGK-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(
        `PGK-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`,
      );
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((question) => ({
      ...lifecycle,
      id: question.questionId,
      questionId: question.questionId,
      packageId: PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: question.qlId,
      qlId: question.qlId,
      cpId: question.cpId,
      subject: "Static GK",
      topic: "Punjab GK",
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
      registrationAuthorityId: PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      revisionPolicy: PGK_001_REVISION_POLICY_V1,
      productionReleased: false,
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: PGK_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: PGK_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        chapterContentComplete: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        revisionPolicy: PGK_001_REVISION_POLICY_V1,
        language,
        difficulty,
        cpId: cpId ?? null,
        qlId: qlId ?? null,
        seed,
        requestedCount: count,
        candidateCount: candidates.length,
        corpusQuestionCount: PGK_001_QUESTION_STUDIO_CORPUS_V1.length,
        cpCount: cpIds.length,
        qlCount: qlIds.length,
      },
    };
  },
};
