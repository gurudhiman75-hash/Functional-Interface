import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import { GEO_MTP_001_OWNING_POOL_V1 } from "../../knowledge-v1/indian-geography/mountain-passes-peaks/geo-mtp-001-owning-pool-v1";
import { auditGeoMtp001ChapterClosureV1 } from "../../knowledge-v1/indian-geography/mountain-passes-peaks/geo-mtp-001-cp005-mastery-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { auditGeoReferenceLocalizationV1, localizeGeoReferenceQuestionV1 } from "../../knowledge-v1/indian-geography/geo-reference-localization-v1";

export const GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "GEO-MTP-001" as const;
export const GEO_MTP_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const GEO_MTP_001_CONTENT_AUTHORITY_VERSION_V1 = "GEO-MTP-001-CONTENT-CLOSED-V1" as const;
export const GEO_MTP_001_CHAPTER_CLOSE_AUTHORITY_ID_V1 = "GEO-MTP-001-CHAPTER-CLOSURE-V1" as const;
export const GEO_MTP_001_MASTERY_AUTHORITY_ID_V1 = "GEO-MTP-001-CP005-APPROVED-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en","hi","pa"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

const closure = auditGeoMtp001ChapterClosureV1();
if (!closure.valid) throw new Error("GEO-MTP-001 Question Studio registration blocked: " + closure.issues.join(" | "));

function cpIdForQuestion(questionId: string) {
  const match = questionId.match(/^GEO\-MTP\-001-CP(\d{3})-/);
  if (!match) throw new Error("Cannot derive GEO-MTP-001 CP from " + questionId);
  return "GEO-MTP-001-CP" + match[1];
}

export const GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1 = Object.freeze(
  GEO_MTP_001_OWNING_POOL_V1.map((question) => Object.freeze({ ...question, cpId: cpIdForQuestion(question.questionId) })),
);

if (GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.length !== 75) throw new Error("GEO-MTP-001 owning corpus must contain 75 questions");
const cpIds = Object.freeze([...new Set(GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.cpId))].sort());
const qlIds = Object.freeze([...new Set(GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.qlId))].sort());
if (cpIds.length !== 3) throw new Error("GEO-MTP-001 must expose 3 owning CPs");
if (qlIds.length !== 15) throw new Error("GEO-MTP-001 must expose 15 permanent semantic QLs");
const localizationAudit = auditGeoReferenceLocalizationV1(GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1);
if (!localizationAudit.valid) throw new Error("GEO-MTP-001 localization audit failed: " + localizationAudit.issues.join(" | "));

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("GEO-MTP-001 language is not supported");
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("GEO-MTP-001 review batches require count between 1 and 50");
  return count;
}
function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("GEO-MTP-001 difficulty must be Easy, Medium, Hard, or Mixed");
}
function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((v) => String(v ?? "").trim().toUpperCase()).filter(Boolean);
}
function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((v) => qlIds.includes(v));
  const cpMatches = values.filter((v) => cpIds.includes(v));
  const unknown = values.filter((v) => v !== GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1 && !qlIds.includes(v) && !cpIds.includes(v));
  if (unknown.length) throw new Error("Unknown GEO-MTP-001 selector " + unknown[0]);
  if (new Set(qlMatches).size > 1) throw new Error("Conflicting GEO-MTP-001 QL selectors");
  if (new Set(cpMatches).size > 1) throw new Error("Conflicting GEO-MTP-001 CP selectors");
  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.find((q) => q.qlId === qlId)?.cpId : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) throw new Error("Conflicting GEO-MTP-001 CP/QL selectors");
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const GEO_MTP_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Geography",
  subtopic: "Mountain Passes & Major Peaks of India",
  label: "Static GK · Indian Geography · Passes & Peaks · Closed",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: GEO_MTP_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [GEO_MTP_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: GEO_MTP_001_CONTENT_AUTHORITY_VERSION_V1,
    chapterCloseAuthorityId: GEO_MTP_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
    masteryAuthorityId: GEO_MTP_001_MASTERY_AUTHORITY_ID_V1,
    masteryPermanentQlOwner: false,
    authoringReviewApproved: true,
    reviewOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    qlCount: qlIds.length,
    cpCount: cpIds.length,
    englishQuestionCount: GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.length,
    localizedVersionCount: GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.length * 3,
    localizationLanguages: ["en","hi","pa"],
    localizationStatus: "REVIEW_REQUIRED",
    exhaustiveMasterQuestionCount: 15,
  },
};

