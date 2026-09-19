import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import { applyPolityFinalEditorialStemPass } from "../../knowledge-v1/indian-polity/pol-001-final-editorial-stem-pass-v1";
import { generatePolCp001ReviewBatchV1 } from "../../knowledge-v1/indian-polity/constitutional-history/pol-cp001-review-generator-v1";
import { generatePolCp002ReviewBatchV2 } from "../../knowledge-v1/indian-polity/constituent-assembly/pol-cp002-review-generator-v2";
import { generatePolCp003ReviewBatchV3 } from "../../knowledge-v1/indian-polity/preamble-union-citizenship/pol-cp003-review-generator-v3";
import { generatePolCp004ReviewBatchV3 } from "../../knowledge-v1/indian-polity/fundamental-rights/pol-cp004-review-generator-v3";
import { generatePolCp005ReviewBatchV3 } from "../../knowledge-v1/indian-polity/directive-principles-duties/pol-cp005-review-generator-v3";
import { generatePolCp006ReviewBatchV3 } from "../../knowledge-v1/indian-polity/amendments-basic-structure-schedules/pol-cp006-review-generator-v3";
import { generatePolCp007ReviewBatchV7 } from "../../knowledge-v1/indian-polity/president/pol-cp007-review-generator-v7";
import { generatePolCp008ReviewBatchV7 } from "../../knowledge-v1/indian-polity/vice-president/pol-cp008-review-generator-v7";
import { generatePolCp009ReviewBatchV1 } from "../../knowledge-v1/indian-polity/prime-minister-union-council/pol-cp009-review-generator-v1";
import { generatePolCp010ReviewBatchV1 } from "../../knowledge-v1/indian-polity/parliament-structure-officers/pol-cp010-review-generator-v1";
import { generatePolCp011ReviewBatchV2 } from "../../knowledge-v1/indian-polity/parliament-procedure-finance/pol-cp011-review-generator-v2";
import { generatePolCp012ReviewBatchV3 } from "../../knowledge-v1/indian-polity/supreme-court/pol-cp012-review-generator-v3";
import { generatePolCp013ReviewBatchV3 } from "../../knowledge-v1/indian-polity/high-courts-subordinate-judiciary-writs/pol-cp013-review-generator-v3";
import { generatePolCp014ReviewBatchV3 } from "../../knowledge-v1/indian-polity/governor/pol-cp014-review-generator-v3";
import { generatePolCp015ReviewBatchV1 } from "../../knowledge-v1/indian-polity/chief-minister-state-council/pol-cp015-review-generator-v1";
import { generatePolCp016ReviewBatchV2 } from "../../knowledge-v1/indian-polity/state-legislature/pol-cp016-review-generator-v2";
import { generatePolCp017ReviewBatchV2 } from "../../knowledge-v1/indian-polity/centre-state-relations/pol-cp017-review-generator-v2";
import { generatePolCp018ReviewBatchV1 } from "../../knowledge-v1/indian-polity/emergency-provisions/pol-cp018-review-generator-v1";
import { generatePolCp019ReviewBatchV1 } from "../../knowledge-v1/indian-polity/panchayati-raj/pol-cp019-review-generator-v1";
import { generatePolCp020ReviewBatchV1 } from "../../knowledge-v1/indian-polity/municipalities/pol-cp020-review-generator-v1";
import { generatePolCp021ReviewBatchV1 } from "../../knowledge-v1/indian-polity/elections-representation-anti-defection/pol-cp021-review-candidate-v1";
import { generatePolCp022ReviewBatchV2 } from "../../knowledge-v1/indian-polity/constitutional-bodies/pol-cp022-review-candidate-v2";
import { generatePolCp023ReviewBatchV1 } from "../../knowledge-v1/indian-polity/statutory-executive-bodies/pol-cp023-review-candidate-v1";
import { generatePolCp024ReviewBatchV1 } from "../../knowledge-v1/indian-polity/official-language-scheduled-tribal-areas/pol-cp024-review-candidate-v1";
import { generatePolCp025ReviewBatchV1 } from "../../knowledge-v1/indian-polity/union-territories-special-state-provisions/pol-cp025-review-candidate-v1";
import { generatePolCp026ReviewBatchV3 } from "../../knowledge-v1/indian-polity/public-services-administrative-tribunals/pol-cp026-review-candidate-v3";
import { generatePolCp027ReviewBatchV1 } from "../../knowledge-v1/indian-polity/trade-commerce-cooperative-societies/pol-cp027-review-candidate-v1";
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
  "POL-001-FINAL-AUDIT-V1-APPROVED-2026-09-19" as const;
