import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import { GEO_MIN_001_OWNING_POOL_V1 } from "../../knowledge-v1/indian-geography/minerals-energy/geo-min-001-owning-pool-v1";
import { auditGeoMin001ChapterClosureV1 } from "../../knowledge-v1/indian-geography/minerals-energy/geo-min-001-cp013-mastery-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "GEO-MIN-001" as const;
export const GEO_MIN_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const GEO_MIN_001_CONTENT_AUTHORITY_VERSION_V1 = "GEO-MIN-001-CONTENT-CLOSED-V1" as const;
export const GEO_MIN_001_CHAPTER_CLOSE_AUTHORITY_ID_V1 = "GEO-MIN-001-CHAPTER-CLOSURE-V1" as const;
export const GEO_MIN_001_MASTERY_AUTHORITY_ID_V1 = "GEO-MIN-001-CP013-APPROVED-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

const closure = auditGeoMin001ChapterClosureV1();
if (!closure.valid) throw new Error("GEO-MIN-001 Question Studio registration blocked: " + closure.issues.join(" | "));

function cpIdForQuestion(questionId: string) {
  const match = questionId.match(/^GEO\-MIN\-001-CP(\d{3})-/);
  if (!match) throw new Error("Cannot derive GEO-MIN-001 CP from " + questionId);
  return "GEO-MIN-001-CP" + match[1];
}

export const GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1 = Object.freeze(
  GEO_MIN_001_OWNING_POOL_V1.map((question) => Object.freeze({ ...question, cpId: cpIdForQuestion(question.questionId) })),
);

if (GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.length !== 732) throw new Error("GEO-MIN-001 owning corpus must contain 732 questions");
const cpIds = Object.freeze([...new Set(GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.cpId))].sort());
const qlIds = Object.freeze([...new Set(GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.qlId))].sort());
if (cpIds.length !== 12) throw new Error("GEO-MIN-001 must expose 12 owning CPs");
if (qlIds.length !== 122) throw new Error("GEO-MIN-001 must expose 122 permanent semantic QLs");

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error("GEO-MIN-001 currently supports English only");
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("GEO-MIN-001 review batches require count between 1 and 50");
  return count;
}
function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("GEO-MIN-001 difficulty must be Easy, Medium, Hard, or Mixed");
}
function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((v) => String(v ?? "").trim().toUpperCase()).filter(Boolean);
}
function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((v) => qlIds.includes(v));
  const cpMatches = values.filter((v) => cpIds.includes(v));
  const unknown = values.filter((v) => v !== GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1 && !qlIds.includes(v) && !cpIds.includes(v));
  if (unknown.length) throw new Error("Unknown GEO-MIN-001 selector " + unknown[0]);
  if (new Set(qlMatches).size > 1) throw new Error("Conflicting GEO-MIN-001 QL selectors");
  if (new Set(cpMatches).size > 1) throw new Error("Conflicting GEO-MIN-001 CP selectors");
  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.find((q) => q.qlId === qlId)?.cpId : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) throw new Error("Conflicting GEO-MIN-001 CP/QL selectors");
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Geography",
  subtopic: "Minerals & Energy Resources of India",
  label: "Static GK · Indian Geography · Minerals & Energy · Closed",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: GEO_MIN_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [GEO_MIN_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: GEO_MIN_001_CONTENT_AUTHORITY_VERSION_V1,
    chapterCloseAuthorityId: GEO_MIN_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
    masteryAuthorityId: GEO_MIN_001_MASTERY_AUTHORITY_ID_V1,
    masteryPermanentQlOwner: false,
    authoringReviewApproved: true,
    reviewOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    qlCount: qlIds.length,
    cpCount: cpIds.length,
    englishQuestionCount: GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.length,
    exhaustiveMasterQuestionCount: 122,
  },
};

export function isGeoMin001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return selectorValues(request).some((v) => v.startsWith("GEO-MIN-001")) ||
    ((subject === "static gk" || !subject) && topic === "indian geography" && subtopic === "minerals & energy resources of india");
}

export const knowledgeV1GeoMin001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return [GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1) throw new Error("GEO-MIN-001 adapter cannot generate package " + packageId);
    if (request.runtimeMode && request.runtimeMode !== GEO_MIN_001_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error("GEO-MIN-001 only supports review-only runtime");
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "geo-min-001-question-studio-v1";
    const candidates = GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.filter((q) =>
      (!cpId || q.cpId === cpId) && (!qlId || q.qlId === qlId) && (difficulty === "Mixed" || q.difficulty === difficulty)
    );
    if (!candidates.length) throw new Error("GEO-MIN-001 selectors produced no questions");
    if (count > candidates.length) throw new Error("GEO-MIN-001 cannot fill requested count without repeats");
    const selected = deterministicShuffle(candidates, seed + ":" + (cpId ?? "ALL") + ":" + (qlId ?? "ALL") + ":" + difficulty).slice(0, count);
    const questions = selected.map((q) => ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      packageId: GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: q.qlId,
      qlId: q.qlId,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "Indian Geography",
      subtopic: "Minerals & Energy Resources of India",
      language,
      locale: "en-IN",
      stem: q.stem,
      text: q.stem,
      options: [...q.options],
      correctIndex: q.correctIndex,
      correct: q.correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      answer: q.canonicalAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      difficultyLabel: q.difficulty,
      sourceIds: [...q.sourceIds],
      sourceFactIds: [...q.sourceFactIds],
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: GEO_MIN_001_CONTENT_AUTHORITY_VERSION_V1,
      authoringReviewApproved: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      readOnly: true,
      productionReleased: false,
    }));
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: GEO_MIN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: "review-only",
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: GEO_MIN_001_CONTENT_AUTHORITY_VERSION_V1,
      chapterCloseAuthorityId: GEO_MIN_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
      masteryAuthorityId: GEO_MIN_001_MASTERY_AUTHORITY_ID_V1,
      language,
      requestedDifficulty: difficulty,
      qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
      cpSelection: cpId ?? "DETERMINISTIC_ACROSS_CLOSED_CPS",
      candidatePoolSize: candidates.length,
      seed,
      count,
    }};
  },
};