export function isGeoMtp001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return selectorValues(request).some((v) => v.startsWith("GEO-MTP-001")) ||
    ((subject === "static gk" || !subject) && topic === "indian geography" && subtopic === "mountain passes & major peaks of india");
}

export const knowledgeV1GeoMtp001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return [GEO_MTP_001_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1) throw new Error("GEO-MTP-001 adapter cannot generate package " + packageId);
    if (request.runtimeMode && request.runtimeMode !== GEO_MTP_001_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error("GEO-MTP-001 only supports review-only runtime");
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "geo-mtp-001-question-studio-v1";
    const candidates = GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1.filter((q) =>
      (!cpId || q.cpId === cpId) && (!qlId || q.qlId === qlId) && (difficulty === "Mixed" || q.difficulty === difficulty)
    );
    if (!candidates.length) throw new Error("GEO-MTP-001 selectors produced no questions");
    if (count > candidates.length) throw new Error("GEO-MTP-001 cannot fill requested count without repeats");
    const selected = deterministicShuffle(candidates, seed + ":" + (cpId ?? "ALL") + ":" + (qlId ?? "ALL") + ":" + difficulty).slice(0, count);
    const locales = { en:"en-IN", hi:"hi-IN", pa:"pa-IN" } as const;
    const questions = selected.map((q) => {
      const localized = localizeGeoReferenceQuestionV1(q, language);
      return ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      packageId: GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: q.qlId,
      qlId: q.qlId,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "Indian Geography",
      subtopic: "Mountain Passes & Major Peaks of India",
      language,
      locale: locales[language],
      stem: localized.stem,
      text: localized.stem,
      options: [...localized.options],
      correctIndex: q.correctIndex,
      correct: q.correctIndex,
      canonicalAnswer: localized.canonicalAnswer,
      answer: localized.canonicalAnswer,
      explanation: localized.explanation,
      difficulty: q.difficulty,
      difficultyLabel: q.difficulty,
      sourceIds: [...q.sourceIds],
      sourceFactIds: [...q.sourceFactIds],
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: GEO_MTP_001_CONTENT_AUTHORITY_VERSION_V1,
      authoringReviewApproved: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      readOnly: true,
      productionReleased: false,
      sourceQuestionId: q.questionId,
      localizationStatus: language === "en" ? "SOURCE_APPROVED" : "REVIEW_REQUIRED",
      revisionPolicy: "REVISE_CANONICAL_AND_RELOCALIZE_ALL_LANGUAGES",
    });});
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: GEO_MTP_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: "review-only",
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: GEO_MTP_001_CONTENT_AUTHORITY_VERSION_V1,
      chapterCloseAuthorityId: GEO_MTP_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
      masteryAuthorityId: GEO_MTP_001_MASTERY_AUTHORITY_ID_V1,
      language,
      locale: ({en:"en-IN",hi:"hi-IN",pa:"pa-IN"} as const)[language],
      localizationStatus: language === "en" ? "SOURCE_APPROVED" : "REVIEW_REQUIRED",
      requestedDifficulty: difficulty,
      qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
      cpSelection: cpId ?? "DETERMINISTIC_ACROSS_CLOSED_CPS",
      candidatePoolSize: candidates.length,
      seed,
      count,
    }};
  },
};