export const POL_001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

type FrozenPolityQuestion = Readonly<{
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

type RawPolityQuestion = {
  questionId?: unknown;
  id?: unknown;
  qlId?: unknown;
  difficulty?: unknown;
  stem?: unknown;
  question?: unknown;
  options?: unknown;
  correctIndex?: unknown;
  canonicalAnswer?: unknown;
  answer?: unknown;
  explanation?: unknown;
  sourceIds?: unknown;
  sourceFactIds?: unknown;
  factIds?: unknown;
  runtimeRegistered?: unknown;
};

const generators = [
  ["POL-CP-001", generatePolCp001ReviewBatchV1],
  ["POL-CP-002", generatePolCp002ReviewBatchV2],
  ["POL-CP-003", generatePolCp003ReviewBatchV3],
  ["POL-CP-004", generatePolCp004ReviewBatchV3],
  ["POL-CP-005", generatePolCp005ReviewBatchV3],
  ["POL-CP-006", generatePolCp006ReviewBatchV3],
  ["POL-CP-007", generatePolCp007ReviewBatchV7],
  ["POL-CP-008", generatePolCp008ReviewBatchV7],
  ["POL-CP-009", generatePolCp009ReviewBatchV1],
  ["POL-CP-010", generatePolCp010ReviewBatchV1],
  ["POL-CP-011", generatePolCp011ReviewBatchV2],
  ["POL-CP-012", generatePolCp012ReviewBatchV3],
  ["POL-CP-013", generatePolCp013ReviewBatchV3],
  ["POL-CP-014", generatePolCp014ReviewBatchV3],
  ["POL-CP-015", generatePolCp015ReviewBatchV1],
  ["POL-CP-016", generatePolCp016ReviewBatchV2],
  ["POL-CP-017", generatePolCp017ReviewBatchV2],
  ["POL-CP-018", generatePolCp018ReviewBatchV1],
  ["POL-CP-019", generatePolCp019ReviewBatchV1],
  ["POL-CP-020", generatePolCp020ReviewBatchV1],
  ["POL-CP-021", generatePolCp021ReviewBatchV1],
  ["POL-CP-022", generatePolCp022ReviewBatchV2],
  ["POL-CP-023", generatePolCp023ReviewBatchV1],
  ["POL-CP-024", generatePolCp024ReviewBatchV1],
  ["POL-CP-025", generatePolCp025ReviewBatchV1],
  ["POL-CP-026", generatePolCp026ReviewBatchV3],
  ["POL-CP-027", generatePolCp027ReviewBatchV1],
] as const;

function materializeQuestion(cpId: string, value: unknown, index: number): FrozenPolityQuestion {
  const raw = value as RawPolityQuestion;
  if (raw.runtimeRegistered === true) {
    throw new Error(`${cpId} review row ${index + 1} was already runtime-registered before POL-001 integration`);
  }

  const questionId = String(raw.questionId ?? raw.id ?? "").trim();
  const qlId = String(raw.qlId ?? "").trim().toUpperCase();
  const difficulty = String(raw.difficulty ?? "") as FrozenPolityQuestion["difficulty"];
  const stem = String(raw.stem ?? raw.question ?? "").trim();
  const options = Array.isArray(raw.options) ? raw.options.map((option) => String(option)) : [];
  const correctIndex = Number.isInteger(raw.correctIndex) ? Number(raw.correctIndex) : -1;
  const canonicalAnswer = String(
    raw.canonicalAnswer ?? raw.answer ?? (correctIndex >= 0 ? options[correctIndex] : "") ?? "",
  ).trim();
  const explanation = String(raw.explanation ?? "").trim();
  const sourceIds = Array.isArray(raw.sourceIds) ? raw.sourceIds.map(String) : [];
  const sourceFactIds = Array.isArray(raw.sourceFactIds)
    ? raw.sourceFactIds.map(String)
    : Array.isArray(raw.factIds)
      ? raw.factIds.map(String)
      : [];

  if (!questionId) throw new Error(`${cpId} row ${index + 1}: missing question ID`);
  if (!/^POL-\d{3}-QL-\d{3}$/.test(qlId)) throw new Error(`${questionId}: invalid QL ID ${qlId}`);
  if (!["Easy", "Medium", "Hard"].includes(difficulty)) throw new Error(`${questionId}: invalid difficulty`);
  if (!stem || !explanation) throw new Error(`${questionId}: missing learner text`);
  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(`${questionId}: options must contain four unique values`);
  }
  if (correctIndex < 0 || correctIndex >= options.length || options[correctIndex] !== canonicalAnswer) {
    throw new Error(`${questionId}: answer/options mismatch`);
  }
  if (!sourceIds.length) throw new Error(`${questionId}: missing source IDs`);

  const edited = applyPolityFinalEditorialStemPass({
    questionId,
    qlId,
    difficulty,
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds,
    sourceFactIds,
  });

  return Object.freeze({
    questionId,
    cpId,
    qlId,
    difficulty,
    stem: edited.stem,
    options: Object.freeze([...options]),
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: Object.freeze([...sourceIds]),
    sourceFactIds: Object.freeze([...sourceFactIds]),
  });
}

export const POL_001_QUESTION_STUDIO_CORPUS_V1: readonly FrozenPolityQuestion[] = Object.freeze(
  generators.flatMap(([cpId, generate]) => {
    const batch = generate() as unknown[];
    if (!Array.isArray(batch) || !batch.length) throw new Error(`${cpId} has no approved review questions`);
    return batch.map((question, index) => materializeQuestion(cpId, question, index));
  }),
);

const cpIds = generators.map(([cpId]) => cpId);
const qlIds = [...new Set(POL_001_QUESTION_STUDIO_CORPUS_V1.map((question) => question.qlId))].sort();

if (cpIds.length !== 27 || new Set(cpIds).size !== 27) {
  throw new Error("POL-001 Question Studio registration requires 27 unique CPs");
}
if (POL_001_QUESTION_STUDIO_CORPUS_V1.length !== 2087) {
  throw new Error(
    `POL-001 Question Studio registration requires 2087 audited questions; found ${POL_001_QUESTION_STUDIO_CORPUS_V1.length}`,
  );
}
if (
  new Set(POL_001_QUESTION_STUDIO_CORPUS_V1.map((question) => question.questionId)).size !==
  POL_001_QUESTION_STUDIO_CORPUS_V1.length
) {
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

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compactCp = raw.match(/^POL-CP(\d{3})$/);
  return compactCp ? `POL-CP-${compactCp[1]}` : raw;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map(normalizeSelector)
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value as (typeof cpIds)[number]));
  const unknown = values.filter(
    (value) =>
      value !== POL_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value as (typeof cpIds)[number]),
  );

  if (unknown.length) throw new Error(`Unknown POL-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting POL-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting POL-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId
    ? POL_001_QUESTION_STUDIO_CORPUS_V1.find((question) => question.qlId === qlId)?.cpId
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
  label: "Static GK · Indian Polity · POL-CP-001–027 Final Audit",
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
    finalAuditApproved: true,
    chapterContentComplete: true,
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
    englishQuestionCount: POL_001_QUESTION_STUDIO_CORPUS_V1.length,
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
    values.some((value) =>
      value.startsWith("POL-CP-") ||
      /^POL-CP\d{3}$/.test(value) ||
      qlIds.includes(value)
    ) ||
    (subject === "static gk" && (topic === "indian polity" || topic === "polity") &&
      (!subtopic || subtopic === "complete chapter")) ||
    ((topic === "indian polity" || topic === "polity") &&
      (!subtopic || subtopic === "complete chapter"))
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
    const seed = request.seed?.trim() || "pol-001-question-studio-final-audit-v1";

    const candidates = POL_001_QUESTION_STUDIO_CORPUS_V1.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`POL-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(
        `POL-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`,
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
      finalAuditApproved: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      revisionPolicy: POL_001_REVISION_POLICY_V1,
      productionReleased: false,
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: POL_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        finalAuditApproved: true,
        chapterContentComplete: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        revisionPolicy: POL_001_REVISION_POLICY_V1,
        language,
        difficulty,
        cpId: cpId ?? null,
        qlId: qlId ?? null,
        seed,
        requestedCount: count,
        candidateCount: candidates.length,
        corpusQuestionCount: POL_001_QUESTION_STUDIO_CORPUS_V1.length,
        cpCount: cpIds.length,
        qlCount: qlIds.length,
      },
    };
  },
};
